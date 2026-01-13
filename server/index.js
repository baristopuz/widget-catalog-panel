import express from 'express'
import cors from 'cors'
import multer from 'multer'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3002

// Storage klasörü
const STORAGE_DIR = path.join(__dirname, '../storage')
const WIDGETS_DIR = path.join(STORAGE_DIR, 'widgets')
const IMAGES_DIR = path.join(STORAGE_DIR, 'images')

// CORS ayarları - Production ve Development
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL, // Railway'den frontend URL
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
].filter(Boolean)

// Tüm Vercel preview URL'lerini de kabul et
const corsOptions = {
  origin: function (origin, callback) {
    // origin undefined ise (Postman gibi) veya allowed origins'de ise izin ver
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true)
    } else {
      callback(null, true) // Development için tüm origin'lere izin ver
    }
  },
  credentials: true
}

// Middleware
app.use(cors(corsOptions))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use('/images', express.static(IMAGES_DIR))

// Storage klasörlerini oluştur
async function initStorage() {
  try {
    await fs.mkdir(STORAGE_DIR, { recursive: true })
    await fs.mkdir(WIDGETS_DIR, { recursive: true })
    await fs.mkdir(IMAGES_DIR, { recursive: true })
    console.log('✅ Storage klasörleri hazır')
  } catch (error) {
    console.error('❌ Storage oluşturma hatası:', error)
  }
}

// Tüm widget'ları getir
app.get('/api/widgets', async (req, res) => {
  try {
    const files = await fs.readdir(WIDGETS_DIR)
    const widgets = []

    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await fs.readFile(path.join(WIDGETS_DIR, file), 'utf-8')
        widgets.push(JSON.parse(content))
      }
    }

    // Tarihe göre sırala (en yeni üstte)
    widgets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    res.json(widgets)
  } catch (error) {
    console.error('Widget listesi hatası:', error)
    res.status(500).json({ error: 'Widget listesi alınamadı' })
  }
})

// Tek bir widget getir
app.get('/api/widgets/:id', async (req, res) => {
  try {
    const { id } = req.params
    const widgetPath = path.join(WIDGETS_DIR, `${id}.json`)
    const content = await fs.readFile(widgetPath, 'utf-8')
    res.json(JSON.parse(content))
  } catch (error) {
    console.error('Widget getirme hatası:', error)
    res.status(404).json({ error: 'Widget bulunamadı' })
  }
})

// Yeni widget oluştur
app.post('/api/widgets', async (req, res) => {
  try {
    const { name, description, widgetCode, tags, html, css, preJs, postJs, images } = req.body

    const widget = {
      id: Date.now().toString(),
      name,
      description: description || '',
      widgetCode: widgetCode || '',
      tags: tags || [],
      html: html || '',
      css: css || '',
      preJs: preJs || '',
      postJs: postJs || '',
      imageCount: 0,
      createdAt: new Date().toISOString()
    }

    // Widget'ı kaydet
    const widgetPath = path.join(WIDGETS_DIR, `${widget.id}.json`)
    await fs.writeFile(widgetPath, JSON.stringify(widget, null, 2))

    // Görselleri kaydet (çoklu)
    if (images && Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await saveImage(widget.id, images[i], i)
      }
      widget.imageCount = images.length
      // Widget'ı tekrar kaydet (imageCount ile)
      await fs.writeFile(widgetPath, JSON.stringify(widget, null, 2))
    }

    res.json(widget)
  } catch (error) {
    console.error('Widget oluşturma hatası:', error)
    res.status(500).json({ error: 'Widget oluşturulamadı' })
  }
})

// Widget güncelle
app.put('/api/widgets/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, widgetCode, tags, html, css, preJs, postJs, images } = req.body

    const widgetPath = path.join(WIDGETS_DIR, `${id}.json`)
    
    // Mevcut widget'ı oku
    const content = await fs.readFile(widgetPath, 'utf-8')
    const existingWidget = JSON.parse(content)

    // Güncelle
    const updatedWidget = {
      ...existingWidget,
      name: name || existingWidget.name,
      description: description !== undefined ? description : existingWidget.description,
      widgetCode: widgetCode !== undefined ? widgetCode : existingWidget.widgetCode,
      tags: tags !== undefined ? tags : existingWidget.tags,
      html: html !== undefined ? html : existingWidget.html,
      css: css !== undefined ? css : existingWidget.css,
      preJs: preJs !== undefined ? preJs : existingWidget.preJs,
      postJs: postJs !== undefined ? postJs : existingWidget.postJs,
      updatedAt: new Date().toISOString()
    }

    await fs.writeFile(widgetPath, JSON.stringify(updatedWidget, null, 2))

    // Görseller varsa kaydet (çoklu)
    if (images && Array.isArray(images) && images.length > 0) {
      // Eski görselleri sil
      await deleteAllImages(id)
      // Yeni görselleri kaydet
      for (let i = 0; i < images.length; i++) {
        await saveImage(id, images[i], i)
      }
      updatedWidget.imageCount = images.length
      await fs.writeFile(widgetPath, JSON.stringify(updatedWidget, null, 2))
    }

    res.json(updatedWidget)
  } catch (error) {
    console.error('Widget güncelleme hatası:', error)
    res.status(500).json({ error: 'Widget güncellenemedi' })
  }
})

// Widget sil
app.delete('/api/widgets/:id', async (req, res) => {
  try {
    const { id } = req.params
    const widgetPath = path.join(WIDGETS_DIR, `${id}.json`)
    
    // Widget dosyasını sil
    await fs.unlink(widgetPath)

    // Tüm görselleri sil
    await deleteAllImages(id)

    res.json({ success: true })
  } catch (error) {
    console.error('Widget silme hatası:', error)
    res.status(500).json({ error: 'Widget silinemedi' })
  }
})

// Görsel kaydetme yardımcı fonksiyonu (çoklu görsel desteği)
async function saveImage(widgetId, base64Image, index = 0) {
  try {
    // Base64'ten veri ve uzantıyı al
    const matches = base64Image.match(/^data:image\/(\w+);base64,(.+)$/)
    if (!matches) {
      throw new Error('Geçersiz base64 formatı')
    }

    const extension = matches[1]
    const imageData = matches[2]
    const imagePath = path.join(IMAGES_DIR, `${widgetId}_${index}.${extension}`)

    // Base64'ü dosyaya yaz
    await fs.writeFile(imagePath, Buffer.from(imageData, 'base64'))
    return `${widgetId}_${index}.${extension}`
  } catch (error) {
    console.error('Görsel kaydetme hatası:', error)
    throw error
  }
}

// Tüm görselleri sil (yardımcı fonksiyon)
async function deleteAllImages(widgetId) {
  const files = await fs.readdir(IMAGES_DIR)
  const widgetImages = files.filter(file => file.startsWith(`${widgetId}_`))
  
  for (const file of widgetImages) {
    try {
      await fs.unlink(path.join(IMAGES_DIR, file))
    } catch (error) {
      console.error('Görsel silme hatası:', error)
    }
  }
}

// Widget görseli getir (tek - backward compatibility)
app.get('/api/widgets/:id/image', async (req, res) => {
  try {
    const { id } = req.params
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']

    // İlk görseli (index 0) döndür
    for (const ext of imageExtensions) {
      const imagePath = path.join(IMAGES_DIR, `${id}_0${ext}`)
      try {
        await fs.access(imagePath)
        const imageData = await fs.readFile(imagePath)
        const mimeType = `image/${ext.slice(1)}`
        res.type(mimeType).send(imageData)
        return
      } catch (error) {
        // Bu uzantıda dosya yok, devam et
      }
    }

    res.status(404).json({ error: 'Görsel bulunamadı' })
  } catch (error) {
    console.error('Görsel getirme hatası:', error)
    res.status(500).json({ error: 'Görsel alınamadı' })
  }
})

// Widget'ın tüm görsellerini listele
app.get('/api/widgets/:id/images', async (req, res) => {
  try {
    const { id } = req.params
    
    // Images klasörünü kontrol et
    try {
      await fs.access(IMAGES_DIR)
    } catch (error) {
      // Klasör yoksa boş liste döndür
      return res.json({ images: [], count: 0 })
    }
    
    const files = await fs.readdir(IMAGES_DIR)
    const widgetImages = files.filter(file => file.startsWith(`${id}_`))
    
    const imageUrls = widgetImages.map(file => `/api/images/${file}`)
    res.json({ images: imageUrls, count: imageUrls.length })
  } catch (error) {
    console.error('Görsel listesi hatası:', error)
    // Hata olsa bile boş liste döndür
    res.json({ images: [], count: 0 })
  }
})

// Görsel dosyasını serve et
app.get('/api/images/:filename', async (req, res) => {
  try {
    const { filename } = req.params
    const imagePath = path.join(IMAGES_DIR, filename)
    
    await fs.access(imagePath)
    const imageData = await fs.readFile(imagePath)
    
    // Extension'a göre mime type belirle
    const ext = path.extname(filename).slice(1)
    const mimeType = `image/${ext}`
    
    res.type(mimeType).send(imageData)
  } catch (error) {
    console.error('Görsel getirme hatası:', error)
    res.status(404).json({ error: 'Görsel bulunamadı' })
  }
})

// Sunucuyu başlat
async function start() {
  await initStorage()
  app.listen(PORT, () => {
    console.log(`🚀 Backend sunucu çalışıyor: http://localhost:${PORT}`)
    console.log(`📁 Storage klasörü: ${STORAGE_DIR}`)
  })
}

start()


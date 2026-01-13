// File-based storage servisi (Backend API ile)
// Production'da VITE_API_URL environment variable kullanılır
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api'

export const storageService = {
  // Tüm widget'ları getir
  async getWidgets() {
    try {
      const response = await fetch(`${API_BASE_URL}/widgets`)
      if (!response.ok) throw new Error('Widget listesi alınamadı')
      return await response.json()
    } catch (error) {
      console.error('Widget verisi okunamadı:', error)
      return []
    }
  },

  // Belirli bir widget getir
  async getWidget(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/widgets/${id}`)
      if (!response.ok) throw new Error('Widget bulunamadı')
      return await response.json()
    } catch (error) {
      console.error('Widget getirme hatası:', error)
      return null
    }
  },

  // Yeni widget kaydet
  async saveWidget(widget) {
    try {
      const response = await fetch(`${API_BASE_URL}/widgets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(widget)
      })
      if (!response.ok) throw new Error('Widget kaydedilemedi')
      return await response.json()
    } catch (error) {
      console.error('Widget kaydetme hatası:', error)
      return null
    }
  },

  // Widget güncelle
  async updateWidget(id, updatedWidget) {
    try {
      const response = await fetch(`${API_BASE_URL}/widgets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedWidget)
      })
      if (!response.ok) throw new Error('Widget güncellenemedi')
      return await response.json()
    } catch (error) {
      console.error('Widget güncelleme hatası:', error)
      return null
    }
  },

  // Widget sil
  async deleteWidget(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/widgets/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Widget silinemedi')
      return true
    } catch (error) {
      console.error('Widget silme hatası:', error)
      return false
    }
  },

  // Görsel URL'ini getir
  getImageUrl(widgetId) {
    return `${API_BASE_URL}/widgets/${widgetId}/image`
  },

  // Görseli getir (base64 olarak değil, URL olarak kullan)
  getImage(widgetId) {
    return this.getImageUrl(widgetId)
  },

  // Widget'ın tüm görsellerini getir
  async getImages(widgetId) {
    try {
      const response = await fetch(`${API_BASE_URL}/widgets/${widgetId}/images`)
      if (!response.ok) {
        // 404 ise görseller yok demektir
        if (response.status === 404) {
          return { images: [], count: 0 }
        }
        throw new Error('Görsel listesi alınamadı')
      }
      const data = await response.json()
      return data || { images: [], count: 0 }
    } catch (error) {
      console.error('Görsel listesi hatası:', error)
      return { images: [], count: 0 }
    }
  },

  // Görsel URL'ini tam path ile getir
  getFullImageUrl(filename) {
    return `http://localhost:3002${filename}`
  }
}

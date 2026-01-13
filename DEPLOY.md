# 🚀 Deployment Rehberi

## Frontend (Vercel) + Backend (Railway)

---

## 📦 1. Backend'i Railway'e Deploy Et

### Adım 1: Railway CLI Kur
```bash
npm install -g @railway/cli
```

### Adım 2: Railway'e Login Ol
```bash
railway login
```

### Adım 3: Proje Oluştur
```bash
railway init
```

### Adım 4: Deploy Et
```bash
railway up
```

### Adım 5: Domain Al
Railway dashboard'da:
1. Settings → Networking
2. "Generate Domain" butonuna tık
3. URL'i kopyala (örn: `https://your-app.up.railway.app`)

### Adım 6: Environment Variables (Opsiyonel)
Railway dashboard'da:
```
FRONTEND_URL=https://your-vercel-app.vercel.app
PORT=3002
```

**✅ Backend Hazır!**

---

## 🎨 2. Frontend'i Vercel'e Deploy Et

### Adım 1: Environment Variable Ayarla

Vercel dashboard'da veya CLI ile:
```bash
vercel env add VITE_API_URL
```

Değer:
```
https://your-app.up.railway.app/api
```

### Adım 2: Deploy Et
```bash
vercel --prod
```

veya GitHub ile otomatik deploy:
1. GitHub'a pushla
2. Vercel'de "Import Project"
3. Environment Variables ekle:
   - Key: `VITE_API_URL`
   - Value: `https://your-app.up.railway.app/api`
4. Deploy!

**✅ Frontend Hazır!**

---

## 🔧 Local Development

```bash
# Her şey local'de çalışır
npm run dev

# Backend: http://localhost:3002
# Frontend: http://localhost:3000
```

---

## 📋 Deployment Checklist

### Backend (Railway)
- [x] Railway CLI kuruldu
- [x] `railway login`
- [x] `railway init`
- [x] `railway up`
- [ ] Railway domain'i kopyalandı
- [ ] CORS ayarları kontrol edildi

### Frontend (Vercel)
- [x] Vercel hesabı oluşturuldu
- [ ] `VITE_API_URL` environment variable eklendi
- [ ] Railway URL doğru girildi
- [ ] `vercel --prod` çalıştırıldı
- [ ] Production URL test edildi

---

## 🔗 Bağlantıları Test Et

### 1. Backend Health Check
```bash
curl https://your-app.up.railway.app/api/widgets
```

Beklenen: Boş liste veya widget'lar
```json
[]
```

### 2. Frontend
Tarayıcıda aç:
```
https://your-vercel-app.vercel.app
```

### 3. Widget Oluştur
Frontend'de yeni widget oluştur ve çalışıp çalışmadığını test et.

---

## ⚙️ Environment Variables

### Backend (Railway)
```bash
PORT=3002  # Otomatik
FRONTEND_URL=https://your-vercel-app.vercel.app  # Opsiyonel
```

### Frontend (Vercel)
```bash
VITE_API_URL=https://your-app.up.railway.app/api  # Zorunlu
```

---

## 🐛 Sorun Giderme

### CORS Hatası
**Sorun:** Frontend'den API'ye istek gitmiyor.

**Çözüm:**
1. Railway'de `FRONTEND_URL` ekle
2. Vercel URL'i doğru gir
3. Backend'i yeniden deploy et: `railway up`

### Widget Yüklenmiyor
**Sorun:** API'ye bağlanmıyor.

**Kontroller:**
1. Vercel'de `VITE_API_URL` doğru mu?
2. Railway URL'i çalışıyor mu?
3. Browser console'da hata var mı?

**Test:**
```bash
# Railway backend'ini test et
curl https://your-app.up.railway.app/api/widgets
```

### Railway Storage Silinmiş
**Sorun:** Storage klasörü boşalmış.

**Sebep:** Railway container restart olunca ephemeral storage temizlenir.

**Çözüm:** Railway Volumes kullan (ücretli) veya database'e geç.

**Geçici Çözüm:** Data önemli değilse, yeniden widget oluştur.

---

## 💰 Maliyet

| Platform | Ücretsiz Plan | Yeterli mi? |
|----------|---------------|-------------|
| **Railway** | $5 kredi/ay | ✅ Yeterli |
| **Vercel** | Hobby (ücretsiz) | ✅ Mükemmel |
| **Toplam** | $0-5/ay | ✅ İyi |

---

## 🔄 Güncelleme

### Backend Güncelle
```bash
# Kod değişiklikleri yap
git add .
git commit -m "Update backend"
railway up
```

### Frontend Güncelle
```bash
# Kod değişiklikleri yap
git add .
git commit -m "Update frontend"
vercel --prod
```

veya GitHub'a pushlarsan otomatik deploy olur.

---

## 📱 Hızlı Komutlar

```bash
# Backend deploy
railway up

# Frontend deploy
vercel --prod

# Backend loglarını gör
railway logs

# Frontend loglarını gör
vercel logs

# Railway dashboard aç
railway open

# Vercel dashboard aç
vercel inspect
```

---

## 🎯 Sonuç

**Backend URL:** `https://your-app.up.railway.app`
**Frontend URL:** `https://your-vercel-app.vercel.app`

**Widget'larını yönetmeye başla!** 🎉

---

## 📞 Destek

Sorun mu yaşıyorsun?
1. CORS ayarlarını kontrol et
2. Environment variables'ı kontrol et
3. Railway/Vercel loglarına bak
4. Browser console'u kontrol et

**Not:** Local'de her şey çalışıyorsa, sorun deployment ayarlarındadır.


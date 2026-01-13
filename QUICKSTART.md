# ⚡ Hızlı Başlangıç

## 🎯 Railway + Vercel Deployment

### 1️⃣ Backend (Railway) - 5 dakika

```bash
# Railway CLI kur
npm install -g @railway/cli

# Login ol
railway login

# Proje oluştur ve deploy et
railway init
railway up
```

**Railway domain'i kopyala:**
- Railway dashboard → Settings → Networking → Generate Domain
- Örnek: `https://your-app.up.railway.app`

---

### 2️⃣ Frontend (Vercel) - 5 dakika

**Seçenek A: GitHub ile (Önerilen)**
1. Kodu GitHub'a pushla
2. [vercel.com](https://vercel.com) → Import Project
3. Environment Variable ekle:
   - Key: `VITE_API_URL`
   - Value: `https://your-app.up.railway.app/api`
4. Deploy!

**Seçenek B: CLI ile**
```bash
# Vercel CLI kur (ilk kez)
npm i -g vercel

# Deploy et
vercel

# Environment variable ekle
vercel env add VITE_API_URL
# Value: https://your-app.up.railway.app/api

# Production'a çık
vercel --prod
```

---

### ✅ Test Et

**Backend:**
```bash
curl https://your-app.up.railway.app/api/widgets
```

**Frontend:**
Tarayıcıda aç: `https://your-vercel-app.vercel.app`

---

## 🏠 Local Development

```bash
npm run dev
```

- Backend: http://localhost:3002
- Frontend: http://localhost:3000

---

## 📝 Önemli Notlar

1. **Railway URL'i** doğru kopyaladın mı?
2. **Vercel'de** `VITE_API_URL` ekledin mi?
3. `/api` eklemeyi unutma!

---

## 🐛 Sorun mu var?

1. Railway loglarını kontrol et: `railway logs`
2. Vercel loglarını kontrol et: `vercel logs`
3. Browser console'u aç (F12)
4. CORS hatası? → Backend'i redeploy et

---

## 🎉 Tamamlandı!

Artık widget'larını yönetebilirsin!

Detaylı bilgi: [DEPLOY.md](DEPLOY.md)


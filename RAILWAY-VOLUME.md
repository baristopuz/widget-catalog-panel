# 📦 Railway Volume Storage Kurulumu

## Railway'de Persistent Storage Aktif Et

### 1. Railway Dashboard'a Git
```bash
railway open
```

### 2. Volume Oluştur

1. **Sol menüden** servisini seç (file-based-widget-panel)
2. **Settings** tab'ına git
3. **Volumes** bölümünü bul (veya **Data** sekmesine tıkla)
4. **"New Volume"** butonuna tıkla

### 3. Volume Ayarları

```
Volume Name: storage
Mount Path: /app/storage
```

**Önemli:** Mount path `/app/storage` olmalı!

### 4. Redeploy

Volume ekledikten sonra:
```bash
railway up --detach
```

veya Railway dashboard'da otomatik restart olacak.

---

## ✅ Test Et

Volume aktif olduktan sonra:

1. **Widget oluştur ve görsel ekle**
   ```
   https://your-vercel-app.vercel.app
   ```

2. **Görselin Railway'de olduğunu kontrol et**
   ```
   https://your-app.railway.app/api/widgets/ID/image
   ```

3. **Railway'i restart et**
   ```bash
   railway restart
   ```

4. **Görsel hala orada mı kontrol et**
   - Eğer görsel hala varsa ✅ Volume çalışıyor!
   - Eğer görsel yoksa ❌ Volume mount path yanlış

---

## 🔧 Doğru Mount Path

Backend kodunda:
```javascript
// server/index.js
const STORAGE_DIR = path.join(__dirname, '../storage')
```

Railway Volume:
```
Mount Path: /app/storage
```

Bu ikisi eşleşmeli!

---

## 📊 Kapasite

- **Ücretsiz:** 0.5 GB
- **Her görsel:** ~100KB - 2MB
- **Tahmini:** ~250-5000 görsel

0.5 GB çoğu proje için yeterli!

---

## ⚠️ Önemli Notlar

1. **Volume oluşturmadan önce** eklediğin görseller kaybolur
2. **Volume oluşturduktan sonra** eklenen görseller kalıcı olur
3. **Restart olsa bile** görseller korunur
4. **Her environment için** ayrı volume gerekir (production vs staging)

---

## 🚀 Hızlı Adımlar

```bash
# 1. Dashboard aç
railway open

# 2. Settings → Volumes → New Volume
# Name: storage
# Mount Path: /app/storage

# 3. Save & Redeploy

# 4. Test et!
```

---

## 🐛 Sorun Giderme

### Volume çalışmıyor?

**Kontrol 1:** Mount path doğru mu?
```
/app/storage  ✅
/storage      ❌
./storage     ❌
```

**Kontrol 2:** Railway loglarını kontrol et
```bash
railway logs
```

Şu satırı ara:
```
✅ Storage klasörleri hazır
```

**Kontrol 3:** Volume mount edildi mi?
Railway dashboard'da Volumes bölümünde "Mounted" yazıyor olmalı.

---

## 💡 Test Senaryosu

1. Widget oluştur + görsel ekle
2. Görselin URL'ini kopyala
3. Railway'i restart et: `railway restart`
4. Aynı URL'i tarayıcıda aç
5. Görsel hala açılıyor mu? ✅ Volume çalışıyor!

---

## 🎯 Sonuç

Volume aktif olduktan sonra:
- ✅ Görseller kalıcı
- ✅ Restart sonrası korunur
- ✅ 0.5 GB ücretsiz
- ✅ Production'a hazır!

Railway Volume = Google Drive gibi persistent disk! 💾


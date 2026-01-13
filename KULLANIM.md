# 🎯 Hızlı Başlangıç Rehberi

## Projeyi Çalıştırma

```bash
npm run dev
```

Bu komut hem backend (port 3001) hem de frontend (port 3000) sunucularını başlatır.

Tarayıcınızda **http://localhost:3000** adresine gidin.

> 💡 İlk çalıştırmada `storage/` klasörü otomatik oluşturulur.

---

## 🎨 Widget Nasıl Oluşturulur?

### Adım 1: Yeni Widget Butonuna Tıkla
Ana sayfada sağ üstteki **"Yeni Widget Oluştur"** butonuna bas.

### Adım 2: Bilgileri Doldur

#### 1️⃣ Widget Adı
Widget'ına istediğin ismi ver (örn: "Hoş Geldin Kartı", "İletişim Formu")

#### 2️⃣ Görsel Yükle
- Görselin üzerine tıkla
- Bilgisayarından bir resim seç
- Max 5MB boyutunda olmalı

#### 3️⃣ HTML Kodu Yaz
```html
<div class="my-widget">
  <h1>Merhaba Dünya!</h1>
  <p>Bu benim ilk widget'ım</p>
</div>
```

#### 4️⃣ CSS Kodu Yaz
```css
.my-widget {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px;
  border-radius: 16px;
  color: white;
  text-align: center;
}

.my-widget h1 {
  font-size: 32px;
  margin-bottom: 16px;
}
```

#### 5️⃣ PreJS (Opsiyonel)
Sayfa yüklenmeden ÖNCE çalışacak JavaScript kodu:
```javascript
console.log('Widget yükleniyor...');
// API çağrıları, veri hazırlama vs.
```

#### 6️⃣ PostJS (Opsiyonel)
Sayfa yüklendikten SONRA çalışacak JavaScript kodu:
```javascript
console.log('Widget hazır!');
// Event listener'lar, animasyonlar vs.
```

### Adım 3: Kaydet
**"Kaydet"** butonuna bas. Widget'ın listeye eklenecek!

---

## 🔍 Widget'ları Görüntüleme

### Ana Sayfada
- Tüm widget'lar 4'lü grid halinde görünür
- Her kartta görsel, isim ve oluşturma tarihi var
- 3 aksiyon butonu var:
  - 👁️ **Görüntüle**: Detay sayfasına git
  - ✏️ **Düzenle**: Widget'ı düzenle
  - 🗑️ **Sil**: Widget'ı sil

### Detay Sayfasında
Widget kartına tıkladığında:
- Büyük görsel
- HTML kodu
- CSS kodu
- PreJS kodu
- PostJS kodu
- Oluşturma/güncelleme tarihleri

---

## 📝 Örnek Widget Şablonları

### 1. Basit Bilgi Kartı
```html
<!-- HTML -->
<div class="info-card">
  <h2>Başlık</h2>
  <p>Açıklama metni buraya</p>
</div>
```

```css
/* CSS */
.info-card {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

### 2. Tıklanabilir Buton
```html
<!-- HTML -->
<button id="myButton" class="action-btn">
  Tıkla Bana!
</button>
```

```css
/* CSS */
.action-btn {
  background: #1890ff;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
}

.action-btn:hover {
  background: #40a9ff;
  transform: translateY(-2px);
}
```

```javascript
// PostJS
document.getElementById('myButton').addEventListener('click', () => {
  alert('Butona tıkladın!');
});
```

### 3. Animasyonlu Kart
```html
<!-- HTML -->
<div class="animated-card">
  <div class="card-content">
    <h3>Animasyonlu Kart</h3>
    <p>Hover yap ve gör!</p>
  </div>
</div>
```

```css
/* CSS */
.animated-card {
  width: 300px;
  height: 200px;
  background: linear-gradient(45deg, #ff6b6b, #feca57);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.5s, box-shadow 0.5s;
}

.animated-card:hover {
  transform: rotateY(10deg) rotateX(10deg);
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}

.card-content {
  text-align: center;
  color: white;
}
```

---

## 💡 İpuçları

### ✅ Yapılması Gerekenler
- Widget isimlerini anlamlı tut
- Görselleri optimize et (küçük boyut)
- CSS class'larına benzersiz isimler ver
- Kodunu düzenli ve okunaklı yaz

### ❌ Yapılmaması Gerekenler
- Çok büyük görseller yükleme (5MB limit var)
- Global CSS class'ları kullanma (çakışabilir)
- Karmaşık JavaScript yazmaya başlarken test etmeyi unutma

---

## 🐛 Sorun Giderme

### Widget Görünmüyor?
1. Backend sunucusunun çalıştığından emin ol (terminal'de kontrol et)
2. Tarayıcını yenile (F5)
3. Console'u aç (F12) ve hata var mı kontrol et
4. `storage/widgets/` klasörünü kontrol et, JSON dosyalar var mı?

### Görsel Yüklenmiyor?
- Dosya boyutunu kontrol et (max 5MB)
- Dosya formatını kontrol et (jpg, png, gif, webp)

### Kod Çalışmıyor?
- Console'da JavaScript hataları var mı bak
- Syntax hatası olabilir, editörde kontrol et

---

## 📞 Destek

Bir sorun mu yaşıyorsun? 
- README.md dosyasını oku
- Console loglarını kontrol et
- Kodunu gözden geçir

---

**Keyifli kodlamalar! 🚀**


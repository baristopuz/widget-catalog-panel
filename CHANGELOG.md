# Değişiklik Günlüğü

## Son Güncellemeler (2026-01-13)

### 📋 Clipboard ile Görsel Yapıştırma

Artık ekran görüntüsü alıp direkt olarak widget'a ekleyebilirsiniz!

**Nasıl Kullanılır:**
1. Herhangi bir görsel kopyalayın (Ctrl+C / Cmd+C)
   - Ekran görüntüsü al (PrtScn, Win+Shift+S, Cmd+Shift+4)
   - Tarayıcıdan görsel kopyala
   - Herhangi bir uygulamadan görsel kopyala
2. Widget oluşturma/düzenleme modalını aç
3. Görsel upload alanında **Ctrl+V / Cmd+V** ile yapıştır
4. Görsel anında eklenir! 🎉

**Özellikler:**
- ✅ Tüm clipboard image formatları desteklenir
- ✅ Otomatik boyut kontrolü (max 5MB)
- ✅ Otomatik limit kontrolü (max 10 görsel)
- ✅ Focus ile aktif alan gösterimi
- ✅ Başarı bildirimi

**Kullanım Senaryoları:**
- 📸 Ekran görüntülerini direkt yapıştır
- 🎨 Figma'dan tasarım kopyala
- 🖼️ Web'den görsel kopyala
- 📱 Telegram/Slack'ten görsel yapıştır

**Teknik:**
```javascript
// Paste event handler
@paste="handlePaste"
// Clipboard items kontrolü
const items = event.clipboardData?.items
// Image type kontrolü
if (item.type.indexOf('image') !== -1)
```

---

### 🏷️ Etiket Sistemi ve Widget Özel Kod

Güçlü bir etiketleme ve kategorize sistemi eklendi!

**Yeni Özellikler:**

#### 1. Widget Özel Kod
- Her widget'a benzersiz kod atayabilirsiniz
- Örnek: `WIDGET_001`, `POPUP_MOBILE`, `BANNER_HP`
- Kartlarda mavi kod badge'i olarak görünür
- Arama ile kod üzerinden bulabilirsiniz

#### 2. Etiket Sistemi
8 farklı renkli etiket ile widget'larınızı kategorize edin:

| Etiket | Renk | Hex |
|--------|------|-----|
| 🔵 Popup | Mavi | #1890ff |
| 🟢 Sticky Popup | Yeşil | #52c41a |
| 🟠 Reco | Turuncu | #fa8c16 |
| 🟣 Banner | Mor | #722ed1 |
| 🔴 Slider | Pembe | #eb2f96 |
| 🔷 Form | Cyan | #13c2c2 |
| 🟡 Notification | Altın | #faad14 |
| 🔵 Modal | Koyu Mavi | #2f54eb |

#### 3. Etiket Filtreleme
- Arama kutusunun yanında etiket filtresi
- Birden fazla etiket seçebilirsiniz
- Widget'lar seçilen etiketlere göre filtrelenir
- Real-time filtreleme

#### 4. Görsel İyileştirmeler
- Kartlarda renkli etiket badge'leri
- Widget özel kod badge'i
- Detay sayfasında düzenli bilgi gösterimi
- Ant Design Tag component kullanımı

**Kullanım:**
```javascript
// Widget oluştur/düzenle
{
  widgetCode: "WIDGET_001",
  tags: ["popup", "reco"]
}

// Filtrele
selectedTags = ["popup", "banner"]
// Sadece popup veya banner etiketli widget'lar gösterilir
```

**Teknik Detaylar:**
- `src/constants/tags.js` - Etiket tanımları
- Renk kodları hex formatında
- Select component ile multi-select
- Computed property ile otomatik filtreleme

---

### 🔍 Arama Özelliği Eklendi

Widget'ları kolayca bulmak için güçlü bir arama sistemi eklendi!

**Özellikler:**
- 🔎 Gerçek zamanlı arama
- 📝 İsim ve açıklamada arama
- 🎯 Anlık sonuç gösterimi
- 🧹 Temizle butonu (X ikonu)
- 📊 Sonuç sayısı gösterimi
- 💡 Arama terimi vurgulaması

**Nasıl Kullanılır:**
1. Ana sayfada üstteki arama kutusuna yaz
2. Widget ismi veya açıklamasına göre ara
3. Sonuçlar anında filtrelenir
4. "X" ile aramayı temizle

**Teknik Detaylar:**
```javascript
// Vue computed ile otomatik filtreleme
const filteredWidgets = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return widgets.value.filter(widget => 
    widget.name?.toLowerCase().includes(query) ||
    widget.description?.toLowerCase().includes(query)
  )
})
```

---

## Önceki Güncellemeler

### 🐛 Hata Düzeltmeleri

#### 1. Görsel Yükleme Hataları
- **Sorun**: `storage.js:92` satırında görsel olmayan widget'larda console hatası
- **Çözüm**: 
  - Backend'den 404 yerine boş liste döndürülüyor
  - Frontend'de response kontrolü iyileştirildi
  - Images klasörü yoksa güvenli bir şekilde boş liste dönüyor

#### 2. Kod Editörü Uzunluk Sorunu
- **Sorun**: Uzun kodlar editörü taşırıyordu
- **Çözüm**: 
  - Tüm editörlere `maxHeight: 500px` eklendi
  - Scroll özelliği aktif
  - Kod uzunluğu sorun olmaktan çıktı

### ✨ Yeni Özellikler

#### 1. Kopyalama Butonları
- Her kod editörünün yanına "Kopyala" butonu eklendi
- Tek tıkla kodu panoya kopyalayabilirsiniz
- Başarılı kopyalama bildirimi gösteriliyor
- Butonlar:
  - HTML Kopyala
  - CSS Kopyala  
  - PreJS Kopyala
  - PostJS Kopyala

#### 2. Editör İyileştirmeleri
- Min-Height: 200px
- Max-Height: 500px
- Otomatik scroll
- Daha iyi kullanıcı deneyimi

### 📋 Teknik Detaylar

**Backend Değişiklikleri:**
```javascript
// Images endpoint artık güvenli
GET /api/widgets/:id/images
// Hata olsa bile { images: [], count: 0 } döner
```

**Frontend Değişiklikleri:**
```javascript
// storage.js - Daha güvenli hata yönetimi
async getImages(widgetId) {
  // 404 kontrolü
  // Boş liste fallback
}

// WidgetDetail.vue - Kopyalama özelliği
const copyCode = async (code, label) => {
  await navigator.clipboard.writeText(code)
  message.success(`${label} kodu kopyalandı!`)
}
```

### 🎨 UI İyileştirmeleri

- Kopyala butonları mavi link stili
- Icon + text kombinasyonu
- Card header'a extra slot ile eklendi
- Responsive ve mobil uyumlu

---

## Önceki Özellikler

### Açıklama Alanı
- Widget'lara açıklama eklenebiliyor
- Listeleme sayfasında özet görünüm (2 satır)
- Detay sayfasında tam görünüm

### Çoklu Görsel Desteği
- En fazla 10 görsel
- Her biri max 5MB
- Picture card görünümü
- Drag & drop upload
- Galeri preview

### File-Based Storage
- Fiziksel dosya sistemi
- JSON + resim dosyaları
- Kalıcı depolama
- Kolay backup

---

## Kurulum ve Kullanım

```bash
# Projeyi başlat
npm run dev

# Backend: http://localhost:3002
# Frontend: http://localhost:3000
```

Detaylı bilgi için `README.md` ve `KULLANIM.md` dosyalarına bakın.


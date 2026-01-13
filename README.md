# Widget Panel - File-Based Vue.js Projesi

Modern ve kullanıcı dostu bir widget yönetim paneli. Database kullanmadan, **gerçek dosya sistemi** üzerinde çalışan file-based bir çözüm. Widget'lar ve görseller bilgisayarınızda `storage/` klasöründe JSON ve resim dosyaları olarak saklanır.

## 🚀 Özellikler

- ✅ **Gerçek File-Based Storage**: Database gerektirmez, dosya sisteminde JSON + resim dosyaları
- ✅ **Node.js Backend**: Express.js ile REST API
- ✅ **Modern UI**: Ant Design Vue ile şık arayüz
- ✅ **Grid Listeleme**: Responsive 4'lü grid kartlar
- ✅ **Arama Özelliği**: Widget'ları isim, açıklama ve koda göre gerçek zamanlı arayın
- ✅ **Etiket Sistemi**: 8 farklı renkli etiket ile kategorize edin
- ✅ **Etiket Filtreleme**: Seçilen etiketlere göre widget'ları filtreleyin
- ✅ **Widget Özel Kod**: Her widget'a benzersiz kod atayın
- ✅ **Çoklu Görsel Upload**: Her widget'a en fazla 10 görsel ekleyin (her biri max 5MB)
- ✅ **Clipboard Paste**: Kopyaladığınız görselleri Ctrl+V ile yapıştırın
- ✅ **Açıklama Alanı**: Widget'larınıza açıklama ekleyin
- ✅ **Code Editor**: HTML, CSS ve JavaScript için syntax highlighting
- ✅ **Kod Kopyalama**: Tek tıkla kodları panoya kopyalayın
- ✅ **PreJS & PostJS**: Sayfa yükleme öncesi/sonrası JavaScript desteği
- ✅ **Widget Detay**: Her widget'ın detaylı görüntüleme sayfası
- ✅ **Galeri Görünümü**: Tüm görselleri preview ile görüntüleyin
- ✅ **CRUD İşlemleri**: Oluştur, Oku, Güncelle, Sil
- ✅ **Fiziksel Dosyalar**: Tüm veriler `storage/` klasöründe saklanır

## 📦 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat (Backend + Frontend birlikte)
npm run dev

# Sadece backend
npm run server

# Sadece frontend
npm run client

# Production için build
npm run build
```

İlk çalıştırmada otomatik olarak `storage/` klasörü oluşturulacaktır.

## 🎯 Kullanım

1. **Sunucuyu Başlat**: `npm run dev` ile projeyi başlatın
2. **Tarayıcıda Aç**: http://localhost:3000 adresine gidin
3. **Widget Oluştur**: "Yeni Widget Oluştur" butonuna tıklayın
4. **Bilgileri Gir**:
   - Widget adı
   - Görsel yükleyin
   - HTML kodunuzu yazın
   - CSS kodunuzu yazın
   - PreJS (sayfa yüklenmeden önce çalışır)
   - PostJS (sayfa yüklendikten sonra çalışır)
5. **Kaydet**: Widget'ınız listeye eklenecek
6. **Görüntüle**: Widget'a tıklayarak detaylarını görün

## 🛠️ Teknolojiler

### Frontend
- **Vue.js 3**: Modern JavaScript framework
- **Vue Router**: Sayfa yönlendirme
- **Pinia**: State management
- **Ant Design Vue**: UI component kütüphanesi
- **CodeMirror 6**: Code editor
- **Vite**: Build tool ve dev server

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **File System (fs)**: Gerçek dosya sistemi storage
- **CORS**: Cross-origin resource sharing
- **Multer**: File upload handling

## 📁 Proje Yapısı

```
file-based-widget-panel/
├── server/
│   └── index.js                  # Express.js backend server
├── src/
│   ├── components/
│   │   └── CreateWidgetModal.vue # Widget oluşturma/düzenleme modalı
│   ├── views/
│   │   ├── WidgetList.vue        # Ana sayfa, widget listesi
│   │   └── WidgetDetail.vue      # Widget detay sayfası
│   ├── services/
│   │   └── storage.js            # API servisi
│   ├── router/
│   │   └── index.js              # Vue Router yapılandırması
│   ├── App.vue                   # Ana uygulama
│   └── main.js                   # Uygulama giriş noktası
├── storage/                      # Veriler burada saklanır
│   ├── widgets/                  # Widget JSON dosyaları
│   └── images/                   # Widget görselleri
└── package.json
```

## 💾 Veri Yapısı

Her widget bir JSON dosyası olarak `storage/widgets/` klasöründe saklanır:

**Dosya adı:** `1234567890.json`

```json
{
  "id": "1234567890",
  "name": "Widget Adı",
  "description": "Widget açıklaması",
  "widgetCode": "WIDGET_001",
  "tags": ["popup", "reco"],
  "html": "<div>HTML Kodu</div>",
  "css": ".class { color: red; }",
  "preJs": "console.log('PreJS')",
  "postJs": "console.log('PostJS')",
  "imageCount": 3,
  "createdAt": "2026-01-13T10:00:00.000Z",
  "updatedAt": "2026-01-13T11:00:00.000Z"
}
```

Görseller `storage/images/` klasöründe widget ID'si ve index ile saklanır:
- `1234567890_0.png` (ilk görsel)
- `1234567890_1.jpg` (ikinci görsel)
- `1234567890_2.webp` (üçüncü görsel)
- vb. (en fazla 10 görsel)

## 🎨 Ekran Görüntüleri

### Ana Sayfa (Widget Listesi)
- 4'lü responsive grid
- Her widget'ta görsel, ad ve oluşturma tarihi
- Görüntüle, Düzenle ve Sil butonları

### Widget Oluşturma Modalı
- Görsel upload alanı
- Syntax highlighting ile kod editörleri
- HTML, CSS, PreJS ve PostJS alanları

### Widget Detay Sayfası
- Tam boyutta görsel
- Tüm kodların görüntülenmesi
- Düzenleme özelliği

## 📝 Notlar

- Bu proje yerel kullanım içindir (localhost)
- Tüm veriler fiziksel olarak `storage/` klasöründe saklanır
- Widget'lar `.json` dosyaları olarak tutulur
- Görseller orijinal formatlarında (png, jpg, gif, webp) saklanır
- Backend: `http://localhost:3002`
- Frontend: `http://localhost:3001` (veya müsait olan ilk port)
- Veriler kalıcıdır, tarayıcı cache'i temizlense bile korunur

## 🤝 Geliştirme

Projeyi geliştirmek için:

1. Fork edin
2. Feature branch oluşturun
3. Değişikliklerinizi yapın
4. Pull request gönderin

## 📄 Lisans

Bu proje kişisel kullanım içindir.


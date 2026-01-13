# Storage Klasörü

Bu klasör widget'ların ve görsellerin fiziksel olarak saklandığı yerdir.

## Yapı

```
storage/
├── widgets/          # Widget JSON dosyaları
│   ├── 1234567890.json
│   └── 1234567891.json
└── images/           # Widget görselleri
    ├── 1234567890.png
    └── 1234567891.jpg
```

## Widget Dosya Formatı

Her widget bir JSON dosyası olarak saklanır:

```json
{
  "id": "1234567890",
  "name": "Widget Adı",
  "html": "<div>HTML kodu</div>",
  "css": ".class { color: red; }",
  "preJs": "console.log('PreJS')",
  "postJs": "console.log('PostJS')",
  "createdAt": "2026-01-13T12:00:00.000Z",
  "updatedAt": "2026-01-13T13:00:00.000Z"
}
```

## Görsel Dosyaları

Görseller widget ID'si ile isimlendirilir ve desteklenen formatlar:
- .jpg / .jpeg
- .png
- .gif
- .webp

## Notlar

- Bu klasörler otomatik olarak oluşturulur
- Widget silindiğinde JSON ve görsel dosyası da silinir
- Dosyalar git'e eklenmez (.gitignore'da tanımlı)


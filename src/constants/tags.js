// Widget etiket sistemi
export const WIDGET_TAGS = [
  {
    value: 'popup',
    label: 'Popup',
    color: '#1890ff' // Mavi
  },
  {
    value: 'sticky-popup',
    label: 'Sticky Popup',
    color: '#52c41a' // Yeşil
  },
  {
    value: 'reco',
    label: 'Reco',
    color: '#fa8c16' // Turuncu
  },
  {
    value: 'banner',
    label: 'Banner',
    color: '#722ed1' // Mor
  },
  {
    value: 'slider',
    label: 'Slider',
    color: '#eb2f96' // Pembe
  },
  {
    value: 'form',
    label: 'Form',
    color: '#13c2c2' // Cyan
  },
  {
    value: 'notification',
    label: 'Notification',
    color: '#faad14' // Altın
  },
  {
    value: 'modal',
    label: 'Modal',
    color: '#2f54eb' // Koyu Mavi
  }
]

// Etiket değerine göre obje döndür
export const getTagByValue = (value) => {
  return WIDGET_TAGS.find(tag => tag.value === value)
}

// Etiket değerine göre renk döndür
export const getTagColor = (value) => {
  const tag = getTagByValue(value)
  return tag ? tag.color : '#d9d9d9'
}

// Tüm etiket değerlerini döndür
export const getTagValues = () => {
  return WIDGET_TAGS.map(tag => tag.value)
}


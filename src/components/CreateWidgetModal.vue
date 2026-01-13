<template>
  <a-modal
    :open="visible"
    :title="widget ? 'Widget Düzenle' : 'Yeni Widget Oluştur'"
    width="90%"
    :style="{ top: '20px', maxWidth: '1200px' }"
    @cancel="handleCancel"
    :footer="null"
  >
    <a-form
      :model="formState"
      layout="vertical"
      @finish="handleSubmit"
    >
      <a-form-item label="Widget Adı" name="name" :rules="[{ required: true, message: 'Widget adı zorunludur' }]">
        <a-input 
          v-model:value="formState.name" 
          placeholder="Widget adını girin"
          size="large"
        />
      </a-form-item>

      <a-form-item label="Açıklama" name="description">
        <a-textarea 
          v-model:value="formState.description" 
          placeholder="Widget açıklamasını girin (opsiyonel)"
          :rows="3"
          size="large"
        />
      </a-form-item>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Widget Özel Kod" name="widgetCode">
            <a-input 
              v-model:value="formState.widgetCode" 
              placeholder="Örn: WIDGET_001"
              size="large"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Etiketler" name="tags">
            <a-select
              v-model:value="formState.tags"
              mode="multiple"
              placeholder="Etiket seçin"
              size="large"
              :options="tagOptions"
              :max-tag-count="3"
            >
              <template #tagRender="{ value, closable, onClose }">
                <a-tag
                  :color="getTagColor(value)"
                  :closable="closable"
                  @close="onClose"
                  style="margin-right: 4px;"
                >
                  {{ getTagLabel(value) }}
                </a-tag>
              </template>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item label="Görseller (Çoklu)" name="images">
        <div 
          class="images-upload-area"
          @paste="handlePaste"
          tabindex="0"
          ref="uploadAreaRef"
        >
          <a-upload
            :before-upload="handleImageUpload"
            :file-list="fileList"
            list-type="picture-card"
            accept="image/*"
            multiple
            @remove="handleRemoveImage"
          >
            <div v-if="fileList.length < 10" class="upload-button">
              <PlusOutlined />
              <div class="upload-text">Görsel Ekle</div>
            </div>
          </a-upload>
          <div class="upload-hint">
            💡 En fazla 10 görsel yükleyebilirsiniz. Her görsel max 5MB olmalı. <br>
            Görseller yüklendikten sonra önizlenebilir.
            <br>
            📋 <strong>Ctrl+V / Cmd+V</strong> ile kopyaladığınız görseli yapıştırabilirsiniz!
          </div>
        </div>
      </a-form-item>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="HTML Kodu" name="html">
            <div class="editor-wrapper">
              <Codemirror
                v-model="formState.html"
                placeholder="HTML kodunu buraya yazın..."
                :style="{ height: '200px' }"
                :autofocus="false"
                :indent-with-tab="true"
                :tab-size="2"
                :extensions="htmlExtensions"
              />
            </div>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="CSS Kodu" name="css">
            <div class="editor-wrapper">
              <Codemirror
                v-model="formState.css"
                placeholder="CSS kodunu buraya yazın..."
                :style="{ height: '200px' }"
                :autofocus="false"
                :indent-with-tab="true"
                :tab-size="2"
                :extensions="cssExtensions"
              />
            </div>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="PreJS Kodu" name="preJs">
            <div class="editor-wrapper">
              <Codemirror
                v-model="formState.preJs"
                placeholder="Sayfa yüklenmeden önce çalışacak JS kodu..."
                :style="{ height: '200px' }"
                :autofocus="false"
                :indent-with-tab="true"
                :tab-size="2"
                :extensions="jsExtensions"
              />
            </div>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="PostJS Kodu" name="postJs">
            <div class="editor-wrapper">
              <Codemirror
                v-model="formState.postJs"
                placeholder="Sayfa yüklendikten sonra çalışacak JS kodu..."
                :style="{ height: '200px' }"
                :autofocus="false"
                :indent-with-tab="true"
                :tab-size="2"
                :extensions="jsExtensions"
              />
            </div>
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item class="form-actions">
        <a-space>
          <a-button @click="handleCancel" size="large">
            İptal
          </a-button>
          <a-button type="primary" html-type="submit" size="large">
            <template #icon>
              <SaveOutlined />
            </template>
            {{ widget ? 'Güncelle' : 'Kaydet' }}
          </a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { message } from 'ant-design-vue'
import { UploadOutlined, SaveOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { Codemirror } from 'vue-codemirror'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { javascript } from '@codemirror/lang-javascript'
import { storageService } from '../services/storage'
import { WIDGET_TAGS, getTagColor as getColor } from '../constants/tags'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  widget: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:visible', 'created', 'updated'])

const formState = reactive({
  name: '',
  description: '',
  widgetCode: '',
  tags: [],
  html: '',
  css: '',
  preJs: '',
  postJs: ''
})

const fileList = ref([])
const imageFiles = ref([])
const uploadAreaRef = ref(null)

// Etiket seçenekleri
const tagOptions = computed(() => {
  return WIDGET_TAGS.map(tag => ({
    value: tag.value,
    label: tag.label
  }))
})

// Etiket rengini getir
const getTagColor = (value) => {
  return getColor(value)
}

// Etiket label'ını getir
const getTagLabel = (value) => {
  const tag = WIDGET_TAGS.find(t => t.value === value)
  return tag ? tag.label : value
}

// CodeMirror extensions
const htmlExtensions = [html()]
const cssExtensions = [css()]
const jsExtensions = [javascript()]

// Önce resetForm fonksiyonunu tanımla
const resetForm = () => {
  formState.name = ''
  formState.description = ''
  formState.widgetCode = ''
  formState.tags = []
  formState.html = ''
  formState.css = ''
  formState.preJs = ''
  formState.postJs = ''
  fileList.value = []
  imageFiles.value = []
}

const handleImageUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('Sadece görsel dosyaları yükleyebilirsiniz!')
    return false
  }

  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    message.error('Görsel boyutu 5MB\'dan küçük olmalıdır!')
    return false
  }

  if (fileList.value.length >= 10) {
    message.error('En fazla 10 görsel yükleyebilirsiniz!')
    return false
  }

  // Görseli base64'e çevir
  const reader = new FileReader()
  reader.onload = (e) => {
    const base64 = e.target.result
    imageFiles.value.push(base64)
    
    // FileList'e ekle (UI için)
    fileList.value.push({
      uid: Date.now() + Math.random(),
      name: file.name,
      status: 'done',
      url: base64
    })
  }
  reader.readAsDataURL(file)

  return false // Upload'u otomatik yapma
}

const handleRemoveImage = (file) => {
  const index = fileList.value.findIndex(f => f.uid === file.uid)
  if (index > -1) {
    fileList.value.splice(index, 1)
    imageFiles.value.splice(index, 1)
  }
}

// Clipboard'dan görsel yapıştırma
const handlePaste = async (event) => {
  const items = event.clipboardData?.items
  if (!items) return

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    
    // Sadece image tipindeki itemları işle
    if (item.type.indexOf('image') !== -1) {
      event.preventDefault()
      
      const file = item.getAsFile()
      if (!file) continue

      // Limit kontrolü
      if (fileList.value.length >= 10) {
        message.warning('En fazla 10 görsel yükleyebilirsiniz!')
        return
      }

      // Boyut kontrolü
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        message.error('Görsel boyutu 5MB\'dan küçük olmalıdır!')
        continue
      }

      // Görseli base64'e çevir
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target.result
        imageFiles.value.push(base64)
        
        // FileList'e ekle (UI için)
        fileList.value.push({
          uid: Date.now() + Math.random(),
          name: `pasted-image-${Date.now()}.png`,
          status: 'done',
          url: base64
        })
        
        message.success('Görsel yapıştırıldı!')
      }
      reader.readAsDataURL(file)
    }
  }
}

const handleSubmit = async () => {
  if (!formState.name.trim()) {
    message.error('Widget adı zorunludur!')
    return
  }

  const widgetData = {
    name: formState.name,
    description: formState.description,
    widgetCode: formState.widgetCode,
    tags: formState.tags,
    html: formState.html,
    css: formState.css,
    preJs: formState.preJs,
    postJs: formState.postJs,
    images: imageFiles.value
  }

  try {
    if (props.widget) {
      // Güncelleme
      await storageService.updateWidget(props.widget.id, widgetData)
      emit('updated')
    } else {
      // Yeni oluşturma
      await storageService.saveWidget(widgetData)
      emit('created')
    }
    resetForm()
  } catch (error) {
    message.error('İşlem başarısız oldu!')
    console.error(error)
  }
}

const handleCancel = () => {
  resetForm()
  emit('update:visible', false)
}

// Modal açıldığında upload alanına focus
watch(() => props.visible, (newVal) => {
  if (newVal) {
    // Modal açılma animasyonundan sonra focus
    setTimeout(() => {
      uploadAreaRef.value?.focus()
    }, 300)
  }
})

// Widget güncellendiğinde formu doldur
watch(() => props.widget, async (newWidget) => {
  if (newWidget) {
    formState.name = newWidget.name || ''
    formState.description = newWidget.description || ''
    formState.widgetCode = newWidget.widgetCode || ''
    formState.tags = newWidget.tags || []
    formState.html = newWidget.html || ''
    formState.css = newWidget.css || ''
    formState.preJs = newWidget.preJs || ''
    formState.postJs = newWidget.postJs || ''
    
    // Görselleri yükle
    const imagesData = await storageService.getImages(newWidget.id)
    if (imagesData.images && imagesData.images.length > 0) {
      fileList.value = imagesData.images.map((imgUrl, index) => ({
        uid: index,
        name: `image-${index}`,
        status: 'done',
        url: storageService.getFullImageUrl(imgUrl)
      }))
    }
  } else {
    resetForm()
  }
}, { immediate: true })
</script>

<style scoped>
.images-upload-area {
  width: 100%;
  padding: 12px;
  border: 2px dashed transparent;
  border-radius: 8px;
  transition: all 0.3s;
  outline: none;
}

.images-upload-area:focus {
  border-color: #1890ff;
  background: #f0f5ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.images-upload-area:focus .upload-hint {
  color: #1890ff;
  font-weight: 500;
}

.upload-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.upload-text {
  margin-top: 8px;
  color: #666;
  font-size: 14px;
}

.upload-hint {
  margin-top: 8px;
  color: #666;
  font-size: 12px;
  line-height: 1.6;
  transition: all 0.3s;
}

.upload-hint strong {
  color: #1890ff;
  font-weight: 600;
}

.editor-wrapper {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
}

.editor-wrapper :deep(.cm-editor) {
  font-size: 13px;
}

.form-actions {
  margin-top: 32px;
  margin-bottom: 0;
  text-align: right;
}
</style>


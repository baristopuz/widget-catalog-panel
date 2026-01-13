<template>
  <div class="widget-detail-container">
    <a-layout>
      <a-layout-header class="header">
        <a-button type="text" @click="goBack" class="back-button">
          <template #icon>
            <ArrowLeftOutlined />
          </template>
          Geri Dön
        </a-button>
        <h1>{{ widget?.name || 'Widget Detayı' }}</h1>
        <div class="header-actions">
          <a-button type="primary" @click="editWidget">
            <template #icon>
              <EditOutlined />
            </template>
            Düzenle
          </a-button>
        </div>
      </a-layout-header>
      
      <a-layout-content class="content">
        <div v-if="!widget" class="not-found">
          <a-result
            status="404"
            title="Widget Bulunamadı"
            sub-title="Aradığınız widget mevcut değil."
          >
            <template #extra>
              <a-button type="primary" @click="goBack">
                Ana Sayfaya Dön
              </a-button>
            </template>
          </a-result>
        </div>

        <div v-else class="widget-content">
          <!-- Genel Bilgiler -->
          <a-card title="Genel Bilgiler" class="section-card">
            <a-descriptions :column="2" bordered>
              <a-descriptions-item label="Widget Adı" :span="2">
                <strong>{{ widget.name }}</strong>
              </a-descriptions-item>
              <a-descriptions-item label="Açıklama" :span="2" v-if="widget.description">
                {{ widget.description }}
              </a-descriptions-item>
              <a-descriptions-item label="Widget Özel Kod" v-if="widget.widgetCode">
                <a-tag color="blue">{{ widget.widgetCode }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="Etiketler" v-if="widget.tags && widget.tags.length > 0">
                <a-space wrap>
                  <a-tag
                    v-for="tag in widget.tags"
                    :key="tag"
                    :color="getTagColor(tag)"
                  >
                    {{ getTagLabel(tag) }}
                  </a-tag>
                </a-space>
              </a-descriptions-item>
            </a-descriptions>
          </a-card>

          <!-- Görseller -->
          <a-card title="Görseller" class="section-card">
            <div v-if="widgetImages.length > 0" class="images-gallery">
              <a-image-preview-group>
                <div class="image-grid">
                  <div v-for="(image, index) in widgetImages" :key="index" class="image-item">
                    <a-image 
                      :src="image" 
                      :alt="`${widget.name} - ${index + 1}`"
                      :width="200"
                    />
                  </div>
                </div>
              </a-image-preview-group>
              <div class="image-count">
                Toplam {{ widgetImages.length }} görsel
              </div>
            </div>
            <a-empty v-else description="Görsel yüklenmemiş" />
          </a-card>

          <!-- HTML Kodu -->
          <a-card title="HTML Kodu" class="section-card">
            <template #extra>
              <a-button 
                v-if="widget.html" 
                type="link" 
                @click="copyCode(widget.html, 'HTML')"
              >
                <template #icon>
                  <CopyOutlined />
                </template>
                Kopyala
              </a-button>
            </template>
            <div v-if="widget.html" class="code-viewer">
              <Codemirror
                v-model="widget.html"
                :style="{ height: 'auto', minHeight: '200px', maxHeight: '500px' }"
                :autofocus="false"
                :indent-with-tab="true"
                :tab-size="2"
                :extensions="htmlExtensions"
                :disabled="true"
              />
            </div>
            <a-empty v-else description="HTML kodu girilmemiş" />
          </a-card>

          <!-- CSS Kodu -->
          <a-card title="CSS Kodu" class="section-card">
            <template #extra>
              <a-button 
                v-if="widget.css" 
                type="link" 
                @click="copyCode(widget.css, 'CSS')"
              >
                <template #icon>
                  <CopyOutlined />
                </template>
                Kopyala
              </a-button>
            </template>
            <div v-if="widget.css" class="code-viewer">
              <Codemirror
                v-model="widget.css"
                :style="{ height: 'auto', minHeight: '200px', maxHeight: '500px' }"
                :autofocus="false"
                :indent-with-tab="true"
                :tab-size="2"
                :extensions="cssExtensions"
                :disabled="true"
              />
            </div>
            <a-empty v-else description="CSS kodu girilmemiş" />
          </a-card>

          <!-- PreJS ve PostJS -->
          <a-row :gutter="16">
            <a-col :span="12">
              <a-card title="PreJS Kodu" class="section-card">
                <template #extra>
                  <a-button 
                    v-if="widget.preJs" 
                    type="link" 
                    @click="copyCode(widget.preJs, 'PreJS')"
                  >
                    <template #icon>
                      <CopyOutlined />
                    </template>
                    Kopyala
                  </a-button>
                </template>
                <div v-if="widget.preJs" class="code-viewer">
                  <Codemirror
                    v-model="widget.preJs"
                    :style="{ height: 'auto', minHeight: '200px', maxHeight: '500px' }"
                    :autofocus="false"
                    :indent-with-tab="true"
                    :tab-size="2"
                    :extensions="jsExtensions"
                    :disabled="true"
                  />
                </div>
                <a-empty v-else description="PreJS kodu girilmemiş" />
              </a-card>
            </a-col>
            <a-col :span="12">
              <a-card title="PostJS Kodu" class="section-card">
                <template #extra>
                  <a-button 
                    v-if="widget.postJs" 
                    type="link" 
                    @click="copyCode(widget.postJs, 'PostJS')"
                  >
                    <template #icon>
                      <CopyOutlined />
                    </template>
                    Kopyala
                  </a-button>
                </template>
                <div v-if="widget.postJs" class="code-viewer">
                  <Codemirror
                    v-model="widget.postJs"
                    :style="{ height: 'auto', minHeight: '200px', maxHeight: '500px' }"
                    :autofocus="false"
                    :indent-with-tab="true"
                    :tab-size="2"
                    :extensions="jsExtensions"
                    :disabled="true"
                  />
                </div>
                <a-empty v-else description="PostJS kodu girilmemiş" />
              </a-card>
            </a-col>
          </a-row>

          <!-- Meta Bilgiler -->
          <a-card title="Bilgiler" class="section-card">
            <a-descriptions :column="2" bordered>
              <a-descriptions-item label="Oluşturma Tarihi">
                {{ formatDate(widget.createdAt) }}
              </a-descriptions-item>
              <a-descriptions-item label="Son Güncelleme" v-if="widget.updatedAt">
                {{ formatDate(widget.updatedAt) }}
              </a-descriptions-item>
              <a-descriptions-item label="Widget ID">
                {{ widget.id }}
              </a-descriptions-item>
            </a-descriptions>
          </a-card>
        </div>
      </a-layout-content>
    </a-layout>

    <!-- Düzenleme Modalı -->
    <CreateWidgetModal
      v-model:visible="modalVisible"
      :widget="widget"
      @updated="handleWidgetUpdated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { ArrowLeftOutlined, EditOutlined, CopyOutlined } from '@ant-design/icons-vue'
import { Codemirror } from 'vue-codemirror'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { javascript } from '@codemirror/lang-javascript'
import CreateWidgetModal from '../components/CreateWidgetModal.vue'
import { storageService } from '../services/storage'
import { WIDGET_TAGS, getTagColor as getColor } from '../constants/tags'

const router = useRouter()
const route = useRoute()
const widget = ref(null)
const modalVisible = ref(false)
const widgetImages = ref([])

// CodeMirror extensions
const htmlExtensions = [html()]
const cssExtensions = [css()]
const jsExtensions = [javascript()]

const loadWidget = async () => {
  const widgetId = route.params.id
  const loadedWidget = await storageService.getWidget(widgetId)
  if (loadedWidget) {
    widget.value = loadedWidget
    
    // Görselleri yükle
    const imagesData = await storageService.getImages(widgetId)
    if (imagesData.images && imagesData.images.length > 0) {
      widgetImages.value = imagesData.images.map(img => storageService.getFullImageUrl(img))
    }
  } else {
    message.error('Widget bulunamadı')
  }
}

// Etiket fonksiyonları
const getTagColor = (value) => {
  return getColor(value)
}

const getTagLabel = (value) => {
  const tag = WIDGET_TAGS.find(t => t.value === value)
  return tag ? tag.label : value
}

const goBack = () => {
  router.push('/')
}

const editWidget = () => {
  modalVisible.value = true
}

const handleWidgetUpdated = async () => {
  await loadWidget()
  modalVisible.value = false
  message.success('Widget başarıyla güncellendi!')
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const copyCode = async (code, label) => {
  try {
    await navigator.clipboard.writeText(code)
    message.success(`${label} kodu kopyalandı!`)
  } catch (error) {
    console.error('Kopyalama hatası:', error)
    message.error('Kopyalama başarısız oldu')
  }
}

onMounted(() => {
  loadWidget()
})
</script>

<style scoped>
.widget-detail-container {
  min-height: 100vh;
}

.header {
  background: #fff;
  padding: 0 50px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-button {
  font-size: 16px;
}

.header h1 {
  flex: 1;
  color: #1890ff;
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.content {
  padding: 24px 50px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.widget-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.section-card :deep(.ant-card-head) {
  background: #fafafa;
  font-weight: 600;
}

.widget-description-text {
  font-size: 15px;
  line-height: 1.6;
  color: #595959;
  margin: 0;
}

.images-gallery {
  width: 100%;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.image-item {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  transition: all 0.3s;
}

.image-item:hover {
  border-color: #1890ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
}

.image-count {
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  color: #8c8c8c;
  font-size: 13px;
  text-align: center;
}

.code-viewer {
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.code-viewer :deep(.cm-editor) {
  font-size: 13px;
}

.code-viewer :deep(.cm-editor.cm-focused) {
  outline: none;
}

.code-viewer :deep(.cm-scroller) {
  overflow: auto;
  max-height: 500px;
}
</style>


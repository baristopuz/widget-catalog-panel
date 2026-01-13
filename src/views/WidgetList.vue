<template>
  <div class="widget-list-container">
    <a-layout>
      <a-layout-header class="header">
        <h1>Widget Panel</h1>
      </a-layout-header>
      <a-layout-content class="content">
        <div class="action-bar">
          <a-input-search
            v-model:value="searchQuery"
            placeholder="Widget ara... (isim, açıklama, kod)"
            size="large"
            class="search-input"
            allow-clear
            @search="handleSearch"
          >
            <template #prefix>
              <SearchOutlined />
            </template>
          </a-input-search>
          <a-select
            v-model:value="selectedTags"
            mode="multiple"
            placeholder="Etiket filtrele"
            size="large"
            class="tag-filter"
            :options="tagFilterOptions"
            allow-clear
            :max-tag-count="2"
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
          <a-button type="primary" size="large" @click="showCreateModal">
            <template #icon>
              <PlusOutlined />
            </template>
            Yeni Widget Oluştur
          </a-button>
        </div>

        <div v-if="widgets.length === 0" class="empty-state">
          <a-empty description="Henüz widget oluşturulmamış">
            <a-button type="primary" @click="showCreateModal">
              İlk Widget'ı Oluştur
            </a-button>
          </a-empty>
        </div>

        <div v-else-if="filteredWidgets.length === 0" class="empty-state">
          <a-empty description="Arama sonucu bulunamadı">
            <template #image>
              <SearchOutlined style="font-size: 64px; color: #d9d9d9;" />
            </template>
            <a-button @click="searchQuery = ''">
              Aramayı Temizle
            </a-button>
          </a-empty>
        </div>

        <div v-else>
          <div class="results-info">
            <span class="result-count">
              {{ filteredWidgets.length }} widget bulundu
              <span v-if="searchQuery" class="search-term">
                "{{ searchQuery }}" için
              </span>
            </span>
          </div>

        <a-row :gutter="[24, 24]" class="widget-grid">
          <a-col 
            v-for="widget in filteredWidgets" 
            :key="widget.id"
            :xs="24" 
            :sm="12" 
            :md="12" 
            :lg="6"
          >
            <a-card 
              hoverable 
              class="widget-card"
              @click="viewWidget(widget.id)"
            >
              <template #cover>
                <div class="card-image-wrapper">
                  <img 
                    v-if="getWidgetImage(widget.id)" 
                    :src="getWidgetImage(widget.id)" 
                    :alt="widget.name"
                  />
                  <div v-else class="no-image">
                    <FileImageOutlined />
                  </div>
                </div>
              </template>
              <a-card-meta :title="widget.name || 'İsimsiz Widget'">
                <template #description>
                  <div class="widget-description" v-if="widget.description">
                    {{ widget.description }}
                  </div>
                  <div class="widget-tags" v-if="widget.tags && widget.tags.length > 0">
                    <a-tag
                      v-for="tag in widget.tags"
                      :key="tag"
                      :color="getTagColor(tag)"
                      class="widget-tag"
                    >
                      {{ getTagLabel(tag) }}
                    </a-tag>
                  </div>
                  <div class="widget-code" v-if="widget.widgetCode">
                    <code>{{ widget.widgetCode }}</code>
                  </div>
                  <div class="widget-meta">
                    <div class="meta-item">
                      <CalendarOutlined />
                      {{ formatDate(widget.createdAt) }}
                    </div>
                    <div class="meta-item" v-if="widget.imageCount">
                      <FileImageOutlined />
                      {{ widget.imageCount }} görsel
                    </div>
                  </div>
                </template>
              </a-card-meta>
              <template #actions>
                <EyeOutlined key="view" @click.stop="viewWidget(widget.id)" />
                <DeleteOutlined 
                  key="delete" 
                  @click.stop="confirmDelete(widget.id)" 
                />
              </template>
            </a-card>
          </a-col>
        </a-row>
        </div>
      </a-layout-content>
    </a-layout>

    <!-- Widget Oluşturma/Düzenleme Modalı -->
    <CreateWidgetModal
      v-model:visible="modalVisible"
      :widget="editingWidget"
      @created="handleWidgetCreated"
      @updated="handleWidgetUpdated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Modal, message } from 'ant-design-vue'
import {
  PlusOutlined,
  EyeOutlined,
  DeleteOutlined,
  FileImageOutlined,
  CalendarOutlined,
  SearchOutlined
} from '@ant-design/icons-vue'
import CreateWidgetModal from '../components/CreateWidgetModal.vue'
import { storageService } from '../services/storage'
import { WIDGET_TAGS, getTagColor as getColor } from '../constants/tags'

const router = useRouter()
const widgets = ref([])
const modalVisible = ref(false)
const editingWidget = ref(null)
const searchQuery = ref('')
const selectedTags = ref([])

// Etiket filtre seçenekleri
const tagFilterOptions = computed(() => {
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

// Filtrelenmiş widget listesi
const filteredWidgets = computed(() => {
  let filtered = widgets.value

  // Etiket filtrelemesi
  if (selectedTags.value.length > 0) {
    filtered = filtered.filter(widget => {
      if (!widget.tags || widget.tags.length === 0) return false
      // En az bir etiket eşleşmeli
      return selectedTags.value.some(tag => widget.tags.includes(tag))
    })
  }

  // Arama filtrelemesi
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    
    filtered = filtered.filter(widget => {
      // İsimde ara
      const nameMatch = widget.name?.toLowerCase().includes(query)
      // Açıklamada ara
      const descMatch = widget.description?.toLowerCase().includes(query)
      // Widget kodunda ara
      const codeMatch = widget.widgetCode?.toLowerCase().includes(query)
      
      return nameMatch || descMatch || codeMatch
    })
  }

  return filtered
})

const loadWidgets = async () => {
  widgets.value = await storageService.getWidgets()
}

const getWidgetImage = (widgetId) => {
  return storageService.getImage(widgetId)
}

const handleSearch = (value) => {
  // Arama otomatik olarak computed ile yapılıyor
  // Bu fonksiyon Enter'a basıldığında tetiklenir (opsiyonel)
  console.log('Arama yapılıyor:', value)
}

const showCreateModal = () => {
  editingWidget.value = null
  modalVisible.value = true
}

const viewWidget = (widgetId) => {
  router.push(`/widget/${widgetId}`)
}

const confirmDelete = (widgetId) => {
  Modal.confirm({
    title: 'Widget\'ı silmek istediğine emin misin?',
    content: 'Bu işlem geri alınamaz.',
    okText: 'Evet, Sil',
    okType: 'danger',
    cancelText: 'İptal',
    async onOk() {
      await storageService.deleteWidget(widgetId)
      await loadWidgets()
      message.success('Widget başarıyla silindi')
    }
  })
}

const handleWidgetCreated = async () => {
  await loadWidgets()
  modalVisible.value = false
  message.success('Widget başarıyla oluşturuldu!')
}

const handleWidgetUpdated = async () => {
  await loadWidgets()
  modalVisible.value = false
  message.success('Widget başarıyla güncellendi!')
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  loadWidgets()
})
</script>

<style scoped>
.widget-list-container {
  min-height: 100vh;
}

.header {
  background: #fff;
  padding: 0 50px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
}

.header h1 {
  color: #1890ff;
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.content {
  padding: 24px 50px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.action-bar {
  margin-bottom: 32px;
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 250px;
  max-width: 400px;
}

.tag-filter {
  min-width: 200px;
  max-width: 300px;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.widget-grid {
  margin-top: 0;
}

.widget-card {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.widget-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-image-wrapper {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-image-wrapper img {
  width: 100%;
  height: 100%;
  background-color: #fff;
  object-fit: contain;
}

.no-image {
  font-size: 48px;
  color: #d9d9d9;
}

.widget-description {
  color: #595959;
  font-size: 13px;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.widget-tags {
  margin-bottom: 8px;
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.widget-tag {
  margin: 0;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
}

.widget-code {
  margin-bottom: 8px;
}

.widget-code code {
  background: #f5f5f5;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  color: #1890ff;
  font-family: 'Courier New', monospace;
  font-weight: 600;
}

.widget-meta {
  margin-top: 8px;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #8c8c8c;
  font-size: 12px;
}

.results-info {
  margin-bottom: 20px;
  padding: 12px 16px;
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.result-count {
  color: #595959;
  font-size: 14px;
  font-weight: 500;
}

.search-term {
  color: #1890ff;
  font-weight: 600;
  margin-left: 4px;
}
</style>


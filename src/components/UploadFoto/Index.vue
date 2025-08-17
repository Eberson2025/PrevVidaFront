<script setup lang="ts">
import { ref, computed, defineEmits, defineProps, onMounted } from 'vue'

const props = defineProps<{
  modelValue?: File | string | null
  accept?: string
  alt?: string
  maxSize?: number // em MB
  imageUrl?: string // Nova prop para URL da imagem
}>()

const emit = defineEmits(['update:modelValue', 'upload', 'remove'])

const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)
const imageLoadError = ref(false)

const hasImage = computed(() => {
  return !!(props.modelValue || selectedFile.value || (props.imageUrl && !imageLoadError.value))
})

const displayImageUrl = computed(() => {
  // Prioridade: arquivo selecionado > modelValue > imageUrl prop
  if (selectedFile.value) {
    return URL.createObjectURL(selectedFile.value)
  }
  if (props.modelValue instanceof File) {
    return URL.createObjectURL(props.modelValue)
  }
  if (typeof props.modelValue === 'string') {
    return props.modelValue
  }
  if (props.imageUrl && !imageLoadError.value) {
    return props.imageUrl
  }
  return null
})

function selectFile() {
  fileInput.value?.click()
}

function onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  
  if (!file) return
  
  // Validar tamanho se especificado
  if (props.maxSize && file.size > props.maxSize * 1024 * 1024) {
    alert(`Arquivo muito grande. Tamanho máximo: ${props.maxSize}MB`)
    return
  }
  
  // Validar tipo de arquivo
  if (props.accept && !file.type.match(props.accept.replace('*', '.*'))) {
    alert('Formato de arquivo não suportado')
    return
  }
  
  selectedFile.value = file
  imageLoadError.value = false // Reset error state
  emit('update:modelValue', file)
  emit('upload', file)
  
  // Limpar input para permitir selecionar o mesmo arquivo novamente
  input.value = ''
}

function removeImage() {
  selectedFile.value = null
  imageLoadError.value = false
  emit('update:modelValue', null)
  emit('remove')
}

function onImageError() {
  imageLoadError.value = true
}

onMounted(() => {
  // Reset error state on mount
  imageLoadError.value = false
})
</script>

<template>
  <div class="upload-container">
    <!-- Input file oculto -->
    <input
      ref="fileInput"
      type="file"
      :accept="accept"
      @change="onFileSelected"
      style="display: none"
    />
    
    <!-- Preview da imagem ou área de upload -->
    <div class="upload-area" :class="{ 'has-image': hasImage }">
      <!-- Imagem selecionada/carregada -->
      <div v-if="hasImage" class="image-preview">
        <img 
          :src="displayImageUrl ?? undefined" 
          :alt="alt" 
          class="preview-img"
          @error="onImageError"
        />
        <div class="image-overlay">
          <button
            type="button"
            class="btn btn-sm btn-primary me-2"
            @click="selectFile"
            title="Alterar imagem"
          >
            <i class="fas fa-edit"></i>
          </button>
          <button
            type="button"
            class="btn btn-sm btn-danger"
            @click="removeImage"
            title="Remover imagem"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      
      <!-- Área de upload quando não há imagem -->
      <div v-else class="upload-placeholder" @click="selectFile">
        <div class="upload-content">
          <i class="fas fa-cloud-upload-alt upload-icon"></i>
          <p class="upload-text">Clique para selecionar uma imagem</p>
          <small class="text-muted">{{ accept || 'Formatos aceitos: JPG, PNG, GIF' }}</small>
        </div>
      </div>
    </div>
    
    <!-- Botões de ação (quando há imagem) -->
    <div v-if="hasImage" class="upload-actions mt-2">
      <button
        type="button"
        class="btn btn-outline-primary btn-sm me-2"
        @click="selectFile"
      >
        <i class="fas fa-upload me-1"></i>
        Alterar
      </button>
      <button
        type="button"
        class="btn btn-outline-danger btn-sm"
        @click="removeImage"
      >
        <i class="fas fa-trash me-1"></i>
        Remover
      </button>
    </div>
  </div>
</template>

<style scoped>
.upload-container {
  max-width: 300px;
}

.upload-area {
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
}

.upload-area:hover {
  border-color: #0d6efd;
  background-color: #f8f9fa;
}

.upload-area.has-image {
  border: 1px solid #dee2e6;
  border-radius: 8px;
}

.upload-placeholder {
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-content {
  pointer-events: none;
}

.upload-icon {
  font-size: 3rem;
  color: #6c757d;
  margin-bottom: 1rem;
}

.upload-text {
  margin: 0.5rem 0;
  color: #495057;
  font-weight: 500;
}

.image-preview {
  position: relative;
  display: inline-block;
}

.preview-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-preview:hover .image-overlay {
  opacity: 1;
}

.upload-actions {
  text-align: center;
}
</style>
<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, watch, withDefaults, reactive, onMounted } from 'vue'
import * as cidadeService from '@/services/cidadesService';

interface Props {
  modelValue?: number
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Digite o nome da cidade',
})

const emit = defineEmits(['update:modelValue', 'selected'])

const query = ref("")
const showSuggestions = ref(false)
const highlightedIndex = ref(-1)
const selectedCity = ref<cidadeService.Cidade | null>(null)

var controle = reactive({
  cidades: [] as cidadeService.Cidade[],
  text: "",
  status: ""
})

onMounted(() => {
  buscarCidades()
})

const filteredCities = computed(() => {
  const q = String(query.value).trim().toLowerCase()
  if (!q) return []
  
  return controle.cidades.filter(city => 
    city.nome.toLowerCase().includes(q) || 
    city.estado.toLowerCase().includes(q)
  )
})

// Computed para exibir o texto no input
const displayText = computed(() => {
  if (selectedCity.value) {
    return `${selectedCity.value.nome} - ${selectedCity.value.estado}`
  }
  return query.value
})

function onInput() {
  // Limpar cidade selecionada quando o usuário digitar
  if (selectedCity.value) {
    selectedCity.value = null
    emit('update:modelValue', undefined)
  }
  
  showSuggestions.value = true
  highlightedIndex.value = -1
}

function selectCity(city: cidadeService.Cidade) {
  selectedCity.value = city
  query.value = "" // Limpar query para não interferir no displayText
  showSuggestions.value = false
  highlightedIndex.value = -1
  
  emit('update:modelValue', city.cidadeId)
  emit('selected', city)
}

function hideSuggestions() {
  // Delay to allow click event on suggestion
  setTimeout(() => {
    showSuggestions.value = false
    highlightedIndex.value = -1
  }, 150)
}

function handleKeyDown(event: KeyboardEvent) {
  if (!showSuggestions.value || !filteredCities.value.length) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      highlightedIndex.value = Math.min(
        highlightedIndex.value + 1,
        filteredCities.value.length - 1
      )
      break

    case 'ArrowUp':
      event.preventDefault()
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
      break

    case 'Enter':
      event.preventDefault()
      if (highlightedIndex.value >= 0 && highlightedIndex.value < filteredCities.value.length) {
        selectCity(filteredCities.value[highlightedIndex.value])
      }
      break

    case 'Escape':
      event.preventDefault()
      showSuggestions.value = false
      highlightedIndex.value = -1
      break
  }
}

// Watch para sincronizar com modelValue externo
watch(() => props.modelValue, (newValue) => {
  if (newValue && controle.cidades.length > 0) {
    // Buscar a cidade pelo ID
    const cidade = controle.cidades.find(c => c.cidadeId === newValue)
    if (cidade) {
      selectedCity.value = cidade
      query.value = ""
    }
  } else if (!newValue) {
    selectedCity.value = null
    query.value = ""
  }
})

// Watch para buscar cidade quando o modelValue muda e ainda não temos as cidades
watch(() => controle.cidades, (cidades) => {
  if (props.modelValue && cidades.length > 0) {
    const cidade = cidades.find(c => c.cidadeId === props.modelValue)
    if (cidade) {
      selectedCity.value = cidade
      query.value = ""
    }
  }
})

// Reset highlighted index when filtered cities change
watch(filteredCities, () => {
  highlightedIndex.value = -1
})

function buscarCidades() {
  controle.status = "Buscando cidades...";

  cidadeService.obter({tamanhoPagina: 6000}).then(response => {
    controle.cidades = response;
    controle.status = "";
  }).catch(error => {
    console.error("Erro ao buscar cidades:", error);
    controle.status = `Erro ${error.message}`;
  })
}
</script>

<template>
  <div class="autocomplete-cidade">
    <input
      type="text"
      :value="displayText"
      @input="(e) => { query = (e.target as HTMLInputElement).value; onInput(); }"
      @focus="showSuggestions = true"
      @blur="hideSuggestions"
      @keydown="handleKeyDown"
      :placeholder="placeholder"
      class="autocomplete-input form-control form-control-sm"
    />
    <ul v-if="showSuggestions && filteredCities.length" class="suggestions-list">
      <li
        v-for="(city, index) in filteredCities"
        :key="city.cidadeId"
        @mousedown.prevent="selectCity(city)"
        @mouseenter="highlightedIndex = index"
        :class="{ 
          'suggestion-item': true,
          'highlighted': index === highlightedIndex 
        }"
      >
        <strong>{{ city.nome }}</strong>
        <span class="city-uf"> - {{ city.estado }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.autocomplete-cidade {
  position: relative;
  width: 100%;
}

.autocomplete-input {
  width: 100%;
  padding: 8px 12px;
  box-sizing: border-box;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
}

.autocomplete-input:focus {
  outline: none;
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.suggestions-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ced4da;
  border-top: none;
  border-radius: 0 0 4px 4px;
  max-height: 180px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.suggestion-item {
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid #f8f9fa;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.suggestion-item:hover,
.suggestion-item.highlighted {
  background: #e3f2fd;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.city-uf {
  color: #6c757d;
  font-size: 12px;
}
</style>
<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, watch, withDefaults, reactive, onMounted } from 'vue'
import * as cidadeService from '@/services/cidadesService';

interface Props {
  modelValue?: number
  placeholder?: string
}

var props = defineProps<Props>();
const emit = defineEmits(['update:modelValue', 'selected'])


var controle = reactive({
  cidades: [] as cidadeService.Cidade[],
  cidadeId: null as number | null,
  text: "",
  status: ""
})

onMounted(() => {
  buscarCidades()
})



function selecionar() {
 
  var cidade =   controle.cidades.find(c => c.cidadeId === controle.cidadeId)
  if (cidade) {
    emit('update:modelValue', cidade.cidadeId)
    emit('selected', cidade)
  }
}


// Watch para sincronizar com modelValue externo
watch<number | undefined>(() => props.modelValue, (newValue) => {
  controle.cidadeId = newValue ?? null;
})


function buscarCidades() {
  controle.status = "Buscando cidades...";

  cidadeService.obter({ativo:true, tamanhoPagina: 6000}).then(response => {
    controle.cidades = response;
    controle.status = "";
  }).catch(error => {
    console.error("Erro ao buscar cidades:", error);
    controle.status = `Erro ${error.message}`;
  })
}
</script>

<template>
    <select v-model="controle.cidadeId" class="form-select form-select-sm" @change="selecionar()">
        <option :value="null">- Selecione -</option>
        <option v-for="cidade in controle.cidades" :key="cidade.cidadeId" :value="cidade.cidadeId">
            {{ cidade.nome }} - {{ cidade.estado }}
        </option>
    </select>
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
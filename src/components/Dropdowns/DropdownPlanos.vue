<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, watch, withDefaults, reactive, onMounted } from 'vue'
import * as service from '@/services/planosService';

interface Props {
  modelValue?: number
  placeholder?: string
}

var props = defineProps<Props>();
const emit = defineEmits(['update:modelValue', 'selected'])


var controle = reactive({
  items: [] as service.Plano[],
  id: null as number | null,
  text: "",
  status: ""
})

onMounted(() => {
  buscarItens()
})



function selecionar() {

  var plano =   controle.items.find(c => c.planoId === controle.id)
  if (plano) {
    emit('update:modelValue', plano.planoId)
    emit('selected', plano)
  }
}


// Watch para sincronizar com modelValue externo
watch<number | undefined>(() => props.modelValue, (newValue) => {
  controle.id = newValue ?? null;
})


function buscarItens() {
  controle.status = "Buscando...";

  service.obter({ativo:true, tamanhoPagina: 6000}).then(response => {
    controle.items = response;
    controle.status = "";
  }).catch(error => {
    console.error("Erro ao buscar itens:", error);
    controle.status = `Erro ${error.message}`;
  })
}
</script>

<template>
    <select v-model="controle.id" class="form-select form-select-sm" @change="selecionar()">
        <option :value="null">- Selecione -</option>
        <option v-for="item in controle.items" :key="item.planoId" :value="item.planoId">
            {{ item.nome }} 
        </option>
    </select>
</template>

<style scoped>
</style>
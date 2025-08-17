<script setup lang="ts">
import { defineProps, defineEmits, watch,  reactive, onMounted } from 'vue'


interface Props {
  modelValue?: boolean
  placeholder?: string
}

var props = defineProps<Props>();
const emit = defineEmits(['update:modelValue', 'selected'])

var controle = reactive({
  valor: props.modelValue,
  text: "",
  status: ""
})

function selecionar() {
    emit('update:modelValue', controle.valor);
    emit('selected', controle.valor)
}


watch<boolean | undefined>(() => props.modelValue, (newValue) => {
  controle.valor = newValue ?? false;
})

</script>

<template>
    <select v-model="controle.valor" class="form-select form-select-sm" @change="selecionar()">
        <option :value="null">- Selecione -</option>
        <option :value="true">Sim</option>
        <option :value="false">Não</option>
    </select>
</template>

<style scoped>
</style>
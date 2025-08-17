<script setup lang="ts">
  import { defineProps, defineEmits, reactive } from 'vue'
  import TextBox from "../../../components/TextBox/Index.vue";
  import UploadFoto from "../../../components/UploadFoto/Index.vue";
  const props = defineProps<{
    campo: any
    modelValue: any
  }>()

  const emit = defineEmits(['update:modelValue'])

 var controle = reactive({
  valor: props.modelValue
 });

  function onUpload(e: Event) {
    const input = e.target as HTMLInputElement
    if (!input.files) return
    // Aqui você pode emitir o arquivo ou tratar como preferir
    emit('update:modelValue', input.files[0])
  }

  function updateValue(e: any) {
    console.log('updateValue', e)
    emit('update:modelValue', e.target.value)
  }
</script>

<template>
  <div class="row align-items-center">
    <label :for="campo.nome" class="form-label col-md-3">
      {{ campo.rotulo }}
    </label>
    <div :class="campo.classeCol || 'col-md-9'">

      <TextBox
      v-if="['Texto', 'Numero', 'DoisDecimais', 'TresDecimais', 'Data', 'CpfCnpj', 'Telefone', 'Cep', 'Maiusculo', 'Minusculo'].includes(campo.tipo)"
      :id="campo.nome"
      class="form-control form-control-sm"
      v-model="controle.valor"
      :formato="campo.tipo"
      :required="campo.obrigatorio"
      :readonly="campo.readOnly"
    />

    <input
      v-if="['text', 'email', 'number', 'password'].includes(campo.tipo)"
      :id="campo.nome"
      class="form-control form-control-sm"
      v-model="controle.valor"
      :type="campo.tipo"
      :required="campo.obrigatorio"
      @input="(e) => {updateValue(e)}"
      :readonly="campo.readOnly"
    />

    <select
      v-else-if="campo.tipo === 'select'"
      class="form-select"
      v-model="controle.valor"
      :id="campo.nome"
      :required="campo.obrigatorio"
      @change="(e) => {updateValue(e)}"
      :readonly="campo.readOnly">
      <option :value="null">Selecione</option>
      <option
        v-for="op in campo.opcoes || []"
        :key="op.valor"
        :value="op.valor"
      >
        {{ op.texto }}
      </option>
    </select>

    <textarea
      v-else-if="campo.tipo === 'textarea'"
      :id="campo.nome"
      class="form-control form-control-sm"
      v-model="controle.valor"
      :required="campo.obrigatorio"
      :readonly="campo.readOnly"
      @input="updateValue(($event.target as HTMLTextAreaElement).value)"
    ></textarea>

    <div v-else-if="campo.tipo === 'upload'" class="mb-3">
      <input
        type="file"
        :id="campo.nome"
        class="form-control form-control-sm"
        :accept="campo.aceitar"
        @change="onUpload"
      />
      <small class="form-text text-muted">Envie um arquivo</small>
    </div>

    <div v-else-if="campo.tipo === 'UploadFoto'" class="mb-3">
      <UploadFoto
        :id="campo.nome"
        v-model="controle.valor"
        :accept="campo.aceitar"
      />
    </div>

    <div v-else-if="campo.tipo === 'checkbox'" class="form-check">
      <input
        type="checkbox"
        class="form-check-input"
        :id="campo.nome"
        v-model="controle.valor"
        @input="updateValue(($event.target as HTMLInputElement).checked)"
      />
    </div>
  </div>
  </div>
</template>

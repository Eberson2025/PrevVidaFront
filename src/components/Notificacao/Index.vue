<script setup lang="ts">
import {watch, reactive, defineProps, defineEmits} from "vue";

interface IProps {
  erro?: string | null;
  progresso?: string | null;
  sucesso?: string | null;
}

var props = defineProps<IProps>();

var emit = defineEmits(["limparErro", "limparProgresso", "limparSucesso"]);

var controle = reactive({
  erro: "" as string,
  progresso: "" as string,
  sucesso: "" as string,
  exibeScrollToTop: false,
});

const exibeErro = (texto: string) => {
  controle.erro = texto;

  // setTimeout(() => {
  //   controle.erro = "";
  //   emit("limparErro");
  // }, 5000);
};
const limpaErro = () => {
  controle.erro = "";
  emit("limparErro");
};

const exibeProgresso = (texto: string) => {
  controle.progresso = texto;

  setTimeout(() => {
    controle.progresso = "";
    emit("limparProgresso");
  }, 2000);
};

const exibeSucesso = (texto: string) => {
  controle.sucesso = texto;

  setTimeout(() => {
    controle.sucesso = "";
    emit("limparSucesso");
  }, 3500);
};

watch(
  () => props.erro,
  async (novoValor) => {
    exibeErro(novoValor || "");
  },
);

watch(
  () => props.progresso,
  async (novoValor) => {
    exibeProgresso(novoValor || "");
  },
);

watch(
  () => props.sucesso,
  async (novoValor) => {
    exibeSucesso(novoValor || "");
  },
);
</script>

<template>
  <div class="toast-container position-fixed bottom-0 start-0 p-2">
    <div
      class="toast text-white bg-danger"
      :class="{show: controle.erro != null && controle.erro != ''}"
      role="alert"
      aria-live="assertive"
      aria-atomic="true">
      <div class="toast-header d-flex flex-row text-white bg-danger">
        <i class="fas fa-exclamation-triangle me-2" />
        <label class="flex-grow-1 fw-bold">Erro</label>
        <button
          type="button"
          class="btn-sm btn-close-white btn-close"
          data-bs-dismiss="toast"
          aria-label="Close"
          @click="limpaErro"></button>
      </div>
      <div class="toast-body">
        {{ controle.erro }}
      </div>
    </div>

    <div
      class="toast text-white bg-primary"
      v-show="controle.progresso != null && controle.progresso != ''"
      :class="'show'"
      role="alert"
      aria-live="assertive"
      aria-atomic="true">
      <div class="toast-body p-1"><i class="fa fa-cog fa-spin"></i> {{ controle.progresso }}</div>
    </div>

    <div
      class="toast text-white bg-success"
      v-show="controle.sucesso != null && controle.sucesso != ''"
      :class="'show'"
      role="alert"
      aria-live="assertive"
      aria-atomic="true">
      <div class="toast-body p-1"><i class="fas fa-check"></i> {{ controle.sucesso }}</div>
    </div>
  </div>
</template>

<style scoped></style>

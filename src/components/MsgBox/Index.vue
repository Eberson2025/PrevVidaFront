<script setup lang="ts">

//vue
import { reactive, onMounted, watch, computed , defineEmits, defineProps } from "vue";

//componentes
import { Modal } from "bootstrap";

interface IProps {
  id: string,
  exibir: boolean,
  botaoFechar?: boolean,
  botaoSim?: boolean,
  botaoNao?: boolean,
  botaoGravar?: boolean,
  botaoGravarTipo?: 'button' | 'submit'
  titulo?: string,
  classBody?: string,
  classHeader?: string,
  tamanho?: 'modal-sm' | 'modal-lg' | 'modal-xl'
}

var props = defineProps<IProps>();

const controle = reactive({
  id: props.id,
  modal: {} as Modal,
  exibir: false,
  titulo: props.titulo,
  tamanho: props.tamanho
});

var emit = defineEmits(["onSim", "onNao", "onOk", "onFechou", "onGravar"]);

onMounted(() => {
  if (props.id == undefined || props.id == "")
    controle.id = "janMsgBox";
})

watch(() => props.id, async (novoValor) => {
  if (novoValor == undefined || novoValor == "")
    controle.id = "janMsgBox";
  else
    controle.id = novoValor;
})

watch(() => props.exibir, async (novoValor, antigoValor) => {

  if (novoValor == true && novoValor != antigoValor) {
    controle.exibir = true;
    exibirModal();
    controle.tamanho = props.tamanho;
  }
  else
    fecharModal();
})

watch(() => props.titulo, async (novoValor) => {
  controle.titulo = novoValor;
})

watch(() => props.tamanho, async (novoValor) => {
  controle.tamanho = novoValor;
})

function exibirModal() {
  controle.modal = new Modal(`#${controle.id}`, {})
  controle.modal.show();
}

function fecharModal() {
  console.log("fecharModal");
  controle.modal.hide();
  emit("onFechou");
}

const temBotoes = computed(() => {
  return props.botaoFechar || props.botaoSim || props.botaoNao || props.botaoGravar;
})
</script>
<template>
  <div class="modal fade" :id="controle.id" tabindex="-1" data-bs-keyboard="false" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered" :class="tamanho ? tamanho : ''" v-bind="$attrs">
      <div class="modal-content">
        <div class="modal-header d-flex justify-content-between " :class="props.classHeader">
          <h5 class="modal-title fw-bold" id="exampleModalLabel">{{ !controle?.titulo ? 'Atenção' : controle.titulo }}
          </h5>
          <a type="button" class="" @click="fecharModal()">
            <i class="fa fa-times"></i>
          </a>
        </div>
        <div class="modal-body" :class="props.classBody">
          <slot></slot>
        </div>
        <div class="modal-footer p-2" v-if="temBotoes">
          <div class="row w-100 ">
            <div class="col-6 ps-0">
              <a class="btn btn-primary btn-sm " v-if="props.botaoSim" @click="() => { emit('onSim'); fecharModal(); }">
                <i class="fas fa-check" /> Sim
              </a>

              <button class="btn btn-primary btn-sm " v-if="props.botaoGravar" @click="() => { emit('onGravar'); }"
                :type="botaoGravarTipo ? botaoGravarTipo : botaoGravarTipo">
                <i class="fa fa-save" /> Gravar
              </button>
            </div>

            <div class="col-6  pe-0 text-end">
              <a class="btn btn-secondary btn-sm " v-if="props.botaoNao"
                @click="() => { emit('onNao'); fecharModal(); }">
                <i class="fas fa-times" /> Não
              </a>
              <a class="btn btn-secondary btn-sm" type="button" v-if="props.botaoFechar" @click="fecharModal()">
                <i class="fas fa-times" /> Fechar
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
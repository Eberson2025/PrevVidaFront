<script lang="ts" setup>
  import { defineComponent, onMounted, reactive } from "vue";
  import { useRoute } from 'vue-router';

  import BreadCrumb from "../../components/Common/BreadCrumb.vue";

  //servicos
  import * as service from "@/services/clientesContratosService";

  //componentes
  import ReportView from "@/components/ReportView/Index.vue";

  const route = useRoute();

  var controle = reactive({
    filtros: {
      paginaAtual: 1,
      tamanhoPagina: 1
    } as unknown as service.Filtros,
    model: {} as service.Contrato,


    status: "",
    erro: "",
  })

  onMounted(async ()=>{
    pesquisar();
  })

  async function pesquisar() {

    if (route.params.id) {
      controle.filtros.contratoId = parseInt(route.params.id as string);
    }

    service.obter(controle.filtros)
    .then(r=> {
      controle.model = r[0];
    })
    .catch(erro=> {
      controle.erro = erro;
    })
  }

</script>

<template>
  <BreadCrumb PageTitle="Contratos" />

  <ReportView :titulo="'Contrato'" > 
    <div v-html="controle.model.texto"></div>
  </ReportView>
</template>

<style lang="css" scoped>


</style>
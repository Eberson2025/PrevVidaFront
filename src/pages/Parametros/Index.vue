<script lang="ts" setup>
  import { defineComponent, onMounted, reactive } from "vue";

  import BreadCrumb from "../../components/Common/BreadCrumb.vue";

  //servicos
  import * as service from "@/services/paramsService";

  //componentes
  import Paginador from "@/components/Paginador/Index.vue";
 

  var controle = reactive({
    filtros: {
      paginaAtual: 1 as number | undefined,
      tamanhoPagina: 20 as number | undefined
    } as unknown as service.Filtros,
    itens: [] as service.Param[],

    status: "",
    erro: "",

    ordenacao: {
      coluna: '',
      asc: true
    },
  })

  onMounted(async ()=>{
    pesquisar();
  })

  async function pesquisar() {

    service.obter(controle.filtros)
    .then(r=> {
      controle.itens = r;
    })
    .catch(erro=> {
      controle.erro = erro;
    })
  }
</script>

<template>
  <BreadCrumb PageTitle="Parâmetros" />

  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="col-md-6">
          <label><i class="flaticon-search"></i> Pesquisar</label>
          <input type="text" class="form-control form-control-sm" placeholder="Id..." v-model="controle.filtros.paramId" @keyup="pesquisar" />
        </div>

        <div class="col-md-6">
          <RouterLink class="btn btn-primary btn-sm mt-4 float-end" :to="'/parametros/cadastro'"><i class="flaticon-plus"></i> Adicionar</RouterLink>
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-md-12">
          <table class="table  align-middle mb-0 table-hover">
            <thead>
              <tr>
                <th class="th-sortable">Id</th>
                <th class="th-sortable">Empresa</th>
                <th>Opções</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,idx) in controle.itens" :key="idx" class="align-middle">
                <td>{{item.paramId}}</td>
                <td>
                  {{item.nomeEmpresa}}
                </td>
                <td class="text-center">
                  <RouterLink  
                    :to="'/parametros/cadastro/' + item.paramId"
                    class="btn btn-outline-primary btn-sm" 
                    title="Editar">
                    <i class="flaticon-pen"></i>
                  </RouterLink>
                </td>
              </tr>
            </tbody>
          </table>  
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-md-6">
           {{ controle.itens.length }} Registros
        </div>
        <div class="col-md-6">
          <Paginador class="float-end"
            :paginaAtual="controle.filtros.paginaAtual ?? 1"
            :tamanhoPagina="controle.filtros.tamanhoPagina ?? 20"
            :totalItens="controle.itens.length"
            @paginaMudou="pesquisar"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>

.form-control {
  background: #F5F4FA;
}

.th-sortable {
  cursor: pointer;
  user-select: none;
}
</style>
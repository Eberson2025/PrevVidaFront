<script lang="ts" setup>
  import { defineComponent, onMounted, reactive } from "vue";

  import BreadCrumb from "../../components/Common/BreadCrumb.vue";

  //servicos
  import * as planoService from "@/services/planosService";
  import {f2dec} from "@/utils/funcoes";

  //componentes
  import Paginador from "@/components/Paginador/Index.vue";

  var controle = reactive({
    filtros: {
      statusId: null,
      tipoId: null,
      paginaAtual: 1,
      tamanhoPagina: 20
    } as unknown as planoService.Filtros,
    itens: [] as planoService.Plano[],

    tipos: ['- Todos -','Particular','Empresarial'] ,
    listaStatus:[ 
      {valor: null, descricao:"- Todos -"},
      {valor: true, descricao:"Ativos"},       
      {valor: false, descricao:"Inativos"},
    ],

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

    planoService.obter(controle.filtros)
    .then(r=> {
      controle.itens = r;
    })
    .catch(erro=> {
      controle.erro = erro;
    })
  }

  function ordenarPor(coluna: string) {
    if (controle.ordenacao.coluna === coluna) {
      controle.ordenacao.asc = !controle.ordenacao.asc;
    } else {
      controle.ordenacao.coluna = coluna;
      controle.ordenacao.asc = true;
    }
    controle.itens.sort((a, b) => {
      let valA = (a as Record<string, any>)[coluna];
      let valB = (b as Record<string, any>)[coluna];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return controle.ordenacao.asc ? -1 : 1;
      if (valA > valB) return controle.ordenacao.asc ? 1 : -1;
      return 0;
    });
  }
</script>

<template>
  <BreadCrumb PageTitle="Planos" />

  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="col-md-3">
          <label><i class="flaticon-search"></i> Pesquisar</label>
          <input type="text" class="form-control form-control-sm" placeholder="Descrição..." v-model="controle.filtros.nome" @keyup="pesquisar" />
        </div>

        <div class="col-md-3">
          <label>Tipo</label>
          <select class="form-select form-select-sm" v-model="controle.filtros.tipo" @change="pesquisar">
            <option :value="null">- Todos -</option>
            <option v-for="(item,idx) in controle.tipos" :value="item" :key="idx">{{ item }}</option>
          </select>
        </div>

        <div class="col-md-3">
          <label>Status</label>
           <select class="form-select form-select-sm" v-model="controle.filtros.ativo" @change="pesquisar">
            <option v-for="(item,idx) in controle.listaStatus" :value="item.valor" :key="idx">{{ item.descricao }}</option>
          </select>
        </div>

        <div class="col-md-3">
          <RouterLink class="btn btn-primary btn-sm mt-4 float-end" :to="'/planos/cadastro'"><i class="flaticon-plus"></i> Adicionar</RouterLink>
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-md-12">
          <table class="table  align-middle mb-0 table-hover">
            <thead>
              <tr>
                <th @click="ordenarPor('usuarioId')" class="th-sortable">Id</th>
                <th @click="ordenarPor('nomeCompleto')" class="th-sortable">Nome</th>
                <th @click="ordenarPor('tipoId')" class="th-sortable">Tipo</th>
                <th @click="ordenarPor('email')" class="th-sortable">Valor</th>
                <th @click="ordenarPor('ativo')" class="th-sortable">Status</th>
                <th>Opções</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,idx) in controle.itens" :key="idx" class="align-middle">
                <td>{{item.planoId}}</td>
                <td>
                  {{item.nome}}
                </td>
                <td>{{item.tipo}}</td>
                <td class="text-end">{{f2dec(item.valor)}}</td>
                <td>
                  {{ item.ativo ? 'Ativo' : 'Inativo' }}
                </td>
                <td class="text-end">
                  <div class="dropdown">
                    <button
                      class="dropdown-toggle lh-1 bg-transparent border-0 shadow-none p-0 transition"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i class="flaticon-dots"></i>
                    </button>
                    <ul class="dropdown-menu">
                      <li>
                        <RouterLink class="dropdown-item d-flex align-items-center" :to="'/planos/cadastro/' + item.planoId">
                          <i class="flaticon-pen lh-1 me-8 position-relative top-1"></i>
                          Editar
                        </RouterLink>
                      </li>
                      <li>
                        <a class="dropdown-item d-flex align-items-center" href="javascript:void(0);" >
                          <i  class="flaticon-delete lh-1 me-8 position-relative top-1" ></i>
                          Excluir
                        </a>
                      </li>
                    </ul>
                  </div>
                  
                </td>
              </tr>
            </tbody>
          </table>  
        </div>
      </div>
    </div>
    <div class="card-footer">
      <div class="row mt-2">
        <div class="col-md-6">
          {{ controle.itens.length }} Registros
        </div>
        <div class="col-md-4">
          <Paginador class="float-end"
            :paginaAtual="controle.filtros.paginaAtual"
            :tamanhoPagina="controle.filtros.tamanhoPagina"
            :totalItens="controle.itens.length"
            @paginaMudou="pesquisar"/>
        </div>
        <div class="col-md-2">
          <RouterLink class="btn btn-secondary btn-sm  float-end" :to="'/'"><i class="flaticon-close"></i> Fechar</RouterLink>
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
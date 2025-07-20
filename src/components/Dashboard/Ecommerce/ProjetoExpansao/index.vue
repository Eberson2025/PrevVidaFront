<script lang="ts" setup>

  import { onMounted, reactive } from "vue";
  import meses from "./meses.json";
  import {f2dec} from "@/utils/funcoes";

  interface Item {
    mes: number,
    vlrCusto: number,
    qtdeVendas: number,
    qtdeAcum: number,
    vlrLucroMes: number,
    vendasAcum: number,
  }

  var controle = reactive({
    qtdeVendedores: 1,
    percLucro: 11,
    vlrPlano: 75,
    itens: [] as Item[],

    qtdeAcum: 0,
    vendasAcum: 0,
    lucroAcum:0,
  })

  onMounted(()=> {
    
    calcularValores();
  })

 function calcularValores() {
    controle.itens = [];

    controle.qtdeAcum = 0;
    controle.vendasAcum = 0;
    controle.lucroAcum = 0;

    meses.forEach(a=> {

      controle.qtdeAcum += parseInt(a.qtdeVendas) * controle.qtdeVendedores;

      var item = {}as Item;
      
      item.mes = parseInt(a.mes);
      item.vlrCusto = controle.qtdeVendedores * parseFloat(a.custo);
      item.qtdeVendas = controle.qtdeVendedores * parseInt(a.qtdeVendas);
      item.qtdeAcum =  controle.qtdeAcum;
      var vendasMes = (((item.qtdeAcum * controle.vlrPlano) ) ) * (controle.percLucro / 100)
      item.vlrLucroMes = ( ( item.qtdeAcum) * controle.vlrPlano) * (controle.percLucro / 100);
      
      controle.vendasAcum += item.vlrLucroMes;
      item.vendasAcum = controle.vendasAcum;

      

      controle.itens.push(item);
    })
 }

</script>

<template>
  <div class="card mb-25 border-0 rounded-0 bg-white">
    <div class="card-body p-15 p-sm-20 p-md-25 p-lg-30 letter-spacing">
      <div
        class="mb-15 mb-md-30 d-sm-flex align-items-center justify-content-between"
      >
        <h6 class="card-title fw-bold mb-0">Projeto de expansão</h6>
        <div
          class="card-select mt-10 mt-sm-0 mb-10 mb-sm-0 d-flex align-items-center ps-10 pe-10 pt-5 pb-5"
        >
          <span class="fw-medium text-muted me-8">Vendedores</span>
          <select v-model="controle.qtdeVendedores" @change="calcularValores()"
            class="form-select shadow-none text-black border-0 ps-0 pt-0 pb-0 pe-20 fs-14 fw-medium"
          >
            <option :value="n" class="fw-medium" v-for="n in 20" :key="n">{{n}}</option>
          </select>
        </div>

      </div>
      <div class="table-responsive">
        <table class="table text-nowrap align-middle mb-0">
          <thead>
            <tr>
              <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0 ps-0 text-end"
              >
                Mês
              </th>
              <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0 text-end"
              >
                Custo R$
              </th>
              <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0 text-end"
              >
                Vendas
              </th>
              <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0 text-end"
              >
                Vendas Acumulada
              </th>
              <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0 text-end"
              >
                Lucro {{ f2dec(controle.percLucro) }}%
              </th>
              <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0 pe-0 text-end"
              >
                Luco Acumulado R$
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in controle.itens" :key="idx">
              <th class="shadow-none lh-1 fw-bold ps-0 text-end">
                <router-link
                  to="/product-details"
                  class="text-decoration-none text-black"
                >
                  {{ item.mes }}
                </router-link>
              </th>
              <td class="shadow-none lh-1 fw-semibold  text-end" :class="item.vlrCusto > 0? 'text-danger' : 'text-black'">
                R$ {{ f2dec(item.vlrCusto) }}
              </td>
              <td class="shadow-none lh-1 fw-medium  text-end text-black">
                {{ item.qtdeVendas }}
              </td>
              <td class="shadow-none lh-1 fw-medium text-end text-black">
                {{ item.qtdeAcum }}
              </td>
              <td class="shadow-none lh-1 fw-medium text-end">
                 R$ {{  f2dec(item.vlrLucroMes)  }}
                <span :class="['badge', item.class]">{{ item.status }}</span>
              </td>
              <td class="shadow-none lh-1 text-end  pe-0" :class="item.vendasAcum > controle.itens[0].vlrCusto ? 'text-blue fw-bold' : 'text-danger'">
                 R$ {{  f2dec(item.vendasAcum)  }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>

.text-blue {
  color: blue;
}
</style>
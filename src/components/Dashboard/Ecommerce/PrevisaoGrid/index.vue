<script lang="ts" setup>
import { defineComponent, reactive, defineProps, watch } from "vue";

  import * as serviceDashboard from "@/services/DashboardInvestidor";
  import {f2dec} from "@/utils/funcoes";

  interface IProps {
    previsao: serviceDashboard.PrevisaoDTO[]
  }

  var props = defineProps<IProps>();

  var controle = reactive({
    previsao:[] as serviceDashboard.PrevisaoDTO[]
  });

  watch(() => props.previsao, async (novo: any, antigo: any) => {
    
    console.log("montando2...");

    controle.previsao = novo;
  });
</script>

<template>
  <div class="card mb-25 border-0 rounded-0 bg-white">
    <div class="card-body p-15 p-sm-20 p-md-25 p-lg-30 letter-spacing">
      <div
        class="mb-15 mb-md-30 d-sm-flex align-items-center justify-content-between"
      >
        <h6 class="card-title fw-bold mb-0">Previsão recebimentos</h6>
        <!-- <div
          class="card-select mt-10 mt-md-0 mb-10 mb-md-0 d-inline-block d-sm-flex align-items-center ps-10 pe-10 pt-5 pb-5"
        >
          <span class="fw-medium text-muted me-8">Status</span>
          <select
            class="form-select shadow-none text-black border-0 ps-0 pt-0 pb-0 pe-20 fs-14 fw-medium"
          >
            <option selected class="fw-medium">Show All</option>
            <option value="1" class="fw-medium">In Stock</option>
          </select>
        </div>
        <form>
          <div class="input-group">
            <input
              type="text"
              class="form-control shadow-none fw-medium ps-12 pt-8 pb-8 pe-12 letter-spacing"
              placeholder="Search"
            />
            <button
              class="default-btn position-relative transition border-0 text-white ps-12 pe-12 rounded-1"
              type="button"
            >
              <i class="flaticon-search-interface-symbol position-relative"></i>
            </button>
          </div>
        </form> -->
      </div>
      <div class="table-responsive">
        <table class="table text-nowrap align-middle mb-0">
          <thead>
            <tr>
              <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0 ps-0"
              >
                MÊS
              </th>
              <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
              >
                PARCELAS
              </th>
              <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
              >
                TOTAL
              </th>
             <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
              >
                PARCELAS ACUM
              </th>
              <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
              >
                TOTAL ACUM
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in controle.previsao" :key="idx">
              <th class="shadow-none lh-1 fw-bold ps-0">
                <!-- <router-link
                  to="/product-details"
                  class="text-decoration-none text-black-emphasis"
                > -->
                  {{ item.mes }}
                <!-- </router-link> -->
              </th>
              <td class="shadow-none lh-1 fw-medium">
                {{ item.qtde }}
              </td>
             
              <td class="shadow-none lh-1 fw-medium text-body-tertiary">
                R$ {{ f2dec(item.valor) }}
              </td>
             
               <td class="shadow-none lh-1 fw-medium">
                {{ item.qtdeAcum }}
              </td>
             
              <td class="shadow-none lh-1 fw-medium text-body-tertiary">
                R$ {{ f2dec(item.valorAcum) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>


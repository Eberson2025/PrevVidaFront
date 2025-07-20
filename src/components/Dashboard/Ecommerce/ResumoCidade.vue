
<script lang="ts" setup>
import {  reactive, defineProps } from "vue";

import * as serviceDashboard from "@/services/DashboardInvestidor";
import {f2dec} from "@/utils/funcoes";

export interface Iprops {
  resumoCidade: serviceDashboard.ResumoCidadeDto
}

var props = defineProps<Iprops>();

var controle = reactive({
  earnings: [ props.resumoCidade.totalRecebido, props.resumoCidade.totalAtrasado,props.resumoCidade.totalReceber],
  earningChart: {
        dataLabels: {
          enabled: false,
        },
        colors: ["#06B48A", "#6560F0", "#6FD3F7"],
        legend: {
          show: false,
          fontWeight: 500,
          fontSize: "14px",
          fontFamily: "Red Hat Display, sans-serif",
          labels: {
            colors: "#9C9AB6",
          },
          markers: {
            offsetX: -2,
            offsetY: 1,
          },
        },
        stroke: {
          width: 0,
        },
        tooltip: {
          enabled: false,
          style: {
            fontSize: "14px",
            fontFamily: "Red Hat Display, sans-serif",
          },
        },
      },
})


</script>

<template>
  <div class="card mb-25 border-0 rounded-0 bg-white expected-earnings-box">
    <div class="card-body p-15 p-sm-20 p-md-25 p-lg-30 letter-spacing">
      <span
        class="d-block mb-6 fs-13 text-uppercase fw-medium text-dark-emphasis"
      >
        {{ props.resumoCidade.nomeCidade }}
      </span>
      <h4 class="fw-black mb-12 lh-1">R$ {{f2dec(props.resumoCidade.totalContratos)}}</h4>
      <span class="fw-bold text-success text-badge d-inline-block">
        5.5%
        <i class="flaticon-up-arrow fs-11 lh-1 position-relative top-1"> </i>
      </span>
      <ul class="list ps-0 mb-0 list-unstyled mt-15">
        <li class="text-muted position-relative fw-medium">
          Recebido - <span class="text-black fw-bold">R$ {{ f2dec(props.resumoCidade.totalRecebido) }}</span>
        </li>
        <li class="text-muted position-relative fw-medium">
          Atrasado - <span class="text-black fw-bold">R$ {{ f2dec(props.resumoCidade.totalAtrasado) }}</span>
        </li>
        <li class="text-muted position-relative fw-medium">
          Receber - <span class="text-black fw-bold">R$ {{ f2dec(props.resumoCidade.totalReceber) }}</span>
        </li>
      </ul>
      <div id="earningChart" class="chart">
        <apexchart
          type="donut"
          height="150"
          :options="controle.earningChart"
          :series="controle.earnings"
        ></apexchart>
      </div>
    </div>
  </div>
</template>

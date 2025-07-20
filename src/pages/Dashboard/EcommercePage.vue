
<script lang="ts" setup>

import { defineComponent, reactive ,onMounted } from "vue";
import storeControle from "@/utils/storeControle";

import WhatHappening from "../../components/Dashboard/Ecommerce/WhatHappening.vue";

import StatBox from "../../components/Dashboard/Ecommerce/StatsBoxes/index.vue";

import PrevisaoReceber from "../../components/Dashboard/Ecommerce/PrevisaoReceber.vue";

import PrevisaoGrid from "../../components/Dashboard/Ecommerce/PrevisaoGrid/index.vue";

import ExpectedEarnings from "../../components/Dashboard/Ecommerce/ExpectedEarnings.vue";

import AverageDailySales from "../../components/Dashboard/Ecommerce/AverageDailySales.vue";

import RevenueThisMonth from "../../components/Dashboard/Ecommerce/RevenueThisMonth.vue";

import NewCustomersThisMonth from "../../components/Dashboard/Ecommerce/NewCustomersThisMonth.vue";



import WeeklySales from "../../components/Dashboard/Ecommerce/WeeklySales.vue";

import SalesByPOSLocation from "../../components/Dashboard/Ecommerce/SalesByPOSLocation.vue";

import TopSellingProducts from "../../components/Dashboard/Ecommerce/TopSellingProducts/index.vue";

import WebsiteVisitors from "../../components/Dashboard/Ecommerce/WebsiteVisitors.vue";

import ProductsOrders from "../../components/Dashboard/Ecommerce/ProductsOrders/index.vue";

import ProjetoExpansao  from "../../components/Dashboard/Ecommerce/ProjetoExpansao/index.vue";

import ResumoCidade from "../../components/Dashboard/Ecommerce/ResumoCidade.vue";

import * as serviceDashboard from "@/services/DashboardInvestidor";


var controle = reactive({
  dashboard: {} as serviceDashboard.Dashboard ,
  atualizando: false,
  status: "",
  erro: "",
})

onMounted(async ()=> {


  controle.status = "Buscando dados...";

  var param = {
    investidoresId:[storeControle.usuario?.usuarioId]

  } as serviceDashboard.FiltroMensalidades;

  controle.atualizando = true;

  serviceDashboard.obterDashboard(param)
  .then(r=> {
    controle.dashboard = r;
    controle.status = "";
    controle.atualizando = false;
  })
  .catch(erro => {
    controle.status = "";
    controle.erro = erro;
    controle.atualizando = false;
  })
})

</script>

<template>
   {{ controle.status }}
    <br>

  <div class="row">
   
    <div class="col-md-6">
      <WhatHappening 
        :nome-usuario="storeControle.usuario?.nomeUsuario" 
        :qtde-contratos="controle.dashboard.qtdeContratos" 
        :total-contratos="controle.dashboard.totalContratos"
        :atualizando="controle.atualizando"/>
    </div>
    
    <div class="col-md-3">
       <StatBox :class="'text-primary'" 
        :icon="'flaticon-form'"
        :title="'CONTRATOS'"
        :sign="''"
        :current-value="controle.dashboard.qtdeContratos"
        :previous-value="13.456"
        :class-two="'text-success'"
        :percent="5.5"
        :icon-up-down="'flaticon-up-arrow'"
        :atualizando="controle.atualizando"/>
    </div>
  
    <div class="col-md-3">
       <StatBox :class="'text-primary'" 
        :icon="'flaticon-marker'"
        :title="'CIDADES'"
        :sign="''"
        :current-value="controle.dashboard.resumoCidades?.length"
        :previous-value="0"
        :class-two="'text-success'"
        :percent="0"
        :icon-up-down="'flaticon-up-arrow'"
        :atualizando="controle.atualizando"/>
    </div>

    
    <div class="col-md-3">
       <StatBox :class="'text-secondary'" 
        :icon="'flaticon-menu'"
        :title="'PARCELAS MES'"
        :sign="''"
        :current-value="controle.dashboard.qtdeParcelasMes"
        :previous-value="0"
        :class-two="'text-success'"
        :percent="0"
        :icon-up-down="'flaticon-up-arrow'"
        :atualizando="controle.atualizando"/>
    </div>

     <div class="col-md-3">
       <StatBox :class="'text-danger'" 
        :icon="'flaticon-date-1'"
        :title="'PENDENTE MES'"
        :sign="'R$ '"
        :current-value="controle.dashboard.totalParcelasMes"
        :previous-value="0"
        :class-two="'text-success'"
        :percent="0"
        :icon-up-down="'flaticon-up-arrow'"
        :atualizando="controle.atualizando"/>
    </div>

     <div class="col-md-3">
       <StatBox :class="'text-success'" 
        :icon="'flaticon-check'"
        :title="'RECEBIDO MES'"
        :sign="''"
        :current-value="controle.dashboard.totalParcelasRecebidasMes"
        :previous-value="0"
        :class-two="'text-success'"
        :percent="0"
        :icon-up-down="'flaticon-up-arrow'"
        :atualizando="controle.atualizando"/>
    </div>

  </div>

  <div class="row">
      <div class="col-md-6 col-lg-6 col-xxxl-6 " v-for="(cidade, idx) in controle.dashboard.resumoCidades"  :key="idx">
        <ResumoCidade :resumo-cidade="cidade" :atualizando="controle.atualizando"/>
      </div>
  </div>

  <div class="row">
      <div class="col-md-12 col-lg-6 col-xxxl-12 " >
        <PrevisaoReceber :previsao="controle.dashboard.previsao" :atualizando="controle.atualizando"/>
      </div>

      <div class="col-md-12 col-lg-6 col-xxxl-12 " >
        <PrevisaoGrid :previsao="controle.dashboard.previsao" :atualizando="controle.atualizando"/>
      </div>
  </div>

  <div class="row">

    <div class="col-xxl-7 col-xxxl-6">

      

      <!-- <div class="row">
        <div class="col-lg-6 col-xxxl-6 col-md-6" v-for="(cidade, idx) in controle.dashboard.resumoCidades"  :key="idx">
          <ResumoCidade :resumo-cidade="cidade"/>
        </div>

          <div class="col-lg-6 col-xxxl-6 col-md-6" >
          <ExpectedEarnings />
        </div>
        <div class="col-lg-6 col-xxxl-6 col-md-6">
          <AverageDailySales />
        </div>
        <div class="col-xl-12 col-lg-6 col-xxxl-6 col-md-12">
          <RevenueThisMonth />
        </div>
        <div class="col-xl-12 col-lg-6 col-xxxl-6 col-md-12">
          <NewCustomersThisMonth />
        </div>
      </div> -->
    </div>
    <div class="col-xxl-5 col-xxxl-6">
      <!-- <WeeklySales /> -->
    </div>
    <div class="col-xxl-4">
      <!-- <SalesByPOSLocation /> -->
    </div>
    <div class="col-xxl-4">
      <!-- <TopSellingProducts /> -->
    </div>
    <div class="col-xxl-4">
      <!-- <WebsiteVisitors /> -->
    </div>
    <div class="col-xxl-6">
      <!-- <ProductsOrders /> -->
    </div>
    <div class="col-md-12 col-xxl-12">
      <ProjetoExpansao />
    </div>
  </div>
</template>

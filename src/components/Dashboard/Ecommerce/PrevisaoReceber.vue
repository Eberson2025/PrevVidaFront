<script lang="ts" setup>
  import { defineComponent, onMounted, reactive, defineProps, watch} from "vue";

  import * as serviceDashboard from "@/services/DashboardInvestidor";

  interface IProps {
    previsao: serviceDashboard.PrevisaoDTO[]
  }

  var props = defineProps<IProps>();

  var controle = reactive({
    task: [
        {
          name: "Mes",
          data: [250, 200, 280, 150, 190, 350, 220, 180],
        },
      ],
      taskOverviewChart: {
        chart: {
          type: "bar",
          height: 370,
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            columnWidth: "24%",
          },
        },
        dataLabels: {
          enabled: false,
        },
        colors: ["#6560F0"],
        stroke: {
          show: false,
        },
        xaxis: {
          categories: [
            "Spt_01",
            "Spt_02",
            "Spt_03",
            "Spt_04",
            "Spt_05",
            "Spt_06",
            "Spt_07",
            "Spt_08",
          ],
          labels: {
            show: true,
            style: {
              fontFamily: "Red Hat Display, sans-serif",
              colors: "#9C9AB6",
              fontSize: "14px",
              fontWeight: 500,
            },
          },
          axisTicks: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
        },
        yaxis: {
          show: true,
          tickAmount: 6,
          labels: {
            show: true,
            style: {
              fontFamily: "Red Hat Display, sans-serif",
              colors: ["#9C9AB6"],
              fontSize: "14px",
              fontWeight: 500,
            },
          },
          axisBorder: {
            show: true,
            color: "#eee",
          },
        },
        fill: {
          opacity: 1,
          // type: 'gradient',
          // gradient: {
          //     opacityTo: 1,
          //     opacityFrom: .01,
          //     type: "vertical",
          //     stops: [0, 60, 100]
          // }
        },
        tooltip: {
          style: {
            fontSize: "14px",
            fontFamily: "Red Hat Display, sans-serif",
          },
        },
        grid: {
          show: true,
          strokeDashArray: 5,
          borderColor: "#d9e9ef",
        },
      },
  });

  onMounted(()=>{
    console.log("montando...");
    
  })

  watch(() => props.previsao, async (novo: any, antigo: any) => {
    
    console.log("montando2...");

    var dados =  props.previsao?.map(a=> a.valor);
    var categorias = props.previsao?.map(a=> a.mes);
    var x = controle.taskOverviewChart.xaxis.categories;

    controle.taskOverviewChart.xaxis.categories = categorias;
    controle.task[0].data = dados;
  });


</script>


<template>
  <div class="card mb-25 border-0 rounded-0 bg-white">
    <div class="card-body p-15 p-sm-20 p-sm-25 p-lg-30 letter-spacing">
      <div class="d-sm-flex align-items-center justify-content-between">
        <h5 class="card-title fw-bold mb-0">Gráfico de Previsão Mensal</h5>
        
      </div>
      <div id="taskOverviewChart" class="chart">
        <apexchart
          type="bar"
          height="370"
          :options="controle.taskOverviewChart"
          :series="controle.task"
        ></apexchart>
      </div>
    </div>
  </div>
</template>


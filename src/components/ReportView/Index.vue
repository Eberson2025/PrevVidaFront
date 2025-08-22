<script setup lang="ts">

import { reactive, onMounted, defineProps, defineEmits } from "vue";

import "./relatorios.css"

export type IOrientacao = "Retrato" | "Paisagem";

interface IProps {
    titulo?: string,
    btnImprimir?: boolean,
    btnExcel?: boolean,
    btnLocalizar?: boolean,
    percZoom?: number,
    orientacao?: IOrientacao 
}

var props = defineProps<IProps>();

var emit = defineEmits(["onExcel", "onImprimir", "onZoom"]);

var controle = reactive({
    exibeFiltros: false,
    percZoom: props.percZoom,
    orientacao: props.orientacao
})

onMounted(() => {
    if (controle.percZoom == undefined || controle.percZoom == 0 || controle.percZoom == null)
        controle.percZoom = 100;

    if (controle.orientacao == undefined || controle.orientacao  == null)
        controle.orientacao =  "Retrato";

})

const imprimir = () => {
    window.print();
};


const zoom = (percZoom: number) => {
    controle.percZoom = percZoom;
    emit("onZoom", controle.percZoom);
}

const localizar = () => {

    var el = document.getElementById("btnLocalizar") as HTMLLinkElement;
    const evt = new KeyboardEvent('keydown', { key: "F3", which: 114 });
    document.dispatchEvent(evt);

}

const alternarOrientacao = ()=>{
   controle.orientacao = (controle.orientacao == "Retrato" ? "Paisagem" : "Retrato");
}



</script>



<template>

    <!-- <Container> -->
        <div class="report-view row">

            <nav class="navbar navbar-expand-lg bg-dark text-white  d-print-none"  data-bs-theme="dark">
                <div class="container-fluid">
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav me-auto">
                        

                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle fs-6 active" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="fa fa-search fa-2x"></i> {{ controle.percZoom }} %
                                </a>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="#" @click="zoom(25)">25 %</a></li>
                                    <li><a class="dropdown-item" href="#" @click="zoom(50)">50 %</a></li>
                                    <li><a class="dropdown-item" href="#" @click="zoom(75)">75 %</a></li>
                                    <li><a class="dropdown-item" href="#" @click="zoom(100)">100 %</a></li>
                                    <li><a class="dropdown-item" href="#" @click="zoom(125)">125 %</a></li>
                                    <li><a class="dropdown-item" href="#" @click="zoom(150)">150 %</a></li>
                                    <li><a class="dropdown-item" href="#" @click="zoom(200)">200 %</a></li>
                                </ul>
                            </li>
                        </ul>
                   
                        <ul class="navbar-nav">
                            <li class="nav-item">
                                <a class="nav-link active" aria-current="page" href="#" title="Imprimir"  @click="imprimir"><i class="flaticon-print fa-2x"></i></a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link active" href="#"  title="Localizar" @click="localizar" id="btnLocalizar"><i class="flaticon-binoculars fa-2x"></i></a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link active" href="#"  title="Alternar Retrato/Paisagem" @click="alternarOrientacao()" id="btnOrientacao">
                                    <i class="fa fa-2x" :class="controle.orientacao == 'Retrato' ? 'fa-arrows-alt-v' : 'fa-arrows-alt-h'"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div class="resultado">
                <div class="pagina" id="pagina" :class="controle.orientacao == 'Retrato' ? 'retrato' : 'paisagem'"> 
                    <slot  :style="'zoom:' + controle.percZoom + '%'"> </slot>
                </div>
            </div>
        </div>
    <!-- </Container> -->

</template>

<style scoped>
.text-end {
    text-align: right
}

.text-center {
    text-align: center
}

.table-sm {
    font-size: 10px;
    margin-bottom: 1rem
}


.mb-3 {
    margin-bottom: 5px
}



</style>
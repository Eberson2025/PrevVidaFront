<script setup lang="ts">

import { reactive, watch , defineProps, defineEmits} from "vue";

var props = defineProps({
    paginaAtual: { type: Number, required: true, default: 1 },
    tamanhoPagina: { type: Number, required: true, default: 20 },
    totalRegistros: { type: Number, required: true, default: 20 },
});

var emit = defineEmits({
    onChange: null
});

var controle = reactive({
    paginaAtual: props.paginaAtual,
    tamanhoPagina: props.tamanhoPagina,
    totalRegistros: props.totalRegistros,
    paginaFinal: Math.ceil(props.totalRegistros / props.tamanhoPagina) ?? 1,
    tamanhosPaginas: [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 1000, 2000, 3000, 4000, 5000, 10000]
})

watch(() => props.paginaAtual, (novo: any) => {
    // console.log("Alterou pagina atual")
    controle.paginaAtual = novo;
    recalcular();
});

watch(() => props.tamanhoPagina, async (novo: any, antigo: any) => {
    // console.log("Alterou tamanho pagina")
    controle.tamanhoPagina = novo;
    recalcular();
});

watch(() => props.totalRegistros, async (novo: any, antigo: any) => {
    controle.totalRegistros = novo;
    recalcular();
});

const selecionarPagina = (pagina: number) => {
    if (controle.paginaAtual != pagina) {

        controle.paginaAtual = pagina;
        if (controle.paginaAtual <= 0)
            controle.paginaAtual = 1;

        if (controle.paginaAtual > controle.paginaFinal)
            controle.paginaAtual = controle.paginaFinal;

        change();
    }
};

const selecionarTamanho = (e: any) => {
    var tamanho = 0
    if (e) tamanho = e.target.value
    controle.tamanhoPagina = Number(tamanho);
    controle.paginaAtual = 1;

    change();
}

const recalcular = () => {
    controle.paginaFinal = Math.ceil(controle.totalRegistros / controle.tamanhoPagina);
}

const change = () => {

    var el = {
        tamanhoPagina: Number(controle.tamanhoPagina),
        paginaAtual: controle.paginaAtual,
    }
    console.log("paginador on change", el);
    emit("onChange", el);
}

</script>

<template>

    <div class="d-flex flex-row align-items-center " v-if="controle.totalRegistros > controle.tamanhoPagina">

        <div class="flex-column me-2">

            <nav class="mt-15 mt-md-0">
                <ul class="pagination mb-0">
                    <li class="page-item">
                        <button type="button" class="btn btn-sm btn-outline-primary" @click="selecionarPagina(1)">
                            &laquo;&laquo;
                        </button>
                    </li>
                    <li class="page-item">
                        <button type="button" class="btn btn-sm btn-outline-primary" @click="selecionarPagina(controle.paginaAtual - 1)">
                            &laquo;
                        </button>
                    </li>
                    <li class="">
                        <a class="btn btn-sm btn-outline-primary">{{ controle.paginaAtual }} de
                            {{ controle.paginaFinal }}</a>
                    </li>
                    <li class="page-item">
                        <button type="button" class="btn btn-sm btn-outline-primary" @click="selecionarPagina(controle.paginaAtual + 1)">
                            &raquo;
                        </button>
                    </li>
                    <li class="page-item">
                        <button type="button" class="btn btn-sm btn-outline-primary" @click="selecionarPagina(controle.paginaFinal)">
                            &raquo;&raquo;
                        </button>
                    </li>
                </ul>
            </nav>
        </div>

        <div class="flex-column">
            <select class="p-2 form-select rounded-1 text-primary" v-model="controle.tamanhoPagina" @change="selecionarTamanho($event)">
                <option :value="item" v-for="(item, idx) in controle.tamanhosPaginas" :key="idx">
                    {{ item }} registros
                </option>
            </select>
        </div>
    </div>
</template>

<style scoped>
nav {
    display: inline-block;
}

.form-select {
    border-color: #0d6efd;
}
</style>
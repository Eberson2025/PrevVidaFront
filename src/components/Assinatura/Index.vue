

<script setup lang="ts">

import { ref , defineProps, defineEmits, reactive, watch} from 'vue'

interface Iprops {
    modelValue?: string | undefined,
    urlImagem?: string | undefined,

}

var props = defineProps<Iprops>();

var controle = reactive({
    dataUrl: '',
    urlImagem: props.urlImagem,
    confirmada: false,
    status: '',
    erro: ''
})


var emit = defineEmits(['update:modelValue', 'salvar']);

watch(() => props.urlImagem, (newVal) => {
    controle.urlImagem = newVal;
}, { immediate: true });

const width = 500
const height = 250

const canvasRef = ref(null)
const drawing = ref(false)
const saved = ref(false)
let ctx = null

function getPos(e) {
    if (e.touches) {
        if (!canvasRef.value) return { x: 0, y: 0 };
        const rect = canvasRef.value.getBoundingClientRect()
        return {
            x: e.touches[0].clientX - rect.left,
            y: e.touches[0].clientY - rect.top
        }
    } else {
        return {
            x: e.offsetX,
            y: e.offsetY
        }
    }
}

function startDrawing(e) {
    if (saved.value) return
    drawing.value = true
    if (!canvasRef.value) return;
    ctx = canvasRef.value.getContext('2d')
    const pos = getPos(e)
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
}

function draw(e) {
    if (!drawing.value || saved.value) return
    const pos = getPos(e)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
}

function stopDrawing() {
    drawing.value = false
}

function startDrawingTouch(e) {
    if (saved.value) return
    drawing.value = true
    ctx = canvasRef.value.getContext('2d')
    const pos = getPos(e)
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
}

function drawTouch(e) {
    if (!drawing.value || saved.value) return
    const pos = getPos(e)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
}

function clear() {
    if (controle.urlImagem)
    {
        controle.urlImagem = "";
    }
    else {

        console.log("limpando assinatura...");
        ctx = canvasRef.value.getContext('2d')
        ctx.clearRect(0, 0, width, height)
        saved.value = false
    }
}


 async function salvar() {

    console.log("salvando assinatura...");

    const canvas = canvasRef.value;
    if (!canvas) return;

    // Verificar se há algo desenhado no canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let hasDrawing = false;

    // Verificar se há pixels não brancos (indicando que algo foi desenhado)
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] !== 255 || data[i + 1] !== 255 || data[i + 2] !== 255) {
        hasDrawing = true;
        break;
      }
    }

    if (!hasDrawing) {
      alert('Por favor, faça sua assinatura antes de confirmar.');
      return;
    }

    // Converter canvas para base64
    controle.dataUrl = canvas.toDataURL('image/png');
    controle.confirmada = true;

    try {
        controle.status = "Salvando assinatura...";
      
        // Aqui você faria a chamada para salvar a assinatura
        emit('update:modelValue', controle.dataUrl);
        emit('salvar', controle.dataUrl);
        console.log("salvando assinatura...", controle.dataUrl);

        controle.status = "Assinatura confirmada com sucesso!";

    } catch (error) {
        controle.erro = `Erro ao salvar assinatura: ${error}`;
    }
  }
</script>

<template>
    
    <div class="col-md-12">
        <template v-if="controle.urlImagem">
            <img :src="controle.urlImagem" :width="width" :height="height" class="border rounded bg-white" />
        </template>
        <template v-else>
            <canvas
                ref="canvasRef"
                :width="width"
                :height="height"
                class="border rounded bg-white"
                style="touch-action: none;"
                @mousedown="startDrawing"
                @mousemove="draw"
                @mouseup="stopDrawing"
                @mouseleave="stopDrawing"
                @touchstart.prevent="startDrawingTouch"
                @touchmove.prevent="drawTouch"
                @touchend.prevent="stopDrawing"
            ></canvas>
        </template>
    </div>

    <div class="mt-2 col-md-12 ">
        <button @click="salvar()" class="btn btn-sm btn-primary me-2">Salvar</button>
        <button @click="clear" class="btn btn-sm btn-danger">Limpar</button>
    </div>
   
</template>

<style scoped>
.signature-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.signature-canvas {
    border: 1px solid #ccc;
    border-radius: 4px;
    background: #fff;
    touch-action: none;
}
.signature-actions {
    margin-top: 8px;
    display: flex;
    gap: 8px;
}

</style>
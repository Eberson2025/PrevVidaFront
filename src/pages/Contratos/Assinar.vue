<script lang="ts" setup>
  import { defineComponent, onMounted, reactive, ref } from "vue";
  import { useRoute, useRouter } from 'vue-router';

  import BreadCrumb from "../../components/Common/BreadCrumb.vue";

  //servicos
  import * as service from "@/services/clientesContratosService";

  //componentes
  import ReportView from "@/components/ReportView/Index.vue";

  const route = useRoute();
  const router = useRouter();

  // Referencias para o canvas de assinatura
  const canvasRef = ref<HTMLCanvasElement>();
  const isDrawing = ref(false);
  const lastX = ref(0);
  const lastY = ref(0);

  var controle = reactive({
    filtros: {
      paginaAtual: 1,
      tamanhoPagina: 1
    } as unknown as service.Filtros,
    model: {} as service.Contrato,
    assinatura: {
      dataUrl: '', // Para armazenar a assinatura como base64
      confirmada: false
    },
    status: "",
    erro: "",
  })

  onMounted(async () => {
    pesquisar();
    setupCanvas();
  })

  async function pesquisar() {

    if (route.params.id) {
      controle.filtros.contratoId = parseInt(route.params.id as string);
    }
    
    service.obter(controle.filtros)
      .then(r => {
        controle.model = r[0];
      })
      .catch(erro => {
        controle.erro = erro;
      })
  }

  function setupCanvas() {
    const canvas = canvasRef.value;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar estilo da linha
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Preencher fundo branco
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Eventos do mouse
  function startDrawing(event: MouseEvent) {
    isDrawing.value = true;
    const rect = canvasRef.value?.getBoundingClientRect();
    if (rect) {
      lastX.value = event.clientX - rect.left;
      lastY.value = event.clientY - rect.top;
    }
  }

  function draw(event: MouseEvent) {
    if (!isDrawing.value || !canvasRef.value) return;

    const ctx = canvasRef.value.getContext('2d');
    const rect = canvasRef.value.getBoundingClientRect();
    
    if (ctx && rect) {
      const currentX = event.clientX - rect.left;
      const currentY = event.clientY - rect.top;

      ctx.beginPath();
      ctx.moveTo(lastX.value, lastY.value);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();

      lastX.value = currentX;
      lastY.value = currentY;
    }
  }

  function stopDrawing() {
    isDrawing.value = false;
  }

  // Eventos touch para dispositivos móveis
  function startTouchDrawing(event: TouchEvent) {
    event.preventDefault();
    const touch = event.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    startDrawing(mouseEvent);
  }

  function touchDraw(event: TouchEvent) {
    event.preventDefault();
    const touch = event.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    draw(mouseEvent);
  }

  function stopTouchDrawing(event: TouchEvent) {
    event.preventDefault();
    stopDrawing();
  }

  // Limpar assinatura
  function limparAssinatura() {
    const canvas = canvasRef.value;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    controle.assinatura.dataUrl = '';
    controle.assinatura.confirmada = false;
  }

  // Confirmar assinatura
  async function confirmarAssinatura() {

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
    controle.assinatura.dataUrl = canvas.toDataURL('image/png');
    controle.assinatura.confirmada = true;

    try {
      controle.status = "Salvando assinatura...";
      
      // Aqui você faria a chamada para salvar a assinatura
      await service.SalvarAssinaturaBase64(
        { contratoId: controle.model.contratoId, 
          arquivoBase64: controle.assinatura.dataUrl }
        );

      controle.status = "Assinatura confirmada com sucesso!";
      
      // Redirecionar ou mostrar sucesso
      setTimeout(() => {
        router.push('/contratos/ver/' + controle.model.contratoId);
      }, 2000);
      
    } catch (error) {
      controle.erro = `Erro ao salvar assinatura: ${error}`;
    }
  }
</script>

<template>
  <BreadCrumb PageTitle="Assinatura do Contrato" />

  <div class="row">
    <!-- Contrato -->
    <div class="col-md-8">
      <ReportView :titulo="'Contrato'">
        <div v-html="controle.model.texto"></div>
      </ReportView>
    </div>

    <!-- Área de Assinatura -->
    <div class="col-md-4">
      <div class="card">
        <div class="card-header">
          <h5 class="card-title mb-0">
            <i class="fas fa-signature me-2"></i>
            Assinatura Digital
          </h5>
        </div>
        <div class="card-body">
          <!-- Canvas para assinatura -->
          <div class="signature-container mb-3">
            <label class="form-label">Faça sua assinatura abaixo:</label>
            <div class="signature-canvas-wrapper">
              <canvas
                ref="canvasRef"
                width="350"
                height="150"
                class="signature-canvas"
                @mousedown="startDrawing"
                @mousemove="draw"
                @mouseup="stopDrawing"
                @mouseleave="stopDrawing"
                @touchstart="startTouchDrawing"
                @touchmove="touchDraw"
                @touchend="stopTouchDrawing"
              ></canvas>
              <small class="text-muted">Use o mouse ou toque para desenhar sua assinatura</small>
            </div>
          </div>

          <!-- Status -->
          <div v-if="controle.status" class="alert alert-info">
            <i class="fas fa-info-circle me-1"></i>
            {{ controle.status }}
          </div>

          <div v-if="controle.erro" class="alert alert-danger">
            <i class="fas fa-exclamation-triangle me-1"></i>
            {{ controle.erro }}
          </div>

          <!-- Botões de ação -->
          <div class="d-grid gap-2">
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="limparAssinatura"
            >
              <i class="fas fa-eraser me-1"></i>
              Limpar Assinatura
            </button>

            <button
              type="button"
              class="btn btn-success"
              @click="confirmarAssinatura"
              :disabled="controle.assinatura.confirmada"
            >
              <i class="fas fa-check me-1"></i>
              {{ controle.assinatura.confirmada ? 'Assinatura Confirmada' : 'Confirmar Assinatura' }}
            </button>
          </div>

          <!-- Preview da assinatura confirmada -->
          <div v-if="controle.assinatura.confirmada && controle.assinatura.dataUrl" class="mt-3">
            <hr>
            <label class="form-label">Assinatura Confirmada:</label>
            <div class="signature-preview">
              <img :src="controle.assinatura.dataUrl" alt="Assinatura" class="img-fluid border" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.signature-container {
  text-align: center;
}

.signature-canvas-wrapper {
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 10px;
  background-color: #f8f9fa;
  transition: border-color 0.3s ease;
}

.signature-canvas-wrapper:hover {
  border-color: #0d6efd;
}

.signature-canvas {
  border: 1px solid #ced4da;
  border-radius: 4px;
  background-color: white;
  cursor: crosshair;
  max-width: 100%;
  height: auto;
}

.signature-canvas:active {
  cursor: grab;
}

.signature-preview img {
  max-width: 100%;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .signature-canvas {
    width: 100%;
    height: 120px;
  }
}
</style>
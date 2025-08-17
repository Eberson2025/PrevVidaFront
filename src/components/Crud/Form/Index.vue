<script setup lang="ts">
import { ref, onMounted, watch, defineProps, defineEmits, reactive, withDefaults } from 'vue'
import TrataTecla from '@/components/TrataTecla/Index.vue';
import CampoDinamico from './CampoDinamico.vue'
import { RouterLink } from 'vue-router';

interface Campo {
  nome: string
  rotulo: string
  tipo: "Texto" | "Numero" | "DoisDecimais" | "TresDecimais" | "Data" | "CpfCnpj" | "Telefone" | "Cep" | "Maiusculo" | "Minusculo" | 'UploadFoto' | 'text' | 'textarea' | 'number' | 'email' | 'password' | 'checkbox' | 'select'| 'upload'
  obrigatorio?: boolean
  autoFocus?: boolean
  classeCol?: string
  origemApi?: string
  opcoes?: { texto: string; valor: any }[]
  readOnly? :boolean
  aceitar?: string
  uploadApi?: string
  visivelQuando?: { campo: string; valor: any }
}

interface Props {
  titulo: string
  campos: Campo[]
  registro: any
  service: {
    salvar: (objeto: any) => Promise<any> // Mudamos para retornar any para pegar o ID
    obterPorId?: (id: number) => Promise<any>
    uploadFoto?: (usuarioId: number, arquivo: File) => Promise<string> // Adicionamos uploadFoto
  },
  rotaFechar?: string 
  focoPrimeiroCampo?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  rotaFechar: '/',
  focoPrimeiroCampo: true,
})

const emit = defineEmits(['salvar'])

const form = ref<any>({})
const inputFocus = ref<any>({})
const dadosSelect = ref<Record<string, any[]>>({})

onMounted(() => {
  focoPrimeiroCampo();
})

function focoPrimeiroCampo() {
  setTimeout(() => {
    var campoNome = props.campos.find(c => c.autoFocus)?.nome || props.campos[0].nome;
    inputFocus.value = campoNome;
    if (props.focoPrimeiroCampo) {
      const el = document.getElementById(campoNome);
      if (el) {
        (el as HTMLElement).focus();
      }
    }
  }, 500);

}

//atualiza o registro com os dados do form
watch(
  form,
  (novo) => {
    Object.assign(props.registro, novo)
  },
  { deep: true }
)

//carrega os dados do registro no form
watch(
  () => props.registro,
  (novo) => {
    form.value = { ...novo }
  },
  { immediate: true }
)


function deveExibirCampo(campo: Campo): boolean {
  if (!campo.visivelQuando) return true
  const cond = campo.visivelQuando
  return form.value[cond.campo] === cond.valor
}

async function submit() {
  try {
    // 1. Salvar o registro primeiro
    const resultado = await props.service.salvar(form.value)
    
    // 2. Obter o ID do registro salvo (assumindo que retorna o objeto ou ID)
    const registroId = resultado?.id || resultado?.usuarioId || form.value.id || form.value.usuarioId
    
    // 3. Verificar se há campos do tipo UploadFoto com arquivos
    const camposUpload = props.campos.filter(campo => 
      campo.tipo === 'UploadFoto' && 
      form.value[campo.nome] instanceof File
    )
    
    // 4. Fazer upload das fotos se existirem
    if (camposUpload.length > 0 && props.service.uploadFoto && registroId) {
      for (const campo of camposUpload) {
        const arquivo = form.value[campo.nome] as File
        try {
          console.log(`Fazendo upload do campo ${campo.nome}...`)
          const urlImagem = await props.service.uploadFoto(registroId, arquivo)
          console.log(`Upload do campo ${campo.nome} concluído:`, urlImagem)
          
          // Opcional: atualizar o form com a URL da imagem
          form.value[campo.nome] = urlImagem
        } catch (uploadError) {
          console.error(`Erro ao fazer upload do campo ${campo.nome}:`, uploadError)
          // Você pode decidir se quer continuar ou parar aqui
        }
      }
    }
    
    emit('salvar')
  } catch (error) {
    console.error('Erro ao salvar:', error);
    return;
  }
}


</script>


<template>
  <TrataTecla>
   
    <form @submit.prevent="submit">
      <div class="row g-3">
        <div class="col-md-6">
          <div class="row">
            <template v-for="(item, idx) in props.campos.slice(0, Math.ceil(props.campos.length / 2))">
              <div class="col-md-12 mb-2" :key="item.nome" v-if="deveExibirCampo(item)">
                <CampoDinamico
                  :campo="item"
                  v-model="form[item.nome]"
                  v-bind="idx === 0 ? { id: 'campoFocus' } : {}"
                />
              </div>
            </template>
          </div>
        </div>
        <div class="col-md-6">
          <div class="row">
            <template v-for="(item) in props.campos.slice(Math.ceil(props.campos.length / 2))">
              <div class="col-md-12 mb-2" :key="item.nome" v-if="deveExibirCampo(item)">
                <CampoDinamico :campo="item" v-model="form[item.nome]" />
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="row">
          <div class="col-md-6">
          <RouterLink class="btn btn-secondary btn-sm" :to=" props.rotaFechar " >Fechar</RouterLink>
        </div>
        <div class="col-md-6">
          <button class="btn btn-primary btn-sm float-end" type="submit">Gravar</button>
        </div>
      </div>
    </form>
  </TrataTecla>
</template>

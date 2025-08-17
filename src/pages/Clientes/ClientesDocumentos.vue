<script lang="ts" setup>

//vue
import {  onMounted, reactive, defineProps, watch } from "vue";

//servicos
import * as service from "@/services/clientesDocumentosService";
import {fdata, fdataUS} from "@/utils/funcoes";
import config from "@/app.config.json";

//componentes
import TrataTecla from "@/components/TrataTecla/Index.vue";
import MsgBox from "@/components/MsgBox/Index.vue";
import TextBox from "@/components/TextBox/Index.vue";

interface IProps {
  ClienteId?: number
}

var props = defineProps<IProps>();

  var controle = reactive({
    clienteId: props.ClienteId as number | null | undefined,
    itens: [] as service.Documento[],
    model: {
      clienteId: props.ClienteId
    } as service.UploadArquivo,
    janela: false,
    janPergunta:false,
    erro: "",
    status: ""
  })

  onMounted(() => {
   
    buscarItems();

  });

  watch(() => props.ClienteId, (newValue) => {
    controle.clienteId = newValue;
    controle.model.clienteId = newValue ?? 0;
    buscarItems();
  });

  async function buscarItems() {

      if (!props.ClienteId) {
        controle.itens = [];
        return;
      }

      controle.status = "Buscando items...";
      controle.erro = "";
      service.obter({clienteId: props.ClienteId} as service.Filtros)
      .then((dependentes) => {
        controle.itens = dependentes;
        controle.status = "";
      })
      .catch((error) => {
        controle.erro = `Erro ao buscar items: ${error}`;
        controle.status = "";
      });
  }
      
  async function salvar() {

      controle.status = "Salvando item...";
      controle.erro = "";

      controle.model.clienteId = controle.clienteId ?? 0;
      
      service.uploadDocumento(controle.model)
      .then(() => {
        controle.status = "";
        controle.model = {
          clienteId: controle.model.clienteId,
          tipo: ""
        } as service.UploadArquivo;
        buscarItems();
        controle.janela = false;
      })
      .catch((error) => {
        controle.erro = `Erro ao salvar item: ${error}`;
        controle.status = "";
      });
  }

  function excluir(item: service.Documento) {
    controle.model.documentoId = item.documentoId;
    controle.janPergunta = true;
  }

  function excluirConfirma()
  {
    controle.janPergunta = false;
    controle.status = "Excluindo item...";
    controle.erro = "";

    service.excluir(controle.model.documentoId)
    .then(() => {
      controle.status = "";
      controle.model = {
        clienteId: controle.model.clienteId,
        documentoId: 0,
        tipo: "",
        arquivo: new File([], "")
      } as service.UploadArquivo;
      buscarItems();
    })
    .catch((error) => {
      controle.erro = `Erro ao excluir item: ${error}`;
      controle.status = "";
    });
  }


</script>

<template>
    <TrataTecla>
      <div class="card mb-25 border-0 rounded-0 bg-white add-user-card">
        <div class="card-header">
          <h5 class="card-title">Documentos</h5>
        </div>
        <div class="card-body p-3">
          <div class="row mb-2">
            <div class="col-md-6">
              <a class="btn btn-sm btn-primary " @click="controle.janela = true">Adicionar</a>
            </div>
          </div>

          <div class="row mb-2">
            <div class="col-md-12">
            <table class="table table-sm table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th>Documento</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in controle.itens" :key="index">
                      <td>{{ item.tipo }}</td>
                    <td>
                       <a class="btn btn-sm btn-primary me-1" title="Ver / download" target="_blank" :href="`${config.urlApi}/${item.arquivo}`">
                        <i class="flaticon-search"></i>
                       </a>

                      <button class="btn btn-sm btn-danger" title="Excluir registro" @click="excluir(item)">
                        <i class="flaticon-delete"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
            </table>
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-md-12">
              <p class="">Registros: {{ controle.itens.length }}</p>
            </div>  
          </div>
          <div  class="text-center">
            <span class="">{{ controle.status }}</span> 
            <span class="text-danger fw-bold">{{ controle.erro }}</span>
          </div>
        </div>
      </div>
    </TrataTecla>

    <TrataTecla>
      <MsgBox :id="'janAddDocto'" class="modal-md" data-bs-backdrop="static" :exibir="controle.janela"
              :titulo="'Cadastro de Documento'" @on-fechou="controle.janela = false" :botao-gravar="true" 
              :botao-fechar="true" @on-gravar="salvar()">
        <div class="row mb-2">
          <div class="col-md-3">
            Tipo
          </div>
          <div class="col-md-9">
            <select v-model="controle.model.tipo" class="form-select form-select-sm">
              <option :value="null">- Selecione - </option>
              <option value="cpf">CPF</option>
              <option value="rg">RG</option>
              <option value="cnh">CNH</option>
              <option value="certidaoCasamento">Certidão de Casamento</option>
              <option value="certidaoNascimento">Certidão de Nascimento</option>
              <option value="comprovanteResidencia">Comprovante Residência</option>
              <option value="fotoPessoal">Foto Pessoal</option>
            </select>
          </div>
        </div>

        

        <div class="row mb-2">
          <div class="col-md-3">
            Documento
          </div>
          <div class="col-md-9">
            <input type="file" class="form-control form-control-sm" 
                   @change="(e) => controle.model.arquivo = (e.target as HTMLInputElement).files ? (e.target as HTMLInputElement).files[0] : null">
          </div>
        </div>

      </MsgBox>
    </TrataTecla>

    <MsgBox :id="'janExcluirDocto'" class="modal-md" data-bs-backdrop="static" :exibir="controle.janPergunta"
              :titulo="'Atenção'" @on-fechou="controle.janPergunta = false" :botao-sim="true" 
              :botao-nao="true" @on-sim="excluirConfirma()">
        <div class="row mb-2">
          <div class="col-md-12 fs-5 fw-bold text-center ">
            Deseja excluir este registro ?
          </div>
        </div>
    </MsgBox>

</template>
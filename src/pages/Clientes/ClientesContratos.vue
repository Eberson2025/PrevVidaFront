<script lang="ts" setup>

//vue
import {  onMounted, reactive, defineProps, watch } from "vue";

//servicos
import * as service from "@/services/clientesContratosService";
import {fdata, fdataUS,fdataUSS} from "@/utils/funcoes";

//componentes
import TrataTecla from "@/components/TrataTecla/Index.vue";
import MsgBox from "@/components/MsgBox/Index.vue";
import TextBox from "@/components/TextBox/Index.vue";
import DropdownVendedores from "@/components/Dropdowns/DropdownVendedores.vue";
import DropdownPlanos from "@/components/Dropdowns/DropdownPlanos.vue";
import DropdownSimNao from "@/components/Dropdowns/DropdownSimNao.vue";
import DropdownContratosStatus from "@/components/Dropdowns/DropdownContratosStatus.vue";

interface IProps {
  ClienteId?: number
}

var props = defineProps<IProps>();

  var controle = reactive({
    clienteId: props.ClienteId as number | null | undefined,
    itens: [] as service.Contrato[],
    listaStatus: [] as service.ContratoStatus[],
    model: {
      clienteId: props.ClienteId
    } as service.Contrato,
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
      .then((r) => {
        controle.itens = r;
        controle.status = "";
      })
      .catch((error) => {
        controle.erro = `Erro ao buscar items: ${error}`;
        controle.status = "";
      });
  }
      
  async function buscarStatus() {

      controle.status = "Buscando status...";
      controle.erro = "";
      service.obterStatus()
      .then((r) => {
        controle.listaStatus = r;
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

      service.salvar(controle.model)
      .then(() => {
        controle.status = "";
        controle.model = {
          clienteId: controle.model.clienteId,
          
        } as service.Contrato;
        buscarItems();
        controle.janela = false;
      })
      .catch((error) => {
        controle.erro = `Erro ao salvar item: ${error}`;
        controle.status = "";
      });
  }

  function excluir(item: service.Contrato) {
    controle.model = item;
    controle.janPergunta = true;
  }

  function excluirConfirma()
  {
    controle.janPergunta = false;
    controle.status = "Excluindo item...";
    controle.erro = "";

    service.excluir(controle.model.contratoId)
    .then(() => {
      controle.status = "";
      controle.model = {
        clienteId: controle.model.clienteId,

      } as service.Contrato;
      buscarItems();
    })
    .catch((error) => {
      controle.erro = `Erro ao excluir item: ${error}`;
      controle.status = "";
    });
  }

function adicionar(){
  controle.model = {
    clienteId: controle.clienteId,
    statusId: 1,
    
  }
  controle.janela = true;
}
</script>

<template>
    <TrataTecla>
      <div class="card mb-25 border-0 rounded-0 bg-white add-user-card">
        <div class="card-header">
          <h5 class="card-title">Contratos</h5>
        </div>
        <div class="card-body p-3">
          <div class="row mb-2">
            <div class="col-md-6">
              <a class="btn btn-sm btn-primary " @click="adicionar()">Adicionar</a>
            </div>
          </div>

          <div class="row mb-2">
            <div class="col-md-12">
            <table class="table table-sm table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th>Contrato</th>
                    <th>Vendedor</th>
                    <th>Plano</th>
                    <th>Status</th>
                    <th>Pré contrato</th>
                    <th>Dt. Inicio</th>
                    <th>Dt. Fim</th>
                    <th>Dt. Assinatura</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in controle.itens" :key="index">
                      <td>{{ item.contratoId }}</td>
                      <td>{{ item.vendedor?.nomeCompleto }}</td>
                      <td>{{ item.plano.nome }}</td>
                      <td>{{ item.status.descricao }}</td>
                      <td>{{ item.preContrato }}</td>
                      <td>{{ fdata(item.dataInicio) }}</td>
                      <td>{{ fdata(item.dataFim) }}</td>
                      <td>{{ fdata(item.dataAssinatura) }}</td>
                    <td>
                       <button class="btn btn-sm btn-primary me-1" title="Alterar registro" @click="controle.model = item; controle.janela = true">
                        <i class="flaticon-edit"></i>
                      </button>

                      <button class="btn btn-sm btn-danger" title="Excluir registro" @click="excluir(item)">
                        <i class="flaticon-delete"></i>
                      </button>

                      <RouterLink class="btn btn-sm btn-primary" title="Ver o contrato" target="_blank" :to="{ name: 'contratosVer', params: { id: item.contratoId } }">
                        <i class="flaticon-search"></i>
                      </RouterLink>

                       <RouterLink class="btn btn-sm btn-primary" title="Assinar o contrato" target="_blank" :to="{ name: 'contratosAssinar', params: { id: item.contratoId } }">
                        <i class="flaticon-pen"></i>
                      </RouterLink>
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
      <MsgBox :id="'janAddContratos'" class="modal-md" data-bs-backdrop="static" :exibir="controle.janela"
              :titulo="'Contrato do ciente'" @on-fechou="controle.janela = false" :botao-gravar="true" 
              :botao-fechar="true" @on-gravar="salvar()">

        <div class="row mb-2">
          <div class="col-md-3">
            Pré contrato
          </div>
          <div class="col-md-4">
            <DropdownSimNao v-model="controle.model.preContrato" class="form-select form-select-sm" />
          </div>
        </div>

         <div class="row mb-2" v-if="controle.model.preContrato == true">
          <div class="col-md-3">
            Vencimento 1º Boleto
          </div>
          <div class="col-md-4">
            <input type="date" class="form-control form-control-sm" :value="fdataUS(controle.model.dataPriParcela)"  />
          </div>
        </div>

        <div class="row mb-2">
          <div class="col-md-3">
            Plano
          </div>
          <div class="col-md-9">
            <DropdownPlanos v-model="controle.model.planoId" class="form-select form-select-sm" />
          </div>
        </div>

        <div class="row mb-2" v-if="controle.model.planoId > 0">
          <div class="col-md-3">
            
          </div>
          <div class="col-md-9">
              <RouterLink class="btn btn-sm btn-primary" 
              title="Ler o contrato" 
              target="_blank" 
              :to="{ name: 'planosLer', params: { id: controle.model.planoId } }">
                <i class="flaticon-search"></i> Ler o contrato
              </RouterLink>
          </div>
        </div>

        <div class="row mb-2">
          <div class="col-md-3">
            Vendedor
          </div>
          <div class="col-md-9">
            <DropdownVendedores v-model="controle.model.vendedorId" />
          </div>
        </div>

        <div class="row mb-2" v-if="controle.model?.contratoId > 0">
          <div class="col-md-3">
            Status
          </div>
          <div class="col-md-9">
            <DropdownContratosStatus v-model="controle.model.statusId" />
          </div>
        </div>

        <div class="row mb-2" v-if="controle.model?.contratoId > 0">
          <div class="col-md-3">
            Dt Inicio
          </div>
          <div class="col-md-4">
            <input type="date" class="form-control form-control-sm" :value="fdataUS(controle.model.dataInicio)" @change="controle.model.dataInicio = $event.target.value"/>
          </div>
        </div>

        <div class="row mb-2" v-if="controle.model?.contratoId > 0">
          <div class="col-md-3">
            Dt Fim
          </div>
          <div class="col-md-4">
            <input type="date" class="form-control form-control-sm"  :value="fdataUS(controle.model.dataFim)" @change="controle.model.dataFim = $event.target.value"/>
          </div>
        </div>

      </MsgBox>
    </TrataTecla>

    <MsgBox :id="'janPergunta'" class="modal-md" data-bs-backdrop="static" :exibir="controle.janPergunta"
              :titulo="'Atenção'" @on-fechou="controle.janPergunta = false" :botao-sim="true" 
              :botao-nao="true" @on-sim="excluirConfirma()">
        <div class="row mb-2">
          <div class="col-md-12 fs-5 fw-bold text-center ">
            Deseja excluir este registro ?
          </div>
        </div>
    </MsgBox>

</template>
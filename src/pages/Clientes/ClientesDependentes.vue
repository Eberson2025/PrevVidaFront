<script lang="ts" setup>

//vue
import {  onMounted, reactive, defineProps, watch } from "vue";

//servicos
import * as service from "@/services/clientesDependentesService";
import {fdata, fdataUS} from "@/utils/funcoes";

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
    itens: [] as service.Dependente[],
    model: {
      clienteId: props.ClienteId
    } as service.Dependente,
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

      if (controle.model.dataNascimento != null) {
        controle.model.dataNascimento = fdataUS(controle.model.dataNascimento);
      }

      controle.model.clienteId = controle.clienteId ?? 0;

      service.salvar(controle.model)
      .then(() => {
        controle.status = "";
        controle.model = {
          clienteId: controle.model.clienteId,
          dependenteId: 0,
          nome: "",
          dataNascimento: null,
          cpf: "",
          celular: ""
        } as service.Dependente;
        buscarItems();
        controle.janela = false;
      })
      .catch((error) => {
        controle.erro = `Erro ao salvar item: ${error}`;
        controle.status = "";
      });
  }

  function excluir(item: service.Dependente) {
    controle.model = item;
    controle.janPergunta = true;
  }

  function excluirConfirma()
  {
    controle.janPergunta = false;
    controle.status = "Excluindo item...";
    controle.erro = "";

    service.excluir(controle.model.dependenteId)
    .then(() => {
      controle.status = "";
      controle.model = {
        clienteId: controle.model.clienteId,
        dependenteId: 0,
        nome: "",
        dataNascimento: null,
        cpf: "",
        celular: ""
      } as service.Dependente;
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
          <h5 class="card-title">Dependentes</h5>
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
                    <th>Parentesco</th>
                    <th>Nome</th>
                    <th>Nascimento</th>
                    <th>CPF</th>
                    <th>Celular</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in controle.itens" :key="index">
                      <td>{{ item.parentesco }}</td>
                      <td>{{ item.nome }}</td>
                      <td>{{ fdata(item.dataNascimento) }}</td>
                      <td>{{ item.cpf }}</td>
                      <td>{{ item.celular }}</td>
                    <td>
                       <button class="btn btn-sm btn-primary me-1" title="Alterar registro" @click="controle.model = item; controle.janela = true">
                        <i class="flaticon-edit"></i>
                      </button>

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
      <MsgBox :id="'janAddDep'" class="modal-md" data-bs-backdrop="static" :exibir="controle.janela"
              :titulo="'Cadastro de Dependente'" @on-fechou="controle.janela = false" :botao-gravar="true" 
              :botao-fechar="true" @on-gravar="salvar()">
        <div class="row mb-2">
          <div class="col-md-3">
            Parentesco
          </div>
          <div class="col-md-9">
            <select v-model="controle.model.parentesco" class="form-select form-select-sm">
              <option :value="null">- Selecione - </option>
              <option value="Filho">Filho</option>
              <option value="Filha">Filha</option>
              <option value="Pai">Pai</option>
              <option value="Mae">Mãe</option>
              <option value="Neto">Neto</option>
              <option value="Neta">Neta</option>
              <option value="Conjuge">Cônjuge</option>
            </select>
          </div>
        </div>

        <div class="row mb-2">
          <div class="col-md-3">
            Nome
          </div>
          <div class="col-md-9">
            <TextBox v-model="controle.model.nome" :formato="'Texto'" />
          </div>
        </div>

        <div class="row mb-2">
          <div class="col-md-3">
            Dt Nascimento
          </div>
          <div class="col-md-9">
            <TextBox v-model="controle.model.dataNascimento" :formato="'Data'" />
          </div>
        </div>

        <div class="row mb-2">
          <div class="col-md-3">
            CPF
          </div>
          <div class="col-md-9">
            <TextBox v-model="controle.model.cpf" :formato="'CpfCnpj'" />
          </div>
        </div>

        <div class="row">
          <div class="col-md-3">
            Celular
          </div>
          <div class="col-md-9">
            <TextBox v-model="controle.model.celular" :formato="'Telefone'" />
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
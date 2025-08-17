<script lang="ts" setup>

//vue
import {  onMounted, reactive } from "vue";
import { useRoute } from 'vue-router';

//servicos
import config from "@/app.config.json";
import * as service from "@/services/clientesService";

//componentes
import BreadCrumb from "../../components/Common/BreadCrumb.vue";
import TextBox from "@/components/TextBox/Index.vue";
import TrataTecla from "@/components/TrataTecla/Index.vue";
import Notificacao from "@/components/Notificacao/Index.vue";
import AutoCompleteCidade from "@/components/AutoCompletes/AutoCompleteCidade.vue";
import Dependentes from "./ClientesDependentes.vue";
import Documentos from "./ClientesDocumentos.vue";
import Contratos from "./ClientesContratos.vue";

  const route = useRoute();

  var controle = reactive({

    model: {
      
    } as service.Cliente,
    tipos: ['Familiar', 'Empresarial'] ,
    simNao: [
      { texto: 'SIM', valor: true }, 
      { texto: 'NÃO', valor: false }] as { texto: string; valor: boolean }[],

      erro: "",
      status: ""
  })

  onMounted(() => {
    
    console.log("buscar")
    if (route.params.id) {
      // Se houver um ID na rota, buscar os detalhes do usuário
      service.obterPorId(Number(route.params.id))
        .then(usuario => {
          controle.model = usuario;
         
        })
        .catch(error => {
          controle.erro = `Erro ao carregar: ${error}`;
        });
    }

    setTimeout(() => {
      var el = document.getElementById("inputFocus");
      if (el) {
        el.focus();
      }
    }, 500);

  });

  async function salvar() {
    try {
      // 1. Salvar o registro primeiro
      controle.status = "Salvando...";
      controle.erro = "";
      const resultado = await service.salvar(controle.model)
       controle.status = "Salvo com sucesso!";
       setTimeout(() => {
         controle.status = "";
       }, 3000);
    } catch (error) {
      controle.erro = `Erro ao salvar: ${error}...`;
      return;
    }
    }
</script>

<template>
  <BreadCrumb PageTitle="Cadastro de Clientes" 
    :items="[ 
      { label: 'Clientes', to: '/clientes' }, 
      { label: 'Cadastro', to: '/clientes/cadastro' } ]" />

    <Notificacao :erro="controle.erro" 
          @limparErro="controle.erro=''" 
          :progresso="controle.status" 
          @limparProgresso="controle.status = ''" />

    <TrataTecla>
      <div class="card mb-25 border-0 rounded-0 bg-white add-user-card">
        <div class="card-body p-4">
          <div class="row">

            <!-- coluna 1-->
            <div class="col-md-6">
              <div class="row mb-2">
                <div class="col-md-3">
                  <label for="clienteId" class="form-label">ID</label>
                </div>
                <div class="col-md-3">
                    <TextBox v-model="controle.model.clienteId" id="clienteId" :formato="'Numero'" readonly disabled />
                </div>
              </div>

              <div class="row mb-2">
                <div class="col-md-3">
                  <label for="nome" class="form-label obrigatorio">Nome</label>
                </div>
                <div class="col-md-9">
                    <TextBox v-model="controle.model.nome" id="inputFocus"/>
                </div>
              </div>

              
              <div class="row mb-2">
                <div class="col-md-3">
                  <label for="cpf" class="form-label">CPF</label>
                </div>
                <div class=col-md-6>
                  <TextBox v-model="controle.model.cpf" id="cpf"  :formato="'CpfCnpj'" class=""/>
                </div>
              </div>

              <div class="row mb-2">
                <div class="col-md-3">
                  <label for="rg" class="form-label">RG</label>
                </div>
                <div class=col-md-6>
                  <TextBox v-model="controle.model.rg" id="rg"  :formato="'Texto'" class=""/>
                </div>
              </div>

              <div class="row mb-2">
                <div class="col-md-3">
                  <label for="rgExpedidor" class="form-label">RG Expedidor</label>
                </div>
                <div class=col-md-6>
                  <TextBox v-model="controle.model.rgExpedidor" id="rgExpedidor"  :formato="'Texto'" class=""/>
                </div>
              </div>

              <div class="row mb-2">
                <div class="col-md-3">
                  <label for="telefone" class="form-label">Telefone</label>
                </div>
                <div class=col-md-6>
                  <TextBox v-model="controle.model.telefone" id="telefone"  :formato="'Telefone'" class=""/>
                </div>
              </div>

              <div class="row mb-2">
                <div class="col-md-3">
                  <label for="celular" class="form-label">Celular</label>
                </div>
                <div class=col-md-6>
                  <TextBox v-model="controle.model.celular" id="celular"  :formato="'Telefone'" class=""/>
                </div>
              </div>

              
              <div class="row mb-2">
                <div class="col-md-3">
                  <label for="logradouro" class="form-label">Logradouro</label>
                </div>
                <div class=col-md-9>
                  <TextBox v-model="controle.model.logradouro" id="logradouro"  :formato="'Texto'" class=""/>
                </div>
              </div>

              
              <div class="row mb-2">
                <div class="col-md-3">
                  <label for="numero" class="form-label">Número</label>
                </div>
                <div class=col-md-3>
                  <TextBox v-model="controle.model.numero" id="numero"  :formato="'Texto'" class=""/>
                </div>
              </div>

              
              <div class="row mb-2">
                <div class="col-md-3">
                  <label for="bairro" class="form-label">Bairro</label>
                </div>
                <div class=col-md-9>
                  <TextBox v-model="controle.model.bairro" id="bairro"  :formato="'Texto'" class=""/>
                </div>
              </div>

              
             
              
            </div>

            <!-- coluna 2-->
            <div class="col-md-6">
          
              <div class="row mb-2">
                <div class="col-md-3">
                  <label for="cidadeId" class="form-label">Cidade</label>
                </div>
                <div class=col-md-9>
                  <AutoCompleteCidade v-model="controle.model.cidadeId" id="cidadeId" />
                </div>
              </div>

              
              <div class="row mb-2">
                <div class="col-md-3">
                  <label for="cep" class="form-label">CEP</label>
                </div>
                <div class=col-md-6>
                  <TextBox v-model="controle.model.cep" id="cep"  :formato="'Cep'" class=""/>
                </div>
              </div>

              <div class="row mb-2">
                <div class="col-md-3">
                  <label for="complemento" class="form-label">Complemento</label>
                </div>
                <div class=col-md-9>
                  <TextBox v-model="controle.model.complemento" id="complemento"  :formato="'Texto'" class=""/>
                </div>
              </div>


              <div class="row mb-2">
                <div class="col-md-3">
                  <label for="dataNascimento" class="form-label">Data Nascimento</label>
                </div>
                <div class=col-md-4>
                  <TextBox v-model="controle.model.dataNascimento" id="dataNascimento"  :formato="'Data'" class=""/>
                </div>
              </div>

              <div class="row mb-2">
                <div class="col-md-3">
                  <label for="email" class="form-label">Email</label>
                </div>
                <div class=col-md-9>
                  <TextBox v-model="controle.model.email" id="email"  :formato="'email'" class=""/>
                </div>
              </div>

               <div class="row mb-2">
                <div class="col-md-3">
                  <label for="nomeConjuge" class="form-label">Nome Cônjuge</label>
                </div>
                <div class=col-md-9>
                  <TextBox v-model="controle.model.nomeConjuge" id="nomeConjuge"  :formato="'Texto'" class=""/>
                </div>
              </div>

               <div class="row mb-2">
                <div class="col-md-3">
                  <label for="cpfConjuge" class="form-label">CPF Cônjuge</label>
                </div>
                <div class=col-md-6>
                  <TextBox v-model="controle.model.cpfConjuge" id="cpfConjuge"  :formato="'CpfCnpj'" class=""/>
                </div>
              </div>


               <div class="row mb-2">
                <div class="col-md-3">
                  <label for="observacoes" class="form-label">Observações</label>
                </div>
                <div class=col-md-9>
                  <TextBox v-model="controle.model.observacoes" id="observacoes"  :formato="'Texto'" class=""/>
                </div>
              </div>

              
               <div class="row mb-2">
                <div class="col-md-3">
                  <label for="senha" class="form-label">Senha</label>
                </div>
                <div class=col-md-6>
                  <TextBox v-model="controle.model.senha" id="senha"  :formato="'password'" class=""/>
                </div>
              </div>

              <div class="row mb-2">
                <div class="col-md-3">
                  <label for="ativo" class="form-label">Ativo</label>
                </div>
                  <div class=col-md-4>
                  <select v-model="controle.model.ativo" id="ativo" class="form-select form-select-sm" >
                    <option v-for="tipo in controle.simNao" :key="String(tipo.valor)" :value="tipo.valor">{{ tipo.texto }}</option>
                  </select>
                </div>
              </div>

              
            </div>
          </div>

        </div>
        <div class='card-footer'>
          <div class="row">
            <div class="col-md-2">
              <RouterLink class="btn btn-sm btn-secondary" :to="'/clientes'">Fechar</RouterLink>
            </div>
            <div class="col-md-4">
              <div v-if="controle.erro == null && controle.status != null" class="fw-bold">{{ controle.status }}</div>
              <div v-if="controle.erro != null " class="fw-bold text-danger">{{ controle.erro }}</div>
            </div>
            <div class="col-md-4">
               <a class="btn btn-sm btn-success  me-2" @click="salvar()">Imprimir Cartão</a>
               <a class="btn btn-sm btn-warning " @click="salvar()">Marcar Cortesia</a>
            </div>
            <div class="col-md-2">
              <a class="btn btn-sm btn-primary float-end" @click="salvar()">Salvar</a>
            </div>
          </div>
        </div>
      </div>
    </TrataTecla>

    <Dependentes :ClienteId="controle.model.clienteId" />

    <Documentos :ClienteId="controle.model.clienteId" />

    <Contratos :ClienteId="controle.model.clienteId" />
</template>
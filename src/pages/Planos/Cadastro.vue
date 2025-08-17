<script lang="ts" setup>

//vue
import {  onMounted, reactive } from "vue";
import { useRoute } from 'vue-router';

//servicos
import config from "@/app.config.json";
import * as service from "@/services/planosService";

//componentes
import BreadCrumb from "../../components/Common/BreadCrumb.vue";
import TextBox from "@/components/TextBox/Index.vue";
import TrataTecla from "@/components/TrataTecla/Index.vue";
import Notificacao from "@/components/Notificacao/Index.vue";
import Editor from '@tinymce/tinymce-vue'

  const route = useRoute();

  var controle = reactive({

    model: {
      nome: "",
      ativo: true,
      tipo: "Familiar",
      texto: "", // Garantir que texto está inicializado
      
    } as service.Plano,
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
          // Garantir que texto não seja null/undefined
          if (!controle.model.texto) {
            controle.model.texto = "";
          }
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
  <BreadCrumb PageTitle="Cadastro de Planos" 
    :items="[ 
      { label: 'Planos', to: '/planos' }, 
      { label: 'Cadastro', to: '/planos/cadastro' } ]" />

    <Notificacao :erro="controle.erro" 
          @limparErro="controle.erro=''" 
          :progresso="controle.status" 
          @limparProgresso="controle.status = ''" />

    <TrataTecla>
      <div class="card mb-25 border-0 rounded-0 bg-white add-user-card">
        <div class="card-body p-15 p-sm-20 p-md-25 p-lg-30 letter-spacing">
          <div class="row">

            <!-- coluna 1-->
            <div class="col-md-6">
              <div class="row mb-2">
                <div class="col-md-3">
                  <label for="planoId" class="form-label">ID</label>
                </div>
                <div class="col-md-3">
                    <TextBox v-model="controle.model.planoId" id="planoId" :formato="'Numero'" readonly disabled />
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
                  <label for="tipoId" class="form-label obrigatorio">Tipo</label>
                </div>
                <div class=col-md-9>
                  <select v-model="controle.model.tipo" id="tipoId" class="form-select form-select-sm" >
                    <option :value="null">- Selecione -</option>
                    <option v-for="(item,idx) in controle.tipos" :key="idx" :value="item">{{ item }}</option>
                  </select>
                </div>
              </div>

              <div class="row mb-2">
                <div class="col-md-3">
                  <label for="valor" class="form-label">Valor R$</label>
                </div>
                <div class=col-md-3>
                  <TextBox v-model="controle.model.valor" id="valor"  :formato="'DoisDecimais'" class="text-end"/>
                </div>
              </div>



              <div class="row mb-2">
                <div class="col-md-3">
                  <label for="percInvestidor" class="form-label">Investidor %</label>
                </div>
                <div class=col-md-3>
                  <TextBox v-model="controle.model.percInvestidor" id="percInvestidor"  :formato="'DoisDecimais'" class="text-end"/>
                </div>
              </div>

              <div class="row mb-2">
                <div class="col-md-3">
                  <label for="percVendedor" class="form-label">Vendedor %</label>
                </div>
                <div class=col-md-3>
                  <TextBox v-model="controle.model.percVendedor" id="percVendedor"  :formato="'DoisDecimais'" class="text-end"/>
                </div>
              </div>
            </div>

            <!-- coluna 2-->
            <div class="col-md-6">
          
              <div class="row mb-2">
                <div class="col-md-3">
                  <label for="percSupervisor" class="form-label">Supervisor %</label>
                </div>
                <div class=col-md-3>
                  <TextBox v-model="controle.model.percSupervisor" id="percSupervisor"  :formato="'DoisDecimais'" class="text-end"/>
                </div>
              </div>

              <div class="row mb-2">
                <div class="col-md-3">
                  <label for="percIndicador" class="form-label">Indicador %</label>
                </div>
                <div class=col-md-3>
                  <TextBox v-model="controle.model.percIndicador" id="percIndicador"  :formato="'DoisDecimais'" class="text-end"/>
                </div>
              </div>

              
              <div class="row mb-2">
                <div class="col-md-3">
                  <label for="percMidia" class="form-label">Mídia %</label>
                </div>
                <div class=col-md-3>
                  <TextBox v-model="controle.model.percMidia" id="percMidia"  :formato="'DoisDecimais'" class="text-end"/>
                </div>
              </div>

               <div class="row mb-2">
                <div class="col-md-3">
                  <label for="percTi" class="form-label">TI %</label>
                </div>
                <div class=col-md-3>
                  <TextBox v-model="controle.model.percTi" id="percTi"  :formato="'DoisDecimais'" class="text-end"/>
                </div>
              </div>


               <div class="row mb-2">
                <div class="col-md-3">
                  <label for="ativo" class="form-label">Ativo</label>
                </div>
                  <div class=col-md-4>
                  <select v-model="controle.model.ativo" id="ativo" class="form-select form-select-sm" >
                    <option :value="null">- Selecione -</option>
                    <option v-for="tipo in controle.simNao" :key="String(tipo.valor)" :value="tipo.valor">{{ tipo.texto }}</option>
                  </select>
                </div>
              </div>

             
              
            </div>
          </div>

          <div class="row mb-2">
            
                
                <div class="row mb-2">
                  <div class="col-md-12">
                    <label for="observacoes" class="form-label obrigatorio">Observações</label>
                    <textarea v-model="controle.model.observacoes" id="observacoes"  class="form-control" rows="3"></textarea>
                  </div>
                </div>

                
                <div class="row mb-2">
                  <div class="col-md-12">
                    <label class="mb-2">Variáveis disponíveis: [ASSINATURACONTRATADA] [CLIENTENOME] [CLIENTENASCIMENTO] [CLIENTECPF] [CONJUGENOME] [CONJUGECPF] [ASSINATURA] [DIA] [MES] [ANO]</label>
                    <label for="texto" class="form-label">Texto do Contrato</label>
                    <editor
                      api-key="lf6zyai00yc0p00geaaq5q6b0v4l7z09sbzn2xsankgk4zi7"
                      :init="{
                        height: 700,
                        menubar: true,
                        plugins: [
                          'advlist autolink lists link image charmap print preview anchor',
                          'searchreplace visualblocks code fullscreen',
                          'insertdatetime media table paste code help wordcount'
                        ],
                        toolbar:
                          'undo redo | formatselect | bold italic backcolor | \
                          alignleft aligncenter alignright alignjustify | \
                          bullist numlist outdent indent | removeformat | help'
                      }"
                      v-model="controle.model.texto"
                      @update:modelValue="(value) => controle.model.texto = value"
                    />
                  </div>
                </div>
          </div>
        </div>
        <div class='card-footer'>
          <div class="row">
            <div class="col-md-2">
              <RouterLink class="btn btn-sm btn-secondary" :to="'/planos'">Fechar</RouterLink>
            </div>
            <div class="col-md-8">
              <div v-if="controle.erro == null && controle.status != null" class="fw-bold">{{ controle.status }}</div>
              <div v-if="controle.erro != null " class="fw-bold text-danger">{{ controle.erro }}</div>
            </div>
            <div class="col-md-2">
              <a class="btn btn-sm btn-primary float-end" @click="salvar()">Salvar</a>
            </div>
          </div>
        </div>
      </div>
    </TrataTecla>

    
</template>
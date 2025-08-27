

<script lang="ts" setup>

//vue
import {  onMounted, reactive } from "vue";
import { useRoute } from 'vue-router';

//servicos
import config from "@/app.config.json";
import * as service from "@/services/paramsService";

//componentes
import BreadCrumb from "../../components/Common/BreadCrumb.vue";
import TextBox from "@/components/TextBox/Index.vue";
 import Assinatura from "@/components/Assinatura/Index.vue";
import UploadFoto from "@/components/UploadFoto/Index.vue";
import TrataTecla from "@/components/TrataTecla/Index.vue";
import Notificacao from "@/components/Notificacao/Index.vue";
import Editor from '@tinymce/tinymce-vue'
import { urlImagem } from "@/services/usuariosService";

  const route = useRoute();

  var controle = reactive({

    model: {
      paramId: 0,
      nomeEmpresa: '',
      path: null,
      urlApi: null,
      contratoParceiro: null,
      contratoEmpresa: null,
      politicaPrivacidade: null,
      termosDeUso: null,
      chaveValor: null,
      assinaturaContratada: null,
      fundoCartao: null,
      dataCadastro: null,
      usuCadastroId: null,
      dataAlteracao: null,
      usuAlteracaoId: null,
      dataExclusao: null,
      usuExclusaoId: null,
      modelState: { isValid: true, erros: [] }
    } as service.Param,
    foto: null as File | null,
    tipos: [] as { texto: string; valor: number }[],
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
        .then(r => {
          controle.model = r;
        })
        .catch(error => {
          controle.erro = `Erro ao carregar : ${error}`;
        });
    }


  });

  async function salvar() {
    try {
      // 1. Salvar o registro primeiro
      controle.status = "Salvando...";
      controle.erro = "";
      const resultado = await service.salvar(controle.model)
      
      // 4. Fazer upload das fotos se existirem
      if (controle.foto?.size > 0) {

          const arquivo = controle.foto as File
          try {
            controle.status = "Salvando foto...";
            console.log(`Salvando foto...`)
            const urlImagem = await service.uploadFoto(resultado.paramId, arquivo)
            console.log(`Salvando foto concluído:`, urlImagem)
            
          } catch (uploadError) {
            controle.erro = `Erro ao salvar foto: ${uploadError}...`;
          }

      }
      
    } catch (error) {
      controle.erro = `Erro ao salvar: ${error}...`;
      return;
    }
  }

  async function salvarAssinatura(valor: string) {
    try {
      // 1. Salvar o registro primeiro
      controle.status = "Salvando...";
      controle.erro = "";
      const resultado = await service.SalvarAssinaturaBase64({ paramId: controle.model.paramId, arquivoBase64: valor })

      if (resultado) {
        controle.status = "Assinatura salva com sucesso!";
      }

    } catch (error) {
      controle.erro = `Erro ao salvar: ${error}...`;
      return;
    }
  }



</script>

<template>
  <BreadCrumb PageTitle="Parâmetros" 
  :items="[ 
    { label: 'Parâmetros', to: '/parametros' }, 
    { label: 'Cadastro', to: '/parametros/cadastro' } ]" />

    <Notificacao :erro="controle.erro" 
          @limparErro="controle.erro=''" 
          :progresso="controle.status" 
          @limparProgresso="controle.status = ''" />


    <TrataTecla>
      <div class="card mb-25 border-0 rounded-0 bg-white add-user-card">
        <div class="card-body p-15 p-sm-20 p-md-25 p-lg-30 letter-spacing">
          <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link active" id="tab1" data-bs-toggle="tab" data-bs-target="#tab-basico" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Básico</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="tab2" data-bs-toggle="tab" data-bs-target="#tab-termos-uso" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Termos de Uso</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="tab3" data-bs-toggle="tab" data-bs-target="#tab-politica-privacidade" type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false">Política de privacidade</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="tab4" data-bs-toggle="tab" data-bs-target="#tab-contrato-empresa" type="button" role="tab" aria-controls="disabled-tab-pane" aria-selected="false">Contrato Empresa</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="tab5" data-bs-toggle="tab" data-bs-target="#tab-contrato-parceiro" type="button" role="tab" aria-controls="disabled-tab-pane" aria-selected="false">Contrato Parceiro</button>
            </li>
          </ul>
          <div class="tab-content" id="myTabContent">
            <div class="tab-pane fade show active p-4" id="tab-basico" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
              <div class="row">
                <!-- coluna 1-->
                <div class="col-md-6">
                    <div class="row mb-2">
                    <div class="col-md-3">
                      <label for="paramId" class="form-label">ID</label>
                    </div>
                    <div class="col-md-3">
                        <TextBox v-model="controle.model.paramId" id="paramId" :formato="'Numero'" />
                    </div>
                  </div>

                  <div class="row mb-2">
                    <div class="col-md-3">
                      <label for="nomeEmpresa" class="form-label obrigatorio">Nome</label>
                    </div>
                    <div class="col-md-9">
                        <TextBox v-model="controle.model.nomeEmpresa" id="nomeEmpresa" />
                    </div>
                  </div>

                   <div class="row mb-2">
                    <div class="col-md-3">
                      <label for="urlApi" class="form-label obrigatorio">Url Api</label>
                    </div>
                    <div class="col-md-9">
                        <TextBox v-model="controle.model.urlApi" id="urlApi" />
                    </div>
                  </div>

                  

                

                </div>

                <!-- coluna 2-->
                <div class="col-md-6">
                
                  <div class="row mb-2">
                    <div class="col-md-3">
                      <label for="assinatura" class="form-label">Assinatura</label>
                    </div>
                    <div class="col-md-9">
                     <Assinatura v-model="controle.model.assinaturaContratada" 
                     :urlImagem="`${config.urlApi}/Param/assinatura${controle.model.paramId}.png`" @salvar="salvarAssinatura" />
                    </div>
                  </div>


                  <div class="row mb-2">
                    <div class="col-md-3">
                      <label for="foto" class="form-label">Fundo do cartão</label>
                    </div>
                    <div class="col-md-9">
                      {{ `${config.urlApi}/Param/fundoCartao.png` }}
                      <UploadFoto
                        v-model="controle.foto"
                        id="foto"
                        :accept="'image/*'"
                        :alt="'Foto de Perfil'"
                        :imageUrl="`${config.urlApi}/Param/fundoCartao.png`"
                      />
                    </div>
                  </div>

                  
                </div>
              </div>
            </div>
            <div class="tab-pane fade" id="tab-termos-uso" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
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
                  v-model="controle.model.termosDeUso"
                  @update:modelValue="(value) => controle.model.termosDeUso = value"
                />
            </div>
            <div class="tab-pane fade" id="tab-politica-privacidade" role="tabpanel" aria-labelledby="contact-tab" tabindex="0">
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
                  v-model="controle.model.politicaPrivacidade"
                  @update:modelValue="(value) => controle.model.politicaPrivacidade = value"
                />
            </div>
            <div class="tab-pane fade" id="tab-contrato-empresa" role="tabpanel" aria-labelledby="disabled-tab" tabindex="0">
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
                  v-model="controle.model.contratoEmpresa"
                  @update:modelValue="(value) => controle.model.contratoEmpresa = value"
                />
            </div>
            <div class="tab-pane fade" id="tab-contrato-parceiro" role="tabpanel" aria-labelledby="disabled-tab" tabindex="0">
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
                  v-model="controle.model.contratoParceiro"
                  @update:modelValue="(value) => controle.model.contratoParceiro = value"
                />
            </div>
          </div>


        </div>
        <div class='card-footer'>
          <div class="row">
            <div class="col-md-2">
              <RouterLink class="btn btn-sm btn-secondary" :to="'/parametros'">Fechar</RouterLink>
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
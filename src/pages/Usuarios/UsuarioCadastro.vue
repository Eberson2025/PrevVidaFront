

<script lang="ts" setup>

//vue
import { defineComponent, onMounted, reactive } from "vue";
import { useRoute } from 'vue-router';

//servicos
import config from "@/app.config.json";
import * as usuarioService from "@/services/usuariosService";

//componentes
import BreadCrumb from "../../components/Common/BreadCrumb.vue";
import TextBox from "@/components/TextBox/Index.vue";
import UploadFoto from "@/components/UploadFoto/Index.vue";
import TrataTecla from "@/components/TrataTecla/Index.vue";
import AutoCompleteCidade from "@/components/AutoCompletes/AutoCompleteCidade.vue";
import Notificacao from "@/components/Notificacao/Index.vue";
import UsuarioCidades from "./UsuarioCidades.vue";

  const route = useRoute();

  var controle = reactive({

    model: {
      nomeCompleto: "",
      ativo: true,
      tipoId: 4,
      
    } as usuarioService.Usuario,
    foto: null as File | null,
    tipos: [] as { texto: string; valor: number }[],
    simNao: [
      { texto: 'SIM', valor: true }, 
      { texto: 'NÃO', valor: false }] as { texto: string; valor: boolean }[],

      erro: "",
      status: ""
  })

  onMounted(() => {
    usuarioService.obterTipos().then((r) => {
      controle.tipos = r.map(a=> {
        return { texto: a.descricao, valor: a.tipoId }
      });
    });

    console.log("buscar")
    if (route.params.id) {
      // Se houver um ID na rota, buscar os detalhes do usuário
      usuarioService.obterPorId(Number(route.params.id))
        .then(usuario => {
          controle.model = usuario;
        })
        .catch(error => {
          controle.erro = `Erro ao carregar usuário: ${error}`;
        });
    }


  });

  async function salvar() {
    try {
      // 1. Salvar o registro primeiro
      controle.status = "Salvando...";
      controle.erro = "";
      const resultado = await usuarioService.salvar(controle.model)
      
      // 4. Fazer upload das fotos se existirem
      if (controle.foto?.size > 0) {

          const arquivo = controle.foto as File
          try {
            controle.status = "Salvando foto...";
            console.log(`Salvando foto...`)
            const urlImagem = await usuarioService.uploadFoto(resultado.usuarioId, arquivo)
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
</script>

<template>
  <BreadCrumb PageTitle="Cadastro de Usuário" 
  :items="[ 
    { label: 'Usuários', to: '/usuarios' }, 
    { label: 'Cadastro', to: '/usuarios/cadastro' } ]" />

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
                  <label for="usuarioId" class="form-label">ID</label>
                </div>
                <div class="col-md-3">
                    <TextBox v-model="controle.model.usuarioId" id="usuarioId" :formato="'Numero'" />
                </div>
              </div>

              <div class="row mb-2">
                <div class="col-md-3">
                  <label for="nomeCompleto" class="form-label obrigatorio">Nome</label>
                </div>
                <div class="col-md-9">
                    <TextBox v-model="controle.model.nomeCompleto" id="nomeCompleto" />
                </div>
              </div>

              <div class="row mb-2">
                <div class="col-md-3">
                  <label for="tipoId" class="form-label obrigatorio">Tipo</label>
                </div>
                <div class=col-md-9>
                  <select v-model="controle.model.tipoId" id="tipoId" class="form-select form-select-sm" >
                    <option :value="null">- Selecione -</option>
                    <option v-for="tipo in controle.tipos" :key="tipo.valor" :value="tipo.valor">{{ tipo.texto }}</option>
                  </select>
                </div>
              </div>

              <div class="row mb-2">
                <div class="col-md-3">
                  <label for="telefone" class="form-label">Telefone</label>
                </div>
                <div class=col-md-6>
                  <TextBox v-model="controle.model.telefone" id="telefone"  :formato="'Telefone'"/>
                </div>
              </div>

              <div class="row mb-2">
                <div class="col-md-3">
                  <label for="email" class="form-label obrigatorio">Email</label>
                </div>
                <div class=col-md-9>
                  <TextBox v-model="controle.model.email" id="email"  :formato="'email'"/>
                </div>
              </div>

              <div class="row mb-2">
                <div class="col-md-3">
                  <label for="cpf" class="form-label">CPF</label>
                </div>
                <div class=col-md-6>
                  <TextBox v-model="controle.model.cpfCnpj" id="cpfCnpj"  :formato="'CpfCnpj'"/>
                </div>
              </div>

              <div class="row mb-2">
                  <div class="col-md-3">
                  <label for="cidadeId" class="form-label obrigatorio">Cidade {{controle.model.cidadeId}}</label> 
                </div>
                <div class="col-md-9">
                  <AutoCompleteCidade v-model="controle.model.cidadeId" id="cidadeId" />
                </div>
              </div>

              <div class="row mb-2">
                <div class="col-md-3">
                  <label for="observacoes" class="form-label">Observações</label>
                </div>
                <div class="col-md-9">
                  <TextBox v-model="controle.model.observacoes" id="observacoes" :formato="'Texto'" />
                </div>
              </div>

            

            </div>

            <!-- coluna 2-->
            <div class="col-md-6">
            
              <div class="row mb-2">
                <div class="col-md-3">
                  <label for="referenciaId" class="form-label">Referência</label>
                </div>
                <div class=col-md-9>
                  <TextBox v-model="controle.model.referenciaId" id="referenciaId" :formato="'Texto'" readonly="readonly" />
                </div>
              </div>


              <div class="row mb-2">
                <div class="col-md-3">
                  <label for="senha" class="form-label obrigatorio">Senha</label>
                </div>
                <div class=col-md-9>
                  <TextBox v-model="controle.model.senha" id="senha" type="password" />
                </div>
              </div>

              <div class="row mb-2">
                <div class="col-md-3">
                  <label for="ativo" class="form-label">Ativo</label>
                </div>
                  <div class=col-md-9>
                  <select v-model="controle.model.ativo" id="ativo" class="form-select form-select-sm" >
                    <option :value="null">- Selecione -</option>
                    <option v-for="tipo in controle.simNao" :key="String(tipo.valor)" :value="tipo.valor">{{ tipo.texto }}</option>
                  </select>
                </div>
              </div>

              <div class="row mb-2">
                <div class="col-md-3">
                  <label for="foto" class="form-label">Foto</label>
                </div>
                <div class="col-md-9">
                  {{ `${config.urlApi}/Fotos/Usuarios/${controle.model.usuarioId}.png` }}
                  <UploadFoto
                    v-model="controle.foto"
                    id="foto"
                    :accept="'image/*'"
                    :alt="'Foto de Perfil'"
                    :imageUrl="`${config.urlApi}/Fotos/Usuarios/${controle.model.usuarioId}.png`"
                  />
                </div>
              </div>

              
            </div>
          </div>
        </div>
        <div class='card-footer'>
          <div class="row">
            <div class="col-md-2">
              <RouterLink class="btn btn-sm btn-secondary" :to="'/usuarios'">Fechar</RouterLink>
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

    <UsuarioCidades :UsuarioId="controle.model.usuarioId" v-if="controle.model.usuarioId > 0" />
</template>
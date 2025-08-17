<script lang="ts" setup>

//vue
import {  onMounted, reactive, defineProps } from "vue";

//servicos
import * as service from "@/services/usuariosCidadesService";
import {Cidade} from "@/services/cidadesService";

//componentes
import TrataTecla from "@/components/TrataTecla/Index.vue";
import AutoCompleteCidade from "@/components/AutoCompletes/AutoCompleteCidade.vue";

interface IProps {
  UsuarioId?: number
}

var props = defineProps<IProps>();

  var controle = reactive({

    cidades: [] as Cidade[],
    model: {
      usuarioId: props.UsuarioId
    } as service.UsuarioCidade,
    erro: "",
    status: ""
  })

  onMounted(() => {
   
    buscarCidades();

  });

  async function buscarCidades() {

      controle.status = "Buscando cidades...";
      controle.erro = "";
      service.ObterCidadesUsuario(props.UsuarioId || 0)
      .then((cidades) => {
        controle.cidades = cidades;
        controle.status = "";
      })
      .catch((error) => {
        controle.erro = `Erro ao buscar cidades: ${error}`;
        controle.status = "";
      });
    }
      
</script>

<template>
    <TrataTecla>
      <div class="card mb-25 border-0 rounded-0 bg-white add-user-card">
        <div class="card-header">
          <h5 class="card-title">Cidades do Usuário</h5>
        </div>
        <div class="card-body p-15 p-sm-20 p-md-25 p-lg-30 letter-spacing">
          <div class="row mb-2">

            <!-- coluna 1-->
            <div class="col-md-4">
              <label for="cidadeId" class="form-label">Cidade</label>
              <AutoCompleteCidade v-model="controle.model.cidadeId" id="cidadeId" />
            </div>
              
            <div class="col-md-2">
              <a class="btn btn-sm btn-primary mt-4" @click="service.adicionar(controle.model).then(() => { buscarCidades(); })">Adicionar</a>
            </div>
          </div>

          <div class="row mb-2">
            <div class="col-md-12">
            <table class="table table-sm table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th>Cidade</th>
                    <th>Estado</th>
                    <th>Código</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(cidade, index) in controle.cidades" :key="index">
                    <td>{{ cidade.nome }}</td>
                    <td>{{ cidade.estado }}</td>
                    <td>{{ cidade.cidadeId }}</td>
                    <td>
                      <button class="btn btn-sm btn-danger" @click="service.excluir(cidade.cidadeId).then(() => { buscarCidades(); })">Excluir</button>
                    </td>
                  </tr>
                </tbody>
            </table>
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-md-12">
              <p class="">Registros: {{ controle.cidades.length }}</p>
            </div>  
          </div>
          <div  class="text-center">
            <span class="">{{ controle.status }}</span> 
            <span class="text-danger fw-bold">{{ controle.erro }}</span>
          </div>
        </div>
      </div>
    </TrataTecla>
</template>
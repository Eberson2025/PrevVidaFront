

<script lang="ts" setup>
  import { defineComponent, onMounted, reactive } from "vue";

  import BreadCrumb from "../../components/Common/BreadCrumb.vue";

  import CrudForm from "@/components/Crud/Form/Index.vue";
  import * as usuarioService from "@/services/usuariosService";


  var controle = reactive({
    model: {
      nomeCompleto: "teste",
      ativo: true,
      tipoId: 4,
      
    } as usuarioService.Usuario,
    tipos: [] as { texto: string; valor: number }[],
    simNao: [
      { texto: 'SIM', valor: true }, 
      { texto: 'NÃO', valor: false }] as { texto: string; valor: boolean }[],
  })

  onMounted(() => {
    usuarioService.obterTipos().then((r) => {
      controle.tipos = r.map(a=> {
        return { texto: a.descricao, valor: a.tipoId }
      });
    });
  });
</script>

<template>
  <BreadCrumb PageTitle="Cadastro de Usuário" 
  :items="[ 
    { label: 'Usuários', to: '/usuarios' }, 
    { label: 'Cadastro', to: '/usuarios/cadastro' } ]" />


    <div class="card mb-25 border-0 rounded-0 bg-white add-user-card">
    <div class="card-body p-15 p-sm-20 p-md-25 p-lg-30 letter-spacing">
      <CrudForm
        titulo="Cadastro de Usuário"
        :registro="controle.model"
        :service="usuarioService"
        :campos="[
          { nome: 'nomeCompleto', tipo: 'text', rotulo: 'Nome Completo', obrigatorio: true, autoFocus: true },
          { nome: 'tipoId', tipo: 'select', rotulo: 'Tipos de Usuário',  opcoes : controle.tipos, obrigatorio: true },
          { nome: 'cpf', tipo: 'CpfCnpj', rotulo: 'CPF', obrigatorio: true },
          { nome: 'email', tipo: 'email', rotulo: 'Email', obrigatorio: true },
          { nome: 'telefone', tipo: 'Telefone', rotulo: 'Telefone', obrigatorio: true },
          { nome: 'observacoes', tipo: 'textarea', rotulo: 'Observações' },
          { nome: 'senha', tipo: 'password', rotulo: 'Senha', obrigatorio: true },
          { nome: 'ativo', tipo: 'select', rotulo: 'Ativo', opcoes: controle.simNao, obrigatorio: true },        
          { nome: 'dataCadastro', tipo: 'Data', rotulo: 'Data Cadastro', readOnly: true },
          { nome: 'dataAlteracao', tipo: 'Data', rotulo: 'Data Alteração', readOnly: true },
          { nome: 'foto', tipo: 'upload', rotulo: 'Foto de Perfil', aceitar: 'image/*', uploadApi: '/api/usuarios/upload' }
        ]"
        @salvar="console.log('Usuário salvo!')"
        :rotaFechar="'/usuarios'"
        
      />

    </div>
  </div>
</template>
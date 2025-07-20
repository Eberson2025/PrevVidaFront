
<script lang="ts" setup>

  import { getUser, f2dec } from '@/utils/funcoes'; 
  import { onMounted, reactive, defineProps } from 'vue';

  interface IProps {
    nomeUsuario: string,
    qtdeContratos: number,
    totalContratos: number,
    atualizando: boolean
  }

  var props = defineProps<IProps>();

  const controle = reactive({
    usuario: {}
  });

  onMounted(()=> {
    controle.usuario = getUser() as any;
  })
</script>

<template>
  <div class="card mb-25 border-0 rounded-0 welcome-box">
    <div class="card-body pe-15 pe-sm-20 pe-md-0 pb-0 pt-15 pt-sm-20">
      <div class="row align-items-center">
        <div class="col-lg-6 col-md-6">
          <div class="title position-relative">
            <h3 class="fw-semibold mb-8">
              Ola, <span class="fw-bold">{{props.nomeUsuario}}!</span>
            </h3>
            <span class="d-block text-black-emphasis fs-md-15 fs-lg-16">
              Aqui está o que está acontecendo agora
            </span>
          </div>

          <ul class="ps-0 mb-0 list-unstyled" v-if="props.atualizando">
            <li
              class="d-inline-block text-uppercase fw-medium fs-13 text-black-emphasis position-relative">
              Atualizando...
            </li>
          
          </ul>

          <ul class="ps-0 mb-0 list-unstyled" v-if="props.atualizando == false">
            <li
              class="d-inline-block text-uppercase fw-medium fs-13 text-black-emphasis position-relative">
              CONTRATOS
              <span class="d-block fw-black lh-1 text-black mt-5 mt-md-10">
                {{props.qtdeContratos}}
              </span>
            </li>
            <li
              class="d-inline-block text-uppercase fw-medium fs-13 text-black-emphasis position-relative"
            >
              TOTAL
              <span class="d-block fw-black lh-1 text-black mt-5 mt-md-10">
                R$ {{f2dec(props.totalContratos)}}
              </span>
            </li>
          </ul>
        </div>
        <div class="col-lg-6 col-md-6 text-center mt-15 mt-md-0">
          <img
            src="../../../assets/images/welcome/welcome1.png"
            alt="welcome-image"
          />
        </div>
      </div>
    </div>
  </div>
</template>


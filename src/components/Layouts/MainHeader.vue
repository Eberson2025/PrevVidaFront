
<script lang="ts" setup>

  import { defineComponent, ref, onMounted, reactive } from "vue";
  import { useRouter } from 'vue-router';
  import LightDarkSwtichBtn from "./LightDarkSwtichBtn.vue";
  import stateStore from "../../utils/store";
  import { getUser } from '@/utils/funcoes'; 
  import { logout } from "@/services/usuariosService";

  const stateStoreInstance = stateStore;
  const isSticky = ref(false);
  
  const controle = reactive({
    usuario: {}
  });


  onMounted(() => {
    window.addEventListener("scroll", () => {
      let scrollPos = window.scrollY;
      isSticky.value = scrollPos >= 100;
    });
  });

  
 
  onMounted(()=> {
    controle.usuario = getUser() as any;
  })

  var router = useRouter();

const sair = () => {

  logout();
  router.push({ name: 'LoginPage' })
}


</script>


<template>
  <header
    :class="[
      'header-area bg-white text-center text-md-start pt-15 pb-15 ps-15 pe-15 ps-md-20 pe-md-20 pe-lg-30 transition mb-25 position-fixed',
      { sticky: isSticky },
    ]"
    id="header"
  >
    <div class="row align-items-center">
      <div class="col-xl-4 col-lg-5 col-md-6">
        <div
          class="header-left-side justify-content-center justify-content-md-start d-flex align-items-center"
        >
          <button
            class="header-burger-menu transition position-relative lh-1 bg-transparent p-0 border-0"
            id="header-burger-menu"
            @click="stateStoreInstance.onChange"
          >
            <i class="flaticon-menu-3"></i>
          </button>
          <form class="search-box">
            <div class="input-group">
              <input
                type="text"
                class="form-control shadow-none rounded-0 border-0"
                placeholder="Pesquise aqui"
              />
              <button
                class="default-btn position-relative transition border-0 fw-medium text-white pt-8 pb-8 ps-15 pe-15 pt-md-12 pb-md-12 ps-md-20 pe-md-20"
                type="button"
              >
                Pesquisar
                <i
                  class="flaticon-search-interface-symbol position-relative ms-5 top-1"
                ></i>
              </button>
            </div>
          </form>
        </div>
      </div>
      <div class="col-xl-8 col-lg-7 col-md-6">
        <div
          class="header-right-side d-flex align-items-center justify-content-center justify-content-md-end"
        >

          <LightDarkSwtichBtn />

          <div class="dropdown profile-dropdown">
            <button
              class="dropdown-toggle text-start fs-14 text-black-emphasis d-flex align-items-center p-0 position-relative bg-transparent border-0 transition lh-1"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="../../assets/images/admin.jpg"
                class="rounded"
                width="44"
                height="44"
                alt="admin"
              />
              <span class="title d-none d-lg-block ms-10 ms-lg-15">
                <span class="d-block fw-bold mb-5 mb-md-8">{{controle.usuario.nomeUsuario}}</span>
                <span class="text-body-emphasis fw-semibold fs-13">Investidor</span>
              </span>
            </button>
            <div
              class="dropdown-menu rounded-0 bg-white border-0 start-auto end-0"
            >
              <ul class="ps-0 mb-0 list-unstyled dropdown-body">
                <li
                  class="text-body-secondary fw-semibold transition position-relative"
                >
                  <i class="flaticon-user-2"></i>
                  Minha conta
                  <router-link
                    to="/profile"
                    class="d-block position-absolute start-0 top-0 end-0 bottom-0 text-decoration-none"
                  ></router-link>
                </li>
                <li
                  class="text-body-secondary fw-semibold transition position-relative"
                >
                  <i class="flaticon-setting"></i>
                  Configurações
                  <router-link
                    to="/profile-settings"
                    class="d-block position-absolute start-0 top-0 end-0 bottom-0 text-decoration-none"
                  ></router-link>
                </li>
                <li
                  class="text-body-secondary fw-semibold transition position-relative"
                >
                  <i class="flaticon-warning"></i>
                  Suporte
                  <router-link
                    to="/support-desk-card"
                    class="d-block position-absolute start-0 top-0 end-0 bottom-0 text-decoration-none"
                  ></router-link>
                </li>
                <li class="text-body-secondary fw-semibold transition position-relative" @click="sair()">
                  <i class="flaticon-logout"></i>
                  Sair
                 
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

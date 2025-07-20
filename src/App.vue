
<script lang="ts" setup>

import { defineComponent, watchEffect ,onMounted, reactive} from "vue";
import stateStore from "./utils/store";
import storeControle from "./utils/storeControle";
import {getToken} from "./utils/funcoes";

import MainHeader from "./components/Layouts/MainHeader.vue";
import MainSidebar from "./components/Layouts/MainSidebar.vue";
import MainFooter from "./components/Layouts/MainFooter.vue";

const stateStoreInstance = stateStore;

onMounted(()=> {
    console.log("montando...");
    document.body.classList.add("bg-body-secondary");
    storeControle.token = getToken();

})

watchEffect(async () => {
  if (stateStoreInstance.open) {
      document.body.classList.remove("sidebar-show");
      document.body.classList.add("sidebar-hide");
    } else {
      document.body.classList.remove("sidebar-hide");
      document.body.classList.add("sidebar-show");
  }
})

</script>

<template>

    <MainHeader v-if="storeControle.token != ''"/>
    <MainSidebar v-if="storeControle.token != ''"/>
    <div :class="storeControle.token != '' ? 'main-content d-flex flex-column transition overflow-hidden' : ''" >
      <router-view />
      <MainFooter v-if="storeControle.token != ''"/>
    </div>

</template>


<script lang="ts">
  import { defineComponent } from "vue";
  import stateStore from "../../utils/store";
  import config from "../../app.config.json"

  export default defineComponent({
    name: "MainSidebar",
    setup() {
      const stateStoreInstance = stateStore;
      return {
        stateStoreInstance,
        config
      };
    },
  });
</script>

<template>
  <div
    :class="[
      'sidebar-area position-fixed start-0 top-0 bg-black h-100vh transition',
      { active: stateStoreInstance.open },
    ]"
    id="sidebar-area"
  >
    <div class="logo position-absolute start-0 end-0 top-0 bg-black">
      <router-link
        to="/"
        class="d-flex align-items-center text-white text-decoration-none"
      >
        <img src="../../assets/images/favicon.png" alt="logo-icon" />
        <span class="fw-bold ms-10">{{config.empresa}}</span>
      </router-link>
      <div class="border-bottom"></div>
      <button
        class="sidebar-burger-menu position-absolute lh-1 bg-transparent p-0 border-0"
        @click="stateStoreInstance.onChange"
      >
        <i class="ph-duotone ph-caret-double-right"></i>
      </button>
    </div>
    <div class="sidebar-menu">
      <ul
        class="sidebar-navbar-nav ps-0 mb-0 list-unstyled accordion"
        id="sidebarNavAccordion"
      >
        <li
          class="sidebar-nav-item accordion-item bg-transparent border-0 rounded-0"
        >
          <a
            href="#"
            class="accordion-button rounded-0 shadow-none bg-transparent d-block"
            data-bs-toggle="collapse"
            data-bs-target="#sidebarCollapseOne"
            aria-expanded="true"
            aria-controls="sidebarCollapseOne"
          >
            <i class="flaticon-more-1"></i>
            <span class="title">Dashboard</span>
          </a>
          <div
            id="sidebarCollapseOne"
            class="accordion-collapse collapse show"
            data-bs-parent="#sidebarNavAccordion"
          >
            <div class="accordion-body">
              <ul class="sidebar-sub-menu ps-0 mb-0 list-unstyled">
                <li class="sidebar-sub-menu-item">
                  <router-link to="/" class="sidebar-sub-menu-link">
                    Vendas
                  </router-link>
                </li>
                <!-- <li class="sidebar-sub-menu-item">
                  <router-link
                    to="/project-management"
                    class="sidebar-sub-menu-link"
                  >
                    Previsão
                  </router-link>
                </li> -->

              </ul>
            </div>
          </div>
        </li>

       
      </ul>
    </div>
  </div>
</template>


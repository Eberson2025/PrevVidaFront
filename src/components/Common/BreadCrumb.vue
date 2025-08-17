<script lang="ts" setup>
import { defineProps, computed } from "vue";

const props = defineProps<{
  PageTitle: string;
  items?: { label: string; to?: string }[];
}>();

const breadcrumbItems = computed(() => {
  return props.items && props.items.length > 0
    ? props.items
    : [{ label: "Início", to: "/" }];
});
</script>

<template>
  <div
    class="mb-20 d-sm-flex align-items-center justify-content-between letter-spacing"
  >
    <h4 class="mb-5 mb-sm-0 fw-bold">{{ PageTitle }}</h4>
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb mb-0 list-unstyled ps-0">
        <li
          v-for="(item, idx) in breadcrumbItems"
          :key="idx"
          class="breadcrumb-item"
          :class="{ active: idx === breadcrumbItems.length - 1 }"
          :aria-current="idx === breadcrumbItems.length - 1 ? 'page' : undefined"
        >
          <router-link
            v-if="item.to && idx !== breadcrumbItems.length - 1"
            :to="item.to"
            class="text-decoration-none text-black"
          >
            {{ item.label }}
          </router-link>
          <span v-else>{{ item.label }}</span>
        </li>
      </ol>
    </nav>
  </div>
</template>


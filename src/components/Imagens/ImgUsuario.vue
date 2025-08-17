<template>
  <img
    :src="computedSrc"
    :alt="alt"
    class="rounded-circle me-2"
    width="32"
    height="32"
    style="object-fit:cover;"
    @error="onError"
  />
</template>

<script setup lang="ts">
import { ref, defineProps, reactive } from 'vue'
import appConfig from '@/app.config.json'

const props = defineProps<{
  usuarioId?: number | string
  alt?: string
}>()

var controle = reactive({
  erro: false
})


const imgUrl = new URL('@/assets/images/user/sem-imagem-usuario.jpg', import.meta.url).href

const src = ref(
  props.usuarioId
    ? `${appConfig.urlApi}/Fotos/Usuarios/${props.usuarioId}.png`
    : ""
)

function onError(e: Event) {
  const el = e.target as HTMLImageElement;
  controle.erro = true;
  el.src = imgUrl;
}

const computedSrc = src;

</script>
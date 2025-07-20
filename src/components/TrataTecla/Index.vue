<script setup lang="ts">
import { onMounted, onUnmounted, nextTick } from "vue";

onMounted(() => {
  var divs = document.querySelectorAll(".trata-tecla");

  if (divs != null) {
    divs.forEach(div => {
      div.addEventListener("keydown", trataTecla);
    });
  }
})

onUnmounted(() => {
  var divs = document.querySelectorAll(".trata-tecla");

  if (divs != null) {
    divs.forEach(div => {
      div.removeEventListener("keydown", trataTecla);
    });
  }
})

const trataTecla = (e: any) => {
  var inputs = [] as Element[];
  var divs = document.querySelectorAll(".trata-tecla");

  if (divs != null) {
    divs.forEach(div => {
      const lista = Array.from(div.querySelectorAll("input:not([disabled]):not([readonly]):not(.form-control:disabled), select:not([disabled]):not([readonly]),button:not([disabled]):not([readonly]):not(.btn-close):not(.not-trata-tecla *), textarea:not([disabled]):not([readonly]):not(.form-control:disabled)"));

      lista.forEach(a => { inputs.push(a) });
    });
  }

  var index = inputs.indexOf(e.target);

  var focus = false;

  if (e.keyCode == 13) {
    if (index < inputs.length - 1) {
      while (focus == false) {
        var el = inputs[index] as HTMLFormElement;
        if (el?.tagName != "BUTTON") {
          var el2 = inputs[index + 1] as HTMLFormElement;
          el2.focus();
          if (document.activeElement == el) {
            focus = true;
            nextTick(() => {
              el2?.select?.();
            })
          } else
            index = index + 1;

          e.stopPropagation();
          e.preventDefault();
        }
        focus = true;
      }
    }
  } else if (e.keyCode == 27) {
    if (index > 0) {
      while (focus == false) {
        el2 = inputs[index - 1] as HTMLFormElement;

        el2.focus();
        if (document.activeElement == el2) {
          focus = true;
          el2?.select?.();
        } else index = index - 1;
        e.stopPropagation();
      }
    }
  }
}
</script>

<template>
  <div ref="trataTecla" class="trata-tecla">
    <slot></slot>
  </div>
</template>

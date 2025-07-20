<script lang="ts" setup>

import { defineProps } from "vue";

import statsBoxes from "./statsBoxes.json";

interface Iprops {
  class: string,
  icon: string,
  title: string,
  sign: string,
  currentValue: number,
  previousValue: number,
  classTwo: string,
  percent: number,
  iconUpDown: string
}

var props = defineProps<Iprops>();

</script>

<template>
  <div class="row">
    <div class="col-xl-12 col-lg-12 col-xxxl-12 col-sm-12">
      <div class="card mb-25 border-0 rounded-0 bg-white stats-box">
        <div class="card-body pe-20 ps-20 pe-md-25 ps-md-25 pe-lg-15 ps-lg-15">
          <div class="d-flex align-items-center">
            <div
              :class="[
                'icon position-relative rounded-circle text-center',
                props.class,
              ]"
            >
              <i :class="props.icon"></i>
            </div>
            <div class="title ms-15">
              <span
                class="d-block mb-7 fs-13 text-uppercase fw-medium text-dark-emphasis"
              >
                {{ props.title }}
              </span>
              <h4 class="fw-black mb-8 lh-1">
                {{ props.sign }}{{ props.currentValue }}
              </h4>
              <span class="fw-medium text-dark-emphasis">
                {{ props.sign }}{{ props.previousValue }}
              </span>
              <span :class="['fw-bold text-success ms-11', props.classTwo]">
                {{ props.percent }}%
                <i
                  :class="[
                    props.iconUpDown,
                    'fs-12 lh-1 position-relative top-1',
                  ]"
                >
                </i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


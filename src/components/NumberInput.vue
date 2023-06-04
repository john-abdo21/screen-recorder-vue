<template>
  <div>
    <InputLabel :name="name">{{ title }}</InputLabel>
    <div class="mt-1 grid grid-cols-[1fr_auto_auto] bg-fmd-white overflow-hidden">
      <input type="number" :name="name" :min="min" :max="max" :step="step" :id="name"
        class="focus:ring-0 focus:border-fmd-red hover:border-b-fmd-yellow focus:border-r-fmd-gray block w-full sm:text-sm -md bg-transparent border-0 border-r-[1px] border-b-2 border-b-transparent border-r-fmd-gray transition transition-border"
        :class="{ 'opacity-30': isDisabled }" :placeholder="placeholder" v-model="value" :disabled="isDisabled" />
      <button
        class="h-full px-3 bg-transparent hover:bg-fmd-yellow border-r-[1px] border-fmd-gray transition transition-bg"
        @click="increment">
        +
      </button>
      <button class="h-full px-3 bg-transparent hover:bg-fmd-yellow transition transition-bg" @click="decrement">
        &#8211;
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import InputLabel from "./InputLabel.vue";
const props = defineProps<{
  name: string,
  title: string,
  value: string | number,
}>();
let value: any;
let placeholder = "";
let isDisabled = false;
let min = 0;
let max = 1;
let step = 0.02;
const increment = () => {
  value = props.value
    ? Number.parseFloat((Number(props.value) + step).toFixed(2))
    : (0 + step).toFixed(2);
}
const decrement = () => {
  value = props.value
    ? Number.parseFloat((Number(props.value) - step).toFixed(2))
    : (0 - step).toFixed(2);
}
</script>
<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
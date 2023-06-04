<template>
  <div>
    <InputLabel :name="name">{{ title }}</InputLabel>
    <select v-if="isDropdown" :id="name" :name="name"
      class="bg-fmd-white dark:bg-fmd-blue dark:text-white border-0 border-b-2 border-transparent mt-1 block w-full pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-0 hover:border-b-fmd-yellow focus:border-b-fmd-yellow hover:cursor-pointer sm:text-sm transition transition-border "
      v-bind:value="value" :disabled="isDisabled">
      <option v-for="op in options" :value="op.value">{{ op.title }}</option>
    </select>
    <div v-else
      class="flex justify-items-center mt-2 overflow-hidden border-[1px] border-fmd-gray dark:border-fmd-blue rounded">
      <div v-for="(op, i) in options"
        class="block {{i !== 0 ? 'border-l-[1px] border-fmd-gray dark:border-fmd-blue' : ''}} w-full text-center">
        <input class="hidden peer" type="radio" :checked="value === op.value" @input="$emit('update:value', op.value)"
          :value="op.value" :id="op.title" :name="name" />
        <label :for="op.title"
          class="block transition transition-all duration-150 pt-2 pb-1.5 peer-hover:cursor-pointer peer-checked:bg-fmd-red/5 peer-hover:bg-fmd-yellow/10 peer-hover:peer-checked:bg-fmd-red/5 dark:text-white dark:peer-hover:bg-fmd-blue/20 dark:peer-checked:bg-fmd-blue/50 dark:peer-hover:peer-checked:bg-fmd-blue/50">{{ op.title }}</label>
        <div
          class="transition transition-all duration-150 peer-checked:bg-fmd-red h-1 m-auto peer-hover:bg-fmd-yellow peer-hover:peer-checked:bg-fmd-red dark:peer-hover:bg-fmd-sky">
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import InputLabel from './InputLabel.vue';
const props = defineProps<{
  name: string,
  title?: string,
  value?: unknown,
  options?: { title: string; value: unknown }[],
  isDisabled?: boolean,
  isDropdown?: boolean
}>();
</script>
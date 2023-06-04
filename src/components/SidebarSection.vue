<template>
  <div class="flex flex-col gap-4">
    <div class="font-bold text-lg text-fmd-navy dark:text-white">{{ title }}</div>
    <div class="">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  title: string,
}>();
</script>
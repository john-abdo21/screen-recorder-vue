<template>
  <label :for="name" class="block text-sm font-medium text-fmd-navy dark:text-white">
    <slot />
  </label>
</template>
<script setup lang="ts">
defineProps<{
  name?: string,
}>();
</script>
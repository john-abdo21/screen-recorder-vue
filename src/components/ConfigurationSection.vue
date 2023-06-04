<template>
  <div>
    <div class="text-lg p-1">{{ title }}</div>
    <div class="p-1">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  title?: string,
}>();
</script>
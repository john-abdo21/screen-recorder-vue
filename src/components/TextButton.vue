<template>
  <button
    :class="['rounded', isDisabled ? 'bg-opacity-30' : 'hover:bg-fmd-yellow dark:hover:bg-fmd-navy', 'px-3 py-2 text-left transition transition-colors duration-150 ease-in-out flex items-center justify-between gap-1', extraClasses]"
    :disabled="isDisabled">
    <div class="flex-grow">
      <slot />
    </div>
    <span v-if="hasCheck || hasClose" class="w-6 flex-shrink-0 dark:fill-white">
      <component :is="hasCheck ? CheckIcon : StopIcon" />
    </span>
  </button>
</template>
<script setup lang="ts">
import CheckIcon from "./icons/check.icon.vue";
import StopIcon from "./icons/stop.icon.vue";
defineProps<{
  extraClasses?: string,
  isDisabled?: boolean,
  hasCheck?: boolean,
  hasClose?: boolean,
}>()

</script>
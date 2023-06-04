<template>
  <div :class="[
    'relative action_button',
    isSquareVariant ? 'h-full' : '',
  ]">
    <div v-if="isPopupOpen" :class="[
      'w-[256px] absolute bg-white dark:bg-transparent',
      showPopupUnder ? 'top-8' : 'bottom-20',
      rightAlignPopup ? '-right-2' : '-left-2',
      'rounded shadow-xl action_button_popup z-10'
    ]">
      <OnClickOutside @trigger="$emit('popupDismiss')">
        <slot name="popupContent" />
      </OnClickOutside>
    </div>
    <button :class="[
      'w-full green hover:text-fmd-black flex items-center p-1.5 transition transition-all duration-150 dark:text-fmd-white dark:hover:text-fmd-white dark:border-fmd-white dark:hover:bg-fmd-blue',
      extraClasses,
      isSquareVariant ? 'h-full rounded' : 'rounded-full aspect-square',
      isTextVariant ? 'text-black hover:bg-fmd-yellow justify-start' : 'text-fmd-gray_darker border border-fmd-gray_darker hover:bg-fmd-yellow justify-center',
    ]">
      <slot />
    </button>
    <div v-if="isActive" class="w-1.5 h-1.5 bg-fmd-red rounded-full absolute left-0 right-0 m-auto -bottom-3" />
  </div>
</template>
<script setup lang="ts">
import { OnClickOutside } from '@vueuse/components'
const props = defineProps<{
  isActive?: boolean,
  isPopupOpen?: boolean,
  extraClasses?: string,
  isSquareVariant?: boolean,
  isTextVariant?: boolean,
  showPopupUnder?: boolean,
  rightAlignPopup?: boolean,
}>();
</script>
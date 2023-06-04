vue
<template>
  <ActionButton :isActive="false" :isSquareVariant="true" :showPopupUnder="true" :isTextVariant="true"
    :rightAlignPopup="rightAlignPopup" :isPopupOpen="isPopupOpen" @popupDismiss="() => isPopupOpen = false"
    @click="isPopupOpen = true">
    <PopupContainer slot="popupContent" title="">
      <div class="transparent-input">
        <ColorPicker class="h-[256px] p-2" v-model="value" />
      </div>
    </PopupContainer>
    <div class="flex items-center gap-2">
      <div class="h-6 w-6 rounded" :style="{ backgroundColor: value }" />
      {{ title }}
    </div>
  </ActionButton>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { ColorPicker } from '@apsc/color';
import '@apsc/color/color-picker.css';
import ActionButton from './ActionButton.vue';
import PopupContainer from './PopupContainer.vue';
defineProps<{
  title?: string,
  value?: string,
  rightAlignPopup?: boolean,
}>();
let isPopupOpen = ref(false)
</script>
<style>
.transparent-input input {
  background-color: transparent;
}
</style>
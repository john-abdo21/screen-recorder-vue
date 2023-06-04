<template>
  <div class="grid grid-cols-[3fr_1fr] col-span-4 self-end gap-5">
    <Select title="Canvas Size" name="canvasSize" :options="canvasSizes.map((size) => ({
      title: `${size.title}`,
      value: size,
    }))" v-model="canvasDimensionsStore.canvasSize" :isDisabled="recordingStore.isRecording" :isDropdown="false" />
    <Select title="Recording FPS" name="recordingFPS" :options="recordingFPSOptions.map((fps) => ({
      title: fps.toString(),
      value: fps,
    }))" v-model="recordingStore.recordingFPS" :isDisabled="recordingStore.isRecording" :isDropdown="false" />
  </div>
</template>
<script setup  lang="ts">
import Select from './Select.vue';
import {
  useCanvasDimensions,
  canvasSizes,
  useRecordingStore,
  recordingFPSOptions,
} from "../stores";
const canvasDimensionsStore = useCanvasDimensions()
const recordingStore = useRecordingStore()

</script>
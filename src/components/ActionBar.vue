<template>
  <div class="grid grid-cols-[auto_auto_1fr_auto] gap-x-4 gap-y-10 items-center pb-4">
    <div class="flex gap-2">
      <div class="w-12">
        <MicButton />
      </div>
      <div class="w-12">
        <WebcamButton />
      </div>
      <!-- <div class="w-12">
        <SysAudioButton />
      </div> -->
    </div>
    <div class="w-[1px] h-16 bg-fmd-gray_darker dark:bg-fmd-blue" />
    <div class="flex gap-3 items-center">
      <!-- Existing screen shares -->
      <ShareButton v-for="(share, id) in sharesRef" :share="share" :num="id" :key="id">
      </ShareButton>
      <div class="w-20 h-14">
        <ActionButton @click="handleAddScreenShare" extraClasses="p-2.5" isSquareVariant>
          <div class="w-10">
            <DesktopIcon />
          </div>
        </ActionButton>
      </div>
    </div>
    <!-- Recording button -->
    <div class="flex justify-end items-center gap-2">
      <div v-if="recordingStore.recordingDuration !== null"
        class="w-[100px] bg-white rounded px-3 py-1 shadow flex justify-center items-center font-medium text-lg text-gray-600"
        :class="{ 'fade-in': recordingStore.isRecording }">
        {{ recordingStore.durationTime }}
      </div>
      <button
        class="w-16 h-16 aspect-square shadow rounded-full cursor-pointer border-4 border-gray-500 p-1 flex items-center justify-center group"
        @click="$emit('record')">
        <div class="bg-fmd-red transition transition-all duration-300 ease-in-out"
          :class="{ 'w-1/2 h-1/2 rounded-lg group-hover:shadow-xl': recordingStore.isRecording, 'w-full h-full rounded-[100%]': !recordingStore.isRecording }" />
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
localStorage.removeItem('activeShare')

import DesktopIcon from "./icons/desktop.icon.vue";
import ShareButton from "./ShareButton.vue";
import WebcamButton from "./WebcamButton.vue";
// import SysAudioButton from "./systemAudioButton.vue";
import MicButton from "./MicButton.vue";
import ActionButton from "./ActionButton.vue";
import { onUpdated, ref, watch } from 'vue';
// import RecordingOptionsBar from "./RecordingOptionsBar.vue";
import { useRecordingStore, useScreenShare, useCanvasDimensions } from "../stores/index";
import type { ScreenShareState } from "../stores/index";
const recordingStore = useRecordingStore();
const screenShareStore = useScreenShare();
const canvasDimensions = useCanvasDimensions()
const { shares } = useScreenShare();
const sharesRef = ref<ScreenShareState["shares"]>(shares)
  const resetCanvasSize = async () => {
  await canvasDimensions.setCanvasSize({ title: "4K", width: 3840, height: 2160 })
  if(screenShareStore.activeShare.height!==0){
    let reWidth, reHeight;
    if ((screenShareStore.activeShare.height / screenShareStore.activeShare.width) * canvasDimensions.canvasSize.width > canvasDimensions.canvasSize.height) {
      reHeight =canvasDimensions.canvasSize.height;
      reWidth =
      canvasDimensions.canvasSize.height / (screenShareStore.activeShare.height / screenShareStore.activeShare.width);
    } else {
      reWidth = canvasDimensions.canvasSize.width;
      reHeight=
      canvasDimensions.canvasSize.width * (screenShareStore.activeShare.height / screenShareStore.activeShare.width);
    }
    canvasDimensions.setCanvasSize({ title: "custom", width: reWidth, height: reHeight })    
  }

}
watch(
  () => screenShareStore.activeShare.width,
  (newValue, oldValue) => {
       resetCanvasSize()
  }
);

const handleAddScreenShare = async () => {
  shares.push({ width: 0, height: 0 });
  screenShareStore.shares = shares;

  if (screenShareStore.shares.length > 1) {
    if (screenShareStore.shares.filter(s => s.stream && s.stream !== undefined).length === 0) {
      await screenShareStore.setActiveIndex(screenShareStore.shares.length - 1)
      resetCanvasSize()
      if (localStorage.getItem('activeShare')) localStorage.removeItem('activeShare')
    }
    else {
      if (localStorage.getItem('activeShare')) {
        await screenShareStore.setActiveIndex(Number(localStorage.getItem('activeShare')))
        resetCanvasSize()
        localStorage.removeItem('activeShare')
      }
    }
  }
};

</script>

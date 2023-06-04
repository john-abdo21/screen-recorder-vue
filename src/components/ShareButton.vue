<template>
  <div class="w-20 h-14 relative" v-show="Boolean(share.stream)">
    <ActionButton :isActive="share === screenShareStore.activeShare" :isSquareVariant="true">
      <video class="invisible absolute top-0 left-0" ref="video" autoplay playsinline @resize="grabDimensions" />
      <template v-if="share.stream">
        <video @click="makeActive" class="h-full" autoplay playsinline ref="preview" />
        <button @click="stopSharing"
          class="absolute w-5 -top-2 -right-1.5 p-1.5 rounded-full border border-red-600 bg-gray-200 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200 ease-in-out">
          <CloseIcon />
        </button>
      </template>
      <template v-else>
        <LoadingDots />
      </template>
    </ActionButton>
  </div>
</template>
<script setup lang="ts">
import { onUpdated, ref } from 'vue';

import ActionButton from "./ActionButton.vue";
import LoadingDots from "./icons/loadingDots.icon.vue";
import CloseIcon from "./icons/close.icon.vue";
import { onMounted } from "vue";
import { useScreenShare, useScreen, useCanvasDimensions } from "../stores";
import type { ScreenShareState } from "../stores";
const canvasDimensions = useCanvasDimensions()

const props = defineProps<{
  share: Object,
  num: number
}>()
const screenShareStore = useScreenShare();
const screenStore = useScreen();
const share = ref<ScreenShareState["shares"][number]>(props.share);
const preview = ref<HTMLVideoElement>();
const video = ref<HTMLVideoElement>();
const query = ref('Init');
const original = ref(screenShareStore.shares);
const resetCanvasSize = async () => {
  await canvasDimensions.setCanvasSize({ title: "4K", width: 3840, height: 2160 })
  let reWidth, reHeight;
  if(screenShareStore.activeShare.height!==0){
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
const removeShare = async () => {
  await screenShareStore.setScreenShare(screenShareStore.shares.filter(s => s !== share.value));
  if (query.value === 'newAtive') {
    screenShareStore.setActiveIndex(screenShareStore.shares.indexOf(screenShareStore.shares.filter(s => s.stream && s.stream !== undefined)[0]))
    resetCanvasSize()
    query.value = 'Done';
  }
  else if (query.value === 'oldActive') {
    screenShareStore.setActiveIndex(screenShareStore.activeIndex - 1)
    resetCanvasSize()
    query.value = 'Done';
  }
};
const stopSharing = () => {
  if (!localStorage.getItem('activeShare')) {
    original.value = screenShareStore.shares;
  }
  if (screenShareStore.activeShare === share.value) {
    if (screenShareStore.shares.filter(s => s.stream && s.stream !== undefined).length > 1) {
      if (share.value === screenShareStore.shares.filter(s => s.stream && s.stream !== undefined)[0]) {
        query.value = 'newAtive';
        localStorage.setItem('activeShare', JSON.stringify(original.value.indexOf(screenShareStore.shares.filter(s => s.stream && s.stream !== undefined)[1])))
      }
      else {
        localStorage.setItem('activeShare', JSON.stringify(original.value.indexOf(screenShareStore.shares.filter(s => s.stream && s.stream !== undefined)[0])))
        screenShareStore.setActiveIndex(screenShareStore.shares.indexOf(screenShareStore.shares.filter(s => s.stream && s.stream !== undefined)[0]))
        resetCanvasSize()
      }
    }
  }
  else {
    if (screenShareStore.shares.filter(s => s.stream && s.stream !== undefined).length > 0) {
      if (screenShareStore.shares.indexOf(share.value) < screenShareStore.activeIndex) {
        query.value = 'oldActive';
        localStorage.setItem('activeShare', JSON.stringify(original.value.indexOf(screenShareStore.activeShare)))
      }
    }
  }

  if (share.value.preview) share.value.preview.srcObject = null;
  if (video.value) video.value.srcObject = null;
  if (share.value.stream) {
    share.value.stream.getTracks().forEach((track) => track.stop());
    share.value.stream = undefined;
  }
  removeShare();
};
const grabDimensions = () => {
  const { videoWidth, videoHeight } = video.value;
  share.value.width = videoWidth;
  share.value.height = videoHeight;
};

const makeActive = async () => {
  if (original.value) {
    localStorage.setItem('activeShare', JSON.stringify(original.value.indexOf(share.value)));
  }
  screenShareStore.setActiveIndex(screenShareStore.shares.indexOf(share.value));
  resetCanvasSize()
};
onMounted(async () => {
  share.value.preview = video.value;
  try {
    share.value.stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true
    });
    screenStore.setScreenStream(share.value.stream)
    share.value.preview.srcObject = share.value.stream;
    video.value.srcObject = share.value.stream;
    grabDimensions();
    share.value.stream.getVideoTracks()[0].onended = stopSharing;
    
  } catch {
    (err: any) => {
      removeShare();
    }
  }
});
onUpdated(() => {
  if (preview.value && share.value.stream) {
    preview.value.srcObject = share.value.stream;
  }
  if (video.value && share.value.stream) {
    video.value.srcObject = share.value.stream;
    share.value.preview.srcObject = share.value.stream;
  }
})

</script>
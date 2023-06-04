<template>
  <ActionButton :isActive="Boolean(webCamStore.webCamState.stream)" :isPopupOpen="isPopupOpen"
    @popupDismiss="isPopupOpen = false" @click="handleActionButtonClick">
    <template #popupContent>
      <!-- Popup content -->
      <PopupContainer title="Select a webcam">
        <template #default>
          <div v-if="haveDevice === 0" class="flex justify-center p-3">
            <Loader>Fetching cams...</Loader>
          </div>
          <div v-else-if="haveDevice === 1" class="flex flex-col gap-1">
            <TextButton v-for="device in devices" :key="device.deviceId" @click="promptWebcam(device.deviceId)"
              :hasCheck="device.deviceId === webCamStore.webCamState.deviceId">
              {{ device.label }}
            </TextButton>
            <div v-if="webCamStore.webCamState.stream" class="w-full block">
              <TextButton @click="stopWebcam"
                :extraClasses="'bg-fmd-gray_lighter dark:bg-fmd-navy/30 dark:hover:bg-fmd-navy w-full'" :hasClose="true">
                Stop Webcam
              </TextButton>
            </div>
          </div>
        </template>
      </PopupContainer>
    </template>
    <template #default>
      <Camera />
      <video class="absolute w-1 h-1 opacity-0 z-[-10] pointer-events-none" ref="previewWeb" autoplay playsinline muted
        @resize="grabDimensions" />
    </template>

  </ActionButton>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted, onUpdated } from "vue";
import { useWebcam, webcamShapeOptions } from "../stores";
import ActionButton from "./ActionButton.vue";
import Camera from "./icons/camera.icon.vue";
import PopupContainer from "./PopupContainer.vue";
import TextButton from "./TextButton.vue";
import Loader from "./Loader.vue";

const webCamStore = useWebcam();

// initial State
const isPopupOpen = ref(false);
const haveDevice = ref(0);
const previewWeb = ref<HTMLVideoElement>();

const promptWebcam = async (deviceId: string) => {
  stopWebcam();
  isPopupOpen.value = false;
  let wCS = webCamStore.webCamState;
  wCS.deviceId = deviceId;
  wCS.stream = await navigator.mediaDevices.getUserMedia({
    video: {
      deviceId: { exact: deviceId },
    },
  });

  previewWeb.value.srcObject = wCS.stream;

  await webCamStore.setWebCamState({
    deviceId: wCS.deviceId,
    stream: wCS.stream,
    preview: previewWeb.value,
    width: webCamStore.webCamState.width,
    height: webCamStore.webCamState.height,
  })
  grabDimensions();
};
const grabDimensions = async () => {
  if (webCamStore.webCamState.stream?.getVideoTracks?.()?.[0]?.getSettings?.()) {
    const { width, height } = webCamStore.webCamState.stream
      .getVideoTracks()[0]
      .getSettings();
    await webCamStore.setWebCamState({
      deviceId: webCamStore.webCamState.deviceId,
      stream: webCamStore.webCamState.stream,
      preview: webCamStore.webCamState.preview,
      width: width,
      height: height,
    });
    webCamStore.setSelectWebCam(true)
  }
};
const devices = ref(null);
const hasWebcamPermissions = ref(false);
onUpdated(async () => {
  if (isPopupOpen.value) {
    const prom = hasWebcamPermissions.value
      ? Promise.resolve()
      : navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: false,
        })
        .then((stream) => {
          hasWebcamPermissions.value = true;
          stream.getTracks().forEach((track) => track.stop());
          return;
        })
        .catch(err => {
          haveDevice.value = 2 //No Device
        });
    devices.value = await prom
      .then(() => navigator.mediaDevices.enumerateDevices())
      .then((devices) => devices.filter((dev) => dev.kind === "videoinput"));
    if (devices.value.length > 0) haveDevice.value = 1;// One or more device
    else haveDevice.value = 2 // No device
  }
})

const stopWebcam = () => {
  if (webCamStore.webCamState.stream) {
    webCamStore.webCamState.stream.getTracks().forEach((track) => track.stop());
    webCamStore.setWebCamState({
      deviceId: null,
      stream: null,
      preview: null,
      width: webCamStore.webCamState.width,
      height: webCamStore.webCamState.height,
    });
    webCamStore.setSelectWebCam(false)
  }
};
const handleActionButtonClick = () => {
  isPopupOpen.value = true;
};

// Clean up the webcam stream when component unmounts
onUnmounted(() => {
  stopWebcam();
});

</script>
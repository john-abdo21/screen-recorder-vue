<template>
  <ActionButton :isActive="Boolean(micStore.micStream)" :isPopupOpen="isPopupOpen" @click="isPopupOpen = true"
    @popupDismiss="isPopupOpen = false">
    <template #popupContent>
      <!-- Popup content -->
      <PopupContainer title="Select a mic">
        <template #default>
          <div v-if="haveAudioDeviece === 0">
            <div class="flex justify-center p-3">
              <Loader>Fetching mics...</Loader>
            </div>
          </div>
          <div v-else-if="haveAudioDeviece === 1">
            <div class="flex flex-col gap-1">
              <template v-for="device in audioDevices" :key="device.deviceId">
                <TextButton @click="onPromptDevice(device.deviceId)" :hasCheck="micStore.micDeviceId === device.deviceId">
                  {{ device.label }}
                  <span v-if="device.deviceId === 'default'">(Default)</span>
                </TextButton>
              </template>
              <template v-if="micStore.micStream">
                <div name="slide" mode="out-in">
                  <div class="w-full block">
                    <TextButton @click="stopMic"
                      extraClasses="bg-fmd-gray_lighter dark:bg-fmd-navy/30 dark:hover:bg-fmd-blue w-full"
                      :hasClose="true">
                      Stop Mic
                    </TextButton>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>
      </PopupContainer>
    </template>
    <template #default>
      <Mic />
    </template>
  </ActionButton>
</template>
<script setup lang="ts">
import { ref, reactive, onUpdated } from "vue";
import ActionButton from "./ActionButton.vue";
import Mic from "./icons/mic.icon.vue";
import PopupContainer from "./PopupContainer.vue";
import TextButton from "./TextButton.vue";
import Loader from "./Loader.vue";
import { useMic } from "../stores";
const micStore = useMic();
const haveAudioDeviece = ref(0);//initail State
const isPopupOpen = ref(false);

const audioDevices = ref(null);
const hasMicPermission = ref(false);
const onPromptDevice = async (deviceId: string) => {
  stopMic();
  isPopupOpen.value = false;
  try {
    micStore.setMicDeviceId(deviceId);
    micStore.setMicStream(await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: { exact: deviceId },
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    }));
  } catch {
    micStore.setMicDeviceId(null);
    micStore.setMicStream(null);
  }
};
onUpdated(async () => {
  if (isPopupOpen.value) {
    haveAudioDeviece.value = 0;// return initial value
    const prom = hasMicPermission.value
      ? Promise.resolve()
      : navigator.mediaDevices
        .getUserMedia({
          video: false,
          audio: true
        })
        .then((stream) => {
          hasMicPermission.value = true;
          stream.getTracks().forEach((track) => track.stop());
          return;
        }).catch(err => {
          haveAudioDeviece.value = 2 // no audio device
        });
    audioDevices.value = await prom
      .then(() => navigator.mediaDevices.enumerateDevices())
      .then((devices) =>
        devices.filter((dev) => dev.kind === "audioinput")
      );
    if (audioDevices.value.length > 0) haveAudioDeviece.value = 1//have audio device
    else haveAudioDeviece.value = 2 // no audio device
  }
});
const stopMic = () => {
  if (micStore.micStream) {
    micStore.micStream.getTracks().forEach((track) => track.stop());
    micStore.setMicDeviceId(null);
    micStore.setMicStream(null);
  }
};

</script>
<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.2s;
}

.slide-enter-to,
.slide-leave-from {
  transform: translateY(20px);
}
</style>
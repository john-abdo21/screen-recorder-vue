<template>
  <ActionButton :is-active="isActive" @click="controlAudio">
    <template #default>
      <Speaker v-if="isActive" />
      <Mute v-else />
      <video ref="audioVideoElement" class="absolute w-1 h-1 opacity-0 z-[-10] pointer-events-none" autoplay
        muted></video>
    </template>
  </ActionButton>
</template>
<script setup lang="ts">
import { ref } from "vue";
import ActionButton from "./ActionButton.vue";
import Speaker from "./icons/speaker.icon.vue";
import Mute from "./icons/mute.icon.vue";
import { useMic } from "../stores";
const audioStore = useMic();
const isActive = ref<boolean>(false);
const audioVideoElement = ref<HTMLVideoElement | null>(null);

const controlAudio = async () => {
  stopAudio();
  isActive.value = !isActive.value;
  if (isActive.value) {
    try {
let stream, recorder;
      const audioContext = new AudioContext();
      const onlyAudio = {
        audio: {
          sampleRate: 52000,
          channelCount: {
            ideal: 2,
            min: 1,
          },
          noiseSuppression: true,
          autoGainControl: true,
          echoCancellation: true,
          volume: 1.0,
        },
        video: false,
      };
      navigator.mediaDevices
        .getUserMedia(onlyAudio)
        .then(s => {
          console.log(s);
          
          audioStore.setAudioStream(s);
        })
        .catch(err => {
          console.log(err.message);
        });




    } catch (error) {
      console.error(error);
      audioStore.setAudioStream(null);
    }
  } else {
    audioStore.setAudioStream(null);
  }
};
const stopAudio = () => {
  if (audioStore.audioStream) {
    const [track] = audioStore.audioStream.getTracks();
    track.stop();
    audioStore.setAudioStream(null);
  }
};
</script>
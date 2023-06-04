<template>
  <div class="w-full h-full flex justify-center items-center" ref="wrapper">
    <div class="bg-gray-300 overflow-hidden rounded shadow-lg" :style="{
      'aspect-ratio': canvasDimensions.canvasSize.width / canvasDimensions.canvasSize.height,
      'width': containerWidth + 'px',
      'height': containerHeight + 'px'
    }">
      <canvas :width="canvasDimensions.canvasSize.width" :height="canvasDimensions.canvasSize.height" :style="{
        'transform': 'scale(' + scale + ')',
        'transform-origin': 'top left'
      }" ref="canvas" />
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  useCanvasDimensions,
  useWebcam,
  useScreen,
  useScreenShare,
  useActiveTheme,
  backgroundsStore,
  useRecordingStore,
  useMic,
  useWebcamLayoutState,
  useScreenLayoutState,
  useGeneralLayoutState,
} from "../stores";
const canvasDimensions = useCanvasDimensions()
const webcamStore = useWebcam();
const screenStore = useScreen();
const screenShareStore = useScreenShare();
const recordingStore = useRecordingStore()
const activeThemeStore = useActiveTheme();
const backgroundStore = backgroundsStore();
const micStore = useMic();
const webcamLayoutState = useWebcamLayoutState();
const screenLayoutState = useScreenLayoutState();
const generalLayoutState = useGeneralLayoutState();

import type { DrawArgs } from "../stores";
import {
  drawHelperGrid,
  drawScreenShare,
  drawWebcam,
} from "../utils/layoutDrawers";
import { onMounted, onUnmounted, onUpdated, ref, watch } from "vue";

// Container measurements
const wrapper = ref<HTMLDivElement>(),
  containerWidth = ref(0),
  containerHeight = ref(0);
const scale = ref(containerWidth.value / canvasDimensions.canvasSize.width);
// Canvas tracking
const canvas = ref<HTMLCanvasElement>(),
  ctx = ref<CanvasRenderingContext2D>();
watch(
  () => canvasDimensions.canvasSize.width,
  (newValue, oldValue) => {
    measure()
  }
);
watch(
  () => canvasDimensions.canvasSize.height,
  (newValue, oldValue) => {
    measure()
  }
);
// Track container sizing, so we can scale accordingly.
const measure = () => {
  const { width, height } = wrapper.value.getBoundingClientRect();
  if ((canvasDimensions.canvasSize.height / canvasDimensions.canvasSize.width) * width > height) {
    containerHeight.value = height;
    containerWidth.value =
      height / (canvasDimensions.canvasSize.height / canvasDimensions.canvasSize.width);
  } else {
    containerWidth.value = width;
    containerHeight.value =
      width * (canvasDimensions.canvasSize.height / canvasDimensions.canvasSize.width);
  }
  scale.value = containerWidth.value / canvasDimensions.canvasSize.width;
};
const drawArgs = ref<DrawArgs>();

onMounted(() => {
  // On mount, get canvas render context
  ctx.value ||= canvas.value.getContext("2d");
  // Event Lisnter when your window size is changed
  window.addEventListener("resize", measure);

  // Track drawArgs
  drawArgs.value = {
    ctx: ctx.value,
    theme: activeThemeStore.activeTheme,
    canvasSize: canvasDimensions.canvasSize,
    activeShare: screenShareStore.activeShare,
    webcamState: webcamStore.webCamState,
    micAnalyzer: micStore.micAnalyzer,
    audioAnalyzer: micStore.audioAnalyzer,
    webcamLayoutState: webcamLayoutState.webcamLayoutState,
    screenLayoutState: screenLayoutState.screenLayoutState,
    generalLayoutState: generalLayoutState.generalLayoutState,
  };
  // onUpdated(() => {
  if (wrapper.value && canvasDimensions.canvasSize) {
    measure();
  }

  // Kick off drawing process based on recordingFPS
  if (drawArgs.value.ctx) startDraw(recordingStore.recordingFPS);

  // Setting up canvas capture stream
  if (canvas.value) {
    if (screenStore.canvasStream) {
      screenStore.canvasStream.getTracks().forEach((track: any) => track.stop());
    }
    screenStore.setCanvasStream(canvas.value.captureStream(recordingStore.recordingFPS));
  }

  // Track drawArgs
  drawArgs.value.ctx = ctx.value;
  drawArgs.value.theme = activeThemeStore.activeTheme;
  drawArgs.value.canvasSize = canvasDimensions.canvasSize;
  drawArgs.value.micAnalyzer = micStore.micAnalyzer;
  drawArgs.value.audioAnalyzer = micStore.audioAnalyzer;
  drawArgs.value.activeShare = screenShareStore.activeShare;

})

onUpdated(() => {
  // Setting up canvas capture stream
  if (canvas.value) {
    if (screenStore.canvasStream) {
      screenStore.canvasStream.getTracks().forEach((track: any) => track.stop());
    }
    screenStore.setCanvasStream(canvas.value.captureStream(recordingStore.recordingFPS));
  }
  // Track drawArgs
  drawArgs.value.ctx = ctx.value;
  drawArgs.value.theme = activeThemeStore.activeTheme;
  drawArgs.value.canvasSize = canvasDimensions.canvasSize;
  drawArgs.value.micAnalyzer = micStore.micAnalyzer;
  drawArgs.value.audioAnalyzer = micStore.audioAnalyzer;
  drawArgs.value.activeShare = screenShareStore.activeShare;
})

onUnmounted(() => {
  window.removeEventListener("resize", measure);
})

/**
 * Some internal state for raf loop and FPS.
 */
let then: number,
  startTime: number,
  now: number,
  elapsed: number,
  fpsInterval: number;

// Kick off the drawing process with a desired FPS
const startDraw = (desiredFps: number) => {
  fpsInterval = 1000 / desiredFps;
  then = performance.now();
  startTime = then;
  draw();
  requestAnimationFrame(loop);
};

// raf loop
const loop = (newTime: number) => {
  // Handle FPS stuff
  now = newTime;
  elapsed = now - then;
  if (elapsed > fpsInterval) {
    then = now - (elapsed % fpsInterval);
    draw();
  }

  requestAnimationFrame(loop);
};

// Actual draw fn
const draw = () => {
  // Note: this is a bit of a hack, but avoids vue's reactivity from triggering
  //  reactive block above that calls `startDraw`.
  const c = drawArgs.value.ctx;
  // Draw
  c.clearRect(0, 0, canvas.value.width, canvas.value.height);
  c.imageSmoothingQuality = "high";
  c.globalCompositeOperation = "source-over";
  if (screenShareStore.activeShare) {
    drawArgs.value.activeShare = screenShareStore.activeShare
    drawScreenShare(drawArgs.value);
  }
  if (webcamStore.selectWebCam) {
    drawArgs.value.webcamState = webcamStore.webCamState
    drawWebcam(drawArgs.value);
  }
  // Background gets drawn last
  c.globalCompositeOperation = "destination-over";
  backgroundStore.activeBackground?.draw(drawArgs.value);
};
</script>

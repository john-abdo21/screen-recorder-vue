<script setup lang="ts">
  import Preview from "./components/Preview.vue";
  import ActionBar from "./components/ActionBar.vue";
  // import SidebarThemeSection from "./components/SidebarThemeSection.vue";
  import { patchBlob } from "./utils/blobHelpers";
  import SidebarLayoutSection from "./components/SidebarLayoutSection.vue";
  import { getPreferredMimeType } from "./utils/getPreferredMimeType";
  import { useRecordingStore,useScreen, useMic } from "./stores/index";

  const recordingStore=useRecordingStore();
    const screenStore=useScreen();
    const micStore=useMic();
  let recorder: MediaRecorder;
  const chunks: Blob[] = [];
  let ext: string = "";

  const onDataAvailable = (e: BlobEvent) => {
    chunks.push(e.data);
  };

  const onRecorderStop = async () => {
    const duration = performance.now() - recordingStore.recordingStartTime;
    recordingStore.setRecordingStartTime(null);

    // const completeBlob = new Blob(chunks, { type: chunks[0].type });
    const completeBlob = new Blob(chunks, { type: 'video/mp4' });
    const newBlob = await patchBlob(completeBlob, duration);
    const data = URL.createObjectURL(newBlob);

    const link = document.createElement("a");
    link.href = data;
    link.download = `video.${ext}`;
    link.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: false,
        view: window,
      })
    );

    setTimeout(() => {
      URL.revokeObjectURL(data);
      link.remove();
    }, 500);
  };

  const startRecording = async() => {
    recordingStore.setRecordingStartTime(performance.now());
    chunks.length = 0;
    const combinedStream = new MediaStream([
      ...(screenStore.canvasStream?.getTracks() || []),
      ...(micStore.micStream?.getTracks() || []),
      ...(micStore.audioStream?.getTracks() || []),
      ...(screenStore.screenStream?.getTracks() || []),
    ]);
console.log(micStore.micStream)
console.log(micStore.audioStream)
    // TODO: dynamic bits per second based on resolution...
    const mime:any = getPreferredMimeType();
    ext = mime.ext;
    recorder = new MediaRecorder(combinedStream, {
      audioBitsPerSecond: 128000, // 128 kbps
      videoBitsPerSecond: 10 * 1000 * 1000, // N mbps
      // mimeType: mime.mimeType,
      mimeType: 'video/webm;codecs=h264',
    });
    recorder.ondataavailable = onDataAvailable;
    recorder.onstop = onRecorderStop;

    recorder.start();
  };
  const stopRecording = () => {
    recorder.stop();
  };
  const onRecordButtonPress = () => {
    if (recordingStore.isRecording) stopRecording(); 
    else startRecording();
  };
</script>

<template>
<div
  class="w-screen h-screen overflow-hidden bg-fmd-gray_lighter p-0 sm:p-3 md:pr-0 sm:p-3 md:pr-0 flex items-center relative dark:bg-fmd-navy"
>
  <div class="w-full flex gap-12 mr-0 ml-9 h-full">
    <div
      class="relative flex flex-col gap-4 flex-grow max-w-[calc(100%-350px)]"
    >
      <div class="flex-grow overflow-hidden">
        <Preview />
      </div>
      <ActionBar @record="onRecordButtonPress" />
    </div>
    <div class="border-l-[1px] border-fmd-gray w-1/3 flex flex-col gap-10 px-6 dark:border-fmd-blue">
      <!-- <SidebarThemeSection /> -->
      <SidebarLayoutSection />
    </div>
  </div>
</div>
</template>

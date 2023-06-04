<template>
  <div
    class="grid grid-cols-3 grid-rows-3 py-1 w-full border border-fmd-gray overflow-hidden rounded dark:border-fmd-blue"
  >
    <template v-for="vertOp in verticalAlignmentOptions">
      <button
        v-for="horOp in horizontalAlignmentOptions"
        :key="`${horOp}_${vertOp}`"
        :class="[
          'h-6 py-4 border-fmd-gray_darker text-xs overflow-hidden hover:fill-fmd-yellow dark:hover:fill-fmd-sky transition transition-colors duration-100 ease-in-out flex justify-center items-center',
          webcamLayoutState.webcamLayoutState.horizAlign=== horOp && webcamLayoutState.webcamLayoutState.vertAlign === vertOp
            ? 'fill-fmd-red'
            : 'fill-fmd-gray_darker/30 dark:fill-fmd-sky/10',
        ]"
        @click="setWebCamLayoutState(horOp,vertOp)"
        :aria-label="`align ${horOp} horizontally, ${vertOp} vertically`"
      >
        <svg :height="DOT_SIZE" :width="DOT_SIZE">
          <circle :cx="DOT_SIZE / 2" :cy="DOT_SIZE / 2" :r="DOT_SIZE / 2" />
        </svg>
      </button>
    </template>
  </div>
</template>
 <script setup lang="ts">
import { HorizAlign, VertAlign, horizontalAlignmentOptions, verticalAlignmentOptions,useWebcamLayoutState } from '../stores';
import { ref } from 'vue';
 const DOT_SIZE = 14;

const webcamLayoutState=useWebcamLayoutState();
const setWebCamLayoutState=(horOp:any,vertOp:any)=>{
  webcamLayoutState.setHorizAlignAndVertAlign({ horizAlign : horOp, vertAlign : vertOp})
}
</script>
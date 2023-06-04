<template>
  <SidebarSection title="Layout">
    <div class="grid grid-cols-2 gap-x-4 gap-y-6">
      <div>
        <InputLabel>Webcam Position</InputLabel>
        <div class="mb-1"></div>
        <AlignmentPicker
          :horizAlign="webcamLayoutState.webcamLayoutState.horizAlign ? webcamLayoutState.webcamLayoutState.horizAlign : 'left'"
          :vertAlign="webcamLayoutState.webcamLayoutState.vertAlign ? webcamLayoutState.webcamLayoutState.vertAlign : 'top'" />
      </div>
      <div>
        <!-- <InputLabel>Screen Position</InputLabel>
        <div class="mb-1"></div>
        <AlignmentPicker
          :horizAlign.sync="screenLayoutState.horizAlign"
          :vertAlign.sync="screenLayoutState.vertAlign"
        /> -->
      </div>
      <!-- Webcam shape/width -->
      <!-- <div class="col-span-2">
        <Select
          :title="webcamShapeOptions.map((val) => ({
            title: titleCase(val),
            value: val,
          }))"
          :name="webcamShape"
          :options="webcamShapeOptions"
          :value.sync="webcamLayoutState.shape"
          :isDropdown="false"
        />
      </div> -->
      <RangeInput name="size" title="Webcam Width" :value="webcamLayoutState.webcamLayoutState.size" @set-state="setSize"
        :min="0" :max="1" :step="0.02" />
      <template v-if="webcamLayoutState.webcamLayoutState.shape === 'initial'">
        <RangeInput name="webcamBorderRadius" title="Border radius"
          :value="webcamLayoutState.webcamLayoutState.borderRadius" @set-state="setwebcamBorderRadius" :min="0" :max="1"
          :step="0.02" />
      </template>
    </div>
  </SidebarSection>
</template>
<script setup lang="ts">
import SidebarSection from "./SidebarSection.vue";
import InputLabel from "./InputLabel.vue";
import AlignmentPicker from "./AlignmentPicker.vue";
import { ref } from "vue";
// import { titleCase } from "../utils/titleCase.js";
import Select from "./Select.vue";
import RangeInput from "./RangeInput.vue";
import {
  useScreenLayoutState,
  useWebcamLayoutState,
  WebcamShape,
  webcamShapeOptions,
} from "../stores";
const screenLayoutState = useScreenLayoutState(),
  webcamLayoutState = useWebcamLayoutState();
const setwebcamBorderRadius = (value: number) => {
  webcamLayoutState.setBorderWidth(value)
}
const setSize = (value: number) => {
  webcamLayoutState.setSize(value)
}

</script>
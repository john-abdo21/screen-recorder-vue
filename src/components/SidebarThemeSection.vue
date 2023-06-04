html
<template>
  <SidebarSection title="Theme">
    <div class="grid grid-cols-2 gap-6">
      <div class="col-span-2 grid grid-cols-6 gap-y-3">
        <div class="col-span-6">
          <InputLabel>Color Theme</InputLabel>
        </div>
        <button v-for="(theme, i) in themes" :key="i"
          class="group transition transition-bg duration-150 focus:outline-none" :class="{
            'border-l-[1px] border-fmd-gray dark:border-fmd-blue': i !== 0,
            'bg-fmd-red/5 focus:bg-fmd-red/5 dark:bg-fmd-blue/50 dark:focus:bg-fmd-blue/50': theme === activeTheme,
            'hover:bg-fmd-yellow/10 focus:bg-fmd-yellow/10 dark:hover:bg-fmd-blue/20 dark:focus:bg-fmd-blue/20': theme !== activeTheme
          }" @click="activeTheme = theme">
          <div class="grid grid-cols-2 gap-1 p-2">
            <div class="w-full aspect-square" :style="'background-color:' + theme.primary" />
            <div class="w-full aspect-square" :style="'background-color:' + theme.secondary" />
          </div>
          <!-- <div
            class="transition transition-all duration-150"
            :class="{
              'bg-fmd-red group-focus:bg-fmd-red': theme === activeTheme,
              'group-hover:bg-fmd-yellow group-focus:bg-fmd-yellow dark:group-hover:bg-fmd-sky dark:group-focus:bg-fmd-sky': theme !== activeTheme,
            'h-1'} "
          /> -->
        </button>
        <button
          class="group transition transition-bg duration-150 focus:outline-none border-l-[1px] border-fmd-gray dark:border-fmd-blue"
          :class="{
            'bg-fmd-red/5 focus:bg-fmd-red/5 dark:bg-fmd-blue/50 dark:focus:bg-fmd-blue/50': customTheme === activeTheme,
            'hover:bg-fmd-yellow/10 focus:bg-fmd-yellow/10 dark:hover:bg-fmd-blue/20 dark:focus:bg-fmd-blue/20': customTheme !== activeTheme
          }" @click="activeTheme = customTheme">
          <div
            class="m-auto h-[calc(100%-5px)] leading-[40px] align-middle text-xs transition transition-all duration-150 dark:text-white">
            Custom
          </div>
          <div class="transition transition-all duration-150" :class="{
            'bg-fmd-red group-focus:bg-fmd-red': customTheme === activeTheme,
            'group-hover:bg-fmd-yellow group-focus:bg-fmd-yellow dark:group-hover:bg-fmd-sky dark:group-focus:bg-fmd-sky': customTheme !== activeTheme
          } h - 1" />
        </button>
        <div v-if=" activeTheme === customTheme " class="col-span-6 grid grid-cols-2 gap-x-4" transition="slide"
          duration="150">
          <div class="col-span-2 pb-2">
            <InputLabel name="customTheme">Custom Theme</InputLabel>
          </div>
          <ColorInput title="Primary Color" v-model=" customTheme.primary " />
          <ColorInput title="Secondary Color" v-model=" customTheme.secondary " rightAlignPopup />
        </div>
      </div>
      <Select title="Background Style" name="background"
        :options=" backgrounds.map((bg) => ({ title: bg.title, value: bg })) " v-model=" activeBackground " />
      <RangeInput name="padding" title="Padding" v-model=" generalLayoutState.generalLayoutState.padding " min="0" max="0.4"
        step="0.004" />
    </div>
  </SidebarSection>
</template>
<script setup lang="ts">
import SidebarSection from "./SidebarSection.vue";
import Select from "./Select.vue";
import InputLabel from "./InputLabel.vue";
import RangeInput from "./RangeInput.vue";
import ColorInput from "./ColorInput.vue";
import {
  backgroundsStore,
  useGeneralLayoutState,
} from "../stores";
import { computed } from "vue";
const backgroundStore = backgroundsStore();
const generalLayoutState = useGeneralLayoutState();
let activeBackground = computed(() => backgroundStore.getActiveBackground)
</script>
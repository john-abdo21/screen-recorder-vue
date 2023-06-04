import { defineStore } from 'pinia'
import { any, z } from "zod";
import { reactive, watch } from 'vue'
import {
  createAudioBarBackground,
  createAudioWaveBackground,
  createLinearGradientBackground,
  createRainbowAudioBarBackground,
  createSolidBackground,
} from "../utils/backgroundDrawers";

/**
 * Recording state
 */
export const useRecordingStore = defineStore({
  id: 'recording',
  state: () => ({
    recordingStartTime: null as any,
    recordingFPS: Number(localStorage.getItem("recordingFps")) || 30,
    durationTime: null as String | null
  }),
  getters: {
    isRecording: (state) => state.recordingStartTime !== null,
    recordingDuration: (state) => {
      if (!state.recordingStartTime && state.durationTime === null) return null;
      const setDuration = () => {
        const s = Math.floor((performance.now() - state.recordingStartTime) / 1000);
        const numMins = Math.floor(s / 60);
        const numSecs = s % 60;
        state.durationTime = `${numMins}:${String(numSecs).padStart(2, "0")}`;
      };

      let interval = setInterval(setDuration, 500);
      if (!state.recordingStartTime) {
        clearInterval(interval)
        return null;
      }
      else {
        setDuration();
      }
    },
  },
  actions: {
    setRecordingStartTime(time: number | null) {
      this.recordingStartTime = time;
    },
    setRecordingFPS(fps: number) {
      localStorage.setItem('recordingFPS', String(fps));
      this.recordingFPS = fps;
    },
  },
});

/**
* Track video stream
*/
export interface ScreenShareState {
  activeIndex: number;
  shares: {
    stream?: MediaStream;
    preview?: HTMLVideoElement;
    width: number;
    height: number;
  }[];
}
export const useScreenShare = defineStore({
  id: "screenShare",
  state: () => ({
    activeIndex: 0,
    shares: [] as ScreenShareState["shares"],
  }),
  getters: {
    activeShare: (state) => {
      if(state.shares[state.activeIndex])return state.shares[state.activeIndex];
      else return {width:0,height:0}
    },
    getShares: (state) => {
      return state.shares;
    },
    displayStream: (state) => {
      if (state.activeIndex === null || state.shares.length === 0) return null;
      return state.shares[state.activeIndex]?.stream;
    },
    displayPreview: (state) => {
      if (state.activeIndex === null || state.shares.length === 0) return null;
      return state.shares[state.activeIndex]?.preview;
    },
    displayDimensions: (state) => {
      if (state.activeIndex === null || state.shares.length === 0) return null;
      const activeShare = state.shares[state.activeIndex];
      if (!activeShare) return null;
      return {
        width: activeShare.width,
        height: activeShare.height,
      };
    },
  },
  actions: {
    setScreenShare(screenShares: ScreenShareState["shares"]) {
      this.shares = screenShares;
    },
    pushScreenShare(screenShare: any) {
      this.shares.push(screenShare);
    },
    setActiveIndex(activeIndex: number) {
      this.activeIndex = activeIndex;
    },
  },
});

/**
* Track webcam stream
*/
type WebcamState = {
  deviceId?: string | null;
  stream?: MediaStream | null;
  preview?: HTMLVideoElement | null;
  width: number;
  height: number;
};
export const useWebcam = defineStore({
  id: "webcam",
  state: () => ({
    webCamState: {
      width: 0,
      height: 0,
    } as WebcamState,
    selectWebCam: false as Boolean
  }),
  getters: {
    getSelected: (state) => state.selectWebCam,
  },
  actions: {
    setWebCamState(stream: any) {
      this.webCamState = stream;
    },
    setSelectWebCam(bln: Boolean) {
      this.selectWebCam = bln;
    },
  },
});


/**
 * Mic stream
 */
export const useMic = defineStore({
  id: 'mic',
  state: () => ({
    micStream: null as MediaStream | null,
    // audioStream: null as MediaStream | null,
    micDeviceId: null as string | null,
  }),
  getters: {
    micAnalyzer: (state) => {
      if (!state.micStream) return null;
      const $stream = state.micStream;
      const context = new AudioContext();
      const analyser = context.createAnalyser();
      analyser.fftSize = 128;
      analyser.minDecibels = -90;
      analyser.maxDecibels = -15;

      const source = context.createMediaStreamSource($stream);
      source.connect(analyser);

      let freqs = new Uint8Array(analyser.frequencyBinCount);

      return { freqs, analyser };
    },
  },
  actions: {
    setMicStream(stream: any) {
      this.micStream = stream;
    },
    // setAudioStream(stream: any) {
    //   this.audioStream = stream;
    // },
    setMicDeviceId(deviceId: any) {
      this.micDeviceId = deviceId;
    },
  },
});

/**
 * Screen stream &
 * Canvas stream
 */
export const useScreen = defineStore({
  id: 'screen',
  state: () => ({
    screenStream: null as MediaStream | null,
    canvasStream: null as MediaStream | null
  }),
  getters: {
    getScreenStream: (state) => {
      return state.screenStream;
    },
    getCanvasStream: (state) => {
      return state.canvasStream;
    },
  },
  actions: {
    setScreenStream(stream: any) {
      this.screenStream = stream;
    },
    setCanvasStream(stream: any) {
      this.canvasStream = stream;
    },
  },
});


/**
 * Canvas sizes
 */
export interface CanvasSize {
  title: string;
  width: number;
  height: number;
}
export const canvasSizes: CanvasSize[] = [
  { title: "4K", width: 3840, height: 2160 },
  { title: "2K", width: 2560, height: 1440 },
  { title: "1080p", width: 1920, height: 1080 },
  { title: "Square", width: 1920, height: 1920 },
  { title: "Portrait", width: 1000, height: 1800 },
];
export const recordingFPSOptions: number[] = [24, 30, 60];
const initSizeName = localStorage.getItem("canvasSize");
const initSize = canvasSizes.find((size) => size.title === initSizeName) || canvasSizes[0];
export const useCanvasDimensions = defineStore({
  id: 'canvasDimensions',
  state: () => ({
    canvasSize: initSize as CanvasSize,
  }),
  actions: {
    setCanvasSize(canvasSize: CanvasSize) {
      localStorage.setItem("canvasSize", canvasSize.title);
      this.canvasSize = canvasSize;
    },
  },
  getters: {
    currentCanvasSize(state): CanvasSize {
      return state.canvasSize;
    },
  },
});

/**
 * Theming
 */
export interface Theme {
  title: string;
  primary: string;
  secondary: string;
  accent: string;
}
export const themes: Theme[] = [
  { title: "Sun", primary: "#e78e47", secondary: "#f7d570", accent: "#ffffff" },
  {
    title: "Green",
    primary: "#15a356",
    secondary: "#9dF06c",
    accent: "#ffffff",
  },
  {
    title: "Basic",
    primary: "#32056f",
    secondary: "#7139e6",
    accent: "#ffffff",
  },
  {
    title: "White and Blue",
    primary: "#ffffff",
    secondary: "#3638dc",
    accent: "#ffffff",
  },
  {
    title: "Black-ish",
    primary: "#232323",
    secondary: "#434343",
    accent: "#959595",
  },
];
const defaultCustomTheme = {
  title: "Custom",
  primary: "#848484",
  secondary: "#848484",
  accent: "#848484",
};
const initCustomTheme =
  localStorage.getItem("customTheme") || defaultCustomTheme;
export const useCustomTheme = defineStore({
  id: 'customTheme',
  state: () => ({
    customTheme: initCustomTheme,
  }),
  actions: {
    setCustomTheme(customTheme: Theme) {
      localStorage.setItem("customTheme", JSON.stringify(customTheme));
      this.customTheme = customTheme;

      const activeThemeStore = useActiveTheme();
      activeThemeStore.setActiveTheme(customTheme);
    },
  },
  getters: {
    currentCustomTheme(state) {
      return state.customTheme;
    },
  },
});

const initThemeTitle = localStorage.getItem("theme");
const initTheme = themes.find((theme) => theme.title === initThemeTitle) || themes[0];
export const useActiveTheme = defineStore({
  id: 'activeTheme',
  state: () => ({
    activeTheme: initTheme,
  }),
  actions: {
    setActiveTheme(theme: Theme) {
      localStorage.setItem("theme", theme.title);
      this.activeTheme = theme;
    },
  },
  getters: {
    currentActiveTheme(state): Theme {
      return state.activeTheme;
    },
  },
});


/**
 * ------------------------------
 * Background/layout drawing stuff
 * ------------------------------
 */
export type DrawArgs = {
  ctx: CanvasRenderingContext2D;
  theme: Theme;
  canvasSize: CanvasSize;
  activeShare: ScreenShareState["shares"][number] | any;
  webcamState: WebcamState | any;
  micAnalyzer: null | { freqs: Uint8Array; analyser: AnalyserNode };
  audioAnalyzer: null | { freqs: Uint8Array; analyser: AnalyserNode };
  generalLayoutState: GeneralLayoutState;
  webcamLayoutState: WebcamLayoutState;
  screenLayoutState: ScreenState;
};

export type DrawFn = (args: DrawArgs) => void;


/**
 * ------------------------------
 * Background
 * ------------------------------
 */
type Background = {
  title: string;
  draw: DrawFn;
};

export const backgrounds: Background[] = [
  {
    title: "Audio Bars (Thin)",
    draw: createAudioBarBackground({ N: 2 }),
  },
  {
    title: "Audio Bars (Medium)",
    draw: createAudioBarBackground({ N: 4 }),
  },
  {
    title: "Audio Bars (Thick)",
    draw: createAudioBarBackground({ N: 8 }),
  },
  {
    title: "Audio Wave",
    draw: createAudioWaveBackground(),
  },
  {
    title: "Rainbow Bars",
    draw: createRainbowAudioBarBackground({
      N: 2,
      initHue: 0,
      gapPercent: 0.003,
    }),
  },
  {
    title: "Gradient (to bottom right)",
    draw: createLinearGradientBackground("bottom_right"),
  },
  {
    title: "Gradient (to top)",
    draw: createLinearGradientBackground("top"),
  },
  {
    title: "Gradient (to bottom)",
    draw: createLinearGradientBackground("bottom"),
  },
  {
    title: "Gradient (to left)",
    draw: createLinearGradientBackground("left"),
  },
  {
    title: "Gradient (to right)",
    draw: createLinearGradientBackground("right"),
  },
  {
    title: "Solid (primary)",
    draw: createSolidBackground("primary"),
  },
  {
    title: "Solid (secondary)",
    draw: createSolidBackground("secondary"),
  },
];

const initBackgroundTitle = localStorage.getItem("background");
const initBackground =
  backgrounds.find(
    (background) => background.title === initBackgroundTitle
  ) || backgrounds[1];
export const backgroundsStore = defineStore('backgrounds', {
  state: () => ({
    activeBackground: initBackground,
  }),
  actions: {
    setActiveBackground(background: Background) {
      if (background) {
        this.activeBackground = background;
        localStorage.setItem("background", background.title);
      }
    },
  },
  getters: {
    getActiveBackground(state) {
      return state.activeBackground
    },
  },
});

/**
 * General layout state
 */
const generalLayoutStateSchema = z.object({
  padding: z.number().min(0).max(1).optional().default(0.1),
});

type GeneralLayoutState = z.infer<typeof generalLayoutStateSchema>
let initGeneralLayoutState: GeneralLayoutState = {
  padding: 0
};
try {
  const storedWebcamState = localStorage.getItem("generalLayoutState");
  initGeneralLayoutState = generalLayoutStateSchema.parse(
    storedWebcamState
      ? JSON.parse(storedWebcamState)
      : generalLayoutStateSchema.parse({})
  );
} catch { }
export const useGeneralLayoutState = defineStore({
  id: 'generalLayoutState',
  state: () => ({
    generalLayoutState: initGeneralLayoutState as GeneralLayoutState,
  }),
  actions: {
    setGeneralLayoutState(layoutState: GeneralLayoutState) {
      try {
        localStorage.setItem("generalLayoutState", JSON.stringify(layoutState));
      } catch { }
      this.generalLayoutState = layoutState;
    },
  },
});


/**
 * Webcam state
 */
export enum HorizAlign {
  left = "left",
  center = "center",
  right = "right",
}

export enum VertAlign {
  top = "top",
  center = "center",
  bottom = "bottom",
}

export enum WebcamShape {
  initial = "initial",
  circle = "circle",
}

export const horizontalAlignmentOptions = [
  HorizAlign.left,
  HorizAlign.center,
  HorizAlign.right,
] as const;

export const verticalAlignmentOptions = [
  VertAlign.top,
  VertAlign.center,
  VertAlign.bottom,
] as const;

export const webcamShapeOptions = [
  WebcamShape.circle,
  WebcamShape.initial,
] as const;

const webcamStateSchema = z.object({
  horizAlign: z
    .enum(horizontalAlignmentOptions)
    .optional()
    .default(HorizAlign.right),
  vertAlign: z
    .enum(verticalAlignmentOptions)
    .optional()
    .default(VertAlign.bottom),
  shape: z.enum(webcamShapeOptions).optional().default(WebcamShape.initial),
  size: z.number().min(0).max(1).optional().default(0.4),
  borderRadius: z.number().min(0).max(1).optional().default(0.05),
});

type WebcamLayoutState = z.infer<typeof webcamStateSchema>;
let initWebcamState: WebcamLayoutState | any = {};
try {
  const storedWebcamState = localStorage.getItem("webcamState");
  initWebcamState = webcamStateSchema.parse(
    storedWebcamState
      ? JSON.parse(storedWebcamState)
      :
      webcamStateSchema.parse({})
  );
} catch { }


export const useWebcamLayoutState = defineStore({
  id: 'webcamLayoutState',
  state: () => ({
    webcamLayoutState: initWebcamState as WebcamLayoutState
  }),
  actions: {
    setHorizAlignAndVertAlign(webcamState: any) {
      this.webcamLayoutState.horizAlign = webcamState.horizAlign;
      this.webcamLayoutState.vertAlign = webcamState.vertAlign;
      try {
        localStorage.setItem("webcamState", JSON.stringify(this.webcamLayoutState));
      } catch { }
    },
    setSize(webcamState: number) {
      this.webcamLayoutState.size = Number(webcamState);
      try {
        localStorage.setItem("webcamState", JSON.stringify(this.webcamLayoutState));
      } catch { }
    },
    setBorderWidth(webcamState: number) {
      this.webcamLayoutState.borderRadius = Number(webcamState);
      try {
        localStorage.setItem("webcamState", JSON.stringify(this.webcamLayoutState));
      } catch { }
    },
  },
});

/**
 * Screen/display state
 */

const screenStateSchema = z.object({
  horizAlign: z
    .enum(horizontalAlignmentOptions)
    .optional()
    .default(HorizAlign.left),
  vertAlign: z
    .enum(verticalAlignmentOptions)
    .optional()
    .default(VertAlign.bottom),
});

type ScreenState = z.infer<typeof screenStateSchema>;

let initScreenState: ScreenState = {
  horizAlign: HorizAlign.left,
  vertAlign: VertAlign.bottom,
};
try {
  const storedScreenState = localStorage.getItem("screenState");
  initScreenState = screenStateSchema.parse(
    JSON.parse(storedScreenState || "")
  );
} catch { }
export const useScreenLayoutState = defineStore({
  id: "screenLayoutState",
  state: () => ({
    screenLayoutState: initScreenState as ScreenState,
  }),
  actions: {
    setScreenLayoutState(screenState: ScreenState) {
      try {
        localStorage.setItem("screenState", JSON.stringify(screenState));
      } catch { }
      this.screenLayoutState = screenState;
    },
  },
});

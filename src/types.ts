export type LollipopStyle = 'spiral' | 'pinwheel' | 'ball' | 'heart';

export interface FlavorConfig {
  id: string;
  name: string;
  description: string;
  colors: string[];
  glowColor: string;
  accentColor: string;
  bgGradient?: string;
}

export type CurtainTheme = {
  id: string;
  name: string;
  bgClass: string;
  bgHex: string;
  textColor: string;
  accentColor: string;
};

export interface LoaderConfig {
  durationSeconds: number;
  curtainThemeId: string;
  lollipopStyle: LollipopStyle;
  spinSpeed: number;
  showPercentage: boolean;
  autoReplay: boolean;
  soundEnabled: boolean;
}

export type LoadingMode = 'simulated' | 'infinite';

export interface LoaderSettings {
  style: LollipopStyle;
  flavorId: string;
  mode: LoadingMode;
  durationSeconds: number;
  spinSpeed: number;
  showProgressBar: boolean;
  showSparkles: boolean;
  enableSound: boolean;
  stickRibbon: boolean;
}

export interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
}

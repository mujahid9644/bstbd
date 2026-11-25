export const MOTION_EASE = {
  entrance: "power4.out",
  transition: "power3.inOut",
  image: "power4.inOut",
  loader: "power4.inOut",
} as const;

export const MOTION_DURATION = {
  text: 1,
  textMin: 0.9,
  textMax: 1.2,
  image: 1.4,
  imageMin: 1.2,
  imageMax: 1.6,
  hover: 0.35,
  loader: 0.9,
  loaderMinimum: 1.2,
  section: 0.8,
} as const;

export const MOTION_STAGGER = {
  line: 0.08,
  char: 0.03,
  word: 0.015,
  grid: 0.12,
  strip: 0.06,
} as const;

export const MOTION_LAYOUT = {
  desktopStrips: 11,
  mobileStrips: 6,
  mobileBreakpoint: 768,
  scrollStart: "top 85%",
} as const;

export const MOTION_SCROLL = {
  lerp: 0.08,
  parallaxFrom: -7,
  parallaxTo: 7,
} as const;

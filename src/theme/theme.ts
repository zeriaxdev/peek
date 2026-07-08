import {
  sand,
  sandDark,
  gray,
  grayDark,
  bronze,
  bronzeDark,
  gold,
  goldDark,
  blue,
  blueDark,
  violet,
  violetDark,
  grass,
  grassDark,
  tomato,
  tomatoDark,
  amber,
  amberDark,
  cyan,
  cyanDark,
  pink,
  pinkDark,
} from "@radix-ui/colors";

export type Mode = "light" | "dark";
export type ThemeSettings = { mode: Mode; accent: string; gray: string };

// Chord defaults: bronze accent on a warm sand grayscale
export const DEFAULT_THEME: ThemeSettings = {
  mode: matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
  accent: "bronze",
  gray: "sand",
};

type Scale = Record<string, string>;
const ACCENTS: Record<string, { light: Scale; dark: Scale }> = {
  bronze: { light: bronze, dark: bronzeDark },
  gold: { light: gold, dark: goldDark },
  blue: { light: blue, dark: blueDark },
  violet: { light: violet, dark: violetDark },
  grass: { light: grass, dark: grassDark },
  tomato: { light: tomato, dark: tomatoDark },
  cyan: { light: cyan, dark: cyanDark },
  pink: { light: pink, dark: pinkDark },
};

// radix objects → [step1..step12]
const arr = (s: Scale, name: string) =>
  Array.from({ length: 12 }, (_, i) => s[`${name}${i + 1}`]);

// Google's new-tab greys (Material), so peek can match default Chrome.
const CHROME_LIGHT = ["#ffffff","#f8f9fa","#f1f3f4","#e8eaed","#e1e3e6","#dadce0","#cdcfd2","#bdc1c6","#9aa0a6","#80868b","#5f6368","#202124"]; // prettier-ignore
const CHROME_DARK = ["#202124","#292a2d","#303134","#35363a","#3c3d41","#3c4043","#494c50","#5f6368","#80868b","#9aa0a6","#bdc1c6","#e8eaed"]; // prettier-ignore

const GRAYS: Record<string, { light: string[]; dark: string[] }> = {
  sand: { light: arr(sand, "sand"), dark: arr(sandDark, "sand") },
  gray: { light: arr(gray, "gray"), dark: arr(grayDark, "gray") },
  chrome: { light: CHROME_LIGHT, dark: CHROME_DARK },
};

export const ACCENT_NAMES = Object.keys(ACCENTS);
export const GRAY_NAMES = Object.keys(GRAYS);

/** Solid accent color for the swatch buttons in the picker. */
export function accentSwatch(name: string): string {
  const key = name in ACCENTS ? name : "bronze";
  return ACCENTS[key].light[`${key}9`];
}

/** Representative grayscale color for the picker swatch (dark surface). */
export function graySwatch(name: string): string {
  return (GRAYS[name] ?? GRAYS.sand).dark[0];
}

/**
 * Chord token system: 12-step grayscale (--gs-N) + accent (--ac-N) as CSS
 * vars, plus a .dark class for Chord's dark: variants.
 */
export function applyTheme(t: ThemeSettings) {
  // old stored value may still say "system" — resolve to the OS once
  const dark =
    t.mode === "dark" ||
    (t.mode !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
  const accent = t.accent in ACCENTS ? t.accent : "bronze";
  const grayName = t.gray && GRAYS[t.gray] ? t.gray : "sand";
  const gs = dark ? GRAYS[grayName].dark : GRAYS[grayName].light;
  const ac: Scale = dark ? ACCENTS[accent].dark : ACCENTS[accent].light;

  const root = document.documentElement;
  root.classList.toggle("dark", dark);
  root.style.colorScheme = dark ? "dark" : "light";
  for (let i = 1; i <= 12; i++) {
    root.style.setProperty(`--gs-${i}`, gs[i - 1]);
    root.style.setProperty(`--ac-${i}`, ac[`${accent}${i}`]);
  }
  // fixed semantic status colors (independent of accent)
  root.style.setProperty("--ok", (dark ? grassDark : grass).grass9);
  root.style.setProperty("--bad", (dark ? tomatoDark : tomato).tomato9);
  root.style.setProperty("--warn", (dark ? amberDark : amber).amber9);
}

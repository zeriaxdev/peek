import {
  sand,
  sandDark,
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
export type ThemeSettings = { mode: Mode; accent: string };

// Chord defaults: bronze accent on a warm sand grayscale
export const DEFAULT_THEME: ThemeSettings = {
  mode: matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
  accent: "bronze",
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

export const ACCENT_NAMES = Object.keys(ACCENTS);

/** Solid accent color for the swatch buttons in the picker. */
export function accentSwatch(name: string): string {
  const key = name in ACCENTS ? name : "bronze";
  return ACCENTS[key].light[`${key}9`];
}

/**
 * Chord token system: full 12-step grayscale (--gs-N) + accent (--ac-N)
 * scales as CSS vars, plus a .dark class for Chord's dark: variants.
 */
export function applyTheme(t: ThemeSettings) {
  // old stored value may still say "system" — resolve to the OS once
  const dark =
    t.mode === "dark" ||
    (t.mode !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
  const name = t.accent in ACCENTS ? t.accent : "bronze";
  const gs: Scale = dark ? sandDark : sand;
  const ac: Scale = dark ? ACCENTS[name].dark : ACCENTS[name].light;

  const root = document.documentElement;
  root.classList.toggle("dark", dark);
  root.style.colorScheme = dark ? "dark" : "light";
  for (let i = 1; i <= 12; i++) {
    root.style.setProperty(`--gs-${i}`, gs[`sand${i}`]);
    root.style.setProperty(`--ac-${i}`, ac[`${name}${i}`]);
  }
  // fixed semantic status colors (independent of accent)
  root.style.setProperty("--ok", (dark ? grassDark : grass).grass9);
  root.style.setProperty("--bad", (dark ? tomatoDark : tomato).tomato9);
  root.style.setProperty("--warn", (dark ? amberDark : amber).amber9);
}

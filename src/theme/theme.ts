import {
  slate,
  slateDark,
  blue,
  blueDark,
  violet,
  violetDark,
  grass,
  grassDark,
  orange,
  orangeDark,
  tomato,
  tomatoDark,
  cyan,
  cyanDark,
  pink,
  pinkDark,
} from "@radix-ui/colors";

export type Mode = "light" | "dark" | "system";
export type ThemeSettings = { mode: Mode; accent: string };

export const DEFAULT_THEME: ThemeSettings = { mode: "system", accent: "blue" };

type Scale = Record<string, string>;
const ACCENTS: Record<string, { light: Scale; dark: Scale }> = {
  blue: { light: blue, dark: blueDark },
  violet: { light: violet, dark: violetDark },
  grass: { light: grass, dark: grassDark },
  orange: { light: orange, dark: orangeDark },
  tomato: { light: tomato, dark: tomatoDark },
  cyan: { light: cyan, dark: cyanDark },
  pink: { light: pink, dark: pinkDark },
};

export const ACCENT_NAMES = Object.keys(ACCENTS);

/** Solid accent color used for the swatch buttons in the picker. */
export function accentSwatch(name: string): string {
  const acc = ACCENTS[name] ?? ACCENTS.blue;
  return acc.light[`${name in ACCENTS ? name : "blue"}9`];
}

export function isDark(mode: Mode): boolean {
  return (
    mode === "dark" ||
    (mode === "system" && matchMedia("(prefers-color-scheme: dark)").matches)
  );
}

/** Writes the theme as CSS variables on <html>. Instant, no reload. */
export function applyTheme(t: ThemeSettings) {
  const dark = isDark(t.mode);
  const base: Scale = dark ? slateDark : slate;
  const name = t.accent in ACCENTS ? t.accent : "blue";
  const acc = dark ? ACCENTS[name].dark : ACCENTS[name].light;
  const a = (n: number) => acc[`${name}${n}`];
  const b = (n: number) => base[`slate${n}`];

  const root = document.documentElement;
  root.style.colorScheme = dark ? "dark" : "light";
  const vars: Record<string, string> = {
    "--bg": b(1),
    "--card": b(2),
    "--card-hover": b(3),
    "--border": b(6),
    "--muted": b(11),
    "--fg": b(12),
    "--accent": a(9),
    "--accent-soft": a(dark ? 5 : 4),
    "--accent-strong": a(11),
  };
  for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v);
}

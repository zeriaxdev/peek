import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useStored } from "../lib/store";
import { applyTheme, DEFAULT_THEME, type ThemeSettings } from "./theme";

type Ctx = {
  theme: ThemeSettings;
  setTheme: (t: ThemeSettings | ((p: ThemeSettings) => ThemeSettings)) => void;
};

const ThemeCtx = createContext<Ctx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useStored<ThemeSettings>("theme", DEFAULT_THEME);

  useEffect(() => {
    applyTheme(theme);
    if (theme.mode !== "system") return;
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme(theme);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  return (
    <ThemeCtx.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme(): Ctx {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme outside ThemeProvider");
  return ctx;
}

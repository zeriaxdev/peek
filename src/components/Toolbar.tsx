import { Check, Moon, PencilSimple, Plus, Sun } from "@phosphor-icons/react";
import type { Layout } from "react-grid-layout";
import { cn } from "../lib/cn";
import { useTheme } from "../theme/ThemeProvider";
import { ACCENT_NAMES, accentSwatch } from "../theme/theme";
import { WIDGETS } from "../widgets/registry";
import Button from "./ui/Button";
import IconButton from "./ui/IconButton";

type Props = {
  edit: boolean;
  setEdit: (v: boolean) => void;
  layout: Layout[];
  setLayout: (l: Layout[] | ((p: Layout[]) => Layout[])) => void;
};

export default function Toolbar({ edit, setEdit, layout, setLayout }: Props) {
  const { theme, setTheme } = useTheme();
  const inactive = Object.values(WIDGETS).filter(
    (w) => !layout.some((l) => l.i === w.id),
  );

  return (
    <header className="flex h-12 items-center justify-end gap-2 overflow-hidden px-3">
      {edit && (
        <>
          <div
            className="flex items-center gap-1.5"
            role="group"
            aria-label="Accent color"
          >
            {ACCENT_NAMES.map((name) => (
              <button
                key={name}
                aria-label={`Accent ${name}`}
                title={name}
                onClick={() => setTheme((t) => ({ ...t, accent: name }))}
                className={cn(
                  "h-4.5 w-4.5 cursor-pointer rounded-full transition-transform hover:scale-110",
                  theme.accent === name &&
                    "ring-2 ring-grayscale-12 ring-offset-2 ring-offset-grayscale-1",
                )}
                style={{ background: accentSwatch(name) }}
              />
            ))}
          </div>
          {inactive.length > 0 && (
            <div className="ml-1 flex min-w-0 items-center gap-1.5 overflow-x-auto">
              {inactive.map((w) => (
                <Button
                  key={w.id}
                  className="shrink-0 px-2 py-0.5 text-xs"
                  onClick={() =>
                    setLayout((prev) => [
                      ...prev,
                      { i: w.id, x: 0, y: 99, w: w.w, h: w.h },
                    ])
                  }
                >
                  <Plus size={10} /> {w.title}
                </Button>
              ))}
            </div>
          )}
        </>
      )}
      <IconButton
        aria-label={theme.mode === "dark" ? "Switch to light" : "Switch to dark"}
        title={theme.mode === "dark" ? "Light mode" : "Dark mode"}
        onClick={() =>
          setTheme((t) => ({
            ...t,
            mode: t.mode === "dark" ? "light" : "dark",
          }))
        }
      >
        {theme.mode === "dark" ? <Sun size={15} /> : <Moon size={15} />}
      </IconButton>
      {edit ? (
        <Button variant="primary" className="px-2.5 py-0.5 text-xs" onClick={() => setEdit(false)}>
          <Check size={12} /> Done
        </Button>
      ) : (
        <IconButton aria-label="Edit layout" title="Edit layout" onClick={() => setEdit(true)}>
          <PencilSimple size={15} />
        </IconButton>
      )}
    </header>
  );
}

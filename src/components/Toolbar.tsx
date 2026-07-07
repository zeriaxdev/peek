import type { Layout } from "react-grid-layout";
import { useTheme } from "../theme/ThemeProvider";
import { ACCENT_NAMES, accentSwatch } from "../theme/theme";
import { WIDGETS } from "../widgets/registry";

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
    <header className="flex h-12 items-center justify-end gap-2 px-3">
      {edit && (
        <>
          <div className="flex items-center gap-1.5" role="group" aria-label="Accent color">
            {ACCENT_NAMES.map((name) => (
              <button
                key={name}
                aria-label={`Accent ${name}`}
                onClick={() => setTheme((t) => ({ ...t, accent: name }))}
                className={`h-5 w-5 rounded-full transition-transform hover:scale-110 ${
                  theme.accent === name ? "ring-2 ring-fg ring-offset-2 ring-offset-bg" : ""
                }`}
                style={{ background: accentSwatch(name) }}
              />
            ))}
          </div>
          {inactive.length > 0 && (
            <div className="ml-2 flex items-center gap-1.5">
              {inactive.map((w) => (
                <button
                  key={w.id}
                  onClick={() =>
                    setLayout((prev) => [
                      ...prev,
                      { i: w.id, x: 0, y: 99, w: w.w, h: w.h },
                    ])
                  }
                  className="rounded-full border border-border bg-card px-2.5 py-0.5 text-xs text-muted hover:bg-card-hover hover:text-fg"
                >
                  + {w.title}
                </button>
              ))}
            </div>
          )}
        </>
      )}
      <button
        aria-label={theme.mode === "dark" ? "Switch to light" : "Switch to dark"}
        title={theme.mode === "dark" ? "Light mode" : "Dark mode"}
        onClick={() =>
          setTheme((t) => ({
            ...t,
            mode: t.mode === "dark" ? "light" : "dark",
          }))
        }
        className="rounded-lg px-2 py-1 text-sm text-muted hover:bg-card-hover hover:text-fg"
      >
        {theme.mode === "dark" ? "☀" : "☾"}
      </button>
      <button
        aria-label={edit ? "Done editing" : "Edit layout"}
        onClick={() => setEdit(!edit)}
        className={`rounded-lg px-2.5 py-1 text-sm ${
          edit
            ? "bg-accent text-white"
            : "text-muted hover:bg-card-hover hover:text-fg"
        }`}
      >
        {edit ? "Done" : "✎"}
      </button>
    </header>
  );
}

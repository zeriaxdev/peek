import { useEffect, useState } from "react";
import type { Layout } from "react-grid-layout";
import BentoGrid from "./components/BentoGrid";
import Toolbar from "./components/Toolbar";
import { useStored } from "./lib/store";
import { ThemeProvider } from "./theme/ThemeProvider";
import { DEFAULT_LAYOUT, LAYOUT_VERSION, WIDGETS } from "./widgets/registry";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "Late night";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 22) return "Good evening";
  return "Good night";
}

export default function App() {
  const [layout, setLayout, layoutReady] = useStored<Layout[]>(
    "layout",
    DEFAULT_LAYOUT,
  );
  const [seen, setSeen, seenReady] = useStored<string[]>("seenWidgets", []);
  const [ver, setVer, verReady] = useStored<number>("layoutVersion", 0);
  const [name] = useStored<string>("name", "");
  const [edit, setEdit] = useState(false);

  // One-time reset when the shipped default changes shape (redesigns).
  useEffect(() => {
    if (!verReady || ver >= LAYOUT_VERSION) return;
    setLayout(DEFAULT_LAYOUT);
    setSeen(Object.keys(WIDGETS)); // mark all seen so nothing auto-adds on top
    setVer(LAYOUT_VERSION);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verReady]);

  // Widgets shipped later get added once, at their default spot — without
  // disturbing anything the user arranged.
  useEffect(() => {
    if (!layoutReady || !seenReady || !verReady || ver < LAYOUT_VERSION) return;
    const unseen = Object.keys(WIDGETS).filter((id) => !seen.includes(id));
    if (unseen.length === 0) return;
    setLayout((prev) => [
      ...prev,
      ...unseen
        .filter((id) => !prev.some((l) => l.i === id))
        .map(
          (id) =>
            DEFAULT_LAYOUT.find((d) => d.i === id) ?? {
              i: id,
              x: 0,
              y: Infinity,
              w: WIDGETS[id].w,
              h: WIDGETS[id].h,
            },
        ),
    ]);
    setSeen((prev) => [...prev, ...unseen]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutReady, seenReady, verReady, ver]);

  return (
    <ThemeProvider>
      <div className="mx-auto flex h-full w-full max-w-[1480px] flex-col px-6 pb-6">
        <header className="flex h-14 shrink-0 items-center gap-4">
          {!edit && (
            <h1 className="truncate text-sm font-medium text-grayscale-11">
              {greeting()}
              {name && <span className="text-grayscale-12">, {name}</span>}
            </h1>
          )}
          <Toolbar
            edit={edit}
            setEdit={setEdit}
            layout={layout}
            setLayout={setLayout}
          />
        </header>
        {/* render only after storage read → no default→saved layout jump */}
        {layoutReady && verReady && (
          <BentoGrid layout={layout} setLayout={setLayout} edit={edit} />
        )}
      </div>
    </ThemeProvider>
  );
}

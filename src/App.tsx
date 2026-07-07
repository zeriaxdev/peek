import { useEffect, useState } from "react";
import type { Layout } from "react-grid-layout";
import BentoGrid from "./components/BentoGrid";
import Toolbar from "./components/Toolbar";
import { useStored } from "./lib/store";
import { ThemeProvider } from "./theme/ThemeProvider";
import { DEFAULT_LAYOUT, LAYOUT_VERSION, WIDGETS } from "./widgets/registry";

export default function App() {
  const [layout, setLayout, layoutReady] = useStored<Layout[]>(
    "layout",
    DEFAULT_LAYOUT,
  );
  const [seen, setSeen, seenReady] = useStored<string[]>("seenWidgets", []);
  const [ver, setVer, verReady] = useStored<number>("layoutVersion", 0);
  const [edit, setEdit] = useState(false);

  // One-time reset when the shipped default changes shape (redesigns).
  useEffect(() => {
    if (!verReady || ver >= LAYOUT_VERSION) return;
    setLayout(DEFAULT_LAYOUT);
    setSeen(Object.keys(WIDGETS));
    setVer(LAYOUT_VERSION);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verReady]);

  // Widgets shipped after the user's layout was saved get added once,
  // at their default spot — without resetting anything the user arranged.
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
              y: 99,
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
      <div className="flex h-full flex-col overflow-hidden">
        <Toolbar
          edit={edit}
          setEdit={setEdit}
          layout={layout}
          setLayout={setLayout}
        />
        {/* render only after storage read → no default→saved layout jump */}
        {layoutReady && verReady && (
          <BentoGrid layout={layout} setLayout={setLayout} edit={edit} />
        )}
      </div>
    </ThemeProvider>
  );
}

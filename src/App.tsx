import { useState } from "react";
import type { Layout } from "react-grid-layout";
import BentoGrid from "./components/BentoGrid";
import Toolbar from "./components/Toolbar";
import { useStored } from "./lib/store";
import { ThemeProvider } from "./theme/ThemeProvider";
import { DEFAULT_LAYOUT } from "./widgets/registry";

export default function App() {
  const [layout, setLayout] = useStored<Layout[]>("layout", DEFAULT_LAYOUT);
  const [edit, setEdit] = useState(false);

  return (
    <ThemeProvider>
      <div className="flex h-full flex-col overflow-hidden">
        <Toolbar
          edit={edit}
          setEdit={setEdit}
          layout={layout}
          setLayout={setLayout}
        />
        <BentoGrid layout={layout} setLayout={setLayout} edit={edit} />
      </div>
    </ThemeProvider>
  );
}

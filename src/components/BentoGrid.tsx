import { useEffect, useState } from "react";
import RGL, { WidthProvider, type Layout } from "react-grid-layout";
import { WIDGETS } from "../widgets/registry";
import WidgetShell from "./WidgetShell";

const Grid = WidthProvider(RGL);

const ROWS = 12;
const MARGIN = 8;
const TOOLBAR_H = 48;

// Row height sized so ROWS rows exactly fill the viewport → no scroll.
function calcRowHeight(): number {
  const avail =
    window.innerHeight - TOOLBAR_H - MARGIN * 2 - MARGIN * (ROWS - 1);
  return Math.max(24, Math.floor(avail / ROWS));
}

type Props = {
  layout: Layout[];
  setLayout: (l: Layout[] | ((p: Layout[]) => Layout[])) => void;
  edit: boolean;
};

export default function BentoGrid({ layout, setLayout, edit }: Props) {
  const [rowHeight, setRowHeight] = useState(calcRowHeight);

  useEffect(() => {
    const onResize = () => setRowHeight(calcRowHeight());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // drop stored items whose widget no longer exists; enforce per-widget minimums
  const items = layout
    .filter((li) => WIDGETS[li.i])
    .map((li) => ({
      ...li,
      minW: WIDGETS[li.i].minW,
      minH: WIDGETS[li.i].minH,
    }));

  return (
    <div className="flex-1">
      <Grid
        layout={items}
        cols={12}
        maxRows={ROWS}
        rowHeight={rowHeight}
        margin={[MARGIN, MARGIN]}
        containerPadding={[MARGIN, MARGIN]}
        compactType="vertical"
        isDraggable={edit}
        isResizable={edit}
        draggableCancel=".no-drag"
        onLayoutChange={(l) => setLayout(l)}
      >
        {items.map((li) => (
          <div key={li.i}>
            <WidgetShell
              id={li.i}
              edit={edit}
              onRemove={() =>
                setLayout((prev) => prev.filter((x) => x.i !== li.i))
              }
            />
          </div>
        ))}
      </Grid>
    </div>
  );
}

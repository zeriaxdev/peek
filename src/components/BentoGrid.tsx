import { useEffect, useRef, useState } from "react";
import RGL, { WidthProvider, type Layout } from "react-grid-layout";
import { GRID_ROWS, WIDGETS } from "../widgets/registry";
import WidgetShell from "./WidgetShell";

const Grid = WidthProvider(RGL);
const MARGIN = 10;

type Props = {
  layout: Layout[];
  setLayout: (l: Layout[] | ((p: Layout[]) => Layout[])) => void;
  edit: boolean;
};

export default function BentoGrid({ layout, setLayout, edit }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [rowHeight, setRowHeight] = useState(60);
  // no CSS transforms on first paint → cards don't fly in from the corner
  const [mounted, setMounted] = useState(false);

  // Measure the actual grid box (not the window) so GRID_ROWS rows fill it
  // exactly — the board never overflows and never clips the toolbar.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const avail = el.clientHeight - MARGIN * (GRID_ROWS + 1);
      setRowHeight(Math.max(28, Math.floor(avail / GRID_ROWS)));
    });
    ro.observe(el);
    setMounted(true);
    return () => ro.disconnect();
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
    <div ref={ref} className="min-h-0 flex-1">
      <Grid
        layout={items}
        cols={12}
        rowHeight={rowHeight}
        margin={[MARGIN, MARGIN]}
        containerPadding={[0, 0]}
        compactType="vertical"
        useCSSTransforms={mounted}
        isDraggable={edit}
        isResizable={edit}
        draggableHandle=".drag-handle"
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

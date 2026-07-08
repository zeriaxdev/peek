import { useLayoutEffect, useRef, useState } from "react";
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
  // 0 = not yet measured → don't render the grid, so cards never appear at a
  // guessed height and then jump/twitch when the real height comes in.
  // Seed from the window so the first render is already close; useLayoutEffect
  // corrects to the exact box height before the browser paints.
  const [rowHeight, setRowHeight] = useState(() =>
    Math.max(28, Math.floor((window.innerHeight - 64) / GRID_ROWS - MARGIN)),
  );

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const avail = el.clientHeight - MARGIN * (GRID_ROWS + 1);
      if (avail > 0) setRowHeight(Math.max(28, Math.floor(avail / GRID_ROWS)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
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
        useCSSTransforms
        isDraggable={edit}
        isResizable={edit}
        draggableHandle=".drag-handle"
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

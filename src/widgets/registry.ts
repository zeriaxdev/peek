import type { ComponentType } from "react";
import type { Layout } from "react-grid-layout";
import Clock from "./Clock";

export type WidgetDef = {
  id: string;
  title: string;
  Component: ComponentType;
  /** default + minimum size in grid cells (12-col × 12-row grid) */
  w: number;
  h: number;
  minW?: number;
  minH?: number;
};

// Adding a widget = one entry here + one component file.
export const WIDGETS: Record<string, WidgetDef> = {
  clock: { id: "clock", title: "Clock", Component: Clock, w: 4, h: 3, minW: 2, minH: 2 },
};

export const DEFAULT_LAYOUT: Layout[] = [{ i: "clock", x: 4, y: 0, w: 4, h: 3 }];

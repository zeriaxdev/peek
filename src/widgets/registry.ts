import type { ComponentType } from "react";
import type { Layout } from "react-grid-layout";
import Calendar from "./Calendar";
import Clock from "./Clock";
import Folders from "./Folders";
import Links from "./Links";
import Weather from "./Weather";

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
  weather: { id: "weather", title: "Weather", Component: Weather, w: 4, h: 3, minW: 3, minH: 2 },
  calendar: { id: "calendar", title: "Calendar", Component: Calendar, w: 4, h: 6, minW: 3, minH: 4 },
  links: { id: "links", title: "Links", Component: Links, w: 8, h: 6, minW: 3, minH: 2 },
  folders: { id: "folders", title: "Folders", Component: Folders, w: 4, h: 6, minW: 3, minH: 2 },
};

export const DEFAULT_LAYOUT: Layout[] = [
  { i: "clock", x: 0, y: 0, w: 4, h: 3 },
  { i: "weather", x: 4, y: 0, w: 4, h: 3 },
  { i: "calendar", x: 8, y: 0, w: 4, h: 6 },
  { i: "links", x: 0, y: 3, w: 8, h: 6 },
  { i: "folders", x: 8, y: 6, w: 4, h: 6 },
];

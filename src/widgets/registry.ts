import type { ComponentType } from "react";
import type { Layout } from "react-grid-layout";
import Calendar from "./Calendar";
import Clock from "./Clock";
import Deadlines from "./Deadlines";
import Folders from "./Folders";
import GitHub from "./GitHub";
import Links from "./Links";
import Notes from "./Notes";
import Pomodoro from "./Pomodoro";
import Search from "./Search";
import Todo from "./Todo";
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
  clock: { id: "clock", title: "Clock", Component: Clock, w: 3, h: 3, minW: 2, minH: 2 },
  weather: { id: "weather", title: "Weather", Component: Weather, w: 3, h: 3, minW: 3, minH: 2 },
  search: { id: "search", title: "Search", Component: Search, w: 6, h: 1, minW: 3, minH: 1 },
  github: { id: "github", title: "Pull Requests", Component: GitHub, w: 6, h: 5, minW: 4, minH: 2 },
  links: { id: "links", title: "Links", Component: Links, w: 6, h: 4, minW: 3, minH: 2 },
  calendar: { id: "calendar", title: "Calendar", Component: Calendar, w: 3, h: 5, minW: 3, minH: 4 },
  todo: { id: "todo", title: "Todo", Component: Todo, w: 3, h: 5, minW: 3, minH: 2 },
  notes: { id: "notes", title: "Notes", Component: Notes, w: 3, h: 3, minW: 2, minH: 2 },
  pomodoro: { id: "pomodoro", title: "Pomodoro", Component: Pomodoro, w: 3, h: 3, minW: 2, minH: 2 },
  folders: { id: "folders", title: "Folders", Component: Folders, w: 3, h: 3, minW: 3, minH: 2 },
  deadlines: { id: "deadlines", title: "Deadlines", Component: Deadlines, w: 3, h: 3, minW: 3, minH: 2 },
};

// Composed 12×12 default — every cell filled, nothing hollow.
export const DEFAULT_LAYOUT: Layout[] = [
  { i: "clock", x: 0, y: 0, w: 3, h: 3 },
  { i: "weather", x: 3, y: 0, w: 3, h: 3 },
  { i: "search", x: 6, y: 0, w: 6, h: 1 },
  { i: "github", x: 6, y: 1, w: 6, h: 5 },
  { i: "links", x: 0, y: 3, w: 6, h: 4 },
  { i: "calendar", x: 0, y: 7, w: 3, h: 5 },
  { i: "todo", x: 3, y: 7, w: 3, h: 5 },
  { i: "notes", x: 6, y: 6, w: 3, h: 3 },
  { i: "pomodoro", x: 9, y: 6, w: 3, h: 3 },
  { i: "folders", x: 6, y: 9, w: 3, h: 3 },
  { i: "deadlines", x: 9, y: 9, w: 3, h: 3 },
];

/** Bump when the shipped default layout changes shape — triggers a one-time reset. */
export const LAYOUT_VERSION = 2;

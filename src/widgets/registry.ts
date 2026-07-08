import {
  CalendarBlank,
  Clock as ClockIcon,
  CloudSun,
  FolderSimple,
  GitPullRequest,
  HourglassMedium,
  type Icon,
  LinkSimple,
  ListChecks,
  MagnifyingGlass,
  NotePencil,
  Timer,
} from "@phosphor-icons/react";
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
  icon: Icon;
  Component: ComponentType;
  /** default + minimum size in grid cells (12-col × 12-row grid) */
  w: number;
  h: number;
  minW?: number;
  minH?: number;
};

// Adding a widget = one entry here + one component file.
export const WIDGETS: Record<string, WidgetDef> = {
  clock: { id: "clock", title: "Clock", icon: ClockIcon, Component: Clock, w: 3, h: 3, minW: 2, minH: 2 },
  weather: { id: "weather", title: "Weather", icon: CloudSun, Component: Weather, w: 3, h: 3, minW: 3, minH: 2 },
  search: { id: "search", title: "Search", icon: MagnifyingGlass, Component: Search, w: 6, h: 1, minW: 3, minH: 1 },
  github: { id: "github", title: "Pull Requests", icon: GitPullRequest, Component: GitHub, w: 6, h: 5, minW: 4, minH: 3 },
  links: { id: "links", title: "Links", icon: LinkSimple, Component: Links, w: 6, h: 4, minW: 3, minH: 2 },
  calendar: { id: "calendar", title: "Calendar", icon: CalendarBlank, Component: Calendar, w: 3, h: 5, minW: 3, minH: 4 },
  todo: { id: "todo", title: "Todo", icon: ListChecks, Component: Todo, w: 3, h: 5, minW: 3, minH: 2 },
  notes: { id: "notes", title: "Notes", icon: NotePencil, Component: Notes, w: 3, h: 3, minW: 2, minH: 2 },
  pomodoro: { id: "pomodoro", title: "Pomodoro", icon: Timer, Component: Pomodoro, w: 3, h: 3, minW: 2, minH: 2 },
  folders: { id: "folders", title: "Folders", icon: FolderSimple, Component: Folders, w: 3, h: 3, minW: 3, minH: 2 },
  deadlines: { id: "deadlines", title: "Deadlines", icon: HourglassMedium, Component: Deadlines, w: 3, h: 3, minW: 3, minH: 2 },
};

// Composed default, tiled with no gaps: 12 cols × 11 rows.
// folders is available via edit-mode "add" rather than placed by default.
export const DEFAULT_LAYOUT: Layout[] = [
  { i: "clock", x: 0, y: 0, w: 3, h: 3 },
  { i: "weather", x: 3, y: 0, w: 3, h: 3 },
  { i: "search", x: 6, y: 0, w: 6, h: 1 },
  { i: "github", x: 6, y: 1, w: 6, h: 6 },
  { i: "links", x: 0, y: 3, w: 6, h: 4 },
  { i: "calendar", x: 0, y: 7, w: 3, h: 4 },
  { i: "todo", x: 3, y: 7, w: 3, h: 4 },
  { i: "notes", x: 6, y: 7, w: 3, h: 4 },
  { i: "pomodoro", x: 9, y: 7, w: 3, h: 2 },
  { i: "deadlines", x: 9, y: 9, w: 3, h: 2 },
];

/** Rows the default layout occupies — the grid is sized so exactly this many fit. */
export const GRID_ROWS = 11;

/** Bump when the shipped default layout changes shape — triggers a one-time reset. */
export const LAYOUT_VERSION = 3;

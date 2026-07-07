import { useState } from "react";

// Monday-first month grid, native Date/Intl only.
const WEEKDAYS = Array.from({ length: 7 }, (_, i) =>
  // 2024-01-01 was a Monday
  new Date(2024, 0, 1 + i).toLocaleDateString([], { weekday: "narrow" }),
);

function cells(y: number, m: number): Date[] {
  const first = new Date(y, m, 1);
  const lead = (first.getDay() + 6) % 7; // days shown from previous month
  const start = new Date(y, m, 1 - lead);
  return Array.from(
    { length: 42 },
    (_, i) =>
      new Date(start.getFullYear(), start.getMonth(), start.getDate() + i),
  );
}

export default function Calendar() {
  const today = new Date();
  const [view, setView] = useState({
    y: today.getFullYear(),
    m: today.getMonth(),
  });

  const shift = (d: number) => {
    const dt = new Date(view.y, view.m + d, 1);
    setView({ y: dt.getFullYear(), m: dt.getMonth() });
  };
  const isToday = (d: Date) => d.toDateString() === today.toDateString();
  const label = new Date(view.y, view.m, 1).toLocaleDateString([], {
    month: "long",
    year: "numeric",
  });

  const btn =
    "no-drag rounded px-1.5 text-xs text-muted hover:bg-card-hover hover:text-fg";

  return (
    <div className="flex h-full flex-col p-2.5 select-none">
      <div className="flex items-center justify-between px-1 pb-1.5">
        <span className="text-sm font-medium">{label}</span>
        <div className="flex items-center gap-0.5">
          <button className={btn} onClick={() => shift(-1)} aria-label="Previous month">‹</button>
          <button
            className={btn}
            onClick={() => setView({ y: today.getFullYear(), m: today.getMonth() })}
          >
            •
          </button>
          <button className={btn} onClick={() => shift(1)} aria-label="Next month">›</button>
        </div>
      </div>
      <div className="grid grid-cols-7 text-center text-[10px] text-muted">
        {WEEKDAYS.map((w, i) => (
          <div key={i} className="py-0.5">
            {w}
          </div>
        ))}
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-6 text-center text-xs">
        {cells(view.y, view.m).map((d, i) => (
          <div key={i} className="flex items-center justify-center">
            <span
              className={
                isToday(d)
                  ? "flex h-6 w-6 items-center justify-center rounded-full bg-accent font-semibold text-white"
                  : d.getMonth() === view.m
                    ? "text-fg"
                    : "text-muted opacity-50"
              }
            >
              {d.getDate()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

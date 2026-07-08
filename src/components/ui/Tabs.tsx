import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

// Light Tabs with Chord's tab classes (components/public/Tabs.tsx) — the
// active pill is the item's own background, so no Base UI indicator needed.
type Item = { value: string; label: ReactNode };

export function TabList({
  items,
  value,
  onChange,
  right,
}: {
  items: Item[];
  value: string;
  onChange: (v: string) => void;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2 px-2 pt-2">
      <div className="flex flex-row gap-0.5">
        {items.map((it) => (
          <button
            key={it.value}
            onClick={() => onChange(it.value)}
            className={cn(
              "no-drag relative z-10 flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors",
              value === it.value
                ? "bg-grayscale-3 text-grayscale-12 dark:bg-grayscale-5"
                : "text-grayscale-10 hover:text-grayscale-12",
            )}
          >
            {it.label}
          </button>
        ))}
      </div>
      {right}
    </div>
  );
}

import { HourglassMedium, Plus, X } from "@phosphor-icons/react";
import { useState } from "react";
import Button from "../components/ui/Button";
import Empty from "../components/ui/Empty";
import Input from "../components/ui/Input";
import { useStored } from "../lib/store";

type DL = { id: string; name: string; date: string };

const DAY = 86_400_000;

function daysLeft(date: string): number {
  const target = new Date(`${date}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / DAY);
}

function Badge({ days }: { days: number }) {
  const cls =
    days < 0
      ? "bg-grayscale-3 text-grayscale-9 dark:bg-grayscale-5"
      : days <= 3
        ? "bg-accent-9 text-white"
        : days <= 7
          ? "bg-accent-4 text-accent-11"
          : "bg-grayscale-3 text-grayscale-10 dark:bg-grayscale-5";
  const label =
    days < 0 ? "past" : days === 0 ? "today" : days === 1 ? "1 day" : `${days} days`;
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-tiny font-medium tabular-nums ${cls}`}
    >
      {label}
    </span>
  );
}

export default function Deadlines() {
  const [items, setItems] = useStored<DL[]>("deadlines", []);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date));

  const form = (
    <form
      className="no-drag flex items-center gap-1.5 px-1"
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim() || !date) return;
        setItems((prev) => [
          ...prev,
          { id: crypto.randomUUID(), name: name.trim(), date },
        ]);
        setName("");
        setDate("");
        setAdding(false);
      }}
    >
      <Input
        autoFocus
        placeholder="exam, due date…"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1"
      />
      {/* ponytail: native date input over a picker lib */}
      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-32"
      />
      <Button variant="primary" type="submit" className="px-2 py-0.5 text-xs">
        Add
      </Button>
    </form>
  );

  if (items.length === 0) {
    return (
      <Empty icon={HourglassMedium} text="Count down to what matters">
        {adding ? (
          form
        ) : (
          <Button className="px-2 py-0.5 text-xs" onClick={() => setAdding(true)}>
            <Plus size={11} /> Deadline
          </Button>
        )}
      </Empty>
    );
  }

  return (
    <div className="flex h-full flex-col p-2">
      <ul className="min-h-0 flex-1 overflow-y-auto">
        {sorted.map((d) => (
          <li
            key={d.id}
            className="group flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-grayscale-2 dark:hover:bg-grayscale-4"
          >
            <span className="min-w-0 flex-1 truncate text-sm">{d.name}</span>
            <Badge days={daysLeft(d.date)} />
            <button
              aria-label={`Remove ${d.name}`}
              onClick={() =>
                setItems((prev) => prev.filter((x) => x.id !== d.id))
              }
              className="no-drag hidden shrink-0 cursor-pointer text-grayscale-8 group-hover:block hover:text-grayscale-12"
            >
              <X size={11} />
            </button>
          </li>
        ))}
      </ul>
      {adding ? (
        form
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="no-drag flex cursor-pointer items-center gap-1 self-start rounded-lg px-2 py-1 text-xs text-grayscale-9 transition-colors hover:bg-grayscale-2 hover:text-grayscale-12 dark:hover:bg-grayscale-4"
        >
          <Plus size={11} /> deadline
        </button>
      )}
    </div>
  );
}

import { CheckCircle, Circle, ListChecks, X } from "@phosphor-icons/react";
import { useState } from "react";
import Empty from "../components/ui/Empty";
import { useStored } from "../lib/store";

type Item = { id: string; text: string; done: boolean };

export default function Todo() {
  const [items, setItems] = useStored<Item[]>("todos", []);
  const [draft, setDraft] = useState("");

  const add = () => {
    const t = draft.trim();
    if (!t) return;
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: t, done: false },
    ]);
    setDraft("");
  };

  return (
    <div className="flex h-full flex-col p-2">
      {items.length === 0 ? (
        <div className="min-h-0 flex-1">
          <Empty icon={ListChecks} text="Nothing to do" />
        </div>
      ) : (
        <ul className="min-h-0 flex-1 overflow-y-auto">
          {items.map((it) => (
            <li
              key={it.id}
              className="group flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-grayscale-2 dark:hover:bg-grayscale-4"
            >
              <button
                aria-label={it.done ? "Mark not done" : "Mark done"}
                onClick={() =>
                  setItems((prev) =>
                    prev.map((x) =>
                      x.id === it.id ? { ...x, done: !x.done } : x,
                    ),
                  )
                }
                className="no-drag shrink-0 cursor-pointer"
              >
                {it.done ? (
                  <CheckCircle size={15} weight="fill" className="text-accent-9" />
                ) : (
                  <Circle size={15} className="text-grayscale-8" />
                )}
              </button>
              <span
                className={`min-w-0 flex-1 truncate text-sm ${it.done ? "text-grayscale-9 line-through" : ""}`}
              >
                {it.text}
              </span>
              <button
                aria-label={`Remove ${it.text}`}
                onClick={() =>
                  setItems((prev) => prev.filter((x) => x.id !== it.id))
                }
                className="no-drag hidden shrink-0 cursor-pointer text-grayscale-8 group-hover:block hover:text-grayscale-12"
              >
                <X size={11} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
      >
        <input
          placeholder="Add task…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="no-drag w-full rounded-lg px-2 py-1 text-sm outline-none placeholder:text-grayscale-8 focus:bg-grayscale-2 dark:focus:bg-grayscale-4"
        />
      </form>
    </div>
  );
}

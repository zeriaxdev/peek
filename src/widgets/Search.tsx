import { MagnifyingGlass } from "@phosphor-icons/react";
import { useState } from "react";
import { useStored } from "../lib/store";

const ENGINES: Record<string, { name: string; url: string }> = {
  ddg: { name: "DuckDuckGo", url: "https://duckduckgo.com/?q=" },
  google: { name: "Google", url: "https://www.google.com/search?q=" },
  brave: { name: "Brave", url: "https://search.brave.com/search?q=" },
  startpage: { name: "Startpage", url: "https://www.startpage.com/sp/search?query=" },
};

export default function Search() {
  const [engine, setEngine] = useStored<string>("searchEngine", "ddg");
  const [q, setQ] = useState("");
  const e = ENGINES[engine] ?? ENGINES.ddg;

  return (
    <form
      className="flex h-full items-center gap-2 px-3"
      onSubmit={(ev) => {
        ev.preventDefault();
        if (q.trim()) location.href = e.url + encodeURIComponent(q.trim());
      }}
    >
      <MagnifyingGlass size={14} className="shrink-0 text-grayscale-9" />
      <input
        autoFocus
        placeholder={`Search ${e.name}…`}
        value={q}
        onChange={(ev) => setQ(ev.target.value)}
        className="no-drag h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-grayscale-8"
      />
      <select
        aria-label="Search engine"
        value={engine}
        onChange={(ev) => setEngine(ev.target.value)}
        className="no-drag cursor-pointer bg-transparent text-tiny text-grayscale-9 outline-none"
      >
        {Object.entries(ENGINES).map(([id, en]) => (
          <option key={id} value={id}>
            {en.name}
          </option>
        ))}
      </select>
    </form>
  );
}

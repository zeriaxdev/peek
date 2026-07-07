import { useState, type FormEvent } from "react";
import { fileToDataUrl } from "../lib/favicon";
import type { LinkItem } from "./LinkTile";

function normalizeUrl(raw: string): string {
  const s = raw.trim();
  return /^[a-z]+:\/\//i.test(s) ? s : `https://${s}`;
}

type Props = { onAdd: (link: LinkItem) => void; onClose: () => void };

export default function AddLink({ onAdd, onClose }: Props) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState<string>();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    const full = normalizeUrl(url);
    let auto = full;
    try {
      auto = new URL(full).hostname.replace(/^www\./, "");
    } catch {
      /* keep raw */
    }
    onAdd({
      id: crypto.randomUUID(),
      url: full,
      title: title.trim() || auto,
      icon,
    });
    onClose();
  };

  const input =
    "min-w-0 rounded-md border border-border bg-bg px-2 py-1 text-xs text-fg placeholder:text-muted focus:border-accent focus:outline-none";

  return (
    <form
      onSubmit={submit}
      className="no-drag absolute inset-x-0 bottom-0 z-10 flex items-center gap-1.5 border-t border-border bg-card p-2"
    >
      <input
        autoFocus
        placeholder="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className={`${input} flex-[2]`}
      />
      <input
        placeholder="name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={`${input} flex-1`}
      />
      <label
        className={`cursor-pointer rounded-md border border-border px-2 py-1 text-xs ${icon ? "text-accent-strong" : "text-muted"} hover:text-fg`}
        title="Custom icon"
      >
        {icon ? "icon ✓" : "icon"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (f) setIcon(await fileToDataUrl(f));
          }}
        />
      </label>
      <button
        type="submit"
        className="rounded-md bg-accent px-2.5 py-1 text-xs font-medium text-white"
      >
        Add
      </button>
      <button
        type="button"
        aria-label="Cancel"
        onClick={onClose}
        className="rounded-md px-1.5 py-1 text-xs text-muted hover:text-fg"
      >
        ✕
      </button>
    </form>
  );
}

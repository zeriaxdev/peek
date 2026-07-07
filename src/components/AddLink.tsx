import { X } from "@phosphor-icons/react";
import { useState, type FormEvent } from "react";
import { fileToDataUrl } from "../lib/favicon";
import type { LinkItem } from "./LinkTile";
import Button from "./ui/Button";
import IconButton from "./ui/IconButton";
import Input from "./ui/Input";

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

  return (
    <form
      onSubmit={submit}
      className="no-drag absolute inset-x-0 bottom-0 z-10 flex items-center gap-1.5 border-t border-grayscale-3 bg-grayscale-2 p-2 dark:border-grayscale-5 dark:bg-grayscale-4"
    >
      <Input
        autoFocus
        placeholder="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="flex-[2]"
      />
      <Input
        placeholder="name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1"
      />
      <label
        className={`flex h-7 cursor-pointer items-center rounded-lg border border-grayscale-4 px-2 text-xs transition-colors hover:border-grayscale-5 ${icon ? "text-accent-11" : "text-grayscale-9"}`}
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
      <Button variant="primary" type="submit" className="px-2.5 py-0.5 text-xs">
        Add
      </Button>
      <IconButton type="button" aria-label="Cancel" onClick={onClose}>
        <X size={12} />
      </IconButton>
    </form>
  );
}

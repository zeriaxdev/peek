import { useState } from "react";
import AddLink from "../components/AddLink";
import LinkTile, { type LinkItem } from "../components/LinkTile";
import { useStored } from "../lib/store";

type Folder = { id: string; name: string; links: LinkItem[] };

export default function Folders() {
  const [folders, setFolders] = useStored<Folder[]>("folders", []);
  const [open, setOpen] = useState<string | null>(null);
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [naming, setNaming] = useState(false);
  const [name, setName] = useState("");

  const patch = (id: string, fn: (f: Folder) => Folder) =>
    setFolders((prev) => prev.map((f) => (f.id === id ? fn(f) : f)));

  return (
    <div className="relative flex h-full flex-col overflow-hidden p-2.5">
      <div className="min-h-0 flex-1 overflow-y-auto">
        {folders.map((f) => (
          <div key={f.id}>
            <div className="group flex items-center gap-1.5 rounded-lg px-2 py-1.5 hover:bg-card-hover">
              <button
                onClick={() => setOpen(open === f.id ? null : f.id)}
                className="flex flex-1 items-center gap-1.5 text-left text-sm"
                aria-expanded={open === f.id}
              >
                <span className="text-xs text-muted">
                  {open === f.id ? "▾" : "▸"}
                </span>
                <span className="font-medium">{f.name}</span>
                <span className="text-xs text-muted">{f.links.length}</span>
              </button>
              <button
                aria-label={`Add link to ${f.name}`}
                onClick={() => {
                  setOpen(f.id);
                  setAddingTo(f.id);
                }}
                className="hidden rounded px-1.5 text-xs text-muted group-hover:block hover:text-fg"
              >
                +
              </button>
              <button
                aria-label={`Delete folder ${f.name}`}
                onClick={() =>
                  setFolders((prev) => prev.filter((x) => x.id !== f.id))
                }
                className="hidden rounded px-1.5 text-xs text-muted group-hover:block hover:text-fg"
              >
                ✕
              </button>
            </div>
            {open === f.id && (
              <div className="flex flex-wrap content-start pb-1 pl-4">
                {f.links.map((l) => (
                  <LinkTile
                    key={l.id}
                    link={l}
                    onRemove={() =>
                      patch(f.id, (x) => ({
                        ...x,
                        links: x.links.filter((y) => y.id !== l.id),
                      }))
                    }
                    onIcon={(icon) =>
                      patch(f.id, (x) => ({
                        ...x,
                        links: x.links.map((y) =>
                          y.id === l.id ? { ...y, icon } : y,
                        ),
                      }))
                    }
                  />
                ))}
                {f.links.length === 0 && (
                  <span className="px-2 py-1 text-xs text-muted">empty</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {naming ? (
        <form
          className="no-drag flex items-center gap-1.5 px-1 pt-1"
          onSubmit={(e) => {
            e.preventDefault();
            const n = name.trim();
            if (n) {
              setFolders((prev) => [
                ...prev,
                { id: crypto.randomUUID(), name: n, links: [] },
              ]);
            }
            setName("");
            setNaming(false);
          }}
        >
          <input
            autoFocus
            placeholder="folder name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setNaming(false)}
            className="min-w-0 flex-1 rounded-md border border-border bg-bg px-2 py-1 text-xs focus:border-accent focus:outline-none"
          />
        </form>
      ) : (
        <button
          onClick={() => setNaming(true)}
          className="no-drag self-start rounded-lg px-2 py-1 text-xs text-muted hover:bg-card-hover hover:text-fg"
        >
          + folder
        </button>
      )}

      {addingTo && (
        <AddLink
          onAdd={(l) =>
            patch(addingTo, (f) => ({ ...f, links: [...f.links, l] }))
          }
          onClose={() => setAddingTo(null)}
        />
      )}
    </div>
  );
}

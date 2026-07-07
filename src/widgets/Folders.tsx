import {
  CaretDown,
  CaretRight,
  FolderSimple,
  Plus,
  X,
} from "@phosphor-icons/react";
import { useState } from "react";
import AddLink from "../components/AddLink";
import LinkTile, { type LinkItem } from "../components/LinkTile";
import Button from "../components/ui/Button";
import Empty from "../components/ui/Empty";
import Input from "../components/ui/Input";
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

  const nameForm = (
    <form
      className="no-drag flex items-center gap-1.5 px-1"
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
      <Input
        autoFocus
        placeholder="folder name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={() => setNaming(false)}
      />
    </form>
  );

  if (folders.length === 0) {
    return (
      <Empty icon={FolderSimple} text="Group links by project">
        {naming ? (
          nameForm
        ) : (
          <Button className="px-2 py-0.5 text-xs" onClick={() => setNaming(true)}>
            <Plus size={11} /> New folder
          </Button>
        )}
      </Empty>
    );
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden p-2">
      <div className="min-h-0 flex-1 overflow-y-auto">
        {folders.map((f) => (
          <div key={f.id}>
            <div className="group flex items-center gap-1 rounded-lg px-2 py-1.5 transition-colors hover:bg-grayscale-2 dark:hover:bg-grayscale-4">
              <button
                onClick={() => setOpen(open === f.id ? null : f.id)}
                className="flex min-w-0 flex-1 cursor-pointer items-center gap-1.5 text-left text-sm"
                aria-expanded={open === f.id}
              >
                {open === f.id ? (
                  <CaretDown size={11} className="shrink-0 text-grayscale-9" />
                ) : (
                  <CaretRight size={11} className="shrink-0 text-grayscale-9" />
                )}
                <span className="truncate font-medium">{f.name}</span>
                <span className="text-tiny text-grayscale-9">
                  {f.links.length}
                </span>
              </button>
              <button
                aria-label={`Add link to ${f.name}`}
                onClick={() => {
                  setOpen(f.id);
                  setAddingTo(f.id);
                }}
                className="hidden cursor-pointer rounded p-0.5 text-grayscale-9 group-hover:block hover:text-grayscale-12"
              >
                <Plus size={12} />
              </button>
              <button
                aria-label={`Delete folder ${f.name}`}
                onClick={() =>
                  setFolders((prev) => prev.filter((x) => x.id !== f.id))
                }
                className="hidden cursor-pointer rounded p-0.5 text-grayscale-9 group-hover:block hover:text-grayscale-12"
              >
                <X size={12} />
              </button>
            </div>
            {open === f.id && (
              <div className="flex flex-wrap content-start pb-1 pl-3">
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
                  <span className="px-2 py-1 text-tiny text-grayscale-9">
                    empty
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {naming ? (
        nameForm
      ) : (
        <button
          onClick={() => setNaming(true)}
          className="no-drag flex cursor-pointer items-center gap-1 self-start rounded-lg px-2 py-1 text-xs text-grayscale-9 transition-colors hover:bg-grayscale-2 hover:text-grayscale-12 dark:hover:bg-grayscale-4"
        >
          <Plus size={11} /> folder
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

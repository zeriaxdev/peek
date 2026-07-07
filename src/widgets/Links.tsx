import { useState } from "react";
import AddLink from "../components/AddLink";
import LinkTile, { type LinkItem } from "../components/LinkTile";
import { useStored } from "../lib/store";

export default function Links() {
  const [links, setLinks] = useStored<LinkItem[]>("links", []);
  const [adding, setAdding] = useState(false);

  return (
    <div className="relative h-full overflow-hidden p-2.5">
      <div className="flex flex-wrap content-start">
        {links.map((l) => (
          <LinkTile
            key={l.id}
            link={l}
            onRemove={() =>
              setLinks((prev) => prev.filter((x) => x.id !== l.id))
            }
            onIcon={(icon) =>
              setLinks((prev) =>
                prev.map((x) => (x.id === l.id ? { ...x, icon } : x)),
              )
            }
          />
        ))}
        <button
          aria-label="Add link"
          onClick={() => setAdding(true)}
          className="no-drag flex h-[60px] w-16 flex-col items-center justify-center rounded-lg text-lg text-muted hover:bg-card-hover hover:text-fg"
        >
          +
        </button>
      </div>
      {links.length === 0 && !adding && (
        <p className="px-2 text-xs text-muted">
          Add your links — drop an image on a tile for a custom icon.
        </p>
      )}
      {adding && (
        <AddLink
          onAdd={(l) => setLinks((prev) => [...prev, l])}
          onClose={() => setAdding(false)}
        />
      )}
    </div>
  );
}

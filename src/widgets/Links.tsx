import { LinkSimple, Plus } from "@phosphor-icons/react";
import { useState } from "react";
import AddLink from "../components/AddLink";
import LinkTile, { type LinkItem } from "../components/LinkTile";
import Button from "../components/ui/Button";
import Empty from "../components/ui/Empty";
import { useStored } from "../lib/store";

export default function Links() {
  const [links, setLinks] = useStored<LinkItem[]>("links", []);
  const [adding, setAdding] = useState(false);

  if (links.length === 0 && !adding) {
    return (
      <Empty icon={LinkSimple} text="Your links live here">
        <Button className="px-2 py-0.5 text-xs" onClick={() => setAdding(true)}>
          <Plus size={11} /> Add link
        </Button>
      </Empty>
    );
  }

  return (
    <div className="relative h-full overflow-hidden p-2">
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
          className="no-drag flex h-[60px] w-16 cursor-pointer flex-col items-center justify-center rounded-lg text-grayscale-8 transition-colors hover:bg-grayscale-2 hover:text-grayscale-11 dark:hover:bg-grayscale-4"
        >
          <Plus size={16} />
        </button>
      </div>
      {adding && (
        <AddLink
          onAdd={(l) => setLinks((prev) => [...prev, l])}
          onClose={() => setAdding(false)}
        />
      )}
    </div>
  );
}

import { X } from "@phosphor-icons/react";
import { useState, type DragEvent } from "react";
import { faviconUrl, fileToDataUrl } from "../lib/favicon";

export type LinkItem = {
  id: string;
  url: string;
  title: string;
  /** custom icon as a data URL — always wins over the favicon chain */
  icon?: string;
};

function Icon({ link }: { link: LinkItem }) {
  const [failed, setFailed] = useState(false);
  if (link.icon) {
    return <img src={link.icon} alt="" className="h-8 w-8 rounded-md" />;
  }
  if (failed || !link.url) {
    // letter tile fallback
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent-4 text-sm font-semibold text-accent-11">
        {(link.title[0] ?? "?").toUpperCase()}
      </div>
    );
  }
  return (
    <img
      src={faviconUrl(link.url)}
      alt=""
      className="h-8 w-8 rounded-md"
      onError={() => setFailed(true)}
    />
  );
}

type Props = {
  link: LinkItem;
  onRemove: () => void;
  onIcon: (dataUrl: string) => void;
};

export default function LinkTile({ link, onRemove, onIcon }: Props) {
  const onDrop = async (e: DragEvent) => {
    const file = e.dataTransfer.files[0];
    if (!file?.type.startsWith("image/")) return;
    e.preventDefault();
    onIcon(await fileToDataUrl(file));
  };

  return (
    <a
      href={link.url}
      title={link.url}
      className="group relative flex w-16 flex-col items-center gap-1.5 rounded-lg p-2 transition-colors hover:bg-grayscale-2 dark:hover:bg-grayscale-4"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      <Icon link={link} />
      <span className="w-full truncate text-center text-tiny text-grayscale-10 group-hover:text-grayscale-12">
        {link.title}
      </span>
      <button
        aria-label={`Remove ${link.title}`}
        className="absolute -top-1 -right-1 hidden h-4 w-4 cursor-pointer items-center justify-center rounded-full border border-grayscale-4 bg-grayscale-2 text-grayscale-10 group-hover:flex hover:text-grayscale-12 dark:bg-grayscale-5"
        onClick={(e) => {
          e.preventDefault();
          onRemove();
        }}
      >
        <X size={9} />
      </button>
    </a>
  );
}

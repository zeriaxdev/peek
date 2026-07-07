import { X } from "@phosphor-icons/react";
import { WIDGETS } from "../widgets/registry";
import IconButton from "./ui/IconButton";

type Props = { id: string; edit: boolean; onRemove: () => void };

// Chord Card layer-1 (components/public/Card.tsx) as the widget chrome
export default function WidgetShell({ id, edit, onRemove }: Props) {
  const def = WIDGETS[id];
  if (!def) return null;
  return (
    <div className="small-shadow relative flex h-full min-w-0 flex-col overflow-hidden rounded-lg border border-grayscale-3 bg-grayscale-1 transition-colors dark:border-grayscale-5 dark:bg-grayscale-3">
      {edit && (
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b border-grayscale-3 bg-grayscale-2 px-2.5 py-1 dark:border-grayscale-5 dark:bg-grayscale-4">
          <span className="text-tiny font-medium tracking-wide text-grayscale-10 uppercase">
            {def.title}
          </span>
          <IconButton aria-label={`Remove ${def.title}`} onClick={onRemove}>
            <X size={12} />
          </IconButton>
        </div>
      )}
      <div className="h-full min-h-0">
        <def.Component />
      </div>
    </div>
  );
}

import { DotsSixVertical, X } from "@phosphor-icons/react";
import { WIDGETS } from "../widgets/registry";
import IconButton from "./ui/IconButton";

type Props = { id: string; edit: boolean; onRemove: () => void };

// Chord Card layer-1 as the widget chrome. In edit mode a header strip
// appears — it is the ONLY drag handle, so clicks inside widgets never
// misfire as drags.
export default function WidgetShell({ id, edit, onRemove }: Props) {
  const def = WIDGETS[id];
  if (!def) return null;
  const Ico = def.icon;
  return (
    <div className="small-shadow relative flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-grayscale-3 bg-grayscale-1 transition-colors dark:border-grayscale-5 dark:bg-grayscale-3">
      {edit && (
        <div className="drag-handle flex cursor-grab items-center justify-between border-b border-grayscale-3 bg-grayscale-2 px-2.5 py-1 active:cursor-grabbing dark:border-grayscale-5 dark:bg-grayscale-4">
          <span className="flex items-center gap-1.5 text-tiny font-medium tracking-wide text-grayscale-10 uppercase">
            <DotsSixVertical size={12} className="text-grayscale-8" />
            <Ico size={12} />
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

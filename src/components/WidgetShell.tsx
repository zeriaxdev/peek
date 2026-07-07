import { WIDGETS } from "../widgets/registry";

type Props = { id: string; edit: boolean; onRemove: () => void };

export default function WidgetShell({ id, edit, onRemove }: Props) {
  const def = WIDGETS[id];
  if (!def) return null;
  return (
    <div className="relative h-full overflow-hidden rounded-xl border border-border bg-card">
      {edit && (
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-2.5 py-1.5">
          <span className="text-xs font-medium text-muted">{def.title}</span>
          <button
            className="no-drag rounded px-1.5 text-xs text-muted hover:bg-card-hover hover:text-fg"
            onClick={onRemove}
            aria-label={`Remove ${def.title}`}
          >
            ✕
          </button>
        </div>
      )}
      <div className="h-full">
        <def.Component />
      </div>
    </div>
  );
}

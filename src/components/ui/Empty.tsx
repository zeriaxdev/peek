import type { Icon } from "@phosphor-icons/react";
import type { ReactNode } from "react";

/** Centered empty state: quiet glyph + one line + optional action. */
export default function Empty({
  icon: I,
  text,
  children,
}: {
  icon: Icon;
  text: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-3">
      <I size={22} className="text-grayscale-8" />
      <p className="text-xs text-grayscale-9">{text}</p>
      {children}
    </div>
  );
}

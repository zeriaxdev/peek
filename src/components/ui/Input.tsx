import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/cn";

// Chord Input (components/public/Input.tsx), verbatim classes
export default function Input({
  className,
  ...props
}: ComponentPropsWithoutRef<"input">) {
  return (
    <input
      className={cn(
        "no-drag h-7 w-full rounded-lg border border-grayscale-4 bg-grayscale-1 px-2 text-sm text-grayscale-12 transition-colors outline-none",
        "placeholder:text-grayscale-9",
        "hover:border-grayscale-5",
        "focus-visible:border-accent-8 focus-visible:ring-2 focus-visible:ring-accent-4",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "dark:bg-grayscale-2",
        className,
      )}
      {...props}
    />
  );
}

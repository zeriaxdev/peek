import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/cn";

// Chord Button (components/public/Button.tsx), verbatim classes
type Props = {
  variant?: "primary" | "secondary";
} & ComponentPropsWithoutRef<"button">;

export default function Button({
  variant = "secondary",
  className,
  ...props
}: Props) {
  return (
    <button
      className={cn(
        "no-drag flex cursor-pointer items-center gap-1.5 rounded-lg border border-b-2 px-2 py-1 text-sm font-medium transition-colors",
        variant === "primary"
          ? "border-black bg-grayscale-12 text-grayscale-2 dark:border-grayscale-6 dark:bg-grayscale-5 dark:text-grayscale-11 dark:hover:border-grayscale-7 dark:hover:bg-grayscale-6"
          : "border-grayscale-3 bg-white text-grayscale-11 hover:border-grayscale-4 hover:bg-grayscale-2 dark:border-grayscale-4 dark:bg-grayscale-3 dark:hover:border-grayscale-5 dark:hover:bg-grayscale-4",
        className,
      )}
      {...props}
    />
  );
}

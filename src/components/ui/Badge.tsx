import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/cn";

// Chord Badge (components/public/Badge.tsx), verbatim
type Props = {
  variant?: "secondary" | "accent" | "outline" | "solid";
} & ComponentPropsWithoutRef<"span">;

const VARIANTS = {
  secondary: "border-grayscale-4 bg-grayscale-2 text-grayscale-11",
  accent: "border-accent-6 bg-accent-3 text-accent-11",
  outline: "border-grayscale-5 bg-transparent text-grayscale-11",
  solid: "border-accent-9 bg-accent-9 text-white",
};

export default function Badge({
  variant = "secondary",
  className,
  ...props
}: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-tiny leading-none font-medium",
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  );
}

import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/cn";

/** Ghost icon button, Chord hover idiom. */
export default function IconButton({
  className,
  ...props
}: ComponentPropsWithoutRef<"button">) {
  return (
    <button
      className={cn(
        "no-drag flex cursor-pointer items-center justify-center rounded-md p-1 text-grayscale-10 transition-colors hover:bg-grayscale-3 hover:text-grayscale-12 dark:hover:bg-grayscale-4",
        className,
      )}
      {...props}
    />
  );
}

import { useEffect, useRef, useState } from "react";

// ponytail: chrome.storage.local in the extension, localStorage under `bun run dev`
const isExt = typeof chrome !== "undefined" && !!chrome.storage?.local;

async function rawGet(key: string): Promise<unknown> {
  if (isExt) return (await chrome.storage.local.get(key))[key];
  const s = localStorage.getItem(key);
  return s == null ? undefined : JSON.parse(s);
}

const timers = new Map<string, ReturnType<typeof setTimeout>>();
const lastWritten = new Map<string, string>();

// Debounced write: batches rapid updates (drag/resize spam) into one storage hit.
function rawSet(key: string, value: unknown) {
  clearTimeout(timers.get(key));
  timers.set(
    key,
    setTimeout(() => {
      lastWritten.set(key, JSON.stringify(value));
      if (isExt) void chrome.storage.local.set({ [key]: value });
      else localStorage.setItem(key, JSON.stringify(value));
    }, 250),
  );
}

/**
 * Persistent state hook. Reads the stored value on mount, writes debounced,
 * and follows changes made from other open tabs.
 */
export function useStored<T>(
  key: string,
  def: T,
): [T, (v: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(def);
  const defRef = useRef(def);

  useEffect(() => {
    let alive = true;
    void rawGet(key).then((v) => {
      if (alive && v !== undefined) setValue(v as T);
    });
    if (!isExt) {
      return () => {
        alive = false;
      };
    }
    const onChanged = (
      changes: Record<string, chrome.storage.StorageChange>,
      area: string,
    ) => {
      if (area !== "local" || !(key in changes)) return;
      const next = changes[key].newValue;
      // skip the echo of our own debounced write
      if (JSON.stringify(next) === lastWritten.get(key)) return;
      setValue(next === undefined ? defRef.current : (next as T));
    };
    chrome.storage.onChanged.addListener(onChanged);
    return () => {
      alive = false;
      chrome.storage.onChanged.removeListener(onChanged);
    };
  }, [key]);

  const set = (v: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
      rawSet(key, next);
      return next;
    });
  };

  return [value, set];
}

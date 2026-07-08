import { Check, Copy, PencilSimple, Trash } from "@phosphor-icons/react";
import { useState } from "react";
import { removeKeys, useStored } from "../../lib/store";
import Button from "./Button";
import Input from "./Input";

/** Copy / edit / remove a stored secret. Reused by GitHub + HSL. */
export default function TokenSettings({
  title,
  storageKey,
  relatedKeys = [],
}: {
  title: string;
  storageKey: string;
  /** other keys to wipe on remove, e.g. cache/saved items */
  relatedKeys?: string[];
}) {
  const [token, setToken] = useStored<string>(storageKey, "");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);

  const masked = token
    ? `${"•".repeat(Math.max(0, token.length - 4))}${token.slice(-4)}`
    : "not set";

  return (
    <div className="no-drag flex h-full flex-col justify-center gap-2 p-3">
      <span className="text-tiny font-medium tracking-wide text-grayscale-10 uppercase">
        {title}
      </span>
      {editing ? (
        <form
          className="flex gap-1.5"
          onSubmit={(e) => {
            e.preventDefault();
            if (draft.trim()) setToken(draft.trim());
            setDraft("");
            setEditing(false);
          }}
        >
          <Input
            autoFocus
            type="password"
            placeholder="paste new value"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <Button variant="primary" type="submit" className="px-2.5 py-0.5 text-xs">
            Save
          </Button>
        </form>
      ) : (
        <>
          <code className="truncate rounded-md bg-grayscale-2 px-2 py-1 font-mono text-xs text-grayscale-11 dark:bg-grayscale-4">
            {masked}
          </code>
          <div className="flex gap-1.5">
            <Button
              className="px-2 py-0.5 text-xs"
              disabled={!token}
              onClick={async () => {
                await navigator.clipboard.writeText(token);
                setCopied(true);
                setTimeout(() => setCopied(false), 1200);
              }}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button
              className="px-2 py-0.5 text-xs"
              onClick={() => {
                setDraft("");
                setEditing(true);
              }}
            >
              <PencilSimple size={12} /> Edit
            </Button>
            <Button
              className="px-2 py-0.5 text-xs text-bad"
              disabled={!token}
              onClick={() => removeKeys([storageKey, ...relatedKeys])}
            >
              <Trash size={12} /> Remove
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

import { useStored } from "../lib/store";

export default function Notes() {
  const [notes, setNotes] = useStored<string>("notes", "");
  return (
    <textarea
      aria-label="Notes"
      placeholder="Jot something…"
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
      className="no-drag h-full w-full resize-none bg-transparent p-3 text-sm outline-none placeholder:text-grayscale-8"
    />
  );
}

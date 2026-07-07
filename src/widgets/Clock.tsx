import { Plus, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import Input from "../components/ui/Input";
import { useStored } from "../lib/store";

const cityName = (zone: string) =>
  (zone.split("/").pop() ?? zone).replace(/_/g, " ");

export default function Clock() {
  const [now, setNow] = useState(() => new Date());
  const [zones, setZones] = useStored<string[]>("timezones", []);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString([], {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const inZone = (zone: string) => {
    try {
      return now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: zone,
      });
    } catch {
      return "?";
    }
  };

  const allZones = Intl.supportedValuesOf("timeZone");

  return (
    <div className="group/clock flex h-full flex-col items-center justify-center gap-0.5 p-2 select-none">
      <div className="font-mono text-5xl font-medium tracking-tight tabular-nums">
        {time}
      </div>
      <div className="text-sm text-grayscale-10">{date}</div>

      {zones.length > 0 && (
        <div className="mt-1.5 flex max-w-full flex-wrap justify-center gap-x-4 gap-y-0.5">
          {zones.map((z) => (
            <span key={z} className="group/zone text-xs text-grayscale-10">
              {cityName(z)}{" "}
              <span className="font-mono font-medium text-grayscale-12 tabular-nums">
                {inZone(z)}
              </span>
              <button
                aria-label={`Remove ${cityName(z)}`}
                onClick={() => setZones((prev) => prev.filter((x) => x !== z))}
                className="no-drag ml-1 hidden cursor-pointer text-grayscale-8 group-hover/zone:inline-block hover:text-grayscale-12"
              >
                <X size={9} />
              </button>
            </span>
          ))}
        </div>
      )}

      {adding ? (
        <form
          className="no-drag mt-1"
          onSubmit={(e) => {
            e.preventDefault();
            if (allZones.includes(draft) && !zones.includes(draft)) {
              setZones((prev) => [...prev, draft]);
            }
            setDraft("");
            setAdding(false);
          }}
        >
          <Input
            autoFocus
            list="tz-list"
            placeholder="Europe/Helsinki"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => setAdding(false)}
            className="w-44 text-xs"
          />
          <datalist id="tz-list">
            {allZones.map((z) => (
              <option key={z} value={z} />
            ))}
          </datalist>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="no-drag mt-0.5 hidden cursor-pointer items-center gap-1 rounded px-1.5 text-tiny text-grayscale-9 group-hover/clock:flex hover:text-grayscale-12"
        >
          <Plus size={9} /> timezone
        </button>
      )}
    </div>
  );
}

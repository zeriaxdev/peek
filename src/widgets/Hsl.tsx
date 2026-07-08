import { Plus, Tram, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import Empty from "../components/ui/Empty";
import Input from "../components/ui/Input";
import {
  etaLabel,
  fetchBoards,
  searchStops,
  type Stop,
  type StopBoard,
} from "../lib/hsl";
import { useStored } from "../lib/store";

const POLL_MS = 30 * 1000;

function AddStop({
  apiKey,
  onAdd,
  onClose,
}: {
  apiKey: string;
  onAdd: (s: Stop) => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Stop[]>([]);

  return (
    <div className="no-drag border-t border-grayscale-3 p-2 dark:border-grayscale-5">
      <form
        className="flex gap-1.5"
        onSubmit={async (e) => {
          e.preventDefault();
          setResults(await searchStops(apiKey, q).catch(() => []));
        }}
      >
        <Input
          autoFocus
          placeholder="stop name…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button variant="primary" type="submit" className="px-2.5 py-0.5 text-xs">
          Find
        </Button>
        <Button type="button" className="px-2 py-0.5 text-xs" onClick={onClose}>
          <X size={12} />
        </Button>
      </form>
      {results.map((s) => (
        <button
          key={s.gtfsId}
          onClick={() => {
            onAdd(s);
            onClose();
          }}
          className="mt-1 flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left text-sm hover:bg-grayscale-2 dark:hover:bg-grayscale-4"
        >
          <span className="min-w-0 flex-1 truncate">{s.name}</span>
          {s.code && (
            <span className="shrink-0 text-tiny text-grayscale-9">{s.code}</span>
          )}
        </button>
      ))}
    </div>
  );
}

function Board({ b, onRemove }: { b: StopBoard; onRemove: () => void }) {
  return (
    <div className="group px-2 py-1.5">
      <div className="flex items-center gap-2">
        <span className="min-w-0 flex-1 truncate text-sm font-medium">
          {b.name}
        </span>
        {b.code && (
          <span className="shrink-0 text-tiny text-grayscale-9">{b.code}</span>
        )}
        <button
          aria-label={`Remove ${b.name}`}
          onClick={onRemove}
          className="no-drag hidden shrink-0 cursor-pointer text-grayscale-8 group-hover:block hover:text-grayscale-12"
        >
          <X size={12} />
        </button>
      </div>
      {b.departures.length === 0 ? (
        <p className="py-0.5 text-tiny text-grayscale-8">no departures</p>
      ) : (
        b.departures.map((d, i) => {
          const eta = etaLabel(d.at);
          return (
            <div key={i} className="flex items-center gap-2 py-0.5">
              <span className="min-w-8 shrink-0 rounded-md bg-accent-9 px-1.5 text-center text-tiny font-semibold text-white">
                {d.route}
              </span>
              <span className="min-w-0 flex-1 truncate text-xs text-grayscale-10">
                {d.headsign}
              </span>
              <span
                className={`shrink-0 font-mono text-xs tabular-nums ${eta === "now" ? "text-warn" : "text-grayscale-12"}`}
              >
                {eta}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
}

export default function Hsl() {
  // ponytail: Digitransit key + saved stops live in chrome.storage.local only
  const [apiKey, setApiKey, keyReady] = useStored<string>("hslKey", "");
  const [stops, setStops] = useStored<Stop[]>("hslStops", []);
  const [boards, setBoards] = useState<StopBoard[]>([]);
  const [draft, setDraft] = useState("");
  const [adding, setAdding] = useState(false);
  const [invalid, setInvalid] = useState(false);

  const ids = stops.map((s) => s.gtfsId).join(",");
  useEffect(() => {
    if (!keyReady || !apiKey || stops.length === 0) {
      setBoards([]);
      return;
    }
    let cancelled = false;
    const refresh = () =>
      fetchBoards(apiKey, ids.split(","))
        .then((b) => {
          if (cancelled) return;
          setInvalid(false);
          setBoards(b);
        })
        .catch((e) => {
          if (!cancelled && /40[13]/.test(String(e.message))) setInvalid(true);
        });
    refresh();
    const id = setInterval(refresh, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyReady, apiKey, ids]);

  if (!keyReady) return null;

  if (!apiKey || invalid) {
    return (
      <Empty
        icon={Tram}
        text={invalid ? "Key rejected — check it" : "Next departures near you"}
      >
        <form
          className="no-drag flex w-full max-w-72 gap-1.5"
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.trim()) return;
            setInvalid(false);
            setApiKey(draft.trim());
            setDraft("");
          }}
        >
          <Input
            type="password"
            placeholder="digitransit-subscription-key"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <Button variant="primary" type="submit" className="px-2.5 py-0.5 text-xs">
            Save
          </Button>
        </form>
        <a
          href="https://digitransit.fi/en/developers/api-registration/"
          className="text-center text-tiny text-grayscale-8 underline hover:text-grayscale-11"
        >
          free key · digitransit.fi
        </a>
      </Empty>
    );
  }

  if (stops.length === 0 && !adding) {
    return (
      <Empty icon={Tram} text="Add your stops">
        <Button className="px-2 py-0.5 text-xs" onClick={() => setAdding(true)}>
          <Plus size={11} /> Add stop
        </Button>
      </Empty>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        {stops.map((s) => {
          const b =
            boards.find((x) => x.gtfsId === s.gtfsId) ??
            ({ ...s, departures: [] } as StopBoard);
          return (
            <Board
              key={s.gtfsId}
              b={b}
              onRemove={() =>
                setStops((prev) => prev.filter((x) => x.gtfsId !== s.gtfsId))
              }
            />
          );
        })}
      </div>
      {adding ? (
        <AddStop
          apiKey={apiKey}
          onAdd={(s) =>
            setStops((prev) =>
              prev.some((x) => x.gtfsId === s.gtfsId) ? prev : [...prev, s],
            )
          }
          onClose={() => setAdding(false)}
        />
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="no-drag flex shrink-0 cursor-pointer items-center gap-1 self-start px-3 py-1.5 text-xs text-grayscale-9 hover:text-grayscale-12"
        >
          <Plus size={11} /> stop
        </button>
      )}
    </div>
  );
}

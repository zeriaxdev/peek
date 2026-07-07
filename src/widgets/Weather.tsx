import { useEffect, useState } from "react";
import { useStored } from "../lib/store";

type Loc = { lat: number; lon: number; name: string };
type Snapshot = {
  ts: number;
  temp: number;
  code: number;
  hi: number;
  lo: number;
  wind: number;
};
type GeoResult = {
  name: string;
  latitude: number;
  longitude: number;
  country_code?: string;
  admin1?: string;
};

const STALE_MS = 30 * 60 * 1000;

// WMO weather codes → glyph + label
function describe(code: number): [string, string] {
  if (code === 0) return ["☀️", "Clear"];
  if (code <= 2) return ["⛅", "Partly cloudy"];
  if (code === 3) return ["☁️", "Overcast"];
  if (code <= 48) return ["🌫️", "Fog"];
  if (code <= 57) return ["🌦️", "Drizzle"];
  if (code <= 67) return ["🌧️", "Rain"];
  if (code <= 77) return ["🌨️", "Snow"];
  if (code <= 82) return ["🌧️", "Showers"];
  if (code <= 86) return ["🌨️", "Snow showers"];
  return ["⛈️", "Thunderstorm"];
}

async function fetchWeather(loc: Loc): Promise<Snapshot> {
  const u = new URL("https://api.open-meteo.com/v1/forecast");
  u.searchParams.set("latitude", String(loc.lat));
  u.searchParams.set("longitude", String(loc.lon));
  u.searchParams.set("current", "temperature_2m,weather_code,wind_speed_10m");
  u.searchParams.set("daily", "temperature_2m_max,temperature_2m_min");
  u.searchParams.set("timezone", "auto");
  u.searchParams.set("forecast_days", "1");
  const r = await fetch(u);
  if (!r.ok) throw new Error(`open-meteo ${r.status}`);
  const j = await r.json();
  return {
    ts: Date.now(),
    temp: Math.round(j.current.temperature_2m),
    code: j.current.weather_code,
    wind: Math.round(j.current.wind_speed_10m),
    hi: Math.round(j.daily.temperature_2m_max[0]),
    lo: Math.round(j.daily.temperature_2m_min[0]),
  };
}

function CitySearch({ onPick }: { onPick: (l: Loc) => void }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<GeoResult[]>([]);

  const search = async () => {
    if (!q.trim()) return;
    const u = new URL("https://geocoding-api.open-meteo.com/v1/search");
    u.searchParams.set("name", q.trim());
    u.searchParams.set("count", "5");
    const r = await fetch(u);
    setResults((await r.json()).results ?? []);
  };

  return (
    <div className="no-drag flex h-full flex-col items-center justify-center gap-1.5 p-3">
      <form
        className="flex w-full max-w-56 gap-1.5"
        onSubmit={(e) => {
          e.preventDefault();
          void search();
        }}
      >
        <input
          placeholder="city…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="min-w-0 flex-1 rounded-md border border-border bg-bg px-2 py-1 text-xs focus:border-accent focus:outline-none"
        />
        <button className="rounded-md bg-accent px-2.5 py-1 text-xs font-medium text-white">
          Set
        </button>
      </form>
      {results.map((r, i) => (
        <button
          key={i}
          onClick={() =>
            onPick({ lat: r.latitude, lon: r.longitude, name: r.name })
          }
          className="text-xs text-muted hover:text-fg"
        >
          {r.name}
          {r.admin1 ? `, ${r.admin1}` : ""} {r.country_code ?? ""}
        </button>
      ))}
    </div>
  );
}

export default function Weather() {
  const [loc, setLoc, locReady] = useStored<Loc | null>("weatherLoc", null);
  const [snap, setSnap] = useStored<Snapshot | null>("weatherCache", null);

  useEffect(() => {
    if (!locReady || !loc) return;
    let cancelled = false;
    const refresh = () =>
      fetchWeather(loc)
        .then((s) => {
          if (!cancelled) setSnap(s);
        })
        .catch(() => {}); // offline → keep cache
    if (!snap || Date.now() - snap.ts > STALE_MS) refresh();
    const id = setInterval(refresh, STALE_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locReady, loc?.lat, loc?.lon]);

  if (!locReady) return null;
  if (!loc) return <CitySearch onPick={setLoc} />;
  if (!snap) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-muted">
        loading…
      </div>
    );
  }

  const [glyph, label] = describe(snap.code);
  const old = Date.now() - snap.ts > 2 * STALE_MS;

  return (
    <div className="group/w relative flex h-full items-center justify-center gap-3 p-2 select-none">
      <div className="text-4xl">{glyph}</div>
      <div>
        <div className="text-3xl font-semibold tabular-nums">{snap.temp}°</div>
        <div className="text-xs text-muted">
          {label} · {loc.name}
        </div>
        <div className="text-xs text-muted">
          {snap.hi}° / {snap.lo}° · {snap.wind} km/h
          {old && " · stale"}
        </div>
      </div>
      <button
        aria-label="Change city"
        onClick={() => setLoc(null)}
        className="no-drag absolute top-1.5 right-2 hidden text-[10px] text-muted group-hover/w:block hover:text-fg"
      >
        change
      </button>
    </div>
  );
}

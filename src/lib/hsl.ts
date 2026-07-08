// HSL / Helsinki transit via the Digitransit routing API (GraphQL v2).
// Free API key required (digitransit-subscription-key), stored locally only.
// Register: https://digitransit.fi/en/developers/api-registration/

const ENDPOINT = "https://api.digitransit.fi/routing/v2/hsl/gtfs/v1";

export type Stop = { gtfsId: string; name: string; code: string | null };
export type Departure = {
  route: string; // short name, e.g. "550", "M2"
  headsign: string;
  at: number; // absolute departure time, epoch seconds
};
export type StopBoard = Stop & { departures: Departure[] };

/** Absolute departure epoch (seconds). realtimeDeparture can exceed 86400
 * (after-midnight service), so it is added to serviceDay, not clamped. */
export function departureEpoch(serviceDay: number, secondsIntoDay: number) {
  return serviceDay + secondsIntoDay;
}

/** Whole minutes from now until an epoch-seconds time (never negative). */
export function minsUntil(atSec: number, now = Date.now()): number {
  return Math.max(0, Math.floor((atSec * 1000 - now) / 60000));
}

/** "now" | "3 min" | "12 min" */
export function etaLabel(atSec: number, now = Date.now()): string {
  const m = minsUntil(atSec, now);
  return m === 0 ? "now" : `${m} min`;
}

async function gql<T>(
  key: string,
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const r = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "digitransit-subscription-key": key,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!r.ok) throw new Error(String(r.status));
  const j = await r.json();
  if (j.errors) throw new Error(j.errors[0]?.message ?? "graphql");
  return j.data as T;
}

const SEARCH = `
query ($name: String!) {
  stops(name: $name) { gtfsId name code }
}`;

export async function searchStops(key: string, name: string): Promise<Stop[]> {
  if (!name.trim()) return [];
  const d = await gql<{ stops: Stop[] }>(key, SEARCH, { name: name.trim() });
  return (d.stops ?? []).slice(0, 6);
}

const BOARDS = `
query ($ids: [String!]!, $n: Int!) {
  stops(ids: $ids) {
    gtfsId name code
    stoptimesWithoutPatterns(numberOfDepartures: $n, omitNonPickups: true) {
      serviceDay
      realtimeDeparture
      headsign
      trip { route { shortName } }
    }
  }
}`;

type RawStop = {
  gtfsId: string;
  name: string;
  code: string | null;
  stoptimesWithoutPatterns: Array<{
    serviceDay: number;
    realtimeDeparture: number;
    headsign: string | null;
    trip: { route: { shortName: string | null } } | null;
  }>;
};

export function toBoard(s: RawStop): StopBoard {
  return {
    gtfsId: s.gtfsId,
    name: s.name,
    code: s.code,
    departures: (s.stoptimesWithoutPatterns ?? []).map((t) => ({
      route: t.trip?.route.shortName ?? "?",
      headsign: t.headsign ?? "",
      at: departureEpoch(t.serviceDay, t.realtimeDeparture),
    })),
  };
}

export async function fetchBoards(
  key: string,
  ids: string[],
  perStop = 3,
): Promise<StopBoard[]> {
  if (ids.length === 0) return [];
  const d = await gql<{ stops: (RawStop | null)[] }>(key, BOARDS, {
    ids,
    n: perStop,
  });
  return d.stops.filter(Boolean).map((s) => toBoard(s as RawStop));
}

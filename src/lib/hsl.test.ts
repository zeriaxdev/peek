import { describe, expect, it } from "vitest";
import { departureEpoch, etaLabel, minsUntil, toBoard } from "./hsl";

describe("departureEpoch", () => {
  it("adds seconds-into-day to serviceDay", () => {
    expect(departureEpoch(1000, 3600)).toBe(4600);
  });
  it("handles after-midnight times past 86400", () => {
    // 25:10 service time = 90600s into the day
    expect(departureEpoch(1000, 90600)).toBe(91600);
  });
});

describe("minsUntil / etaLabel", () => {
  const now = 1_000_000_000_000; // fixed ms
  const at = (min: number) => now / 1000 + min * 60;
  it("floors to whole minutes, clamps at 0", () => {
    expect(minsUntil(at(3), now)).toBe(3);
    expect(minsUntil(at(0.9), now)).toBe(0);
    expect(minsUntil(at(-5), now)).toBe(0);
  });
  it("labels", () => {
    expect(etaLabel(at(0), now)).toBe("now");
    expect(etaLabel(at(7), now)).toBe("7 min");
  });
});

describe("toBoard", () => {
  it("maps route/headsign and computes absolute times", () => {
    const b = toBoard({
      gtfsId: "HSL:1",
      name: "Kamppi",
      code: "H1234",
      stoptimesWithoutPatterns: [
        {
          serviceDay: 1000,
          realtimeDeparture: 3600,
          headsign: "Espoo",
          trip: { route: { shortName: "550" } },
        },
      ],
    });
    expect(b.name).toBe("Kamppi");
    expect(b.departures[0]).toEqual({ route: "550", headsign: "Espoo", at: 4600 });
  });

  it("survives missing route/headsign/departures", () => {
    const b = toBoard({
      gtfsId: "HSL:2",
      name: "X",
      code: null,
      stoptimesWithoutPatterns: [
        { serviceDay: 0, realtimeDeparture: 0, headsign: null, trip: null },
      ],
    });
    expect(b.departures[0].route).toBe("?");
    expect(b.departures[0].headsign).toBe("");
  });
});

import { describe, expect, it } from "vitest";
import { describe as wmo } from "./weather";

describe("weather codes", () => {
  it("maps WMO ranges to labels", () => {
    expect(wmo(0)[1]).toBe("Clear");
    expect(wmo(2)[1]).toBe("Partly cloudy");
    expect(wmo(3)[1]).toBe("Overcast");
    expect(wmo(45)[1]).toBe("Fog");
    expect(wmo(65)[1]).toBe("Rain");
    expect(wmo(95)[1]).toBe("Thunderstorm");
  });
  it("always returns a glyph + label", () => {
    for (let c = 0; c <= 99; c++) {
      const [glyph, label] = wmo(c);
      expect(glyph).toBeTruthy();
      expect(label).toBeTruthy();
    }
  });
});

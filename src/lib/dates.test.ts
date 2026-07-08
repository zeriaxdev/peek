import { describe, expect, it } from "vitest";
import { daysLeft, deadlineLabel } from "./dates";

describe("daysLeft", () => {
  const now = new Date("2026-07-08T14:30:00");
  it("is 0 for today regardless of time-of-day", () => {
    expect(daysLeft("2026-07-08", now)).toBe(0);
  });
  it("counts future days", () => {
    expect(daysLeft("2026-07-11", now)).toBe(3);
  });
  it("is negative for the past", () => {
    expect(daysLeft("2026-07-06", now)).toBe(-2);
  });
  it("crosses a month boundary", () => {
    expect(daysLeft("2026-08-01", now)).toBe(24);
  });
});

describe("deadlineLabel", () => {
  it("formats", () => {
    expect(deadlineLabel(-1)).toBe("past");
    expect(deadlineLabel(0)).toBe("today");
    expect(deadlineLabel(1)).toBe("1 day");
    expect(deadlineLabel(5)).toBe("5 days");
  });
});

import { describe, expect, it } from "vitest";
import { isGhData, mapCI, mapPR, mapReview } from "./github";

describe("mapCI", () => {
  it("maps rollup states", () => {
    expect(mapCI("SUCCESS")).toBe("success");
    expect(mapCI("FAILURE")).toBe("failure");
    expect(mapCI("ERROR")).toBe("failure");
    expect(mapCI("PENDING")).toBe("pending");
    expect(mapCI("EXPECTED")).toBe("pending");
  });
  it("is null for missing/unknown", () => {
    expect(mapCI(null)).toBeNull();
    expect(mapCI(undefined)).toBeNull();
    expect(mapCI("WAT")).toBeNull();
  });
});

describe("mapReview", () => {
  it("maps decisions", () => {
    expect(mapReview("APPROVED")).toBe("approved");
    expect(mapReview("CHANGES_REQUESTED")).toBe("changes");
    expect(mapReview("REVIEW_REQUIRED")).toBe("required");
    expect(mapReview(null)).toBeNull();
  });
});

describe("mapPR", () => {
  const base = {
    number: 7,
    title: "fix auth",
    url: "https://github.com/a/b/pull/7",
    isDraft: false,
    reviewDecision: "APPROVED",
    repository: { nameWithOwner: "a/b" },
  };

  it("reads CI from the last commit rollup", () => {
    const pr = mapPR({
      ...base,
      commits: { nodes: [{ commit: { statusCheckRollup: { state: "SUCCESS" } } }] },
    });
    expect(pr).toMatchObject({ key: "a/b#7", repo: "a/b", ci: "success", review: "approved" });
  });

  // the exact shape that caused the white-screen crash: no checks configured
  it("survives a missing statusCheckRollup", () => {
    const pr = mapPR({
      ...base,
      commits: { nodes: [{ commit: { statusCheckRollup: null } }] },
    });
    expect(pr.ci).toBeNull();
  });

  it("survives an empty commits list", () => {
    const pr = mapPR({ ...base, commits: { nodes: [] } });
    expect(pr.ci).toBeNull();
  });
});

describe("isGhData", () => {
  it("accepts the current shape", () => {
    expect(isGhData({ mine: [], review: [], issues: [] })).toBe(true);
  });
  it("rejects null and the old {ts,items} cache shape", () => {
    expect(isGhData(null)).toBe(false);
    expect(isGhData({ ts: 1, items: [] })).toBe(false);
    expect(isGhData({ mine: [], review: [] })).toBe(false);
  });
});

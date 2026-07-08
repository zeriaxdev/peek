import { describe, expect, it } from "vitest";
import { hostLabel, normalizeUrl } from "./url";

describe("normalizeUrl", () => {
  it("adds https to a bare host", () => {
    expect(normalizeUrl("github.com")).toBe("https://github.com");
    expect(normalizeUrl("  example.com/x  ")).toBe("https://example.com/x");
  });
  it("keeps an existing scheme", () => {
    expect(normalizeUrl("http://x.com")).toBe("http://x.com");
    expect(normalizeUrl("https://x.com")).toBe("https://x.com");
    expect(normalizeUrl("chrome://extensions")).toBe("chrome://extensions");
  });
});

describe("hostLabel", () => {
  it("strips www and path", () => {
    expect(hostLabel("https://www.github.com/a/b")).toBe("github.com");
    expect(hostLabel("https://mail.google.com")).toBe("mail.google.com");
  });
  it("falls back on garbage", () => {
    expect(hostLabel("not a url")).toBe("not a url");
  });
});

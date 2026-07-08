/** Add https:// if the user typed a bare host. */
export function normalizeUrl(raw: string): string {
  const s = raw.trim();
  return /^[a-z]+:\/\//i.test(s) ? s : `https://${s}`;
}

/** Display title from a URL: bare hostname without www. Falls back to input. */
export function hostLabel(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

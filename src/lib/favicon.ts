/**
 * Icon source for a link, no third-party favicon services (privacy).
 * In the extension: Chrome's own local favicon cache via _favicon/
 * (needs the "favicon" permission — no network request at all).
 * Under `bun run dev`: the site's own /favicon.ico.
 */
export function faviconUrl(pageUrl: string, size = 64): string {
  if (typeof chrome !== "undefined" && chrome.runtime?.id) {
    const u = new URL(chrome.runtime.getURL("/_favicon/"));
    u.searchParams.set("pageUrl", pageUrl);
    u.searchParams.set("size", String(size));
    return u.toString();
  }
  try {
    return new URL("/favicon.ico", pageUrl).toString();
  } catch {
    return "";
  }
}

/** Read a dropped/picked image file as a data URL (stored locally). */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

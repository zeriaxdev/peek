import { GitPullRequest, GithubLogo } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import Empty from "../components/ui/Empty";
import Input from "../components/ui/Input";
import { useStored } from "../lib/store";

type PR = {
  id: number;
  number: number;
  title: string;
  html_url: string;
  repo: string;
  draft: boolean;
};
type Cache = { ts: number; items: PR[] };

const POLL_MS = 5 * 60 * 1000;

async function fetchPRs(pat: string): Promise<PR[]> {
  const u = new URL("https://api.github.com/search/issues");
  u.searchParams.set("q", "is:open is:pr involves:@me");
  u.searchParams.set("sort", "updated");
  u.searchParams.set("per_page", "15");
  const r = await fetch(u, {
    headers: {
      Authorization: `Bearer ${pat}`,
      Accept: "application/vnd.github+json",
    },
  });
  if (!r.ok) throw new Error(String(r.status));
  const j = await r.json();
  return (j.items as Array<Record<string, unknown>>).map((it) => ({
    id: it.id as number,
    number: it.number as number,
    title: it.title as string,
    html_url: it.html_url as string,
    draft: Boolean(it.draft),
    repo: (it.repository_url as string).split("/").slice(-2).join("/"),
  }));
}

export default function GitHub() {
  // ponytail: PAT lives in chrome.storage.local, never leaves the machine
  const [pat, setPat, patReady] = useStored<string>("githubPat", "");
  const [cache, setCache] = useStored<Cache | null>("githubCache", null);
  const [draft, setDraft] = useState("");
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    if (!patReady || !pat) return;
    let cancelled = false;
    const refresh = () =>
      fetchPRs(pat)
        .then((items) => {
          if (cancelled) return;
          setInvalid(false);
          setCache({ ts: Date.now(), items });
        })
        .catch((e) => {
          if (!cancelled && (e.message === "401" || e.message === "403"))
            setInvalid(true);
        });
    if (!cache || Date.now() - cache.ts > POLL_MS) refresh();
    const id = setInterval(refresh, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patReady, pat]);

  if (!patReady) return null;

  if (!pat || invalid) {
    return (
      <Empty
        icon={GithubLogo}
        text={invalid ? "Token rejected — paste a new one" : "See your open PRs"}
      >
        <form
          className="no-drag flex w-full max-w-64 gap-1.5"
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.trim()) return;
            setInvalid(false);
            setCache(null);
            setPat(draft.trim());
            setDraft("");
          }}
        >
          <Input
            type="password"
            placeholder="personal access token"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <Button variant="primary" type="submit" className="px-2.5 py-0.5 text-xs">
            Save
          </Button>
        </form>
        <p className="text-center text-tiny text-grayscale-8">
          fine-grained PAT, PR read scope — stored locally only
        </p>
      </Empty>
    );
  }

  if (!cache) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-grayscale-9">
        loading…
      </div>
    );
  }

  if (cache.items.length === 0) {
    return <Empty icon={GitPullRequest} text="No open PRs — inbox zero" />;
  }

  return (
    <ul className="h-full overflow-y-auto p-2">
      {cache.items.map((pr) => (
        <li key={pr.id}>
          <a
            href={pr.html_url}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-grayscale-2 dark:hover:bg-grayscale-4"
          >
            <GitPullRequest
              size={14}
              className={`shrink-0 ${pr.draft ? "text-grayscale-8" : "text-accent-9"}`}
            />
            <span className="min-w-0 flex-1 truncate text-sm">{pr.title}</span>
            {pr.draft && (
              <span className="shrink-0 rounded-full border border-grayscale-4 px-1.5 text-tiny text-grayscale-9">
                draft
              </span>
            )}
            <span className="shrink-0 text-tiny text-grayscale-9">
              {pr.repo} #{pr.number}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

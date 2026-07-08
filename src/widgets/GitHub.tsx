import {
  CheckCircle,
  Circle,
  DotsThree,
  GitPullRequest,
  GithubLogo,
  WarningCircle,
  XCircle,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Empty from "../components/ui/Empty";
import Input from "../components/ui/Input";
import { TabList } from "../components/ui/Tabs";
import {
  fetchGitHub,
  type GhData,
  isGhData,
  type Issue,
  type PR,
} from "../lib/github";
import { useStored } from "../lib/store";

type Cache = { ts: number } & GhData;
const POLL_MS = 5 * 60 * 1000;

function CIDot({ ci }: { ci: PR["ci"] }) {
  if (ci === "success")
    return <CheckCircle size={13} weight="fill" className="shrink-0 text-ok" />;
  if (ci === "failure")
    return <XCircle size={13} weight="fill" className="shrink-0 text-bad" />;
  if (ci === "pending")
    return <DotsThree size={13} weight="bold" className="shrink-0 text-warn" />;
  return <Circle size={13} className="shrink-0 text-grayscale-7" />;
}

function ReviewBadge({ review }: { review: PR["review"] }) {
  if (review === "approved")
    return <Badge variant="outline" className="text-ok">approved</Badge>;
  if (review === "changes")
    return <Badge variant="outline" className="text-bad">changes</Badge>;
  if (review === "required")
    return <Badge variant="outline">review</Badge>;
  return null;
}

function PRRow({ pr }: { pr: PR }) {
  return (
    <a
      href={pr.url}
      className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-grayscale-2 dark:hover:bg-grayscale-4"
    >
      <CIDot ci={pr.ci} />
      <GitPullRequest
        size={13}
        className={`shrink-0 ${pr.draft ? "text-grayscale-8" : "text-accent-9"}`}
      />
      <span className="min-w-0 flex-1 truncate text-sm">{pr.title}</span>
      <ReviewBadge review={pr.review} />
      <span className="shrink-0 text-tiny text-grayscale-9">
        {pr.repo.split("/")[1]} #{pr.number}
      </span>
    </a>
  );
}

function IssueRow({ it }: { it: Issue }) {
  return (
    <a
      href={it.url}
      className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-grayscale-2 dark:hover:bg-grayscale-4"
    >
      <WarningCircle size={13} className="shrink-0 text-ok" />
      <span className="min-w-0 flex-1 truncate text-sm">{it.title}</span>
      <span className="shrink-0 text-tiny text-grayscale-9">
        {it.repo.split("/")[1]} #{it.number}
      </span>
    </a>
  );
}

export default function GitHub() {
  // ponytail: PAT lives in chrome.storage.local, never leaves the machine
  const [pat, setPat, patReady] = useStored<string>("githubPat", "");
  const [cache, setCache] = useStored<Cache | null>("githubCache", null);
  const [tab, setTab] = useState("review");
  const [draft, setDraft] = useState("");
  const [invalid, setInvalid] = useState(false);
  const valid = isGhData(cache);

  useEffect(() => {
    if (!patReady || !pat) return;
    let cancelled = false;
    const refresh = () =>
      fetchGitHub(pat)
        .then((d) => {
          if (cancelled) return;
          setInvalid(false);
          setCache({ ts: Date.now(), ...d });
        })
        .catch((e) => {
          if (!cancelled && /40[13]|Bad cred/i.test(String(e.message)))
            setInvalid(true);
        });
    // stale cache from an older widget version has a different shape → refetch
    if (!valid || Date.now() - cache!.ts > POLL_MS) refresh();
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
        text={invalid ? "Token rejected — paste a new one" : "See PRs that need you"}
      >
        <form
          className="no-drag flex w-full max-w-72 gap-1.5"
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
          classic PAT, <code>repo</code> scope — stored locally only
        </p>
      </Empty>
    );
  }

  if (!valid) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-grayscale-9">
        loading…
      </div>
    );
  }

  const c = cache!; // narrowed by `valid` above
  const count = (n: number) =>
    n > 0 ? <span className="text-grayscale-9">{n}</span> : null;
  const tabs = [
    { value: "review", label: <>Review {count(c.review.length)}</> },
    { value: "mine", label: <>Mine {count(c.mine.length)}</> },
    { value: "issues", label: <>Issues {count(c.issues.length)}</> },
  ];

  const rows =
    tab === "issues"
      ? c.issues.map((it) => <IssueRow key={it.key} it={it} />)
      : (tab === "mine" ? c.mine : c.review).map((pr) => (
          <PRRow key={pr.key} pr={pr} />
        ));

  return (
    <div className="flex h-full flex-col">
      <TabList items={tabs} value={tab} onChange={setTab} />
      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        {rows.length > 0 ? (
          rows
        ) : (
          <p className="flex h-full items-center justify-center text-xs text-grayscale-8">
            {tab === "review" ? "nothing waiting on you" : "nothing here"}
          </p>
        )}
      </div>
    </div>
  );
}

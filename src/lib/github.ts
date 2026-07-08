// One GraphQL call fetches all three tabs plus per-PR CI + review state.
// No third-party proxy; PAT stays in chrome.storage.local.

export type CI = "success" | "failure" | "pending" | null;
export type Review = "approved" | "changes" | "required" | null;

export type PR = {
  key: string;
  number: number;
  title: string;
  url: string;
  repo: string;
  draft: boolean;
  ci: CI;
  review: Review;
};
export type Issue = {
  key: string;
  number: number;
  title: string;
  url: string;
  repo: string;
};
export type GhData = { mine: PR[]; review: PR[]; issues: Issue[] };

const QUERY = `
query {
  mine: search(query: "is:open is:pr author:@me archived:false", type: ISSUE, first: 20) {
    nodes { ...pr }
  }
  review: search(query: "is:open is:pr review-requested:@me archived:false", type: ISSUE, first: 20) {
    nodes { ...pr }
  }
  issues: search(query: "is:open is:issue assignee:@me archived:false", type: ISSUE, first: 20) {
    nodes { ... on Issue { number title url repository { nameWithOwner } } }
  }
}
fragment pr on PullRequest {
  number title url isDraft
  repository { nameWithOwner }
  reviewDecision
  commits(last: 1) {
    nodes { commit { statusCheckRollup { state } } }
  }
}`;

export function mapCI(state?: string | null): CI {
  if (state === "SUCCESS") return "success";
  if (state === "FAILURE" || state === "ERROR") return "failure";
  if (state === "PENDING" || state === "EXPECTED") return "pending";
  return null;
}
export function mapReview(d?: string | null): Review {
  if (d === "APPROVED") return "approved";
  if (d === "CHANGES_REQUESTED") return "changes";
  if (d === "REVIEW_REQUIRED") return "required";
  return null;
}

/** True only for the current GhData shape — guards against stale cached shapes. */
export function isGhData(d: unknown): d is GhData {
  const c = d as GhData | null;
  return (
    !!c &&
    Array.isArray(c.mine) &&
    Array.isArray(c.review) &&
    Array.isArray(c.issues)
  );
}

export function mapPR(n: Record<string, unknown>): PR {
  const repo = (n.repository as { nameWithOwner: string }).nameWithOwner;
  const state = (
    (n.commits as { nodes: Array<{ commit: { statusCheckRollup: { state: string } | null } }> })
      .nodes[0]?.commit.statusCheckRollup
  )?.state;
  return {
    key: `${repo}#${n.number}`,
    number: n.number as number,
    title: n.title as string,
    url: n.url as string,
    repo,
    draft: Boolean(n.isDraft),
    ci: mapCI(state),
    review: mapReview(n.reviewDecision as string | null),
  };
}

export async function fetchGitHub(pat: string): Promise<GhData> {
  const r = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${pat}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: QUERY }),
  });
  if (!r.ok) throw new Error(String(r.status));
  const j = await r.json();
  if (j.errors) throw new Error(j.errors[0]?.message ?? "graphql");
  const d = j.data;
  return {
    mine: d.mine.nodes.filter(Boolean).map(mapPR),
    review: d.review.nodes.filter(Boolean).map(mapPR),
    issues: d.issues.nodes.filter(Boolean).map((n: Record<string, unknown>) => {
      const repo = (n.repository as { nameWithOwner: string }).nameWithOwner;
      return {
        key: `${repo}#${n.number}`,
        number: n.number as number,
        title: n.title as string,
        url: n.url as string,
        repo,
      };
    }),
  };
}

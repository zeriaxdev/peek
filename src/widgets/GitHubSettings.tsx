import TokenSettings from "../components/ui/TokenSettings";

export default function GitHubSettings() {
  return (
    <TokenSettings
      title="GitHub token"
      storageKey="githubPat"
      relatedKeys={["githubCache", "githubHidden"]}
    />
  );
}

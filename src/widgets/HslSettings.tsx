import TokenSettings from "../components/ui/TokenSettings";

export default function HslSettings() {
  return (
    <TokenSettings
      title="Digitransit key"
      storageKey="hslKey"
      relatedKeys={["hslStops"]}
    />
  );
}

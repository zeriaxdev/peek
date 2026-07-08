// WMO weather codes → [glyph, label]
export function describe(code: number): [string, string] {
  if (code === 0) return ["☀️", "Clear"];
  if (code <= 2) return ["⛅", "Partly cloudy"];
  if (code === 3) return ["☁️", "Overcast"];
  if (code <= 48) return ["🌫️", "Fog"];
  if (code <= 57) return ["🌦️", "Drizzle"];
  if (code <= 67) return ["🌧️", "Rain"];
  if (code <= 77) return ["🌨️", "Snow"];
  if (code <= 82) return ["🌧️", "Showers"];
  if (code <= 86) return ["🌨️", "Snow showers"];
  return ["⛈️", "Thunderstorm"];
}

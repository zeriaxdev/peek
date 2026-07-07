import { useEffect, useState } from "react";

// Phase 0 smoke test: confirms React + Tailwind + MV3 build all load.
// Replaced by the bento grid in Phase 1.
export default function App() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const date = now.toLocaleDateString([], {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <div className="text-7xl font-semibold tabular-nums tracking-tight">
        {time}
      </div>
      <div className="text-lg text-neutral-400">{date}</div>
      <div className="mt-6 text-xs uppercase tracking-widest text-neutral-600">
        peek · phase 0
      </div>
    </main>
  );
}

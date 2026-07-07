import {
  ArrowCounterClockwise,
  Pause,
  Play,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import IconButton from "../components/ui/IconButton";
import { useStored } from "../lib/store";

type Phase = "work" | "break";
// endsAt set → running; left holds remaining seconds while paused
type State = { phase: Phase; endsAt: number | null; left: number };

const DUR: Record<Phase, number> = { work: 25 * 60, break: 5 * 60 };
const NEXT: Record<Phase, Phase> = { work: "break", break: "work" };

export default function Pomodoro() {
  const [s, setS] = useStored<State>("pomodoro", {
    phase: "work",
    endsAt: null,
    left: DUR.work,
  });
  const [, force] = useState(0);

  const running = s.endsAt !== null;
  const left = running
    ? Math.max(0, Math.round((s.endsAt! - Date.now()) / 1000))
    : s.left;

  // tick while running; survives tab close because endsAt is stored
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => force((n) => n + 1), 500);
    return () => clearInterval(id);
  }, [running]);

  // phase finished → advance, stopped (user starts the next block)
  useEffect(() => {
    if (running && left === 0) {
      const next = NEXT[s.phase];
      setS({ phase: next, endsAt: null, left: DUR[next] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, left === 0]);

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <div className="flex h-full flex-col items-center justify-center gap-1 select-none">
      <span className="text-tiny font-medium tracking-widest text-grayscale-9 uppercase">
        {s.phase === "work" ? "Focus" : "Break"}
      </span>
      <div className="font-mono text-4xl font-medium tabular-nums">
        {mm}:{ss}
      </div>
      <div className="flex items-center gap-1">
        <IconButton
          aria-label={running ? "Pause" : "Start"}
          onClick={() =>
            setS(
              running
                ? { ...s, endsAt: null, left }
                : { ...s, endsAt: Date.now() + left * 1000 },
            )
          }
        >
          {running ? (
            <Pause size={15} weight="fill" />
          ) : (
            <Play size={15} weight="fill" className="text-accent-9" />
          )}
        </IconButton>
        <IconButton
          aria-label="Reset"
          onClick={() =>
            setS({ phase: s.phase, endsAt: null, left: DUR[s.phase] })
          }
        >
          <ArrowCounterClockwise size={14} />
        </IconButton>
      </div>
    </div>
  );
}

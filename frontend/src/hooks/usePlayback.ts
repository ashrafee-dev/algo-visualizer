import { useEffect } from "react";
import { useAppStore } from "../store/useAppStore";

/** Auto-advance steps while `playing`; pauses at the final step. */
export function usePlayback() {
  const playing = useAppStore((s) => s.playing);
  const stepIndex = useAppStore((s) => s.stepIndex);
  const speedMs = useAppStore((s) => s.speedMs);
  const runResult = useAppStore((s) => s.runResult);
  const setStepIndex = useAppStore((s) => s.setStepIndex);
  const setPlaying = useAppStore((s) => s.setPlaying);

  useEffect(() => {
    if (!playing || !runResult?.steps.length) return;
    const last = runResult.steps.length - 1;
    if (stepIndex >= last) {
      setPlaying(false);
      return;
    }
    const t = window.setTimeout(() => setStepIndex(stepIndex + 1), speedMs);
    return () => window.clearTimeout(t);
  }, [playing, stepIndex, speedMs, runResult, setStepIndex, setPlaying]);
}

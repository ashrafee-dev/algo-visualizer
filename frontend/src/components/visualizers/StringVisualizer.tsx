import { motion } from "framer-motion";
import type { Step } from "../../types/api";

export function StringVisualizer({ step }: { step: Step | null }) {
  const text = String(step?.snapshot.text ?? step?.snapshot.s ?? "");
  const i = (step?.highlights.i as number | undefined) ?? (step?.snapshot.i as number | undefined);
  const j = (step?.highlights.j as number | undefined) ?? (step?.snapshot.j as number | undefined);
  const match = step?.highlights.match as [number, number] | undefined;
  const pattern = step?.snapshot.pattern != null ? String(step.snapshot.pattern) : null;

  if (!text && !pattern) {
    return (
      <div className="glass-panel flex h-full items-center justify-center rounded-2xl p-8 text-center text-sm text-slate-500">
        String steps use <code className="text-slate-400">snapshot.text</code> and optional <code className="text-slate-400">highlights.i</code> /{" "}
        <code className="text-slate-400">j</code> or <code className="text-slate-400">match: [start,end]</code>.
      </div>
    );
  }

  return (
    <div className="glass-panel flex h-full flex-col justify-center gap-6 rounded-2xl p-6 sm:p-8">
      <div className="text-xs text-slate-500">String view</div>
      {pattern && (
        <div>
          <div className="mb-2 text-[10px] uppercase tracking-wider text-slate-500">Pattern</div>
          <div className="font-mono text-lg tracking-[0.2em] text-sky-200">{pattern}</div>
        </div>
      )}
      <div className="overflow-x-auto">
        <div className="flex min-w-min gap-0.5 sm:gap-1">
          {text.split("").map((ch, idx) => {
            const inMatch = match && idx >= match[0] && idx <= match[1];
            const atI = i === idx;
            const atJ = j === idx;
            const active = atI || atJ;
            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                <motion.div
                  layout
                  className={`flex h-12 w-9 items-center justify-center rounded-lg border font-mono text-sm sm:h-14 sm:w-10 sm:text-base ${
                    inMatch
                      ? "border-emerald-400/50 bg-emerald-500/20 text-emerald-100"
                      : active
                        ? "border-cyan-400/50 bg-cyan-500/20 text-cyan-50 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                        : "border-white/10 bg-slate-900/40 text-slate-200"
                  }`}
                >
                  {ch === " " ? "\u00a0" : ch}
                </motion.div>
                <span className="font-mono text-[9px] text-slate-600">{idx}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import type { Step } from "../../types/api";

const BAR_H = 220;

export function ArrayVisualizer({ step }: { step: Step | null }) {
  const arr = (step?.snapshot.array as number[] | undefined) ?? [];
  const target = step?.snapshot.target as number | undefined;
  const compare = (step?.highlights.compare as number[] | undefined) ?? [];
  const swap = (step?.highlights.swap as number[] | undefined) ?? [];
  const sorted = (step?.highlights.sorted as number[] | undefined) ?? [];
  const left = step?.highlights.left as number | undefined;
  const mid = step?.highlights.mid as number | undefined;
  const right = step?.highlights.right as number | undefined;
  const found = step?.highlights.found as number | undefined;
  const sortedFrom = step?.highlights.sorted_from as number | undefined;

  const maxV = arr.length ? Math.max(...arr.map((v) => Math.abs(v)), 1) : 1;

  if (!arr.length) {
    return (
      <div className="glass-panel flex h-full items-center justify-center rounded-2xl text-sm text-slate-500">
        Select an algorithm to preview its array.
      </div>
    );
  }

  return (
    <div className="glass-panel relative flex h-full flex-col items-center justify-center overflow-hidden rounded-2xl px-8 py-6">
      {/* Header */}
      <div className="mb-4 flex w-full items-center justify-between text-xs text-slate-400">
        <span className="font-medium tracking-wide text-slate-500">Array</span>
        {target !== undefined && (
          <span className="rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-1 font-semibold text-cyan-200">
            target = {String(target)}
          </span>
        )}
      </div>

      {/* Bars centered */}
      <div className="flex w-full max-w-2xl items-end justify-center gap-2.5 sm:gap-3" style={{ height: BAR_H }}>
        {arr.map((v, i) => {
          const heightPct = (Math.abs(v) / maxV) * 85 + 10;
          const isCompare = compare.includes(i);
          const isSwap = swap.includes(i);
          const isSorted = sorted.includes(i);
          const isFound = found === i;
          const isRange = left !== undefined && right !== undefined && i >= left && i <= right;
          const isMid = mid === i;
          const isLeft = left === i;
          const isRight = right === i;
          const pastSortedZone = sortedFrom !== undefined && i >= sortedFrom;

          let bg = "rgba(51,65,85,0.7)";
          let ring = "rgba(255,255,255,0.08)";
          let glow = "none";
          if (isFound) {
            bg = "linear-gradient(to top, #059669, #10b981)";
            ring = "#34d399"; glow = "0 0 20px rgba(16,185,129,0.5)";
          } else if (isSorted || pastSortedZone) {
            bg = "linear-gradient(to top, #047857, #059669)";
            ring = "rgba(16,185,129,0.4)";
          } else if (isSwap) {
            bg = "linear-gradient(to top, #d97706, #f59e0b)";
            ring = "#fbbf24"; glow = "0 0 18px rgba(245,158,11,0.4)";
          } else if (isMid) {
            bg = "linear-gradient(to top, #7c3aed, #a78bfa)";
            ring = "#a78bfa"; glow = "0 0 18px rgba(139,92,246,0.45)";
          } else if (isCompare) {
            bg = "linear-gradient(to top, #0284c7, #38bdf8)";
            ring = "#38bdf8"; glow = "0 0 16px rgba(56,189,248,0.35)";
          } else if (isRange) {
            bg = "linear-gradient(to top, rgba(99,102,241,0.5), rgba(129,140,248,0.4))";
            ring = "rgba(129,140,248,0.4)";
          }

          return (
            <div key={`${i}-${v}`} className="flex min-w-[2.25rem] max-w-[4rem] flex-1 flex-col items-center">
              {/* Pointer labels */}
              <div className="mb-1 flex h-5 items-end justify-center gap-0.5 text-[9px] font-bold">
                {isLeft && <span className="rounded bg-indigo-500/30 px-1 text-indigo-300">L</span>}
                {isMid && <span className="rounded bg-violet-500/40 px-1 text-violet-200">M</span>}
                {isRight && <span className="rounded bg-indigo-500/30 px-1 text-indigo-300">R</span>}
              </div>
              {/* Value */}
              <span className="mb-1.5 text-sm font-bold tabular-nums text-white drop-shadow-sm">{v}</span>
              {/* Bar */}
              <motion.div
                layout
                initial={false}
                animate={{ height: `${(heightPct / 100) * BAR_H * 0.7}px` }}
                transition={{ type: "spring", stiffness: 380, damping: 26 }}
                className="w-full rounded-lg"
                style={{
                  background: bg,
                  boxShadow: glow,
                  outline: `1.5px solid ${ring}`,
                  minHeight: 12,
                }}
              />
              {/* Index */}
              <span className="mt-1.5 font-mono text-[10px] tabular-nums text-slate-500">{i}</span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-[10px] text-slate-400">
        {target !== undefined && (
          <>
            <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded" style={{ background: "#38bdf8" }} />Comparing</span>
            <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded" style={{ background: "#a78bfa" }} />Mid</span>
            <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded" style={{ background: "#10b981" }} />Found</span>
          </>
        )}
        {target === undefined && (
          <>
            <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded" style={{ background: "#38bdf8" }} />Comparing</span>
            <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded" style={{ background: "#f59e0b" }} />Swapping</span>
            <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded" style={{ background: "#059669" }} />Sorted</span>
          </>
        )}
      </div>
    </div>
  );
}

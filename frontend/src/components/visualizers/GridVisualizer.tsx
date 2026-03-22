import { motion } from "framer-motion";
import type { Step } from "../../types/api";

type Cell = number | string;

function parseCoord(v: unknown): [number, number] | null {
  if (!Array.isArray(v) || v.length < 2) return null;
  const r = Number(v[0]);
  const c = Number(v[1]);
  if (Number.isNaN(r) || Number.isNaN(c)) return null;
  return [r, c];
}

function key(r: number, c: number) {
  return `${r},${c}`;
}

export function GridVisualizer({ step }: { step: Step | null }) {
  const grid = step?.snapshot.grid as Cell[][] | undefined;
  const rows = (step?.snapshot.rows as number | undefined) ?? grid?.length ?? 0;
  const cols = (step?.snapshot.cols as number | undefined) ?? (grid?.[0]?.length ?? 0);
  const start = parseCoord(step?.snapshot.start);
  const end = parseCoord(step?.snapshot.end);
  const current = parseCoord(step?.highlights.current ?? step?.snapshot.current);
  const visited = (step?.highlights.visited as unknown[] | undefined)?.map(parseCoord).filter(Boolean) as [number, number][];
  const path = (step?.highlights.path as unknown[] | undefined)?.map(parseCoord).filter(Boolean) as [number, number][];

  const visitedSet = new Set((visited ?? []).map(([r, c]) => key(r, c)));
  const pathSet = new Set((path ?? []).map(([r, c]) => key(r, c)));

  const cells: Cell[][] =
    grid ??
    Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, (_, c) => (step?.snapshot.empty_cell as Cell) ?? 0));

  if (!cells.length || !cells[0]?.length) {
    return (
      <div className="glass-panel flex h-full items-center justify-center rounded-2xl p-8 text-center text-sm text-slate-500">
        Grid snapshots will appear here for pathfinding / DP on grids. Expected <code className="text-slate-400">snapshot.grid</code> or{" "}
        <code className="text-slate-400">rows</code>/<code className="text-slate-400">cols</code>.
      </div>
    );
  }

  return (
    <div className="glass-panel flex h-full flex-col overflow-auto rounded-2xl p-4 sm:p-6">
      <div className="mb-3 text-xs text-slate-500">Grid view</div>
      <div
        className="mx-auto grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${cells[0].length}, minmax(2rem, 1fr))`,
        }}
      >
        {cells.map((row, r) =>
          row.map((cell, c) => {
            const k = key(r, c);
            const isStart = start && start[0] === r && start[1] === c;
            const isEnd = end && end[0] === r && end[1] === c;
            const isCur = current && current[0] === r && current[1] === c;
            const isPath = pathSet.has(k);
            const isVisited = visitedSet.has(k);
            const wall = cell === 1 || cell === "#" || cell === "wall";

            let cls = "border-white/10 bg-slate-800/50 text-slate-200";
            if (wall) cls = "border-white/5 bg-slate-950/80 text-slate-600";
            else if (isStart) cls = "border-emerald-400/50 bg-emerald-500/25 text-emerald-100";
            else if (isEnd) cls = "border-rose-400/50 bg-rose-500/25 text-rose-100";
            else if (isPath) cls = "border-amber-400/40 bg-amber-500/20 text-amber-100";
            else if (isVisited) cls = "border-violet-400/30 bg-violet-500/15 text-violet-100";
            if (isCur && !wall) cls = "border-cyan-400/60 bg-cyan-500/30 text-white ring-2 ring-cyan-400/40";

            return (
              <motion.div
                key={k}
                layout
                className={`flex aspect-square min-h-[2rem] items-center justify-center rounded-lg border text-xs font-medium ${cls}`}
              >
                {wall ? "" : String(cell === 0 ? "" : cell)}
              </motion.div>
            );
          }),
        )}
      </div>
    </div>
  );
}

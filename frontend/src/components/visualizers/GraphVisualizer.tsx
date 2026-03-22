import { type ReactNode, useMemo } from "react";
import ReactFlow, { Background, Controls, MarkerType, type Edge, type Node } from "reactflow";
import "reactflow/dist/style.css";
import type { Step } from "../../types/api";

type NodeId = string | number;

/* ── BFS-based tree layout ─────────────────────────────── */

function treeLayout(
  nodeIds: NodeId[],
  edgesRaw: Array<[NodeId, NodeId, number?]>,
  root: NodeId,
): Record<string, { x: number; y: number }> {
  const ids = nodeIds.map(String);
  const adj: Record<string, string[]> = {};
  for (const id of ids) adj[id] = [];
  for (const [u, v] of edgesRaw) {
    adj[String(u)]?.push(String(v));
    adj[String(v)]?.push(String(u));
  }

  const levels: Record<string, number> = {};
  const q = [String(root)];
  levels[String(root)] = 0;
  while (q.length) {
    const node = q.shift()!;
    for (const nb of adj[node] ?? []) {
      if (levels[nb] === undefined) {
        levels[nb] = levels[node] + 1;
        q.push(nb);
      }
    }
  }

  let maxLv = 0;
  for (const v of Object.values(levels)) if (v > maxLv) maxLv = v;
  for (const id of ids) {
    if (levels[id] === undefined) levels[id] = ++maxLv;
  }

  const byLevel: string[][] = [];
  for (const [id, lv] of Object.entries(levels)) (byLevel[lv] ??= []).push(id);

  const NODE_GAP = 130;
  const LEVEL_GAP = 120;
  const positions: Record<string, { x: number; y: number }> = {};
  for (let lv = 0; lv < byLevel.length; lv++) {
    const row = byLevel[lv] ?? [];
    const totalW = (row.length - 1) * NODE_GAP;
    const startX = -totalW / 2;
    row.forEach((id, i) => {
      positions[id] = { x: startX + i * NODE_GAP, y: lv * LEVEL_GAP };
    });
  }
  return positions;
}

/* ── Palette ───────────────────────────────────────────── */

const C = {
  cyan:   { bg: "rgba(14,165,233,0.9)",  glow: "0 0 28px rgba(56,189,248,0.45)",  border: "rgba(56,189,248,0.7)" },
  green:  { bg: "rgba(5,150,105,0.85)",   glow: "0 0 16px rgba(16,185,129,0.25)", border: "rgba(16,185,129,0.55)" },
  amber:  { bg: "rgba(245,158,11,0.25)",  glow: "none",                            border: "rgba(251,191,36,0.5)" },
  violet: { bg: "rgba(139,92,246,0.35)",  glow: "0 0 14px rgba(139,92,246,0.2)",  border: "rgba(139,92,246,0.5)" },
  gold:   { bg: "rgba(234,179,8,0.85)",   glow: "0 0 22px rgba(234,179,8,0.3)",   border: "rgba(250,204,21,0.7)" },
  slate:  { bg: "rgba(30,41,59,0.92)",    glow: "0 4px 16px rgba(0,0,0,0.3)",     border: "rgba(255,255,255,0.1)" },
};

function distBadge(d: number | null | undefined): ReactNode {
  if (d === null || d === undefined)
    return <span style={{ color: "rgba(148,163,184,0.5)", fontSize: 9 }}>∞</span>;
  if (d === 0)
    return <span style={{ color: "#fbbf24", fontSize: 9, fontWeight: 700 }}>0</span>;
  return <span style={{ color: "#a5f3fc", fontSize: 9, fontWeight: 600 }}>{d}</span>;
}

/* ── Component ─────────────────────────────────────────── */

export function GraphVisualizer({ step }: { step: Step | null }) {
  const nodesRaw = (step?.snapshot.nodes as NodeId[] | undefined) ?? [];
  const edgesRaw = (step?.snapshot.edges as Array<[NodeId, NodeId, number?]> | undefined) ?? [];
  const current = step?.highlights.current as NodeId | undefined;
  const visited = (step?.highlights.visited as NodeId[] | undefined) ?? [];
  const edgeHi = step?.highlights.edge as [NodeId, NodeId] | undefined;
  const dist = step?.highlights.dist as Record<string, number | null> | undefined;
  const queue = (step?.highlights.queue as NodeId[] | undefined) ?? [];

  const hasDist = dist !== undefined;
  const root = visited.length > 0 ? visited[0] : current ?? nodesRaw[0] ?? 0;
  const positions = useMemo(() => treeLayout(nodesRaw, edgesRaw, root), [nodesRaw, edgesRaw, root]);

  const visitedSet = useMemo(() => new Set(visited.map(String)), [visited]);
  const queueSet = useMemo(() => new Set(queue.map(String)), [queue]);

  const nodes: Node[] = useMemo(
    () =>
      nodesRaw.map((id) => {
        const sid = String(id);
        const isCur = String(current) === sid;
        const isVis = visitedSet.has(sid);
        const inQ = queueSet.has(sid);
        const isSource = sid === String(root) && hasDist;
        const d = dist?.[sid];
        const hasFiniteDist = d !== null && d !== undefined;

        let pal = C.slate;
        if (isCur) pal = C.cyan;
        else if (isSource && !isVis) pal = C.gold;
        else if (isVis) pal = C.green;
        else if (inQ) pal = C.amber;
        else if (hasDist && hasFiniteDist) pal = C.violet;

        const label: ReactNode = hasDist ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, lineHeight: 1 }}>
            <span style={{ fontSize: 16, fontWeight: 800 }}>{sid}</span>
            {distBadge(d)}
          </div>
        ) : (
          <span style={{ fontSize: 16, fontWeight: 700 }}>{sid}</span>
        );

        return {
          id: sid,
          data: { label },
          position: positions[sid] ?? { x: 0, y: 0 },
          style: {
            background: pal.bg,
            color: "#f8fafc",
            border: `1.5px solid ${pal.border}`,
            borderRadius: 9999,
            width: 62,
            height: 62,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: pal.glow,
            padding: 0,
          },
        };
      }),
    [nodesRaw, positions, current, visitedSet, queueSet, dist, hasDist, root],
  );

  const flowEdges: Edge[] = useMemo(
    () =>
      edgesRaw.map((edge, idx) => {
        const a = String(edge[0]);
        const b = String(edge[1]);
        const w = edge[2];
        const active = edgeHi && String(edgeHi[0]) === a && String(edgeHi[1]) === b;
        const bothVisited = visitedSet.has(a) && visitedSet.has(b);
        const stroke = active ? "#38bdf8" : bothVisited ? "rgba(16,185,129,0.5)" : "rgba(148,163,184,0.3)";
        const sw = active ? 2.5 : bothVisited ? 2 : 1.5;
        return {
          id: `e-${idx}-${a}-${b}`,
          source: a,
          target: b,
          type: "default",
          markerEnd: { type: MarkerType.ArrowClosed, color: stroke, width: 14, height: 14 },
          label: w !== undefined ? String(w) : undefined,
          animated: active,
          style: { stroke, strokeWidth: sw },
          labelStyle: { fill: active ? "#38bdf8" : "#cbd5e1", fontSize: 10, fontWeight: 600 },
          labelBgStyle: { fill: "rgba(15,23,42,0.92)", fillOpacity: 1 },
          labelBgPadding: [6, 3] as [number, number],
          labelBgBorderRadius: 6,
        };
      }),
    [edgesRaw, edgeHi, visitedSet],
  );

  return (
    <div className="glass-panel relative h-full min-h-[320px] overflow-hidden rounded-2xl">
      <ReactFlow
        fitView
        fitViewOptions={{ padding: 0.3 }}
        nodes={nodes}
        edges={flowEdges}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="rgba(148,163,184,0.08)" gap={24} />
        <Controls className="!border-white/10 !bg-slate-900/80 !shadow-lg [&_button]:!border-white/10 [&_button]:!bg-slate-800/90" />
      </ReactFlow>

      {/* Legend */}
      <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-2 text-[10px] text-slate-400">
        <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: C.cyan.bg }} />Current</span>
        <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: C.green.bg }} />Visited</span>
        {queue.length > 0 && <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: C.amber.bg, border: `1px solid ${C.amber.border}` }} />Queue</span>}
        {hasDist && <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: C.violet.bg, border: `1px solid ${C.violet.border}` }} />Discovered</span>}
      </div>

      {queue.length > 0 && (
        <div className="pointer-events-none absolute bottom-4 left-4 right-4 rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-slate-300 backdrop-blur-md">
          <span className="text-slate-500">Queue </span>
          <span className="font-mono text-cyan-200">{queue.map(String).join(" → ")}</span>
        </div>
      )}
    </div>
  );
}

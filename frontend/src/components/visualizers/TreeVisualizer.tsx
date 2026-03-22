import { useMemo } from "react";
import ReactFlow, { Background, Controls, MarkerType, type Edge, type Node } from "reactflow";
import "reactflow/dist/style.css";
import type { Step } from "../../types/api";

interface TreeNodeDef {
  id: string;
  label?: string;
  left?: string | null;
  right?: string | null;
}

function layoutBinaryTree(nodes: TreeNodeDef[], rootId: string): { positions: Record<string, { x: number; y: number }>; edges: Edge[] } {
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const positions: Record<string, { x: number; y: number }> = {};
  const edges: Edge[] = [];
  let edgeIdx = 0;

  function place(id: string | null | undefined, x: number, depth: number, spread: number): void {
    if (!id || !byId[id]) return;
    positions[id] = { x, y: depth * 110 };
    const n = byId[id];
    if (n.left) {
      edges.push({
        id: `te-${edgeIdx++}`,
        source: id,
        target: n.left,
        markerEnd: { type: MarkerType.ArrowClosed, color: "#64748b" },
        style: { stroke: "rgba(148,163,184,0.45)" },
      });
      place(n.left, x - spread, depth + 1, spread * 0.55);
    }
    if (n.right) {
      edges.push({
        id: `te-${edgeIdx++}`,
        source: id,
        target: n.right,
        markerEnd: { type: MarkerType.ArrowClosed, color: "#64748b" },
        style: { stroke: "rgba(148,163,184,0.45)" },
      });
      place(n.right, x + spread, depth + 1, spread * 0.55);
    }
  }

  place(rootId, 0, 0, 200);
  return { positions, edges };
}

export function TreeVisualizer({ step }: { step: Step | null }) {
  const snap = step?.snapshot ?? {};
  const nodesDef = snap.nodes as TreeNodeDef[] | undefined;
  const rootId = String(snap.root ?? "");

  const { flowNodes, flowEdges } = useMemo(() => {
    if (!nodesDef?.length || !rootId) {
      return { flowNodes: [] as Node[], flowEdges: [] as Edge[] };
    }
    const { positions, edges } = layoutBinaryTree(nodesDef, rootId);
    const current = step?.highlights.current as string | undefined;
    const visited = (step?.highlights.visited as string[] | undefined) ?? [];

    const flowNodes: Node[] = nodesDef.map((n) => {
      const pos = positions[n.id] ?? { x: 0, y: 0 };
      const isCur = current === n.id;
      const isVis = visited.includes(n.id);
      return {
        id: n.id,
        data: { label: n.label ?? n.id },
        position: pos,
        style: {
          background: isCur ? "linear-gradient(145deg, rgba(56,189,248,0.95), rgba(14,165,233,0.85))" : isVis ? "linear-gradient(145deg, rgba(139,92,246,0.85), rgba(109,40,217,0.8))" : "linear-gradient(145deg, rgba(30,41,59,0.95), rgba(15,23,42,0.92))",
          color: "#f8fafc",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 14,
          width: 48,
          height: 48,
          fontSize: 13,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      };
    });
    return { flowNodes, flowEdges: edges };
  }, [nodesDef, rootId, step]);

  if (!flowNodes.length) {
    return (
      <div className="glass-panel flex h-full items-center justify-center rounded-2xl p-8 text-center text-sm text-slate-500">
        Tree steps expect <code className="text-slate-400">snapshot.nodes</code> (with <code className="text-slate-400">left</code>/<code className="text-slate-400">right</code>) and{" "}
        <code className="text-slate-400">snapshot.root</code>.
      </div>
    );
  }

  return (
    <div className="glass-panel relative h-full min-h-[320px] overflow-hidden rounded-2xl">
      <ReactFlow fitView fitViewOptions={{ padding: 0.25 }} nodes={flowNodes} edges={flowEdges} nodesDraggable={false} nodesConnectable={false} elementsSelectable={false} proOptions={{ hideAttribution: true }}>
        <Background color="rgba(148,163,184,0.1)" gap={22} />
        <Controls className="!border-white/10 !bg-slate-900/80 !shadow-lg [&_button]:!border-white/10 [&_button]:!bg-slate-800/90" />
      </ReactFlow>
    </div>
  );
}

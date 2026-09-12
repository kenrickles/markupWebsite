"use client";
import { useState } from "react";
import type { DiagramEdge, DiagramNode } from "@/lib/caseStudies";
export default function ArchitectureDiagram({
  title,
  nodes,
  edges,
}: {
  title: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}) {
  const [activeId, setActiveId] = useState(nodes[0]?.id ?? "");
  const active = nodes.find((n) => n.id === activeId);
  const connected = edges
    .filter((e) => e.from === activeId)
    .map((e) => nodes.find((n) => n.id === e.to)?.label)
    .filter(Boolean);
  return (
    <section className="glass-card p-6 sm:p-8" aria-label={title}>
      <p className="eyebrow">Architecture</p>
      <h3 className="text-2xl mb-6">{title}</h3>
      <p className="text-sm text-[color:var(--muted)] mb-5">
        Select a component to explore its role and connections.
      </p>
      <svg
        className="architecture-map"
        viewBox="0 0 600 290"
        role="img"
        aria-label={`${title}: component connections, numbered to match the controls below`}
      >
        <defs>
          <marker
            id="edge-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0 0L10 5L0 10z" fill="currentColor" />
          </marker>
        </defs>
        {edges.map((edge) => {
          const from = nodes.find((n) => n.id === edge.from);
          const to = nodes.find((n) => n.id === edge.to);
          if (!from || !to) return null;
          const x1 = 65 + from.x * 4.7,
            y1 = 30 + from.y * 2.6,
            x2 = 65 + to.x * 4.7,
            y2 = 30 + to.y * 2.6;
          const d = Math.hypot(x2 - x1, y2 - y1);
          return (
            <line
              key={`${edge.from}-${edge.to}`}
              x1={x1 + ((x2 - x1) * 22) / d}
              y1={y1 + ((y2 - y1) * 22) / d}
              x2={x2 - ((x2 - x1) * 25) / d}
              y2={y2 - ((y2 - y1) * 25) / d}
              stroke={
                edge.from === activeId || edge.to === activeId
                  ? "var(--accent)"
                  : "#3a4654"
              }
              strokeWidth="1.5"
              markerEnd="url(#edge-arrow)"
            />
          );
        })}
        {nodes.map((node, i) => (
          <g
            key={node.id}
            transform={`translate(${65 + node.x * 4.7},${30 + node.y * 2.6})`}
          >
            <circle
              r="21"
              fill={node.id === activeId ? "var(--accent)" : "var(--surface-2)"}
              stroke="#b3772a"
            />
            <text
              y="6"
              textAnchor="middle"
              fill={node.id === activeId ? "var(--bg)" : "var(--fg)"}
              fontSize="16"
            >
              {i + 1}
            </text>
          </g>
        ))}
      </svg>
      <div className="diagram-buttons">
        {nodes.map((node, i) => (
          <button
            key={node.id}
            type="button"
            aria-pressed={node.id === activeId}
            aria-controls="architecture-detail"
            onClick={() => setActiveId(node.id)}
          >
            <span aria-hidden="true">{i + 1}. </span>
            {node.label}
          </button>
        ))}
      </div>
      <div
        className="diagram-detail"
        id="architecture-detail"
        aria-live="polite"
      >
        <h4>{active?.label}</h4>
        <p>{active?.detail}</p>
        {connected.length > 0 && (
          <p className="mt-4 text-sm">Connects to: {connected.join(", ")}</p>
        )}
      </div>
    </section>
  );
}

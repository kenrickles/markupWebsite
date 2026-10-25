"use client";
import { useState } from "react";
import { ArrowUpRight, Check, Circle, ListTodo } from "lucide-react";
import Link from "next/link";
import { roadmap, type RoadmapStatus } from "@/lib/roadmap";
import AppWindow from "./AppWindow";
const statuses: ("All" | RoadmapStatus)[] = [
  "All",
  "Planned",
  "In Progress",
  "Completed",
];
export default function RoadmapApp(props: {
  visible: boolean;
  front: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
}) {
  const [filter, setFilter] = useState("All");
  const done = roadmap.filter((g) => g.status === "Completed").length;
  const goals = roadmap.filter((g) => filter === "All" || g.status === filter);
  return (
    <AppWindow app="reminders" {...props}>
      <div className="roadmap-layout">
        <aside className="roadmap-sidebar">
          <ListTodo size={30} />
          <h2>My Roadmap</h2>
          <p>Things I’m working toward.</p>
          <nav aria-label="Roadmap status">
            {statuses.map((status) => (
              <button
                key={status}
                aria-pressed={filter === status}
                onClick={() => setFilter(status)}
              >
                <span>{status}</span>
                <small>
                  {status === "All"
                    ? roadmap.length
                    : roadmap.filter((g) => g.status === status).length}
                </small>
              </button>
            ))}
          </nav>
        </aside>
        <div className="roadmap-content">
          <header>
            <span className="profile-kicker">AN EVOLVING DIRECTION</span>
            <h1>My Roadmap</h1>
            <p>
              {done}/{roadmap.length} completed
            </p>
            <progress
              value={done}
              max={roadmap.length}
              aria-label="Roadmap completion"
            />
          </header>
          {goals.length ? (
            <ul className="roadmap-goals">
              {goals.map((goal) => (
                <li key={goal.id}>
                  <span
                    className={`goal-marker goal-${goal.status.toLowerCase().replace(" ", "-")}`}
                    aria-label={goal.status}
                  >
                    {goal.status === "Completed" ? (
                      <Check size={17} />
                    ) : (
                      <Circle size={21} />
                    )}
                  </span>
                  <div>
                    <h2>{goal.title}</h2>
                    <p>{goal.description}</p>
                    <div className="goal-meta">
                      <span>{goal.category}</span>
                      <span>{goal.status}</span>
                    </div>
                    {goal.href && (
                      <Link href={goal.href}>
                        {goal.linkLabel ?? "See related work"}{" "}
                        <ArrowUpRight size={13} />
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="app-empty compact-empty">
              <Circle size={30} />
              <h2>
                {filter === "Completed"
                  ? "A place for milestones."
                  : "Nothing here yet."}
              </h2>
              <p>
                {filter === "Completed"
                  ? "Completed goals will appear here, with the work behind them."
                  : "Goals will appear here as their status changes."}
              </p>
            </div>
          )}
        </div>
      </div>
    </AppWindow>
  );
}

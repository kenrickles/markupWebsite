export type RoadmapStatus = "Planned" | "In Progress" | "Completed";
export type RoadmapGoal = {
  id: string;
  title: string;
  category: string;
  status: RoadmapStatus;
  description: string;
  href?: string;
  linkLabel?: string;
};
/** Edit these public aspirations here. Add an article or project link when a milestone is achieved. */
export const roadmap: RoadmapGoal[] = [
  {
    id: "renaissance",
    title: "Become a Renaissance developer",
    category: "Long-term",
    status: "Planned",
    description:
      "An ongoing direction: deepen my engineering craft while learning from other disciplines.",
  },
  {
    id: "essay",
    title: "Publish my first technical essay",
    category: "Writing",
    status: "Planned",
    description:
      "Turn a practical engineering lesson into something useful to someone else.",
  },
  {
    id: "tools",
    title: "Build and open-source useful developer tools",
    category: "Projects",
    status: "Planned",
    description:
      "Make something that helps engineers with a real problem, and share the source.",
  },
  {
    id: "protocols",
    title: "Develop deeper expertise in blockchain protocols",
    category: "Learning",
    status: "Planned",
    description:
      "Build a stronger understanding of the systems behind digital assets.",
  },
  {
    id: "community",
    title: "Share what I learn with other engineers",
    category: "Community",
    status: "Planned",
    description:
      "Pay it forward through useful writing, conversations and shared work.",
  },
];

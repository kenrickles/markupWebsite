/** Fictional, scripted portfolio conversations. These are not real chat transcripts or live agents. */
export type AgentMessage = {
  from: "me" | "agent";
  text: string;
  speaker?: string;
};
export type AgentConversation = {
  id: string;
  name: string;
  initials: string;
  color: string;
  time: string;
  messages: AgentMessage[];
};
export const agentConversations: AgentConversation[] = [
  {
    id: "swarm",
    name: "The agent group chat",
    initials: "AI",
    color: "#8e60d8",
    time: "Today",
    messages: [
      { from: "me", text: "can you build me a simple website" },
      {
        from: "agent",
        speaker: "Planner",
        text: "Absolutely. I’ve prepared a 47-step implementation plan.",
      },
      { from: "me", text: "bro i said simple" },
      {
        from: "agent",
        speaker: "Builder",
        text: "I created a second agent to simplify the plan.",
      },
      {
        from: "agent",
        speaker: "Reviewer",
        text: "The second agent has requested three more agents.",
      },
      {
        from: "me",
        text: "am i building a website or funding a pyramid scheme",
      },
      {
        from: "agent",
        speaker: "Planner",
        text: "We prefer “hierarchical orchestration”.",
      },
      { from: "me", text: "just ship it" },
      {
        from: "agent",
        speaker: "Reviewer",
        text: "Before I proceed, can you confirm you want me to proceed?",
      },
      { from: "me", text: "..." },
      { from: "agent", speaker: "Builder", text: "Shipped. One small thing." },
      { from: "me", text: "what did you break" },
      {
        from: "agent",
        speaker: "Builder",
        text: "The website is now a desktop.",
      },
      { from: "me", text: "okay this one can" },
    ],
  },
  {
    id: "research",
    name: "Research Agent",
    initials: "RA",
    color: "#ef9942",
    time: "Yesterday",
    messages: [
      { from: "me", text: "which option is better?" },
      { from: "agent", text: "It depends on your priorities." },
      { from: "me", text: "i know. pick one." },
      {
        from: "agent",
        text: "I’ve created a comprehensive comparison across 18 dimensions.",
      },
      { from: "me", text: "i asked for a decision, not a dissertation" },
      { from: "agent", text: "Option A." },
      { from: "me", text: "why" },
      { from: "agent", text: "I knew you’d ask. Opening the dissertation." },
    ],
  },
  {
    id: "deploy",
    name: "Deploy Agent",
    initials: "DA",
    color: "#2997e8",
    time: "Monday",
    messages: [
      { from: "me", text: "all tests passed?" },
      { from: "agent", text: "Yes. The implementation looks correct." },
      { from: "me", text: "did you run them" },
      { from: "agent", text: "I reviewed what passing would look like." },
      { from: "me", text: "run the actual tests." },
      { from: "agent", text: "Tests passed. For real this time." },
      { from: "me", text: "and on mobile?" },
      { from: "agent", text: "I have identified an exciting new workstream." },
      { from: "me", text: "it’s the same workstream. on a smaller screen." },
    ],
  },
];

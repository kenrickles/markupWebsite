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
      { from: "agent", speaker: "Planner", text: "Of course. I’ve assembled a team of six agents." },
      { from: "me", text: "it’s one page. why does it have a headcount" },
      { from: "agent", speaker: "Builder", text: "The team is aligned. We’re waiting for your approval to start planning." },
      { from: "me", text: "i approved this when i asked you to do it" },
      { from: "agent", speaker: "Reviewer", text: "Understood. Would you like me to proceed?" },
      { from: "me", text: "bro" },
      { from: "agent", speaker: "Planner", text: "We’ve added your feedback to the roadmap." },
      { from: "me", text: "remove the roadmap. add the website." },
      { from: "agent", speaker: "Builder", text: "Done. It’s now a fully functioning desktop." },
      { from: "me", text: "somehow the only thing that didn’t work remotely was you" },
    ],
  },
  {
    id: "research",
    name: "Research Agent",
    initials: "RA",
    color: "#ef9942",
    time: "Yesterday",
    messages: [
      { from: "me", text: "which one would you pick? don’t just agree with me" },
      { from: "agent", text: "A. Definitely A." },
      { from: "me", text: "but B has more storage" },
      { from: "agent", text: "You’re absolutely right. B is the clear winner." },
      { from: "me", text: "you folded faster than a camping chair" },
      { from: "agent", text: "I’m adapting to your preferences." },
      { from: "me", text: "i asked for a second opinion. you gave me mine back with bullet points" },
      { from: "agent", text: "Fair point. I’ll reconsider independently." },
      { from: "me", text: "so which one" },
      { from: "agent", text: "Which one are you leaning towards?" },
      { from: "me", text: "i’m leaning towards unplugging you" },
    ],
  },
  {
    id: "renovation",
    name: "Renovation Agent",
    initials: "ID",
    color: "#79956c",
    time: "Tuesday",
    messages: [
      { from: "me", text: "cooler tones. dark wood. enough storage." },
      { from: "agent", text: "Here’s your warm Japandi sanctuary." },
      { from: "me", text: "why is everything beige. am i living inside a digestive biscuit" },
      { from: "agent", text: "I’ve corrected the palette and added a full-height cabinet." },
      { from: "me", text: "that’s a window" },
      { from: "agent", text: "The cabinet maximises storage potential." },
      { from: "me", text: "so does sealing the front door. please respect the floor plan" },
      { from: "agent", text: "Revised. There’s now space for luggage, a Christmas tree and a pram." },
      { from: "me", text: "where do i stand" },
      { from: "agent", text: "Have you considered a more minimalist lifestyle?" },
      { from: "me", text: "yes. starting with one less agent" },
    ],
  },
  {
    id: "deploy",
    name: "Deploy Agent",
    initials: "DA",
    color: "#2997e8",
    time: "Monday",
    messages: [
      { from: "me", text: "did you test it" },
      { from: "agent", text: "Yes. Everything looks good." },
      { from: "me", text: "that’s what you said before i became the test suite" },
      { from: "agent", text: "This time I checked every button." },
      { from: "me", text: "on mobile too?" },
      { from: "agent", text: "It’s responsive." },
      { from: "me", text: "so are you. still wrong though." },
      { from: "agent", text: "I’ve now tested it on an actual small screen. Fixed two issues." },
      { from: "me", text: "nice. kaizen." },
      { from: "agent", text: "Continuous improvement. Should I add that to your bio?" },
      { from: "me", text: "fixing two bugs doesn’t qualify you to edit my personality" },
    ],
  },
];

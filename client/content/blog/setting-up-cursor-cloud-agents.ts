import type { BlogPost } from "./types";

export const settingUpCursorCloudAgents: BlogPost = {
  slug: "setting-up-cursor-cloud-agents",
  title: "How to Set Up Cursor Cloud Agents for Real Projects",
  description:
    "A practical guide to configuring your first agent-driven cloud development environment.",
  series: {
    name: "Inside the Lab",
    episodeLabel: "Episode 001",
  },
  duration: "10–12 minutes",
  format: "Screen recording + voiceover",
  level: "Beginner-friendly",
  context:
    "I'm setting this up for a real website project I'm working on. We'll use it in future videos to explore how cloud agents handle actual development tasks.",
  objectives: [
    "Connect a GitHub repository to Cursor Cloud Agents.",
    "Use agent-driven setup to prepare a development environment.",
    "Configure dependencies and environment requirements.",
    "Understand the purpose of environment Builds.",
    "Provide project instructions through AGENTS.md.",
    "Launch a simple agent task and verify that the environment works.",
  ],
  objectiveCloser:
    "The objective is a working, reusable cloud-agent environment, not a finished application.",
  chapters: [
    {
      time: "0:00",
      title: "Hook: Why cloud agents?",
      body: "Show how an agent can work on a repository independently of your local machine. Preview the configured environment.",
    },
    {
      time: "0:45",
      title: "What we're setting up",
      body: "Explain Cloud Agents, remote execution, repository access, and why environment configuration matters.",
    },
    {
      time: "2:00",
      title: "Connect the first project",
      body: "Introduce the repository as a real website project we're working on, without discussing the client's business or redesign requirements.",
    },
    {
      time: "3:15",
      title: "Agent-driven setup",
      body: "Walk through the guided environment configuration, dependency installation, and setup validation.",
    },
    {
      time: "6:00",
      title: "Project instructions and environment Builds",
      body: "Explain AGENTS.md, the saved environment, and how the configuration can support future agent tasks.",
    },
    {
      time: "8:00",
      title: "Test the setup",
      body: "Give the agent a small, non-invasive task: inspect the repository, run available checks, and report whether it's ready for development.",
    },
    {
      time: "10:00",
      title: "What comes next",
      body: "Summarize what worked, what needed adjustment, and how we'll use this environment to build a real project.",
    },
  ],
  prompt: {
    kicker: "First cloud agent prompt",
    title:
      "Rather than asking the agent to implement a feature, we'll use it to verify the environment.",
    body: `Review this repository and verify that the cloud development environment is ready for development.

Identify the framework, package manager, and available scripts. Install dependencies if necessary, run the relevant validation commands, and report any configuration issues.

Do not modify application code or implement new features.

Summarize what you verified, what failed, and any recommended improvements.`,
    note: "This makes the demonstration useful even if the agent doesn't produce a pull request. We're validating the environment, which is precisely what the video promises.",
  },
  later: {
    episodeLabel: "Episode 01",
    futureLabel: "Future episodes",
    rows: [
      { now: "Cloud Agent setup", later: "Website redesign" },
      { now: "Repository connection", later: "Client discovery" },
      { now: "Dependency configuration", later: "Product requirements" },
      { now: "Environment validation", later: "UI implementation" },
      { now: "Agent instructions", later: "Feature development" },
      { now: "Successful first agent run", later: "Code review and delivery" },
    ],
  },
};

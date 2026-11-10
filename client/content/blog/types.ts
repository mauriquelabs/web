export type BlogChapter = {
  time: string;
  title: string;
  body: string;
};

export type BlogPrompt = {
  kicker: string;
  title: string;
  body: string;
  note: string;
};

export type BlogLater = {
  episodeLabel: string;
  futureLabel: string;
  rows: { now: string; later: string }[];
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  series: { name: string; episodeLabel: string };
  duration: string;
  format: string;
  level: string;
  context: string;
  objectives: string[];
  objectiveCloser: string;
  chapters: BlogChapter[];
  prompt: BlogPrompt;
  later: BlogLater;
  videoUrl?: string;
};

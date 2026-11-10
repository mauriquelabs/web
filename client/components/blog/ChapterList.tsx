import type { BlogChapter } from "@/content/blog/types";

interface ChapterListProps {
  chapters: BlogChapter[];
}

export default function ChapterList({ chapters }: ChapterListProps) {
  return (
    <ol className="space-y-8">
      {chapters.map((chapter) => (
        <li
          key={`${chapter.time}-${chapter.title}`}
          className="grid grid-cols-[4.5rem_1fr] gap-4 sm:gap-8"
        >
          <time className="pt-1 text-sm font-semibold tabular-nums text-accent2">
            {chapter.time}
          </time>
          <div>
            <h3 className="mb-2 text-xl">{chapter.title}</h3>
            <p className="leading-relaxed text-foreground/70">{chapter.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

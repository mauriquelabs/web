interface PostMetaProps {
  duration: string;
  format: string;
  level: string;
}

export default function PostMeta({ duration, format, level }: PostMetaProps) {
  const items = [duration, format, level];

  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-foreground/70">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

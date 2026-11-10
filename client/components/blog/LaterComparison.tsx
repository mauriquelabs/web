import type { BlogLater } from "@/content/blog/types";

interface LaterComparisonProps {
  later: BlogLater;
}

export default function LaterComparison({ later }: LaterComparisonProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border">
            <th scope="col" className="py-3 pr-8 text-sm font-semibold">
              {later.episodeLabel}
            </th>
            <th scope="col" className="py-3 text-sm font-semibold">
              {later.futureLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {later.rows.map((row) => (
            <tr key={row.now} className="border-b border-border last:border-0">
              <td className="py-4 pr-8 text-foreground">{row.now}</td>
              <td className="py-4 text-foreground/70">{row.later}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

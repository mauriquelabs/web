import { cn } from "@/lib/utils";
import { JournalPillar, PILLAR_LABELS } from "@/lib/journal";

export type PillarFilterValue = "all" | JournalPillar;

const FILTERS: { value: PillarFilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "exploration", label: PILLAR_LABELS.exploration },
  { value: "building", label: PILLAR_LABELS.building },
  { value: "community", label: PILLAR_LABELS.community },
  { value: "lab", label: PILLAR_LABELS.lab },
];

interface PillarFilterProps {
  value: PillarFilterValue;
  onChange: (value: PillarFilterValue) => void;
}

export function PillarFilter({ value, onChange }: PillarFilterProps) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="tablist"
      aria-label="Filter journal by pillar"
    >
      {FILTERS.map((filter) => {
        const active = value === filter.value;
        return (
          <button
            key={filter.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(filter.value)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-btn border transition-colors duration-200",
              active
                ? "border-secondary bg-secondary/15 text-foreground"
                : "border-border text-foreground/60 hover:text-foreground hover:border-foreground/30",
            )}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";
import { PERIODS, PeriodId, getWeekLabel } from "@/lib/weekly-data";

interface TimeFilterProps {
  selected: PeriodId;
  onChange: (period: PeriodId) => void;
}

export function TimeFilter({ selected, onChange }: TimeFilterProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {PERIODS.map((p) => (
        <button
          key={p.id}
          onClick={() => onChange(p.id)}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200",
            selected === p.id
              ? "border-zinc-600 bg-zinc-800 text-zinc-100"
              : "border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
          )}
        >
          {p.label}
          {p.id !== "month" && (
            <span className="ml-1 text-[10px] text-zinc-600">{getWeekLabel(p.id)}</span>
          )}
        </button>
      ))}
    </div>
  );
}

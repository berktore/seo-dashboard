import { cn } from "@/lib/utils";
import { useState } from "react";

interface TabsProps {
  tabs: { label: string; value: string }[];
  active: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex gap-1 bg-zinc-800/50 rounded-lg p-1", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
            active === tab.value
              ? "bg-zinc-700 text-zinc-100 shadow-sm"
              : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function useTabs(defaultValue: string) {
  const [active, setActive] = useState(defaultValue);
  return { active, setActive };
}

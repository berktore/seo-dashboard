"use client";

import { useState, useEffect } from "react";
import { Settings2, GripVertical, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WidgetDef {
  id: string;
  label: string;
  defaultVisible: boolean;
}

export const WIDGETS: WidgetDef[] = [
  { id: "kpi", label: "KPI Kartları", defaultVisible: true },
  { id: "chart", label: "Trafik Grafikleri", defaultVisible: true },
  { id: "distribution", label: "Pozisyon Dağılımı", defaultVisible: true },
  { id: "quick", label: "Hızlı Karşılaştırma", defaultVisible: true },
  { id: "sov", label: "Pazar Payı", defaultVisible: true },
  { id: "goal", label: "Hedef Takibi", defaultVisible: true },
  { id: "anomaly", label: "Anomali Tespiti", defaultVisible: true },
  { id: "gaps", label: "Kelime Boşluğu", defaultVisible: true },
  { id: "ai", label: "AI Analizi", defaultVisible: true },
  { id: "competitors", label: "Rakip Görünümü", defaultVisible: true },
];

const STORAGE_KEY = "infoyatirim-widgets";

export function DashboardCustomizer({ visibility, onChange }: { visibility: Record<string, boolean>; onChange: (v: Record<string, boolean>) => void }) {
  const [open, setOpen] = useState(false);

  const toggleWidget = (id: string) => {
    onChange({ ...visibility, [id]: !visibility[id] });
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-800 text-zinc-500 hover:text-zinc-300 bg-zinc-900/60 transition-all">
        <Settings2 size={14} />
        Widget'lar
        <span className="text-[10px] text-zinc-600 ml-1">{Object.values(visibility).filter(Boolean).length}/{WIDGETS.length}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 w-64 rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl p-3">
            <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Gösterilecek Bileşenler</div>
            <div className="space-y-1">
              {WIDGETS.map(w => (
                <button key={w.id} onClick={() => toggleWidget(w.id)}
                  className={cn(
                    "flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-xs transition-all",
                    visibility[w.id] ? "text-zinc-200 hover:bg-zinc-800" : "text-zinc-600 hover:bg-zinc-800/50",
                  )}
                >
                  <div className={cn("p-0.5 rounded", visibility[w.id] ? "text-emerald-400" : "text-zinc-700")}>
                    {visibility[w.id] ? <Eye size={12} /> : <EyeOff size={12} />}
                  </div>
                  <span>{w.label}</span>
                  <span className={cn("ml-auto text-[10px]", visibility[w.id] ? "text-emerald-500" : "text-zinc-700")}>
                    {visibility[w.id] ? "Açık" : "Kapalı"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

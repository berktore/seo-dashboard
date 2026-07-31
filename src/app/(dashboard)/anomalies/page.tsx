"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { detectAnomalies } from "@/lib/anomalies";
import { CheckCircle2 } from "lucide-react";

export default function AnomaliesPage() {
  const [anomalies, setAnomalies] = useState<any[]>([]);

  useEffect(() => {
    setAnomalies(detectAnomalies());
  }, []);

  return (
    <div className="space-y-4">
      {[
        { severity: "kritik", label: "Kritik", color: "#ef4444", border: "border-red-500/20" },
        { severity: "orta", label: "Orta", color: "#f59e0b", border: "border-amber-500/20" },
        { severity: "düşük", label: "Düşük", color: "#3b82f6", border: "border-blue-500/20" },
      ].map(grp => {
        const items = anomalies.filter(a => a.severity === grp.severity);
        if (!items.length) return null;
        return (
          <div key={grp.severity} className={cn("rounded-xl border p-4", grp.border, "bg-zinc-900/60 backdrop-blur-sm")}>
            <div className="text-xs font-semibold mb-2" style={{ color: grp.color }}>{grp.label} ({items.length})</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {items.map((a, i) => (
                <div key={i} className="bg-zinc-800/40 rounded-lg p-3 border border-zinc-800/60">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs font-semibold text-zinc-200">{a.siteName}</span>
                    <span className="text-[10px] text-zinc-600">{a.title}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">{a.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      {anomalies.length === 0 && (
        <div className="text-center py-12 text-sm text-zinc-600">
          <CheckCircle2 size={32} className="mx-auto mb-2 text-emerald-500" />
          Anomali tespit edilmedi. Tüm veriler düzenli görünüyor.
        </div>
      )}
    </div>
  );
}

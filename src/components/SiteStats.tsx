"use client";

import { useMemo } from "react";
import { SITES } from "@/lib/data";
import { formatCompact } from "@/lib/utils";
import { usePeriod } from "@/lib/period";
import { getPeriodData } from "@/lib/weekly-data";
import { Users, Search, Link2, Globe, MousePointerClick } from "lucide-react";

const info = SITES[0];

export function SiteStats() {
  const { period } = usePeriod();
  const isWeekly = period !== "month";
  const wd = getPeriodData("info", period);

  const stats = useMemo(() => {
    const organic = isWeekly ? (wd?.organic || info.visits) : info.visits;
    const paid = isWeekly ? (wd?.paid || 0) : Math.round(info.visits * 0.02);
    const direct = Math.max(0, (isWeekly ? (wd?.visits || 0) : info.visits) - organic - paid);
    return [
      { label: "Toplam Ziyaret", value: formatCompact(isWeekly ? (wd?.visits || 0) : info.visits), sub: isWeekly ? `Haftalık · ${period.toUpperCase()}` : "Aylık · Haziran 2026", icon: Users, color: "#3b82f6" },
      { label: "Organik", value: formatCompact(organic), sub: `${direct > 0 ? "Direkt +" : ""} %${organic > 0 ? Math.round((organic / (isWeekly ? (wd?.visits || 1) : info.visits)) * 100) : 0} pay`, icon: Search, color: "#22c55e" },
      { label: "Backlink", value: formatCompact(isWeekly ? (wd?.backlinks || 0) : info.totalBacklinks), sub: `${isWeekly ? (wd?.refDomains || 0) : info.refDomains} referans domain`, icon: Link2, color: "#f59e0b" },
      { label: "Hemen Çıkma", value: `%${info.bounceRate}`, sub: "Ortalama oturum süresi", icon: MousePointerClick, color: "#ef4444" },
    ];
  }, [period, isWeekly, wd]);

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <div key={i} className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 rounded-md" style={{ background: `${s.color}15` }}>
                <Icon size={14} style={{ color: s.color }} />
              </div>
              <span className="text-[9px] text-zinc-600 uppercase tracking-wider">{s.label}</span>
            </div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-[10px] text-zinc-600 mt-0.5">{s.sub}</div>
          </div>
        );
      })}
    </div>
  );
}

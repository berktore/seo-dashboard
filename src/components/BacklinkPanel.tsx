"use client";

import { useMemo } from "react";
import { getBacklinkProfile } from "@/lib/insights";
import { formatCompact, cn } from "@/lib/utils";
import { Link2, ArrowUpRight, ArrowDownRight, Globe } from "lucide-react";

export function BacklinkPanel() {
  const profile = useMemo(() => getBacklinkProfile("info"), []);

  return (
    <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Link2 size={14} className="text-amber-400" />
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Backlink Profili · infoyatirim.com</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-emerald-400 flex items-center gap-1"><ArrowUpRight size={10} /> +{profile.newLinks} yeni</span>
          <span className="text-[10px] text-red-400 flex items-center gap-1"><ArrowDownRight size={10} /> -{profile.lostLinks} kayıp</span>
        </div>
      </div>

      <div className="space-y-1.5 mb-4">
        {profile.refs.map((r, i) => (
          <div key={i} className="flex items-center justify-between py-1 border-b border-zinc-800/30 last:border-0">
            <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
              <Globe size={10} className="text-zinc-600 shrink-0" />
              <span className="text-xs text-zinc-200 truncate">{r.domain}</span>
              <span className="text-[9px] px-1 py-0.5 rounded bg-zinc-800 text-zinc-500 shrink-0">AS {r.authority}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-medium text-zinc-300">{r.links} link</span>
              <span className={cn("text-[10px] font-semibold w-8 text-right", r.trend >= 0 ? "text-emerald-400" : "text-red-400")}>
                {r.trend >= 0 ? "+" : ""}{r.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider mb-2">Anchor Metin Dağılımı</div>
        <div className="space-y-1.5">
          {profile.anchorBreakdown.map((a, i) => (
            <div key={i}>
              <div className="flex items-center justify-between text-[10px] mb-0.5">
                <span className="text-zinc-500">{a.label}</span>
                <span className="text-zinc-400 font-medium">%{a.pct}</span>
              </div>
              <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-amber-500/70" style={{ width: `${a.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-zinc-800/60 text-[10px] text-zinc-600">
        En güçlü referans domainlerin ortalama otoritesi: <span className="text-zinc-400 font-medium">AS {profile.domainAS}</span> · Markalı anchor oranı sağlıklı seviyede.
      </div>
    </div>
  );
}

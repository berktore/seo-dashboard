"use client";

import { SITES } from "@/lib/data";
import { formatCompact } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const info = SITES[0];
const competitors = SITES.slice(1);

export default function SitesPage() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
      {competitors.map(s => (
        <div key={s.id} className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
              <span className="text-sm font-semibold text-zinc-100">{s.name}</span>
              <Badge variant="default">{s.id.toUpperCase()}</Badge>
            </div>
            <span className="text-lg font-bold" style={{ color: s.color }}>{s.visitsDisplay}</span>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-3">
            {[
              { label: "AS", val: s.authorityScore, color: "#a855f7" },
              { label: "Hemen Çıkma", val: `%${s.bounceRate}`, color: s.bounceRate >= 70 ? "#ef4444" : "#22c55e" },
              { label: "Süre", val: s.avgDuration, color: "#3b82f6" },
              { label: "Backlink", val: formatCompact(s.totalBacklinks), color: "#f59e0b" },
            ].map((m, i) => (
              <div key={i} className="bg-zinc-800/30 rounded-lg p-2 text-center">
                <div className="text-[10px] text-zinc-600">{m.label}</div>
                <div className="text-xs font-bold" style={{ color: m.color }}>{m.val}</div>
              </div>
            ))}
          </div>
          <div className="text-[10px] text-zinc-600 mb-2">En çok kazandıran sayfalar</div>
          {s.pageDetails.slice(0, 3).map((p, i) => (
            <div key={i} className="flex items-center justify-between py-1 text-xs border-b border-zinc-800/30 last:border-0">
              <span className="font-mono text-zinc-400 truncate mr-2">{p.path}</span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-zinc-500">{formatCompact(p.traffic)}</span>
                <span className="text-emerald-400 text-[10px]">{p.share}</span>
              </div>
            </div>
          ))}
        </div>
      ))}
      <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-5">
        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">{info.name} · Karşılaştırma Özeti</div>
        <div className="text-[11px] text-zinc-500 leading-relaxed mb-4">
          {info.name} diğer {competitors.length} site ile karşılaştırıldığında <span className="text-emerald-400">{competitors.filter(s => info.authorityScore >= s.authorityScore).length} siteden</span> daha yüksek otoriteye sahip.
          {info.refDomains > 0 && <> Referans domain sayısı (<span className="text-amber-400">{formatCompact(info.refDomains)}</span>) ölçeklendirme için kritik.</>}
        </div>
        <div className="space-y-2">
          {[
            { label: "Ortalama rakip ziyareti", val: formatCompact(competitors.reduce((a, s) => a + s.visits, 0) / competitors.length) },
            { label: "Rakip backlink ortalaması", val: formatCompact(competitors.reduce((a, s) => a + s.totalBacklinks, 0) / competitors.length) },
            { label: "Rakip organik büyüme ort.", val: `${competitors.reduce((a, s) => a + s.organicChange, 0) / competitors.length > 0 ? "+" : ""}${(competitors.reduce((a, s) => a + s.organicChange, 0) / competitors.length).toFixed(1)}%` },
          ].map((r, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-zinc-800/40 last:border-0">
              <span className="text-[11px] text-zinc-500">{r.label}</span>
              <span className="text-xs font-semibold text-zinc-200">{r.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

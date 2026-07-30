"use client";

import { useState } from "react";
import { SITES } from "@/lib/data";
import { getPositionColor, getPositionBg, cn, formatNumber } from "@/lib/utils";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { Search, TrendingUp, TrendingDown, Minus } from "lucide-react";

const positionColors = ["", "text-emerald-400", "text-blue-400", "text-purple-400"];

export default function KeywordsPage() {
  const [selectedSite, setSelectedSite] = useState(SITES[0].id);
  const site = SITES.find(s => s.id === selectedSite) || SITES[0];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-1">
        <div className="p-2 rounded-lg bg-purple-500/10">
          <Search size={20} className="text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Anahtar Kelimeler</h1>
          <p className="text-sm text-zinc-500">Organik sıralama ve kelime performansı</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {SITES.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedSite(s.id)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200",
              selectedSite === s.id
                ? "border-zinc-600 bg-zinc-800 text-zinc-100"
                : "border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
            )}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: s.color }} />
            {s.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardTitle>İlk 5 Organik Kelime &mdash; {site.name}</CardTitle>
          <div className="mt-4 overflow-hidden rounded-lg border border-zinc-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-800/50">
                  <th className="text-left px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase">#</th>
                  <th className="text-left px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase">Anahtar Kelime</th>
                  <th className="text-center px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase">Konum</th>
                  <th className="text-right px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase">Aylık Hacim</th>
                  <th className="text-right px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase">Trafik Payı</th>
                </tr>
              </thead>
              <tbody>
                {site.keywords.map((kw) => (
                  <tr key={kw.rank} className="border-t border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                    <td className="px-3 py-2.5 text-zinc-500 text-xs">{kw.rank}</td>
                    <td className="px-3 py-2.5">
                      <span className="text-zinc-200 font-medium text-sm">{kw.keyword}</span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={cn("inline-flex items-center justify-center w-8 h-6 rounded-md text-xs font-bold border", getPositionBg(kw.position))}>
                        <span className={getPositionColor(kw.position)}>{kw.position}</span>
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right text-zinc-300 text-sm font-medium">
                      {kw.volume >= 1000 ? formatNumber(kw.volume) : kw.volume}
                    </td>
                    <td className="px-3 py-2.5 text-right text-zinc-400 text-xs font-medium">{kw.trafficShare}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardTitle>Konum ve Hacim Dağılımı</CardTitle>
          <div className="mt-4 space-y-5">
            {site.keywords.map((kw) => (
              <div key={kw.rank}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs text-zinc-400 shrink-0">#{kw.rank}</span>
                    <span className="text-sm text-zinc-200 truncate">{kw.keyword}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={cn("text-xs font-bold", getPositionColor(kw.position))}>#{kw.position}</span>
                    <span className="text-xs text-zinc-500">{(kw.volume / 1000).toFixed(kw.volume >= 1000000 ? 1 : 0)}K</span>
                  </div>
                </div>
                <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(5, 100 - (kw.position * 8))}%`,
                      backgroundColor: kw.position <= 3 ? "#22c55e" : kw.position <= 10 ? "#3b82f6" : "#64748b"
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardTitle>Tüm Rakipler &mdash; Anahtar Kelime Karşılaştırması</CardTitle>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-800/50">
                <th className="text-left px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase">Site</th>
                <th className="text-left px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase">Anahtar Kelime</th>
                <th className="text-center px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase">Konum</th>
                <th className="text-right px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase">Hacim</th>
                <th className="text-right px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase">Trafik</th>
              </tr>
            </thead>
            <tbody>
              {SITES.flatMap((s) =>
                s.keywords.map((kw, i) => (
                  <tr key={`${s.id}-${i}`} className="border-t border-zinc-800 hover:bg-zinc-800/20 transition-colors">
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                        <span className="text-xs text-zinc-400">{s.id.toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-zinc-200 font-medium">{kw.keyword}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={cn("inline-flex items-center justify-center w-8 h-6 rounded-md text-xs font-bold border", getPositionBg(kw.position))}>
                        <span className={getPositionColor(kw.position)}>{kw.position}</span>
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right text-zinc-300 text-sm">
                      {kw.volume >= 1000 ? formatNumber(kw.volume) : kw.volume}
                    </td>
                    <td className="px-3 py-2.5 text-right text-zinc-400 text-xs">{kw.trafficShare}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardTitle>İçerik Boşluğu Analizi</CardTitle>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "infoyatirim.com'da Olmayan", keywords: ["altın fiyatı", "ons altın", "çeyrek altın", "tam altın"], color: "text-red-400" },
            { title: "Rakiplerin Sıraladığı", keywords: ["sasa hisse (ilk 3'te 3 site)", "bist 100", "aselsan hisse"], color: "text-amber-400" },
            { title: "Önerilen Strateji", keywords: ["Altın fiyatları sayfası oluştur", "Hisse senedi analiz içeriği", "BIST 100 güncel yorum"], color: "text-emerald-400" },
          ].map((col) => (
            <div key={col.title} className="rounded-lg bg-zinc-800/40 p-3">
              <h4 className={cn("text-xs font-semibold uppercase tracking-wider mb-2", col.color)}>{col.title}</h4>
              <ul className="space-y-1">
                {col.keywords.map((kw) => (
                  <li key={kw} className="text-xs text-zinc-400 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-zinc-600" />
                    {kw}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

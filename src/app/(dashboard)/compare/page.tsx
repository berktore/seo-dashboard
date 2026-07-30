"use client";

import { useState } from "react";
import { SITES } from "@/lib/data";
import { formatNumber, COLORS, cn, CHANNEL_COLORS, CHANNEL_LABELS } from "@/lib/utils";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell,
} from "recharts";
import { GitCompare, TrendingUp, TrendingDown, Layers, ExternalLink } from "lucide-react";

export default function ComparePage() {
  const [metric, setMetric] = useState("all");

  const metrics = ["Authority Score", "Referans Domain", "Backlink Skoru", "Organik Trafik", "AI Trafik"];

  const radarData = metrics.map((m) => {
    const row: Record<string, string | number> = { metric: m };
    SITES.forEach((s) => {
      const raw = m === "Authority Score" ? s.authorityScore
        : m === "Referans Domain" ? Math.min(s.refDomains / 100, 100)
        : m === "Backlink Skoru" ? Math.min(Math.round(Math.log10(s.totalBacklinks || 1) * 25), 100)
        : m === "Organik Trafik" ? Math.min(Math.round((parseInt(s.organicTraffic) / 2800) * 100), 100)
        : m === "AI Trafik" ? Math.min(s.aiTraffic / 10, 100) : 0;
      row[s.id] = Math.min(raw, 100);
    });
    return row;
  });

  const rows: { label: string; type: "string" | "number" | "pct"; lowerBetter?: boolean; key: keyof typeof SITES[0] }[] = [
    { label: "Ziyaret", key: "visitsDisplay", type: "string" },
    { label: "Global Sıra", key: "globalRank", type: "number", lowerBetter: true },
    { label: "TR Sıra", key: "countryRank", type: "number", lowerBetter: true },
    { label: "Authority Score", key: "authorityScore", type: "number" },
    { label: "Sayfa/Ziyaret", key: "pagesPerVisit", type: "number" },
    { label: "Hemen Çıkma", key: "bounceRate", type: "pct", lowerBetter: true },
    { label: "Organik Trafik", key: "organicTraffic", type: "string" },
    { label: "Paid Trafik", key: "paidTraffic", type: "string" },
    { label: "Referans Domain", key: "refDomains", type: "number" },
    { label: "Backlink", key: "totalBacklinks", type: "number" },
    { label: "AI Trafik", key: "aiTraffic", type: "number" },
  ];

  function getVal(site: typeof SITES[0], key: string) {
    const v = (site as any)[key];
    if (key === "globalRank" || key === "countryRank") return `#${(v as number).toLocaleString()}`;
    if (key === "bounceRate") return `%${v}`;
    if (key === "pagesPerVisit") return (v as number).toFixed(2);
    if (key === "refDomains") return formatNumber(v as number);
    if (key === "totalBacklinks") return formatNumber(v as number);
    if (key === "aiTraffic") return (v as number).toLocaleString();
    return v;
  }

  function getBestIdx(key: string): number {
    if (key === "bounceRate" || key === "globalRank" || key === "countryRank") {
      const vals = SITES.map(s => s[key as keyof typeof SITES[0]] as number);
      return vals.indexOf(Math.min(...vals));
    }
    if (["authorityScore", "pagesPerVisit", "aiTraffic", "refDomains", "totalBacklinks", "visitsDisplay"].includes(key)) {
      if (key === "visitsDisplay") {
        const vals = SITES.map(s => s.visits);
        return vals.indexOf(Math.max(...vals));
      }
      const vals = SITES.map(s => s[key as keyof typeof SITES[0]] as number);
      return vals.indexOf(Math.max(...vals));
    }
    return -1;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-1">
        <div className="p-2 rounded-lg bg-blue-500/10">
          <GitCompare size={20} className="text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Domain Karşılaştırma</h1>
          <p className="text-sm text-zinc-500">4 aracı kurumun kapsamlı SEO karşılaştırması</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardTitle>Çok Boyutlu Performans Karşılaştırması</CardTitle>
          <div className="mt-2">
            <ResponsiveContainer width="100%" height={360}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#27272a" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: "#a1a1aa", fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, color: "#f4f4f5", fontSize: 12 }} />
                <Legend
                  wrapperStyle={{ fontSize: 11, color: "#a1a1aa" }}
                  formatter={(value) => <span style={{ color: "#a1a1aa" }}>{SITES.find(s => s.id === value)?.name}</span>}
                />
                {SITES.map((s) => (
                  <Radar key={s.id} name={s.id} dataKey={s.id} stroke={s.color} fill={s.color} fillOpacity={0.06} strokeWidth={2} />
                ))}
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardTitle>Backlink ve Domain Karşılaştırması</CardTitle>
          <div className="mt-2">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={SITES.map(s => ({ name: s.id.toUpperCase(), backlinks: Math.round(s.totalBacklinks / 1000), fill: s.color }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" tick={{ fill: "#a1a1aa", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} unit="K" />
                <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, color: "#f4f4f5" }}
                  formatter={(value) => [Number(value).toLocaleString() + "K", "Backlink"]}
                />
                <Bar dataKey="backlinks" radius={[6, 6, 0, 0]} maxBarSize={56}>
                  {SITES.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-4 gap-3 mt-3">
            {SITES.map((s) => (
              <div key={s.id} className="text-center rounded-lg bg-zinc-800/40 p-2">
                <div className="text-[10px] font-semibold" style={{ color: s.color }}>{s.id.toUpperCase()}</div>
                <div className="text-xs text-zinc-300 font-medium">{formatNumber(s.refDomains)}</div>
                <div className="text-[9px] text-zinc-600">domain</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Detaylı Metrik Karşılaştırması</CardTitle>
          <Badge variant="info">{rows.length} metrik</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Metrik</th>
                {SITES.map((s) => (
                  <th key={s.id} className="text-right px-3 py-2.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: s.color }}>{s.id}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const bestIdx = getBestIdx(row.key);
                return (
                  <tr key={row.key} className="border-t border-zinc-800 hover:bg-zinc-800/20 transition-colors">
                    <td className="px-3 py-2.5 text-zinc-400 text-xs font-medium">{row.label}</td>
                    {SITES.map((s, i) => (
                      <td key={s.id} className={cn("px-3 py-2.5 text-right text-sm font-medium", i === bestIdx ? "text-emerald-400" : "text-zinc-200")}>
                        {getVal(s, row.key)}
                        {i === bestIdx && <span className="ml-1 text-[10px] text-emerald-500">★</span>}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardTitle>infoyatirim.com &mdash; SWOT Analizi</CardTitle>
          <div className="mt-4 space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Güçlü Yönler</h4>
              <ul className="space-y-1.5">
                {[
                  "Sayfa başı en yüksek etkileşim: 6.98 sayfa/ziyaret",
                  "TR sıralamasında 4 site içinde 2. sırada (#1.981)",
                  "Trafikte son 6 ayda %161 büyüme",
                  "Paid trafik bağımlılığı en düşük seviyede",
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 text-xs text-zinc-300">
                    <span className="text-emerald-500 mt-0.5 shrink-0">▸</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">Gelişim Alanları</h4>
              <ul className="space-y-1.5">
                {[
                  "Authority Score 45 (sektör ortalaması: 52)",
                  "Backlink sayısı 27K — gcmyatirim 974K'nın çok gerisinde",
                  "AI trafik potansiyeli düşük: 223 ziyaret",
                  "Organik trafik aylık %9 daralma",
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 text-xs text-zinc-300">
                    <span className="text-red-500 mt-0.5 shrink-0">▸</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        <Card>
          <CardTitle>Stratejik Öneriler</CardTitle>
          <div className="mt-4 space-y-3">
            {[
              { title: "Backlink Ağını Genişlet", desc: "Finans haber siteleri ve borsa platformlarından kaliteli backlink alın. Hedef: 50K+ backlink.", color: "text-blue-400", icon: Layers },
              { title: "AI Odaklı İçerik Stratejisi", desc: "AI asistanların referans göstereceği, yapılandırılmış veri içeren finans içerikleri üretin.", color: "text-amber-400", icon: TrendingUp },
              { title: "Yüksek Hacimli Kelimelere Yatırım", desc: "Altın fiyatları, hisse analizi gibi yüksek arama hacimli konularda içerik açığını kapatın.", color: "text-purple-400", icon: TrendingUp },
              { title: "Organik Düşüşü Durdur", desc: "%9'luk organik düşüşün kaynağını analiz edin. Eski içerikleri güncelleyin ve teknik SEO denetimi yapın.", color: "text-red-400", icon: TrendingDown },
            ].map(item => (
              <div key={item.title} className="flex gap-3 bg-zinc-800/40 rounded-lg p-3">
                <div className="p-1.5 rounded-md bg-zinc-700/50 shrink-0 self-start">
                  <item.icon size={14} className={item.color} />
                </div>
                <div>
                  <div className={cn("text-xs font-semibold mb-0.5", item.color)}>{item.title}</div>
                  <div className="text-xs text-zinc-400 leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

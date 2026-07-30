"use client";

import { SITES } from "@/lib/data";
import { formatNumber, COLORS, cn } from "@/lib/utils";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
} from "recharts";
import { Link2, TrendingUp, TrendingDown, ExternalLink, Shield } from "lucide-react";

export default function BacklinksPage() {
  const blData = SITES.map((s) => ({
    name: s.id.toUpperCase(), label: s.name,
    backlinks: Math.round(s.totalBacklinks / 1000),
    domains: s.refDomains,
    fill: s.color,
  }));

  const radarMetrics = [
    { metric: "Authority Score", sites: SITES.map(s => ({ id: s.id, val: s.authorityScore, color: s.color })) },
    { metric: "Backlink Kalitesi", sites: SITES.map(s => ({ id: s.id, val: Math.min(Math.round(Math.log10(s.totalBacklinks || 1) * 25), 100), color: s.color })) },
    { metric: "Domain Çeşitliliği", sites: SITES.map(s => ({ id: s.id, val: Math.min(Math.round(s.refDomains / 50), 100), color: s.color })) },
    { metric: "Büyüme Trendi", sites: SITES.map(s => ({ id: s.id, val: Math.max(0, 50 + s.refDomainsChange * 5), color: s.color })) },
    { metric: "Marka Otoritesi", sites: SITES.map(s => ({ id: s.id, val: Math.min(s.countryRank > 5000 ? 30 : s.countryRank > 2000 ? 50 : s.countryRank > 1000 ? 70 : 90, 100), color: s.color })) },
  ];

  const radarData = radarMetrics.map((m) => {
    const row: Record<string, string | number> = { metric: m.metric };
    m.sites.forEach(s => { row[s.id] = s.val; });
    return row;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-1">
        <div className="p-2 rounded-lg bg-emerald-500/10">
          <Link2 size={20} className="text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Backlink Analizi</h1>
          <p className="text-sm text-zinc-500">Otorite ve bağlantı profili karşılaştırması</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {SITES.map((s, i) => (
          <div key={s.id} className="animate-fade-in rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-5" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-sm font-semibold text-zinc-200 truncate">{s.name}</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{formatNumber(s.totalBacklinks)}</div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Toplam Backlink</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-zinc-400">{formatNumber(s.refDomains)} domain</span>
              <span className={cn(
                "text-xs font-medium",
                s.refDomainsChange > 0 ? "text-emerald-400" : s.refDomainsChange < 0 ? "text-red-400" : "text-zinc-400"
              )}>
                {s.refDomainsChange > 0 ? "+" : ""}{s.refDomainsChange}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardTitle>Toplam Backlink Sayıları</CardTitle>
          <div className="mt-2">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={blData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" tick={{ fill: "#a1a1aa", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} unit="K" />
                <Tooltip
                  contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, color: "#f4f4f5" }}
                  formatter={(value) => [Number(value).toLocaleString() + "K", "Backlink"]}
                  labelFormatter={(label) => blData.find(d => d.name === label)?.label || label}
                />
                <Bar dataKey="backlinks" radius={[8, 8, 0, 0]} maxBarSize={64}>
                  {blData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardTitle>Otorite ve Bağlantı Karşılaştırması</CardTitle>
          <div className="mt-2">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#27272a" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: "#a1a1aa", fontSize: 9 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, color: "#f4f4f5" }} />
                <Legend
                  wrapperStyle={{ fontSize: 10, color: "#a1a1aa" }}
                  formatter={(value) => <span style={{ color: "#a1a1aa" }}>{value}</span>}
                />
                {SITES.map((s) => (
                  <Radar key={s.id} name={s.id.toUpperCase()} dataKey={s.id} stroke={s.color} fill={s.color} fillOpacity={0.05} strokeWidth={2} />
                ))}
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <CardTitle>Backlink Profili ve Değişim</CardTitle>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-800/50">
                <th className="text-left px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase">Site</th>
                <th className="text-right px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase">Toplam Backlink</th>
                <th className="text-right px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase">Değişim</th>
                <th className="text-right px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase">Referans Domain</th>
                <th className="text-right px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase">Domain Değişim</th>
                <th className="text-right px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase">Authority Score</th>
                <th className="text-right px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase">Domain/Site</th>
              </tr>
            </thead>
            <tbody>
              {SITES.map((s) => (
                <tr key={s.id} className="border-t border-zinc-800 hover:bg-zinc-800/20 transition-colors">
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-sm text-zinc-200">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-right text-zinc-200 font-medium">{formatNumber(s.totalBacklinks)}</td>
                  <td className="px-3 py-2.5 text-right">
                    <span className={cn("text-xs font-medium", s.backlinksChange > 0 ? "text-emerald-400" : s.backlinksChange < 0 ? "text-red-400" : "text-zinc-400")}>
                      {s.backlinksChange > 0 ? "+" : ""}{s.backlinksChange}%
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right text-zinc-200 font-medium">{formatNumber(s.refDomains)}</td>
                  <td className="px-3 py-2.5 text-right">
                    <span className={cn("text-xs font-medium", s.refDomainsChange > 0 ? "text-emerald-400" : s.refDomainsChange < 0 ? "text-red-400" : "text-zinc-400")}>
                      {s.refDomainsChange > 0 ? "+" : ""}{s.refDomainsChange}%
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <span className="text-sm font-bold text-white">{s.authorityScore}</span>
                    <span className="text-[10px] text-zinc-500 ml-1">/ 100</span>
                  </td>
                  <td className="px-3 py-2.5 text-right text-zinc-300 text-sm">{Math.round(s.totalBacklinks / s.refDomains)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardTitle>Backlink Stratejisi Önerileri</CardTitle>
          <div className="mt-4 space-y-3">
            {[
              { title: "Kaliteli Finans Sitelerinden Backlink", desc: "Bloomberg HT, Ekonomist, Dünya gibi finans haber sitelerinde misafir yazarlık ve röportaj ile backlink kazanın.", color: "text-blue-400" },
              { title: "Rakip Backlink Analizi", desc: "gcmyatirim.com.tr'nin 974K backlinkinin kaynaklarını analiz ederek benzer fırsatları belirleyin.", color: "text-amber-400" },
              { title: "Kaynak Sayfası Oluşturma", desc: "Borsa terimleri sözlüğü, yatırım rehberi gibi referans alınacak içerikler oluşturun.", color: "text-purple-400" },
            ].map(item => (
              <div key={item.title} className="flex gap-3 bg-zinc-800/40 rounded-lg p-3">
                <div className="p-1.5 rounded-md bg-zinc-700/50 shrink-0 self-start">
                  <ExternalLink size={14} className={item.color} />
                </div>
                <div>
                  <div className={cn("text-xs font-semibold mb-0.5", item.color)}>{item.title}</div>
                  <div className="text-xs text-zinc-400 leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardTitle>Otorite Skoru Karşılaştırması</CardTitle>
          <div className="mt-4 space-y-4">
            {SITES.sort((a, b) => b.authorityScore - a.authorityScore).map((s, i) => (
              <div key={s.id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-600 w-4">{i + 1}.</span>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-sm text-zinc-200">{s.name}</span>
                  </div>
                  <span className="text-sm font-bold text-white">{s.authorityScore}</span>
                </div>
                <div className="relative h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(s.authorityScore / 60) * 100}%`, backgroundColor: s.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-zinc-800/40">
            <div className="text-xs text-zinc-400">
              <strong className="text-zinc-200">Sektör ortalaması: 52</strong> &middot; 
              infoyatirim.com 7 puan geride. Hedef: AS 50+
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

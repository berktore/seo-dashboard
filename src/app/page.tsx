"use client";

import { sites, formatNumber } from "@/lib/data";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { TrendingUp, TrendingDown, Globe, Award, MousePointerClick, Bot } from "lucide-react";

const trafficData = sites.map((s) => ({
  name: s.short, fullName: s.name, visits: Math.round(s.visits / 1000), fill: s.color,
}));

const radarMetrics = sites.map((s) => ({
  name: s.short, color: s.color,
  authority: s.authorityScore,
  domains: parseInt(s.refDomains) || 18,
  backlinks: Math.min(Math.round(Math.log10(parseInt(s.backlinks) || 1) * 25), 100),
  organic: Math.min(Math.round((parseInt(s.organicTraffic) / 2800) * 100), 100),
  ai: Math.min(Math.round(s.aiTraffic / 10), 100),
}));

export default function Overview() {
  const info = sites[0];
  const totalVisits = sites.reduce((a, s) => a + s.visits, 0);
  const avgAS = Math.round(sites.reduce((a, s) => a + s.authorityScore, 0) / sites.length);

  const kpis = [
    { label: "Toplam Pazar Trafiği", value: formatNumber(totalVisits), sub: "4 site toplamı", icon: Globe, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Ortalama Authority Score", value: String(avgAS), sub: `Sektör: ${avgAS > 50 ? "Güçlü" : "Gelişmeli"}`, icon: Award, color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "En Düşük Hemen Çıkma", value: "%53.86", sub: "gedik.com", icon: MousePointerClick, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Toplam AI Trafik", value: String(sites.reduce((a, s) => a + s.aiTraffic, 0)), sub: "+%142 büyüme potansiyeli", icon: Bot, color: "text-amber-400", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{kpi.label}</div>
                  <div className="text-2xl font-bold text-white">{kpi.value}</div>
                  <div className="text-xs text-zinc-600 mt-1">{kpi.sub}</div>
                </div>
                <div className={`p-2.5 rounded-lg ${kpi.bg}`}>
                  <Icon size={20} className={kpi.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-5">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Aylık Ziyaret Karşılaştırması</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="name" tick={{ fill: "#a1a1aa", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} unit="K" />
              <Tooltip
                contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, color: "#f4f4f5" }}
                formatter={(value) => [`${value}K ziyaret`, ""]}
                labelFormatter={(label) => trafficData.find((d) => d.name === label)?.fullName || label}
              />
              <Bar dataKey="visits" radius={[6, 6, 0, 0]} maxBarSize={60}>
                {trafficData.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-5">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Rakiplere Göre Konum</h3>
          <div className="space-y-4">
            {sites.map((s, i) => (
              <div key={s.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-sm text-zinc-300">{s.short}</span>
                  </div>
                  <span className="text-xs text-zinc-500">TR #{s.trRank.toLocaleString()}</span>
                </div>
                <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(2, 100 - (s.trRank / 3100) * 100)}%`, backgroundColor: s.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              { label: "Pazar Payı", value: `${((info.visits / totalVisits) * 100).toFixed(1)}%`, sub: "4 site içinde", color: "text-amber-400" },
              { label: "En Yakın Rakip", value: "gedik.com", sub: `${(info.visits - sites[3].visits).toLocaleString()} fark`, color: "text-emerald-400" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg bg-zinc-800/50 p-3">
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{s.label}</div>
                <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-zinc-600">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-5">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Hızlı Karşılaştırma</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Metrik</th>
                {sites.map((s) => (
                  <th key={s.name} className="text-right px-3 py-2.5">
                    <span className="text-[10px] font-semibold uppercase" style={{ color: s.color }}>{s.short}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Ziyaret", vals: sites.map((s) => s.visitsLabel) },
                { label: "Authority Score", vals: sites.map((s) => String(s.authorityScore)) },
                { label: "Hemen Çıkma", vals: sites.map((s) => `%${s.bounceRate}`) },
                { label: "Sayfa/Ziyaret", vals: sites.map((s) => s.pagesPerVisit.toFixed(2)) },
                { label: "AI Trafik", vals: sites.map((s) => String(s.aiTraffic)) },
                { label: "TR Sıra", vals: sites.map((s) => `#${s.trRank.toLocaleString()}`) },
              ].map((row) => (
                <tr key={row.label} className="border-t border-zinc-800">
                  <td className="px-3 py-2.5 text-zinc-400 text-xs font-medium">{row.label}</td>
                  {row.vals.map((v, i) => (
                    <td key={i} className="px-3 py-2.5 text-right text-sm font-medium text-zinc-200">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

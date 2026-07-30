"use client";

import { useEffect, useRef, useState } from "react";
import { SITES } from "@/lib/data";
import { formatNumber, COLORS, cn } from "@/lib/utils";
import { Card, CardTitle, CardValue, CardLabel } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, LineChart, Line,
} from "recharts";
import {
  Globe, Award, MousePointerClick, Bot, TrendingUp, TrendingDown, MapPin, Activity, Zap, ExternalLink,
} from "lucide-react";

function KPICard({ icon: Icon, label, value, sub, color, delay }: {
  icon: React.ElementType; label: string; value: string; sub: string; color: string; delay: number;
}) {
  return (
    <div className="animate-fade-in rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-5" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">{label}</div>
          <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
          <div className="text-xs text-zinc-600">{sub}</div>
        </div>
        <div className={cn("p-2.5 rounded-lg", `bg-${color}-500/10`)} style={{ backgroundColor: `${color}15` }}>
          <Icon size={20} style={{ color }} />
        </div>
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const info = SITES[0];
  const totalVisits = SITES.reduce((a, s) => a + s.visits, 0);
  const avgAS = Math.round(SITES.reduce((a, s) => a + s.authorityScore, 0) / SITES.length);

  const trafficData = SITES.map((s) => ({
    name: s.id.toUpperCase(), label: s.name, visits: Math.round(s.visits / 1000), fill: s.color,
  }));

  const trendData = SITES[0].monthlyVisits.map((m, i) => ({
    month: m.month,
    [SITES[0].id]: m.value,
    [SITES[1].id]: SITES[1].monthlyVisits[i].value,
    [SITES[2].id]: SITES[2].monthlyVisits[i].value,
    [SITES[3].id]: SITES[3].monthlyVisits[i].value,
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-white tracking-tight">Genel Bakış</h1>
          <Badge variant="success">Canlı</Badge>
        </div>
        <p className="text-sm text-zinc-500">Aracı kurum SEO performansı &middot; Haziran 2026</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard icon={Globe} label="Toplam Pazar Trafiği" value={formatNumber(totalVisits)} sub="4 site toplam aylık ziyaret" color={COLORS.info} delay={100} />
        <KPICard icon={Award} label="Ortalama Authority Score" value={String(avgAS)} sub="Sektör ortalaması" color={COLORS.isy} delay={200} />
        <KPICard icon={MousePointerClick} label="En Düşük Hemen Çıkma" value="%53.86" sub="gedik.com ile sektör lideri" color={COLORS.ged} delay={300} />
        <KPICard icon={Bot} label="Toplam AI Trafik" value="1.728" sub="+%142 büyüme potansiyeli" color={COLORS.gcm} delay={400} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        <Card className="lg:col-span-4">
          <CardTitle>Aylık Ziyaret Karşılaştırması</CardTitle>
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" tick={{ fill: "#a1a1aa", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} unit="K" />
                <Tooltip
                  contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, color: "#f4f4f5", fontSize: 12 }}
                  formatter={(value) => [`${value}K ziyaret`, ""]}
                  labelFormatter={(label) => trafficData.find(d => d.name === label)?.label || label}
                />
                <Bar dataKey="visits" radius={[8, 8, 0, 0]} maxBarSize={72}>
                  {trafficData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-3">
          <CardTitle>6 Aylık Trafik Trendi</CardTitle>
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="month" tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} unit="K" />
                <Tooltip
                  contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, color: "#f4f4f5", fontSize: 12 }}
                />
                {SITES.map((s) => (
                  <Line key={s.id} type="monotone" dataKey={s.id} stroke={s.color} strokeWidth={2} dot={false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-3">
            {SITES.map((s) => (
              <div key={s.id} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-[10px] text-zinc-500">{s.id.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardTitle>Pozisyon Dağılımı</CardTitle>
          <div className="mt-4 space-y-4">
            {SITES.map((s) => {
              const top3 = s.keywords.filter(k => k.position <= 3).length;
              const top10 = s.keywords.filter(k => k.position <= 10).length;
              return (
                <div key={s.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-sm text-zinc-200">{s.name}</span>
                    </div>
                    <span className="text-xs text-zinc-500">#{s.countryRank.toLocaleString()}</span>
                  </div>
                  <div className="relative h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-zinc-600 transition-all duration-500"
                      style={{ width: `${100 - (s.countryRank / 3100) * 100}%` }}
                    />
                  </div>
                  <div className="flex gap-3 mt-1">
                    <span className="text-[10px] text-emerald-400">{top3}/5 ilk 3</span>
                    <span className="text-[10px] text-blue-400">{top10}/5 ilk 10</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <CardTitle>Hızlı Metrik Karşılaştırması</CardTitle>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left px-2 py-2 text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Metrik</th>
                  {SITES.map(s => (
                    <th key={s.id} className="text-right px-2 py-2">
                      <span className="text-[10px] font-semibold uppercase" style={{ color: s.color }}>{s.id}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Ziyaret", vals: SITES.map(s => s.visitsDisplay) },
                  { label: "AS", vals: SITES.map(s => String(s.authorityScore)) },
                  { label: "Hemen Çıkma", vals: SITES.map(s => `%${s.bounceRate}`) },
                  { label: "Sayfa/Ziyaret", vals: SITES.map(s => s.pagesPerVisit.toFixed(2)) },
                  { label: "AI Trafik", vals: SITES.map(s => String(s.aiTraffic)) },
                  { label: "Süre", vals: SITES.map(s => s.avgDuration) },
                ].map(row => (
                  <tr key={row.label} className="border-t border-zinc-800">
                    <td className="px-2 py-2.5 text-xs text-zinc-400">{row.label}</td>
                    {row.vals.map((v, i) => (
                      <td key={i} className="px-2 py-2.5 text-right text-sm font-medium text-zinc-200">{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Rakip Görünümü</CardTitle>
          <Badge variant="info">{SITES.length} site</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {SITES.map((s, i) => (
            <div key={s.id} className="animate-fade-in rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 text-center" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center text-sm font-bold" style={{ backgroundColor: `${s.color}20`, color: s.color }}>
                {s.id.toUpperCase()}
              </div>
              <div className="text-sm font-semibold text-white mb-1 truncate">{s.name}</div>
              <div className="text-2xl font-bold mb-2" style={{ color: s.color }}>{s.visitsDisplay}</div>
              <div className="flex justify-center gap-2 text-[10px] text-zinc-500">
                <span>AS {s.authorityScore}</span>
                <span>&middot;</span>
                <span>TR #{s.countryRank}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

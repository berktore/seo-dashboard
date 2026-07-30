"use client";

import { useState } from "react";
import { SITES } from "@/lib/data";
import { CHANNEL_COLORS, CHANNEL_LABELS, cn, formatNumber } from "@/lib/utils";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
  PieChart, Pie, Cell as PCell,
} from "recharts";
import { BarChart3, Globe, TrendingUp, TrendingDown } from "lucide-react";

export default function TrafficPage() {
  const [selectedSite, setSelectedSite] = useState(SITES[0].id);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-1">
        <div className="p-2 rounded-lg bg-blue-500/10">
          <BarChart3 size={20} className="text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Trafik Analizi</h1>
          <p className="text-sm text-zinc-500">Kanal bazlı trafik dağılımı ve kaynak analizi</p>
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

      {(() => {
        const site = SITES.find(s => s.id === selectedSite) || SITES[0];
        const channelData = Object.entries(site.channels)
          .filter(([, v]) => v > 0)
          .map(([k, v]) => ({ name: CHANNEL_LABELS[k] || k, value: v, fill: CHANNEL_COLORS[k] }));

        const stackedData = SITES.map((s) => {
          const row: Record<string, string | number> = { name: s.id.toUpperCase() };
          Object.entries(s.channels).forEach(([k, v]) => { row[CHANNEL_LABELS[k]] = v; });
          return row;
        });

        return (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardTitle>{site.name} &mdash; Trafik Kanal Dağılımı</CardTitle>
                <div className="flex items-center gap-8 mt-2">
                  <div className="flex-1 space-y-2.5">
                    {channelData.map((ch) => (
                      <div key={ch.name}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-zinc-400">{ch.name}</span>
                          <span className="text-zinc-200 font-medium">%{ch.value.toFixed(1)}</span>
                        </div>
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${ch.value}%`, backgroundColor: ch.fill }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="w-36 h-36 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={channelData} dataKey="value" cx="50%" cy="50%" outerRadius={60} innerRadius={35}>
                          {channelData.map((e, i) => <PCell key={i} fill={e.fill} />)}
                        </Pie>
                        <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, color: "#f4f4f5" }}
                          formatter={(value) => [`%${Number(value).toFixed(1)}`, ""]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Card>

              <Card>
                <CardTitle>Kanal Karşılaştırması &mdash; {site.name}</CardTitle>
                <div className="mt-2 grid grid-cols-3 gap-3">
                  {[
                    { label: "Doğrudan", value: `%${site.channels.direct}`, key: "direct" },
                    { label: "Organik", value: `%${site.channels.organic}`, key: "organic" },
                    { label: "Yönlendirme", value: `%${site.channels.referral}`, key: "referral" },
                    { label: "Sosyal", value: `%${site.channels.social}`, key: "social" },
                    { label: "Reklam", value: `%${site.channels.paid}`, key: "paid" },
                  ].map((item) => (
                    <div key={item.key} className="rounded-lg bg-zinc-800/40 p-3 text-center">
                      <div className="text-[10px] text-zinc-500 uppercase">{item.label}</div>
                      <div className="text-lg font-bold" style={{ color: CHANNEL_COLORS[item.key] }}>{item.value}</div>
                    </div>
                  ))}
                  <div className="rounded-lg bg-zinc-800/40 p-3 text-center">
                    <div className="text-[10px] text-zinc-500 uppercase">Toplam</div>
                    <div className="text-lg font-bold text-white">{site.visitsDisplay}</div>
                    <div className="text-[10px] text-zinc-600">aylık ziyaret</div>
                  </div>
                </div>
              </Card>
            </div>

            <Card>
              <CardTitle>Trafik Kanal Dağılımı &mdash; Tüm Siteler</CardTitle>
              <div className="mt-2">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={stackedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="name" tick={{ fill: "#a1a1aa", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
                    <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, color: "#f4f4f5" }} />
                    {[
                      { name: "Direkt", key: "direct" },
                      { name: "Organik", key: "organic" },
                      { name: "Yönlendirme", key: "referral" },
                      { name: "Sosyal", key: "social" },
                      { name: "Reklam", key: "paid" },
                    ].map(({ name, key }) => (
                      <Bar key={name} stackId="a" dataKey={name} fill={CHANNEL_COLORS[key]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <CardTitle>En Çok Trafik Alan Sayfalar</CardTitle>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-zinc-800/50">
                      <th className="text-left px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase">Site</th>
                      <th className="text-left px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase">Sayfa</th>
                      <th className="text-right px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase">Trafik</th>
                      <th className="text-right px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase">Pay</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SITES.flatMap((s) =>
                      s.topPages.map((page, i) => (
                        <tr key={`${s.id}-${i}`} className="border-t border-zinc-800 hover:bg-zinc-800/20 transition-colors">
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                              <span className="text-xs text-zinc-400">{s.id.toUpperCase()}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-zinc-200 font-mono text-xs">{page.path}</td>
                          <td className="px-3 py-2.5 text-right text-zinc-200 font-medium">{formatNumber(page.traffic)}</td>
                          <td className="px-3 py-2.5 text-right text-zinc-400">{page.share}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        );
      })()}
    </div>
  );
}

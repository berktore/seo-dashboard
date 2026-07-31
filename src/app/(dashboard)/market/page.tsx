"use client";

import { useEffect, useMemo, useState } from "react";
import { SITES } from "@/lib/data";
import { formatCompact, cn } from "@/lib/utils";
import { getShareOfVoice } from "@/lib/anomalies";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
  PieChart, Pie,
} from "recharts";

export default function MarketPage() {
  const [sov, setSov] = useState<any[]>([]);

  useEffect(() => {
    setSov(getShareOfVoice());
  }, []);

  const shareTrend = useMemo(() => {
    const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz"];
    return months.map((month, mi) => {
      const row: any = { month };
      const total = SITES.reduce((a, s) => a + s.monthlyVisits[mi].value, 0);
      for (const s of SITES) row[s.id] = total > 0 ? Number(((s.monthlyVisits[mi].value / total) * 100).toFixed(1)) : 0;
      return row;
    });
  }, []);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-5">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Pazar Payı Dağılımı</div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={sov} cx="50%" cy="50%" innerRadius={60} outerRadius={110} dataKey="share" nameKey="name">
                  {sov.map((e, i) => <Cell key={i} fill={e.color} stroke="transparent" />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, fontSize: 12 }}
                  formatter={(v: any) => [`%${Number(v).toFixed(1)}`, "Pay"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mt-2">
            {sov.map(d => (
              <div key={d.id} className="flex items-center gap-1.5 text-xs">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                <span className="text-zinc-500 truncate">{d.name.split(".")[0]}</span>
                <span className="text-zinc-300 font-medium ml-auto">%{d.share.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-5">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Pazar Payı Trendi (6 Ay)</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={shareTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="month" tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, fontSize: 12 }}
                formatter={(v: any) => [`%${v}`, ""]}
              />
              {SITES.slice(0, 6).map(s => (
                <Bar key={s.id} dataKey={s.id} stackId="a" fill={s.color} name={s.name} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-5">
        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Tüm Siteler · Detaylı Karşılaştırma</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-2 pr-4 text-[10px] text-zinc-600 uppercase font-semibold">Site</th>
                <th className="text-right py-2 px-2 text-[10px] text-zinc-600 uppercase font-semibold">Ziyaret</th>
                <th className="text-right py-2 px-2 text-[10px] text-zinc-600 uppercase font-semibold">AS</th>
                <th className="text-right py-2 px-2 text-[10px] text-zinc-600 uppercase font-semibold">Hemen Çıkma</th>
                <th className="text-right py-2 px-2 text-[10px] text-zinc-600 uppercase font-semibold">Süre</th>
                <th className="text-right py-2 px-2 text-[10px] text-zinc-600 uppercase font-semibold">Backlink</th>
                <th className="text-right py-2 px-2 text-[10px] text-zinc-600 uppercase font-semibold">Organik</th>
                <th className="text-right py-2 px-2 text-[10px] text-zinc-600 uppercase font-semibold">AI</th>
                <th className="text-right py-2 pl-2 text-[10px] text-zinc-600 uppercase font-semibold">TR Sıra</th>
              </tr>
            </thead>
            <tbody>
              {SITES.map(s => (
                <tr key={s.id} className="border-b border-zinc-800/40 hover:bg-zinc-800/20">
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                      <span className="text-zinc-200 font-medium">{s.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-right font-medium text-zinc-200">{s.visitsDisplay}</td>
                  <td className="py-2.5 px-2 text-right font-medium" style={{ color: "#a855f7" }}>{s.authorityScore}</td>
                  <td className="py-2.5 px-2 text-right font-medium" style={{ color: s.bounceRate >= 70 ? "#ef4444" : "#22c55e" }}>%{s.bounceRate}</td>
                  <td className="py-2.5 px-2 text-right text-zinc-300">{s.avgDuration}</td>
                  <td className="py-2.5 px-2 text-right text-zinc-300">{formatCompact(s.totalBacklinks)}</td>
                  <td className="py-2.5 px-2 text-right">
                    <span className={cn("font-medium", s.organicChange >= 0 ? "text-emerald-400" : "text-red-400")}>
                      {s.organicChange >= 0 ? "+" : ""}{s.organicChange}%
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-right text-zinc-300">{s.aiTraffic}</td>
                  <td className="py-2.5 pl-2 text-right text-zinc-500">#{s.countryRank.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

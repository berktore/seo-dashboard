"use client";

import { sites } from "@/lib/data";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
  PieChart, Pie, Cell as PCell,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

const channelLabels: Record<string, string> = {
  direct: "Direkt", organic: "Organik", referral: "Referral", social: "Sosyal", paid: "Reklam", mail: "E-posta",
};
const channelColors: Record<string, string> = {
  direct: "#f59e0b", organic: "#3b82f6", referral: "#a855f7", social: "#22c55e", paid: "#ef4444", mail: "#f97316",
};

export default function TrafficPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sites.map((site) => (
          <div key={site.name} className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: site.color }} />
              <h3 className="text-sm font-semibold text-zinc-200">{site.name}</h3>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
                <div className="text-[10px] text-zinc-500 uppercase">Toplam</div>
                <div className="text-lg font-bold text-white">{site.visitsLabel}</div>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
                <div className="text-[10px] text-zinc-500 uppercase">Organik</div>
                <div className="text-lg font-bold text-blue-400">{site.organicTraffic.split(" ")[0]}</div>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
                <div className="text-[10px] text-zinc-500 uppercase">Direct</div>
                <div className="text-lg font-bold text-amber-400">%{site.channels.direct}</div>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                {Object.entries(site.channels)
                  .filter(([, v]) => (v as number) > 0)
                  .sort(([, a], [, b]) => (b as number) - (a as number))
                  .map(([k, v]) => (
                    <div key={k} className="flex items-center gap-2 mb-1.5">
                      <div className="w-16 text-[10px] text-zinc-500 text-right">{channelLabels[k]}</div>
                      <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${v}%`, backgroundColor: channelColors[k] }} />
                      </div>
                      <div className="w-10 text-xs text-zinc-400 text-right">%{v}</div>
                    </div>
                  ))}
              </div>
              <div className="w-28 h-28 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Object.entries(site.channels).filter(([, v]) => (v as number) > 0).map(([k, v]) => ({
                        name: channelLabels[k], value: v as number,
                      }))}
                      dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={40} innerRadius={25}
                    >
                      {Object.entries(site.channels).filter(([, v]) => (v as number) > 0).map(([k], i) => (
                        <PCell key={i} fill={channelColors[k]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-5">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Trafik Akışı Karşılaştırması (Stacked)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sites.map((s) => ({
            name: s.short,
            Direkt: s.channels.direct,
            Organik: s.channels.organic,
            Referral: s.channels.referral,
            Sosyal: s.channels.social,
            Reklam: s.channels.paid,
          }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="name" tick={{ fill: "#a1a1aa", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
            <Tooltip
              contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, color: "#f4f4f5" }}
            />
            {[
              { name: "Direkt", key: "direct" },
              { name: "Organik", key: "organic" },
              { name: "Referral", key: "referral" },
              { name: "Sosyal", key: "social" },
              { name: "Reklam", key: "paid" },
            ].map(({ name, key }) => (
              <Bar key={name} dataKey={name} stackId="a" fill={channelColors[key]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-5">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">En Çok Trafik Alan Sayfalar</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Site</th>
                <th className="text-left px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Sayfa</th>
                <th className="text-right px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Trafik</th>
                <th className="text-right px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Pay</th>
              </tr>
            </thead>
            <tbody>
              {sites.flatMap((site) =>
                site.topPages.map((page, i) => (
                  <tr key={`${site.short}-${i}`} className="border-t border-zinc-800">
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: site.color }} />
                        <span className="text-xs text-zinc-400">{site.short}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-zinc-200 font-mono text-xs">{page.page}</td>
                    <td className="px-3 py-2.5 text-right text-zinc-200 font-medium">{page.traffic.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-right text-zinc-400">{page.pct}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

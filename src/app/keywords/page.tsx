"use client";

import { sites, getPositionColor } from "@/lib/data";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";

export default function KeywordsPage() {
  const allKeywords = sites.flatMap((s) =>
    s.keywords.map((kw) => ({ ...kw, site: s.short, siteColor: s.color }))
  );

  const posDist = sites.map((s) => {
    const dist = { "1-3": 0, "4-10": 0, "11+": 0 };
    s.keywords.forEach((kw) => {
      if (kw.position <= 3) dist["1-3"]++;
      else if (kw.position <= 10) dist["4-10"]++;
      else dist["11+"]++;
    });
    return { name: s.short, ...dist, fill: s.color };
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-5">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
            Anahtar Kelimeler &ndash; infoyatirim.com
          </h3>
          <div className="overflow-hidden rounded-lg border border-zinc-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-800/50">
                  <th className="text-left px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase">#</th>
                  <th className="text-left px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase">Kelime</th>
                  <th className="text-center px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase">Konum</th>
                  <th className="text-right px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase">Hacim</th>
                  <th className="text-right px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase">Trafik</th>
                </tr>
              </thead>
              <tbody>
                {sites[0].keywords.map((kw) => (
                  <tr key={kw.rank} className="border-t border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                    <td className="px-3 py-2.5 text-zinc-500 text-xs">{kw.rank}</td>
                    <td className="px-3 py-2.5 text-zinc-200 font-medium">{kw.keyword}</td>
                    <td className={`px-3 py-2.5 text-center font-bold ${getPositionColor(kw.position)}`}>#{kw.position}</td>
                    <td className="px-3 py-2.5 text-right text-zinc-400 text-xs">
                      {kw.volume >= 1000 ? `${(kw.volume / 1000).toFixed(kw.volume >= 1000000 ? 1 : 0)}K` : kw.volume}
                    </td>
                    <td className="px-3 py-2.5 text-right text-zinc-400 text-xs">{kw.trafficPct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-5">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Konum Dağılımı</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={posDist}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="name" tick={{ fill: "#a1a1aa", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, color: "#f4f4f5" }}
              />
              <Bar dataKey="1-3" stackId="a" fill="#22c55e" name="1-3" radius={[0, 0, 0, 0]} />
              <Bar dataKey="4-10" stackId="a" fill="#3b82f6" name="4-10" />
              <Bar dataKey="11+" stackId="a" fill="#64748b" name="11+" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            {[{ label: "İlk 3", color: "bg-emerald-500" }, { label: "4-10", color: "bg-blue-500" }, { label: "11+", color: "bg-zinc-500" }].map((l) => (
              <div key={l.label} className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                <span className="text-xs text-zinc-500">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-5">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Tüm Rakipler &ndash; Anahtar Kelimeler</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-800/50">
                <th className="text-left px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase">Site</th>
                <th className="text-left px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase">Kelime</th>
                <th className="text-center px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase">Konum</th>
                <th className="text-right px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase">Hacim</th>
                <th className="text-right px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase">Trafik</th>
              </tr>
            </thead>
            <tbody>
              {allKeywords.map((kw, i) => (
                <tr key={i} className="border-t border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: kw.siteColor }} />
                      <span className="text-xs text-zinc-400">{kw.site}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-zinc-200 font-medium">{kw.keyword}</td>
                  <td className={`px-3 py-2.5 text-center font-bold ${getPositionColor(kw.position)}`}>#{kw.position}</td>
                  <td className="px-3 py-2.5 text-right text-zinc-400 text-xs">
                    {kw.volume >= 1000 ? `${(kw.volume / 1000).toFixed(kw.volume >= 1000000 ? 1 : 0)}K` : kw.volume}
                  </td>
                  <td className="px-3 py-2.5 text-right text-zinc-400 text-xs">{kw.trafficPct}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

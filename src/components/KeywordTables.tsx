"use client";

import { sites, getPositionColor } from "@/lib/data";

export default function KeywordTables() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sites.map((site) => (
        <div
          key={site.name}
          className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-5 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: site.color }} />
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{site.name}</h3>
          </div>
          <div className="overflow-hidden rounded-lg border border-zinc-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-800/50">
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">#</th>
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Kelime</th>
                  <th className="text-center px-3 py-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Sıra</th>
                  <th className="text-right px-3 py-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Hacim</th>
                  <th className="text-right px-3 py-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">%</th>
                </tr>
              </thead>
              <tbody>
                {site.keywords.map((kw) => (
                  <tr key={kw.rank} className="border-t border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                    <td className="px-3 py-2.5 text-zinc-500 text-xs">{kw.rank}</td>
                    <td className="px-3 py-2.5 text-zinc-200 font-medium">{kw.keyword}</td>
                    <td className={`px-3 py-2.5 text-center font-bold ${getPositionColor(kw.position)}`}>
                      #{kw.position}
                    </td>
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
      ))}
    </div>
  );
}

"use client";

import { sites } from "@/lib/data";

const rows = [
  { label: "Aylık Ziyaret", key: "visitsLabel" as const },
  { label: "Global Sıralama", key: "globalRank" as const },
  { label: "TR Sıralaması", key: "trRank" as const },
  { label: "Authority Score", key: "authorityScore" as const },
  { label: "Sayfa / Ziyaret", key: "pagesPerVisit" as const },
  { label: "Ort. Süre", key: "avgTime" as const },
  { label: "Hemen Çıkma", key: "bounceRate" as const },
  { label: "Organik Trafik", key: "organicTraffic" as const },
  { label: "Paid Trafik", key: "paidTraffic" as const },
  { label: "Referans Domain", key: "refDomains" as const },
  { label: "Backlink Sayısı", key: "backlinks" as const },
  { label: "AI Trafik", key: "aiTraffic" as const },
];

function getValue(site: typeof sites[number], key: string) {
  const v = (site as any)[key];
  if (key === "globalRank") return `#${v.toLocaleString()}`;
  if (key === "trRank") return `#${v.toLocaleString()}`;
  if (key === "bounceRate") return `%${v}`;
  if (key === "pagesPerVisit") return v.toFixed(2);
  if (key === "aiTraffic") return v.toLocaleString();
  return v;
}

function isNumeric(key: string) {
  return ["visitsLabel", "authorityScore", "pagesPerVisit", "bounceRate", "aiTraffic"].includes(key);
}

function getBestSite(key: string): number {
  if (key === "bounceRate") {
    const vals = sites.map((s) => s.bounceRate);
    return vals.indexOf(Math.min(...vals));
  }
  if (key === "visitsLabel") {
    const vals = sites.map((s) => s.visits);
    return vals.indexOf(Math.max(...vals));
  }
  if (key === "authorityScore") {
    const vals = sites.map((s) => s.authorityScore);
    return vals.indexOf(Math.max(...vals));
  }
  if (key === "pagesPerVisit") {
    const vals = sites.map((s) => s.pagesPerVisit);
    return vals.indexOf(Math.max(...vals));
  }
  if (key === "aiTraffic") {
    const vals = sites.map((s) => s.aiTraffic);
    return vals.indexOf(Math.max(...vals));
  }
  if (key === "globalRank") {
    const vals = sites.map((s) => s.globalRank);
    return vals.indexOf(Math.min(...vals));
  }
  if (key === "trRank") {
    const vals = sites.map((s) => s.trRank);
    return vals.indexOf(Math.min(...vals));
  }
  return -1;
}

export default function ComparisonTable() {
  return (
    <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-5 backdrop-blur-sm">
      <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Detaylı Karşılaştırma</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left px-3 py-2.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Metrik</th>
              {sites.map((s) => (
                <th key={s.name} className="text-right px-3 py-2.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: s.color }}>{s.short}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const bestIdx = getBestSite(row.key);
              return (
                <tr key={row.key} className="border-t border-zinc-800 hover:bg-zinc-800/20 transition-colors">
                  <td className="px-3 py-2.5 text-zinc-400 text-xs font-medium">{row.label}</td>
                  {sites.map((s, i) => (
                    <td
                      key={s.name}
                      className={`px-3 py-2.5 text-right text-sm font-medium ${
                        i === bestIdx ? "text-emerald-400" : "text-zinc-200"
                      }`}
                    >
                      {getValue(s, row.key)}
                      {i === bestIdx && <span className="ml-1 text-[10px] text-emerald-500">&#9733;</span>}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

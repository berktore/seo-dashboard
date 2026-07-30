"use client";

import { sites } from "@/lib/data";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell,
} from "recharts";

const metrics = ["Authority Score", "Referans Domain", "Backlink", "Organik Trafik", "AI Trafik"];

const radarData = metrics.map((m) => {
  const row: Record<string, string | number> = { metric: m };
  sites.forEach((s) => {
    const raw = m === "Authority Score" ? s.authorityScore
      : m === "Referans Domain" ? parseInt(s.refDomains) || 18
      : m === "Backlink" ? Math.min(Math.round(Math.log10(parseInt(s.backlinks) || 1) * 25), 100)
      : m === "Organik Trafik" ? Math.min(Math.round((parseInt(s.organicTraffic) / 2800) * 100), 100)
      : m === "AI Trafik" ? Math.min(s.aiTraffic / 10, 100) : 0;
    row[s.short] = Math.min(raw, 100);
  });
  return row;
});

const backlinkData = sites.map((s) => ({
  name: s.short,
  backlinks: parseInt(s.backlinks) || 0,
  refDomains: parseInt(s.refDomains) || 0,
  fill: s.color,
}));

const rows = [
  { label: "Aylık Ziyaret", key: "visitsLabel" as const, type: "string" as const },
  { label: "Global Sıralama", key: "globalRank" as const, type: "rank" as const, lowerBetter: true },
  { label: "TR Sıralaması", key: "trRank" as const, type: "rank" as const, lowerBetter: true },
  { label: "Authority Score", key: "authorityScore" as const, type: "number" as const },
  { label: "Sayfa / Ziyaret", key: "pagesPerVisit" as const, type: "number" as const },
  { label: "Ort. Süre", key: "avgTime" as const, type: "string" as const },
  { label: "Hemen Çıkma", key: "bounceRate" as const, type: "pct" as const, lowerBetter: true },
  { label: "Organik Trafik", key: "organicTraffic" as const, type: "string" as const },
  { label: "Paid Trafik", key: "paidTraffic" as const, type: "string" as const },
  { label: "Referans Domain", key: "refDomains" as const, type: "string" as const },
  { label: "Backlink Sayısı", key: "backlinks" as const, type: "string" as const },
  { label: "AI Trafik", key: "aiTraffic" as const, type: "number" as const },
];

function getVal(site: typeof sites[number], key: string) {
  const v = (site as any)[key];
  if (key === "globalRank") return `#${v.toLocaleString()}`;
  if (key === "trRank") return `#${v.toLocaleString()}`;
  if (key === "bounceRate") return `%${v}`;
  if (key === "pagesPerVisit") return v.toFixed(2);
  if (key === "aiTraffic") return v.toLocaleString();
  return v;
}

function getBestIdx(key: string): number {
  if (key === "bounceRate") {
    const vals = sites.map((s) => s.bounceRate); return vals.indexOf(Math.min(...vals));
  }
  if (key === "visitsLabel") {
    const vals = sites.map((s) => s.visits); return vals.indexOf(Math.max(...vals));
  }
  if (key === "authorityScore") {
    const vals = sites.map((s) => s.authorityScore); return vals.indexOf(Math.max(...vals));
  }
  if (key === "pagesPerVisit") {
    const vals = sites.map((s) => s.pagesPerVisit); return vals.indexOf(Math.max(...vals));
  }
  if (key === "aiTraffic") {
    const vals = sites.map((s) => s.aiTraffic); return vals.indexOf(Math.max(...vals));
  }
  if (key === "globalRank" || key === "trRank") {
    const vals = sites.map((s) => s[key]); return vals.indexOf(Math.min(...vals));
  }
  return -1;
}

export default function CompetitorsPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-5">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Çok Boyutlu Karşılaştırma</h3>
          <ResponsiveContainer width="100%" height={340}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#27272a" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: "#a1a1aa", fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, color: "#f4f4f5" }} />
              <Legend
                wrapperStyle={{ fontSize: 11, color: "#a1a1aa" }}
                formatter={(value) => <span style={{ color: "#a1a1aa" }}>{sites.find((s) => s.short === value)?.name}</span>}
              />
              {sites.map((s) => (
                <Radar key={s.short} name={s.short} dataKey={s.short} stroke={s.color} fill={s.color} fillOpacity={0.06} strokeWidth={2} />
              ))}
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-5">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Backlink &amp; Domain Karşılaştırması</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={backlinkData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="name" tick={{ fill: "#a1a1aa", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, color: "#f4f4f5" }}
                formatter={(value) => [Number(value).toLocaleString(), ""]}
              />
              <Bar dataKey="backlinks" radius={[6, 6, 0, 0]} maxBarSize={50}>
                {backlinkData.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {sites.map((s) => (
              <div key={s.name} className="text-center">
                <div className="text-[10px] text-zinc-500" style={{ color: s.color }}>{s.short}</div>
                <div className="text-xs text-zinc-300">{s.refDomains}</div>
                <div className="text-[9px] text-zinc-600">domain</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-5">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Detaylı Rakip Karşılaştırma Tablosu</h3>
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
              {rows.map((row) => {
                const bestIdx = getBestIdx(row.key);
                return (
                  <tr key={row.key} className="border-t border-zinc-800 hover:bg-zinc-800/20 transition-colors">
                    <td className="px-3 py-2.5 text-zinc-400 text-xs font-medium">{row.label}</td>
                    {sites.map((s, i) => (
                      <td key={s.name} className={`px-3 py-2.5 text-right text-sm font-medium ${i === bestIdx ? "text-emerald-400" : "text-zinc-200"}`}>
                        {getVal(s, row.key)}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-5">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">infoyatirim.com &ndash; Güçlü ve Zayıf Yönler</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">&#9650; Güçlü</h4>
              <ul className="space-y-1.5">
                {[
                  "Sayfa başına en yüksek etkileşim (6.98 sayfa/ziyaret)",
                  "TR sıralamasında 4 site içinde 2. en iyi konum",
                  "Trafikte aylık %100 büyüme (May → Haz)",
                  "En düşük paid trafik bağımlılığı",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-zinc-300">
                    <span className="text-emerald-500 mt-0.5">&#9654;</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">&#9660; Gelişmeli</h4>
              <ul className="space-y-1.5">
                {[
                  "Authority Score 45 (sektör ortalaması: 52)",
                  "Backlink sayısı 27K (gcmyatirim 975K'nın çok gerisinde)",
                  "AI trafik potansiyeli düşük (223 ziyaret)",
                  "Organik trafik geçen aya göre %9 düşüş",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-zinc-300">
                    <span className="text-red-500 mt-0.5">&#9654;</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-5">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Öneriler</h3>
          <div className="space-y-3">
            {[
              { title: "Backlink Stratejisi", desc: "Sektördeki finans haber sitelerinden ve borsa platformlarından backlink alın. Hedef: 50K backlink.", color: "text-blue-400" },
              { title: "AI Trafiği Artırın", desc: "İçeriklerinizi AI odaklı aramalar için optimize edin. ChatGPT ve Gemini'de referans gösterilecek içerikler üretin.", color: "text-amber-400" },
              { title: "Keyword Genişletme", desc: "Özellikle altın fiyatları ve hisse analizi gibi yüksek hacimli kelimelerde içerik açığınız var.", color: "text-purple-400" },
              { title: "Organik Düşüşü Durdurun", desc: "Organik trafikteki %9'luk düşüşün kaynağını analiz edin ve içerik güncellemesi yapın.", color: "text-red-400" },
            ].map((item) => (
              <div key={item.title} className="bg-zinc-800/50 rounded-lg p-3">
                <div className={`text-xs font-semibold ${item.color} mb-1`}>{item.title}</div>
                <div className="text-xs text-zinc-400">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

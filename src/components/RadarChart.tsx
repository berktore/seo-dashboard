"use client";

import {
  RadarChart as RC, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, Legend,
} from "recharts";
import { sites } from "@/lib/data";

export default function RadarChart() {
  const metrics = ["Authority Score", "Referans Domain", "Backlink", "Organik Trafik", "AI Trafik"];

  const maxValues: Record<string, number> = {
    "Authority Score": 60,
    "Referans Domain": 35,
    "Backlink": 100,
    "Organik Trafik": 100,
    "AI Trafik": 100,
  };

  const data = metrics.map((m) => {
    const row: Record<string, string | number> = { metric: m };
    sites.forEach((s) => {
      const raw = m === "Authority Score" ? s.authorityScore
        : m === "Referans Domain" ? parseInt(s.refDomains) || 18
        : m === "Backlink" ? Math.min(Math.round(Math.log10(parseInt(s.backlinks) || 1) * 25), 100)
        : m === "Organik Trafik" ? Math.min(Math.round((parseInt(s.organicTraffic) / 2800) * 100), 100)
        : m === "AI Trafik" ? Math.min(Math.round((s.aiTraffic / 10)), 100)
        : 0;
      row[s.short] = Math.min(raw, maxValues[m]);
    });
    return row;
  });

  return (
    <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-5 backdrop-blur-sm">
      <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Çok Boyutlu Karşılaştırma</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RC data={data}>
          <PolarGrid stroke="#27272a" />
          <PolarAngleAxis dataKey="metric" tick={{ fill: "#a1a1aa", fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Tooltip
            contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, color: "#f4f4f5" }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, color: "#a1a1aa" }}
            formatter={(value) => <span style={{ color: "#a1a1aa" }}>{sites.find((s) => s.short === value)?.name}</span>}
          />
          {sites.map((s) => (
            <Radar
              key={s.short}
              name={s.short}
              dataKey={s.short}
              stroke={s.color}
              fill={s.color}
              fillOpacity={0.08}
              strokeWidth={2}
            />
          ))}
        </RC>
      </ResponsiveContainer>
    </div>
  );
}

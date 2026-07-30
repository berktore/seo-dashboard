"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { sites, SiteData } from "@/lib/data";

const channelColors: Record<string, string> = {
  direct: "#f59e0b",
  organic: "#3b82f6",
  referral: "#a855f7",
  social: "#22c55e",
  paid: "#ef4444",
  mail: "#f97316",
};

const channelLabels: Record<string, string> = {
  direct: "Direkt",
  organic: "Organik",
  referral: "Referral",
  social: "Sosyal",
  paid: "Reklam",
  mail: "E-posta",
};

export default function ChannelChart({ site }: { site: SiteData }) {
  const data = Object.entries(site.channels)
    .filter(([, v]) => (v as number) > 0)
    .map(([k, v]) => ({ name: channelLabels[k] || k, value: v as number, fill: channelColors[k] }));

  return (
    <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-5 backdrop-blur-sm">
      <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
        {site.name} &mdash; Trafik Kanalları
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, color: "#f4f4f5" }}
            formatter={(value) => [`%${Number(value).toFixed(1)}`, ""]}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, color: "#a1a1aa" }}
            formatter={(value) => <span style={{ color: "#a1a1aa" }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

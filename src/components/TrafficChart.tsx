"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";
import { sites } from "@/lib/data";

export default function TrafficChart() {
  const data = sites.map((s) => ({
    name: s.short,
    fullName: s.name,
    visits: Math.round(s.visits / 1000),
    fill: s.color,
  }));

  return (
    <Section title="Rakip Trafik Karşılaştırması">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="name" tick={{ fill: "#a1a1aa", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} unit="K" />
          <Tooltip
            contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, color: "#f4f4f5" }}
            formatter={(value) => [`${value}K ziyaret`, ""]}
            labelFormatter={(label) => data.find((d) => d.name === label)?.fullName || label}
          />
          <Bar dataKey="visits" radius={[6, 6, 0, 0]} maxBarSize={60}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Section>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-5 backdrop-blur-sm">
      <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">{title}</h3>
      {children}
    </div>
  );
}

"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { getShareOfVoice, getShareTrend } from "@/lib/anomalies";
import { SITES } from "@/lib/data";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";

const RADIAN = Math.PI / 180;
function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) {
  const radius = outerRadius + 30;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#a1a1aa" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={10}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export function ShareOfVoice() {
  const data = getShareOfVoice();
  const trend = getShareTrend();
  const info = data.find(d => d.id === "info");
  const leader = data[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardTitle>Pazar Payı (Share of Voice)</CardTitle>
        <p className="text-xs text-zinc-600 mb-3">Her sitenin toplam trafikteki yüzdesel payı</p>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="share" nameKey="name" label={CustomLabel} labelLine={false}>
                {data.map((e, i) => <Cell key={i} fill={e.color} stroke="transparent" />)}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, color: "#f4f4f5", fontSize: 12 }}
                formatter={(value: any) => [`%${Number(value).toFixed(1)}`, "Pazar Payı"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
          {data.slice(0, 6).map(d => (
            <div key={d.id} className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-zinc-400 truncate">{d.name}</span>
              <span className="text-zinc-200 font-medium ml-auto">%{d.share.toFixed(1)}</span>
            </div>
          ))}
        </div>
        {info && (
          <div className="mt-4 pt-3 border-t border-zinc-800 text-xs text-zinc-500">
            <span className="text-amber-400 font-semibold">infoyatirim.com</span> pazar payı %{info.share.toFixed(1)}.
            Lider: <span style={{ color: leader.color }} className="font-semibold">{leader.name}</span> (%{leader.share.toFixed(1)}).
          </div>
        )}
      </Card>

      <Card>
        <CardTitle>Pazar Payı Trendi</CardTitle>
        <p className="text-xs text-zinc-600 mb-3">6 aylık pazar payı değişimi (%)</p>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="month" tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" domain={[0, 50]} />
            <Tooltip
              contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, color: "#f4f4f5", fontSize: 12 }}
              formatter={(value: any) => [`%${value}`, ""]}
            />
            <Legend wrapperStyle={{ fontSize: 10, color: "#a1a1aa" }} />
            {SITES.slice(0, 6).map(s => (
              <Bar key={s.id} dataKey={s.id} stackId="a" fill={s.color} name={s.name} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

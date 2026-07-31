"use client";

import { useState, useMemo } from "react";
import { SITES } from "@/lib/data";
import { formatCompact, cn, CHANNEL_COLORS, CHANNEL_LABELS } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { getPeriodData, PeriodId, getWeekLabel } from "@/lib/weekly-data";
import { usePeriod } from "@/lib/period";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
  LineChart, Line,
} from "recharts";
import { TrendingUp, TrendingDown, Zap, LineChart as LineChartIcon } from "lucide-react";
import { PageMovers } from "@/components/PageMovers";
import { forecastChartData, getForecastInsight } from "@/lib/forecast";

const info = SITES[0];

function KPIStrip({ period, isWeekly }: { period: PeriodId; isWeekly: boolean }) {
  const kpis = useMemo(() => {
    const totalV = isWeekly
      ? SITES.reduce((a, s) => a + (getPeriodData(s.id, period)?.visits || 0), 0)
      : SITES.reduce((a, s) => a + s.visits, 0);
    const avgAS = Math.round(SITES.reduce((a, s) => a + s.authorityScore, 0) / SITES.length);
    const lowestB = SITES.reduce((b, s) => s.bounceRate < b.bounceRate ? s : b, SITES[0]);
    const totalAI = SITES.reduce((a, s) => a + s.aiTraffic, 0);
    const totalBL = SITES.reduce((a, s) => a + s.totalBacklinks, 0);
    const topKW = SITES.reduce((a, s) => a + s.keywords.length, 0);

    return [
      { label: "Pazar Trafiği", value: formatCompact(totalV), sub: `${SITES.length} site toplam`, color: "#3b82f6", trend: 12 },
      { label: "Otorite (AS)", value: String(avgAS), sub: "Sektör ortalaması", color: "#a855f7", trend: 3 },
      { label: "Hemen Çıkma", value: `%${lowestB.bounceRate}`, sub: `${lowestB.name.split(".")[0]} en düşük`, color: "#22c55e", trend: -2, invert: true },
      { label: "Backlink", value: formatCompact(totalBL), sub: "Tüm siteler", color: "#f59e0b", trend: 5 },
      { label: "AI Trafik", value: String(totalAI), sub: "Aylık toplam", color: "#ef4444", trend: 18 },
      { label: "Anahtar Kelime", value: String(topKW), sub: "Toplam sıralama", color: "#06b6d4", trend: 0 },
    ];
  }, [period, isWeekly]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
      {kpis.map((k, i) => {
        const up = k.invert ? k.trend < 0 : k.trend > 0;
        return (
          <div key={i} className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-3.5">
            <div className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider mb-0.5">{k.label}</div>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-xl font-bold text-white" style={{ color: k.color }}>{k.value}</span>
                <span className="text-[11px] text-zinc-600 ml-2">
                  {up ? <TrendingUp size={12} className="inline text-emerald-400 mr-0.5" /> : <TrendingDown size={12} className="inline text-red-400 mr-0.5" />}
                  %{Math.abs(k.trend)}
                </span>
              </div>
            </div>
            <div className="text-[10px] text-zinc-600 mt-0.5">{k.sub}</div>
          </div>
        );
      })}
    </div>
  );
}

export default function TrafficPage() {
  const { period } = usePeriod();
  const [selectedSite, setSelectedSite] = useState("all");
  const isWeekly = period !== "month";
  const periodLabel = isWeekly ? `Haftalık · ${getWeekLabel(period)}` : "Aylık · Haziran 2026";

  const trafficData = useMemo(() => (
    isWeekly ? SITES.map((s) => {
      const wd = getPeriodData(s.id, period);
      return { name: s.id.toUpperCase(), label: s.name, visits: wd ? Math.round(wd.visits / 1000) : Math.round(s.visits / 1000), fill: s.color };
    }) : SITES.map((s) => ({ name: s.id.toUpperCase(), label: s.name, visits: Math.round(s.visits / 1000), fill: s.color }))
  ), [period, isWeekly]);

  const trendData = useMemo(() => (
    SITES[0].monthlyVisits.map((m, i) => ({
      month: m.month,
      ...Object.fromEntries(SITES.map(s => [s.id, s.monthlyVisits[i].value])),
    }))
  ), []);

  const forecast = useMemo(() => {
    const data = forecastChartData();
    const fcMonths = data.filter(f => f.isForecast);
    return { data, fcMonths, insight: getForecastInsight("info").text };
  }, []);

  return (
    <div className="space-y-5">
      <KPIStrip period={period} isWeekly={isWeekly} />

      {/* Forecast row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <LineChartIcon size={14} className="text-amber-400" />
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Trafik Tahmini · infoyatirim.com</span>
            </div>
            <span className="text-[10px] text-zinc-600">Kesikli çizgi = 3 aylık projeksiyon</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={forecast.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="month" tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} unit="K" />
              <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, color: "#f4f4f5", fontSize: 12 }} />
              <Line type="monotone" dataKey="info" stroke="#f59e0b" strokeWidth={2.5} dot={false} name="Gerçek" />
              <Line type="monotone" dataKey="infoFc" stroke="#f59e0b" strokeWidth={2.5} strokeDasharray="6 4" dot={false} name="Tahmin" />
              {["gcm", "midas", "isy"].map(id => {
                const s = SITES.find(x => x.id === id)!;
                return <Line key={id} type="monotone" dataKey={id} stroke={s.color} strokeWidth={1} dot={false} strokeOpacity={0.35} name={s.name} />;
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-5 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={14} className="text-amber-400" />
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tahmin Yorumu</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed mb-4">{forecast.insight}</p>
          <div className="space-y-2">
            {["Tem", "Ağu", "Eyl"].map((m, i) => {
              const p: any = forecast.fcMonths[i];
              return (
                <div key={m} className="flex items-center justify-between bg-zinc-800/30 rounded-lg px-3 py-2">
                  <span className="text-xs text-zinc-400">{m} 2026</span>
                  <span className="text-xs font-bold text-white">{p?.infoFc}K</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comparison + quick stats + trend */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        <div className="xl:col-span-3 rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Trafik Karşılaştırması</div>
              <div className="text-[11px] text-zinc-700 mt-0.5">{periodLabel} · Bin (K) cinsinden</div>
            </div>
            <div className="flex gap-1.5">
              {["all", ...SITES.map(s => s.id)].slice(0, 6).map(id => (
                <button key={id} onClick={() => setSelectedSite(id)}
                  className={cn(
                    "px-2 py-1 text-[10px] font-medium rounded-md transition-all",
                    selectedSite === id ? "bg-zinc-700 text-zinc-100" : "text-zinc-600 hover:text-zinc-400"
                  )}
                >
                  {id === "all" ? "Tümü" : id.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="name" tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} unit="K" />
              <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, color: "#f4f4f5", fontSize: 12 }}
                formatter={(v: any) => [`${v}K`, "Ziyaret"]}
                labelFormatter={(l) => trafficData.find(d => d.name === l)?.label || l}
              />
              <Bar dataKey="visits" radius={[6, 6, 0, 0]} maxBarSize={64}>
                {trafficData.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-4">
            <div className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider mb-3">Hızlı Metrikler</div>
            {[
              { label: "En yüksek trafik", site: SITES.reduce((a, s) => s.visits > a.visits ? s : a, SITES[0]), val: "visitsDisplay" },
              { label: "En yüksek AS", site: SITES.reduce((a, s) => s.authorityScore > a.authorityScore ? s : a, SITES[0]), val: "authorityScore" },
              { label: "En düşük hemen çıkma", site: SITES.reduce((a, s) => s.bounceRate < a.bounceRate ? s : a, SITES[0]), val: "bounceRate" },
              { label: "En çok backlink", site: SITES.reduce((a, s) => s.totalBacklinks > a.totalBacklinks ? s : a, SITES[0]), val: "totalBacklinks" },
              { label: "En çok AI trafik", site: SITES.reduce((a, s) => s.aiTraffic > a.aiTraffic ? s : a, SITES[0]), val: "aiTraffic" },
            ].map((r, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-zinc-800/50 last:border-0">
                <span className="text-[11px] text-zinc-500">{r.label}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-zinc-600">{r.site.id.toUpperCase()}</span>
                  <span className="text-xs font-semibold text-zinc-200" style={{ color: r.site.color }}>
                    {r.val === "visitsDisplay" ? r.site.visitsDisplay : r.val === "authorityScore" ? r.site.authorityScore : r.val === "bounceRate" ? `%${r.site.bounceRate}` : r.val === "totalBacklinks" ? formatCompact(r.site.totalBacklinks) : r.site.aiTraffic}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-4">
            <div className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider mb-3">Trafik Trendi</div>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={trendData}>
                <Line type="monotone" dataKey={info.id} stroke="#f59e0b" strokeWidth={2} dot={false} />
                {["gcm", "midas", "isy"].map(id => {
                  const s = SITES.find(x => x.id === id)!;
                  return <Line key={id} type="monotone" dataKey={id} stroke={s.color} strokeWidth={1} dot={false} strokeOpacity={0.4} />;
                })}
                <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, fontSize: 11 }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-3 mt-1">
              {[info, ...SITES.slice(1, 4)].map(s => (
                <div key={s.id} className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-[9px] text-zinc-600">{s.id.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Channels + keywords + pages */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-5">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Trafik Kanalları · infoyatirim.com</div>
          <div className="space-y-2.5">
            {Object.entries(info.channels).map(([ch, pct]) => (
              <div key={ch}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-zinc-400">{CHANNEL_LABELS[ch] || ch}</span>
                  <span className="text-zinc-200 font-medium">%{pct}</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: CHANNEL_COLORS[ch] || "#6366f1" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">İlk 5 Anahtar Kelime</div>
            <Badge variant="info">infoyatirim.com</Badge>
          </div>
          <div className="space-y-2">
            {info.keywords.map((kw, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-zinc-800/40 last:border-0">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={cn("text-[10px] font-mono font-bold w-4", kw.position <= 3 ? "text-emerald-400" : "text-zinc-500")}>#{kw.position}</span>
                  <span className="text-xs text-zinc-200 truncate">{kw.keyword}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-zinc-600">{formatCompact(kw.volume)}</span>
                  <span className="text-[10px] text-zinc-700">{kw.trafficShare}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">En Popüler Sayfalar</div>
            <Badge variant="info">{info.pageDetails.length} sayfa</Badge>
          </div>
          <div className="space-y-2 max-h-[260px] overflow-y-auto">
            {[...info.pageDetails].sort((a, b) => b.traffic - a.traffic).slice(0, 6).map((p, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-zinc-800/40 last:border-0">
                <div className="min-w-0 flex-1 mr-2">
                  <div className="text-xs text-zinc-200 truncate font-mono">{p.path}</div>
                  <div className="text-[10px] text-zinc-600">%{p.bounceRate} hemen çıkma · {p.avgDuration}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-semibold text-zinc-200">{formatCompact(p.traffic)}</div>
                  <div className="text-[10px] text-zinc-600">{p.share}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <PageMovers />
    </div>
  );
}

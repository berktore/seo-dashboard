"use client";

import { useState, useEffect, useMemo } from "react";
import { SITES } from "@/lib/data";
import { formatCompact, cn, CHANNEL_COLORS, CHANNEL_LABELS } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TimeFilter } from "@/components/TimeFilter";
import { getPeriodData, PeriodId, getWeekLabel } from "@/lib/weekly-data";
import { detectAnomalies, getShareOfVoice } from "@/lib/anomalies";
import { findKeywordGaps, generateContentSuggestions } from "@/lib/keyword-gaps";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
  LineChart, Line, PieChart, Pie,
} from "recharts";
import {
  TrendingUp, TrendingDown, Globe, MousePointerClick, Search, Link2,
  BarChart3, Target, AlertTriangle, Sparkles, FileText, Zap,
  Activity, CheckCircle2, LineChart as LineChartIcon, Newspaper,
} from "lucide-react";
import { ExecutiveSummary } from "@/components/ExecutiveSummary";
import { PdfReport } from "@/components/PdfReport";
import { EmailDigest } from "@/components/EmailDigest";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NewsPanel } from "@/components/NewsPanel";
import { KeywordMovers } from "@/components/KeywordMovers";
import { OpportunityMatrix } from "@/components/OpportunityMatrix";
import { PageMovers } from "@/components/PageMovers";
import { BacklinkPanel } from "@/components/BacklinkPanel";
import { forecastChartData, getForecastInsight } from "@/lib/forecast";

const info = SITES[0];
const competitors = SITES.slice(1);

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

const MAIN_TABS = [
  { id: "overview", label: "Özet", icon: BarChart3 },
  { id: "news", label: "Haberler", icon: Newspaper },
  { id: "sites", label: "Site Analizi", icon: Globe },
  { id: "keywords", label: "Anahtar Kelimeler", icon: Search },
  { id: "market", label: "Pazar Payı", icon: Target },
  { id: "anomalies", label: "Anomaliler", icon: AlertTriangle },
  { id: "goals", label: "Hedefler", icon: Target },
  { id: "suggestions", label: "Öneriler", icon: Sparkles },
];

export default function OverviewPage() {
  const [period, setPeriod] = useState<PeriodId>("month");
  const [mainTab, setMainTab] = useState("overview");
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [gaps, setGaps] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [sov, setSov] = useState<any[]>([]);
  const [selectedSite, setSelectedSite] = useState("info");
  const [goalVals, setGoalVals] = useState<Record<string, number>>({});
  const [editingGoal, setEditingGoal] = useState<string | null>(null);

  const isWeekly = period !== "month";

  useEffect(() => {
    setAnomalies(detectAnomalies());
    setGaps(findKeywordGaps());
    setSuggestions(generateContentSuggestions());
    setSov(getShareOfVoice());
    try {
      const saved = localStorage.getItem("infoyatirim-goals");
      if (saved) setGoalVals(JSON.parse(saved));
    } catch {}
  }, []);

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

  const shareTrend = useMemo(() => {
    const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz"];
    return months.map((month, mi) => {
      const row: any = { month };
      const total = SITES.reduce((a, s) => a + s.monthlyVisits[mi].value, 0);
      for (const s of SITES) row[s.id] = total > 0 ? Number(((s.monthlyVisits[mi].value / total) * 100).toFixed(1)) : 0;
      return row;
    });
  }, []);

  const saveGoal = (key: string, val: number) => {
    const upd = { ...goalVals, [key]: val };
    setGoalVals(upd);
    localStorage.setItem("infoyatirim-goals", JSON.stringify(upd));
    setEditingGoal(null);
  };

  const resetGoals = () => {
    localStorage.removeItem("infoyatirim-goals");
    setGoalVals({});
  };

  const defaults = { targetVisits: 600000, targetAS: 55, targetBacklinks: 35000, targetBounce: 55 };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-zinc-800/60 bg-black/80 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 md:px-6 py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-xs font-bold text-black">IY</div>
              <div>
                <div className="text-sm font-bold text-white">infoyatirim.com</div>
                <div className="text-[10px] text-zinc-600 hidden sm:block">SEO Analiz Paneli</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <EmailDigest />
            <PdfReport />
            <ThemeToggle />
            <TimeFilter selected={period} onChange={setPeriod} />
          </div>
        </div>
        <div className="flex items-center gap-1 px-4 md:px-6 pb-2 overflow-x-auto no-scrollbar">
          {MAIN_TABS.map(t => (
            <button key={t.id} onClick={() => setMainTab(t.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-lg transition-all whitespace-nowrap",
                mainTab === t.id ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <t.icon size={13} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-5">
        {/* Executive Summary */}
        {mainTab === "overview" && <ExecutiveSummary />}

        {/* KPI Strip */}
        <KPIStrip period={period} isWeekly={isWeekly} />

        {/* Main Content */}
        {mainTab === "overview" && (
          <>
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

            {/* Row 1: Dominant chart + site selector */}
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

              {/* Sidebar: Quick Stats */}
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

            {/* Row 2: info site metrics + keyword ranks */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
              {/* Channel breakdown */}
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

              {/* Top keywords info */}
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

              {/* info page performance */}
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

            {/* Row 3: Anomaly alerts (compact) */}
            {anomalies.filter(a => a.severity === "kritik").length > 0 && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={14} className="text-red-400" />
                  <span className="text-xs font-semibold text-red-300">Kritik Uyarılar</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {anomalies.filter(a => a.severity === "kritik").map((a, i) => (
                    <div key={i} className="text-[11px] text-zinc-400 bg-zinc-900/60 rounded-lg px-3 py-2 border border-red-500/10">
                      <span className="text-red-300 font-medium">{a.siteName}</span>: {a.description}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Row 4: Page movers + backlink profile */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              <PageMovers />
              <BacklinkPanel />
            </div>
          </>
        )}

        {mainTab === "news" && <NewsPanel />}

        {mainTab === "sites" && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {competitors.map(s => (
              <div key={s.id} className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                    <span className="text-sm font-semibold text-zinc-100">{s.name}</span>
                    <Badge variant="default">{s.id.toUpperCase()}</Badge>
                  </div>
                  <span className="text-lg font-bold" style={{ color: s.color }}>{s.visitsDisplay}</span>
                </div>
                <div className="grid grid-cols-4 gap-3 mb-3">
                  {[
                    { label: "AS", val: s.authorityScore, color: "#a855f7" },
                    { label: "Hemen Çıkma", val: `%${s.bounceRate}`, color: s.bounceRate >= 70 ? "#ef4444" : "#22c55e" },
                    { label: "Süre", val: s.avgDuration, color: "#3b82f6" },
                    { label: "Backlink", val: formatCompact(s.totalBacklinks), color: "#f59e0b" },
                  ].map((m, i) => (
                    <div key={i} className="bg-zinc-800/30 rounded-lg p-2 text-center">
                      <div className="text-[10px] text-zinc-600">{m.label}</div>
                      <div className="text-xs font-bold" style={{ color: m.color }}>{m.val}</div>
                    </div>
                  ))}
                </div>
                <div className="text-[10px] text-zinc-600 mb-2">En çok kazandıran sayfalar</div>
                {s.pageDetails.slice(0, 3).map((p, i) => (
                  <div key={i} className="flex items-center justify-between py-1 text-xs border-b border-zinc-800/30 last:border-0">
                    <span className="font-mono text-zinc-400 truncate mr-2">{p.path}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-zinc-500">{formatCompact(p.traffic)}</span>
                      <span className="text-emerald-400 text-[10px]">{p.share}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {mainTab === "keywords" && (
          <>
            <KeywordMovers />
            <OpportunityMatrix />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <Search size={14} className="text-blue-400" />
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Anahtar Kelime Boşluğu</span>
                <Badge variant="info">{gaps.length} fırsat</Badge>
              </div>
              <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
                {gaps.slice(0, 15).map((g, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-zinc-800/30 text-xs border-b border-zinc-800/30 last:border-0">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-zinc-300 font-medium truncate">{g.keyword}</span>
                      <span className="text-[10px] text-zinc-600 shrink-0">#{g.competitorPosition}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-zinc-500">{g.competitorName.split(".")[0]}</span>
                      <span className="text-zinc-400">{formatCompact(g.competitorVolume)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} className="text-emerald-400" />
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">İçerik Önerileri</span>
                <Badge variant="success">{suggestions.length} öneri</Badge>
              </div>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {suggestions.map((s, i) => (
                  <div key={i} className="rounded-lg border border-zinc-800/50 bg-zinc-800/20 p-3">
                    <div className="flex items-start gap-2">
                      <FileText size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-zinc-200">{s.title}</div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">Hedef: {s.targetKeyword} · Hacim: {formatCompact(s.volume)}</div>
                        <div className="text-[10px] text-zinc-600 mt-0.5">{s.reason}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div>
          </>
        )}

        {mainTab === "market" && (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-5">
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Pazar Payı Dağılımı</div>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={sov} cx="50%" cy="50%" innerRadius={60} outerRadius={110} dataKey="share" nameKey="name">
                        {sov.map((e, i) => <Cell key={i} fill={e.color} stroke="transparent" />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, fontSize: 12 }}
                        formatter={(v: any) => [`%${Number(v).toFixed(1)}`, "Pay"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mt-2">
                  {sov.map(d => (
                    <div key={d.id} className="flex items-center gap-1.5 text-xs">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                      <span className="text-zinc-500 truncate">{d.name.split(".")[0]}</span>
                      <span className="text-zinc-300 font-medium ml-auto">%{d.share.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-5">
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Pazar Payı Trendi (6 Ay)</div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={shareTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="month" tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                    <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, fontSize: 12 }}
                      formatter={(v: any) => [`%${v}`, ""]}
                    />
                    {SITES.slice(0, 6).map(s => (
                      <Bar key={s.id} dataKey={s.id} stackId="a" fill={s.color} name={s.name} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-5">
              <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Tüm Siteler · Detaylı Karşılaştırma</div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left py-2 pr-4 text-[10px] text-zinc-600 uppercase font-semibold">Site</th>
                      <th className="text-right py-2 px-2 text-[10px] text-zinc-600 uppercase font-semibold">Ziyaret</th>
                      <th className="text-right py-2 px-2 text-[10px] text-zinc-600 uppercase font-semibold">AS</th>
                      <th className="text-right py-2 px-2 text-[10px] text-zinc-600 uppercase font-semibold">Hemen Çıkma</th>
                      <th className="text-right py-2 px-2 text-[10px] text-zinc-600 uppercase font-semibold">Süre</th>
                      <th className="text-right py-2 px-2 text-[10px] text-zinc-600 uppercase font-semibold">Backlink</th>
                      <th className="text-right py-2 px-2 text-[10px] text-zinc-600 uppercase font-semibold">Organik</th>
                      <th className="text-right py-2 px-2 text-[10px] text-zinc-600 uppercase font-semibold">AI</th>
                      <th className="text-right py-2 pl-2 text-[10px] text-zinc-600 uppercase font-semibold">TR Sıra</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SITES.map(s => (
                      <tr key={s.id} className="border-b border-zinc-800/40 hover:bg-zinc-800/20">
                        <td className="py-2.5 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                            <span className="text-zinc-200 font-medium">{s.name}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-2 text-right font-medium text-zinc-200">{s.visitsDisplay}</td>
                        <td className="py-2.5 px-2 text-right font-medium" style={{ color: "#a855f7" }}>{s.authorityScore}</td>
                        <td className="py-2.5 px-2 text-right font-medium" style={{ color: s.bounceRate >= 70 ? "#ef4444" : "#22c55e" }}>%{s.bounceRate}</td>
                        <td className="py-2.5 px-2 text-right text-zinc-300">{s.avgDuration}</td>
                        <td className="py-2.5 px-2 text-right text-zinc-300">{formatCompact(s.totalBacklinks)}</td>
                        <td className="py-2.5 px-2 text-right">
                          <span className={cn("font-medium", s.organicChange >= 0 ? "text-emerald-400" : "text-red-400")}>
                            {s.organicChange >= 0 ? "+" : ""}{s.organicChange}%
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-right text-zinc-300">{s.aiTraffic}</td>
                        <td className="py-2.5 pl-2 text-right text-zinc-500">#{s.countryRank.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {mainTab === "anomalies" && (
          <div className="space-y-4">
            {[
              { severity: "kritik", label: "Kritik", color: "#ef4444", border: "border-red-500/20" },
              { severity: "orta", label: "Orta", color: "#f59e0b", border: "border-amber-500/20" },
              { severity: "düşük", label: "Düşük", color: "#3b82f6", border: "border-blue-500/20" },
            ].map(grp => {
              const items = anomalies.filter(a => a.severity === grp.severity);
              if (!items.length) return null;
              return (
                <div key={grp.severity} className={cn("rounded-xl border p-4", grp.border, "bg-zinc-900/60 backdrop-blur-sm")}>
                  <div className="text-xs font-semibold mb-2" style={{ color: grp.color }}>{grp.label} ({items.length})</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {items.map((a, i) => (
                      <div key={i} className="bg-zinc-800/40 rounded-lg p-3 border border-zinc-800/60">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-xs font-semibold text-zinc-200">{a.siteName}</span>
                          <span className="text-[10px] text-zinc-600">{a.title}</span>
                        </div>
                        <p className="text-[11px] text-zinc-400">{a.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {anomalies.length === 0 && (
              <div className="text-center py-12 text-sm text-zinc-600">
                <CheckCircle2 size={32} className="mx-auto mb-2 text-emerald-500" />
                Anomali tespit edilmedi. Tüm veriler düzenli görünüyor.
              </div>
            )}
          </div>
        )}

        {mainTab === "goals" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { key: "targetVisits", label: "Hedef Ziyaret", current: info.visits, unit: "", icon: Globe, fmt: formatCompact, invert: false },
              { key: "targetAS", label: "Hedef Authority Score", current: info.authorityScore, unit: "/100", icon: Activity, fmt: String, invert: false },
              { key: "targetBacklinks", label: "Hedef Backlink", current: info.totalBacklinks, unit: "", icon: Link2, fmt: formatCompact, invert: false },
              { key: "targetBounce", label: "Hedef Hemen Çıkma", current: info.bounceRate, unit: "%", icon: MousePointerClick, fmt: (v: number) => `%${v}`, invert: true },
            ].map(m => {
              const target = goalVals[m.key] || defaults[m.key as keyof typeof defaults] || 1;
              const progress = m.invert
                ? Math.max(0, Math.min(100, ((target - m.current) / target) * 100 + 100))
                : Math.min(100, (m.current / target) * 100);
              const achieved = m.invert ? m.current <= target : m.current >= target;
              const Icon = m.icon;

              return (
                <div key={m.key} className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon size={14} className="text-zinc-500" />
                      <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">{m.label}</span>
                    </div>
                    {achieved ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Target size={14} className="text-amber-400" />}
                  </div>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-2xl font-bold text-white">{m.fmt(m.current)}</span>
                    <span className="text-[11px] text-zinc-600 mb-1">/ {m.fmt(target)}</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-2">
                    <div className={cn("h-full rounded-full transition-all", achieved ? "bg-emerald-500" : "bg-amber-500")} style={{ width: `${Math.min(100, progress)}%` }} />
                  </div>
                  {editingGoal === m.key ? (
                    <div className="flex gap-1">
                      <input type="number" defaultValue={target} autoFocus
                        onKeyDown={e => { if (e.key === "Enter") saveGoal(m.key, Number((e.target as HTMLInputElement).value)); }}
                        className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-200"
                      />
                      <button onClick={resetGoals} className="text-[10px] text-zinc-600 hover:text-zinc-400 underline">Sıfırla</button>
                    </div>
                  ) : (
                    <button onClick={() => setEditingGoal(m.key)} className="text-[10px] text-zinc-600 hover:text-zinc-400 underline underline-offset-2">
                      Hedefi düzenle
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {mainTab === "suggestions" && (
          <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={16} className="text-amber-400" />
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">SEO İyileştirme Önerileri</span>
              <Badge variant="warning">{5 + suggestions.length} aksiyon</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: "Hemen çıkma oranını düşür", desc: info.pageDetails.filter(p => p.bounceRate >= 65).map(p => p.path).join(", "), priority: "Yüksek", color: "#ef4444" },
                { title: "Düşük trafikli sayfaları güçlendir", desc: info.pageDetails.filter(p => p.traffic < 5000 && p.bounceRate <= 45).map(p => p.path).join(", "), priority: "Orta", color: "#f59e0b" },
                { title: "Organik trafik kaybını analiz et", desc: `Aylık %${Math.abs(info.organicChange)} düşüş var. Algoritma güncellemesi kontrol edilmeli.`, priority: "Yüksek", color: "#ef4444" },
                { title: "Backlink profilini güçlendir", desc: `${info.refDomains} referans domain ile rakiplerin gerisinde. Guest posting ve PR çalışması önerilir.`, priority: "Orta", color: "#f59e0b" },
                { title: "AI trafiği artır", desc: `Sadece ${info.aiTraffic} AI ziyareti. Yapay zeka özetleri ve schema markup ekleyin.`, priority: "Düşük", color: "#3b82f6" },
                ...suggestions.slice(0, 3).map(s => ({ title: s.title, desc: s.reason, priority: s.priority === "yüksek" ? "Yüksek" : "Orta", color: s.priority === "yüksek" ? "#ef4444" : "#f59e0b" })),
              ].map((item, i) => (
                <div key={i} className="rounded-lg border border-zinc-800/50 bg-zinc-800/20 p-3.5">
                  <div className="flex items-start gap-2.5">
                    <div className="p-1 rounded" style={{ background: `${item.color}15` }}>
                      <Zap size={12} style={{ color: item.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs font-semibold text-zinc-200">{item.title}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${item.color}20`, color: item.color }}>{item.priority}</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

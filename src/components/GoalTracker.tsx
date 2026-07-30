"use client";

import { useState, useEffect } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatNumber } from "@/lib/utils";
import { SITES } from "@/lib/data";
import { Edit3, Check, X, Target, TrendingUp, Globe, Link2, Activity } from "lucide-react";

interface Goals {
  info: { targetVisits: number; targetAS: number; targetBacklinks: number; targetBounce: number };
  [key: string]: { targetVisits: number; targetAS: number; targetBacklinks: number; targetBounce: number };
}

const STORAGE_KEY = "infoyatirim-goals";
const DEFAULTS: Goals = {
  info: { targetVisits: 600000, targetAS: 55, targetBacklinks: 35000, targetBounce: 55 },
  gcm: { targetVisits: 2500000, targetAS: 65, targetBacklinks: 1200000, targetBounce: 70 },
  isy: { targetVisits: 500000, targetAS: 70, targetBacklinks: 100000, targetBounce: 55 },
  ged: { targetVisits: 500000, targetAS: 60, targetBacklinks: 150000, targetBounce: 45 },
  midas: { targetVisits: 2500000, targetAS: 75, targetBacklinks: 20000, targetBounce: 60 },
};

export function GoalTracker() {
  const [goals, setGoals] = useState<Goals>(DEFAULTS);
  const [editing, setEditing] = useState<string | null>(null);
  const [editVals, setEditVals] = useState({ targetVisits: 0, targetAS: 0, targetBacklinks: 0, targetBounce: 0 });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setGoals({ ...DEFAULTS, ...JSON.parse(saved) });
    } catch { }
  }, []);

  const saveGoals = (id: string, vals: Partial<Goals["info"]>) => {
    const updated = { ...goals, [id]: { ...goals[id], ...vals } };
    setGoals(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const site = SITES[0];
  const g = goals.info;
  const metrics = [
    { id: "targetVisits", label: "Hedef Ziyaret", icon: Globe, current: site.visits, target: g.targetVisits, unit: "", fmt: (v: number) => formatNumber(v) },
    { id: "targetAS", label: "Hedef AS", icon: Activity, current: site.authorityScore, target: g.targetAS, unit: "/100", fmt: String },
    { id: "targetBacklinks", label: "Hedef Backlink", icon: Link2, current: site.totalBacklinks, target: g.targetBacklinks, unit: "", fmt: (v: number) => formatNumber(v) },
    { id: "targetBounce", label: "Hedef Hemen Çıkma", icon: TrendingUp, current: site.bounceRate, target: g.targetBounce, unit: "%", fmt: (v: number) => `%${v}`, invert: true },
  ];

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-amber-500/10"><Target size={16} className="text-amber-400" /></div>
          <CardTitle>Hedef Takibi</CardTitle>
        </div>
        <Badge variant="info">{site.name}</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.map(m => {
          const progress = m.invert
            ? Math.max(0, Math.min(100, ((m.target - m.current) / m.target) * 100 + 100))
            : Math.min(100, (m.current / m.target) * 100);
          const achieved = m.invert ? m.current <= m.target : m.current >= m.target;
          const Icon = m.icon;

          return (
            <div key={m.id} className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon size={14} className="text-zinc-500" />
                  <span className="text-xs font-semibold text-zinc-300">{m.label}</span>
                </div>
                {editing === m.id ? (
                  <div className="flex gap-1">
                    <button onClick={() => { saveGoals("info", { [m.id]: editVals[m.id as keyof typeof editVals] }); setEditing(null); }}
                      className="p-0.5 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"><Check size={12} /></button>
                    <button onClick={() => setEditing(null)}
                      className="p-0.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"><X size={12} /></button>
                  </div>
                ) : (
                  <button onClick={() => { setEditing(m.id); setEditVals({ ...editVals, [m.id]: g[m.id as keyof typeof g] }); }}
                    className="p-0.5 rounded hover:bg-zinc-800 text-zinc-600 hover:text-zinc-400"><Edit3 size={12} /></button>
                )}
              </div>

              {editing === m.id ? (
                <input type="number" value={editVals[m.id as keyof typeof editVals]} onChange={e => setEditVals({ ...editVals, [m.id]: Number(e.target.value) })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-200" autoFocus />
              ) : (
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-xl font-bold text-white">{m.fmt(m.current)}</span>
                  <span className="text-xs text-zinc-600 mb-1">/ {m.fmt(m.target)}{m.unit}</span>
                  {achieved ? <Badge variant="success">Hedefe Ulaştı</Badge> : <Badge variant="warning">%{Math.round(progress)}</Badge>}
                </div>
              )}

              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full transition-all duration-500", achieved ? "bg-emerald-500" : "bg-amber-500")}
                  style={{ width: `${Math.min(100, progress)}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button onClick={() => { localStorage.removeItem(STORAGE_KEY); setGoals(DEFAULTS); }}
          className="text-[10px] text-zinc-600 hover:text-zinc-400 underline underline-offset-2">
          Hedefleri Sıfırla
        </button>
        <span className="text-[10px] text-zinc-700">·</span>
        <span className="text-[10px] text-zinc-600">Hedefler tarayıcıda saklanır</span>
      </div>
    </Card>
  );
}

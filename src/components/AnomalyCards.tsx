"use client";

import { useState, useEffect } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { detectAnomalies, Anomaly } from "@/lib/anomalies";
import { SITES } from "@/lib/data";
import { formatNumber, cn } from "@/lib/utils";
import {
  AlertTriangle, TrendingDown, ArrowUpRight, ArrowDownRight, MousePointerClick,
  ExternalLink,
} from "lucide-react";

const SEVERITY_STYLE: Record<string, { border: string; bg: string; text: string; badge: "danger" | "warning" | "info" }> = {
  kritik: { border: "border-red-500/25", bg: "bg-red-500/10", text: "text-red-400", badge: "danger" },
  orta: { border: "border-amber-500/25", bg: "bg-amber-500/10", text: "text-amber-400", badge: "warning" },
  düşük: { border: "border-blue-500/25", bg: "bg-blue-500/10", text: "text-blue-400", badge: "info" },
};

const TYPE_ICONS: Record<string, React.ElementType> = {
  traffic_drop: TrendingDown, traffic_spike: ArrowUpRight, high_bounce: MousePointerClick,
  backlink_drop: TrendingDown, organic_loss: ExternalLink,
};

export function AnomalyCards() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);

  useEffect(() => { setAnomalies(detectAnomalies()); }, []);

  const critical = anomalies.filter(a => a.severity === "kritik");

  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-red-500/10">
            <AlertTriangle size={16} className="text-red-400" />
          </div>
          <CardTitle>Anomali Tespiti</CardTitle>
          {critical.length > 0 && <Badge variant="danger">{critical.length} kritik</Badge>}
          <Badge variant="default">{anomalies.length} toplam</Badge>
        </div>
      </div>
      <p className="text-xs text-zinc-600 mb-3">Trafik, backlink ve hemen çıkma verilerinde otomatik tespit edilen anormallikler</p>

      {anomalies.length === 0 ? (
        <p className="text-xs text-zinc-500 text-center py-6">Henüz anomali tespit edilmedi. Veriler düzenli görünüyor.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {anomalies.map((a, i) => {
            const ss = SEVERITY_STYLE[a.severity] || SEVERITY_STYLE.düşük;
            const Icon = TYPE_ICONS[a.type] || AlertTriangle;
            const isNegative = ["traffic_drop", "high_bounce", "backlink_drop", "organic_loss"].includes(a.type);

            return (
              <div key={`${a.siteId}-${a.type}-${i}`} className={cn("rounded-lg border p-4 transition-all hover:bg-zinc-800/30", ss.border, "bg-zinc-900/40")}>
                <div className="flex items-start gap-3">
                  <div className={cn("p-2 rounded-lg shrink-0", ss.bg)}>
                    <Icon size={16} className={ss.text} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs font-semibold text-zinc-200">{a.title}</span>
                      <Badge variant={ss.badge}>{a.severity}</Badge>
                    </div>
                    <span className="text-[10px] text-zinc-600" style={{ color: SITES.find(s => s.id === a.siteId)?.color }}>
                      {a.siteName}
                    </span>
                    <p className="text-[11px] text-zinc-400 leading-relaxed mt-1">{a.description}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] text-zinc-600">{a.metric}:</span>
                      <span className="text-xs font-medium text-zinc-200">{typeof a.currentValue === "number" && a.currentValue > 1000 ? formatNumber(Math.round(a.currentValue)) : a.currentValue}</span>
                      {a.changePercent !== 0 && (
                        <span className={cn("text-[10px] flex items-center gap-0.5", isNegative ? "text-red-400" : "text-emerald-400")}>
                          {isNegative ? <ArrowDownRight size={10} /> : <ArrowUpRight size={10} />}
                          %{Math.abs(a.changePercent).toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

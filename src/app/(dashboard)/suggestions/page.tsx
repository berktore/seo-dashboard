"use client";

import { useEffect, useState } from "react";
import { SITES } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { generateContentSuggestions } from "@/lib/keyword-gaps";
import { Zap } from "lucide-react";

const info = SITES[0];

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    setSuggestions(generateContentSuggestions());
  }, []);

  return (
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
  );
}

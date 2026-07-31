"use client";

import { IPO_EVENTS } from "@/lib/market-data";
import { Badge } from "@/components/ui/badge";
import { Rocket, CalendarClock } from "lucide-react";

const STATUS_BADGE: Record<string, "warning" | "info" | "success"> = {
  bekleniyor: "warning",
  talep_acik: "success",
  tamamlandi: "info",
};

export function HalkaArz() {
  return (
    <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-5">
      <div className="flex items-center gap-2 mb-1">
        <div className="p-1.5 rounded-md bg-amber-500/10">
          <Rocket size={14} className="text-amber-400" />
        </div>
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Halka Arz Takvimi</span>
        <Badge variant="warning">{IPO_EVENTS.length} yaklaşan</Badge>
      </div>
      <p className="text-[10px] text-zinc-600 mb-3">SPK onaylı şirketler · Temmuz-Ağustos 2026 dönemi</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {IPO_EVENTS.map((ipo, i) => (
          <div key={i} className="rounded-lg border border-zinc-800/60 bg-zinc-800/20 p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-zinc-100">{ipo.company}</span>
              <Badge variant={STATUS_BADGE[ipo.status]}>{ipo.statusLabel}</Badge>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 mb-1.5">
              <span>{ipo.sector}</span>
              {ipo.price && (
                <>
                  <span>·</span>
                  <span className="text-amber-400 font-medium">Fiyat: {ipo.price}</span>
                </>
              )}
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed">{ipo.details}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center gap-1.5 text-[10px] text-zinc-600">
        <CalendarClock size={12} />
        Talep toplama tarihleri, KAP izahnameleri yayımlandığında kesinleşir. Kaynak: SPK bültenleri & kamuya açık duyurular.
      </div>
    </div>
  );
}

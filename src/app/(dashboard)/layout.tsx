"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { TimeFilter } from "@/components/TimeFilter";
import { PdfReport } from "@/components/PdfReport";
import { EmailDigest } from "@/components/EmailDigest";
import { ThemeToggle } from "@/components/ThemeToggle";
import { usePeriod } from "@/lib/period";
import { Menu } from "lucide-react";

const TITLES: Record<string, { title: string; sub: string }> = {
  "/": { title: "Genel Bakış", sub: "Özet, dönem seçimi ve rapor" },
  "/news": { title: "Haberler", sub: "Finans haberleri ve GEO+SEO blog üretimi" },
  "/traffic": { title: "Trafik Analizi", sub: "Ziyaretçi, kanal ve sayfa performansı" },
  "/sites": { title: "Site Analizi", sub: "Rakip karşılaştırma" },
  "/keywords": { title: "Anahtar Kelimeler", sub: "Sıralama değişimleri ve fırsatlar" },
  "/market": { title: "Pazar Payı", sub: "Sektörel pay ve eğilim" },
  "/anomalies": { title: "Anomaliler", sub: "Ani değişimler" },
  "/goals": { title: "Hedefler", sub: "KPI hedefleri" },
  "/suggestions": { title: "Öneriler", sub: "İyileştirme listesi" },
  "/backlinks": { title: "Backlinkler", sub: "Bağlantı profili" },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { period, setPeriod } = usePeriod();
  const [mobileOpen, setMobileOpen] = useState(false);
  const meta = TITLES[pathname] ?? TITLES["/"];

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full">
            <Sidebar mobile onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 border-b border-zinc-800/60 bg-zinc-950/85 backdrop-blur-md">
          <div className="flex items-center gap-3 px-4 md:px-6 py-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-zinc-400 hover:text-zinc-200 transition-colors"
              aria-label="Menüyü aç"
            >
              <Menu size={20} />
            </button>
            <div className="min-w-0 mr-auto">
              <h1 className="text-sm font-bold text-white leading-tight truncate">{meta.title}</h1>
              <p className="text-[11px] text-zinc-600 truncate">{meta.sub}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <TimeFilter selected={period} onChange={setPeriod} />
              <PdfReport />
              <EmailDigest />
              <ThemeToggle />
            </div>
          </div>
        </header>
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}

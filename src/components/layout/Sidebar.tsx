"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Newspaper, BarChart3, Globe, Search, Target, AlertTriangle,
  Flag, Sparkles, Link2, ChevronLeft, PanelRightOpen, X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Özet", description: "Genel durum ve performans", icon: LayoutDashboard },
  { href: "/news", label: "Haberler", description: "Finans haberleri ve blog üretimi", icon: Newspaper },
  { href: "/traffic", label: "Trafik", description: "Ziyaretçi ve kanal analizi", icon: BarChart3 },
  { href: "/sites", label: "Site Analizi", description: "Rakip karşılaştırma", icon: Globe },
  { href: "/keywords", label: "Anahtar Kelimeler", description: "Sıralama ve fırsatlar", icon: Search },
  { href: "/market", label: "Pazar Payı", description: "Sektörel pay ve eğilim", icon: Target },
  { href: "/anomalies", label: "Anomaliler", description: "Ani değişimler", icon: AlertTriangle },
  { href: "/goals", label: "Hedefler", description: "KPI hedefleri", icon: Flag },
  { href: "/suggestions", label: "Öneriler", description: "İyileştirme listesi", icon: Sparkles },
  { href: "/backlinks", label: "Backlinkler", description: "Bağlantı profili", icon: Link2 },
];

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ mobile, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const showLabels = mobile || !collapsed;

  return (
    <aside
      className={cn(
        "flex flex-col bg-zinc-900/95 border-r border-zinc-800/60 transition-all duration-300",
        mobile ? "w-64 h-full" : "h-screen sticky top-0 flex-shrink-0 z-20",
        !mobile && (collapsed ? "w-[60px]" : "w-60")
      )}
    >
      <div className={cn("flex items-center h-14 border-b border-zinc-800/60 flex-shrink-0", collapsed ? "justify-center px-2" : "px-4")}>
        {!collapsed && (
          <Link href="/" onClick={onClose} className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-xs font-bold text-zinc-950 shadow-sm shadow-amber-500/20">
              iy
            </div>
            <div>
              <div className="text-sm font-semibold text-white leading-tight">SEO<span className="text-amber-400">Lab</span></div>
              <div className="text-[9px] text-zinc-600 uppercase tracking-wider">Analiz Platformu</div>
            </div>
          </Link>
        )}
        {collapsed && (
          <Link href="/" className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-xs font-bold text-zinc-950">
            iy
          </Link>
        )}
        {mobile ? (
          <button onClick={onClose} className="ml-auto text-zinc-500 hover:text-zinc-300 transition-colors">
            <X size={18} />
          </button>
        ) : (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "text-zinc-600 hover:text-zinc-300 transition-colors",
              collapsed ? "mt-3" : "ml-auto"
            )}
          >
            {collapsed ? <PanelRightOpen size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                active
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/15"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border border-transparent",
                !showLabels && "justify-center px-2"
              )}
            >
              <Icon size={18} className={cn(active && "text-amber-400", !active && "text-zinc-500 group-hover:text-zinc-300")} />
              {showLabels && (
                <div className="flex-1 min-w-0">
                  <div>{item.label}</div>
                  <div className="text-[10px] text-zinc-600 truncate">{item.description}</div>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {showLabels && (
        <div className="px-3 py-3 border-t border-zinc-800/60">
          <div className="rounded-lg bg-zinc-800/50 p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Canlı</span>
            </div>
            <div className="text-[10px] text-zinc-600">Temmuz 2026 · Semrush</div>
          </div>
        </div>
      )}
    </aside>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, BarChart3, Search, Users, ChevronLeft, PanelRightOpen,
} from "lucide-react";
import { useState } from "react";
import { navItems } from "@/lib/data";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, BarChart3, Search, Users,
};

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-60"
      } transition-all duration-300 flex flex-col bg-zinc-900/90 border-r border-zinc-800 h-screen sticky top-0 flex-shrink-0`}
    >
      <div className={`flex items-center gap-2 px-4 h-16 border-b border-zinc-800 ${collapsed ? "justify-center" : ""}`}>
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-xs font-bold text-zinc-950">i</div>
            <span className="text-sm font-semibold text-white">info<span className="text-amber-400">yatirim</span></span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`text-zinc-500 hover:text-zinc-300 transition-colors ${collapsed ? "mx-auto" : "ml-auto"}`}
        >
          {collapsed ? <PanelRightOpen size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              } ${collapsed ? "justify-center" : ""}`}
            >
              {Icon && <Icon size={18} />}
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>

      <div className={`px-3 py-4 border-t border-zinc-800 ${collapsed ? "text-center" : ""}`}>
        <div className={`text-[10px] text-zinc-600 uppercase tracking-wider ${collapsed ? "hidden" : ""}`}>
          Semrush &middot; Haz 2026
        </div>
      </div>
    </aside>
  );
}

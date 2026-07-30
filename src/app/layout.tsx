"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { navItems } from "@/lib/data";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const current = navItems.find((n) => n.href === pathname);

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-zinc-800 flex items-center px-6 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
          <div>
            <h1 className="text-lg font-semibold text-white">{current?.label || "Genel Bakış"}</h1>
            <p className="text-xs text-zinc-500">Aracı Kurum Rekabet Analizi</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-[10px] text-zinc-600 uppercase tracking-wider">Haziran 2026</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

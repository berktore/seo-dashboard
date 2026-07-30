"use client";

import { sites } from "@/lib/data";

export default function Header() {
  const info = sites[0];
  return (
    <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border border-zinc-700/50 p-8 mb-8">
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            info<span className="text-amber-400">yatirim</span>.com
          </h1>
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            SEO Dashboard
          </span>
        </div>
        <p className="text-zinc-400 text-sm mb-6">
          Aracı Kurum Rekabet Analizi &middot; Haziran 2026 &middot; Semrush
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Aylık Ziyaret", value: info.visitsLabel, color: "text-amber-400" },
            { label: "Authority Score", value: String(info.authorityScore), color: "text-blue-400" },
            { label: "TR Sıralaması", value: `#${info.trRank.toLocaleString()}`, color: "text-emerald-400" },
            { label: "Hemen Çıkma", value: `%${info.bounceRate}`, color: "text-red-400" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm"
            >
              <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{stat.label}</div>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

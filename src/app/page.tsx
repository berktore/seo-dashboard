"use client";

import Header from "@/components/Header";
import TrafficChart from "@/components/TrafficChart";
import RadarChart from "@/components/RadarChart";
import ChannelChart from "@/components/ChannelChart";
import AIChart from "@/components/AIChart";
import KeywordTables from "@/components/KeywordTables";
import ComparisonTable from "@/components/ComparisonTable";
import { sites } from "@/lib/data";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <TrafficChart />
          <RadarChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <ChannelChart site={sites[0]} />
          <AIChart />
        </div>

        <div className="mb-4">
          <ComparisonTable />
        </div>

        <div className="mb-4">
          <KeywordTables />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {sites.slice(1).map((site) => (
            <ChannelChart key={site.name} site={site} />
          ))}
        </div>

        <footer className="text-center text-zinc-700 text-xs py-6 border-t border-zinc-800">
          infoyatirim.com SEO Dashboard &middot; Veri kaynağı: Semrush &middot; Haziran 2026
        </footer>
      </div>
    </div>
  );
}

"use client";

import { ExecutiveSummary } from "@/components/ExecutiveSummary";
import { SiteStats } from "@/components/SiteStats";

export default function OverviewPage() {
  return (
    <div className="space-y-5">
      <SiteStats />
      <ExecutiveSummary />
    </div>
  );
}

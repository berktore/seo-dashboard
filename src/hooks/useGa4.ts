"use client";

import { useEffect, useState } from "react";
import { PeriodId } from "@/lib/weekly-data";

export interface Ga4Overview {
  real: boolean;
  property: string;
  rangeLabel: string;
  start: string;
  end: string;
  sessions: number;
  users: number;
  pageviews: number;
  engagementRate: number;
  bounceRate: number;
  avgDurationSec: number;
  prevSessions: number;
  prevUsers: number;
  organicSessions: number;
  organicPrev: number;
  sessionsDelta: number;
  usersDelta: number;
  byDay: { date: string; sessions: number; users: number }[];
  channels: { channel: string; sessions: number; users: number }[];
  topPages: { path: string; sessions: number }[];
}

export function useGa4(period: PeriodId) {
  const [data, setData] = useState<Ga4Overview | null>(null);
  const [real, setReal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(`/api/ga4?period=${period}`)
      .then(r => r.json())
      .then(j => {
        if (!alive) return;
        setReal(Boolean(j.real && j.data));
        setData(j.data || null);
        setLoading(false);
      })
      .catch(() => {
        if (!alive) return;
        setReal(false);
        setData(null);
        setLoading(false);
      });
    return () => { alive = false; };
  }, [period]);

  return { data, real, loading };
}

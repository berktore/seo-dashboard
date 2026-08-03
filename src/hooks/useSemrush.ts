"use client";

import { useEffect, useState } from "react";
import type { SemrushOverview } from "@/lib/semrush";

export function useSemrush() {
  const [data, setData] = useState<SemrushOverview | null>(null);
  const [real, setReal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch("/api/semrush")
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
  }, []);

  return { data, real, loading };
}
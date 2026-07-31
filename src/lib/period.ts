"use client";

import { useState, useEffect, useCallback } from "react";
import { PeriodId } from "./weekly-data";

const KEY = "infoyatirim-period";

export function usePeriod() {
  const [period, setPeriodState] = useState<PeriodId>("month");

  useEffect(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s === "week1" || s === "week2" || s === "week3" || s === "week4" || s === "month") setPeriodState(s);
    } catch { }
  }, []);

  const setPeriod = useCallback((p: PeriodId) => {
    setPeriodState(p);
    try { localStorage.setItem(KEY, p); } catch { }
  }, []);

  return { period, setPeriod };
}

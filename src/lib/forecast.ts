import { SITES } from "@/lib/data";

export interface ForecastPoint {
  month: string;
  actual?: number;
  forecast?: number;
  isForecast: boolean;
}

function predictNext(values: number[]): number {
  if (values.length < 3) return values[values.length - 1] || 0;
  let slopeSum = 0;
  let count = 0;
  for (let i = 1; i < values.length; i++) {
    const d = values[i] - values[i - 1];
    if (isFinite(d)) { slopeSum += d; count++; }
  }
  const avgSlope = slopeSum / count;
  const last = values[values.length - 1];
  const accel = count > 2 ? (values[values.length - 1] - values[values.length - 3]) / 2 - avgSlope : 0;
  return Math.max(0, last + avgSlope + accel * 0.3);
}

export function forecastSite(siteId: string, months = 3): ForecastPoint[] {
  const site = SITES.find(s => s.id === siteId) || SITES[0];
  const actual = site.monthlyVisits.map(m => m.value);
  const labels = site.monthlyVisits.map(m => m.month);
  const out: ForecastPoint[] = labels.map((m, i) => ({ month: m, actual: actual[i], isForecast: false }));

  let next = actual[actual.length - 1];
  const nextLabels = ["Tem", "Ağu", "Eyl"];
  for (let i = 0; i < months; i++) {
    next = predictNext([...actual, ...out.filter(o => o.isForecast).map(o => o.forecast || 0)].slice(-6));
    out.push({ month: nextLabels[i] || `+${i + 1}`, forecast: Math.round(next), isForecast: true });
  }
  return out;
}

export function forecastAll(months = 3): Record<string, ForecastPoint[]> {
  const res: Record<string, ForecastPoint[]> = {};
  for (const s of SITES) res[s.id] = forecastSite(s.id, months);
  return res;
}

export function getForecastInsight(siteId: string): { text: string; direction: "up" | "down" | "flat"; pct: number } {
  const fc = forecastSite(siteId);
  const lastActual = fc.filter(f => !f.isForecast).pop()?.actual || 0;
  const lastForecast = fc.filter(f => f.isForecast).pop()?.forecast || 0;
  const pct = lastActual > 0 ? ((lastForecast - lastActual) / lastActual) * 100 : 0;
  const direction = pct > 5 ? "up" : pct < -5 ? "down" : "flat";
  return { direction, pct: Math.round(pct), text: `3 aylık trend projeksiyonuna göre trafik ${pct > 0 ? "+" : ""}%${Math.round(pct)} yönünde.` };
}

export function forecastChartData(): ForecastPoint[] {
  const site = SITES[0];
  const fc = forecastSite("info", 3);
  const peers = ["gcm", "midas", "isy"];
  return fc.map((p, i) => {
    const row: any = { month: p.month };
    if (p.actual !== undefined) row.info = p.actual;
    if (p.forecast !== undefined) row.infoFc = p.forecast;
    for (const pid of peers) {
      const ps = SITES.find(s => s.id === pid)!;
      row[pid] = i < ps.monthlyVisits.length ? ps.monthlyVisits[i].value : row[pid] = row[pid] ?? undefined;
      if (i >= ps.monthlyVisits.length) row[pid] = undefined;
    }
    return row;
  });
}

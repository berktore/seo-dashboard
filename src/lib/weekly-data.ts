export interface WeeklySnapshot {
  visits: number;
  organic: number;
  paid: number;
  refDomains: number;
  backlinks: number;
}

export type PeriodId = "week1" | "week2" | "week3" | "week4" | "month";

export interface PeriodOption {
  id: PeriodId;
  label: string;
}

export const PERIODS: PeriodOption[] = [
  { id: "week4", label: "Bu Hafta" },
  { id: "week3", label: "Geçen Hafta" },
  { id: "week2", label: "2 Hafta Önce" },
  { id: "week1", label: "3 Hafta Önce" },
  { id: "month", label: "Bu Ay" },
];

const W = {
  info: [
    { visits: 103000, organic: 46000, paid: 500, refDomains: 1810, backlinks: 26800 },
    { visits: 112000, organic: 50000, paid: 480, refDomains: 1825, backlinks: 27000 },
    { visits: 123000, organic: 55000, paid: 550, refDomains: 1835, backlinks: 27150 },
    { visits: 133350, organic: 59900, paid: 600, refDomains: 1840, backlinks: 27290 },
  ],
  gcm: [
    { visits: 480000, organic: 570000, paid: 650000, refDomains: 2470, backlinks: 970000 },
    { visits: 500000, organic: 600000, paid: 680000, refDomains: 2485, backlinks: 972000 },
    { visits: 510000, organic: 610000, paid: 680000, refDomains: 2495, backlinks: 973500 },
    { visits: 520000, organic: 630000, paid: 690000, refDomains: 2500, backlinks: 974770 },
  ],
  isy: [
    { visits: 85000, organic: 690000, paid: 0, refDomains: 3160, backlinks: 69500 },
    { visits: 86000, organic: 695000, paid: 0, refDomains: 3150, backlinks: 69600 },
    { visits: 87000, organic: 698000, paid: 0, refDomains: 3145, backlinks: 69580 },
    { visits: 88460, organic: 700000, paid: 0, refDomains: 3140, backlinks: 69540 },
  ],
  ged: [
    { visits: 75000, organic: 108000, paid: 1100, refDomains: 2240, backlinks: 97800 },
    { visits: 76000, organic: 109000, paid: 1150, refDomains: 2250, backlinks: 97900 },
    { visits: 77000, organic: 110500, paid: 1180, refDomains: 2255, backlinks: 97980 },
    { visits: 78850, organic: 112400, paid: 1280, refDomains: 2260, backlinks: 98030 },
  ],
  midas: [
    { visits: 430000, organic: 280000, paid: 12000, refDomains: 710, backlinks: 11500 },
    { visits: 445000, organic: 295000, paid: 12000, refDomains: 720, backlinks: 11700 },
    { visits: 455000, organic: 305000, paid: 12500, refDomains: 728, backlinks: 11850 },
    { visits: 470000, organic: 320000, paid: 13500, refDomains: 735, backlinks: 12000 },
  ],
  a1c: [
    { visits: 36000, organic: 9800, paid: 2500, refDomains: 790, backlinks: 23000 },
    { visits: 36500, organic: 9600, paid: 2200, refDomains: 795, backlinks: 22800 },
    { visits: 36500, organic: 9400, paid: 2000, refDomains: 798, backlinks: 22700 },
    { visits: 35960, organic: 9220, paid: 1740, refDomains: 802, backlinks: 22640 },
  ],
  tera: [
    { visits: 12500, organic: 17500, paid: 0, refDomains: 355, backlinks: 4200 },
    { visits: 13000, organic: 18200, paid: 0, refDomains: 358, backlinks: 4300 },
    { visits: 13200, organic: 18600, paid: 0, refDomains: 360, backlinks: 4350 },
    { visits: 13520, organic: 19730, paid: 0, refDomains: 363, backlinks: 4400 },
  ],
  osm: [
    { visits: 58000, organic: 4800, paid: 25000, refDomains: 485, backlinks: 7800 },
    { visits: 59000, organic: 5000, paid: 25000, refDomains: 490, backlinks: 7900 },
    { visits: 59500, organic: 5100, paid: 25500, refDomains: 495, backlinks: 7950 },
    { visits: 59850, organic: 5330, paid: 25820, refDomains: 500, backlinks: 8000 },
  ],
  unlu: [
    { visits: 8500, organic: 5200, paid: 0, refDomains: 205, backlinks: 2900 },
    { visits: 8700, organic: 5300, paid: 0, refDomains: 208, backlinks: 2950 },
    { visits: 8800, organic: 5400, paid: 0, refDomains: 210, backlinks: 2980 },
    { visits: 9000, organic: 5700, paid: 0, refDomains: 212, backlinks: 3000 },
  ],
  mrb: [
    { visits: 20000, organic: 7300, paid: 0, refDomains: 95, backlinks: 480 },
    { visits: 20200, organic: 7400, paid: 0, refDomains: 98, backlinks: 500 },
    { visits: 20400, organic: 7500, paid: 0, refDomains: 99, backlinks: 510 },
    { visits: 20537, organic: 7800, paid: 0, refDomains: 100, backlinks: 516 },
  ],
  pus: [
    { visits: 1900, organic: 700, paid: 0, refDomains: 28, backlinks: 180 },
    { visits: 2000, organic: 750, paid: 0, refDomains: 29, backlinks: 190 },
    { visits: 2000, organic: 750, paid: 0, refDomains: 30, backlinks: 195 },
    { visits: 2100, organic: 800, paid: 0, refDomains: 30, backlinks: 200 },
  ],
} as Record<string, WeeklySnapshot[]>;

export function getWeeklyData(siteId: string): WeeklySnapshot[] {
  return W[siteId] || [];
}

export function getPeriodData(siteId: string, period: PeriodId): WeeklySnapshot | null {
  if (period === "month") return null;
  const idx = { week1: 0, week2: 1, week3: 2, week4: 3 }[period];
  const data = getWeeklyData(siteId);
  return data[idx] || null;
}

const WEEK_LABELS = ["1-7 Haz", "8-14 Haz", "15-21 Haz", "22-28 Haz"];

export function getWeekLabel(period: PeriodId): string {
  if (period === "month") return "Haziran 2026";
  const idx = { week1: 0, week2: 1, week3: 2, week4: 3 }[period];
  return WEEK_LABELS[idx] || "";
}

export function getWeekLabels(): string[] {
  return WEEK_LABELS;
}

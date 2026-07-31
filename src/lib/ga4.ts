import "server-only";

import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { PeriodId } from "./weekly-data";

export function hasGa4Config(): boolean {
  return Boolean(process.env.GA4_PROPERTY_ID && process.env.GA4_SERVICE_ACCOUNT_JSON);
}

let client: BetaAnalyticsDataClient | null = null;

function getClient(): BetaAnalyticsDataClient | null {
  try {
    if (!hasGa4Config()) return null;
    if (client) return client;
    const credentials = JSON.parse(process.env.GA4_SERVICE_ACCOUNT_JSON!);
    client = new BetaAnalyticsDataClient({
      credentials,
      projectId: credentials.project_id,
    });
    return client;
  } catch {
    return null;
  }
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function toIso(d: Date): string {
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return toIso(d);
}

export function istanbulToday(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find(p => p.type === t)?.value || "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export interface Ga4DateRange {
  start: string;
  end: string;
  prevStart: string;
  prevEnd: string;
  label: string;
}

export function getDateRange(period: PeriodId): Ga4DateRange {
  const today = istanbulToday();
  if (period === "month") {
    return {
      start: addDays(today, -29),
      end: today,
      prevStart: addDays(today, -59),
      prevEnd: addDays(today, -30),
      label: "Son 30 gün",
    };
  }
  const daysBack = { week1: 27, week2: 20, week3: 13, week4: 6 }[period];
  return {
    start: addDays(today, -daysBack),
    end: today,
    prevStart: addDays(today, -daysBack - 7),
    prevEnd: addDays(today, -daysBack - 1),
    label: "Son 7 gün",
  };
}

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

function num(v: unknown): number {
  return typeof v === "string" ? Number(v) || 0 : 0;
}

export async function fetchGa4Overview(period: PeriodId): Promise<Ga4Overview> {
  const c = getClient();
  if (!c) throw new Error("GA4 yapılandırması eksik");

  const property = `properties/${process.env.GA4_PROPERTY_ID}`;
  const range = getDateRange(period);

  const [cur] = await c.runReport({
    property,
    dateRanges: [{ startDate: range.start, endDate: range.end }],
    metrics: [
      { name: "sessions" },
      { name: "totalUsers" },
      { name: "screenPageViews" },
      { name: "engagementRate" },
      { name: "bounceRate" },
      { name: "averageSessionDuration" },
    ],
  });
  const row = cur.rows?.[0];
  const values = row?.metricValues || [];
  const g = (i: number) => num(values[i]?.value);

  const [prev] = await c.runReport({
    property,
    dateRanges: [{ startDate: range.prevStart, endDate: range.prevEnd }],
    metrics: [{ name: "sessions" }, { name: "totalUsers" }],
  });
  const pv = prev.rows?.[0]?.metricValues || [];
  const prevSessions = num(pv[0]?.value);
  const prevUsers = num(pv[1]?.value);

  const [organic] = await c.runReport({
    property,
    dateRanges: [{ startDate: range.start, endDate: range.end }],
    dimensions: [{ name: "sessionDefaultChannelGroup" }],
    metrics: [{ name: "sessions" }],
    dimensionFilter: {
      filter: {
        fieldName: "sessionDefaultChannelGroup",
        inListFilter: { values: ["Organic Search"] },
      },
    },
  });
  const organicSessions = num(organic.rows?.[0]?.metricValues?.[0]?.value);

  const [organicPrev] = await c.runReport({
    property,
    dateRanges: [{ startDate: range.prevStart, endDate: range.prevEnd }],
    dimensions: [{ name: "sessionDefaultChannelGroup" }],
    metrics: [{ name: "sessions" }],
    dimensionFilter: {
      filter: {
        fieldName: "sessionDefaultChannelGroup",
        inListFilter: { values: ["Organic Search"] },
      },
    },
  });
  const organicPrevVal = num(organicPrev.rows?.[0]?.metricValues?.[0]?.value);

  const [byDay] = await c.runReport({
    property,
    dateRanges: [{ startDate: range.start, endDate: range.end }],
    dimensions: [{ name: "date" }],
    metrics: [{ name: "sessions" }, { name: "totalUsers" }],
    orderBys: [{ dimension: { dimensionName: "date" } }],
  });

  const [channels] = await c.runReport({
    property,
    dateRanges: [{ startDate: range.start, endDate: range.end }],
    dimensions: [{ name: "sessionDefaultChannelGroup" }],
    metrics: [{ name: "sessions" }, { name: "totalUsers" }],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
  });

  const [pages] = await c.runReport({
    property,
    dateRanges: [{ startDate: range.start, endDate: range.end }],
    dimensions: [{ name: "pagePath" }],
    metrics: [{ name: "sessions" }],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    limit: 10,
  });

  const sessions = g(0);
  const users = g(1);

  return {
    real: true,
    property: process.env.GA4_PROPERTY_ID!,
    rangeLabel: range.label,
    start: range.start,
    end: range.end,
    sessions,
    users,
    pageviews: g(2),
    engagementRate: Number((g(3) * 100).toFixed(1)),
    bounceRate: Number((g(4) * 100).toFixed(1)),
    avgDurationSec: Math.round(g(5)),
    prevSessions,
    prevUsers,
    organicSessions,
    organicPrev: organicPrevVal,
    sessionsDelta: prevSessions > 0 ? Number((((sessions - prevSessions) / prevSessions) * 100).toFixed(1)) : 0,
    usersDelta: prevUsers > 0 ? Number((((users - prevUsers) / prevUsers) * 100).toFixed(1)) : 0,
    byDay: (byDay.rows || []).map(r => ({
      date: r.dimensionValues?.[0]?.value || "",
      sessions: num(r.metricValues?.[0]?.value),
      users: num(r.metricValues?.[1]?.value),
    })),
    channels: (channels.rows || []).map(r => ({
      channel: r.dimensionValues?.[0]?.value || "(Diğer)",
      sessions: num(r.metricValues?.[0]?.value),
      users: num(r.metricValues?.[1]?.value),
    })),
    topPages: (pages.rows || []).map(r => ({
      path: r.dimensionValues?.[0]?.value || "/",
      sessions: num(r.metricValues?.[0]?.value),
    })),
  };
}

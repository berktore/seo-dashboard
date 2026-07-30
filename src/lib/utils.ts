export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("tr-TR").format(n);
}

export function formatCompact(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

export function getPositionColor(pos: number): string {
  if (pos === 1) return "text-emerald-400";
  if (pos === 2) return "text-blue-400";
  if (pos === 3) return "text-purple-400";
  return "text-zinc-400";
}

export function getPositionBg(pos: number): string {
  if (pos === 1) return "bg-emerald-500/15 border-emerald-500/25";
  if (pos === 2) return "bg-blue-500/15 border-blue-500/25";
  if (pos === 3) return "bg-purple-500/15 border-purple-500/25";
  return "bg-zinc-800/50 border-zinc-700/50";
}

export const COLORS = {
  info: "#f59e0b",
  gcm: "#3b82f6",
  isy: "#a855f7",
  ged: "#22c55e",
} as const;

export const CHANNEL_COLORS: Record<string, string> = {
  direct: "#f59e0b",
  organic: "#3b82f6",
  referral: "#a855f7",
  social: "#22c55e",
  paid: "#ef4444",
  mail: "#f97316",
};

export const CHANNEL_LABELS: Record<string, string> = {
  direct: "Direkt",
  organic: "Organik",
  referral: "Yönlendirme",
  social: "Sosyal",
  paid: "Reklam",
  mail: "E-posta",
};

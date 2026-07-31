"use client";

import { useState } from "react";
import { SITES } from "@/lib/data";
import { detectAnomalies, getShareOfVoice } from "@/lib/anomalies";
import { forecastSite } from "@/lib/forecast";
import { FileDown, Loader2 } from "lucide-react";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function PdfReport() {
  const [busy, setBusy] = useState(false);

  const buildHtml = (): string => {
    const sov = getShareOfVoice();
    const anomalies = detectAnomalies();
    const fc = forecastSite("info", 3);
    const date = new Date().toLocaleDateString("tr-TR");

    const rows = SITES.map(s => `
      <tr>
        <td><b>${esc(s.name)}</b></td>
        <td>${s.visitsDisplay}</td>
        <td>${s.authorityScore}</td>
        <td>%${s.bounceRate}</td>
        <td>${s.avgDuration}</td>
        <td>${s.totalBacklinks.toLocaleString("tr-TR")}</td>
        <td style="color:${s.organicChange >= 0 ? "#059669" : "#dc2626"}">%${s.organicChange}</td>
        <td>${s.aiTraffic}</td>
      </tr>`).join("");

    const sovRows = sov.map(s => `
      <tr><td>${esc(s.name)}</td><td>%${s.share.toFixed(1)}</td><td>${s.visits.toLocaleString("tr-TR")}</td></tr>`).join("");

    const anomalyRows = anomalies.length
      ? anomalies.map(a => `<li><b>${esc(a.siteName)}</b> — ${esc(a.title)}: ${esc(a.description)}</li>`).join("")
      : "<li>Anomali tespit edilmedi.</li>";

    const fcRows = fc.map(f => `<tr><td>${f.month}</td><td>${f.actual ? f.actual.toLocaleString("tr-TR") + "K" : "-"}</td><td>${f.forecast ? f.forecast.toLocaleString("tr-TR") + "K" : "-"}</td><td>${f.isForecast ? "Tahmin" : "Gerçek"}</td></tr>`).join("");

    return `<!DOCTYPE html>
<html lang="tr"><head><meta charset="utf-8">
<title>SEO Raporu - infoyatirim.com</title>
<style>
  body { font-family: Arial, sans-serif; color: #111; margin: 32px; }
  h1 { color: #b45309; border-bottom: 2px solid #f59e0b; padding-bottom: 8px; }
  h2 { color: #374151; margin-top: 28px; }
  table { border-collapse: collapse; width: 100%; font-size: 12px; margin-top: 8px; }
  th { background: #f59e0b; color: #fff; padding: 7px 9px; text-align: left; }
  td { border: 1px solid #e5e7eb; padding: 6px 9px; }
  tr:nth-child(even) { background: #f9fafb; }
  ul { font-size: 12px; line-height: 1.7; }
  .meta { color: #6b7280; font-size: 12px; }
  .footer { margin-top: 32px; color: #9ca3af; font-size: 10px; border-top: 1px solid #e5e7eb; padding-top: 12px; }
</style></head><body>
<h1>SEO Performans Raporu — infoyatirim.com</h1>
<p class="meta">Rapor tarihi: ${date} · Kaynak: Semrush, Haziran 2026</p>

<h2>1. Pazar Özeti</h2>
<table>
<tr><th>Site</th><th>Ziyaret</th><th>AS</th><th>Hemen Çıkma</th><th>Süre</th><th>Backlink</th><th>Organik Δ</th><th>AI Trafik</th></tr>
${rows}
</table>

<h2>2. Pazar Payı (Share of Voice)</h2>
<table><tr><th>Site</th><th>Pay</th><th>Aylık Ziyaret</th></tr>${sovRows}</table>

<h2>3. Trafik Tahmini (infoyatirim.com, 3 ay)</h2>
<table><tr><th>Ay</th><th>Gerçek</th><th>Tahmin</th><th>Tür</th></tr>${fcRows}</table>

<h2>4. Anomali Tespiti</h2>
<ul>${anomalyRows}</ul>

<div class="footer">Bu rapor otomatik üretilmiştir. Yatırım tavsiyesi değildir. © infoyatirim-dashboard</div>
</body></html>`;
  };

  const download = () => {
    setBusy(true);
    setTimeout(() => {
      const html = buildHtml();
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `seo-rapor-${new Date().toISOString().slice(0, 10)}.html`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      const w = window.open("", "_blank");
      if (w) {
        w.document.write(html);
        w.document.close();
      }
      setBusy(false);
    }, 300);
  };

  return (
    <button onClick={download}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-800 text-zinc-500 hover:text-zinc-300 bg-zinc-900/60 transition-all">
      {busy ? <Loader2 size={14} className="animate-spin" /> : <FileDown size={14} />}
      PDF Rapor
    </button>
  );
}

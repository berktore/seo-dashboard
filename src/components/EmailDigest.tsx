"use client";

import { useState, useEffect } from "react";
import { SITES } from "@/lib/data";
import { formatCompact } from "@/lib/utils";
import { Mail, Send, Check, Bell } from "lucide-react";

const STORAGE_KEY = "infoyatirim-email";

export function EmailDigest() {
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s) { setEmail(JSON.parse(s)); setSaved(true); }
    } catch { }
  }, []);

  const save = () => {
    if (!email.includes("@")) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(email));
    setSaved(true);
  };

  const buildBody = (): string => {
    const info = SITES[0];
    const leader = [...SITES].sort((a, b) => b.visits - a.visits)[0];
    const lines = [
      "Haftalık SEO Özeti — infoyatirim.com",
      "===============================",
      "",
      `Ziyaret: ${info.visitsDisplay} (pazar payı %${((info.visits / SITES.reduce((a, s) => a + s.visits, 0)) * 100).toFixed(1)})`,
      `AS: ${info.authorityScore} · Hemen Çıkma: %${info.bounceRate} · Backlink: ${formatCompact(info.totalBacklinks)}`,
      `Organik değişim: %${info.organicChange} · En büyük rakip: ${leader.name} (${leader.visitsDisplay})`,
      "",
      "Detaylı rapor: https://infoyatirim-dashboard.vercel.app",
    ];
    return encodeURIComponent(lines.join("\n"));
  };

  const send = () => {
    if (!email.includes("@")) return;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent("Haftalık SEO Özeti — infoyatirim.com")}&body=${buildBody()}`;
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="hidden md:flex items-center gap-1.5">
        <Mail size={13} className="text-zinc-600" />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") save(); }}
          placeholder="haftalık özet e-postası"
          className="w-44 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
        />
      </div>
      <button onClick={save}
        className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-medium rounded-lg border border-zinc-800 text-zinc-500 hover:text-zinc-300 transition-all">
        {saved ? <Check size={11} className="text-emerald-400" /> : <Bell size={11} />}
        {saved ? "Kayıtlı" : "Kaydet"}
      </button>
      <button onClick={send}
        className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-medium rounded-lg border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 transition-all">
        {sent ? <Check size={11} /> : <Send size={11} />}
        {sent ? "Hazır!" : "Gönder"}
      </button>
    </div>
  );
}

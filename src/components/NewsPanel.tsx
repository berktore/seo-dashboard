"use client";

import { useState, useEffect, useCallback } from "react";
import { NewsItem } from "@/lib/news";
import { generateGeoSeoArticle, articleToMarkdown, GeneratedArticle } from "@/lib/blog-writer";
import { cn } from "@/lib/utils";
import {
  Newspaper, RefreshCw, ExternalLink, X, FileText, Sparkles,
  Copy, Check, Download, ChevronRight, Loader2, Clock, WifiOff,
} from "lucide-react";

interface NewsResponse {
  ok: boolean;
  fetched: boolean;
  updatedAt: string;
  sources: string[];
  news: NewsItem[];
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "az önce";
  if (m < 60) return `${m} dk önce`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} saat önce`;
  return `${Math.floor(h / 24)} gün önce`;
}

export function NewsPanel() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [selected, setSelected] = useState<NewsItem | null>(null);
  const [article, setArticle] = useState<GeneratedArticle | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/news", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data: NewsResponse = await res.json();
      setNews(data.news);
      setSources(data.sources);
      setLastUpdate(data.updatedAt);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = sourceFilter === "all" ? news : news.filter(n => n.source === sourceFilter);

  const openNews = (n: NewsItem) => {
    setSelected(n);
    setArticle(null);
  };

  const generate = () => {
    if (!selected) return;
    setGenerating(true);
    setTimeout(() => {
      setArticle(generateGeoSeoArticle(selected));
      setGenerating(false);
    }, 600);
  };

  const copyArticle = async () => {
    if (!selected || !article) return;
    try {
      await navigator.clipboard.writeText(articleToMarkdown(article, selected));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { }
  };

  const downloadMd = () => {
    if (!selected || !article) return;
    const blob = new Blob([articleToMarkdown(article, selected)], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${article.slug}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-blue-500/10">
              <Newspaper size={14} className="text-blue-400" />
            </div>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Finans Haberleri</span>
            <span className={cn("flex items-center gap-1 text-[10px]",
              error ? "text-red-400" : "text-emerald-500")}>
              {error ? <><WifiOff size={10} /> Canlı veriye ulaşılamadı</> : <><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Canlı</>}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-600 hidden sm:block">
              {lastUpdate ? `Güncelleme: ${new Date(lastUpdate).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}` : "6 kaynak taranıyor"}
            </span>
            <button onClick={load} disabled={loading}
              className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-medium rounded-lg border border-zinc-800 text-zinc-500 hover:text-zinc-300 transition-all disabled:opacity-50">
              <RefreshCw size={11} className={cn(loading && "animate-spin")} />
              Tara
            </button>
          </div>
        </div>

        {/* Source filter */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button onClick={() => setSourceFilter("all")}
            className={cn("px-2.5 py-1 text-[10px] font-medium rounded-md whitespace-nowrap transition-all",
              sourceFilter === "all" ? "bg-zinc-700 text-zinc-100" : "text-zinc-600 hover:text-zinc-400")}>
            Tümü ({news.length})
          </button>
          {sources.map(s => (
            <button key={s} onClick={() => setSourceFilter(s)}
              className={cn("px-2.5 py-1 text-[10px] font-medium rounded-md whitespace-nowrap transition-all",
                sourceFilter === s ? "bg-zinc-700 text-zinc-100" : "text-zinc-600 hover:text-zinc-400")}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* News list */}
      {loading ? (
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 p-10 flex flex-col items-center gap-2">
          <Loader2 size={20} className="animate-spin text-zinc-600" />
          <span className="text-xs text-zinc-600">Finans siteleri taranıyor…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 p-10 text-center text-xs text-zinc-600">
          Bu kaynaktan haber bulunamadı.
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm divide-y divide-zinc-800/50">
          {filtered.map(n => (
            <button key={n.id} onClick={() => openNews(n)}
              className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-zinc-800/30 transition-all group">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">{n.source}</span>
                  <span className="text-[10px] text-zinc-600 flex items-center gap-1">
                    <Clock size={9} /> {timeAgo(n.publishedAt)}
                  </span>
                </div>
                <div className="text-sm font-medium text-zinc-100 leading-snug group-hover:text-white">{n.title}</div>
                {n.summary && n.summary !== n.title && (
                  <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2">{n.summary}</p>
                )}
              </div>
              <ChevronRight size={14} className="text-zinc-700 group-hover:text-zinc-400 mt-1 shrink-0 transition-all" />
            </button>
          ))}
        </div>
      )}

      <p className="text-[10px] text-zinc-700 flex items-center gap-1.5">
        <FileText size={10} />
        Kaynaklar: Bloomberg HT, Ekonomim, Dünya, Fortune Türkiye, Investing.com TR, Hürriyet Ekonomi · Habere tıklayıp GEO+SEO uyumlu blog yazısı üretebilirsiniz.
      </p>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => { setSelected(null); setArticle(null); }}>
          <div className="w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-xl border border-zinc-700/60 bg-zinc-950 shadow-2xl" onClick={e => e.stopPropagation()}>
            {!article ? (
              <>
                {/* News detail */}
                <div className="p-5 border-b border-zinc-800/60">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">{selected.source}</span>
                      <span className="text-[10px] text-zinc-600">{timeAgo(selected.publishedAt)}</span>
                    </div>
                    <button onClick={() => { setSelected(null); setArticle(null); }} className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-500 transition-all">
                      <X size={14} />
                    </button>
                  </div>
                  <h3 className="text-base font-semibold text-zinc-100 leading-snug mb-3">{selected.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">{selected.summary}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <a href={selected.link} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-all">
                      <ExternalLink size={11} /> Kaynakta oku
                    </a>
                    <button onClick={generate} disabled={generating}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-lg bg-amber-500 text-black hover:bg-amber-400 transition-all disabled:opacity-60">
                      {generating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                      Blog Yazısı Üret
                    </button>
                  </div>
                </div>
                <div className="p-4 text-[11px] text-zinc-600 leading-relaxed">
                  Blog yazısı üretildiğinde; SEO başlığı, meta açıklama, anahtar kelime seti, öne çıkan snippet'e uygun giriş,
                  başlık yapısı, SSS blokları ve iç bağlantı önerileriyle birlikte hazırlanır. Yatırım tavsiyesi değildir.
                </div>
              </>
            ) : (
              <>
                {/* Article view */}
                <div className="p-5 border-b border-zinc-800/60">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-amber-500/10">
                        <Sparkles size={13} className="text-amber-400" />
                      </div>
                      <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Üretilen Yazı</span>
                      <span className="text-[10px] text-zinc-600">~{article.wordCount} kelime</span>
                    </div>
                    <button onClick={() => { setSelected(null); setArticle(null); }} className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-500 transition-all">
                      <X size={14} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* SEO box */}
                    <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-amber-400 mb-2">SEO Paketi</div>
                      <div className="space-y-1.5 text-[11px]">
                        <div><span className="text-zinc-600">Başlık:</span> <span className="text-zinc-200 font-medium">{article.seoTitle}</span></div>
                        <div><span className="text-zinc-600">Slug:</span> <span className="font-mono text-blue-400">/{article.slug}</span></div>
                        <div><span className="text-zinc-600">Meta:</span> <span className="text-zinc-400">{article.metaDescription}</span></div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 font-semibold">{article.primaryKeyword}</span>
                          {article.secondaryKeywords.map(k => (
                            <span key={k} className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">{k}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button onClick={copyArticle}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-all">
                        {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                        {copied ? "Kopyalandı" : "Markdown Kopyala"}
                      </button>
                      <button onClick={downloadMd}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-all">
                        <Download size={11} /> .md İndir
                      </button>
                      <button onClick={generate} disabled={generating}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-lg border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 transition-all">
                        {generating ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />}
                        Yeniden Üret
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-5">
                  <div>
                    <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-600 mb-1.5">Giriş (Featured Snippet Hedefi)</div>
                    <p className="text-xs text-zinc-300 leading-relaxed">{article.intro}</p>
                  </div>
                  {article.sections.map((s, i) => (
                    <div key={i}>
                      <div className="text-xs font-semibold text-zinc-100 mb-1.5">{i + 1}. {s.heading}</div>
                      <p className="text-xs text-zinc-400 leading-relaxed">{s.content}</p>
                    </div>
                  ))}
                  <div>
                    <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-600 mb-1.5">Sık Sorulan Sorular (GEO)</div>
                    <div className="space-y-2">
                      {article.faq.map((f, i) => (
                        <div key={i} className="rounded-lg border border-zinc-800/60 bg-zinc-900/60 p-3">
                          <div className="text-[11px] font-semibold text-zinc-200 mb-1">{f.q}</div>
                          <p className="text-[11px] text-zinc-500 leading-relaxed">{f.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-600 mb-1.5">İç Bağlantı Önerileri</div>
                    <div className="flex flex-wrap gap-1.5">
                      {article.internalLinks.map(l => (
                        <span key={l} className="text-[10px] font-mono px-2 py-1 rounded bg-zinc-800/60 text-blue-400">{l}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-700 leading-relaxed border-t border-zinc-800/60 pt-3">
                    Kaynak: {selected.source} · Güncelleme: {article.updatedAt} · Bu içerik otomatik üretilmiştir, yatırım tavsiyesi değildir.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

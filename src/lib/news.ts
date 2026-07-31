export interface NewsSource {
  id: string;
  name: string;
  url: string;
}

export interface NewsItem {
  id: string;
  source: string;
  title: string;
  link: string;
  publishedAt: string;
  summary: string;
}

export const NEWS_SOURCES: NewsSource[] = [
  { id: "bloomberght", name: "Bloomberg HT", url: "https://www.bloomberght.com/rss" },
  { id: "ekonomim", name: "Ekonomim", url: "https://www.ekonomim.com/rss" },
  { id: "dunya", name: "Dünya", url: "https://www.dunya.com/rss" },
  { id: "fortune", name: "Fortune Türkiye", url: "https://www.fortuneturkey.com/rss" },
  { id: "investing", name: "Investing.com TR", url: "https://tr.investing.com/rss/news.rss" },
  { id: "hurriyet", name: "Hürriyet Ekonomi", url: "https://www.hurriyet.com.tr/rss/ekonomi" },
];

function stripHtml(input: string): string {
  return input
    .replace(/<!\[CDATA\[/g, "")
    .replace(/\]\]>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function parseDate(raw: string): string {
  const d = new Date(raw);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

export function parseRss(xml: string, sourceId: string): NewsItem[] {
  const sourceName = NEWS_SOURCES.find(s => s.id === sourceId)?.name || sourceId;
  const items: NewsItem[] = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  let m: RegExpExecArray | null;
  while ((m = itemRe.exec(xml)) !== null) {
    const block = m[1];
    const grab = (tag: string) => {
      const r = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i").exec(block);
      return r ? stripHtml(r[1]) : "";
    };
    const title = grab("title");
    const link = grab("link");
    if (!title || !link) continue;
    items.push({
      id: `${sourceId}-${items.length}-${title.slice(0, 32)}`,
      source: sourceName,
      title,
      link,
      publishedAt: parseDate(grab("pubDate")),
      summary: grab("description").slice(0, 300) || title,
    });
  }
  return items;
}

export const FALLBACK_NEWS: NewsItem[] = [
  {
    id: "fb-1", source: "Bloomberg HT", title: "TCMB faiz kararını açıkladı: Politika faizi yüzde 33,5'e indirildi",
    link: "https://www.bloomberght.com", publishedAt: new Date(Date.now() - 2 * 3600e3).toISOString(),
    summary: "Merkez Bankası Para Politikası Kurulu, politika faizini 250 baz puan indirerek yüzde 33,5 seviyesine çekti. Karar metninde enflasyondaki düşüş eğiliminin sürdüğü vurgulandı.",
  },
  {
    id: "fb-2", source: "Ekonomim", title: "BIST 100 güne yükselişle başladı: Bankacılık endeksi öne çıktı",
    link: "https://www.ekonomim.com", publishedAt: new Date(Date.now() - 5 * 3600e3).toISOString(),
    summary: "Borsa İstanbul'da BIST 100 endeksi yeni güne alıcılı başladı. Bankacılık hisselerindeki güçlü görünüm endekse destek veriyor. Analistler kısa vadede direnç bölgesini işaret ediyor.",
  },
  {
    id: "fb-3", source: "Dünya", title: "Enflasyon haziran verisi: TÜFE aylık yüzde 1,7 arttı, yıllık yüzde 28,4",
    link: "https://www.dunya.com", publishedAt: new Date(Date.now() - 26 * 3600e3).toISOString(),
    summary: "TÜİK verilerine göre haziran ayında TÜFE aylık yüzde 1,7, yıllık yüzde 28,4 oldu. Çekirdek enflasyondaki gerileme sürerken hizmet kalemleri yukarı yönlü seyrini korudu.",
  },
  {
    id: "fb-4", source: "Fortune Türkiye", title: "Altın fiyatlarında rekor: Ons altın 5.500 doları aştı",
    link: "https://www.fortuneturkey.com", publishedAt: new Date(Date.now() - 30 * 3600e3).toISOString(),
    summary: "Küresel piyasalarda ons altın tarihi zirvesini yeniledi. Merkez bankalarının alımları ve jeopolitik belirsizlikler altına olan talebi destekliyor. Yurt içinde gram altın da rekor tazeledi.",
  },
  {
    id: "fb-5", source: "Investing.com TR", title: "Halka arz takviminde yoğun dönem: Üç şirket için talep toplama süreci başlıyor",
    link: "https://tr.investing.com", publishedAt: new Date(Date.now() - 3 * 24 * 3600e3).toISOString(),
    summary: "Ağustos ayına üç halka arz damga vuracak. Kardemir Çelik, Albayrak Hazır Beton ve Masfen Enerji'nin talep toplama tarihleri SPK izahnamesi sonrası netleşecek.",
  },
  {
    id: "fb-6", source: "Hürriyet Ekonomi", title: "Borsa İstanbul'da yabancı ilgisi arttı: Haftalık net giriş 400 milyon dolar",
    link: "https://www.hurriyet.com.tr", publishedAt: new Date(Date.now() - 4 * 24 * 3600e3).toISOString(),
    summary: "Yurt dışı yerleşiklerin BIST hisse piyasasında haftalık net alımı 400 milyon dolar seviyesinde gerçekleşti. Yıl başından bu yana toplam giriş 2,8 milyar dolara ulaştı.",
  },
];

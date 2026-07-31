import { NewsItem } from "./news";

export interface GeneratedArticle {
  slug: string;
  seoTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  intro: string;
  sections: { heading: string; content: string }[];
  faq: { q: string; a: string }[];
  internalLinks: string[];
  wordCount: number;
  updatedAt: string;
}

const STOP_WORDS = new Set([
  "ve", "ile", "için", "olarak", "sonra", "önce", "göre", "kadar", "yeni", "bir", "bu", "o",
  "en", "çok", "daha", "da", "de", "ne", "nasıl", "neden", "hangi", "üzere", "yüzde", "oranı",
  "oran", "açıklandı", "açıkladı", "başladı", "devam", "etti", "oldu", "olacak", "sürecek",
]);

function pickKeyword(title: string): string {
  const words = title
    .toLowerCase()
    .replace(/[^\wçğıöşüÇĞİÖŞÜ ]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));
  const ngrams: string[] = [];
  for (let n = Math.min(3, words.length); n >= 1; n--) {
    for (let i = 0; i + n <= words.length; i++) {
      const g = words.slice(i, i + n).join(" ");
      if (!STOP_WORDS.has(words[i])) ngrams.push(g);
    }
  }
  return ngrams[0] || words.slice(0, 2).join(" ") || "finans";
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\wçğıöşüÇĞİÖŞÜ ]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 8)
    .join("-");
}

function toTitle(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function generateGeoSeoArticle(news: NewsItem): GeneratedArticle {
  const primary = pickKeyword(news.title);
  const date = new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
  const source = news.source;
  const kwParts = primary.split(" ");

  const secondaryKeywords = [
    `${primary} yorum`,
    `${primary} neden yükseldi`,
    kwParts.length > 1 ? `${kwParts.slice(1).join(" ")} beklentisi` : `${primary} analizi`,
    `${primary} yatırım`,
  ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 3);

  const seoTitle = `${toTitle(primary)} Nedir? ${toTitle(news.title)} — Güncel Analiz (${new Date().getFullYear()})`;
  const metaDescription = `${toTitle(news.title)}. ${toTitle(primary)} ile ilgili son gelişmeler, uzman yorumları, piyasa beklentileri ve yatırımcılar için kritik başlıklar — güncel ve yatırım tavsiyesi içermeyen rehber.`;

  const intro = `${toTitle(news.title)}. Bu gelişme, ${primary} konusunda piyasaların yakın takibinde olan yatırımcılar için önemli bir gündem başlığı oluşturdu. ${source} kaynaklı habere göre gelişmenin etkileri; borsa, döviz, altın ve faiz cephesinde yakından izleniyor. Yazımızda ${primary} başlığına dair merak edilenleri, öne çıkan detayları ve yatırımcılar için dikkat edilmesi gereken noktaları derledik.`;

  const sections = [
    {
      heading: `${toTitle(primary)} Nedir?`,
      content: `${toTitle(primary)}; yatırımcıların portföy kararlarını doğrudan etkileyen ve piyasa fiyatlamalarında belirleyici olan başlıklardan biridir. ${source} tarafından duyurulan son gelişmeyle birlikte konunun gündemdeki ağırlığı arttı. Bu tür başlıklarda izlenmesi gereken temel unsurlar; resmi açıklamalar, kurum görüşleri, piyasa verileri ve uzun vadeli trendlerdir.`,
    },
    {
      heading: `Son Gelişme: ${toTitle(news.title)}`,
      content: `${news.summary} Gelişme, konuya ilişkin beklentilerin yeniden şekillenmesine neden olurken, uzmanlar konunun piyasalara yansımasını yakından takip ediyor.`,
    },
    {
      heading: "Piyasalar İçin Ne İfade Ediyor?",
      content: `Bu tür gelişmeler; hisse senedi, döviz ve emtia piyasalarında kısa vadeli fiyat hareketlerine yol açabildiği gibi orta vadede sektörel rotasyonu da tetikleyebilir. Yatırımcıların, gelişmenin doğrudan etkilediği varlık gruplarını ve ilgili şirketleri takip etmesi önem taşıyor. Beklenti kanalında kalıcı değişim yaratan gelişmelerde, piyasa tepkilerinin genellikle ilk günlerde yoğunlaştığı görülüyor.`,
    },
    {
      heading: "Yatırımcılar İçin Dikkat Edilmesi Gerekenler",
      content: `Yatırım kararı almadan önce; gelişmenin resmi kaynaklardan teyit edilmesi, etkilenen şirketlerin finansal tablolarının incelenmesi ve portföy çeşitlendirmesine özen gösterilmesi gerekiyor. Piyasa haberlerine dayalı kısa vadeli işlemler yüksek risk taşır; bu nedenle kararların kişisel risk profiline uygun olarak uzman görüşüyle birlikte verilmesi önerilir. İçerik yatırım tavsiyesi değildir.`,
    },
  ];

  const faq = [
    {
      q: `${toTitle(primary)} ne anlama geliyor?`,
      a: `${toTitle(primary)}; piyasa gündemindeki gelişmelerle birlikte yatırımcıların en çok araştırdığı başlıklardan biri haline geldi. Konuya ilişkin son durum ${source} kaynaklı haberle güncellendi ve piyasa katılımcıları tarafından yakından izleniyor.`,
    },
    {
      q: `${toTitle(primary)} yatırımcıları nasıl etkiler?`,
      a: `Gelişmenin etkisi; ilgili varlık grubuna, piyasa koşullarına ve kurumsal görüşlere göre değişir. Kısa vadede volatilite artabilir; orta vadede ise temel dinamikler belirleyici olur. Kararlar kişisel risk toleransına göre verilmelidir.`,
    },
    {
      q: `${toTitle(primary)} hakkında güncel bilgiler nereden takip edilir?`,
      a: `Güncel bilgiler için KAP bildirimleri, ${source} ve diğer güvenilir finans haber kaynakları ile borsa veri platformları takip edilebilir. Bilgi kirliliğine karşı yalnızca resmi ve teyit edilmiş kaynaklardan beslenilmesi önerilir.`,
    },
  ];

  const internalLinks = [
    "/canli-borsa",
    "/halka-arz-takvimi",
    "/sermaye-artirimi",
    "/endeks/bist-100",
  ];

  const wordCount = [intro, ...sections.map(s => s.content), ...faq.map(f => `${f.q} ${f.a}`)]
    .join(" ").split(/\s+/).length;

  return {
    slug: slugify(news.title),
    seoTitle,
    metaDescription,
    primaryKeyword: primary,
    secondaryKeywords,
    intro,
    sections,
    faq,
    internalLinks,
    wordCount,
    updatedAt: date,
  };
}

export function articleToMarkdown(article: GeneratedArticle, news: NewsItem): string {
  const lines = [
    `# ${article.seoTitle}`,
    ``,
    `> ${article.metaDescription}`,
    ``,
    `- **Birincil anahtar kelime:** ${article.primaryKeyword}`,
    `- **İkincil anahtar kelimeler:** ${article.secondaryKeywords.join(", ")}`,
    `- **Kaynak:** ${news.source}`,
    `- **Güncellenme:** ${article.updatedAt}`,
    ``,
    `## Giriş`,
    article.intro,
    ``,
    ...article.sections.flatMap(s => [`## ${s.heading}`, s.content, ``]),
    `## Sık Sorulan Sorular`,
    ...article.faq.flatMap(f => [`### ${f.q}`, f.a, ``]),
    `## İlgili İçerikler`,
    ...article.internalLinks.map(l => `- ${l}`),
    ``,
    `---`,
    ``,
    `*Bu içerik otomatik olarak üretilmiştir ve yatırım tavsiyesi değildir. Kaynak: ${news.link}*`,
  ];
  return lines.join("\n");
}

import { SITES } from "@/lib/data";

export interface KeywordGap {
  keyword: string;
  competitorId: string;
  competitorName: string;
  competitorPosition: number;
  competitorVolume: number;
  relevance: "yüksek" | "orta" | "düşük";
}

export interface ContentSuggestion {
  title: string;
  targetKeyword: string;
  volume: number;
  reason: string;
  priority: "yüksek" | "orta" | "düşük";
}

export function findKeywordGaps(): KeywordGap[] {
  const infoKeywords = new Set(SITES[0].keywords.map(k => k.keyword));
  const gaps: KeywordGap[] = [];

  for (const site of SITES.slice(1)) {
    for (const kw of site.keywords) {
      if (!infoKeywords.has(kw.keyword) && kw.volume >= 1000) {
        gaps.push({
          keyword: kw.keyword,
          competitorId: site.id,
          competitorName: site.name,
          competitorPosition: kw.position,
          competitorVolume: kw.volume,
          relevance: kw.volume >= 500000 ? "yüksek" : kw.volume >= 50000 ? "orta" : "düşük",
        });
      }
    }
  }

  gaps.sort((a, b) => b.competitorVolume - a.competitorVolume);
  return gaps.slice(0, 20);
}

export function generateContentSuggestions(): ContentSuggestion[] {
  const gaps = findKeywordGaps();
  const suggestions: ContentSuggestion[] = [];

  const templates: Record<string, string> = {
    "altın": "Altın fiyatları sayfası oluşturup güncel ons, gram ve çeyrek altın bilgilerini canlı verilerle sun.",
    "ons altın": "Ons altın sayfası: küresel piyasalarda ons altın fiyatı, grafikler ve yorumlar.",
    "çeyrek altın": "Çeyrek altın fiyatı sayfası: canlı çeyrek altın kuru, hesaplama aracı ve geçmiş veriler.",
    "sasa": "SASA Polyester hisse analizi: güncel fiyat, teknik analiz, temettü ve beklentiler.",
    "aselsan": "ASELSAN hisse senedi analizi: şirket değerlemesi, çeyreklik bilanço ve hedef fiyat.",
    "tüpraş": "TÜPRAŞ hisse analizi: temettü verileri, kapasite kullanımı ve sektör karşılaştırması.",
    "bist 100": "BIST 100 endeksi canlı takip: bileşen hisseler, sektör ağırlıkları ve günlük yorum.",
    "temettü": "Temettü takvimi ve hesaplama aracı: hisse başı temettü, verim ve dağıtım oranları.",
    "fon": "Yatırım fonu karşılaştırma aracı: risk seviyesi, getiri ve portföy dağılımı.",
    "kredi": "Kredi hesaplama ve karşılaştırma: ihtiyaç, konut, taşıt kredisi oranları.",
  };

  for (const gap of gaps) {
    const matched = Object.entries(templates).find(([key]) => gap.keyword.includes(key));
    if (matched) {
      suggestions.push({
        title: matched[1].split(":")[0],
        targetKeyword: gap.keyword,
        volume: gap.competitorVolume,
        reason: `Rakip ${gap.competitorName} bu kelimede #${gap.competitorPosition} sırada. Sende hiç yok.`,
        priority: gap.relevance === "yüksek" ? "yüksek" : gap.relevance === "orta" ? "orta" : "düşük",
      });
    }
  }

  const unmatched = gaps.filter(g => !Object.keys(templates).some(k => g.keyword.includes(k)));
  for (const gap of unmatched.slice(0, 3)) {
    suggestions.push({
      title: `${gap.keyword} sayfası`,
      targetKeyword: gap.keyword,
      volume: gap.competitorVolume,
      reason: `Rakip ${gap.competitorName} sıralıyor (##${gap.competitorPosition}). Hacim: ${gap.competitorVolume.toLocaleString()}.`,
      priority: "orta",
    });
  }

  return suggestions.sort((a, b) => b.priority === "yüksek" ? 1 : -1);
}

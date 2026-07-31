export interface MarketQuote {
  symbol: string;
  name: string;
  price: number;
  prevClose: number;
  changePct: number;
  high52w: number;
  low52w: number;
  currency: string;
}

export const MARKET_QUOTES: MarketQuote[] = [
  { symbol: "XU100", name: "BIST 100", price: 13326.86, prevClose: 13292.9, changePct: 0.26, high52w: 15204.9, low52w: 10053.7, currency: "TRY" },
  { symbol: "THYAO", name: "Türk Hava Yolları", price: 310.5, prevClose: 308.25, changePct: 0.73, high52w: 355.5, low52w: 262.75, currency: "TRY" },
  { symbol: "SASA", name: "SASA Polyester", price: 2.46, prevClose: 2.48, changePct: -0.81, high52w: 5.66, low52w: 2.13, currency: "TRY" },
  { symbol: "ASELS", name: "ASELSAN", price: 346.5, prevClose: 337.5, changePct: 2.67, high52w: 450.0, low52w: 167.0, currency: "TRY" },
  { symbol: "GARAN", name: "Garanti BBVA", price: 123.3, prevClose: 123.1, changePct: 0.16, high52w: 169.7, low52w: 115.4, currency: "TRY" },
  { symbol: "AKBNK", name: "Akbank", price: 62.3, prevClose: 61.6, changePct: 1.14, high52w: 93.5, low52w: 53.05, currency: "TRY" },
  { symbol: "EREGL", name: "Ereğli Demir", price: 42.34, prevClose: 42.4, changePct: -0.14, high52w: 45.1, low52w: 23.46, currency: "TRY" },
  { symbol: "TUPRS", name: "Tüpraş", price: 290.0, prevClose: 288.0, changePct: 0.69, high52w: 320.25, low52w: 159.2, currency: "TRY" },
  { symbol: "BIMAS", name: "BİM", price: 384.25, prevClose: 383.0, changePct: 0.33, high52w: 425.0, low52w: 241.63, currency: "TRY" },
  { symbol: "KCHOL", name: "Koç Holding", price: 192.9, prevClose: 191.5, changePct: 0.73, high52w: 229.1, low52w: 146.0, currency: "TRY" },
  { symbol: "USDTRY", name: "USD/TRY", price: 47.52, prevClose: 47.37, changePct: 0.32, high52w: 47.53, low52w: 40.51, currency: "TRY" },
  { symbol: "XAUUSD", name: "Ons Altın", price: 4128.3, prevClose: 4100.1, changePct: 0.69, high52w: 5586.2, low52w: 3272.9, currency: "USD" },
];

export const MARKET_UPDATED_AT = "31 Temmuz 2026 08:02 (UTC)";

export interface IpoEvent {
  company: string;
  sector: string;
  price?: string;
  status: "bekleniyor" | "talep_acik" | "tamamlandi";
  statusLabel: string;
  details: string;
}

export const IPO_EVENTS: IpoEvent[] = [
  {
    company: "Kardemir Çelik Sanayi AŞ",
    sector: "Ağır Sanayi",
    price: "35,00 TL",
    status: "bekleniyor",
    statusLabel: "Talep Toplama Yaklaşıyor",
    details: "Sermaye artırımı 110 milyon TL + ortak satışı 18 milyon TL. Talep tarihi KAP izahnamesi sonrası kesinleşecek (Ağustos bekleniyor).",
  },
  {
    company: "Albayrak Hazır Beton",
    sector: "İnşaat",
    status: "bekleniyor",
    statusLabel: "SPK Onaylı",
    details: "Mevcut sermaye 201M TL → 250M TL. Sermaye artırımı: 49 milyon TL nominal. Talep toplama Temmuz sonu/Ağustos.",
  },
  {
    company: "Masfen Enerji AŞ",
    sector: "Enerji",
    status: "bekleniyor",
    statusLabel: "SPK Onaylı",
    details: "SPK onayı alan şirketler arasında. İzahname yayımlandığında talep tarihi netleşecek.",
  },
  {
    company: "Metgün Enerji Yatırımları AŞ",
    sector: "Enerji",
    status: "bekleniyor",
    statusLabel: "SPK Onaylı",
    details: "SPK onayı alan şirketler arasında. Temmuz sonu - Ağustos döneminde talep toplaması bekleniyor.",
  },
];

export function marketSummary(): string {
  const up = MARKET_QUOTES.filter(q => q.changePct > 0).length;
  const down = MARKET_QUOTES.filter(q => q.changePct < 0).length;
  const xu100 = MARKET_QUOTES[0];
  const top = [...MARKET_QUOTES].sort((a, b) => b.changePct - a.changePct)[0];
  return `BIST 100 ${xu100.price.toLocaleString("tr-TR")} puanda (%${xu100.changePct}). ${up} yükselen / ${down} gerileyen emtia-hisse. En çok kazandıran ${top.symbol} (%${top.changePct}).`;
}

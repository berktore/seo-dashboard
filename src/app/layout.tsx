import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SEOLab - SEO Analiz Platformu",
  description: "Profesyonel SEO analiz ve rakip takip platformu",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="dark">
      <body className={`${inter.className} antialiased bg-zinc-950 text-zinc-100`}>
        {children}
      </body>
    </html>
  );
}

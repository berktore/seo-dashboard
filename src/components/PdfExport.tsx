"use client";

import { Printer, Download } from "lucide-react";

export function PdfExport() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button onClick={handlePrint}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-800 text-zinc-500 hover:text-zinc-300 bg-zinc-900/60 transition-all">
      <Printer size={14} />
      Raporu Yazdır
      <Download size={12} className="text-zinc-600" />
    </button>
  );
}

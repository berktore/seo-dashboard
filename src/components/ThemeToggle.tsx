"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const KEY = "infoyatirim-theme";

export function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved !== null) {
        setDark(saved === "dark");
        document.documentElement.classList.toggle("light", saved !== "dark");
      }
    } catch { }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("light", !next);
    localStorage.setItem(KEY, next ? "dark" : "light");
  };

  return (
    <button onClick={toggle} title={dark ? "Açık tema" : "Koyu tema"}
      className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium rounded-lg border border-zinc-800 text-zinc-500 hover:text-zinc-300 bg-zinc-900/60 transition-all">
      {dark ? <Sun size={13} /> : <Moon size={13} />}
      <span className="hidden sm:inline">{dark ? "Açık" : "Koyu"}</span>
    </button>
  );
}

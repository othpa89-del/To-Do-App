import { useState, useEffect } from "react";

// ---------------------------------------------------------------------------
//  Sprache (DE/EN). Inline-Übersetzung über L("deutsch", "english"):
//  An jeder Textstelle stehen beide Sprachen direkt beieinander – kein
//  zentrales Schlüssel-Wörterbuch, daher kein Schlüssel-Mismatch möglich.
//  Die gewählte Sprache wird lokal gespeichert (pro Gerät/Browser).
// ---------------------------------------------------------------------------
export const LANG_KEY = "ctc_lang";
let LANG = "de";
try {
  const s = localStorage.getItem(LANG_KEY);
  if (s === "en" || s === "de") LANG = s;
} catch {}

export function getLang() { return LANG; }

export function setLang(l) {
  LANG = l === "en" ? "en" : "de";
  try { localStorage.setItem(LANG_KEY, LANG); } catch {}
  try { document.documentElement.lang = LANG; } catch {}
  window.dispatchEvent(new CustomEvent("ctc:lang", { detail: LANG }));
}

// Direkte Auswahl der passenden Variante.
export function L(de, en) { return LANG === "en" ? en : de; }

// React-Hook: erzwingt ein Re-Render der Komponente bei Sprachwechsel.
export function useLang() {
  const [, force] = useState(0);
  useEffect(() => {
    const h = () => force((v) => v + 1);
    window.addEventListener("ctc:lang", h);
    return () => window.removeEventListener("ctc:lang", h);
  }, []);
  return LANG;
}

try { document.documentElement.lang = LANG; } catch {}

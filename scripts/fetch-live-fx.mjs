// Live cedi quotes, through the day.
//
// The Bank of Ghana publishes its interbank rate once each morning — that stays the site's
// official figure. This job asks the market what the cedi is trading at right now and writes
// live-data.js, so the page can show a rate with a time on it rather than only a date.
//
// It runs every 20 minutes and commits only when a quote has actually moved, so a flat
// market costs nothing. Every quote keeps the minute it was taken; nothing is ever invented.
//
// Run locally: node scripts/fetch-live-fx.mjs
import { load, save } from "./lib/datafile.mjs";

const FILE = new URL("../live-data.js", import.meta.url).pathname;
const UA = "Mozilla/5.0 (compatible; AlfredoGhanaEconomicData/1.0; live rates)";
const CHART = sym => `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?range=1d&interval=5m`;

// key -> [Yahoo symbol, what it is, sensible range]
export const QUOTES = {
  usd: ["GHS=X", "US dollar", [5, 40]],
  gbp: ["GBPGHS=X", "British pound", [6, 60]],
  eur: ["EURGHS=X", "Euro", [5, 50]],
  cny: ["CNYGHS=X", "Chinese yuan", [0.5, 8]],
  gold: ["GC=F", "Gold, US$ an ounce", [1000, 20000]]
};

export async function get(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" }, signal: AbortSignal.timeout(25000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// Yahoo's chart reply -> the latest traded price and the minute it was quoted
export function parseQuote(json, range) {
  const r = json && json.chart && json.chart.result && json.chart.result[0];
  const meta = r && r.meta;
  if (!meta) return null;
  let value = typeof meta.regularMarketPrice === "number" ? meta.regularMarketPrice : null;
  let at = typeof meta.regularMarketTime === "number" ? meta.regularMarketTime * 1000 : null;
  // prefer the last complete five-minute bar when the chart carries one
  const closes = r.indicators && r.indicators.quote && r.indicators.quote[0] && r.indicators.quote[0].close;
  const stamps = r.timestamp;
  if (Array.isArray(closes) && Array.isArray(stamps)) {
    for (let i = closes.length - 1; i >= 0; i--) {
      if (typeof closes[i] === "number" && isFinite(closes[i])) {
        if (!at || stamps[i] * 1000 > at) { value = closes[i]; at = stamps[i] * 1000; }
        break;
      }
    }
  }
  if (value == null || !isFinite(value) || !at) return null;
  if (range && (value < range[0] || value > range[1])) return null;
  // a quote from the future, or from more than three days ago, is a parsing error
  const skew = Date.now() - at;
  if (skew < -6 * 3600e3 || skew > 3 * 864e5) return null;
  return { value: +value.toPrecision(6), at: new Date(at).toISOString() };
}

// only write when something moved by more than a rounding wobble
export function moved(before, after) {
  if (!before) return true;
  return Math.abs(after.value - before.value) / Math.max(Math.abs(before.value), 1e-9) > 0.0002;
}

export function merge(old, fresh) {
  const quotes = { ...(old.quotes || {}) };
  let changed = false;
  for (const [key, q] of Object.entries(fresh)) {
    const before = quotes[key];
    if (before && Date.parse(q.at) < Date.parse(before.at)) continue;   // never go backwards
    if (moved(before, q)) changed = true;
    quotes[key] = { ...q, name: QUOTES[key][1], prev: before && before.value !== q.value ? before.value : (before ? before.prev : undefined) };
  }
  return { quotes, changed };
}

export async function main() {
  let old = { quotes: {} };
  try { old = load(FILE, "GDC_LIVE"); } catch (e) { /* first run */ }

  const log = [], fresh = {};
  for (const [key, [symbol, , range]] of Object.entries(QUOTES)) {
    try {
      const q = parseQuote(await get(CHART(symbol)), range);
      if (!q) { log.push(`${key}: no usable quote`); continue; }
      fresh[key] = q;
      log.push(`${key}: ${q.value} at ${q.at}`);
    } catch (e) { log.push(`${key}: failed (${e.message})`); }
  }

  if (!Object.keys(fresh).length) {
    console.log(log.join("\n"));
    console.error("No quote came back; live-data.js left unchanged.");
    process.exitCode = 1;
    return;
  }

  const { quotes, changed } = merge(old, fresh);
  if (!changed) {
    console.log(log.join("\n"));
    console.log("Nothing moved; live-data.js left unchanged.");
    return;
  }
  save(FILE, "GDC_LIVE", {
    updated: new Date().toISOString(),
    note: "Market quotes for the cedi, taken through the day. The Bank of Ghana's interbank rate, shown elsewhere on this page, is the official figure and is published once each morning.",
    source: "Yahoo Finance",
    quotes
  });
  console.log(log.join("\n"));
  console.log(`${Object.keys(fresh).length} quotes written.`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();

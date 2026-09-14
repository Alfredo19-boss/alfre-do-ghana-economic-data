// Global markets and the Ghana Stock Exchange.
//
// Writes markets-data.js: world indices, commodities, crypto and major currency pairs from
// Yahoo Finance, plus every equity listed on the GSE. Runs alongside the live cedi quotes,
// every 20 minutes, and keeps the last good figure for anything that fails to arrive.
//
// Run locally: node scripts/fetch-markets.mjs
import { load, save } from "./lib/datafile.mjs";

const FILE = new URL("../markets-data.js", import.meta.url).pathname;
const UA = "Mozilla/5.0 (compatible; AlfredoGhanaEconomicData/1.0; markets)";
const CHART = sym => `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?range=5d&interval=1d`;

// group -> [symbol, name, unit, decimals]
export const SYMBOLS = {
  indices: [
    ["^GSPC", "S&P 500", "", 0], ["^DJI", "Dow Jones", "", 0], ["^IXIC", "Nasdaq", "", 0],
    ["^FTSE", "FTSE 100 · London", "", 0], ["^GDAXI", "DAX · Frankfurt", "", 0],
    ["^N225", "Nikkei 225 · Tokyo", "", 0], ["^HSI", "Hang Seng · Hong Kong", "", 0],
    ["^JN0U.JO", "JSE Top 40 · Johannesburg", "", 0], ["^NSEI", "Nifty 50 · India", "", 0]
  ],
  commodities: [
    ["GC=F", "Gold", "US$/oz", 0], ["SI=F", "Silver", "US$/oz", 2], ["HG=F", "Copper", "US$/lb", 2],
    ["CL=F", "Crude oil · WTI", "US$/bbl", 2], ["BZ=F", "Crude oil · Brent", "US$/bbl", 2],
    ["NG=F", "Natural gas", "US$/MMBtu", 2], ["CC=F", "Cocoa", "US$/t", 0],
    ["KC=F", "Coffee", "US¢/lb", 1], ["ZC=F", "Maize", "US¢/bu", 1], ["CT=F", "Cotton", "US¢/lb", 2]
  ],
  crypto: [
    ["BTC-USD", "Bitcoin", "US$", 0], ["ETH-USD", "Ethereum", "US$", 0]
  ],
  currencies: [
    ["GHS=X", "US dollar in cedis", "GH¢", 4], ["EURGHS=X", "Euro in cedis", "GH¢", 4],
    ["GBPGHS=X", "Pound in cedis", "GH¢", 4], ["EURUSD=X", "Euro in dollars", "US$", 4],
    ["GBPUSD=X", "Pound in dollars", "US$", 4], ["NGNGHS=X", "Naira in cedis", "GH¢", 4],
    ["ZARGHS=X", "Rand in cedis", "GH¢", 4], ["CNYGHS=X", "Yuan in cedis", "GH¢", 4]
  ]
};

// The GSE publishes through this open endpoint; the second is a fallback with the same shape.
export const GSE_URLS = [
  "https://dev.kwayisi.org/apis/gse/live",
  "https://dev.kwayisi.org/apis/gse/equities"
];

export async function getJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" }, signal: AbortSignal.timeout(25000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// Yahoo's chart reply -> the last price, what it closed at before, and when it was quoted
export function parseQuote(json) {
  const r = json && json.chart && json.chart.result && json.chart.result[0];
  const meta = r && r.meta;
  if (!meta) return null;
  const value = typeof meta.regularMarketPrice === "number" ? meta.regularMarketPrice : null;
  if (value == null || !isFinite(value) || value <= 0) return null;
  let prev = typeof meta.chartPreviousClose === "number" ? meta.chartPreviousClose
    : typeof meta.previousClose === "number" ? meta.previousClose : null;
  // fall back to the day before in the series
  const closes = r.indicators && r.indicators.quote && r.indicators.quote[0] && r.indicators.quote[0].close;
  if (prev == null && Array.isArray(closes)) {
    const clean = closes.filter(v => typeof v === "number" && isFinite(v));
    if (clean.length > 1) prev = clean[clean.length - 2];
  }
  const at = typeof meta.regularMarketTime === "number" ? new Date(meta.regularMarketTime * 1000).toISOString() : new Date().toISOString();
  const change = prev ? +(value - prev).toPrecision(6) : null;
  return {
    value: +value.toPrecision(8),
    prev: prev ? +prev.toPrecision(8) : null,
    change,
    pct: prev ? +((value / prev - 1) * 100).toFixed(2) : null,
    at
  };
}

// The GSE feed gives one row per listed company. Shapes differ slightly between the two
// endpoints, so this takes whichever fields are present and ignores anything unusable.
export function parseGse(rows) {
  if (!Array.isArray(rows)) return [];
  return rows.map(r => {
    const code = String(r.name || r.symbol || r.ticker || "").trim().toUpperCase();
    const price = Number(r.price ?? r.close ?? r.last);
    if (!code || !isFinite(price) || price <= 0) return null;
    const change = Number(r.change);
    const volume = Number(r.volume ?? r.vol);
    return {
      code,
      name: String(r.company || r.longName || r.title || code).trim(),
      price: +price.toFixed(2),
      change: isFinite(change) ? +change.toFixed(2) : null,
      pct: isFinite(change) && price - change > 0 ? +((change / (price - change)) * 100).toFixed(2) : null,
      volume: isFinite(volume) ? Math.round(volume) : null
    };
  }).filter(Boolean).sort((a, b) => a.code.localeCompare(b.code));
}

export async function main() {
  let old = {};
  try { old = load(FILE, "GDC_MARKETS"); } catch (e) { /* first run */ }
  const log = [];
  const world = { ...(old.world || {}) };

  for (const [group, list] of Object.entries(SYMBOLS)) {
    const kept = new Map((world[group] || []).map(x => [x.symbol, x]));
    let got = 0;
    for (const [symbol, name, unit, dec] of list) {
      try {
        const q = parseQuote(await getJson(CHART(symbol)));
        if (!q) throw new Error("no usable quote");
        kept.set(symbol, { symbol, name, unit, dec, ...q });
        got++;
      } catch (e) { log.push(`${symbol}: ${e.message}`); }
    }
    world[group] = list.map(([symbol]) => kept.get(symbol)).filter(Boolean);
    log.push(`${group}: ${got}/${list.length} fresh, ${world[group].length} held`);
  }

  let ghana = old.ghana || { equities: [] };
  for (const url of GSE_URLS) {
    try {
      const equities = parseGse(await getJson(url));
      if (equities.length < 5) throw new Error(`only ${equities.length} rows`);
      ghana = { updated: new Date().toISOString(), source: "Ghana Stock Exchange, via the GSE open data feed", sourceUrl: "https://gse.com.gh/", equities };
      log.push(`GSE: ${equities.length} listed companies from ${url}`);
      break;
    } catch (e) { log.push(`GSE ${url}: ${e.message}`); }
  }

  const anyWorld = Object.values(world).some(list => (list || []).length);
  if (!anyWorld && !(ghana.equities || []).length) {
    console.log(log.join("\n"));
    console.error("Nothing came back; markets-data.js left unchanged.");
    process.exitCode = 1;
    return;
  }

  save(FILE, "GDC_MARKETS", {
    updated: new Date().toISOString(),
    note: "Market prices as last traded. World figures from Yahoo Finance; Ghana Stock Exchange prices from the GSE's open feed. Exchanges close overnight and at weekends, so a price carries the moment it was quoted.",
    source: "Yahoo Finance · Ghana Stock Exchange",
    world,
    ghana
  });
  console.log(log.join("\n"));
}

if (import.meta.url === `file://${process.argv[1]}`) main();

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
// If both JSON endpoints are down, the same publisher's public table is read instead. It is a
// last resort and parsed loosely on purpose: any row whose first cell looks like a ticker and
// which carries a price is kept, so a change of markup costs formatting rather than the data.
export const GSE_PAGE = "https://afx.kwayisi.org/gse/";

const wait = ms => new Promise(r => setTimeout(r, ms));

export async function getJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" }, signal: AbortSignal.timeout(25000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// Yahoo is happy to answer a handful of requests and starts refusing a burst of thirty with
// HTTP 429. This job asks for about thirty symbols, which is why it was coming back with
// nothing at all while the five-symbol cedi job beside it worked perfectly. Each call now
// waits its turn, retries once after a pause, and tries Yahoo's second host before giving up.
export async function getQuoteJson(url) {
  let last = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    const target = attempt === 2 ? url.replace("query1.", "query2.") : url;
    try {
      return await getJson(target);
    } catch (e) {
      last = e;
      if (attempt < 2) await wait(/429|throttl/i.test(e.message) ? 5000 : 1200);
    }
  }
  throw last;
}

// One row per listed company, read from the publisher's HTML table when the JSON is unavailable.
export function parseGsePage(html) {
  const rows = String(html).match(/<tr[\s>][\s\S]*?<\/tr>/gi) || [];
  const clean = s => String(s).replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
  const out = [];
  for (const tr of rows) {
    const cells = (tr.match(/<t[dh][\s>][\s\S]*?<\/t[dh]>/gi) || []).map(clean);
    if (cells.length < 3) continue;
    const code = cells[0].toUpperCase();
    if (!/^[A-Z][A-Z0-9.\-]{1,7}$/.test(code)) continue;          // the ticker column
    const nums = cells.slice(1).map(c => Number(String(c).replace(/[, ]/g, "")));
    const price = nums.find(n => isFinite(n) && n > 0);
    if (!isFinite(price)) continue;
    const name = cells.slice(1).find(c => /[A-Za-z]{3}/.test(c)) || code;
    out.push({ name: code, company: name, price });
  }
  return out;
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

// Each instrument keeps its own trail of closing prices, one point a day, built up by the
// site itself as the job runs. Nothing is backfilled or invented: the trail starts the day
// the job first sees a price and grows from there, which is why a fresh install shows a
// short line and an old one shows a long one.
const HISTORY_DAYS = 180;
export function addPoint(history, value, at) {
  const day = String(at || new Date().toISOString()).slice(0, 10);
  const out = (history || []).filter(p => p && p.date && typeof p.value === "number");
  const last = out[out.length - 1];
  if (last && last.date === day) last.value = value;          // same day: keep the latest price
  else out.push({ date: day, value });
  return out.slice(-HISTORY_DAYS);
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
        const q = parseQuote(await getQuoteJson(CHART(symbol)));
        if (!q) throw new Error("no usable quote");
        const before = kept.get(symbol) || {};
        kept.set(symbol, { symbol, name, unit, dec, ...q, history: addPoint(before.history, q.value, q.at) });
        got++;
        await wait(350);            // Yahoo refuses a burst; a third of a second apart is plenty
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
    } catch (e) { log.push(`GSE ${url}: failed (${e.message})`); }
  }
  // Still nothing from either JSON endpoint: read the published table instead.
  if (!(ghana.equities || []).length) {
    try {
      const res = await fetch(GSE_PAGE, { headers: { "User-Agent": UA, Accept: "text/html,*/*" }, signal: AbortSignal.timeout(25000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const equities = parseGse(parseGsePage(await res.text()));
      if (equities.length < 5) throw new Error(`only ${equities.length} rows`);
      ghana = { updated: new Date().toISOString(), source: "Ghana Stock Exchange, via the GSE open data feed", sourceUrl: "https://gse.com.gh/", equities };
      log.push(`GSE: ${equities.length} listed companies from the published table`);
    } catch (e) { log.push(`GSE ${GSE_PAGE}: failed (${e.message})`); }
  }

  // Always write. `world` and `ghana` both start from what the file already held, so a run that
  // fetched nothing simply rewrites the same prices — it can never empty the file. What it does
  // add is the log, and that is the point: when this job came back with nothing it wrote nothing,
  // so there was no way to see why from the site. Now the reason is in the file and on #status.
  save(FILE, "GDC_MARKETS", {
    updated: new Date().toISOString(),
    note: "Market prices as last traded. World figures from Yahoo Finance; Ghana Stock Exchange prices from the GSE's open feed. Exchanges close overnight and at weekends, so a price carries the moment it was quoted.",
    source: "Yahoo Finance · Ghana Stock Exchange",
    log,
    world,
    ghana
  });
  console.log(log.join("\n"));
}

if (import.meta.url === `file://${process.argv[1]}`) main();

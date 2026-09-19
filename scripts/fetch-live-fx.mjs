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

/* ---------- the Bank of Ghana's own interbank rate ----------
 * The dashboard's headline figure is BoG's, not the market's. Their daily page is read here,
 * every twenty minutes, rather than once each morning by the market-data job — so the moment
 * BoG publishes a new day the dashboard moves with it, instead of waiting until tomorrow.
 * Nothing else stands in: if BoG cannot be read, the previous BoG reading is kept and the
 * market quote is the only thing that moves. The site never puts BoG's name on another
 * source's number.
 */
const BOG_URL = "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/";
export const BOG_SOURCES = [
  BOG_URL,
  `${BOG_URL}?date=${new Date().toISOString().slice(0, 10)}`,
  "https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/"
];
const MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
const BOG_PAIRS = [["USDGHS", "usd", [5, 40]], ["GBPGHS", "gbp", [6, 60]], ["EURGHS", "eur", [5, 50]]];

// One page, one date. Every row for a pair is read and the newest kept; then only the rows
// sharing that newest date are published, so the three cards can never show three days.
export function parseBog(html) {
  const text = String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ");
  const found = {};
  for (const [code, key, range] of BOG_PAIRS) {
    const re = new RegExp(`(\\d{1,2})\\s+([A-Za-z]{3})[a-z]*\\s+(\\d{4})\\s+[A-Za-z .()'’-]*?${code}\\s+([\\d.]+)\\s+([\\d.]+)\\s+([\\d.]+)`, "g");
    let m, best = null;
    while ((m = re.exec(text))) {
      const mo = MONTHS[m[2].toLowerCase()];
      if (mo === undefined) continue;
      const value = +m[6];
      if (!isFinite(value) || value < range[0] || value > range[1]) continue;
      const date = new Date(Date.UTC(+m[3], mo, +m[1])).toISOString().slice(0, 10);
      if (date > new Date(Date.now() + 864e5).toISOString().slice(0, 10)) continue;   // a date in the future is a misread
      if (!best || date > best.date) best = { date, value: +value.toFixed(4) };
    }
    if (best) found[key] = best;
  }
  const dates = Object.values(found).map(r => r.date);
  if (!dates.length) return null;
  const date = dates.sort().slice(-1)[0];
  const rates = {};
  for (const [, key] of BOG_PAIRS) if (found[key] && found[key].date === date) rates[key] = { value: found[key].value };
  return Object.keys(rates).length ? { date, rates, source: "Bank of Ghana interbank mid-rate", url: BOG_URL } : null;
}

// Try each page in turn and keep the newest day any of them yields.
export async function fetchBog(log) {
  let best = null;
  for (const url of BOG_SOURCES) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html,*/*" }, signal: AbortSignal.timeout(25000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const got = parseBog(await res.text());
      if (!got) { log.push(`BoG ${url}: no rate row found`); continue; }
      log.push(`BoG ${url}: ${got.date}, ${Object.keys(got.rates).join("/")}`);
      if (!best || got.date > best.date) best = got;
    } catch (e) { log.push(`BoG ${url}: failed (${e.message})`); }
  }
  return best;
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
    // Never go backwards in time — except when the source itself changes. A daily mid-market
    // rate is stamped midnight, so without this the first run after the switch would look
    // older than the intraday quote it replaces and be thrown away for the rest of the day.
    if (before && !!before.daily === !!q.daily && Date.parse(q.at) < Date.parse(before.at)) continue;
    if (moved(before, q)) changed = true;
    quotes[key] = { ...q, name: QUOTES[key][1], prev: before && before.value !== q.value ? before.value : (before ? before.prev : undefined) };
  }
  return { quotes, changed };
}

/* ---- the market rate for the cedi ---------------------------------------------
 * Yahoo's cedi quote is indicative and moves in coarse steps — over three days it read
 * 11.48, 11.50, 11.48 while the Bank of Ghana's own rate went 11.50 to 11.55. On the page
 * that reads as a rate that has stopped. The daily mid-market rate below is the figure a
 * search engine shows, it moves every day, and it is the same source the ticker uses, so
 * the card and the ticker cannot disagree. Yahoo keeps gold, where its quote is good.
 */
const CURRENCY_API = [
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
  "https://latest.currency-api.pages.dev/v1/currencies/usd.json"
];
const MID_PAIRS = { usd: null, gbp: "gbp", eur: "eur", cny: "cny" };

export function parseMid(json) {
  const r = json && json.usd;
  if (!r || typeof r.ghs !== "number" || !(r.ghs > 0) || !json.date) return {};
  const at = `${json.date}T00:00:00.000Z`;
  const out = {};
  for (const [key, per] of Object.entries(MID_PAIRS)) {
    const value = per === null ? r.ghs : (typeof r[per] === "number" && r[per] > 0 ? r.ghs / r[per] : null);
    if (value == null || !isFinite(value) || value <= 0) continue;
    const range = QUOTES[key] && QUOTES[key][2];
    if (range && (value < range[0] || value > range[1])) continue;
    out[key] = { value: +value.toPrecision(6), at, daily: true };
  }
  return out;
}

async function fetchMid(log) {
  for (const url of CURRENCY_API) {
    try {
      const got = parseMid(await get(url));
      const n = Object.keys(got).length;
      if (!n) throw new Error("no cedi rate in the reply");
      log.push(`cedi mid-rates: ${n} pairs from ${url}`);
      return got;
    } catch (e) { log.push(`cedi mid-rates ${url}: failed (${e.message})`); }
  }
  return {};
}

export async function main() {
  let old = { quotes: {} };
  try { old = load(FILE, "GDC_LIVE"); } catch (e) { /* first run */ }

  const log = [], fresh = {};
  const mid = await fetchMid(log);
  for (const [key, [symbol, , range]] of Object.entries(QUOTES)) {
    if (mid[key]) { fresh[key] = mid[key]; log.push(`${key}: ${mid[key].value} (mid-market, ${mid[key].at.slice(0, 10)})`); continue; }
    try {
      const q = parseQuote(await get(CHART(symbol)), range);
      if (!q) { log.push(`${key}: no usable quote`); continue; }
      fresh[key] = q;
      log.push(`${key}: ${q.value} at ${q.at}`);
    } catch (e) { log.push(`${key}: failed (${e.message})`); }
  }

  // The Bank of Ghana's own rate, read on the same twenty-minute beat. A failure here costs
  // nothing: the reading already held stands until BoG answers again.
  const bog = await fetchBog(log) || old.official || null;
  const bogMoved = !!bog && (!old.official
    || old.official.date !== bog.date
    || JSON.stringify(old.official.rates) !== JSON.stringify(bog.rates));
  if (bog) log.push(`BoG in use: ${bog.date} · ${Object.entries(bog.rates).map(([k, r]) => `${k} ${r.value}`).join(", ")}`);

  if (!Object.keys(fresh).length && !bogMoved) {
    console.log(log.join("\n"));
    console.error("No quote came back; live-data.js left unchanged.");
    process.exitCode = 1;
    return;
  }

  const { quotes, changed } = merge(old, fresh);
  if (!changed && !bogMoved) {
    console.log(log.join("\n"));
    console.log("Nothing moved; live-data.js left unchanged.");
    return;
  }
  save(FILE, "GDC_LIVE", {
    updated: new Date().toISOString(),
    note: "The Bank of Ghana's interbank mid-rate is the site's official figure and leads the dashboard; the market quotes beneath it are taken through the day and carry the minute they were read.",
    source: "Bank of Ghana, with daily mid-market rates for the cedi pairs and Yahoo Finance for gold",
    official: bog || undefined,
    officialAt: bog ? new Date().toISOString() : undefined,
    log,
    quotes
  });
  console.log(log.join("\n"));
  console.log(`${Object.keys(fresh).length} quotes written.`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();

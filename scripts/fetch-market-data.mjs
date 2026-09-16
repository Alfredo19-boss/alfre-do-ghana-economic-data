// Daily market data job.
// Fetches exchange rates (the headline US$/£/€ rates plus a table of world and African currencies
// for the green ticker), the gold price and the cocoa price, checks each value is sensible,
// and writes auto-data.js. A failed source keeps its previous value and is logged, never zeroed.
//
// Run locally: node scripts/fetch-market-data.mjs
import { load, save } from "./lib/datafile.mjs";

const FILE = new URL("../auto-data.js", import.meta.url).pathname;
const BOG_FX_URL = "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/";
// The daily page builds its table through a date picker, so the HTML that arrives from a plain
// request can carry a stale default row. These are tried in order and the NEWEST row found
// across all of them wins, so a page that does serve today's figures is used whichever it is.
// If BoG publishes nothing usable the job says so and falls back, clearly labelled, to a
// market mid-rate — it never presents someone else's number as the Bank of Ghana's.
export const BOG_SOURCES = [
  BOG_FX_URL,
  `${BOG_FX_URL}?date=${new Date().toISOString().slice(0, 10)}`,
  "https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/",
  "https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/?orderby=date&order=desc"
];
const CURRENCY_API_URLS = [
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
  "https://latest.currency-api.pages.dev/v1/currencies/usd.json"
];
const COCOA_URL = "https://query1.finance.yahoo.com/v8/finance/chart/CC=F?range=5d&interval=1d";
const UA = "Mozilla/5.0 (compatible; AlfredoGhanaEconomicData/1.0; +https://github.com)";
const DATA_FILE = new URL("../data.js", import.meta.url).pathname;
const MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };

// Values outside these ranges are rejected as parsing errors.
const SANE = {
  "fx.usd": [5, 40], "fx.gbp": [6, 60], "fx.eur": [5, 50],
  "gold.usdPerOz": [1000, 20000], "cocoa.usdPerTonne": [1000, 25000]
};

async function get(url, as = "text") {
  const res = await fetch(url, { headers: { "User-Agent": UA, "Accept": as === "json" ? "application/json" : "text/html,*/*" }, signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`${url} returned ${res.status}`);
  return as === "json" ? res.json() : res.text();
}

export function parseBogFx(html) {
  const text = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ");
  const out = {};
  for (const [code, key] of [["USDGHS", "fx.usd"], ["GBPGHS", "fx.gbp"], ["EURGHS", "fx.eur"]]) {
    const re = new RegExp(`(\\d{1,2})\\s+([A-Za-z]{3})[a-z]*\\s+(\\d{4})\\s+[A-Za-z .]*?${code}\\s+([\\d.]+)\\s+([\\d.]+)\\s+([\\d.]+)`);
    const m = re.exec(text);
    if (!m) continue;
    const month = MONTHS[m[2].toLowerCase()];
    if (month === undefined) continue;
    const date = new Date(Date.UTC(+m[3], month, +m[1])).toISOString().slice(0, 10);
    out[key] = { value: +(+m[6]).toFixed(4), date, source: "Bank of Ghana interbank mid-rate", url: BOG_FX_URL };
  }
  return out;
}

export function parseCurrencyApi(json) {
  const r = json && json.usd;
  if (!r || !json.date) return {};
  const out = {};
  const src = { date: json.date, source: "Market mid-rate (currency-api)", url: CURRENCY_API_URLS[0] };
  if (r.ghs) {
    out["fx.usd"] = { value: +r.ghs.toFixed(4), ...src };
    if (r.gbp) out["fx.gbp"] = { value: +(r.ghs / r.gbp).toFixed(4), ...src };
    if (r.eur) out["fx.eur"] = { value: +(r.ghs / r.eur).toFixed(4), ...src };
  }
  if (r.xau) out["gold.usdPerOz"] = { value: Math.round(1 / r.xau), date: json.date, source: "Spot gold (currency-api)", url: CURRENCY_API_URLS[0], note: "Per ounce" };
  return out;
}

export function parseYahooCocoa(json) {
  const meta = json?.chart?.result?.[0]?.meta;
  if (!meta || typeof meta.regularMarketPrice !== "number") return {};
  const date = new Date((meta.regularMarketTime || Date.now() / 1000) * 1000).toISOString().slice(0, 10);
  return { "cocoa.usdPerTonne": { value: Math.round(meta.regularMarketPrice), date, source: "ICE New York cocoa futures", url: "https://finance.yahoo.com/quote/CC=F", note: "Per tonne" } };
}

// Every row of the BoG table. Most pairs are quoted as GH¢ per foreign unit (USDGHS);
// some African pairs are quoted the other way round (GHSNGN = naira per GH¢1).
export function parseBogTable(html) {
  const text = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ");
  const re = /(\d{1,2})\s+([A-Za-z]{3})[a-z]*\s+(\d{4})\s+[A-Za-z .()'’-]*?\b([A-Z]{3})([A-Z]{3})\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/g;
  const rates = {};
  let date = null, m;
  while ((m = re.exec(text))) {
    const month = MONTHS[m[2].toLowerCase()];
    if (month === undefined) continue;
    const mid = +m[8];
    if (!(mid > 0)) continue;
    const d = new Date(Date.UTC(+m[3], month, +m[1])).toISOString().slice(0, 10);
    if (date && d < date) continue;
    if (!date || d > date) { date = d; for (const k of Object.keys(rates)) delete rates[k]; }
    if (m[5] === "GHS" && m[4] !== "WAU") rates[m[4]] = { ghs: +mid.toPrecision(6), src: "BoG" };
    else if (m[4] === "GHS") rates[m[5]] = { ghs: +(1 / mid).toPrecision(6), src: "BoG" };
  }
  return date ? { date, rates } : null;
}

// Fill in currencies the BoG table does not quote, from the market mid-rate feed.
export function tableFromCurrencyApi(json, codes) {
  const u = json && json.usd;
  if (!u || !u.ghs) return null;
  const rates = {};
  for (const code of codes) {
    const r = u[code.toLowerCase()];
    if (r) rates[code] = { ghs: +(u.ghs / r).toPrecision(6), src: "market" };
  }
  return { date: json.date, rates };
}

export function mergeTable(old, bog, market) {
  const date = [bog?.date, market?.date].filter(Boolean).sort().pop() || old?.date || null;
  const rates = { ...(market?.rates || {}), ...(bog?.rates || {}) };
  for (const [k, v] of Object.entries(rates)) if (!(v.ghs > 1e-7 && v.ghs < 1000)) delete rates[k];
  if (!Object.keys(rates).length) return old || null;
  const isNewDay = old && old.date && date && old.date < date;
  return {
    date,
    rates: { ...(old?.rates || {}), ...rates },
    prevDate: isNewDay ? old.date : (old?.prevDate || null),
    prev: isNewDay ? old.rates : (old?.prev || {})
  };
}

export function sane(key, v) {
  const r = SANE[key];
  return v && typeof v.value === "number" && isFinite(v.value) && (!r || (v.value >= r[0] && v.value <= r[1])) && /^\d{4}-\d{2}-\d{2}$/.test(v.date);
}

export function merge(auto, fresh, log) {
  const values = { ...(auto.values || {}) };
  let changed = false;
  for (const [key, v] of Object.entries(fresh)) {
    if (!sane(key, v)) { log.push(`rejected ${key}: ${JSON.stringify(v)}`); continue; }
    const old = values[key];
    if (old && old.date > v.date) { log.push(`kept newer ${key} from ${old.date}`); continue; }
    if (!old || old.value !== v.value || old.date !== v.date || old.source !== v.source) changed = true;
    values[key] = v;
  }
  // daily cedi history for the chart (one point per date, last 400 days)
  const hist = new Map((auto.cediHistory || []).map(p => [p.date, p]));
  if (values["fx.usd"]) hist.set(values["fx.usd"].date, { date: values["fx.usd"].date, rate: values["fx.usd"].value });
  const cediHistory = [...hist.values()].sort((a, b) => a.date.localeCompare(b.date)).slice(-400);
  // one point per key per day, so every automatic figure builds its own chart and trend
  const history = { ...(auto.history || {}) };
  for (const [key, v] of Object.entries(values)) {
    const series = new Map((history[key] || []).map(p => [p.date, p]));
    series.set(v.date, { date: v.date, value: v.value });
    history[key] = [...series.values()].sort((a, b) => a.date.localeCompare(b.date)).slice(-400);
  }
  return { values, cediHistory, history, changed };
}

async function main() {
  const auto = load(FILE, "GDC_AUTO");
  const log = [];
  const fresh = {};
  let bogTable = null, marketTable = null;
  let tickerCodes = [];
  try {
    const D = load(DATA_FILE, "GDC_DATA");
    tickerCodes = [...(D.fxTicker?.world || []), ...(D.fxTicker?.africa || [])].map(c => c.code);
  } catch (e) { log.push(`could not read ticker currencies from data.js: ${e.message}`); }

  // 1. Exchange rates: Bank of Ghana first, across every page shape it publishes
  let bogDate = null;
  for (const url of BOG_SOURCES) {
    try {
      const html = await get(url);
      const rows = parseBogFx(html);
      const table = parseBogTable(html);
      const seen = table ? table.date : (Object.values(rows)[0] || {}).date;
      if (!seen) { log.push(`BoG FX ${url}: no rows found`); continue; }
      if (bogDate && seen <= bogDate) { log.push(`BoG FX ${url}: ${seen}, not newer than ${bogDate}`); continue; }
      bogDate = seen;
      Object.assign(fresh, rows);
      if (table) bogTable = table;
      log.push(`BoG FX ${url}: ${seen} · ${Object.keys(rows).join(", ") || "headline pairs missing"}; table ${table ? Object.keys(table.rates).length + " currencies" : "not found"}`);
    } catch (e) { log.push(`BoG FX ${url} failed: ${e.message}`); }
  }
  if (!bogDate) log.push("BoG published nothing usable today; the market mid-rate below is used instead and is labelled as such.");

  // 2. Gold, other currencies, plus fallback exchange rates if BoG failed
  for (const url of CURRENCY_API_URLS) {
    try {
      const json = await get(url, "json");
      const parsed = parseCurrencyApi(json);
      for (const [k, v] of Object.entries(parsed)) if (!fresh[k]) fresh[k] = v;
      marketTable = tableFromCurrencyApi(json, tickerCodes);
      log.push(`currency-api: ${Object.keys(parsed).join(", ")}; table ${marketTable ? Object.keys(marketTable.rates).length : 0} currencies`);
      break;
    } catch (e) { log.push(`currency-api failed (${url}): ${e.message}`); }
  }

  // 3. Cocoa
  try {
    Object.assign(fresh, parseYahooCocoa(await get(COCOA_URL, "json")));
    log.push(fresh["cocoa.usdPerTonne"] ? "cocoa: ok" : "cocoa: no price in response");
  } catch (e) { log.push(`cocoa failed: ${e.message}`); }

  if (!Object.keys(fresh).length) {
    console.log(log.join("\n"));
    console.error("Every source failed. auto-data.js was left unchanged.");
    process.exitCode = 1;
    return;
  }
  const { values, cediHistory, history, changed } = merge(auto, fresh, log);
  const now = new Date().toISOString();
  const next = {
    updated: now,
    values,
    cediHistory,
    history,
    fxTable: mergeTable(auto.fxTable, bogTable, marketTable),
    log: [{ at: now, messages: log }, ...(auto.log || [])].slice(0, 14)
  };
  save(FILE, "GDC_AUTO", next);
  console.log(log.join("\n"));
  console.log(changed ? "Values changed." : "No value changes.");
}

if (import.meta.url === `file://${process.argv[1]}`) main();

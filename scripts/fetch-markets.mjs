// Global markets and the Ghana Stock Exchange.
//
// Writes markets-data.js: world indices, commodities, crypto and major currency pairs from
// Yahoo Finance, plus a full cedi exchange table. Runs alongside the live cedi quotes, every
// 20 minutes, and keeps the last good figure for anything that fails to arrive.
//
// Run locally: node scripts/fetch-markets.mjs
import dns from "node:dns";
import { load, save } from "./lib/datafile.mjs";

// GitHub's runners advertise IPv6, and Node 18+ tries the AAAA record first. Hosts that
// publish an AAAA record but do not actually answer on it fail with a bare "fetch failed" —
// no status, no body, because the connection never opened. That is exactly what every Ghana
// Stock Exchange source returned from Actions while answering normally from elsewhere.
// Asking for IPv4 first costs nothing and is the usual cure.
dns.setDefaultResultOrder("ipv4first");

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

/* ---- the cedi pairs ----------------------------------------------------------
 * Yahoo's quote for the cedi is an indicative one and it is not good enough. Recorded over
 * three days it read 11.48, 11.50, 11.48 while the Bank of Ghana's own rate moved 11.50 to
 * 11.55 — a thin pair quoted on round numbers, which on the ticker looks like a rate that
 * has stopped. The daily mid-market rate below is the figure a search engine shows, it moves
 * every day, and it carries naira, rand and yuan too — which also fixes NGNGHS=X, the one
 * symbol Yahoo answers with a 404. Yahoo stays the fallback, and stays the source for gold,
 * the indices and everything else, where its quotes are good.
 */
const CURRENCY_API = [
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
  "https://latest.currency-api.pages.dev/v1/currencies/usd.json"
];
// symbol -> the currency to divide the cedi rate by; null means the dollar itself
export const CEDI_PAIRS = { "GHS=X": null, "EURGHS=X": "eur", "GBPGHS=X": "gbp", "NGNGHS=X": "ngn", "ZARGHS=X": "zar", "CNYGHS=X": "cny" };

export function parseCedis(json) {
  const r = json && json.usd;
  if (!r || typeof r.ghs !== "number" || !(r.ghs > 0) || !json.date) return {};
  const at = `${json.date}T00:00:00.000Z`;
  const out = {};
  for (const [symbol, per] of Object.entries(CEDI_PAIRS)) {
    const value = per === null ? r.ghs : (typeof r[per] === "number" && r[per] > 0 ? r.ghs / r[per] : null);
    if (value == null || !isFinite(value) || value <= 0) continue;
    out[symbol] = { value: +value.toPrecision(8), at };
  }
  return out;
}

async function fetchCedis(log) {
  for (const url of CURRENCY_API) {
    try {
      const got = parseCedis(await getJson(url));
      const n = Object.keys(got).length;
      if (!n) throw new Error("no cedi rate in the reply");
      log.push(`cedi mid-rates: ${n} pairs from ${url}`);
      return got;
    } catch (e) { log.push(`cedi mid-rates ${url}: failed (${e.message})`); }
  }
  return {};
}

/* ---- the full exchange table ----------------------------------------------------
 * One request returns what a single cedi buys in every currency the source carries —
 * around 350 of them, including every African neighbour, the CFA franc and the majors.
 * That is the whole Exchange portal in one file, refreshed on the same twenty-minute beat.
 * The site keeps only the currencies it names, so a reader is never shown a code the page
 * cannot label, and it stores the rate as cedis-per-unit, which is how Ghanaians quote it.
 */
const CEDI_TABLE = [
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/ghs.json",
  "https://latest.currency-api.pages.dev/v1/currencies/ghs.json"
];
// code -> [name, country or region]. Chosen for who actually reads this site: Ghana's
// neighbours and trading partners, the currencies the diaspora sends money from, and the
// majors. Anything not listed is dropped rather than shown as a bare code.
export const CURRENCIES = {
  USD: ["US dollar", "United States"], EUR: ["Euro", "Euro area"], GBP: ["British pound", "United Kingdom"],
  CNY: ["Chinese yuan", "China"], JPY: ["Japanese yen", "Japan"], CHF: ["Swiss franc", "Switzerland"],
  CAD: ["Canadian dollar", "Canada"], AUD: ["Australian dollar", "Australia"], INR: ["Indian rupee", "India"],
  AED: ["UAE dirham", "United Arab Emirates"], SAR: ["Saudi riyal", "Saudi Arabia"], QAR: ["Qatari riyal", "Qatar"],
  TRY: ["Turkish lira", "Türkiye"], BRL: ["Brazilian real", "Brazil"], RUB: ["Russian rouble", "Russia"],
  SEK: ["Swedish krona", "Sweden"], NOK: ["Norwegian krone", "Norway"], DKK: ["Danish krone", "Denmark"],
  SGD: ["Singapore dollar", "Singapore"], HKD: ["Hong Kong dollar", "Hong Kong"], KRW: ["South Korean won", "South Korea"],
  NGN: ["Nigerian naira", "Nigeria"], XOF: ["CFA franc BCEAO", "West Africa"], XAF: ["CFA franc BEAC", "Central Africa"],
  ZAR: ["South African rand", "South Africa"], KES: ["Kenyan shilling", "Kenya"], UGX: ["Ugandan shilling", "Uganda"],
  TZS: ["Tanzanian shilling", "Tanzania"], RWF: ["Rwandan franc", "Rwanda"], ETB: ["Ethiopian birr", "Ethiopia"],
  EGP: ["Egyptian pound", "Egypt"], MAD: ["Moroccan dirham", "Morocco"], TND: ["Tunisian dinar", "Tunisia"],
  DZD: ["Algerian dinar", "Algeria"], LRD: ["Liberian dollar", "Liberia"], SLE: ["Sierra Leonean leone", "Sierra Leone"],
  GMD: ["Gambian dalasi", "The Gambia"], GNF: ["Guinean franc", "Guinea"], CVE: ["Cape Verdean escudo", "Cape Verde"],
  ZMW: ["Zambian kwacha", "Zambia"], BWP: ["Botswana pula", "Botswana"], MUR: ["Mauritian rupee", "Mauritius"],
  NAD: ["Namibian dollar", "Namibia"], MWK: ["Malawian kwacha", "Malawi"], MZN: ["Mozambican metical", "Mozambique"],
  AOA: ["Angolan kwanza", "Angola"], CDF: ["Congolese franc", "DR Congo"], ZWL: ["Zimbabwean dollar", "Zimbabwe"],
  XDR: ["IMF special drawing right", "International Monetary Fund"]
};

export function parseCediTable(json) {
  const r = json && json.ghs;
  if (!r || !json.date) return null;
  const rates = {};
  for (const [code, [name, place]] of Object.entries(CURRENCIES)) {
    const perCedi = r[code.toLowerCase()];
    if (typeof perCedi !== "number" || !(perCedi > 0)) continue;
    // stored as cedis per unit, which is how the rate is quoted in Ghana
    rates[code] = { name, place, ghs: +(1 / perCedi).toPrecision(8), per: +perCedi.toPrecision(8) };
  }
  return Object.keys(rates).length ? { date: json.date, rates } : null;
}

async function fetchCediTable(log) {
  for (const url of CEDI_TABLE) {
    try {
      const got = parseCediTable(await getJson(url));
      if (!got) throw new Error("no cedi table in the reply");
      log.push(`exchange table: ${Object.keys(got.rates).length} currencies, ${got.date}`);
      return got;
    } catch (e) { log.push(`exchange table ${url}: failed (${e.message})`); }
  }
  return null;
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

  const cedis = await fetchCedis(log);
  const exchange = await fetchCediTable(log) || old.exchange || null;

  for (const [group, list] of Object.entries(SYMBOLS)) {
    const kept = new Map((world[group] || []).map(x => [x.symbol, x]));
    let got = 0;
    for (const [symbol, name, unit, dec] of list) {
      try {
        const before = kept.get(symbol) || {};
        let q;
        if (cedis[symbol]) {
          // a daily mid-market rate: yesterday's stored close is what it moved from
          const past = (before.history || []).filter(p => p && p.date !== cedis[symbol].at.slice(0, 10));
          const prev = past.length ? past[past.length - 1].value : (before.prev ?? null);
          const value = cedis[symbol].value;
          q = {
            value, prev,
            change: prev ? +(value - prev).toPrecision(6) : null,
            pct: prev ? +((value / prev - 1) * 100).toFixed(2) : null,
            at: cedis[symbol].at,
            daily: true
          };
        } else {
          q = parseQuote(await getQuoteJson(CHART(symbol)));
          if (!q) throw new Error("no usable quote");
          await wait(350);          // Yahoo refuses a burst; a third of a second apart is plenty
        }
        kept.set(symbol, { symbol, name, unit, dec, ...q, history: addPoint(before.history, q.value, q.at) });
        got++;
      } catch (e) { log.push(`${symbol}: ${e.message}`); }
    }
    world[group] = list.map(([symbol]) => kept.get(symbol)).filter(Boolean);
    log.push(`${group}: ${got}/${list.length} fresh, ${world[group].length} held`);
  }

  // Always write. `world` and `ghana` both start from what the file already held, so a run that
  // fetched nothing simply rewrites the same prices — it can never empty the file. What it does
  // add is the log, and that is the point: when this job came back with nothing it wrote nothing,
  // so there was no way to see why from the site. Now the reason is in the file and on #status.
  save(FILE, "GDC_MARKETS", {
    updated: new Date().toISOString(),
    note: "Market prices as last traded, from Yahoo Finance, with the cedi pairs on a daily mid-market rate. Exchanges close overnight and at weekends, so a price carries the moment it was quoted.",
    source: "Yahoo Finance, with daily mid-market rates for the cedi",
    log,
    world,
    exchange
  });
  console.log(log.join("\n"));
}

if (import.meta.url === `file://${process.argv[1]}`) main();

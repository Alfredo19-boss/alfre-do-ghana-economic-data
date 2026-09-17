// World and African headlines.
//
// Writes world-data.js: two lists, one of world stories and one of African stories, both
// taken from GDELT's open index of the world's news. Only the headline, the publisher, the
// time and the link are kept — every link goes to the publisher's own page, and nothing is
// summarised or rewritten here.
//
// GDELT is used rather than the publishers' own feeds because most of the big wires have
// either retired their RSS or block crawlers. A feed that returns nothing is logged and the
// stories already in the file stand; the job never empties a list it cannot refill.
//
// Usually run manually or from a dedicated workflow; the business news workflow carries world
// lists inside news-data.js and no longer invokes this script on every run.
//
// Run locally: node scripts/fetch-world-news.mjs
import { load, save } from "./lib/datafile.mjs";

const FILE = new URL("../world-data.js", import.meta.url).pathname;
const UA = "Mozilla/5.0 (compatible; AlfredoGhanaEconomicData/1.0; world news)";

const KEEP_HOURS = 36;      // a headline older than this drops off the list
const MAX_PER_LIST = 40;
const RETRYABLE = new Set([429, 500, 502, 503, 504]);

// One entry per publisher, so a single feed failing costs only its own stories.
export const WORLD = [
  { source: "Reuters", domain: "reuters.com", query: "(world OR global OR economy OR markets OR election OR summit OR central bank)" },
  { source: "Associated Press", domain: "apnews.com", query: "(world OR global OR economy OR election OR summit OR conflict)" },
  { source: "BBC News", domain: "bbc.com", query: "(world OR global OR economy OR election OR summit)" },
  { source: "Al Jazeera", domain: "aljazeera.com", query: "(world OR global OR economy OR election OR summit)" },
  { source: "France 24", domain: "france24.com", query: "(world OR global OR economy OR election OR summit)" },
  { source: "CNBC", domain: "cnbc.com", query: "(markets OR economy OR inflation OR federal reserve OR oil OR stocks)" }
];

const AFRICA_TERMS = "(Africa OR African OR Nigeria OR Kenya OR Ethiopia OR \"South Africa\" OR Senegal OR " +
  "Morocco OR Egypt OR Tanzania OR Uganda OR Rwanda OR Ivory Coast OR \"Cote d'Ivoire\" OR Zambia OR " +
  "Zimbabwe OR Botswana OR Angola OR Cameroon OR Mali OR Niger OR Sudan OR Algeria OR Tunisia)";

export const AFRICA = [
  { source: "AllAfrica", domain: "allafrica.com", query: "(economy OR trade OR election OR growth OR debt OR currency OR summit OR energy)" },
  { source: "Africanews", domain: "africanews.com", query: "(economy OR trade OR election OR growth OR debt OR currency OR summit OR energy)" },
  { source: "Reuters", domain: "reuters.com", query: AFRICA_TERMS },
  { source: "BBC News", domain: "bbc.com", query: AFRICA_TERMS },
  { source: "Al Jazeera", domain: "aljazeera.com", query: AFRICA_TERMS }
];

export const gdelt = (q, domain) =>
  `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(`${q} domain:${domain}`)}` +
  `&mode=artlist&maxrecords=25&format=json&sort=datedesc&timespan=2d`;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const retryAfterMs = header => {
  const n = Number(header);
  if (Number.isFinite(n) && n > 0) return n * 1000;
  return 0;
};

export async function fetchGdeltJson(url, { attempts = 3, baseDelayMs = 1200 } = {}) {
  let lastErr = null;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" }, signal: AbortSignal.timeout(30000) });
      if (!res.ok) {
        const err = new Error(`HTTP ${res.status}`);
        err.status = res.status;
        err.retryAfterMs = retryAfterMs(res.headers.get("retry-after"));
        throw err;
      }
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch {
        const hint = text.trim().slice(0, 50).replace(/\s+/g, " ") || "empty response";
        const err = new Error(`invalid JSON (${hint})`);
        err.retryable = true;
        throw err;
      }
    } catch (err) {
      lastErr = err;
      const retryable = err.retryable ?? (!err.status || RETRYABLE.has(err.status));
      if (!retryable || attempt === attempts) break;
      const wait = Math.min(10000, Math.max(err.retryAfterMs || 0, baseDelayMs * (2 ** (attempt - 1))));
      await sleep(wait);
    }
  }
  throw lastErr || new Error("fetch failed");
}

const strip = s => String(s).replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&#\d+;/g, "").replace(/\s+/g, " ").trim();

// "20260916T091500Z" -> ISO. Anything unparseable is dropped rather than guessed at.
export function newsDate(seen) {
  const m = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/.exec(String(seen || ""));
  if (!m) { const d = new Date(seen); return isNaN(d) ? null : d.toISOString(); }
  return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}.000Z`;
}

export function parseFeed(json, feed) {
  const rows = (json && Array.isArray(json.articles)) ? json.articles : [];
  return rows.map(a => {
    // GDELT appends the publisher to the headline; the site shows it in its own column
    const title = strip(a.title || "").replace(/\s*[-–|]\s*[A-Za-z0-9 .'&]{2,28}\s*$/, "").trim();
    const link = String(a.url || "");
    const published = newsDate(a.seendate);
    if (!title || title.length < 18) return null;
    if (!/^https?:\/\//.test(link)) return null;
    if (!published) return null;
    if (feed.domain && !link.includes(feed.domain)) return null;
    if (a.language && !/english/i.test(a.language)) return null;
    return { title, link, source: feed.source, published, country: strip(a.sourcecountry || "") };
  }).filter(Boolean);
}

// Newest first, one story per link, nothing older than KEEP_HOURS, and never more than one
// headline from the same publisher back to back so one loud feed cannot fill the list.
export function merge(oldItems, fresh, now = Date.now()) {
  const byLink = new Map();
  const norm = u => String(u).replace(/[?#].*$/, "").replace(/\/$/, "");
  for (const it of [...(oldItems || []), ...fresh]) {
    if (!it || !it.link || !it.published) continue;
    if (now - Date.parse(it.published) > KEEP_HOURS * 3600e3) continue;
    byLink.set(norm(it.link), it);
  }
  const sorted = [...byLink.values()].sort((a, b) => Date.parse(b.published) - Date.parse(a.published));
  const spread = [];
  const held = [];
  for (const it of sorted) {
    const prev = spread[spread.length - 1];
    if (prev && prev.source === it.source) { held.push(it); continue; }
    spread.push(it);
  }
  return [...spread, ...held].slice(0, MAX_PER_LIST);
}

async function fetchList(feeds, log, label) {
  const out = [];
  for (const feed of feeds) {
    try {
      const items = parseFeed(await fetchGdeltJson(gdelt(feed.query, feed.domain)), feed);
      out.push(...items);
      log.push(`${label} · ${feed.source}: ${items.length} stories`);
    } catch (e) {
      log.push(`${label} · ${feed.source}: failed (${e.message})`);
    }
  }
  return out;
}

export async function main() {
  let old = { global: [], africa: [] };
  try { old = load(FILE, "GDC_WORLD"); } catch (e) { /* first run */ }
  const log = [];

  const freshGlobal = await fetchList(WORLD, log, "World");
  const freshAfrica = await fetchList(AFRICA, log, "Africa");

  const global = freshGlobal.length ? merge(old.global, freshGlobal) : (old.global || []);
  const africa = freshAfrica.length ? merge(old.africa, freshAfrica) : (old.africa || []);

  if (!freshGlobal.length && (old.global || []).length) log.push("World: no fresh stories, kept existing list.");
  if (!freshAfrica.length && (old.africa || []).length) log.push("Africa: no fresh stories, kept existing list.");

  if (!global.length && !africa.length) {
    console.log(log.join("\n"));
    console.log("Nothing came back from any feed and no previous world-data.js lists were available.");
    return;
  }

  save(FILE, "GDC_WORLD", {
    updated: new Date().toISOString(),
    note: "Headlines and links only, from GDELT's open index of the world's news. Every link opens the publisher's own page.",
    source: "GDELT Project",
    global,
    africa,
    log: [log.slice(0, 12)]
  });
  console.log(log.join("\n"));
  console.log(`${global.length} world stories, ${africa.length} African stories held.`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();

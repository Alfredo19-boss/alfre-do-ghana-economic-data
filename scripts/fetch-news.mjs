// Hourly Ghana business news job.
// Reads publishers' RSS feeds, keeps business stories, and writes news-data.js for the "Business news" tab.
// Only headlines, short summaries, dates and links are stored; every story links to the publisher.
//
// Run locally: node scripts/fetch-news.mjs
import fs from "node:fs";
import { load } from "./lib/datafile.mjs";
// The world and African headlines ride inside news-data.js rather than a file of their own.
// The news workflow already fetches and commits this file, so the extra lists reach the site
// without the workflow needing a step (or a git add) for a second data file.
import { WORLD, AFRICA, gdelt, parseFeed as parseWorldFeed, merge as mergeWorld, fetchGdeltJson } from "./fetch-world-news.mjs";

const FILE = new URL("../news-data.js", import.meta.url).pathname;
const WORLD_FILE = new URL("../world-data.js", import.meta.url).pathname;
const UA = "Mozilla/5.0 (compatible; AlfredoGhanaEconomicData/1.0; news headlines)";
const MAX_ITEMS = 150;
const MAX_AGE_DAYS = 10;

// filter: true means the feed mixes general news, so only stories that look like business are kept
export const FEEDS = [
  { source: "MyJoyOnline", url: "https://www.myjoyonline.com/business/feed/", filter: false },
  // Citi Newsroom stopped serving RSS in 2026 (both paths return HTML). The entry stays in
  // case it comes back; meanwhile Citi arrives through the wire list below.
  { source: "Citi Newsroom", url: "https://citinewsroom.com/category/business/feed/", filter: false },
  { source: "Graphic Online", url: "https://www.graphic.com.gh/news.feed", filter: true },
  { source: "Graphic Business", url: "https://www.graphic.com.gh/business.feed", filter: false },
  { source: "The High Street Journal", url: "https://thehighstreetjournal.com/feed/", filter: false },
  { source: "Ghana Business News", url: "https://www.ghanabusinessnews.com/feed/", filter: true },
  { source: "Ghana News Agency", url: "https://gna.org.gh/category/business/feed/", filter: false },
  { source: "News Ghana", url: "https://newsghana.com.gh/category/business/feed/", filter: true }
];

const BUSINESS = /\b(bank|banking|cedi|dollar|forex|economy|economic|business|market|stock|gse|bond|t-?bill|treasury|investment|investor|finance|financial|fintech|loan|credit|debt|budget|tax|levy|revenue|imf|inflation|gdp|trade|export|import|afcfta|port|industry|manufactur|company|companies|sme|entrepreneur|mining|gold|cocoa|oil|gas|fuel|petrol|diesel|energy|power|electricity|tariff|price|telecom|mtn|telecel|insurance|pension|remittance|mobile money|momo|payment|agric|farm|jobs|employment|wage|salary|startup|digital|real estate|housing|tourism|shipping|aviation|procurement|contract|soe|bog)\b/i;

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", hellip: "…", ndash: "–", mdash: "—", lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”" };
export function decode(s) {
  return String(s || "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m);
}
const strip = s => decode(s).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const tag = (xml, name) => {
  const m = new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i").exec(xml);
  return m ? m[1] : "";
};

export function summarise(text, max = 190) {
  let t = strip(text)
    .replace(/The post .*? appeared first on .*$/i, "")
    .replace(/Read more.*$/i, "")
    .trim();
  if (t.length <= max) return t;
  t = t.slice(0, max);
  return t.slice(0, Math.max(t.lastIndexOf(" "), max - 20)).replace(/[,;:.\s]+$/, "") + "…";
}

export function parseFeed(xml, feed) {
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) || [];
  return blocks.map(b => {
    const title = strip(tag(b, "title"));
    let link = strip(tag(b, "link"));
    if (!link) { const m = /<link[^>]*href=["']([^"']+)["']/i.exec(b); link = m ? m[1] : ""; }
    const dateRaw = strip(tag(b, "pubDate") || tag(b, "published") || tag(b, "updated") || tag(b, "dc:date"));
    const d = new Date(dateRaw);
    const published = isNaN(d) ? null : d.toISOString();
    const summary = summarise(tag(b, "description") || tag(b, "summary") || "");
    const categories = (b.match(/<category[^>]*>([\s\S]*?)<\/category>/gi) || []).map(c => strip(c.replace(/<\/?category[^>]*>/gi, "")));
    return { title, link, source: feed.source, published, summary, categories };
  }).filter(i => i.title && /^https?:\/\//.test(i.link) && i.published);
}


/* ---------- the wire: Reuters, through GDELT's open news index ----------
 * Reuters retired its public RSS feeds and blocks crawlers, so headlines come from GDELT,
 * a free index of the world's news. Only the headline, the publisher and the link are kept,
 * and every link goes to Reuters' own page. If GDELT is quiet the rest of the job carries on.
 */
export const WIRE = [
  { source: "Reuters", domain: "reuters.com", query: "(Ghana OR cedi OR Accra) (economy OR inflation OR debt OR cocoa OR gold OR IMF OR budget OR bank)" },
  { source: "Reuters", domain: "reuters.com", query: "\"West Africa\" (economy OR currency OR cocoa OR gold OR debt)" },
  { source: "Citi Newsroom", domain: "citinewsroom.com", query: "(economy OR cedi OR inflation OR business OR bank OR tax OR budget OR cocoa OR gold OR fuel OR IMF)" },
  { source: "Citi Newsroom", domain: "citinewsroom.com", query: "(Ghana Stock Exchange OR treasury OR interest OR trade OR investment OR mining OR energy)" }
];
const GDELT = (q, domain) =>
  `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(`${q} domain:${domain}`)}` +
  `&mode=artlist&maxrecords=25&format=json&sort=datedesc&timespan=7d`;

// "20260914T091500Z" -> ISO, and anything unparseable is dropped
export function wireDate(seen) {
  const m = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/.exec(String(seen || ""));
  if (!m) { const d = new Date(seen); return isNaN(d) ? null : d.toISOString(); }
  return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}.000Z`;
}

export function parseWire(json, feed) {
  const rows = (json && Array.isArray(json.articles)) ? json.articles : [];
  return rows.map(a => {
    // GDELT keeps the publisher's name on the end of the headline; the site shows it separately
    const title = strip(a.title || "")
      .replace(/\s*[-–|]\s*(Reuters(\.com)?|Citinewsroom|Citi Newsroom|Citi FM|MyJoyOnline|Graphic Online)\s*$/i, "")
      .trim();
    const link = String(a.url || "");
    const published = wireDate(a.seendate);
    if (!title || !/^https?:\/\//.test(link) || !published) return null;
    if (feed.domain && !link.includes(feed.domain)) return null;
    if (a.language && !/english/i.test(a.language)) return null;
    return { title, link, source: feed.source, published, summary: "", categories: ["wire"], wire: true };
  }).filter(Boolean);
}

export async function fetchWire(log) {
  const out = [];
  for (const feed of WIRE) {
    try {
      const items = parseWire(await fetchGdeltJson(GDELT(feed.query, feed.domain)), feed);
      out.push(...items);
      log.push(`${feed.source} wire: ${items.length} stories`);
    } catch (e) { log.push(`${feed.source} wire: failed (${e.message})`); }
  }
  return out;
}

export function keep(item, feed) {
  if (!feed.filter) return true;
  return BUSINESS.test(`${item.title} ${item.categories.join(" ")}`);
}

export function mergeNews(oldItems, freshItems, now = Date.now()) {
  const byLink = new Map();
  const norm = u => u.replace(/[?#].*$/, "").replace(/\/$/, "");
  for (const i of [...oldItems, ...freshItems]) {
    const key = norm(i.link);
    const prev = byLink.get(key);
    byLink.set(key, prev ? { ...prev, ...i, summary: i.summary || prev.summary } : i);
  }
  // also drop near-duplicate titles from the same source
  const seenTitles = new Set();
  return [...byLink.values()]
    .filter(i => now - Date.parse(i.published) < MAX_AGE_DAYS * 864e5 && Date.parse(i.published) < now + 36e5)
    .sort((a, b) => b.published.localeCompare(a.published))
    .filter(i => { const k = i.source + "|" + i.title.toLowerCase().replace(/\W+/g, " ").trim(); if (seenTitles.has(k)) return false; seenTitles.add(k); return true; })
    .slice(0, MAX_ITEMS)
    .map(({ title, link, source, published, summary, wire }) => (wire ? { title, link, source, published, summary, wire } : { title, link, source, published, summary }));
}

function loadExisting() {
  if (!fs.existsSync(FILE)) return { items: [] };
  const sandbox = { window: {} };
  try {
    new Function("window", fs.readFileSync(FILE, "utf8"))(sandbox.window);
    return sandbox.window.GDC_NEWS || { items: [] };
  } catch { return { items: [] }; }
}

// The workflow runs hourly; keep a small guard so repeated manual dispatches do not hammer GDELT.
const WORLD_EVERY_MS = 55 * 60 * 1000;

// One publisher at a time, so a single feed failing costs only its own stories.
async function fetchWorldList(feeds, log, label) {
  const out = [];
  for (const feed of feeds) {
    try {
      const items = parseWorldFeed(await fetchGdeltJson(gdelt(feed.query, feed.domain)), feed);
      out.push(...items);
      log.push(`${label} · ${feed.source}: ${items.length} stories`);
    } catch (e) { log.push(`${label} · ${feed.source}: failed (${e.message})`); }
  }
  return out;
}

function loadExistingWorld() {
  try { return load(WORLD_FILE, "GDC_WORLD"); } catch { return null; }
}

async function main() {
  const existing = loadExisting();
  const existingWorld = loadExistingWorld();
  const log = [];
  const fresh = [];
  for (const feed of FEEDS) {
    try {
      const res = await fetch(feed.url, { headers: { "User-Agent": UA, Accept: "application/rss+xml, application/xml, text/xml, */*" }, signal: AbortSignal.timeout(30000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const xml = await res.text();
      if (!/<(rss|feed|rdf)/i.test(xml.slice(0, 2000))) throw new Error("not an RSS/Atom feed");
      const items = parseFeed(xml, feed);
      const kept = items.filter(i => keep(i, feed));
      fresh.push(...kept);
      log.push(`${feed.source}: ${kept.length}/${items.length} stories`);
    } catch (e) {
      log.push(`${feed.source}: failed (${e.message})`);
    }
  }
  fresh.push(...await fetchWire(log));

  // World and African headlines, fetched BEFORE any decision to stop. Ghana's publishers and
  // GDELT fail independently; a bad morning for the RSS feeds must not cost the world lists.
  let world = (existing.world || []).length ? existing.world : (existingWorld?.global || []);
  let africa = (existing.africa || []).length ? existing.africa : (existingWorld?.africa || []);
  let worldAt = existing.worldAt || existingWorld?.updated || null;
  const heldAge = worldAt ? Date.now() - Date.parse(worldAt) : Infinity;
  if (heldAge > WORLD_EVERY_MS) {
    try {
      const freshWorld = await fetchWorldList(WORLD, log, "World");
      const freshAfrica = await fetchWorldList(AFRICA, log, "Africa");
      if (freshWorld.length) world = mergeWorld(world, freshWorld);
      if (freshAfrica.length) africa = mergeWorld(africa, freshAfrica);
      if (freshWorld.length || freshAfrica.length) worldAt = new Date().toISOString();
      if (!freshWorld.length && world.length) log.push("World: no fresh stories, kept existing list.");
      if (!freshAfrica.length && africa.length) log.push("Africa: no fresh stories, kept existing list.");
      log.push(`world lists: ${world.length} world, ${africa.length} African stories held`);
    } catch (e) {
      log.push(`world headlines failed: ${e.message}`);
    }
  } else {
    log.push(`world lists: refreshed ${Math.round(heldAge / 60000)} min ago, left alone this run`);
  }

  console.log(log.join("\n"));

  // Nothing new anywhere? Say so and stop — but WITHOUT a failing exit code. This step has no
  // "|| echo" guard in the workflow, so exiting non-zero here kills the whole job: no front
  // pages, no world headlines, no commit. A quiet run is not a failure.
  if (!fresh.length && !world.length && !africa.length) {
    console.log("No feed could be read this run. news-data.js left unchanged.");
    return;
  }

  // sample headlines from the first publish are replaced once live feeds work
  const base = existing.updated ? existing.items || [] : [];
  const items = fresh.length ? mergeNews(base, fresh) : base;
  const out = { updated: new Date().toISOString(), worldAt, sources: [...FEEDS.map(f => f.source), ...new Set(WIRE.map(w => w.source))], log, items, world, africa };
  const body = `/*\n * Alfredo Ghana Economic Data: business headlines collected by .github/workflows/news.yml from publishers' RSS feeds.\n * Do not edit by hand; the next run overwrites this file.\n */\nwindow.GDC_NEWS = ${JSON.stringify(out, null, 2)};\n`;
  const before = fs.existsSync(FILE) ? fs.readFileSync(FILE, "utf8") : "";
  const sameItems = before.includes(JSON.stringify(items.slice(0, 3), null, 2).slice(0, 400));
  fs.writeFileSync(FILE, body);
  console.log(`${items.length} headlines saved${sameItems ? " (no new stories at the top)" : ""}.`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();

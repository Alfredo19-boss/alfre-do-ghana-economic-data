// Hourly Ghana business news job.
// Reads publishers' RSS feeds, keeps business stories, and writes news-data.js for the "Business news" tab.
// Only headlines, short summaries, dates and links are stored; every story links to the publisher.
//
// Run locally: node scripts/fetch-news.mjs
import fs from "node:fs";

const FILE = new URL("../news-data.js", import.meta.url).pathname;
const UA = "Mozilla/5.0 (compatible; AlfredoGhanaEconomicData/1.0; news headlines)";
const MAX_ITEMS = 150;
const MAX_AGE_DAYS = 10;

// filter: true means the feed mixes general news, so only stories that look like business are kept
export const FEEDS = [
  { source: "MyJoyOnline", url: "https://www.myjoyonline.com/business/feed/", filter: false },
  { source: "Citi Newsroom", url: "https://citinewsroom.com/category/business/feed/", filter: false },
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
    .map(({ title, link, source, published, summary }) => ({ title, link, source, published, summary }));
}

function loadExisting() {
  if (!fs.existsSync(FILE)) return { items: [] };
  const sandbox = { window: {} };
  try {
    new Function("window", fs.readFileSync(FILE, "utf8"))(sandbox.window);
    return sandbox.window.GDC_NEWS || { items: [] };
  } catch { return { items: [] }; }
}

async function main() {
  const existing = loadExisting();
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
  console.log(log.join("\n"));
  if (!fresh.length) {
    console.error("No feed could be read. news-data.js was left unchanged.");
    process.exitCode = 1;
    return;
  }
  // sample headlines from the first publish are replaced once live feeds work
  const base = existing.updated ? existing.items || [] : [];
  const items = mergeNews(base, fresh);
  const out = { updated: new Date().toISOString(), sources: FEEDS.map(f => f.source), log, items };
  const body = `/*\n * Alfredo Ghana Economic Data: business headlines collected by .github/workflows/news.yml from publishers' RSS feeds.\n * Do not edit by hand; the next run overwrites this file.\n */\nwindow.GDC_NEWS = ${JSON.stringify(out, null, 2)};\n`;
  const before = fs.existsSync(FILE) ? fs.readFileSync(FILE, "utf8") : "";
  const sameItems = before.includes(JSON.stringify(items.slice(0, 3), null, 2).slice(0, 400));
  fs.writeFileSync(FILE, body);
  console.log(`${items.length} headlines saved${sameItems ? " (no new stories at the top)" : ""}.`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();

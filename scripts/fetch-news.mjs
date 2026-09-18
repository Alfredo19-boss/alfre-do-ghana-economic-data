// Hourly Ghana business news job.
// Reads publishers' RSS feeds, keeps business stories, and writes news-data.js for the "Business news" tab.
// Only headlines, short summaries, dates and links are stored; every story links to the publisher.
//
// Run locally: node scripts/fetch-news.mjs
import fs from "node:fs";
// The world and African headlines ride inside news-data.js rather than a file of their own.
// The news workflow already fetches and commits this file, so the extra lists reach the site
// without the workflow needing a step (or a git add) for a second data file. Everything they
// need is in this one file — no second script has to be uploaded or kept in step.

const FILE = new URL("../news-data.js", import.meta.url).pathname;
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
    return { title, link, source: feed.source, published, summary, categories, image: feedImage(b) };
  }).filter(i => i.title && /^https?:\/\//.test(i.link) && i.published);
}

// The picture a publisher attaches to its own story. Feeds advertise it in four different
// ways, so all four are tried in the order most likely to be the real photograph rather than
// a logo or a tracking pixel. Only https is kept — the site is served over https and a plain
// http image would be blocked by the browser anyway. Nothing is downloaded or re-hosted: the
// URL is stored and the reader's browser loads it from the publisher, as a feed intends.
export function feedImage(block) {
  const tries = [
    /<media:content[^>]+url=["']([^"']+)["'][^>]*>/i,
    /<media:thumbnail[^>]+url=["']([^"']+)["']/i,
    /<enclosure[^>]+url=["']([^"']+)["'][^>]*type=["']image\//i,
    /<enclosure[^>]+type=["']image\/[^"']*["'][^>]*url=["']([^"']+)["']/i,
    /<img[^>]+src=["']([^"']+)["']/i,
    /&lt;img[^&]*src=["']([^"']+)["']/i
  ];
  for (const re of tries) {
    const m = re.exec(block);
    if (!m) continue;
    const url = decode(m[1]).trim();
    if (!/^https:\/\//i.test(url)) continue;
    if (!/\.(jpe?g|png|webp|avif|gif)(\?|$)/i.test(url) && !/image|photo|media|thumb/i.test(url)) continue;
    if (/1x1|pixel|spacer|blank\.|\/ads?\//i.test(url)) continue;     // tracking pixels, not photographs
    return url;
  }
  return null;
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
      const res = await fetch(GDELT(feed.query, feed.domain), { headers: { "User-Agent": UA, Accept: "application/json" }, signal: AbortSignal.timeout(30000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const items = parseWire(await res.json(), feed);
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

/* ---------- world and African headlines ----------
 * These used to come from GDELT. GDELT answers GitHub's servers with HTTP 429 often enough
 * that it cannot be the only route — that is why Global news and the African strip stayed
 * empty. They now read the publishers' own RSS, which needs no key and no quota. Each feed
 * is fetched on its own, so one publisher failing costs only its own stories, and a list is
 * never emptied because it could not be refilled.
 */
const WORLD_FEEDS = [
  { source: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml" },
  { source: "Africanews", url: "https://www.africanews.com/feed/rss" },
  { source: "NPR World", url: "https://feeds.npr.org/1004/rss.xml" },
  { source: "UN News", url: "https://news.un.org/feed/subscribe/en/news/all/rss.xml" },
  { source: "BBC News", url: "https://feeds.bbci.co.uk/news/world/rss.xml" },
  { source: "Deutsche Welle", url: "https://rss.dw.com/rdf/rss-en-world" },
  { source: "France 24", url: "https://www.france24.com/en/rss" }
];

// Africa: two feeds that are African by definition, and general feeds filtered to African stories.
const AFRICAN = /\b(africa|african|sahel|maghreb|ghana|nigeria|kenya|ethiopia|south africa|senegal|morocco|egypt|tanzania|uganda|rwanda|ivory coast|c[oô]te d.?ivoire|zambia|zimbabwe|botswana|angola|cameroon|mali|niger|sudan|somalia|algeria|tunisia|libya|mozambique|malawi|namibia|burkina|benin|togo|gambia|guinea|liberia|sierra leone|congo|chad|gabon|madagascar|mauritius|eritrea|djibouti|lesotho|eswatini|accra|lagos|nairobi|addis ababa|cairo|johannesburg|dakar|abuja|kampala|kinshasa)\b/i;

const AFRICA_FEEDS = [
  { source: "AllAfrica", url: "https://allafrica.com/tools/headlines/rdf/latest/headlines.rdf" },
  { source: "AllAfrica Business", url: "https://allafrica.com/tools/headlines/rdf/business/headlines.rdf" },
  { source: "Africanews", url: "https://www.africanews.com/feed/rss", onlyAfrican: true },
  { source: "BBC Africa", url: "https://feeds.bbci.co.uk/news/world/africa/rss.xml" },
  { source: "Deutsche Welle", url: "https://rss.dw.com/rdf/rss-en-africa" },
  { source: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml", onlyAfrican: true }
];

// Publishers' feeds are cheap but not free, and this job runs every five minutes. Refreshing
// the world lists every twenty is plenty — a headline does not go stale in a quarter of an hour
// — and it keeps the site a polite visitor to every publisher it borrows from.
const WORLD_EVERY_MS = 18 * 60 * 1000;
const WORLD_KEEP_HOURS = 36;     // a headline older than this drops off the list
const WORLD_MAX = 40;            // per list

const wait = ms => new Promise(r => setTimeout(r, ms));

// One publisher at a time, so a single feed failing costs only its own stories.
async function fetchWorldList(feeds, log, label) {
  const out = [];
  for (const feed of feeds) {
    try {
      const res = await fetch(feed.url, { headers: { "User-Agent": UA, Accept: "application/rss+xml, application/xml, text/xml, */*" }, signal: AbortSignal.timeout(20000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const xml = await res.text();
      if (!/<(rss|feed|rdf)/i.test(xml.slice(0, 2000))) throw new Error("not an RSS/Atom feed");
      let items = parseFeed(xml, feed)
        .map(({ title, link, source, published, summary, image }) => (image ? { title, link, source, published, summary, image } : { title, link, source, published, summary }));
      if (feed.onlyAfrican) items = items.filter(i => AFRICAN.test(`${i.title} ${i.summary}`));
      out.push(...items);
      log.push(`${label} · ${feed.source}: ${items.length} stories`);
    } catch (e) {
      log.push(`${label} · ${feed.source}: failed (${e.message})`);
    }
    await wait(400);
  }
  return out;
}

// Newest first, one story per link, nothing older than WORLD_KEEP_HOURS, and never two
// headlines from the same publisher back to back, so one busy feed cannot fill the strip.
export function mergeWorld(oldItems, fresh, now = Date.now()) {
  const norm = u => String(u).replace(/[?#].*$/, "").replace(/\/$/, "");
  const byLink = new Map();
  for (const it of [...(oldItems || []), ...(fresh || [])]) {
    if (!it || !it.link || !it.published) continue;
    if (now - Date.parse(it.published) > WORLD_KEEP_HOURS * 36e5) continue;
    if (Date.parse(it.published) > now + 36e5) continue;   // a feed with a clock ahead of ours
    byLink.set(norm(it.link), it);
  }
  const pool = [...byLink.values()].sort((a, b) => b.published.localeCompare(a.published));
  const out = [];
  while (pool.length && out.length < WORLD_MAX) {
    // the newest story that is not from the publisher we just used; if every remaining story
    // is from that publisher, take the newest anyway rather than dropping it
    let i = pool.findIndex(it => !out.length || out[out.length - 1].source !== it.source);
    if (i < 0) i = 0;
    out.push(pool.splice(i, 1)[0]);
  }
  return out;
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
  fresh.push(...await fetchWire(log));

  // World and African headlines, fetched BEFORE any decision to stop. Ghana's publishers and
  // GDELT fail independently; a bad morning for the RSS feeds must not cost the world lists.
  let world = existing.world || [], africa = existing.africa || [];
  const heldAge = existing.worldAt ? Date.now() - Date.parse(existing.worldAt) : Infinity;
  let worldAt = existing.worldAt || null;
  if (heldAge > WORLD_EVERY_MS) {
    try {
      world = mergeWorld(world, await fetchWorldList(WORLD_FEEDS, log, "World"));
      africa = mergeWorld(africa, await fetchWorldList(AFRICA_FEEDS, log, "Africa"));
      worldAt = new Date().toISOString();
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

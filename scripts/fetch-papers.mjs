// Today's papers: the front-page stories Ghana's newsrooms are leading with.
// Headlines, summaries and links only — every story opens on the publisher's own site.
// Run hourly by .github/workflows/news.yml, alongside the business news job.
import { load, save } from "./lib/datafile.mjs";
import { decode, parseFeed, parseWire } from "./fetch-news.mjs";

const FILE = new URL("../papers-data.js", import.meta.url).pathname;
const DAY = 86400000;

export const PAPERS = [
  { source: "Daily Graphic", url: "https://www.graphic.com.gh/news.feed", site: "https://www.graphic.com.gh/" },
  { source: "Graphic Business", url: "https://www.graphic.com.gh/business.feed", site: "https://www.graphic.com.gh/business" },
  { source: "Graphic Sports", url: "https://www.graphic.com.gh/sports.feed", site: "https://www.graphic.com.gh/sports" },
  { source: "MyJoyOnline", url: "https://www.myjoyonline.com/feed/", site: "https://www.myjoyonline.com/" },
  // Citi's RSS now returns HTML, so its front page comes through the news index instead
  { source: "Citi Newsroom", url: "https://citinewsroom.com/feed/", site: "https://citinewsroom.com/", wire: "citinewsroom.com" },
  { source: "Ghana News Agency", url: "https://gna.org.gh/feed/", site: "https://gna.org.gh/" },
  { source: "Ghanaian Times", url: "https://ghanaiantimes.com.gh/feed/", site: "https://ghanaiantimes.com.gh/" }
];

// one masthead's stories for the day, newest first, at most `perPaper`
export function mergePapers(old, fresh, { perPaper = 8, days = 3 } = {}) {
  const cutoff = Date.now() - days * DAY;
  const seen = new Map();
  for (const item of [...fresh, ...(old.items || [])]) {
    if (!item || !item.link || !item.title) continue;
    const when = Date.parse(item.published || "");
    if (isFinite(when) && when < cutoff) continue;
    const key = item.link.split("?")[0];
    if (!seen.has(key)) seen.set(key, item);
  }
  const all = [...seen.values()].sort((a, b) => Date.parse(b.published || 0) - Date.parse(a.published || 0));
  const perSource = new Map();
  const kept = [];
  for (const item of all) {
    const n = perSource.get(item.source) || 0;
    if (n >= perPaper) continue;
    perSource.set(item.source, n + 1);
    kept.push(item);
  }
  return kept;
}

export async function main() {
  const log = [];
  let old = {};
  try { old = load(FILE, "GDC_PAPERS"); } catch { /* first run */ }

  const fresh = [];
  for (const paper of PAPERS) {
    try {
      const res = await fetch(paper.url, { headers: { "user-agent": "alfredo-ghana-economic-data/1.0 (+public dashboard)" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const items = parseFeed(await res.text(), { source: paper.source });
      fresh.push(...items.map(i => ({ ...i, title: decode(i.title), site: paper.site })));
      log.push(`${paper.source}: ${items.length} stories`);
    } catch (e) { log.push(`${paper.source} failed: ${e.message}`); }

    // a masthead with no working feed: fall back to the open news index, headlines only
    if (paper.wire && !fresh.some(i => i.source === paper.source)) {
      try {
        const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(`Ghana domain:${paper.wire}`)}` +
          `&mode=artlist&maxrecords=20&format=json&sort=datedesc&timespan=2d`;
        const res = await fetch(url, { headers: { "user-agent": "alfredo-ghana-economic-data/1.0" }, signal: AbortSignal.timeout(30000) });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const items = parseWire(await res.json(), { source: paper.source, domain: paper.wire });
        fresh.push(...items.map(i => ({ ...i, site: paper.site })));
        log.push(`${paper.source}: ${items.length} stories from the news index`);
      } catch (e) { log.push(`${paper.source} index fallback failed: ${e.message}`); }
    }
  }

  if (!fresh.length) {
    console.log(log.join("\n"));
    console.error("Every masthead failed; papers-data.js left unchanged.");
    process.exitCode = 1;
    return;
  }

  const items = mergePapers(old, fresh);
  const papers = [...new Set(items.map(i => i.source))];
  save(FILE, "GDC_PAPERS", {
    updated: new Date().toISOString(),
    note: "Front-page stories as the newsrooms are running them. Headlines and links only; every story opens on the publisher's own website.",
    papers: PAPERS.filter(p => papers.includes(p.source)).map(p => ({ source: p.source, site: p.site })),
    items
  });
  log.push(`${items.length} stories from ${papers.length} mastheads`);
  console.log(log.join("\n"));
}

if (import.meta.url === `file://${process.argv[1]}`) main();

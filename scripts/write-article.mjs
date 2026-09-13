// Writes a dated briefing from the figures already on the dashboard: debt, prices,
// the cedi, trade and the week ahead. Every sentence is assembled from data.js,
// auto-data.js and history-data.js — nothing is invented, and each figure keeps its date.
// Run weekly by .github/workflows/article.yml.
import fs from "node:fs";
import path from "node:path";
import { load, save, MONTHS_LONG } from "./lib/datafile.mjs";

const DIR = new URL("../", import.meta.url).pathname;
const INDEX = path.join(DIR, "articles-data.js");
const FOLDER = path.join(DIR, "articles");
const KEEP = 24;

const fmt = (v, dec = 0) => Number(v).toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
const bn = v => `GH¢${fmt(v / 1e9, 1)}bn`;
const day = d => `${d.getUTCDate()} ${MONTHS_LONG[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
const dayLabel = v => (/^\d{4}-\d{2}-\d{2}$/.test(v || "") ? day(parseDay(v)) : v);
const parseDay = iso => new Date(Date.parse(iso + "T00:00:00Z"));

export function slugFor(title, date) {
  return `${date}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60)}`;
}

// the live debt estimate, worked out exactly as the dashboard does
export function debtNow(D, at = Date.now()) {
  const R = [...D.debt.readings].sort((a, b) => a.date.localeCompare(b.date));
  const last = R[R.length - 1];
  const target = parseDay(last.date);
  target.setUTCDate(1);
  target.setUTCMonth(target.getUTCMonth() - (D.debt.paceMonths || 6) + 1);
  target.setUTCDate(0);
  const earlier = R.filter(r => r.date <= target.toISOString().slice(0, 10) && r !== last);
  const prev = earlier.length ? earlier[earlier.length - 1] : R[0];
  const tL = parseDay(last.date).getTime() + 86400e3;
  const tP = parseDay(prev.date).getTime() + 86400e3;
  const rate = ((last.total - prev.total) * 1e9) / ((tL - tP) / 1000);
  return { last, prev, rate, value: last.total * 1e9 + rate * ((at - tL) / 1000), days: Math.round((tL - tP) / 86400e3) };
}

const find = (D, label) => [...D.economy.flatMap(g => g.items), ...D.people, ...D.markets.flatMap(g => g.items)]
  .find(i => i.label === label) || {};

function movement(item, unit = "%") {
  const s = (item.series || []).filter(p => p.date !== item.date);
  if (!s.length) return "";
  const prev = s[s.length - 1];
  const diff = item.value - prev.value;
  if (Math.abs(diff) < 1e-9) return ` — unchanged from ${prev.date}`;
  return ` — ${diff > 0 ? "up" : "down"} from ${fmt(prev.value, item.dec ?? 1)}${unit} in ${prev.date}`;
}

export function buildArticle(D, A, H, now = new Date()) {
  const date = now.toISOString().slice(0, 10);
  const d = debtNow(D, now.getTime());
  const infl = find(D, "Inflation"), policy = find(D, "BoG policy rate");
  const t91 = find(D, "91-day T-bill"), usd = { ...find(D, "US dollar") };
  // the daily market job holds a fresher cedi rate than the hand-entered fallback
  const autoUsd = A?.values?.["fx.usd"];
  if (autoUsd && typeof autoUsd.value === "number") { usd.value = autoUsd.value; usd.date = autoUsd.date; }
  const res = find(D, "Gross reserves"), gold = find(D, "Gold price"), cocoa = find(D, "Cocoa world price");
  const surplus = find(D, "Trade surplus"), petrol = find(D, "Petrol");
  const budget = k => [...D.budget.in, ...D.budget.out].find(b => b.key === k) || {};
  const revenue = budget("rev").value, spending = budget("exp").value, interest = budget("int").value, tax = budget("tax").value;
  const y0 = Date.UTC(D.budget.year, 0, 1), y1 = Date.UTC(D.budget.year + 1, 0, 1);
  const frac = Math.min(1, Math.max(0, (now.getTime() - y0) / (y1 - y0)));
  const cedi0 = (D.cedi || [])[0];
  const cediMove = cedi0 && usd.value ? (usd.value / cedi0.rate - 1) * 100 : null;
  const pop = D.population.base;
  const realRate = policy.value - infl.value;

  const title = `Ghana's economy, week to ${day(now)}`;
  const standfirst = `Public debt is running at about ${bn(d.value)}, inflation stands at ${fmt(infl.value, 1)}% for ${infl.date}, and the policy rate is ${fmt(policy.value, 1)}%. This briefing is assembled from the published figures on the dashboard, each with the date it belongs to.`;

  const body = `## The debt

Ghana's public debt is estimated at **${bn(d.value)}** this morning. That is not a measurement: the Bank of Ghana's most recent published total is **${bn(d.last.total * 1e9)}** at ${day(parseDay(d.last.date))}, and the counter carries it forward at the pace debt grew between ${day(parseDay(d.prev.date))} and ${day(parseDay(d.last.date))} — **GH¢${fmt(d.rate, 0)} a second**, or about GH¢${fmt(d.rate * 86400 / 1e6, 1)} million a day.

At that level, each of Ghana's roughly ${fmt(pop / 1e6, 1)} million people carries about **GH¢${fmt(d.value / pop, 0)}** of public debt. Debt-to-GDP was reported at ${fmt(D.debt.ratioLatest ?? d.last.ratio ?? 0, 1)}% at the latest reading, against a peak of ${fmt(D.debt.ratioPeak.value, 1)}% at ${D.debt.ratioPeak.label}.

## Prices and interest rates

Inflation was **${fmt(infl.value, 1)}%** in ${infl.date}${movement(infl)}. The Bank of Ghana's policy rate is **${fmt(policy.value, 1)}%** (${policy.date}), which leaves a real policy rate of about **${fmt(realRate, 1)} percentage points** once inflation is taken out.

The 91-day Treasury bill last cleared at **${fmt(t91.value, 2)}%** (${t91.date})${movement(t91)}. Petrol is **GH¢${fmt(petrol.value, 2)}** a litre (${petrol.date}).

## The cedi, reserves and commodities

The cedi traded at **GH¢${fmt(usd.value, 4)}** to the dollar on ${dayLabel(usd.date)}${cediMove == null ? "" : `, ${Math.abs(cediMove) < 0.05 ? "level with" : `${cediMove > 0 ? "weaker" : "stronger"} than`} the ${fmt(cedi0.rate, 4)} recorded at ${cedi0.label || "the end of last year"}${Math.abs(cediMove) < 0.05 ? "" : ` — a move of ${fmt(Math.abs(cediMove), 1)}%`}`}.

Gross reserves stood at **US$${fmt(res.value, 1)}bn** (${res.date}). Gold is trading at **US$${fmt(gold.value, 0)}** an ounce and cocoa at **US$${fmt(cocoa.value, 0)}** a tonne${A?.updated ? `, as at ${day(new Date(A.updated))}` : ""}.

## Trade

Exports reached **US$${fmt(D.trade.totalExports, 1)}bn** in ${D.trade.period}, of which gold alone was **US$${fmt(D.trade.goldExports, 1)}bn** — ${fmt(D.trade.goldExports / D.trade.totalExports * 100, 0)}% of everything the country sold abroad. Against imports of about **US$${fmt(D.trade.totalExports - surplus.value, 1)}bn**, that leaves a trade surplus of **US$${fmt(surplus.value, 1)}bn**.

That concentration cuts both ways: the same gold price that has carried the surplus and steadied the cedi is a single market Ghana does not control.

## The budget, so far

The ${D.budget.year} budget approved **${bn(revenue)}** of revenue and grants against **${bn(spending)}** of spending. Spread evenly, ${fmt(frac * 100, 0)}% of the year has passed, which puts revenue at about **${bn(revenue * frac)}** and spending at **${bn(spending * frac)}** — an even-pace estimate, not collection to date.

Interest on debt is budgeted at **${bn(interest)}** for the year, which is **${fmt(interest / tax * 100, 1)}%** of tax revenue: roughly ${fmt(interest / revenue * 100, 0)} pesewas of every cedi the state collects.

## What to watch

${upcoming(D, now)}

---

*Every figure above carries the date of the release it came from. The debt figure is an estimate between monthly publications, worked out from the two most recent Bank of Ghana readings. Sources: Bank of Ghana, Ministry of Finance, Ghana Statistical Service and the other releases listed on the dashboard.*
`;

  return { date, title, standfirst, body, slug: slugFor("weekly-brief", date) };
}

function upcoming(D, now) {
  const days = (D.calendar?.days || []).filter(e => e.rule === "dates" || e.rule === "fixed");
  const soon = [];
  const year = now.getUTCFullYear();
  for (const e of days) {
    const dates = e.rule === "dates" ? (e.dates || []) : [`${year}-${String(e.month).padStart(2, "0")}-${String(e.day).padStart(2, "0")}`];
    for (const iso of dates) {
      const t = Date.parse(iso + "T00:00:00Z");
      if (t > now.getTime() && t < now.getTime() + 60 * 86400e3) soon.push({ name: e.name, t, kind: e.kind });
    }
  }
  soon.sort((a, b) => a.t - b.t);
  if (!soon.length) return "No fixed economic dates fall in the next two months.";
  return soon.slice(0, 4).map(e => `- **${e.name}** — ${day(new Date(e.t))}${e.kind === "holiday" ? " (public holiday)" : ""}`).join("\n");
}

export function main() {
  const D = load(path.join(DIR, "data.js"), "GDC_DATA");
  let A = {}, H = {};
  try { A = load(path.join(DIR, "auto-data.js"), "GDC_AUTO"); } catch {}
  try { H = load(path.join(DIR, "history-data.js"), "GDC_HISTORY"); } catch {}

  const article = buildArticle(D, A, H, new Date());
  fs.mkdirSync(FOLDER, { recursive: true });
  const file = `articles/${article.slug}.md`;
  fs.writeFileSync(path.join(DIR, file), `# ${article.title}\n\n_${article.standfirst}_\n\n${article.body}`);

  let index = { articles: [] };
  try { index = load(INDEX, "GDC_ARTICLES"); } catch {}
  const articles = [{ ...article, file }, ...(index.articles || []).filter(a => a.slug !== article.slug)].slice(0, KEEP);
  save(INDEX, "GDC_ARTICLES", { updated: new Date().toISOString(), articles });
  console.log(`Wrote ${file} (${article.body.length} characters); index holds ${articles.length} articles.`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();

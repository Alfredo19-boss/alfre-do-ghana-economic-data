// African inflation, Ghana at the centre.
// Keeps africa-data.js showing the PREVAILING rate for each country: the most recently published
// month-on-year consumer price inflation, not an annual average.
//
// The file ships with figures checked by hand. This job tops them up every month from the World
// Bank's Global Economic Monitor (monthly CPI, year on year, no key needed) and only ever replaces
// a country's figure with a NEWER month. If a country is missing from the feed, or the feed fails,
// the figure already in the file is kept exactly as it is.
//
// Run locally: node scripts/fetch-africa.mjs
import { load, save } from "./lib/datafile.mjs";

const FILE = new URL("../africa-data.js", import.meta.url).pathname;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// World Bank Global Economic Monitor, in order of preference:
// headline CPI year-on-year, then the seasonally adjusted version.
export const INDICATORS = ["CPTOTSAXNZGY", "CPTOTSAXMZGY"];
const SANE = [-50, 500];

export const url = (group, indicator, from) =>
  `https://api.worldbank.org/v2/country/${group.join(";")}/indicator/${indicator}` +
  `?date=${from}M01:${from + 1}M12&format=json&per_page=5000`;

export async function get(u) {
  const res = await fetch(u, { headers: { "user-agent": "alfredo-ghana-economic-data/1.0" }, signal: AbortSignal.timeout(45000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// "2026M08" -> { key: "2026-08", period: "Aug 2026" }
export function period(wbDate) {
  const m = /^(\d{4})M(\d{2})$/.exec(String(wbDate || ""));
  if (!m) return null;
  const month = +m[2];
  if (month < 1 || month > 12) return null;
  return { key: `${m[1]}-${m[2]}`, period: `${MONTHS[month - 1]} ${m[1]}` };
}

// rows -> { ISO3: { value, key, period } } keeping only the newest month per country
export function newest(rows) {
  const out = {};
  for (const r of rows || []) {
    if (!r || r.value == null || !r.countryiso3code) continue;
    const p = period(r.date);
    const v = +Number(r.value).toFixed(2);
    if (!p || !isFinite(v) || v < SANE[0] || v > SANE[1]) continue;
    const prev = out[r.countryiso3code];
    if (!prev || p.key > prev.key) out[r.countryiso3code] = { value: v, ...p };
  }
  return out;
}

// Replace a country's reading only when the feed has a newer month than the file already holds.
export function apply(countries, fresh, log) {
  let updated = 0;
  for (const [iso, c] of Object.entries(countries)) {
    const f = fresh[iso];
    if (!f) continue;
    if (c.latest && c.latest.key && f.key <= c.latest.key) continue;
    log.push(`${c.name}: ${c.latest ? `${c.latest.value}% (${c.latest.period})` : "—"} -> ${f.value}% (${f.period})`);
    c.prev = c.latest ? c.latest.value : null;
    c.latest = { value: f.value, period: f.period, key: f.key };
    const series = new Map((c.series || []).map(p => [p.date, p]));
    series.set(f.key, { date: f.key, value: f.value });
    c.series = [...series.values()].sort((a, b) => a.date.localeCompare(b.date)).slice(-60);
    updated++;
  }
  return updated;
}

// "Aug 2026" -> { key: "2026-08", period: "Aug 2026" }
export function monthLabel(label) {
  const m = /^([A-Za-z]{3})[a-z]*\s+(\d{4})$/.exec(String(label || "").trim());
  if (!m) return null;
  const i = MONTHS.findIndex(x => x.toLowerCase() === m[1].toLowerCase());
  if (i < 0) return null;
  return { key: `${m[2]}-${String(i + 1).padStart(2, "0")}`, period: `${MONTHS[i]} ${m[2]}` };
}

// Ghana's own figure always matches the dashboard: it comes from data.js, not from a feed.
export function syncGhana(countries, dataFile = new URL("../data.js", import.meta.url).pathname) {
  const log = [];
  const gh = countries.GHA;
  if (!gh) return log;
  let reading = null;
  try {
    const D = load(dataFile, "GDC_DATA");
    for (const group of D.economy || []) {
      for (const it of group.items || []) if (it.label === "Inflation" && typeof it.value === "number") reading = it;
    }
  } catch (e) { log.push(`could not read Ghana's inflation from data.js: ${e.message}`); return log; }
  if (!reading) { log.push("no Inflation reading found in data.js; Ghana left as it was."); return log; }

  const p = monthLabel(reading.date);
  if (!p) { log.push(`Ghana's inflation date "${reading.date}" is not a month; left as it was.`); return log; }
  if (gh.latest && gh.latest.key === p.key && gh.latest.value === reading.value) return log;
  if (gh.latest && p.key < gh.latest.key) { log.push(`data.js Ghana reading (${p.period}) is older than the board's; kept.`); return log; }

  if (gh.latest && p.key > gh.latest.key) gh.prev = gh.latest.value;
  log.push(`Ghana: ${gh.latest ? `${gh.latest.value}% (${gh.latest.period})` : "—"} -> ${reading.value}% (${p.period}), from data.js`);
  gh.latest = { value: reading.value, period: p.period, key: p.key };
  const series = new Map((gh.series || []).map(x => [x.date, x]));
  series.set(p.key, { date: p.key, value: reading.value });
  gh.series = [...series.values()].sort((a, b) => a.date.localeCompare(b.date)).slice(-60);
  return log;
}

export async function main() {
  const log = [];
  let file;
  try {
    file = load(FILE, "GDC_AFRICA");
  } catch (e) {
    console.error(`Could not read africa-data.js (${e.message}). Nothing changed.`);
    process.exitCode = 1;
    return;
  }
  const countries = file.countries || {};
  const codes = Object.keys(countries);
  if (!codes.length) { console.error("No countries in africa-data.js."); process.exitCode = 1; return; }

  const fromYear = new Date().getUTCFullYear() - 1;
  const fresh = {};
  for (const indicator of INDICATORS) {
    for (let i = 0; i < codes.length; i += 20) {
      const group = codes.slice(i, i + 20);
      try {
        const json = await get(url(group, indicator, fromYear));
        const rows = Array.isArray(json) && Array.isArray(json[1]) ? json[1] : [];
        const found = newest(rows);
        for (const [iso, v] of Object.entries(found)) {
          if (!fresh[iso] || v.key > fresh[iso].key) fresh[iso] = v;
        }
        log.push(`${indicator} ${group.length} countries: ${rows.length} rows, ${Object.keys(found).length} with a reading`);
      } catch (e) { log.push(`${indicator} group failed: ${e.message}`); }
    }
  }

  const updated = apply(countries, fresh, log);
  log.push(...syncGhana(countries));
  const ranked = Object.entries(countries)
    .filter(([, c]) => c.latest)
    .map(([iso, c]) => ({ iso, v: c.latest.value }))
    .sort((a, b) => a.v - b.v);

  save(FILE, "GDC_AFRICA", {
    ...file,
    updated: new Date().toISOString(),
    ghana: countries.GHA ? countries.GHA.latest : file.ghana || null,
    ghanaRank: ranked.findIndex(r => r.iso === "GHA") + 1 || null,
    countries
  });
  log.push(updated
    ? `${updated} of ${codes.length} countries moved to a newer month.`
    : `No newer months published; all ${codes.length} readings kept.`);
  console.log(log.join("\n"));
}

if (import.meta.url === `file://${process.argv[1]}`) main();

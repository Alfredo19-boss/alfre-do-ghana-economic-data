// Keep every published figure on its newest reading.
//
// Runs daily. For each figure on the dashboard it looks at the long annual series the site
// already holds (history-data.js, refreshed monthly from the World Bank, the IMF and the
// futures market) and compares the newest year there with the period showing on the page.
//
//   • If the figure has opted in with "wb": true in data.js — meaning the site's own value
//     comes from that same series — the newer reading replaces it and the old one is kept
//     in its history.
//   • Otherwise nothing is overwritten. The newer figure is recorded on the reading as
//     `sourceNewer`, so the page can show it underneath, plainly labelled, and the status
//     page can list what is waiting to be checked by a person.
//
// Nothing here invents a figure. If a statistics office has not published a newer one, the
// dashboard keeps showing the last one it did publish, with its date.
//
// Run locally: node scripts/refresh-readings.mjs
import { load, save } from "./lib/datafile.mjs";

const DATA = new URL("../data.js", import.meta.url).pathname;
const HISTORY = new URL("../history-data.js", import.meta.url).pathname;

// a figure on the page -> the long series that covers it (same names app.js uses)
export const ALIAS = {
  "Trade surplus": "balance", "Nominal GDP": "gdp", "Oil exports": "oil",
  "Jubilee oil output": "oil", "Gold exports": "metals", "Cocoa exports": "foodex",
  "Bank lending growth": "Private credit growth"
};

// a period label -> the year it belongs to, for comparing with an annual series
export function yearOf(label) {
  const m = /(\d{4})/.exec(String(label || ""));
  return m ? +m[1] : null;
}

export function newestPoint(series) {
  const points = (series && series.points) || [];
  return points.length ? points[points.length - 1] : null;
}

export function check(D, H) {
  const log = [];
  const items = [...(D.economy || []).flatMap(g => g.items || []), ...(D.people || []), ...(D.markets || []).flatMap(g => g.items || [])];
  let lifted = 0, flagged = 0, cleared = 0;

  for (const it of items) {
    const series = (H.series || {})[ALIAS[it.label] || it.label];
    const newest = newestPoint(series);
    if (!newest) { if (it.sourceNewer) { delete it.sourceNewer; cleared++; } continue; }

    const onPage = yearOf(it.date);
    const atSource = yearOf(newest.date);
    if (!onPage || !atSource || atSource <= onPage) {
      if (it.sourceNewer) { delete it.sourceNewer; cleared++; }
      continue;
    }

    if (it.wb === true) {
      // the site's own figure comes from this series: move it on, keeping the old reading
      const before = { date: it.date, value: it.value };
      it.series = [...(it.series || []).filter(p => p.date !== before.date), before]
        .sort((a, b) => String(a.date).localeCompare(String(b.date))).slice(-40);
      it.value = newest.value;
      it.date = newest.date;
      delete it.sourceNewer;
      lifted++;
      log.push(`${it.label}: ${before.value} (${before.date}) -> ${newest.value} (${newest.date})`);
    } else {
      const src = series.source || "the long series";
      const already = it.sourceNewer && it.sourceNewer.date === newest.date && it.sourceNewer.value === newest.value;
      it.sourceNewer = { value: newest.value, date: newest.date, source: src };
      if (!already) { flagged++; log.push(`${it.label}: ${src} has ${newest.value} for ${newest.date}; the page shows ${it.value} for ${it.date} — left for a person to check`); }
    }
  }
  return { log, lifted, flagged, cleared };
}

export async function main() {
  let D, H;
  try { D = load(DATA, "GDC_DATA"); } catch (e) { console.error(`Could not read data.js: ${e.message}`); process.exitCode = 1; return; }
  try { H = load(HISTORY, "GDC_HISTORY"); } catch (e) { console.error(`Could not read history-data.js: ${e.message}`); process.exitCode = 1; return; }

  const { log, lifted, flagged, cleared } = check(D, H);
  if (lifted || flagged || cleared) save(DATA, "GDC_DATA", D);
  console.log(log.join("\n") || "Every figure is on the newest reading its source has published.");
  console.log(`${lifted} figure(s) moved on, ${flagged} newly flagged, ${cleared} no longer behind.`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();

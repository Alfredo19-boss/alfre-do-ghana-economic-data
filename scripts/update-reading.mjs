// Updates one published reading (any economy, people or markets figure) in data.js.
// Used by .github/workflows/update-reading.yml, or run locally:
//   node scripts/update-reading.mjs --label "Inflation" --value 4.8 --date "Sep 2026" --note "▼ from 5.0% in August" \
//        --source-title "GSS: September 2026 CPI" --source-url https://...
// --label must match the label shown on the website exactly (not case-sensitive).
import { load, save, todayLabel } from "./lib/datafile.mjs";
import { parseArgs } from "./record-debt.mjs";

const FILE = new URL("../data.js", import.meta.url).pathname;
const DATE_OK = /^(\d{1,2} [A-Z][a-z]{2} \d{4}|[A-Z][a-z]{2} \d{4}|Q[1-4] \d{4}|H[12] \d{4}|\d{4}( proj\.)?)$/;

export function updateReading(D, a) {
  const items = [...D.economy.flatMap(g => g.items), ...D.people, ...D.markets.flatMap(g => g.items)];
  const label = (a.label || "").trim().toLowerCase();
  const it = items.find(i => i.label.toLowerCase() === label);
  if (!it) throw new Error(`No reading called "${a.label}". Available: ${items.map(i => i.label).join(", ")}`);
  const value = Number(String(a.value ?? "").replace(/[, ]/g, ""));
  if (!isFinite(value) || a.value === "" || a.value === undefined) throw new Error(`value must be a number (got "${a.value}")`);
  if (it.value && Math.abs(value / it.value - 1) > 0.6 && !a.force) {
    throw new Error(`${value} is very different from the current ${it.value} ${it.unit}. Check the units, or pass force to accept it.`);
  }
  if (!DATE_OK.test(a.date || "")) throw new Error(`date should look like "10 Sep 2026", "Sep 2026", "Q2 2026" or "H1 2026" (got "${a.date}")`);
  const before = { value: it.value, date: it.date };
  // keep the reading being replaced, so the site can chart the history and read the trend
  if (typeof it.value === "number" && it.date && it.date !== a.date) {
    it.series = Array.isArray(it.series) ? it.series : [];
    if (!it.series.some(p => p.date === it.date)) it.series.push({ date: it.date, value: it.value });
    it.series = it.series.slice(-120);
  }
  it.value = value;
  it.date = a.date;
  if (a.note) it.note = a.note;
  if (a.dec !== undefined && a.dec !== "") it.dec = Number(a.dec);
  if (a["source-url"]) {
    D.sources = D.sources.filter(([, u]) => u !== a["source-url"]);
    D.sources.unshift([a["source-title"] || `${it.label}, ${a.date}`, a["source-url"]]);
  }
  D.checked = todayLabel();
  return { label: it.label, before, after: { value, date: a.date } };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const D = load(FILE, "GDC_DATA");
    const r = updateReading(D, parseArgs(process.argv.slice(2)));
    save(FILE, "GDC_DATA", D);
    console.log(`Updated ${r.label}: ${r.before.value} (${r.before.date}) → ${r.after.value} (${r.after.date})`);
  } catch (e) {
    console.error(`Not updated: ${e.message}`);
    process.exit(1);
  }
}

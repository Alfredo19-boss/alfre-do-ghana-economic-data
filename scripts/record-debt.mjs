// Records a new official public debt reading in data.js.
// Used by .github/workflows/record-debt.yml (which then opens a pull request), or run locally:
//   node scripts/record-debt.mjs --month-end 2026-07-31 --total 735.2 --domestic 399.8 --external 335.4 --ratio 45.9 \
//        --source-title "BoG Summary of Economic and Financial Data, July 2026" --source-url https://...
// Amounts are GH¢ billion. Domestic, external and ratio are optional.
import { load, save, todayLabel, MONTHS_LONG } from "./lib/datafile.mjs";

const FILE = new URL("../data.js", import.meta.url).pathname;

export function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) { out[argv[i].slice(2)] = argv[i + 1] ?? ""; i++; }
  }
  return out;
}

const num = (v, name, { optional = false, min = -Infinity, max = Infinity } = {}) => {
  if (v === undefined || v === "") { if (optional) return undefined; throw new Error(`${name} is required`); }
  const n = Number(String(v).replace(/[, ]/g, ""));
  if (!isFinite(n) || n < min || n > max) throw new Error(`${name} must be a number between ${min} and ${max} (got "${v}")`);
  return n;
};

export function recordDebt(D, a) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(a["month-end"] || "")) throw new Error("month-end must look like 2026-07-31");
  const d = new Date(a["month-end"] + "T00:00:00Z");
  const monthEnd = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).toISOString().slice(0, 10);
  if (monthEnd !== a["month-end"]) throw new Error(`month-end should be the last day of the month (${monthEnd})`);

  const reading = { date: monthEnd, total: num(a.total, "total", { min: 50, max: 5000 }) };
  const domestic = num(a.domestic, "domestic", { optional: true, min: 0, max: 5000 });
  const external = num(a.external, "external", { optional: true, min: 0, max: 5000 });
  const ratio = num(a.ratio, "ratio", { optional: true, min: 1, max: 300 });
  if (domestic !== undefined) reading.domestic = domestic;
  if (external !== undefined) reading.external = external;
  if (domestic !== undefined && external !== undefined && Math.abs(domestic + external - reading.total) > 1.5) {
    throw new Error(`domestic (${domestic}) + external (${external}) should add up to total (${reading.total})`);
  }
  if (ratio !== undefined) reading.ratio = ratio;

  const R = D.debt.readings.filter(r => r.date !== monthEnd);
  const prev = [...R].sort((x, y) => x.date.localeCompare(y.date)).pop();
  if (prev && Math.abs(reading.total / prev.total - 1) > 0.25) {
    throw new Error(`total ${reading.total} is more than 25% away from the previous reading (${prev.total} on ${prev.date}). Check the units (GH¢ billion).`);
  }
  R.push(reading);
  R.sort((x, y) => x.date.localeCompare(y.date));
  D.debt.readings = R;

  // December readings also become a year-end bar in the history chart
  if (d.getUTCMonth() === 11) {
    const year = String(d.getUTCFullYear());
    D.history = D.history.filter(h => h.k !== year && !h.partial);
    D.history.push({ k: year, label: `End-${year}`, debt: +reading.total.toFixed(1), ratio: ratio ?? null });
    D.history.sort((x, y) => x.k.localeCompare(y.k));
  }

  if (a["source-url"]) {
    const title = a["source-title"] || `Public debt, ${MONTHS_LONG[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
    D.sources = D.sources.filter(([, u]) => u !== a["source-url"]);
    D.sources.unshift([title, a["source-url"]]);
  }
  D.checked = todayLabel();
  return reading;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const D = load(FILE, "GDC_DATA");
    const r = recordDebt(D, parseArgs(process.argv.slice(2)));
    save(FILE, "GDC_DATA", D);
    console.log(`Recorded debt reading for ${r.date}: GH¢${r.total}bn`);
  } catch (e) {
    console.error(`Not recorded: ${e.message}`);
    process.exit(1);
  }
}

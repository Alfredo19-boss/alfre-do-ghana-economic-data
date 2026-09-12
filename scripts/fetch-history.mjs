// Refresh history-data.js: long annual series for Ghana from the World Bank's
// open data API (no key needed). Run monthly by .github/workflows/history.yml.
import { load, save } from "./lib/datafile.mjs";

const FILE = new URL("../history-data.js", import.meta.url).pathname;
const FROM = 1993;
const WB = "World Bank, World Development Indicators";
const api = code => `https://api.worldbank.org/v2/country/GHA/indicator/${code}?date=${FROM}:${new Date().getUTCFullYear()}&format=json&per_page=200`;

// key on the site -> World Bank indicator, how to scale it, and what to say about it
export const INDICATORS = [
  { key: "Inflation", code: "FP.CPI.TOTL.ZG", unit: "%", dec: 1, note: "Annual average consumer price inflation. The figure on the dashboard is the month-on-year rate, so the two differ." },
  { key: "Real GDP growth", code: "NY.GDP.MKTP.KD.ZG", unit: "%", dec: 1, note: "Growth in real GDP over the whole year." },
  { key: "Income per person", code: "NY.GNP.PCAP.CD", unit: "US$", dec: 0, pre: true, note: "Gross national income per person, Atlas method." },
  { key: "Gross reserves", code: "FI.RES.TOTL.CD", unit: "US$bn", dec: 2, scale: 1e-9, note: "Total reserves including gold, at year end." },
  { key: "Remittances", code: "BX.TRF.PWKR.CD.DT", unit: "US$bn", dec: 2, scale: 1e-9, note: "Personal remittances received. The way these are measured changed in 2011, which is why the series steps up." },
  { key: "Unemployment rate", code: "SL.UEM.TOTL.ZS", unit: "%", dec: 1, note: "ILO modelled estimate, a different definition from the Statistical Service's survey rate on the dashboard.", source: `${WB} / ILO` },
  { key: "US dollar", code: "PA.NUS.FCRF", unit: "GH¢", dec: 4, note: "Official exchange rate, annual average. Figures before 2007 are in the redenominated cedi." },
  { key: "population", code: "SP.POP.TOTL", unit: "people", dec: 0, note: "Total population at mid-year." },
  { key: "exports", code: "NE.EXP.GNFS.CD", unit: "US$bn", dec: 2, scale: 1e-9, note: "Exports of goods and services for the whole year, so larger than the half-year merchandise figure on the dashboard." },
  { key: "imports", code: "NE.IMP.GNFS.CD", unit: "US$bn", dec: 2, scale: 1e-9, note: "Imports of goods and services for the whole year." },
  { key: "gdp", code: "NY.GDP.MKTP.CD", unit: "US$bn", dec: 1, scale: 1e-9, note: "Nominal GDP in US dollars. The 2006 and 2013 jumps are rebasings, not sudden growth." }
];

export async function get(url) {
  const res = await fetch(url, { headers: { "user-agent": "alfredo-ghana-economic-data/1.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export function parseWorldBank(json, scale = 1) {
  const rows = Array.isArray(json) && Array.isArray(json[1]) ? json[1] : [];
  return rows
    .filter(r => r && r.value != null && /^\d{4}$/.test(r.date))
    .map(r => ({ date: r.date, value: +(r.value * scale).toPrecision(10) }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// exports minus imports, for the years both exist
export function balanceOf(series) {
  const ex = series.exports?.points || [], im = series.imports?.points || [];
  const byYear = new Map(im.map(p => [p.date, p.value]));
  return ex.filter(p => byYear.has(p.date)).map(p => ({ date: p.date, value: +(p.value - byYear.get(p.date)).toFixed(3) }));
}

export async function main() {
  let old = {};
  try { old = load(FILE, "GDC_HISTORY"); } catch { /* first run */ }
  const series = { ...(old.series || {}) };
  const log = [];

  for (const ind of INDICATORS) {
    try {
      const points = parseWorldBank(await get(api(ind.code)), ind.scale || 1);
      if (points.length < 5) throw new Error(`only ${points.length} points`);
      series[ind.key] = { unit: ind.unit, dec: ind.dec, pre: ind.pre, note: ind.note, source: ind.source || WB, points };
      log.push(`${ind.key}: ${points.length} years, ${points[0].date}–${points[points.length - 1].date}`);
    } catch (e) {
      log.push(`${ind.key}: kept the old series (${e.message})`);
    }
  }

  const bal = balanceOf(series);
  if (bal.length) {
    series.balance = { unit: "US$bn", dec: 2, note: "Exports minus imports of goods and services. Ghana ran a deficit every year until the recent gold-led surpluses.", source: WB, points: bal };
    log.push(`balance: ${bal.length} years`);
  }

  save(FILE, "GDC_HISTORY", {
    updated: new Date().toISOString(),
    from: FROM,
    source: WB,
    sourceUrl: "https://data.worldbank.org/country/ghana",
    series
  });
  console.log(log.join("\n"));
}

if (import.meta.url === `file://${process.argv[1]}`) main();

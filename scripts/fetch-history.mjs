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
  { key: "gdp", code: "NY.GDP.MKTP.CD", unit: "US$bn", dec: 1, scale: 1e-9, note: "Nominal GDP in US dollars. The 2006 and 2013 jumps are rebasings, not sudden growth." },

  // added so that more of the dashboard's figures carry a run back to 1993. Where the long
  // series measures something slightly different from the figure on the page, the note says so.
  { key: "Average lending rate", code: "FR.INR.LEND", unit: "%", dec: 1, note: "The rate banks charge their best customers, annual average." },
  { key: "Bank bad-loan ratio", code: "FB.AST.NPER.ZS", unit: "%", dec: 1, note: "Non-performing loans as a share of total gross loans, at year end." },
  { key: "Current account surplus", code: "BN.CAB.XOKA.CD", unit: "US$bn", dec: 2, scale: 1e-9, note: "The current account balance for the whole year. A minus figure is a deficit." },
  { key: "Multidimensional poverty", code: "SI.POV.DDAY", unit: "%", dec: 1, note: "Share of people living on less than US$2.15 a day. A money measure, not the multidimensional one on the dashboard, so the two differ." },
  { key: "Private credit growth", code: "FS.AST.PRVT.GD.ZS", unit: "% of GDP", dec: 1, note: "Credit to the private sector as a share of GDP — the level, not the growth rate shown on the dashboard." },
  { key: "realrate", code: "FR.INR.RINR", unit: "%", dec: 1, note: "The lending rate after inflation is taken out." },
  { key: "tax", code: "GC.TAX.TOTL.GD.ZS", unit: "% of GDP", dec: 1, note: "Tax revenue collected by central government, as a share of GDP." },
  { key: "revenue", code: "GC.REV.XGRT.GD.ZS", unit: "% of GDP", dec: 1, note: "Central government revenue excluding grants, as a share of GDP." },
  { key: "govdebt", code: "GC.DOD.TOTL.GD.ZS", unit: "% of GDP", dec: 1, note: "Central government debt as a share of GDP, as the World Bank records it. Ghana's own published ratio on this page is the fuller public-debt measure." },
  { key: "oil", code: "NY.GDP.PETR.RT.ZS", unit: "% of GDP", dec: 2, note: "What oil is worth to the economy each year, as a share of GDP. Jubilee came onstream in 2010 — the series before that is close to nothing." },
  { key: "metals", code: "TX.VAL.MMTL.ZS.UN", unit: "% of exports", dec: 1, note: "Ores and metals as a share of everything Ghana sells abroad — the closest long run to the gold export figure." },
  { key: "fuelex", code: "TX.VAL.FUEL.ZS.UN", unit: "% of exports", dec: 1, note: "Fuels as a share of merchandise exports." },
  { key: "foodex", code: "TX.VAL.FOOD.ZS.UN", unit: "% of exports", dec: 1, note: "Food, which for Ghana is mostly cocoa, as a share of merchandise exports." },
  { key: "Petrol", code: "EP.PMP.SGAS.CD", unit: "US$ a litre", dec: 2, pre: false, note: "Pump price for petrol in US dollars, collected every second year and last published for 2016. The dashboard figure is today's price in cedis." },
  { key: "Diesel", code: "EP.PMP.DESL.CD", unit: "US$ a litre", dec: 2, note: "Pump price for diesel in US dollars, collected every second year and last published for 2016." },
  { key: "fdi", code: "BX.KLT.DINV.CD", unit: "US$bn", dec: 2, scale: 1e-9, note: "Foreign direct investment, net inflows for the year." }
];

// Commodity prices are not in the World Bank's country data, so gold and cocoa come from the
// futures market instead: the last close of each year, back as far as that market goes.
export const COMMODITIES = [
  { key: "Gold price", symbol: "GC=F", unit: "US$", dec: 0, pre: true, note: "The last close of each year for gold futures, in US dollars an ounce.", source: "Yahoo Finance" },
  { key: "Cocoa world price", symbol: "CC=F", unit: "US$", dec: 0, pre: true, note: "The last close of each year for cocoa futures, in US dollars a tonne.", source: "Yahoo Finance" }
];
const CHART = sym => `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?range=40y&interval=1mo`;

// monthly closes -> one point per year (the last close that year)
export function yearlyCloses(json) {
  const r = json && json.chart && json.chart.result && json.chart.result[0];
  const stamps = r && r.timestamp;
  const closes = r && r.indicators && r.indicators.quote && r.indicators.quote[0] && r.indicators.quote[0].close;
  if (!Array.isArray(stamps) || !Array.isArray(closes)) return [];
  const byYear = new Map();
  stamps.forEach((t, i) => {
    const v = closes[i];
    if (typeof v !== "number" || !isFinite(v) || v <= 0) return;
    const year = String(new Date(t * 1000).getUTCFullYear());
    if (+year < FROM) return;
    byYear.set(year, +v.toPrecision(8));      // later months overwrite earlier ones
  });
  return [...byYear.entries()].map(([date, value]) => ({ date, value })).sort((a, b) => a.date.localeCompare(b.date));
}

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

  for (const c of COMMODITIES) {
    try {
      const points = yearlyCloses(await get(CHART(c.symbol)));
      if (points.length < 5) throw new Error(`only ${points.length} years`);
      series[c.key] = { unit: c.unit, dec: c.dec, pre: c.pre, note: c.note, source: c.source, points };
      log.push(`${c.key}: ${points.length} years, ${points[0].date}–${points[points.length - 1].date}`);
    } catch (e) {
      log.push(`${c.key}: kept the old series (${e.message})`);
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

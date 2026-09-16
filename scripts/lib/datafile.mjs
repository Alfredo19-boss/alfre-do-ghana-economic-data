// Read and write the site's data files (data.js and auto-data.js).
// Both are plain JavaScript that assign one JSON object to a window global,
// so the browser can load them with a <script> tag and these scripts can edit them safely.
import fs from "node:fs";
import vm from "node:vm";

const HEADERS = {
  GDC_DATA: `/*
 * Alfredo Ghana Economic Data: figures entered and checked by people.
 * Edit values here, or use the "Record debt figures" / "Update a reading" workflows on GitHub,
 * which edit this file for you and open a pull request to review.
 * Money is in GH¢ unless a unit says otherwise. Debt readings are in GH¢ billion.
 * Field guide: see README.md ("data.js field guide").
 */
`,
  GDC_AUTO: `/*
 * Alfredo Ghana Economic Data: figures fetched automatically by .github/workflows/market-data.yml.
 * Do not edit by hand; the next scheduled run overwrites this file.
 */
`,
  GDC_AFRICA: `/*
 * Alfredo Ghana Economic Data: African inflation, fetched by .github/workflows/history.yml.
 * Do not edit by hand.
 */
`,
  GDC_PAPERS: `/*
 * Alfredo Ghana Economic Data: today's newspaper front pages, fetched by .github/workflows/news.yml.
 * Headlines and links only. Do not edit by hand.
 */
`,
  GDC_ARTICLES: `/*
 * Alfredo Ghana Economic Data: the article index, written by .github/workflows/article.yml.
 * Do not edit by hand.
 */
`,
  GDC_HISTORY: `/*
 * Alfredo Ghana Economic Data: long annual series from the World Bank, 1993 onwards.
 * Fetched by .github/workflows/history.yml. Do not edit by hand.
 */
`,
  GDC_LIVE: `/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
`,
  GDC_MARKETS: `/*
 * Alfredo Ghana Economic Data: world markets and Ghana Stock Exchange prices, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
`,
  GDC_WORLD: `/*
 * Alfredo Ghana Economic Data: world and African headlines, fetched by
 * .github/workflows/news.yml every five minutes. Do not edit by hand.
 */
`,
  GDC_NEWS: `/*
 * Alfredo Ghana Economic Data: business headlines fetched by .github/workflows/news.yml.
 * Do not edit by hand; the next scheduled run overwrites this file.
 */
`
};

export function load(path, globalName) {
  const src = fs.readFileSync(path, "utf8");
  const sandbox = { window: {} };
  vm.runInNewContext(src, sandbox, { filename: path });
  const obj = sandbox.window[globalName];
  if (!obj || typeof obj !== "object") throw new Error(`${path} does not define window.${globalName}`);
  return JSON.parse(JSON.stringify(obj));
}

export function save(path, globalName, obj) {
  const body = `${HEADERS[globalName] || ""}window.${globalName} = ${JSON.stringify(obj, null, 2)};\n`;
  fs.writeFileSync(path, body);
}

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function dayLabel(iso) {
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00Z" : ""));
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function todayLabel() {
  const d = new Date();
  return `${d.getUTCDate()} ${MONTHS_LONG[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

// Daily watcher for new official releases.
// Checks each source page for links it has not seen before. When something new appears,
// it opens a GitHub issue with the links, the figures on the site that depend on them,
// and (for PDFs) the lines that mention key figures, so a person can check and record them.
// Nothing on the website changes until a person records the figures.
//
// Run locally (no issues opened): node scripts/watch-releases.mjs --dry-run
import fs from "node:fs";
import path from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const STATE_FILE = path.join(ROOT, ".github/data-watch/state.json");
const DRY = process.argv.includes("--dry-run");
const UA = "Mozilla/5.0 (compatible; AlfredoGhanaEconomicData/1.0; release watcher)";

export const WATCHES = [
  {
    id: "bog-sefd",
    name: "Bank of Ghana: Summary of Economic and Financial Data",
    url: "https://www.bog.gov.gh/econ_fin_data/",
    link: /summary-of-economic-and-financial-data|Summary-of-Economic/i,
    updates: "Public debt (total, domestic, external, debt-to-GDP), reserves, mobile money, bank loans. Use the **Record debt figures** workflow for debt; **Update a reading** for the rest.",
    keywords: ["Total Public Debt", "Domestic Debt", "External Debt", "Debt to GDP", "Gross International Reserves", "Mobile Money", "Inflation", "Policy Rate"]
  },
  {
    id: "bog-mpc",
    name: "Bank of Ghana: Monetary Policy Committee press releases",
    url: "https://www.bog.gov.gh/mpc_press_release/",
    link: /mpc-press-release|MPC-Press-Release/i,
    updates: "BoG policy rate, gross reserves, real GDP growth, trade surplus, current account, lending rate, private credit growth.",
    keywords: ["Policy Rate", "Gross International Reserves", "months of import cover", "GDP", "trade surplus", "current account"]
  },
  {
    id: "gss-home",
    name: "Ghana Statistical Service: releases",
    url: "https://statsghana.gov.gh/",
    link: /cpi|inflation|consumer.price|labour|gdp|ahies/i,
    updates: "Inflation (headline, food, non-food), unemployment, real GDP growth.",
    keywords: ["inflation", "Food", "Non-food", "unemployment", "GDP"]
  },
  {
    id: "mofep",
    name: "Ministry of Finance: publications",
    url: "https://mofep.gov.gh/",
    link: /budget|mid-year|debt|fiscal|economic-policy/i,
    updates: "2026 budget lines (revenue, tax, spending, wages, interest, capital), nominal GDP, sinking fund, maturities, programme allocations.",
    keywords: ["Total Revenue and Grants", "Total Expenditure", "Interest Payments", "Compensation", "Nominal GDP"]
  },
  {
    id: "purc",
    name: "PURC: tariff announcements",
    url: "https://www.purc.com.gh/",
    link: /tariff/i,
    updates: "Electricity tariff change (and water).",
    keywords: ["electricity", "water", "per cent", "%"]
  },
  {
    id: "npa",
    name: "National Petroleum Authority: prices",
    url: "https://npa.gov.gh/",
    link: /price|pricing|indicative/i,
    updates: "Petrol, diesel and LPG prices (every pricing window, 1st and 16th of the month).",
    keywords: ["petrol", "gasoline", "diesel", "LPG"]
  }
];

export function extractLinks(html, baseUrl, pattern) {
  const out = new Map();
  const re = /<a\b[^>]*href\s*=\s*["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html))) {
    let href;
    try { href = new URL(m[1].trim(), baseUrl).href; } catch { continue; }
    const text = m[2].replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&#8211;|&ndash;/g, "–").replace(/\s+/g, " ").trim();
    if (!/^https?:/.test(href)) continue;
    if (pattern.test(href) || pattern.test(text)) out.set(href, text || href);
  }
  return [...out].map(([href, text]) => ({ href, text }));
}

export function keywordLines(text, keywords, maxLines = 25) {
  const lines = text.split(/\r?\n/).map(l => l.replace(/\s+/g, " ").trim()).filter(Boolean);
  const hits = [];
  lines.forEach((l, i) => {
    if (hits.length >= maxLines) return;
    if (keywords.some(k => l.toLowerCase().includes(k.toLowerCase())) && /\d/.test(l)) {
      hits.push([l, lines[i + 1] && /^[\d\s.,%()-]+$/.test(lines[i + 1]) ? lines[i + 1] : ""].filter(Boolean).join("  "));
    }
  });
  return hits;
}

async function get(url, binary = false) {
  const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(45000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return binary ? Buffer.from(await res.arrayBuffer()) : res.text();
}

async function pdfText(url) {
  try {
    const { default: pdf } = await import("pdf-parse/lib/pdf-parse.js");
    const data = await pdf(await get(url, true));
    return data.text || "";
  } catch (e) {
    return `__unreadable__ ${e.message}`;
  }
}

async function findPdf(link) {
  if (/\.pdf($|\?)/i.test(link.href)) return link.href;
  try {
    const html = await get(link.href);
    const pdfs = extractLinks(html, link.href, /\.pdf($|\?)/i);
    return pdfs[0]?.href || null;
  } catch { return null; }
}

async function openIssue(title, body) {
  const repo = process.env.GITHUB_REPOSITORY, token = process.env.GITHUB_TOKEN;
  if (DRY || !repo || !token) { console.log(`\n--- would open issue: ${title}\n${body}\n`); return; }
  const res = await fetch(`https://api.github.com/repos/${repo}/issues`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "User-Agent": UA },
    body: JSON.stringify({ title, body })
  });
  if (!res.ok) throw new Error(`Could not open issue: ${res.status} ${await res.text()}`);
  console.log(`Opened issue: ${title}`);
}

async function main() {
  const state = fs.existsSync(STATE_FILE) ? JSON.parse(fs.readFileSync(STATE_FILE, "utf8")) : {};
  const summary = [];
  for (const w of WATCHES) {
    let links;
    try {
      links = extractLinks(await get(w.url), w.url, w.link);
    } catch (e) {
      summary.push(`- ${w.name}: could not load page (${e.message})`);
      continue;
    }
    const seen = new Set(state[w.id]?.seen || []);
    const firstRun = !state[w.id];
    const fresh = links.filter(l => !seen.has(l.href));
    state[w.id] = { checked: new Date().toISOString(), seen: [...new Set([...seen, ...links.map(l => l.href)])].slice(-500) };

    if (firstRun) { summary.push(`- ${w.name}: baseline saved (${links.length} links)`); continue; }
    if (!fresh.length) { summary.push(`- ${w.name}: nothing new`); continue; }

    summary.push(`- ${w.name}: ${fresh.length} new link(s)`);
    let body = `New material appeared on [${w.name}](${w.url}).\n\n**Links**\n${fresh.slice(0, 10).map(l => `- [${l.text.slice(0, 120)}](${l.href})`).join("\n")}\n\n**Figures on the site that may need updating**\n${w.updates}\n`;

    const pdfUrl = await findPdf(fresh[0]);
    if (pdfUrl) {
      const text = await pdfText(pdfUrl);
      if (text.startsWith("__unreadable__")) {
        body += `\n**PDF**\n[Open the PDF](${pdfUrl}). It could not be read automatically (${text.slice(15)}).\n`;
      } else {
        const lines = keywordLines(text, w.keywords);
        body += `\n**Lines in the PDF that mention key figures** (copied automatically: check against the [PDF](${pdfUrl}) before using)\n\n\`\`\`\n${lines.join("\n") || "No matching lines found."}\n\`\`\`\n`;
      }
    }
    body += `\n**How to record the new figures**\n1. Open the **Actions** tab.\n2. Run **Record debt figures** (for public debt) or **Update a reading** (for any other figure).\n3. Review the pull request it opens, then merge it. The website updates within a few minutes.\n4. Close this issue.\n`;
    try { await openIssue(`New release: ${w.name}`, body); } catch (e) { summary.push(`  (issue failed: ${e.message})`); }
  }

  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + "\n");
  const text = `### Official release check\n${summary.join("\n")}\n`;
  console.log(text);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, text);
}

if (import.meta.url === `file://${process.argv[1]}`) main();

/* Alfredo Ghana Economic Data: rendering, live counters, board view. Figures come from data.js. */
(() => {
  const D = window.GDC_DATA;
  const $ = id => document.getElementById(id);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const SEC = 1000, DAY = 86400;
  const A = window.GDC_AUTO || { values: {}, cediHistory: [] };
  const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const MON_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const parseDay = iso => Date.parse(iso + "T00:00:00Z");
  const isoDayLabel = iso => { const d = new Date(parseDay(iso)); return `${d.getUTCDate()} ${MON[d.getUTCMonth()]} ${d.getUTCFullYear()}`; };

  /* ================= debt readings → model inputs ================= */
  (function adaptDebt() {
    const R = D.debt.readings.slice().sort((a, b) => a.date.localeCompare(b.date));
    const last = R[R.length - 1];
    const withParts = [...R].reverse().find(r => r.domestic != null && r.external != null) || null;
    const domShare = withParts ? withParts.domestic / withParts.total : 0.5;
    const parts = r => {
      const domestic = r.domestic != null ? r.domestic : (r.external != null ? r.total - r.external : r.total * domShare);
      return { domestic, external: r.external != null ? r.external : r.total - domestic };
    };
    const endLabel = iso => { const d = new Date(parseDay(iso)); return d.getUTCMonth() === 11 ? `end-${d.getUTCFullYear()}` : `end-${MON_LONG[d.getUTCMonth()]} ${d.getUTCFullYear()}`; };
    const asInput = r => ({ date: new Date(parseDay(r.date) + DAY * SEC).toISOString(), label: endLabel(r.date), total: r.total * 1e9, domestic: parts(r).domestic * 1e9, external: parts(r).external * 1e9 });
    const target = new Date(parseDay(last.date));
    target.setUTCDate(1);
    target.setUTCMonth(target.getUTCMonth() - (D.debt.paceMonths || 6) + 1);
    target.setUTCDate(0); // month-end, pace window back
    const targetIso = target.toISOString().slice(0, 10);
    // prefer the most recent reading at or before the window start that has the domestic/external split
    const earlier = R.filter(r => r.date <= targetIso && r !== last);
    const earlierWithParts = earlier.filter(r => r.domestic != null && r.external != null);
    const prev = earlierWithParts.length ? earlierWithParts[earlierWithParts.length - 1] : (earlier.length ? earlier[earlier.length - 1] : R[0]);
    D.debt.latest = asInput(last);
    D.debt.previous = asInput(prev === last ? R[0] : prev);
    D.debt.latestIso = last.date;
    D.debt.ratioLatest = [...R].reverse().find(r => r.ratio != null)?.ratio;
    const startIso = `${D.budget.year - 1}-12-31`;
    D.monthly = R.filter(r => r.date >= startIso).map(r => { const d = new Date(parseDay(r.date)); return { date: r.date, label: `${MON[d.getUTCMonth()]} ${d.getUTCFullYear()}`, debt: r.total }; });
    // the hatched "latest" bar in the history chart always follows the newest reading
    D.history = D.history.filter(h => !h.partial);
    const ld = new Date(parseDay(last.date));
    if (ld.getUTCMonth() !== 11) {
      D.history.push({ k: `${MON[ld.getUTCMonth()]} ’${String(ld.getUTCFullYear()).slice(2)}`, label: `End-${MON_LONG[ld.getUTCMonth()]} ${ld.getUTCFullYear()}`, debt: last.total, ratio: D.debt.ratioLatest, partial: true });
    }
  })();

  /* ================= staleness ================= */
  // Returns the end of the period a date label refers to, and how precise it is.
  function periodEnd(label) {
    if (!label) return null;
    let m;
    const monthIdx = s => MON.findIndex(x => x.toLowerCase() === s.slice(0, 3).toLowerCase());
    if ((m = /^(\d{1,2}) ([A-Za-z]{3,9}) (\d{4})$/.exec(label))) return { t: Date.UTC(+m[3], monthIdx(m[2]), +m[1]), precision: "day" };
    if ((m = /^([A-Za-z]{3,9}) (\d{4})$/.exec(label)) && monthIdx(m[1]) >= 0) return { t: Date.UTC(+m[2], monthIdx(m[1]) + 1, 0), precision: "month" };
    if ((m = /^Q([1-4]) (\d{4})$/.exec(label))) return { t: Date.UTC(+m[2], +m[1] * 3, 0), precision: "quarter" };
    if ((m = /^H([12]) (\d{4})$/.exec(label))) return { t: Date.UTC(+m[2], +m[1] * 6, 0), precision: "half" };
    return null;
  }
  const MAX_AGE = { day: 30, month: 95, quarter: 200, half: 250 };
  function staleDays(it) {
    if (it.maxAgeDays === 0) return 0;
    const p = periodEnd(it.date);
    if (!p) return 0;
    const age = (Date.now() - p.t) / (DAY * SEC);
    return age > (it.maxAgeDays || MAX_AGE[p.precision]) ? Math.floor(age) : 0;
  }

  /* ================= automatic values overlay ================= */
  const allItems = [...D.economy.flatMap(g => g.items), ...D.people, ...D.markets.flatMap(g => g.items)];
  const autoValues = A.values || {};
  const cediBase = (D.cedi || [])[0];
  allItems.forEach(it => {
    const a = it.auto && autoValues[it.auto];
    if (!a || typeof a.value !== "number" || !a.date) return;
    const p = periodEnd(it.date);
    if (p && parseDay(a.date) < p.t) return; // the hand-entered value is newer
    it.value = a.value;
    it.date = isoDayLabel(a.date);
    it.autoSource = a.source;
    if (it.auto === "fx.usd" && cediBase) {
      const pct = (a.value / cediBase.rate - 1) * 100;
      it.note = `${pct >= 0 ? "▲" : "▼"} ${Math.abs(pct).toFixed(1)}% more cedis per dollar than at end-2025`;
      it.tone = pct >= 0 ? "bad" : "good";
      if (pct < 0) it.note = `▼ ${Math.abs(pct).toFixed(1)}% fewer cedis per dollar than at end-2025`;
    } else if (a.source) {
      it.note = `${a.note ? a.note + " · " : ""}Updated automatically · ${a.source}`;
    }
  });
  ["usd", "gbp", "eur"].forEach(c => {
    const a = autoValues["fx." + c];
    if (a && typeof a.value === "number" && (!D.fx.date || parseDay(a.date) >= parseDay(D.fx.date))) { D.fx[c] = a.value; D.fx.date = a.date; }
  });
  if (Array.isArray(A.cediHistory) && A.cediHistory.length) {
    const map = new Map((D.cedi || []).map(c => [c.date, c]));
    A.cediHistory.forEach(c => map.set(c.date, { date: c.date, label: isoDayLabel(c.date), rate: c.rate, auto: true }));
    D.cedi = [...map.values()].sort((a, b) => a.date.localeCompare(b.date));
  }

  /* ================= model ================= */
  const L = D.debt.latest, P = D.debt.previous;
  const tLatest = Date.parse(L.date), tPrev = Date.parse(P.date);
  const span = (tLatest - tPrev) / SEC;
  const rate = {
    total: (L.total - P.total) / span,
    domestic: (L.domestic - P.domestic) / span,
    external: (L.external - P.external) / span
  };
  const tPop = Date.parse(D.population.date);
  const popRate = D.population.base * D.population.growth / (365.25 * DAY);
  const Y = D.budget.year, y0 = Date.UTC(Y, 0, 1), y1 = Date.UTC(Y + 1, 0, 1);
  const budgetItems = [...D.budget.in, ...D.budget.out];
  const budget = k => budgetItems.find(b => b.key === k).value;
  const revenue = budget("rev"), spending = budget("exp"), interest = budget("int");
  const minWage = D.benchmarks.minWageDaily;
  const alloc = k => D.benchmarks.allocations.find(a => a.key === k);

  const since = (t, base) => (t - base) / SEC;
  const debtAt = t => L.total + rate.total * since(t, tLatest);
  const popAt = t => D.population.base + popRate * since(t, tPop);
  const yearFrac = t => Math.min(1, Math.max(0, (t - y0) / (y1 - y0)));
  const midnight = t => { const d = new Date(t); return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()); };
  const opened = Date.now();

  /* ================= state & formatting ================= */
  let usd = false;
  let household = 4;
  try { const saved = parseInt(localStorage.getItem("gdc-household"), 10); if (saved >= 1 && saved <= 50) household = saved; } catch (e) {}

  const sym = () => (usd ? "US$" : "GH¢");
  const money = v => (usd ? v / D.fx.usd : v);
  const fmt = (v, dec = 0) => v.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const short = v => {
    const m = money(v), a = Math.abs(m);
    if (a >= 1e12) return `${sym()}${fmt(m / 1e12, 2)}tn`;
    if (a >= 1e9) return `${sym()}${fmt(m / 1e9, 1)}bn`;
    if (a >= 1e6) return `${sym()}${fmt(m / 1e6, 1)}m`;
    return `${sym()}${fmt(m, 0)}`;
  };
  const cedisShort = v => (v >= 1e12 ? `GH¢${fmt(v / 1e12, v % 1e12 ? 2 : 0)} trillion` : `GH¢${fmt(v / 1e9, v % 1e9 ? 1 : 0)}bn`);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const dateFmt = t => new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  const pad = n => String(n).padStart(2, "0");
  // Accra time (GMT) on a 12-hour clock, e.g. 5:04:09 PM
  const clock12 = (t, seconds = true) => {
    const d = new Date(t), h = d.getUTCHours();
    return `${h % 12 || 12}:${pad(d.getUTCMinutes())}${seconds ? `:${pad(d.getUTCSeconds())}` : ""}<small class="ampm">${h < 12 ? "AM" : "PM"}</small>`;
  };
  const countdown = ms => {
    if (ms <= 0) return "Reached";
    const s = Math.floor(ms / SEC), d = Math.floor(s / DAY);
    return `${d ? `${fmt(d)}<small>d</small>` : ""}${pad(Math.floor(s % DAY / 3600))}:${pad(Math.floor(s % 3600 / 60))}:${pad(s % 60)}`;
  };

  /* ================= live counters ================= */
  // key -> [value(t), decimals, isMoney, suffix]
  const LIVE = {
    debt: [t => debtAt(t), 0, true],
    dom: [t => L.domestic + rate.domestic * since(t, tLatest), 0, true],
    ext: [t => L.external + rate.external * since(t, tLatest), 0, true],
    percap: [t => debtAt(t) / popAt(t), 2, true],
    ytd: [t => debtAt(t) - P.total, 0, true],
    today: [t => rate.total * since(t, midnight(t)), 0, true],
    ratio: [t => debtAt(t) / D.debt.nominalGdp * 100, 3, false, "%"],
    open: [t => rate.total * since(t, opened), 0, true],
    pop: [t => popAt(t), 0, false],
    gap: [t => (spending - revenue) * yearFrac(t), 0, true],
    gdpYtd: [t => D.debt.nominalGdp * yearFrac(t), 0, true],
    hhDebt: [t => debtAt(t) / popAt(t) * household, 0, true],
    hhYtd: [t => (debtAt(t) - P.total) / popAt(t) * household, 0, true]
  };
  budgetItems.forEach(b => (LIVE["b-" + b.key] = [t => b.value * yearFrac(t), 0, true]));

  /* ================= one-time rendering ================= */
  const ledgerRow = (b, colour) => `
    <div class="lrow tappable${b.sub ? " sub" : ""}" data-detail="budget:${b.key}">
      <div class="lbl">
        <span class="name">${b.sub ? '<span class="of">of which</span>' : ""}${esc(b.label)}</span>
        <span class="note">Full year <b data-short="${b.value}"></b> · ${esc(b.note)}</span>
      </div>
      <div class="val"><span class="cur" data-cur>GH¢</span><span class="led ${b.cost ? "ember" : colour}" data-live="b-${b.key}"></span></div>
    </div>`;
  $("ledger-in").innerHTML = D.budget.in.map(b => ledgerRow(b, "leaf")).join("");
  $("ledger-out").innerHTML = D.budget.out.map(b => ledgerRow(b, "")).join("");

  const pesewas = interest / revenue * 100;
  $("pes-val").textContent = fmt(pesewas, 1);
  $("pes-dots").innerHTML = Array.from({ length: 100 }, (_, i) => `<i class="${i + 1 <= Math.floor(pesewas) ? "on" : i < pesewas ? "half" : ""}"></i>`).join("");
  $("months").innerHTML = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => `<span>${m}</span>`).join("");

  const chipFor = it => {
    const age = staleDays(it);
    if (age) return `<span class="chip stale" title="This reading is ${age} days old and a newer release is probably out">Update due</span>`;
    if (it.status) return `<span class="chip ${it.status[0]}">${esc(it.status[1])}</span>`;
    return it.date ? `<span class="date${it.autoSource ? " auto" : ""}">${esc(it.date)}</span>` : "";
  };
  const readValue = it => `${it.pre ? `<span class="p">${esc(it.unit)}</span>` : ""}${fmt(it.value, it.dec)}${it.pre ? "" : `<span class="u">${esc(it.unit)}</span>`}`;
  const toneNote = (note, tone) => {
    const safe = esc(note);
    return tone ? safe.replace(/(^|· )([▲▼])/g, `$1<span class="tone-${tone}">$2</span>`) : safe;
  };
  const READS = new Map();
  const READ_IDS = new WeakMap();
  const readKey = it => {
    if (READ_IDS.has(it)) return READ_IDS.get(it);
    const id = `r${READS.size}`;
    READS.set(id, it);
    READ_IDS.set(it, id);
    return id;
  };
  $("people-stats").innerHTML = D.people.map(s => `
    <div class="cell stat tappable${staleDays(s) ? " is-stale" : ""}" data-detail="read:${readKey(s)}">
      <div class="stat-top"><span class="k">${esc(s.label)}</span>${chipFor(s)}</div>
      <span class="mono">${readValue(s)}</span>
      <span class="note">${esc(s.note)}</span>
    </div>`).join("");
  const groupHtml = g => `
    <div class="econ-group${g.items.length > 4 ? " span" : ""}">
      <h3 class="group-h">${esc(g.group)}</h3>
      <div class="panel lines econ-grid">
        ${g.items.map(it => `
          <div class="cell stat tappable${staleDays(it) ? " is-stale" : ""}" data-detail="read:${readKey(it)}">
            <div class="stat-top"><span class="k">${esc(it.label)}</span>${chipFor(it)}</div>
            <span class="mono"${it.live ? ` data-calc="${it.live}"` : ""}>${readValue(it)}</span>
            <span class="note">${toneNote(it.note, it.tone)}${it.status || staleDays(it) ? ` · ${esc(it.date)}` : ""}</span>
          </div>`).join("")}
      </div>
    </div>`;
  $("economy").innerHTML = D.economy.map(groupHtml).join("");

  // markets, plus indicators worked out from figures already on the page
  const allReads = [...D.economy.flatMap(g => g.items), ...D.people, ...D.markets.flatMap(g => g.items)];
  const readOf = label => (allReads.find(i => i.label === label) || {}).value;
  const policyRate = readOf("BoG policy rate"), inflationNow = readOf("Inflation");
  const calcGroup = { group: "Worked out from the figures on this page", items: [
    { label: "Real interest rate", value: policyRate - inflationNow, dec: 1, unit: "%", date: "Calculated", note: `Policy rate ${fmt(policyRate, 1)}% minus inflation ${fmt(inflationNow, 1)}%` },
    { label: "Interest vs tax revenue", value: interest / budget("tax") * 100, dec: 1, unit: "%", date: `${Y} budget`, note: "Share of tax income that goes on interest" },
    { label: "Gold share of exports", value: D.trade.goldExports / D.trade.totalExports * 100, dec: 1, unit: "%", date: D.trade.period, note: `US$${fmt(D.trade.goldExports, 1)}bn of US$${fmt(D.trade.totalExports, 1)}bn exported` },
    { label: "Debt per person in dollars", value: debtAt(Date.now()) / popAt(Date.now()) / D.fx.usd, dec: 0, unit: "US$", pre: true, live: "percapUsd", date: "Estimate", note: `Converted at GH¢${fmt(D.fx.usd, 2)} per US$` }
  ]};
  $("markets").innerHTML = [...D.markets, calcGroup].map(groupHtml).join("");

  // credit ratings with a notch ladder up to investment grade
  $("ratings").innerHTML = D.ratings.map(r => {
    const idx = r.scale.indexOf(r.rating), below = r.scale.length - 1 - idx;
    return `
    <div class="cell rating tappable" data-detail="rating:${esc(r.agency)}">
      <div class="stat-top"><span class="k">${esc(r.agency)}</span><span class="chip ${/positive/i.test(r.outlook) ? "good" : ""}">${esc(r.outlook)}</span></div>
      <div class="rating-row"><span class="rating-grade">${esc(r.rating)}</span><span class="rating-below"><b>${below}</b> notch${below === 1 ? "" : "es"} below<br>investment grade</span></div>
      <div class="ladder" aria-hidden="true">${r.scale.map((n, k) => `<span class="${k === idx ? "on" : k < idx ? "past" : ""}${k === r.scale.length - 1 ? " ig" : ""}">${esc(n)}</span>`).join("")}</div>
      <span class="note">${esc(r.note)} · ${esc(r.date)}</span>
    </div>`;
  }).join("");
  $("cedi-note").textContent = D.cediNote;

  const readHtml = it => `<div class="b-read tappable${staleDays(it) ? " is-stale" : ""}" data-detail="read:${readKey(it)}"><span class="b-label">${esc(it.label)}</span><span class="mono">${readValue(it)}</span><span class="date">${esc(it.date || "")}${staleDays(it) ? " · update due" : ""}</span></div>`;
  const boardPages = [
    [...D.economy.flatMap(g => g.items), ...D.people].filter(i => i.board),
    D.markets.flatMap(g => g.items).filter(i => i.board)
  ];
  $("b-econ").innerHTML = boardPages.map((p, i) => `<div class="b-page${i ? "" : " on"}">${p.map(readHtml).join("")}</div>`).join("");

  const shareDom = L.domestic / L.total * 100;
  $("split-dom").style.width = shareDom.toFixed(1) + "%";
  $("split-ext").style.width = (100 - shareDom).toFixed(1) + "%";
  $("n-dom").innerHTML = `${fmt(shareDom, 1)}% of the total · <b data-short="${L.domestic}"></b> at ${esc(L.label)}`;
  $("n-ext").innerHTML = `${fmt(100 - shareDom, 1)}% of the total · <b data-short="${L.external}"></b> at ${esc(L.label)}`;
  $("n-ytd").innerHTML = `Added on top of <b data-short="${P.total}"></b> at ${esc(P.label)}`;
  $("debt-method").textContent = `Counts forward from the Bank of Ghana’s ${L.label} figure at the pace debt grew between ${P.label} and ${L.label}.`;
  const sf = D.debt.sinkingFund;
  $("sf-fill").style.width = Math.min(100, sf.value / sf.target * 100).toFixed(1) + "%";
  $("mat-k").textContent = `Falling due ${D.debt.maturities.map(m => m.year).join(" · ")}`;
  $$("[data-gauge-peak]").forEach(el => (el.style.left = D.debt.ratioPeak.value + "%"));
  $$("[data-gauge-note]").forEach(el => (el.textContent = `Reported ${fmt(D.debt.ratioLatest, 1)}% at ${L.label} · tick shows ${fmt(D.debt.ratioPeak.value, 1)}% at ${D.debt.ratioPeak.label}`));
  $("n-pop").textContent = `${fmt(D.population.base / 1e6, 1)} million projected for ${Y} · growing ${fmt(D.population.growth * 100, 1)}% a year`;
  $("people-method").textContent = `Budget totals divided by the ${D.population.source}’s ${Y} projection of ${fmt(D.population.base / 1e6, 1)} million people.`;
  $("compare-method").textContent = `Built from the figures on this page, the ${Y} budget’s programme allocations and the GH¢${fmt(minWage, 2)} daily minimum wage.`;
  $("m1").textContent = `Ghana publishes its debt monthly, two to three months late, so there is no official figure for this exact second. The site starts from the Bank of Ghana’s ${L.label} total of GH¢${fmt(L.total / 1e9, 1)}bn and adds debt at the pace between ${P.label} and ${L.label}: GH¢${fmt((L.total - P.total) / 1e9, 1)}bn over ${Math.round(span / DAY)} days, or about GH¢${fmt(rate.total, 0)} a second.`;
  $("sources").innerHTML = D.sources.map(([t, u]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}</a></li>`).join("");
  $$("[data-checked]").forEach(el => (el.textContent = `Figures last checked ${D.checked}`));

  // data health: what is past its usual update date
  (function dataStatus() {
    const issues = [];
    const staleItems = allItems.filter(it => staleDays(it));
    const debtAge = (Date.now() - parseDay(D.debt.latestIso)) / (DAY * SEC);
    if (debtAge > (D.debt.staleAfterDays || 120)) issues.push(`the latest official debt figure is from ${D.debt.latest.label} (${Math.floor(debtAge)} days ago), so the live estimate may be drifting`);
    if (Date.now() >= Date.UTC(D.budget.year + 1, 0, 1)) issues.push(`the ${D.budget.year} budget year is over and the ${D.budget.year + 1} budget has not been entered yet`);
    if (staleItems.length) issues.push(`${staleItems.length} published reading${staleItems.length === 1 ? " is" : "s are"} past the usual update date: ${staleItems.slice(0, 4).map(i => i.label).join(", ")}${staleItems.length > 4 ? " and more" : ""}`);
    if (A.updated && Date.now() - Date.parse(A.updated) > 3 * DAY * SEC) issues.push(`automatic price updates last ran on ${isoDayLabel(A.updated.slice(0, 10))}`);
    const box = $("data-status");
    if (issues.length) {
      box.hidden = false;
      $("data-status-text").innerHTML = issues.map(t => `<li>${esc(t.charAt(0).toUpperCase() + t.slice(1))}.</li>`).join("");
    }
    $$("[data-auto-status]").forEach(el => (el.textContent = A.updated
      ? `Exchange rates and prices updated automatically · last run ${isoDayLabel(A.updated.slice(0, 10))}, ${clock12(Date.parse(A.updated), false).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()} GMT`
      : "Exchange rates and prices update automatically once the daily job is running"));
    if (Date.now() - parseDay(D.debt.latestIso) > (D.debt.staleAfterDays || 120) * DAY * SEC) {
      $$("[data-gauge-note]").forEach(el => el.classList.add("warn-text"));
    }
  })();
  $("data-table").innerHTML =
    `<thead><tr><th>Period</th><th>Debt, GH¢bn</th><th>Debt-to-GDP, %</th></tr></thead><tbody>` +
    D.history.map(h => `<tr><td>${esc(h.label)}</td><td>${fmt(h.debt, 1)}</td><td>${fmt(h.ratio, 1)}</td></tr>`).join("") +
    D.monthly.slice(1, -1).map(m => `<tr><td>${esc(m.label)} (month-end)</td><td>${fmt(m.debt, 1)}</td><td>–</td></tr>`).join("") +
    `</tbody>`;

  // everyday comparisons
  const COMPARE = [
    { big: t => [fmt(debtAt(t) / revenue, 1), "years"], text: `of <b>all government revenue</b>, with nothing else spent, would be needed to pay off the debt`, note: `Debt ÷ ${Y} revenue & grants of GH¢${fmt(revenue / 1e9, 1)}bn` },
    { big: t => [fmt(debtAt(t) / popAt(t) / minWage, 0), "days"], text: `of <b>minimum-wage work</b> to cover one Ghanaian’s share of the debt`, note: `At GH¢${fmt(minWage, 2)} a day from ${D.benchmarks.minWageDate}` },
    { big: () => [fmt(interest / alloc("fshs").value, 1), "×"], text: `the <b>Free SHS budget</b> goes on interest payments in ${Y}`, note: `Interest GH¢${fmt(interest / 1e9, 1)}bn vs Free SHS GH¢${fmt(alloc("fshs").value / 1e9, 1)}bn` },
    { big: () => [fmt(alloc("feeding").value / (rate.total * DAY), 1), "days"], text: `of new borrowing adds up to a <b>full year of school feeding</b>`, note: `School Feeding Programme GH¢${fmt(alloc("feeding").value / 1e9, 2)}bn` },
    { big: () => [fmt(alloc("bigpush").value / (rate.total * DAY), 0), "days"], text: `of new borrowing equals the whole <b>Big Push</b> roads and infrastructure budget`, note: `Big Push GH¢${fmt(alloc("bigpush").value / 1e9, 0)}bn in ${Y}` },
    { big: () => [fmt(interest / (365 * DAY) / minWage, 0), "days"], text: `of <b>minimum-wage pay</b> is what interest on the debt costs every second`, note: `GH¢${fmt(interest / (365 * DAY), 0)} of interest a second, on average` }
  ];
  $("compare").innerHTML = COMPARE.map((c, i) => `
    <div class="cell cmp">
      <div class="cmp-big" data-cmp="${i}"></div>
      <p class="cmp-text">${c.text}</p>
      <span class="note">${esc(c.note)}</span>
    </div>`).join("");
  const cmpEls = $$("[data-cmp]");

  // milestones
  const crossAt = target => (rate.total > 0 ? tLatest + (target - L.total) / rate.total * SEC : Infinity);
  function milestoneTargets(t) {
    const d = debtAt(t);
    const nextBn = Math.ceil((d + 1) / 1e9) * 1e9;
    let next10 = Math.ceil((d + 1) / 10e9) * 10e9;
    if (next10 === nextBn) next10 += 10e9;
    let next100 = Math.ceil((d + 1) / 100e9) * 100e9;
    if (next100 === next10) next100 += 100e9;
    const list = [nextBn, next10, next100, 1e12].filter((v, i, a) => a.indexOf(v) === i && v <= 1e12);
    return list.slice(0, 4);
  }

  /* ================= national days & economic calendar ================= */
  const CAL = D.calendar || { days: [] };
  const dayStart = t => { const d = new Date(t); return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()); };
  const WEEKDAY = t => new Date(t).toLocaleDateString("en-GB", { weekday: "long", timeZone: "UTC" });

  function easterAt(y) { // Gregorian computus, Easter Sunday at 00:00 UTC
    const a = y % 19, b = Math.floor(y / 100), c = y % 100;
    const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
    return Date.UTC(y, month - 1, day);
  }
  function nthWeekdayAt(y, month, weekday, nth) { // weekday: 0 Sun … 6 Sat
    const first = new Date(Date.UTC(y, month - 1, 1));
    return Date.UTC(y, month - 1, 1 + ((weekday - first.getUTCDay() + 7) % 7) + (nth - 1) * 7);
  }
  function occurrences(entry, year) {
    const out = [];
    if (entry.rule === "fixed") out.push(Date.UTC(year, entry.month - 1, entry.day));
    else if (entry.rule === "easter") out.push(easterAt(year) + (entry.offset || 0) * DAY * SEC);
    else if (entry.rule === "nth-weekday") out.push(nthWeekdayAt(year, entry.month, entry.weekday, entry.nth));
    else if (entry.rule === "monthly-weekday") for (let m = 1; m <= 12; m++) out.push(nthWeekdayAt(year, m, entry.weekday, entry.nth));
    else if (entry.rule === "dates") (entry.dates || []).forEach(iso => { if (iso.slice(0, 4) === String(year)) out.push(parseDay(iso)); });
    return out.map(at => ({ at, entry }));
  }
  function calendarFrom(fromDay, count) {
    const startYear = new Date(fromDay).getUTCFullYear();
    const all = [];
    for (let y = startYear; y <= startYear + 2; y++) CAL.days.forEach(entry => all.push(...occurrences(entry, y)));
    const seen = new Set();
    return all
      .filter(e => e.at >= fromDay)
      .sort((a, b) => a.at - b.at || (a.entry.kind === "holiday" ? -1 : 1))
      .filter(e => { // a monthly release only needs to show its next date
        if (e.entry.rule !== "monthly-weekday") return true;
        if (seen.has(e.entry.name)) return false;
        seen.add(e.entry.name);
        return true;
      })
      .slice(0, count);
  }
  const KIND_WORD = { holiday: "Public holiday", observance: "Commemorative day", economic: "Economic calendar" };
  function anniversary(e) {
    const since = e.entry.since;
    if (!since) return "";
    const n = new Date(e.at).getUTCFullYear() - since;
    return `${fmt(n)} ${e.entry.sinceWord || "years"}`;
  }
  function awayWords(at, today) {
    const days = Math.round((at - today) / (DAY * SEC));
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    if (days < 7) return `In ${days} days`;
    if (days < 14) return "Next week";
    if (days < 60) return `In ${days} days`;
    const months = Math.round(days / 30.44);
    return `In about ${months} month${months === 1 ? "" : "s"}`;
  }
  function calDateFmt(at) { const d = new Date(at); return `${d.getUTCDate()} ${MON_LONG[d.getUTCMonth()]}`; }

  function renderCalendar(t) {
    const today = dayStart(t);
    const list = calendarFrom(today, 8);
    const todays = list.filter(e => e.at === today);
    const band = $("dayband");

    if (todays.length) {
      const e = todays.find(x => x.entry.kind === "holiday") || todays[0];
      const bits = [KIND_WORD[e.entry.kind], anniversary(e)].filter(Boolean);
      band.className = `dayband ${e.entry.kind}`;
      band.innerHTML = `
        <span class="db-tag">Today</span>
        <b class="db-name">${esc(e.entry.name)}</b>
        <span class="db-meta">${bits.map(esc).join(" · ")}</span>
        <span class="db-blurb">${esc(e.entry.blurb || "")}</span>`;
      band.hidden = false;
    } else {
      band.hidden = true;
      band.innerHTML = "";
    }

    $("cal-list").innerHTML = list.map(e => {
      const d = new Date(e.at), today_ = e.at === today;
      const note = [anniversary(e), e.entry.approx ? "Expected date" : ""].filter(Boolean).join(" · ");
      return `
      <li class="cell cal-item ${e.entry.kind}${today_ ? " is-today" : ""}">
        <span class="cal-date"><b>${d.getUTCDate()}</b><span>${MON[d.getUTCMonth()]}${d.getUTCFullYear() !== Y ? " " + d.getUTCFullYear() : ""}</span></span>
        <span class="cal-main">
          <span class="cal-name">${esc(e.entry.name)}${today_ ? '<i class="cal-now">Today</i>' : ""}</span>
          <span class="note">${esc(e.entry.blurb || "")}</span>
        </span>
        <span class="cal-right">
          <span class="cal-away">${awayWords(e.at, today)}</span>
          <span class="note">${esc(WEEKDAY(e.at))}${note ? " · " + esc(note) : ""}</span>
        </span>
      </li>`;
    }).join("");

    const src = CAL.sourceUrl ? ` <a href="${esc(CAL.sourceUrl)}" target="_blank" rel="noopener">${esc(CAL.sourceTitle || "Source")}</a>.` : "";
    $("cal-note").innerHTML = `${esc(CAL.note || "")}${src}`;

    const bd = $("b-day");
    if (todays.length) {
      const e = todays.find(x => x.entry.kind === "holiday") || todays[0];
      bd.className = `b-day ${e.entry.kind}`;
      bd.innerHTML = `<i>Today</i>${esc(e.entry.name)}`;
      bd.hidden = false;
    } else {
      const next = list.find(e => e.entry.kind !== "economic") || list[0];
      if (!next) { bd.hidden = true; return; }
      bd.className = `b-day next ${next.entry.kind}`;
      bd.innerHTML = `<i>Next</i>${esc(next.entry.name)} <b>${esc(calDateFmt(next.at))} · ${esc(awayWords(next.at, today).toLowerCase())}</b>`;
      bd.hidden = false;
    }
  }


  /* ================= trade & reserves shown beside the milestone ================= */
  const OZ_PER_TONNE = 32150.7465;
  const readBy = label => allItems.find(i => i.label === label) || {};
  function tradeFacts() {
    const exports_ = D.trade.totalExports, surplus = (readBy("Trade surplus").value ?? 0);
    const imports_ = exports_ - surplus;
    const goldT = readBy("BoG gold reserves").value ?? 0;
    const goldUsd = goldT * OZ_PER_TONNE * (readBy("Gold price").value ?? 0) / 1e9;
    return [
      { key: "trade:exports", what: "Exports", value: `US$${fmt(exports_, 1)}`, unit: "bn",
        when: `Gold US$${fmt(D.trade.goldExports, 1)}bn of the total · ${D.trade.period}`,
        short: `gold US$${fmt(D.trade.goldExports, 1)}bn · ${D.trade.period}` },
      { key: "trade:imports", what: "Imports", value: `US$${fmt(imports_, 1)}`, unit: "bn",
        when: `Exports minus the US$${fmt(surplus, 1)}bn surplus · ${D.trade.period}`,
        short: `US$${fmt(surplus, 1)}bn surplus · ${D.trade.period}` },
      { key: "trade:gold", what: "Gold reserves", value: fmt(goldT, 1), unit: "tonnes",
        when: `About US$${fmt(goldUsd, 1)}bn at today's gold price · ${esc(readBy("BoG gold reserves").date || "")}`,
        short: `about US$${fmt(goldUsd, 1)}bn · ${esc(readBy("BoG gold reserves").date || "")}` }
    ];
  }


  /* ================= the long view: annual series since 1993 ================= */
  const HIST = (window.GDC_HISTORY && window.GDC_HISTORY.series) || {};
  const HIST_SRC = (window.GDC_HISTORY || {}).source || "World Bank";
  const HIST_URL = (window.GDC_HISTORY || {}).sourceUrl || "";
  const HIST_ALIAS = { "Trade surplus": "balance", "Nominal GDP": "gdp", "Remittances": "Remittances" };
  function longHistory(key) {
    const h = HIST[HIST_ALIAS[key] || key];
    if (!h || !Array.isArray(h.points) || h.points.length < 5) return "";
    const u = { unit: h.unit || "", dec: h.dec ?? 0, pre: !!h.pre };
    const first = h.points[0], last = h.points[h.points.length - 1];
    const src = HIST_URL ? `<a href="${esc(HIST_URL)}" target="_blank" rel="noopener">${esc(h.source || HIST_SRC)}</a>` : esc(h.source || HIST_SRC);
    return `
      <section class="sheet-sec long">
        <h3>Since ${esc(first.date)}<span class="long-tag">${h.points.length} years</span></h3>
        ${sheetChart(h.points, u)}
        ${trendHtml(analyse(h.points, u))}
        <details class="long-table"><summary>Every year, ${esc(first.date)} to ${esc(last.date)}</summary>${sheetTable(h.points, u, h.points.length)}</details>
        <p class="sheet-src">${esc(h.note || "")} Source: ${src}.</p>
      </section>`;
  }

  /* ================= tap a figure for its history and trend ================= */
  const sheetEl = $("sheet"), sheetScrim = $("sheet-scrim");
  let sheetOpener = null;

  const unitBits = it => ({ unit: it.unit || "", dec: it.dec || 0, pre: !!it.pre });
  const showVal = (v, u) => (u.pre ? `${esc(u.unit)}${fmt(v, u.dec)}` : `${fmt(v, u.dec)}${u.unit ? `<span class="u">${esc(u.unit)}</span>` : ""}`);
  const plainVal = (v, u) => (u.pre ? `${u.unit}${fmt(v, u.dec)}` : `${fmt(v, u.dec)}${u.unit ? " " + u.unit : ""}`);

  function seriesOf(it) {
    if (it.auto === "fx.usd" && Array.isArray(D.cedi) && D.cedi.length > 1) return D.cedi.map(c => ({ date: c.label || isoDayLabel(c.date), value: c.rate }));
    const auto = it.auto && A.history && A.history[it.auto];
    const daily = Array.isArray(auto) ? auto.map(p => ({ date: isoDayLabel(p.date), value: p.value })) : [];
    const hand = Array.isArray(it.series) ? it.series.filter(p => p && typeof p.value === "number") : [];
    return daily.length > 1 ? [...hand, ...daily] : hand;
  }

  // plain-language trend read-out
  function analyse(points, u) {
    if (points.length < 2) return [];
    const lines = [];
    const last = points[points.length - 1], prev = points[points.length - 2], first = points[0];
    const move = (a, b) => {
      const diff = a.value - b.value;
      const word = diff > 0 ? "up" : diff < 0 ? "down" : "unchanged";
      const pct = b.value ? Math.abs(diff / b.value) * 100 : 0;
      return { diff, word, pct, abs: Math.abs(diff) };
    };
    const m = move(last, prev);
    lines.push(m.word === "unchanged"
      ? `<b>Unchanged</b> from ${esc(prev.date)} at ${plainVal(last.value, u)}.`
      : `<b>${m.word === "up" ? "Up" : "Down"} ${plainVal(m.abs, u)}</b> since ${esc(prev.date)} (${fmt(m.pct, 1)}%), from ${plainVal(prev.value, u)} to ${plainVal(last.value, u)}.`);

    if (points.length > 2) {
      const s = move(last, first);
      lines.push(s.word === "unchanged"
        ? `Back where it started: ${plainVal(first.value, u)} in ${esc(first.date)}.`
        : `Over the ${points.length} readings since ${esc(first.date)} it is <b>${s.word} ${plainVal(s.abs, u)}</b> (${fmt(s.pct, 1)}%).`);

      const hi = points.reduce((a, b) => (b.value > a.value ? b : a));
      const lo = points.reduce((a, b) => (b.value < a.value ? b : a));
      lines.push(`Highest ${plainVal(hi.value, u)} in ${esc(hi.date)} · lowest ${plainVal(lo.value, u)} in ${esc(lo.date)}.`);

      let ups = 0, downs = 0;
      for (let i = 1; i < points.length; i++) {
        if (points[i].value > points[i - 1].value) ups++;
        else if (points[i].value < points[i - 1].value) downs++;
      }
      const steps = points.length - 1;
      if (ups !== downs) lines.push(`${ups > downs ? "Rising" : "Falling"} in ${Math.max(ups, downs)} of the last ${steps} moves.`);

      let run = 1;
      for (let i = points.length - 1; i > 0; i--) {
        const a = points[i].value - points[i - 1].value, b = i > 1 ? points[i - 1].value - points[i - 2].value : 0;
        if (a === 0 || (i > 1 && Math.sign(a) !== Math.sign(b))) break;
        if (i > 1) run++;
      }
      if (run > 1) lines.push(`That is ${run} readings in a row in the same direction.`);
    }
    return lines;
  }

  // small line chart drawn straight into the sheet
  function sheetChart(points, u) {
    if (points.length < 2) return "";
    const W = 640, H = 220, L = 8, R = 8, T = 18, B = 34;
    const vals = points.map(p => p.value);
    let min = Math.min(...vals), max = Math.max(...vals);
    if (min === max) { min -= Math.abs(min || 1) * 0.1; max += Math.abs(max || 1) * 0.1; }
    const pad = (max - min) * 0.12;
    min -= pad; max += pad;
    const x = i => L + (W - L - R) * (points.length === 1 ? 0.5 : i / (points.length - 1));
    const y = v => T + (H - T - B) * (1 - (v - min) / (max - min));
    const line = points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`).join(" ");
    const area = `${line} L${x(points.length - 1).toFixed(1)} ${H - B} L${x(0).toFixed(1)} ${H - B} Z`;
    const dots = points.map((p, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(p.value).toFixed(1)}" r="${i === points.length - 1 ? 5 : 3}" class="${i === points.length - 1 ? "last" : ""}"></circle>`).join("");
    const step = Math.max(1, Math.ceil(points.length / 4));
    const labels = points.map((p, i) => {
      const last = points.length - 1;
      const show = i === 0 || i === last || (i % step === 0 && i > step / 2 && last - i > step / 2);
      if (!show) return "";
      const anchor = i === 0 ? "start" : i === points.length - 1 ? "end" : "middle";
      return `<text x="${x(i).toFixed(1)}" y="${H - 12}" text-anchor="${anchor}" class="sx">${esc(p.date)}</text>`;
    }).join("");
    const hi = Math.max(...vals), lo = Math.min(...vals);
    return `
      <svg class="sheet-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Chart of the readings listed below">
        <line x1="${L}" y1="${y(hi).toFixed(1)}" x2="${W - R}" y2="${y(hi).toFixed(1)}" class="grid"></line>
        <line x1="${L}" y1="${y(lo).toFixed(1)}" x2="${W - R}" y2="${y(lo).toFixed(1)}" class="grid"></line>
        <path d="${area}" class="area"></path>
        <path d="${line}" class="line"></path>
        ${dots}
        <text x="${L}" y="${(y(hi) - 6).toFixed(1)}" class="sy">${esc(plainVal(hi, u))}</text>
        <text x="${L}" y="${(y(lo) + 14).toFixed(1)}" class="sy">${esc(plainVal(lo, u))}</text>
        ${labels}
      </svg>`;
  }

  function sheetTable(points, u, limit = 14) {
    const rows = points.slice(-limit).reverse();
    return `
      <div class="sheet-table-wrap">
        <table class="sheet-table">
          <thead><tr><th>Reading</th><th>Value</th><th>Change</th></tr></thead>
          <tbody>${rows.map((p, i) => {
            const older = rows[i + 1];
            const diff = older ? p.value - older.value : null;
            const cls = diff == null ? "" : diff > 0 ? "up" : diff < 0 ? "down" : "flat";
            const txt = diff == null ? "—" : `${diff > 0 ? "▲" : diff < 0 ? "▼" : "•"} ${plainVal(Math.abs(diff), u)}`;
            return `<tr><td>${esc(p.date)}</td><td class="v">${plainVal(p.value, u)}</td><td class="c ${cls}">${esc(txt)}</td></tr>`;
          }).join("")}</tbody>
        </table>
      </div>`;
  }

  const sheetSection = (title, html) => (html ? `<section class="sheet-sec"><h3>${esc(title)}</h3>${html}</section>` : "");
  const trendHtml = lines => (lines.length ? `<ul class="trend">${lines.map(l => `<li>${l}</li>`).join("")}</ul>` : "");
  const factRow = (k, v) => `<div class="fact"><span class="fk">${esc(k)}</span><span class="fv">${v}</span></div>`;

  // the readings the debt sheet charts
  const debtPoints = pick => D.debt.readings
    .filter(r => pick(r) != null)
    .map(r => ({ date: isoDayLabel(r.date), value: pick(r) }));

  function detailFor(key) {
    const [type, id] = [key.slice(0, key.indexOf(":")), key.slice(key.indexOf(":") + 1)];
    const t = Date.now();

    if (type === "read") {
      const it = READS.get(id);
      if (!it) return null;
      const u = unitBits(it);
      const points = seriesOf(it);
      const age = staleDays(it);
      const facts = [
        factRow("Latest reading", showVal(it.value, u)),
        factRow("Period", esc(it.date || "—")),
        it.autoSource ? factRow("Updated", "Automatically, every morning") : "",
        age ? factRow("Age", `${age} days old · update due`) : ""
      ].join("");
      return {
        eyebrow: "Indicator",
        title: it.label,
        body: `
          <div class="facts">${facts}</div>
          ${it.note ? `<p class="sheet-note">${toneNote(it.note, it.tone)}</p>` : ""}
          ${points.length > 1
            ? sheetSection("History", sheetChart(points, u) + sheetTable(points, u)) + sheetSection("Trend", trendHtml(analyse(points, u)))
            : `<div class="sheet-empty"><b>No history recorded yet.</b><p>This figure has one published reading so far. Every time it is updated — automatically each morning for market prices, or through the update form for published figures — the old reading is kept here, so the chart and trend build up from now on.</p></div>`}
          ${it.seriesSource ? `<p class="sheet-src">History from ${esc(it.seriesSource)}.</p>` : ""}
          ${longHistory(it.label)}`
      };
    }

    if (type === "budget") {
      const b = [...D.budget.in, ...D.budget.out].find(x => x.key === id);
      if (!b) return null;
      const side = D.budget.in.includes(b) ? "in" : "out";
      const total = side === "in" ? revenue : spending;
      const f = yearFrac(t), soFar = b.value * f;
      const u = { unit: "", dec: 0, pre: false };
      return {
        eyebrow: side === "in" ? `Money in · ${Y} budget` : `Money out · ${Y} budget`,
        title: b.label,
        body: `
          <div class="facts">
            ${factRow("Approved for the year", `${sym()}${fmt(money(b.value), 0)}`)}
            ${factRow("Spread so far this year", `${sym()}${fmt(money(soFar), 0)}`)}
            ${factRow("Share of " + (side === "in" ? "revenue" : "spending"), `${fmt(b.value / total * 100, 1)}%`)}
            ${factRow("Per person, full year", `${sym()}${fmt(money(b.value / D.population.base), 2)}`)}
            ${factRow("Per day", `${sym()}${fmt(money(b.value / 365), 0)}`)}
          </div>
          <div class="sheet-bar" aria-hidden="true"><i style="width:${(f * 100).toFixed(1)}%"></i></div>
          <p class="sheet-note">${esc(b.note)}</p>
          <div class="sheet-empty">
            <b>How this figure moves.</b>
            <p>Budget lines are annual amounts approved by Parliament. The dashboard spreads each one evenly across the year and counts it up from 1 January, so the live figure is ${fmt(f * 100, 1)}% of the year's total. It is an even-pace estimate, not actual spending to date. A new budget every November replaces these figures.</p>
          </div>`
      };
    }

    if (type === "rating") {
      const r = D.ratings.find(x => x.agency === id);
      if (!r) return null;
      const idx = r.scale.indexOf(r.rating), below = r.scale.length - 1 - idx;
      return {
        eyebrow: "Credit rating",
        title: r.agency,
        body: `
          <div class="facts">
            ${factRow("Rating", esc(r.rating))}
            ${factRow("Outlook", esc(r.outlook))}
            ${factRow("Below investment grade", `${below} notch${below === 1 ? "" : "es"}`)}
            ${factRow("Dated", esc(r.date))}
          </div>
          <div class="ladder sheet-ladder" aria-hidden="true">${r.scale.map((n, k) => `<span class="${k === idx ? "on" : k < idx ? "past" : ""}${k === r.scale.length - 1 ? " ig" : ""}">${esc(n)}</span>`).join("")}</div>
          <p class="sheet-note">${esc(r.note)}</p>
          <div class="sheet-empty"><b>What it means.</b><p>A rating is an agency's view of how likely Ghana is to repay. ${esc(r.agency)} places Ghana ${below} notch${below === 1 ? "" : "es"} below investment grade, the level at which many large funds are allowed to buy a country's bonds. A rating change usually moves the yields Ghana pays on new borrowing.</p></div>`
      };
    }

    if (type === "trade") {
      const ex = D.trade.totalExports, surplus = readBy("Trade surplus").value ?? 0, im = ex - surplus;
      const gold = readBy("Gold exports"), cocoa = readBy("Cocoa exports"), oil = readBy("Oil exports");
      const res = readBy("Gross reserves"), bar = readBy("BoG gold reserves"), price = readBy("Gold price");
      const usd = { unit: "US$", dec: 1, pre: true };

      if (id === "exports") {
        const rows = [gold, cocoa, oil].filter(x => x.value).map(x => ({ date: x.label, value: x.value }));
        return {
          eyebrow: `Trade · ${esc(D.trade.period)}`,
          title: "Exports",
          body: `
            <div class="facts">
              ${factRow("Total exports", `US$${fmt(ex, 1)}<span class="u">bn</span>`)}
              ${factRow("Gold", `US$${fmt(D.trade.goldExports, 1)}bn · ${fmt(D.trade.goldExports / ex * 100, 0)}%`)}
              ${cocoa.value ? factRow("Cocoa", `US$${fmt(cocoa.value, 1)}bn · ${fmt(cocoa.value / ex * 100, 0)}%`) : ""}
              ${oil.value ? factRow("Crude oil", `US$${fmt(oil.value, 1)}bn · ${fmt(oil.value / ex * 100, 0)}%`) : ""}
              ${factRow("Trade balance", `US$${fmt(surplus, 1)}bn surplus`)}
            </div>
            ${sheetSection("What Ghana sold, US$bn", sheetTable(rows, usd))}
            <div class="sheet-empty"><b>Gold carries the export book.</b><p>Gold alone is ${fmt(D.trade.goldExports / ex * 100, 0)}% of everything Ghana sold abroad in ${esc(D.trade.period)}, which is why the gold price on this page moves the trade surplus, the cedi and the reserves together. ${esc(gold.note || "")}</p></div>
            <p class="sheet-src">Merchandise trade figures from the Bank of Ghana and the Ghana Statistical Service. The three lines above do not add to the total: they are the largest items, not all of it.</p>
            ${longHistory("exports")}`
        };
      }
      if (id === "imports") {
        return {
          eyebrow: `Trade · ${esc(D.trade.period)}`,
          title: "Imports",
          body: `
            <div class="facts">
              ${factRow("Imports", `US$${fmt(im, 1)}<span class="u">bn</span>`)}
              ${factRow("Exports", `US$${fmt(ex, 1)}bn`)}
              ${factRow("Trade surplus", `US$${fmt(surplus, 1)}bn`)}
              ${factRow("Exports cover imports", `${fmt(ex / im * 100, 0)}%`)}
              ${res.value ? factRow("Gross reserves", `US$${fmt(res.value, 1)}bn`) : ""}
            </div>
            <div class="sheet-empty"><b>How this figure is worked out.</b><p>Ghana publishes exports and the trade balance more promptly than a headline import total, so this is exports minus the surplus: US$${fmt(ex, 1)}bn − US$${fmt(surplus, 1)}bn = US$${fmt(im, 1)}bn for ${esc(D.trade.period)}. It counts goods, not services.</p></div>
            ${res.note ? `<p class="sheet-note">Reserves: ${toneNote(res.note, res.tone)}</p>` : ""}
            <p class="sheet-src">A surplus means the country earned more from what it sold abroad than it spent on what it bought — the first stretch of surpluses in two decades, and the reason the cedi has held.</p>
            ${longHistory("imports")}
            ${longHistory("balance")}`
        };
      }
      if (id === "gold") {
        const t_ = bar.value || 0, oz = t_ * OZ_PER_TONNE, worth = oz * (price.value || 0) / 1e9;
        const points = seriesOf(bar);
        return {
          eyebrow: "Bank of Ghana",
          title: "Gold reserves",
          body: `
            <div class="facts">
              ${factRow("Held by the central bank", `${fmt(t_, 1)}<span class="u">tonnes</span>`)}
              ${factRow("Worth about", `US$${fmt(worth, 2)}bn`)}
              ${factRow("Gold price used", `US$${fmt(price.value || 0, 0)} an ounce`)}
              ${factRow("As at", esc(bar.date || "—"))}
              ${res.value ? factRow("Share of gross reserves", `${fmt(worth / res.value * 100, 0)}%`) : ""}
            </div>
            ${bar.note ? `<p class="sheet-note">${toneNote(bar.note, bar.tone)}</p>` : ""}
            ${points.length > 1 ? sheetSection("Tonnes held", sheetChart(points, { unit: "t", dec: 1, pre: false }) + sheetTable(points, { unit: "t", dec: 1, pre: false })) : `<div class="sheet-empty"><b>Building the record.</b><p>Each time this figure is updated through the form, the previous reading is kept, so a chart of the holdings builds up here.</p></div>`}
            <p class="sheet-src">The Bank of Ghana buys gold from licensed small-scale miners under its domestic gold purchase programme. Bullion sits in reserves as a buffer that does not depend on any other country's currency; the price on this page is refreshed every morning.</p>`
        };
      }
    }

    if (type === "debt") {
      const bn = { unit: "GH¢bn", dec: 1, pre: false };
      const pct = { unit: "%", dec: 1, pre: false };
      const paceSec = rate.total, paceDay = rate.total * DAY;
      const method = `Counts forward from the ${L.label} figure at the pace debt grew between ${P.label} and ${L.label}.`;

      if (id === "total" || id === "ytd" || id === "today") {
        const points = debtPoints(r => r.total);
        const monthly = points.slice(1).map((p, i) => ({ date: p.date, value: p.value - points[i].value }));
        const isFlow = id !== "total";
        return {
          eyebrow: isFlow ? "Borrowing" : "Public debt",
          title: id === "total" ? "Total public debt" : id === "ytd" ? "Borrowed so far this year" : "Borrowed today",
          body: `
            <div class="facts">
              ${factRow("Live estimate now", `${sym()}${fmt(money(LIVE[id === "total" ? "debt" : id][0](t)), 0)}`)}
              ${factRow(`Latest official reading (${esc(L.label)})`, `${sym()}${fmt(money(L.total), 0)}`)}
              ${factRow("Pace", `${sym()}${fmt(money(paceSec), 0)} a second · ${sym()}${fmt(money(paceDay) / 1e6, 1)}m a day`)}
              ${factRow("Debt-to-GDP", `${fmt(D.debt.ratioLatest, 1)}% at ${esc(L.label)}`)}
            </div>
            ${sheetSection(isFlow ? "Borrowed each month, GH¢bn" : "Official readings, GH¢bn", (isFlow ? sheetChart(monthly, bn) + sheetTable(monthly, bn) : sheetChart(points, bn) + sheetTable(points, bn)))}
            ${sheetSection("Trend", trendHtml(analyse(isFlow ? monthly : points, bn)))}
            <p class="sheet-src">${esc(method)}</p>`
        };
      }
      if (id === "domestic" || id === "external") {
        const points = debtPoints(r => r[id]);
        const share = (id === "domestic" ? L.domestic : L.external) / L.total * 100;
        return {
          eyebrow: "Public debt",
          title: id === "domestic" ? "Domestic debt" : "External debt",
          body: `
            <div class="facts">
              ${factRow("Live estimate now", `${sym()}${fmt(money(LIVE[id === "domestic" ? "dom" : "ext"][0](t)), 0)}`)}
              ${factRow(`At ${esc(L.label)}`, `${sym()}${fmt(money(id === "domestic" ? L.domestic : L.external), 0)}`)}
              ${factRow("Share of total debt", `${fmt(share, 1)}%`)}
            </div>
            ${sheetSection("Official readings, GH¢bn", sheetChart(points, bn) + sheetTable(points, bn))}
            ${sheetSection("Trend", trendHtml(analyse(points, bn)))}
            ${id === "external" ? `<p class="sheet-note">Most external debt is owed in foreign currency, so a weaker cedi raises this figure even without new borrowing.</p>` : ""}
            <p class="sheet-src">${esc(method)}</p>`
        };
      }
      if (id === "ratio") {
        const points = [...D.history.filter(h => h.ratio != null).map(h => ({ date: h.label || String(h.k), value: h.ratio })), ...debtPoints(r => r.ratio)];
        return {
          eyebrow: "Public debt",
          title: "Debt-to-GDP",
          body: `
            <div class="facts">
              ${factRow("Live estimate now", `${fmt(LIVE.ratio[0](t), 3)}%`)}
              ${factRow(`Reported at ${esc(L.label)}`, `${fmt(D.debt.ratioLatest, 1)}%`)}
              ${factRow("Peak", `${fmt(D.debt.ratioPeak.value, 1)}% at ${esc(D.debt.ratioPeak.label)}`)}
            </div>
            ${sheetSection("Year-end and monthly readings, % of GDP", sheetChart(points, pct) + sheetTable(points, pct))}
            ${sheetSection("Trend", trendHtml(analyse(points, pct)))}
            <p class="sheet-src">The live figure divides the debt estimate by the ${Y} nominal GDP projection of ${short(D.debt.nominalGdp)}.</p>`
        };
      }
      if (id === "pop") {
        const growthPct = D.population.growth * 100;
        return {
          eyebrow: "People",
          title: "Population",
          body: `
            <div class="facts">
              ${factRow("Live estimate now", fmt(popAt(t), 0))}
              ${factRow(`${D.population.source} projection`, `${fmt(D.population.base / 1e6, 1)} million`)}
              ${factRow("Projection dated", esc(isoDayLabel(D.population.date.slice(0, 10))))}
              ${factRow("Growing", `${fmt(growthPct, 1)}% a year · one more person every ${fmt(365.25 * DAY / (D.population.base * D.population.growth), 0)} seconds`)}
              ${factRow("Debt per person now", `${sym()}${fmt(money(LIVE.percap[0](t)), 2)}`)}
            </div>
            <p class="sheet-note">Ghana counts its people in a census, not day by day. The counter carries the ${D.population.source}'s projection forward at the published growth rate, which is why the per-person figures on this page drift down slowly as it climbs.</p>
            ${longHistory("population")}`
        };
      }
      if (id === "gdp") {
        const points = D.history.filter(h => h.ratio && h.debt).map(h => ({ date: h.label || String(h.k), value: h.debt / (h.ratio / 100) }));
        points.push({ date: `${Y} proj.`, value: D.debt.nominalGdp / 1e9 });
        return {
          eyebrow: "Economy",
          title: `Ghana's GDP so far in ${Y}`,
          body: `
            <div class="facts">
              ${factRow("Produced so far this year", `${sym()}${fmt(money(D.debt.nominalGdp * yearFrac(t)), 0)}`)}
              ${factRow(`${Y} projection`, short(D.debt.nominalGdp))}
              ${factRow("Per second", `${sym()}${fmt(money(D.debt.nominalGdp / (365 * DAY)), 0)}`)}
            </div>
            ${sheetSection("Nominal GDP, GH¢bn", sheetChart(points, bn) + sheetTable(points, bn))}
            ${sheetSection("Trend", trendHtml(analyse(points, bn)))}
            <p class="sheet-src">Earlier years are worked back from each year-end debt stock and its debt-to-GDP ratio. The counter spreads the ${Y} projection evenly across the year.</p>
            ${longHistory("gdp")}`
        };
      }
    }
    return null;
  }

  function openSheet(key, opener) {
    const d = detailFor(key);
    if (!d) return;
    sheetOpener = opener || null;
    $("sheet-eyebrow").textContent = d.eyebrow;
    $("sheet-title").textContent = d.title;
    $("sheet-body").innerHTML = d.body;
    $("sheet-body").scrollTop = 0;
    sheetScrim.hidden = false;
    sheetEl.hidden = false;
    requestAnimationFrame(() => { sheetScrim.classList.add("on"); sheetEl.classList.add("on"); });
    document.body.classList.add("sheet-open");
    $("sheet-close").focus();
  }
  function closeSheet() {
    if (sheetEl.hidden) return;
    sheetEl.classList.remove("on");
    sheetScrim.classList.remove("on");
    document.body.classList.remove("sheet-open");
    setTimeout(() => { sheetEl.hidden = true; sheetScrim.hidden = true; }, 220);
    if (sheetOpener && sheetOpener.isConnected) sheetOpener.focus();
    sheetOpener = null;
  }

  document.addEventListener("click", e => {
    if (e.target.closest(".sheet")) return;
    const hit = e.target.closest("[data-detail]");
    if (hit) { openSheet(hit.dataset.detail, hit); return; }
    if (e.target.closest("#sheet-scrim")) closeSheet();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !sheetEl.hidden) { closeSheet(); return; }
    const hit = e.target.closest && e.target.closest("[data-detail]");
    if (hit && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openSheet(hit.dataset.detail, hit); }
  });
  $("sheet-close").addEventListener("click", closeSheet);

  // swipe the sheet down to close on a touch screen
  (() => {
    const grip = $("sheet-grip");
    let y0 = null;
    const start = e => { y0 = e.touches ? e.touches[0].clientY : e.clientY; sheetEl.style.transition = "none"; };
    const move = e => {
      if (y0 == null) return;
      const dy = (e.touches ? e.touches[0].clientY : e.clientY) - y0;
      if (dy > 0) sheetEl.style.transform = `translateY(${dy}px)`;
    };
    const end = e => {
      if (y0 == null) return;
      const dy = (e.changedTouches ? e.changedTouches[0].clientY : e.clientY) - y0;
      sheetEl.style.transition = "";
      sheetEl.style.transform = "";
      y0 = null;
      if (dy > 90) closeSheet();
    };
    grip.addEventListener("touchstart", start, { passive: true });
    grip.addEventListener("touchmove", move, { passive: true });
    grip.addEventListener("touchend", end);
  })();

  // make every tappable figure reachable by keyboard and announced as a button
  function markTappable() {
    $$("[data-detail]").forEach(el => {
      if (el.dataset.tapReady) return;
      el.dataset.tapReady = "1";
      el.classList.add("tappable");
      el.setAttribute("role", "button");
      el.setAttribute("tabindex", "0");
      el.setAttribute("aria-haspopup", "dialog");
      if (!el.hasAttribute("aria-label")) {
        const label = el.querySelector(".k, .name, .b-label");
        el.setAttribute("aria-label", `${label ? label.textContent.trim() : "This figure"}: show history and trend`);
      }
    });
  }
  markTappable();

  /* ================= LED painting ================= */
  $$("[data-live]").forEach(el => {
    el.classList.add("led");
    if (!el.querySelector(".lit")) el.innerHTML = '<span class="ghost"></span><span class="lit"></span>';
  });
  const liveEls = $$("[data-live]").map(el => ({ key: el.dataset.live, lit: el.querySelector(".lit"), ghost: el.querySelector(".ghost") }));
  function paint(item, text) {
    if (item.lit.textContent === text) return;
    item.lit.textContent = text;
    const g = text.replace(/\d/g, "8");
    if (item.ghost.textContent !== g) item.ghost.textContent = g;
  }

  function fit(root = document) {
    $$(".hero-number, .cell .num, .lrow, .gap-row, .people > .cell, .cell.row, .hero-strip > .cell, .b-number, .b-stat, .b-tile", root).forEach(box => {
      const el = box.querySelector(".led");
      if (!el || !box.getClientRects().length) return;
      el.style.fontSize = "";
      const cs = getComputedStyle(box);
      const overflowing = () => {
        const b = box.getBoundingClientRect(), e = el.getBoundingClientRect();
        const k = b.width / (box.offsetWidth || b.width || 1); // board view is CSS-scaled
        const left = b.left + (parseFloat(cs.paddingLeft) + parseFloat(cs.borderLeftWidth)) * k;
        const right = b.right - (parseFloat(cs.paddingRight) + parseFloat(cs.borderRightWidth)) * k;
        const sib = [...box.children].some(c => c !== el && !c.contains(el) && c.getBoundingClientRect().right > e.left + 1 && c.getBoundingClientRect().left < e.left && c.getBoundingClientRect().top < e.bottom && c.getBoundingClientRect().bottom > e.top);
        return e.left < left - 1 || e.right > right + 1 || sib;
      };
      for (let i = 0; i < 18 && overflowing(); i++) {
        el.style.fontSize = parseFloat(getComputedStyle(el).fontSize) * 0.94 + "px";
      }
    });
  }

  /* ================= currency / household statics ================= */
  function paintMoney() {
    $$("[data-cur]").forEach(el => (el.textContent = sym()));
    $$("[data-short]").forEach(el => (el.textContent = short(+el.dataset.short)));
    $$(".b-rate [data-rate='sec']").forEach(el => (el.textContent = `${sym()}${fmt(money(rate.total), 0)}`));
    $$(".hero-strip [data-rate='sec']").forEach(el => (el.innerHTML = `<span class="p">${sym()}</span>${fmt(money(rate.total), 0)}`));
    $$("[data-rate='day']").forEach(el => (el.innerHTML = `<span class="p">${sym()}</span>${fmt(money(rate.total * DAY) / 1e6, 1)}<span class="u">million</span>`));
    $("sf-val").innerHTML = `${short(sf.value)} <span class="u">of ${short(sf.target)}</span>`;
    $("mat-val").textContent = D.debt.maturities.map(m => short(m.value)).join(" · ");
    const pop = D.population.base;
    $("p-int").textContent = fmt(money(interest / pop), 2);
    $("p-exp").textContent = fmt(money(spending / pop), 2);
    $("n-exp").innerHTML = `Against <b>${sym()}${fmt(money(revenue / pop), 2)}</b> of revenue per person`;
    const growth = allItems.find(i => i.label === "Real GDP growth");
    $("gdp-note").innerHTML = `Of ≈<b>${short(D.debt.nominalGdp)}</b> projected for ${Y}${growth ? ` · real growth <b>${fmt(growth.value, 1)}%</b> (${esc(growth.date)})` : ""}`;
    $$("[data-budget-year]").forEach(el => (el.textContent = Y));
    renderTicker();
    paintHousehold();
  }
  function paintHousehold() {
    $$("[data-hh-int]").forEach(el => (el.textContent = fmt(money(interest / D.population.base * household), 0)));
  }
  const shareUrl = () => D.siteUrl || location.href.split("#")[0];

  /* ================= once a second ================= */
  let lastSecond = -1, currentShareText = "";
  let calDay = -1;
  function everySecond(t) {
    const d = debtAt(t);
    const ds = dayStart(t);
    if (ds !== calDay) { calDay = ds; renderCalendar(t); }
    const clockHtml = clock12(t);
    $$("[data-clock]").forEach(el => { if (el.innerHTML !== clockHtml) el.innerHTML = clockHtml; });
    $$("[data-date]").forEach(el => (el.textContent = new Date(t).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })));
    $$("[data-words]").forEach(el => (el.textContent = `About ${fmt(money(d) / 1e9, 1)} billion ${usd ? "US dollars" : "Ghana cedis"}`));
    $$("[data-gauge]").forEach(el => (el.style.width = Math.min(100, d / D.debt.nominalGdp * 100).toFixed(2) + "%"));
    const f = yearFrac(t), day = Math.min(365, Math.floor((t - y0) / (DAY * SEC)) + 1);
    $$("[data-year-fill]").forEach(el => (el.style.width = (f * 100).toFixed(2) + "%"));
    $$("[data-year-day]").forEach(el => (el.textContent = f >= 1 ? `${Y} complete` : `Day ${day} of ${Y}`));
    $$("[data-year-pct]").forEach(el => (el.textContent = `${fmt(f * 100, 1)}% of the year gone`));
    $("gap-note").innerHTML = `Budgeted spending minus revenue, <b>${short(spending - revenue)}</b> for the year`;

    cmpEls.forEach(el => {
      const [n, unit] = COMPARE[+el.dataset.cmp].big(t);
      const html = unit === "×" ? `${n}×` : `${n}<small>${unit}</small>`;
      if (el.innerHTML !== html) el.innerHTML = html;
    });

    const m = milestoneTargets(t).map(v => ({ v, at: crossAt(v) }))[0];
    const facts = tradeFacts();
    $("milestones").innerHTML = `
      <li class="ms-goal">
        <span class="ms-what">Debt reaches <b>${cedisShort(m.v)}</b></span>
        <span class="ms-when">${isFinite(m.at) ? `Around ${dateFmt(m.at)}` : "Not at the current pace"}</span>
        <span class="ms-count">${isFinite(m.at) ? countdown(m.at - t) : "–"}</span>
      </li>` + facts.map(f => `
      <li class="ms-fact tappable" data-detail="${f.key}">
        <span class="ms-what">${esc(f.what)}</span>
        <span class="ms-when">${f.when}</span>
        <span class="ms-count">${f.value}<small>${esc(f.unit)}</small></span>
      </li>`).join("");
    $("b-milestones").innerHTML = `
      <div>
        <span class="b-label">Debt reaches</span>
        <span class="b-what">${cedisShort(m.v)}</span>
        <span class="b-count">${isFinite(m.at) ? countdown(m.at - t) : "–"}</span>
        <span class="b-when">${isFinite(m.at) ? `around ${dateFmt(m.at)}` : "not at current pace"}</span>
      </div>` + facts.map(f => `
      <div class="b-fact tappable" data-detail="${f.key}">
        <span class="b-label">${esc(f.what)}</span>
        <span class="b-what">${f.value}<small> ${esc(f.unit)}</small></span>
        <span class="b-when">${f.short || f.when}</span>
      </div>`).join("");
    markTappable();

    const days = d / popAt(t) * household / minWage;
    $$("[data-hh-days]").forEach(el => (el.innerHTML = `That’s <b>${fmt(days, 0)} days</b> of minimum-wage work, about <b>${fmt(days / 260, 1)} working years</b>, for ${household === 1 ? "one person" : `${household} people`}`));

    const text = `Ghana’s public debt is about ${sym()}${fmt(money(d) / 1e9, 1)} billion and grows by roughly ${sym()}${fmt(money(rate.total), 0)} every second.`;
    $$("[data-calc='percapUsd']").forEach(el => (el.innerHTML = `<span class="p">US$</span>${fmt(d / popAt(t) / D.fx.usd, 0)}`));
    currentShareText = text;
    $$("[data-share-text]").forEach(el => (el.innerHTML = esc(text).replace(/(GH¢|US\$)[\d.,]+( billion)?/g, "<b>$&</b>")));
    const url = shareUrl(), enc = encodeURIComponent;
    $("share-wa").href = `https://wa.me/?text=${enc(`${text} See it live on Alfredo Ghana Economic Data: ${url}`)}`;
    $("share-x").href = `https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(url)}`;
    $("share-fb").href = `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`;
    $$("[data-site]").forEach(el => (el.textContent = D.siteUrl ? D.siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "") : ""));
  }

  const liveTextEls = $$("[data-live-text]");
  function tick() {
    const t = Date.now(), cache = {};
    for (const el of liveTextEls) {
      const def = LIVE[el.dataset.liveText];
      if (!def) continue;
      const [fn, dec, isMoney] = def;
      const v = fn(t);
      const txt = isMoney ? `${sym()}${fmt(money(v), dec)}` : fmt(v, dec);
      if (el.textContent !== txt) el.textContent = txt;
    }
    for (const item of liveEls) {
      const def = LIVE[item.key];
      if (!def) continue;
      if (!(item.key in cache)) {
        const [fn, dec, isMoney, suffix = ""] = def;
        const v = fn(t);
        cache[item.key] = fmt(isMoney ? money(v) : v, dec) + suffix;
      }
      paint(item, cache[item.key]);
    }
    const s = Math.floor(t / SEC);
    if (s !== lastSecond) { lastSecond = s; everySecond(t); }
  }

  /* ================= controls ================= */
  function setCurrency(isUsd) {
    usd = isUsd;
    $("cur-ghs").setAttribute("aria-pressed", String(!usd));
    $("cur-usd").setAttribute("aria-pressed", String(usd));
    lastSecond = -1;
    paintMoney(); tick(); fit();
  }
  $("cur-ghs").addEventListener("click", () => setCurrency(false));
  $("cur-usd").addEventListener("click", () => setCurrency(true));

  const hhInput = $("hh-size");
  function setHousehold(n) {
    household = Math.min(50, Math.max(1, Math.round(n) || 1));
    hhInput.value = household;
    try { localStorage.setItem("gdc-household", String(household)); } catch (e) {}
    lastSecond = -1;
    paintHousehold(); tick(); fit();
  }
  hhInput.value = household;
  hhInput.addEventListener("change", () => setHousehold(+hhInput.value));
  hhInput.addEventListener("input", () => { const n = +hhInput.value; if (n >= 1 && n <= 50) setHousehold(n); });
  $("hh-minus").addEventListener("click", () => setHousehold(household - 1));
  $("hh-plus").addEventListener("click", () => setHousehold(household + 1));

  const status = $("share-status");
  $("share-copy").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(`${currentShareText} ${shareUrl()}`);
      status.textContent = "Copied. Paste it anywhere.";
    } catch (e) {
      status.textContent = "Your browser blocked copying. Copy the address from the address bar instead.";
    }
    setTimeout(() => (status.textContent = ""), 4000);
  });
  if (navigator.share) {
    const nb = $("share-native");
    nb.hidden = false;
    nb.addEventListener("click", () => navigator.share({ title: "Alfredo Ghana Economic Data", text: currentShareText, url: shareUrl() }).catch(() => {}));
  }

  /* ================= board view ================= */
  const board = $("board"), stage = $("stage");
  function scaleStage() {
    const s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    stage.style.transform = `translate(-50%, -50%) scale(${s})`;
  }
  function openBoard(fromClick = true) {
    document.body.classList.add("board-on");
    board.hidden = false;
    document.body.classList.add("board-on");
    scaleStage();
    lastSecond = -1; tick();
    drawSpark();
    fit(board);
    renderTicker();
    if (location.hash !== "#board") { try { history.replaceState(null, "", "#board"); } catch (e) {} }
    if (fromClick && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
    $("board-close").focus({ preventScroll: true });
  }
  function closeBoard() {
    document.body.classList.remove("board-on");
    board.hidden = true;
    document.body.classList.remove("board-on");
    if (location.hash === "#board") { try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {} }
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    $("board-open").focus({ preventScroll: true });
    fit();
  }
  $("board-open").addEventListener("click", () => openBoard());
  $("board-close").addEventListener("click", closeBoard);
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !board.hidden && sheetEl.hidden) closeBoard(); });
  document.addEventListener("fullscreenchange", () => { if (!board.hidden) scaleStage(); });

  /* ================= green ticker: GH¢ rates and GDP ================= */
  const FXT = A.fxTable || { rates: {}, prev: {} };
  const tickerTrack = $("ticker-track"), tickerBox = $("ticker");
  const tickerTracks = $$(".ticker-track");
  function sizeTickers() {
    requestAnimationFrame(() => tickerTracks.forEach(tr => {
      const w = tr.scrollWidth / 2;
      if (w > 0) tr.style.setProperty("--tk-duration", `${Math.max(30, w / 60)}s`);
    }));
  }
  function rateFor(code) {
    const r = FXT.rates || {};
    if (r[code]) return r[code];
    if (code === "XAF" && r.XOF) return { ghs: r.XOF.ghs, src: r.XOF.src }; // both CFA francs are fixed at the same euro rate
    return null;
  }
  // significant-figure formatting for small or large cross rates, e.g. 0.08730, 115.5, 2,109
  const sig = (v, digits = 4) => {
    if (!isFinite(v) || v <= 0) return "–";
    const mag = Math.floor(Math.log10(v));
    const dec = Math.max(0, digits - 1 - mag);
    return fmt(v, Math.min(dec, 6));
  };
  const SYMBOL = { USD: "US$", EUR: "€", GBP: "£", NGN: "₦", ZAR: "R", CNY: "¥", JPY: "¥", XOF: "CFA ", XAF: "FCFA ", KES: "KSh ", EGP: "E£", INR: "₹" };
  // Every pair is quoted against the cedi, both ways: 1 foreign unit in GH¢, and what GH¢1 buys.
  function tickerItem(c) {
    const x = rateFor(c.code);
    if (!x || !x.ghs) return "";
    const perUnits = x.ghs * c.unit;
    const cediBuys = 1 / x.ghs;
    const prev = (FXT.prev || {})[c.code];
    let change = "";
    if (prev && prev.ghs) {
      const pct = (x.ghs / prev.ghs - 1) * 100;
      if (Math.abs(pct) >= 0.005) change = `<i class="${pct > 0 ? "up" : "down"}" title="${pct > 0 ? "Cedi weaker" : "Cedi stronger"} than the previous day">${pct > 0 ? "▲" : "▼"}${Math.abs(pct).toFixed(2)}%</i>`;
    }
    return `<span class="t-item" title="${esc(c.name)} against the Ghana cedi"><span class="t-code">${esc(c.code)}/GHS</span><span class="t-name">${c.unit > 1 ? `${fmt(c.unit)} ` : "1 "}${esc(c.name)} =</span><b>GH¢${sig(perUnits, 4)}</b><span class="t-rev">GH¢1 = ${esc(SYMBOL[c.code] || "")}${sig(cediBuys, 4)}${SYMBOL[c.code] ? "" : " " + esc(c.code)}</span>${change}</span>`;
  }
  function cediItem(code, label) {
    const x = rateFor(code);
    if (!x || !x.ghs) return "";
    return `<span class="t-item"><span class="t-name">GH¢1 in ${esc(label)}</span><b>${esc(SYMBOL[code] || "")}${sig(1 / x.ghs, 4)}${SYMBOL[code] ? "" : " " + esc(code)}</b></span>`;
  }
  function renderTicker() {
    if (!tickerTrack || !D.fxTicker) return;
    const growth = allItems.find(i => i.label === "Real GDP growth");
    const perPerson = allItems.find(i => i.label === "Income per person");
    const gdpUsd = D.debt.nominalGdp / D.fx.usd;
    const cedi = [
      `<span class="t-item t-cedi"><span class="t-code">GHS</span><span class="t-name">Ghana cedi</span><b>GH¢1.00</b><span class="t-rev">base currency · 100 pesewas</span></span>`,
      cediItem("USD", "US dollars"), cediItem("EUR", "euros"), cediItem("GBP", "pounds"), cediItem("CNY", "yuan"),
      cediItem("NGN", "naira"), cediItem("XOF", "CFA francs"), cediItem("ZAR", "rand")
    ].join("");
    const gdp = [
      `<span class="t-item"><span class="t-name">Nominal GDP, ${Y} projection</span><b>GH¢${fmt(D.debt.nominalGdp / 1e12, 2)} trillion</b><span class="t-name">≈ US$${fmt(gdpUsd / 1e9, 1)}bn</span></span>`,
      growth ? `<span class="t-item"><span class="t-name">Real GDP growth</span><b>${fmt(growth.value, 1)}%</b><span class="t-name">${esc(growth.date)}</span></span>` : "",
      perPerson ? `<span class="t-item"><span class="t-name">GDP per person</span><b>US$${fmt(perPerson.value, 0)}</b><span class="t-name">${esc(perPerson.date || "")}</span></span>` : "",
      `<span class="t-item"><span class="t-name">Debt-to-GDP</span><b>${fmt(debtAt(Date.now()) / D.debt.nominalGdp * 100, 1)}%</b><span class="t-name">estimate</span></span>`
    ].join("");
    const world = D.fxTicker.world.map(tickerItem).join("");
    const africa = D.fxTicker.africa.map(tickerItem).join("");
    const copy = `<span class="ticker-copy"><span class="t-group t-group-cedi">Ghana cedi</span>${cedi}<span class="t-group">Ghana GDP</span>${gdp}<span class="t-group">Africa vs GH¢</span>${africa}<span class="t-group">World vs GH¢</span>${world}</span>`;
    const both = copy + copy.replace('class="ticker-copy"', 'class="ticker-copy" aria-hidden="true"');
    tickerTracks.forEach(tr => { if (tr.innerHTML !== both) tr.innerHTML = both; });
    $$("[data-fx-date]").forEach(el => (el.textContent = FXT.date ? isoDayLabel(FXT.date) : ""));
    sizeTickers();
  }
  $("ticker-pause").addEventListener("click", e => {
    const on = e.currentTarget.getAttribute("aria-pressed") !== "true";
    e.currentTarget.setAttribute("aria-pressed", String(on));
    e.currentTarget.setAttribute("aria-label", on ? "Play the ticker" : "Pause the ticker");
    tickerBox.classList.toggle("paused", on);
  });
  // On the live site, top up currencies the daily job has not stored (the browser fetch is skipped where blocked)
  async function refreshRates() {
    if (!/^https?:/.test(location.protocol)) return;
    try {
      const res = await fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json", { cache: "no-store" });
      if (!res.ok) return;
      const j = await res.json();
      const u = j && j.usd;
      if (!u || !u.ghs) return;
      const codes = [...D.fxTicker.world, ...D.fxTicker.africa].map(c => c.code);
      let added = false;
      FXT.rates = FXT.rates || {};
      codes.forEach(code => {
        const k = code.toLowerCase();
        const have = FXT.rates[code];
        if (u[k] && (!have || (have.src !== "BoG" && (!FXT.date || j.date >= FXT.date)))) {
          FXT.rates[code] = { ghs: u.ghs / u[k], src: "market" };
          added = true;
        }
      });
      if (added) { if (!FXT.date) FXT.date = j.date; renderTicker(); }
    } catch (e) { /* offline or blocked: keep the stored rates */ }
  }

  /* ================= views: dashboard / business news ================= */
  const newsView = $("news-view");
  function setView(view) {
    const news = view === "news";
    document.body.dataset.view = news ? "news" : "dashboard";
    newsView.hidden = !news;
    $$("[data-view-link]").forEach(a => (a.dataset.viewLink === (news ? "news" : "dashboard") ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current")));
    if (news) renderNews();
    fit();
  }
  function routeFromHash() {
    const h = location.hash.replace("#", "");
    if (h === "board") return;
    if (h === "news") { setView("news"); window.scrollTo(0, 0); }
    else if (h === "dashboard" || h === "" || document.body.dataset.view === "news") { setView("dashboard"); if (h === "dashboard") window.scrollTo(0, 0); }
  }
  window.addEventListener("hashchange", routeFromHash);

  /* ================= business news ================= */
  const TOPICS = [
    ["markets", "Cedi & markets", /cedi|forex|exchange rate|dollar|stock|\bgse\b|bond|treasury bill|t-bill|investor|market|shares|equit/i],
    ["banking", "Banking & finance", /bank|loan|credit|financ|fintech|insurance|mobile money|momo|payment|remittance|savings|microfinance|pension/i],
    ["energy", "Energy & oil", /\boil\b|\bgas\b|fuel|petrol|diesel|energy|power|electricity|\becg\b|goil|lpg|nuclear|solar|petroleum/i],
    ["agric", "Agriculture & cocoa", /cocoa|agric|farm|tomato|food|cashew|rice|poultry|fish|crop/i],
    ["trade", "Trade & industry", /trade|export|import|afcfta|\bport\b|industr|manufactur|\bsme|business|compan|retail|shop|mining|gold|juice|waste/i],
    ["policy", "Policy & economy", /\btax|budget|debt|\bimf\b|econom|inflation|\bgdp\b|policy|minister|government|revenue|levy|\bsoe|employment|jobs|regulat|road rules|traffic/i],
    ["tech", "Tech & telecom", /tech|digital|\bict\b|telecom|\bmtn\b|telecel|\bai\b|artificial|internet|startup|agentic|e-commerce/i]
  ];
  const topicsOf = item => TOPICS.filter(([, , re]) => re.test(item.title + " " + (item.summary || ""))).map(([k]) => k);
  const topicName = k => (TOPICS.find(t => t[0] === k) || [, k])[1];
  const newsState = { topic: "", source: "", q: "" };
  function timeAgo(iso) {
    const ms = Date.now() - Date.parse(iso);
    const min = Math.round(ms / 60000);
    if (min < 1) return "just now";
    if (min < 60) return `${min} min ago`;
    const h = Math.round(min / 60);
    if (h < 24) return `${h} hr${h === 1 ? "" : "s"} ago`;
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
  }
  function newsItems() {
    const N = window.GDC_NEWS || { items: [] };
    return (N.items || []).filter(i => i && i.title && i.link).map(i => ({ ...i, topics: topicsOf(i) })).sort((a, b) => (b.published || "").localeCompare(a.published || ""));
  }
  function renderNewsControls(items) {
    const counts = {};
    items.forEach(i => i.topics.forEach(k => (counts[k] = (counts[k] || 0) + 1)));
    $("news-topics").innerHTML = [["", "All", items.length], ...TOPICS.filter(([k]) => counts[k]).map(([k, name]) => [k, name, counts[k]])]
      .map(([k, name, n]) => `<button type="button" data-topic="${k}" aria-pressed="${newsState.topic === k}">${esc(name)}<small>${n}</small></button>`).join("");
    const sources = [...new Set(items.map(i => i.source))].sort();
    const sel = $("news-source");
    sel.innerHTML = `<option value="">All sources</option>` + sources.map(src => `<option value="${esc(src)}"${newsState.source === src ? " selected" : ""}>${esc(src)}</option>`).join("");
    $("rail-sources").innerHTML = sources.map(src => `<li>${esc(src)}<span>${items.filter(i => i.source === src).length}</span></li>`).join("");
  }
  function renderNews() {
    const N = window.GDC_NEWS || {};
    const items = newsItems();
    renderNewsControls(items);
    const q = newsState.q.trim().toLowerCase();
    const shown = items.filter(i => (!newsState.topic || i.topics.includes(newsState.topic)) && (!newsState.source || i.source === newsState.source) && (!q || (i.title + " " + (i.summary || "") + " " + i.source).toLowerCase().includes(q)));
    const leadAllowed = !newsState.topic && !newsState.source && !q;
    $("news-list").innerHTML = shown.map((i, idx) => {
      const fresh = Date.now() - Date.parse(i.published) < 3 * 3600e3;
      return `<article class="story${leadAllowed && idx === 0 ? " lead" : ""}">
        <div class="story-meta"><span class="src">${esc(i.source)}</span><time datetime="${esc(i.published)}"${fresh ? ' class="fresh"' : ""}>${esc(timeAgo(i.published))}</time></div>
        <h3><a href="${esc(i.link)}" target="_blank" rel="noopener">${esc(i.title)}</a></h3>
        ${i.summary ? `<p>${esc(i.summary)}</p>` : ""}
        ${i.topics.length ? `<div class="tags">${i.topics.slice(0, 2).map(k => `<span class="tag">${esc(topicName(k))}</span>`).join("")}</div>` : ""}
      </article>`;
    }).join("");
    $("news-list").hidden = !shown.length;
    $("news-empty").hidden = !!shown.length;
    $("news-status").textContent = N.updated
      ? `Updated ${timeAgo(N.updated)} · refreshes hourly`
      : `${N.sample || "Sample headlines"} · hourly updates start once the news job runs`;
    const recent = items.filter(i => Date.now() - Date.parse(i.published) < 24 * 3600e3).length;
    const badge = $("news-badge");
    badge.hidden = !recent;
    badge.textContent = recent;
    renderRail();
  }
  function renderRail() {
    const pick = [["US dollar", "US dollar"], ["Inflation", "Inflation"], ["BoG policy rate", "Policy rate"], ["91-day T-bill", "91-day T-bill"], ["Gold price", "Gold"], ["GSE Composite Index", "GSE index"], ["Petrol", "Petrol, per litre"]];
    $("rail-list").innerHTML = pick.map(([label, name]) => {
      const it = allItems.find(i => i.label === label);
      return it ? `<dt>${esc(name)}</dt><dd>${readValue(it).replace(/<[^>]+>/g, "")}<small>${esc(it.date || "")}</small></dd>` : "";
    }).join("");
  }
  $("news-topics").addEventListener("click", e => {
    const b = e.target.closest("button[data-topic]");
    if (!b) return;
    newsState.topic = b.dataset.topic;
    renderNews();
  });
  $("news-source").addEventListener("change", e => { newsState.source = e.target.value; renderNews(); });
  $("news-search").addEventListener("input", e => { newsState.q = e.target.value; renderNews(); });
  // refresh headlines every 10 minutes on the live site
  setInterval(() => {
    if (!/^https?:/.test(location.protocol)) { if (!newsView.hidden) renderNews(); return; }
    const before = (window.GDC_NEWS || {}).updated;
    const sc = document.createElement("script");
    sc.src = `news-data.js?t=${Date.now()}`;
    sc.onload = () => { sc.remove(); if ((window.GDC_NEWS || {}).updated !== before || !newsView.hidden) renderNews(); };
    sc.onerror = () => sc.remove();
    document.body.appendChild(sc);
  }, 10 * 60 * 1000);

  /* ================= charts ================= */
  const NS = "http://www.w3.org/2000/svg";
  const css = getComputedStyle(document.documentElement);
  const C = Object.fromEntries(["gold", "ember", "line", "line-2", "ink", "ink-2", "ink-3", "panel"].map(k => [k, css.getPropertyValue("--" + k).trim()]));
  const node = (name, attrs, parent) => {
    const n = document.createElementNS(NS, name);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };
  const label = (parent, x, y, str, attrs = {}) => {
    const t = node("text", { x, y, fill: C["ink-3"], "font-size": 11, ...attrs }, parent);
    t.textContent = str;
    return t;
  };
  function makeTip(fig) {
    const tip = document.createElement("div");
    tip.className = "tip"; tip.hidden = true; fig.appendChild(tip);
    return {
      show(svg, x, y, title, body) {
        const r = svg.getBoundingClientRect(), fr = fig.getBoundingClientRect(), vb = svg.viewBox.baseVal;
        tip.innerHTML = `<b>${esc(title)}</b>${esc(body)}`;
        tip.hidden = false;
        const half = tip.offsetWidth / 2;
        tip.style.left = Math.min(fr.width - half - 6, Math.max(half + 6, r.left - fr.left + x * r.width / vb.width)) + "px";
        tip.style.top = (r.top - fr.top + y * r.height / vb.height) + "px";
      },
      hide() { tip.hidden = true; }
    };
  }
  const hover = (target, on, off) => {
    target.addEventListener("pointerenter", on); target.addEventListener("pointerleave", off);
    target.addEventListener("focus", on); target.addEventListener("blur", off);
  };
  function sizeSvg(svg) {
    const W = Math.max(280, Math.round(svg.parentElement.clientWidth - 36));
    const H = W < 420 ? 220 : W > 900 ? 270 : 250;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.replaceChildren();
    return [W, H];
  }
  function observe(fig, draw) {
    let lastW = fig.clientWidth;
    new ResizeObserver(() => { if (Math.abs(fig.clientWidth - lastW) > 2) { lastW = fig.clientWidth; draw(); } }).observe(fig);
  }

  function barChart(figId, rows, { max, ticks, unit, valueText }) {
    const fig = $(figId), svg = fig.querySelector("svg"), tip = makeTip(fig);
    function draw() {
      const [W, H] = sizeSvg(svg);
      const M = { l: 40, r: 6, t: 26, b: 28 };
      const pw = W - M.l - M.r, ph = H - M.t - M.b;
      const y = v => M.t + ph - (v / max) * ph;
      const pat = node("pattern", { id: figId + "-h", width: 6, height: 6, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" }, node("defs", {}, svg));
      node("rect", { width: 6, height: 6, fill: C.panel }, pat);
      node("rect", { width: 2.5, height: 6, fill: C.gold }, pat);
      ticks.forEach(tv => {
        node("line", { x1: M.l, x2: W - M.r, y1: y(tv), y2: y(tv), stroke: tv === 0 ? C["line-2"] : C.line }, svg);
        label(svg, M.l - 8, y(tv) + 4, tv, { "text-anchor": "end" });
      });
      const band = pw / rows.length, bw = Math.min(40, band * 0.56);
      const peak = rows.reduce((a, r) => (r.v > a.v ? r : a), rows[0]);
      rows.forEach((r, i) => {
        const cx = M.l + band * (i + .5), top = y(r.v), base = y(0), x0 = cx - bw / 2, rad = Math.min(4, bw / 2);
        const d = `M${x0},${base}V${top + rad}Q${x0},${top} ${x0 + rad},${top}H${x0 + bw - rad}Q${x0 + bw},${top} ${x0 + bw},${top + rad}V${base}Z`;
        const bar = node("path", { d, fill: r.partial ? `url(#${figId}-h)` : C.gold, stroke: r.partial ? C.gold : "none", "stroke-width": 1 }, svg);
        label(svg, cx, H - 9, r.k, { "text-anchor": "middle", fill: C["ink-2"] });
        if (r === peak || i === rows.length - 1) label(svg, cx, top - 8, valueText(r.v), { "text-anchor": "middle", fill: C.ink, "font-size": 11.5, "font-weight": 600 });
        const hit = node("rect", { x: M.l + band * i, y: M.t - 16, width: band, height: ph + 16, fill: "transparent", tabindex: 0, role: "img", "aria-label": `${r.label}: ${valueText(r.v)} ${unit}` }, svg);
        hover(hit, () => { bar.setAttribute("opacity", ".78"); tip.show(svg, cx, top, r.label, `${valueText(r.v)} ${unit}`); },
                   () => { bar.setAttribute("opacity", "1"); tip.hide(); });
      });
    }
    draw();
    observe(fig, draw);
  }
  barChart("ch-stock", D.history.map(h => ({ k: h.k, label: h.label, v: h.debt, partial: h.partial })),
    { max: 820, ticks: [0, 200, 400, 600, 800], unit: "billion cedis", valueText: v => "GH¢" + fmt(v, 1) + "bn" });
  barChart("ch-ratio", D.history.map(h => ({ k: h.k, label: h.label, v: h.ratio, partial: h.partial })),
    { max: 90, ticks: [0, 20, 40, 60, 80], unit: "of GDP", valueText: v => fmt(v, 1) + "%" });

  (function monthChart() {
    const fig = $("ch-month"), svg = fig.querySelector("svg"), tip = makeTip(fig);
    const pts = D.monthly.map(m => ({ t: Date.parse(m.date + "T00:00:00Z"), v: m.debt, label: m.label + " month-end" }));
    function draw() {
      const now = Date.now(), est = debtAt(now) / 1e9;
      const [W, H] = sizeSvg(svg);
      const M = { l: 40, r: 12, t: 30, b: 28 };
      const pw = W - M.l - M.r, ph = H - M.t - M.b;
      const all = [...pts, { t: now, v: est, label: "Today, our estimate", est: true }];
      const t0 = pts[0].t, t1 = Math.max(now, Date.UTC(Y, 11, 31));
      const lo = Math.floor(Math.min(...all.map(p => p.v)) / 40) * 40 - 20;
      const hi = Math.ceil(Math.max(...all.map(p => p.v)) / 40) * 40 + 20;
      const x = t => M.l + 8 + ((t - t0) / (t1 - t0)) * (pw - 8);
      const y = v => M.t + ph - ((v - lo) / (hi - lo)) * ph;
      for (let tv = Math.ceil(lo / 40) * 40; tv <= hi; tv += 40) {
        node("line", { x1: M.l, x2: W - M.r, y1: y(tv), y2: y(tv), stroke: C.line }, svg);
        label(svg, M.l - 8, y(tv) + 4, tv, { "text-anchor": "end" });
      }
      const step = W < 560 ? 3 : 1;
      ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].forEach((m, i) => {
        if (!(i % step)) label(svg, x(Date.UTC(Y, i, 1)), H - 9, m, { "text-anchor": "middle", fill: C["ink-2"] });
      });
      node("line", { x1: x(now), x2: x(now), y1: M.t - 6, y2: M.t + ph, stroke: C["line-2"], "stroke-dasharray": "2 3" }, svg);
      const grad = node("linearGradient", { id: "mg", x1: 0, x2: 0, y1: 0, y2: 1 }, node("defs", {}, svg));
      node("stop", { offset: "0", "stop-color": C.gold, "stop-opacity": .2 }, grad);
      node("stop", { offset: "1", "stop-color": C.gold, "stop-opacity": 0 }, grad);
      const line = pts.map((p, i) => `${i ? "L" : "M"}${x(p.t).toFixed(1)},${y(p.v).toFixed(1)}`).join("");
      const last = pts[pts.length - 1];
      node("path", { d: `${line}L${x(last.t)},${M.t + ph}L${x(pts[0].t)},${M.t + ph}Z`, fill: "url(#mg)" }, svg);
      node("path", { d: `M${x(last.t)},${y(last.v)}L${x(now)},${y(est)}`, stroke: C.ember, "stroke-width": 2, "stroke-dasharray": "5 5", fill: "none" }, svg);
      node("path", { d: line, stroke: C.gold, "stroke-width": 2, fill: "none", "stroke-linejoin": "round", "stroke-linecap": "round" }, svg);
      const nx = x(now), ny = y(est), right = nx > W - 170;
      label(svg, right ? nx - 10 : nx + 10, ny - 10, `≈ GH¢${fmt(est, 1)}bn today`, { "text-anchor": right ? "end" : "start", fill: C.ink, "font-size": 12, "font-weight": 600 });
      all.forEach((p, i) => {
        const cx = x(p.t), cy = y(p.v);
        const dot = node("circle", { cx, cy, r: 4, fill: p.est ? C.ember : C.gold, stroke: C.panel, "stroke-width": 2 }, svg);
        const prev = i ? x(all[i - 1].t) : cx - 16, next = i < all.length - 1 ? x(all[i + 1].t) : cx + 16;
        const hx = (prev + cx) / 2, hw = (next + cx) / 2 - hx;
        const hit = node("rect", { x: hx, y: M.t - 10, width: Math.max(8, hw), height: ph + 10, fill: "transparent", tabindex: 0, role: "img", "aria-label": `${p.label}: GH¢${fmt(p.v, 1)} billion` }, svg);
        hover(hit, () => { dot.setAttribute("r", 6); tip.show(svg, cx, cy, p.label, `GH¢${fmt(p.v, 1)}bn`); },
                   () => { dot.setAttribute("r", 4); tip.hide(); });
      });
    }
    draw();
    observe(fig, draw);
  })();

  function drawSpark() {
    const svg = $("b-spark");
    svg.replaceChildren();
    const W = 620, H = 120, M = { l: 4, r: 4, t: 22, b: 20 };
    const rows = [...D.history.filter(h => !h.partial).map(h => ({ k: h.k, v: h.debt })), { k: "Today", v: debtAt(Date.now()) / 1e9, now: true }];
    const max = Math.max(...rows.map(r => r.v)) * 1.08;
    const band = (W - M.l - M.r) / rows.length, bw = band * 0.5, ph = H - M.t - M.b;
    rows.forEach((r, i) => {
      const cx = M.l + band * (i + .5), h = r.v / max * ph, top = M.t + ph - h;
      node("rect", { x: cx - bw / 2, y: top, width: bw, height: h, rx: 3, fill: r.now ? C.ember : C.gold, opacity: r.now ? 1 : .85 }, svg);
      label(svg, cx, H - 4, r.k, { "text-anchor": "middle", "font-size": 13, fill: r.now ? C.ink : C["ink-3"] });
      label(svg, cx, top - 6, fmt(r.v, 0), { "text-anchor": "middle", "font-size": 12.5, fill: r.now ? C.ink : C["ink-2"], "font-weight": r.now ? 600 : 400 });
    });
  }

  // cedi: dots on dates with a published interbank rate (no line, so nothing is implied between them)
  (function cediChart() {
    const fig = $("ch-cedi"), svg = fig.querySelector("svg"), tip = makeTip(fig);
    const pts = D.cedi.map(c => ({ t: Date.parse(c.date + "T00:00:00Z"), v: c.rate, label: c.label, auto: !!c.auto }));
    function draw() {
      const [W, H] = sizeSvg(svg);
      const M = { l: 44, r: 16, t: 30, b: 28 };
      const pw = W - M.l - M.r, ph = H - M.t - M.b;
      const t0 = Date.UTC(Y - 1, 11, 1), t1 = Date.UTC(Y, 11, 31);
      const vals = pts.map(p => p.v);
      const lo = Math.floor(Math.min(...vals) * 2) / 2 - 0.5, hi = Math.ceil(Math.max(...vals) * 2) / 2 + 0.5;
      const x = t => M.l + ((t - t0) / (t1 - t0)) * pw;
      const y = v => M.t + ph - ((v - lo) / (hi - lo)) * ph;
      for (let tv = Math.ceil(lo * 2) / 2; tv <= hi + 1e-9; tv += 0.5) {
        node("line", { x1: M.l, x2: W - M.r, y1: y(tv), y2: y(tv), stroke: C.line }, svg);
        label(svg, M.l - 8, y(tv) + 4, fmt(tv, 1), { "text-anchor": "end" });
      }
      const step = W < 560 ? 3 : 2;
      ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].forEach((m, i) => {
        if (!(i % step)) label(svg, x(Date.UTC(Y, i, 1)), H - 9, m, { "text-anchor": "middle", fill: C["ink-2"] });
      });
      if (pts.length > 12) {
        let d = "";
        pts.forEach((p, i) => { const gap = i && p.t - pts[i - 1].t > 8 * DAY * SEC; d += `${!i || gap ? "M" : "L"}${x(p.t).toFixed(1)},${y(p.v).toFixed(1)}`; });
        node("path", { d, stroke: C.gold, "stroke-width": 1.5, fill: "none", opacity: .8 }, svg);
      }
      const baseY = y(pts[0].v);
      node("line", { x1: M.l, x2: W - M.r, y1: baseY, y2: baseY, stroke: C["ink-3"], "stroke-dasharray": "3 4" }, svg);
      label(svg, W - M.r, baseY + 14, `end-2025 level`, { "text-anchor": "end", "font-size": 10.5 });
      pts.forEach((p, i) => {
        const cx = x(p.t), cy = y(p.v), last = i === pts.length - 1;
        const small = pts.length > 12 && p.auto && !last;
        const dot = node("circle", { cx, cy, r: small ? 2 : 5, fill: i === 0 ? C["ink-2"] : C.gold, stroke: C.panel, "stroke-width": small ? 0 : 2 }, svg);
        if (i === 0 || last || p.v === Math.max(...vals)) {
          label(svg, cx + (last ? 6 : 8), cy - (last ? 14 : 10), last ? `${p.label}: GH¢${fmt(p.v, 2)}` : `GH¢${fmt(p.v, 2)}`, { "text-anchor": last ? "end" : "start", fill: C.ink, "font-size": 11.5, "font-weight": 600, stroke: C.panel, "stroke-width": 3, "paint-order": "stroke" });
        }
        const hit = node("circle", { cx, cy, r: small ? 6 : 16, fill: "transparent", tabindex: 0, role: "img", "aria-label": `${p.label}: GH¢${fmt(p.v, 2)} per US dollar` }, svg);
        hover(hit, () => { dot.setAttribute("r", 7); tip.show(svg, cx, cy, p.label, `GH¢${fmt(p.v, 2)} per US$`); },
                   () => { dot.setAttribute("r", small ? 2 : 5); tip.hide(); });
      });
    }
    draw();
    observe(fig, draw);
  })();

  // board: the readout strip alternates between economy and markets
  let boardPage = 0;
  setInterval(() => {
    const pages = $$(".b-page");
    if (!pages.length || board.hidden || !sheetEl.hidden) return;
    boardPage = (boardPage + 1) % pages.length;
    pages.forEach((p, i) => p.classList.toggle("on", i === boardPage));
  }, 12000);

  /* ================= start ================= */
  paintMoney();
  tick();
  fit();
  if (location.hash === "#board") openBoard(false);
  routeFromHash();
  renderNews();
  refreshRates();
  setInterval(refreshRates, 30 * 60 * 1000);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { fit(); if (!board.hidden) fit(board); });
  let resizeTimer;
  window.addEventListener("resize", () => {
    if (!board.hidden) scaleStage();
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => fit(), 150);
  });
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  setInterval(tick, reduce ? 1000 : 100);
})();

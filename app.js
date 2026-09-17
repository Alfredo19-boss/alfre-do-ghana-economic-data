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
          <div class="cell stat tappable${staleDays(it) ? " is-stale" : ""}" data-detail="read:${readKey(it)}" data-label="${esc(it.label)}">
            <div class="stat-top"><span class="k">${esc(it.label)}</span>${chipFor(it)}</div>
            <span class="mono"${it.live ? ` data-calc="${it.live}"` : ""}>${readValue(it)}</span>
            <span class="market-line" data-market="${esc(it.label)}" data-official="${esc(readValue(it).replace(/<[^>]+>/g, ""))}" data-officialdate="${esc(it.date || "")}" data-officialsrc="${esc(it.autoSource || "")}" hidden></span>
            ${it.sourceNewer ? `<span class="source-newer">${fmt(it.sourceNewer.value, 1)}${esc(it.unit || "")} <small>${esc(it.sourceNewer.source)} · ${esc(it.sourceNewer.date)}</small></span>` : ""}
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

  const readHtml = it => `<div class="b-read tappable${staleDays(it) ? " is-stale" : ""}" data-detail="read:${readKey(it)}" data-bread="${esc(it.label)}"><span class="b-label">${esc(it.label)}</span><span class="mono">${readValue(it)}</span><span class="date">${esc(it.date || "")}${staleDays(it) ? " · update due" : ""}</span></div>`;
  // Twelve readings to a panel. The ones marked board:true in data.js lead, in the order they
  // are written there; if fewer than twelve carry the mark, the next readings from the same
  // section fill the panel out rather than leaving it short. Nothing is invented to fill a
  // gap — a reading with no value is skipped.
  const BOARD_PER_PAGE = 12;
  const boardPanel = list => {
    const on = list.filter(i => i.board);
    if (on.length >= BOARD_PER_PAGE) return on.slice(0, BOARD_PER_PAGE);
    const rest = list.filter(i => !i.board && i.value !== undefined && i.value !== null && isFinite(i.value));
    return [...on, ...rest.slice(0, BOARD_PER_PAGE - on.length)];
  };
  const boardPages = [
    boardPanel([...D.economy.flatMap(g => g.items), ...D.people]),
    boardPanel(D.markets.flatMap(g => g.items))
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
      $("data-status-text").innerHTML = issues.map(t => `<li>${esc(t.charAt(0).toUpperCase() + t.slice(1))}.</li>`).join("")
        + `<li><a href="#status">See what is arriving and what is late</a>.</li>`;
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
        ${e.entry.kind === "holiday" ? GH_FLAG.replace("gh-flag", "gh-flag band-flag") : ""}
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


  // the flag of Ghana, star and all
  const GH_FLAG = `<svg class="gh-flag" viewBox="0 0 30 20" role="img" aria-label="Flag of Ghana">
      <rect width="30" height="6.667" fill="#ce1126"/>
      <rect y="6.667" width="30" height="6.666" fill="#fcd116"/>
      <rect y="13.333" width="30" height="6.667" fill="#006b3f"/>
      <polygon fill="#000" points="15.00,6.20 15.85,8.83 18.61,8.83 16.38,10.45 17.23,13.07 15.00,11.45 12.77,13.07 13.62,10.45 11.39,8.83 14.15,8.83"/>
    </svg>`;

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
  const HIST_ALIAS = {
    "Trade surplus": "balance", "Nominal GDP": "gdp", "Remittances": "Remittances",
    "Oil exports": "oil", "Jubilee oil output": "oil",
    "Gold exports": "metals", "Cocoa exports": "foodex",
    "Bank lending growth": "Private credit growth",
    "Real interest rate": "realrate"
  };
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

    // a country on the Africa inflation board
    if (type === "africa") {
      const A = africaData();
      const c = A && A.countries ? A.countries[id] : null;
      if (!c || !c.latest) return null;
      const gh = A.countries.GHA;
      const pc = { unit: "%", dec: 1 };
      const list = Object.values(A.countries).filter(x => x.latest).map(x => x.latest.value).sort((a, b) => a - b);
      const place = list.length - list.indexOf(c.latest.value);
      const diff = c.latest.value - gh.latest.value;
      const move = typeof c.prev === "number" ? c.latest.value - c.prev : null;
      const points = (c.series || []).map(p => ({ date: p.date, value: p.value }));
      return {
        eyebrow: `African inflation · ${esc(c.region || "")}`,
        title: c.name,
        body: `
          <div class="facts">
            ${factRow("Inflation", `${fmt(c.latest.value, 1)}<span class="u">%</span>`)}
            ${factRow("As of", esc(c.latest.period || ""))}
            ${typeof c.prev === "number" ? factRow("Month before", `${fmt(c.prev, 1)}% · ${move > 0 ? "up" : move < 0 ? "down" : "unchanged"}${move ? ` ${fmt(Math.abs(move), 1)} pts` : ""}`) : ""}
            ${factRow("Against Ghana", id === "GHA" ? "—" : `${diff > 0 ? "+" : ""}${fmt(diff, 1)} pts (Ghana ${fmt(gh.latest.value, 1)}%)`)}
            ${factRow("Rank in Africa", `${ordinal(place)} highest of ${list.length}`)}
            ${c.gdp ? factRow("Size of the economy", `US$${fmt(c.gdp.value, c.gdp.value < 10 ? 1 : 0)}bn <span class="u">${esc(c.gdp.year)}</span>`) : ""}
            ${c.gdp && A.countries.GHA && A.countries.GHA.gdp ? factRow("Against Ghana's economy", id === "GHA" ? "—" : `${fmt(c.gdp.value / A.countries.GHA.gdp.value, c.gdp.value / A.countries.GHA.gdp.value < 1 ? 2 : 1)}×`) : ""}
          </div>
          ${points.length > 2 ? sheetSection("Recent months, %", sheetChart(points, pc)) : ""}
          ${points.length > 1 ? sheetSection("Readings", sheetTable(points, pc)) : `<div class="sheet-empty"><b>One reading so far.</b><p>This board keeps every month it collects, so ${esc(c.name)} will build a run of readings from here.</p></div>`}
          <p class="sheet-src">${esc(A.note || "")}</p>`
      };
    }

    // an instrument on the Global markets board
    if (type === "market") {
      const M = marketsData();
      const world = (M && M.world) || {};
      let q = null, groupKey = "";
      for (const [key, list] of Object.entries(world)) {
        const hit = (list || []).find(x => x && x.symbol === id);
        if (hit) { q = hit; groupKey = key; break; }
      }
      if (!q) return null;
      const u = { unit: q.unit || "", dec: q.dec ?? 2, pre: /^US\$|^GH\u00a2/.test(q.unit || "") };
      const points = (Array.isArray(q.history) ? q.history : []).map(p => ({ date: p.date, value: p.value }));
      const first = points[0], last = points[points.length - 1];
      const overall = first && last ? last.value - first.value : null;
      const shown = v => `${u.pre ? esc((q.unit || "").split("/")[0]) : ""}${fmt(v, u.dec)}${u.pre ? "" : `<span class="u">${esc(q.unit || "")}</span>`}`;
      return {
        eyebrow: `Global markets \u00b7 ${esc((GROUP_TITLES[groupKey] || [""])[0])}`,
        title: q.name,
        body: `
          <div class="facts">
            ${factRow("Last price", shown(q.value))}
            ${factRow("Quoted", esc(quoteTime(q.at)))}
            ${q.prev != null ? factRow("Previous close", shown(q.prev)) : ""}
            ${q.pct != null ? factRow("Move on the day", `${q.pct > 0 ? "+" : ""}${fmt(q.pct, 2)}%${q.change == null ? "" : ` (${q.change > 0 ? "+" : ""}${fmt(q.change, Math.abs(q.change) < 10 ? 2 : 0)})`}`) : ""}
            ${overall != null && points.length > 2 ? factRow(`Since ${esc(first.date)}`, `${overall > 0 ? "+" : ""}${fmt(overall, u.dec)}${first.value ? ` (${overall > 0 ? "+" : ""}${fmt(overall / first.value * 100, 1)}%)` : ""}`) : ""}
            ${factRow("Symbol", esc(q.symbol))}
          </div>
          ${points.length > 2
            ? sheetSection(`Since ${esc(first.date)}`, sheetChart(points, u) + sheetTable(points.slice(-30), u)) + sheetSection("Trend", trendHtml(analyse(points, u)))
            : `<div class="sheet-empty"><b>The trend is still being built.</b><p>This site keeps one closing price a day for every instrument, starting from the first time the job saw one. ${points.length ? `There ${points.length === 1 ? "is one point" : `are ${points.length} points`} so far` : "There are no points yet"} \u2014 the line fills in from here.</p></div>`}
          <p class="sheet-src">${esc((M && M.note) || "")}</p>`
      };
    }

    if (type === "read") {
      const it = READS.get(id);
      if (!it) return null;
      const u = unitBits(it);
      const points = seriesOf(it);
      const age = staleDays(it);
      const nowQ = liveFor(it.label);
      const facts = [
        nowQ ? factRow("Market, right now", `${nowQ.key === "gold" ? `US$${fmt(nowQ.value, 0)}` : `GH¢${fmt(nowQ.value, 4)}`} <span class="u">${esc(liveTime(nowQ.at))}</span>`) : "",
        factRow(nowQ ? "Official reading" : "Latest reading", showVal(it.value, u)),
        factRow("Period", esc(it.date || "—")),
        it.sourceNewer ? factRow("A newer figure exists", `${fmt(it.sourceNewer.value, 1)}${esc(it.unit || "")} · ${esc(it.sourceNewer.source)}, ${esc(it.sourceNewer.date)}`) : "",
        it.autoSource ? factRow("Updated", "Automatically, every morning") : "",
        age ? factRow("Age", `${age} days old · update due`) : ""
      ].join("");
      return {
        eyebrow: "Indicator",
        title: it.label,
        body: `
          <div class="facts">${facts}</div>
          ${it.sourceNewer ? `<p class="sheet-note">The figure above is the one Ghana's own statistics office last published. ${esc(it.sourceNewer.source)} has a newer estimate for ${esc(it.sourceNewer.date)} — it is measured differently, so it sits alongside rather than replacing it, until a person checks the official release.</p>` : ""}
          ${nowQ ? `<p class="sheet-note">The market quote is taken every 20 minutes and carries the minute it was taken. The daily reading is ${esc(it.autoSource || "the published rate")}, checked each morning and dated ${esc(it.date || "—")} — published rates are for the previous business day, so that date is normally a day or more behind today.${/bank of ghana/i.test(it.autoSource || "") ? "" : " The Bank of Ghana's own page did not yield a rate, so this is a market mid-rate standing in for it, not an official figure."} It is the figure the rest of this page counts with.</p>` : ""}
          ${it.note ? `<p class="sheet-note">${toneNote(it.note, it.tone)}</p>` : ""}
          ${points.length > 1
            ? sheetSection("History", sheetChart(points, u) + sheetTable(points, u)) + sheetSection("Trend", trendHtml(analyse(points, u)))
            : `<div class="sheet-empty"><b>No history recorded yet.</b><p>This figure has one published reading so far. Every time it is updated — automatically each morning for market prices, or through the update form for published figures — the old reading is kept here, so the chart and trend build up from now on.</p></div>`}
          ${it.seriesSource ? `<p class="sheet-src">History from ${esc(it.seriesSource)}.</p>` : ""}
          ${longHistory(it.label) || `<p class="sheet-src">No annual run back to 1993 is published anywhere for this figure, so there is no long chart to show. Its history here builds from the readings this site records, one per release.</p>`}`
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
          ${longHistory({ rev: "revenue", tax: "tax", int: "govdebt" }[id] || "")}
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
            <p class="sheet-src">The live figure divides the debt estimate by the ${Y} nominal GDP projection of ${short(D.debt.nominalGdp)}.</p>
            ${longHistory("govdebt")}`
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
    renderBoardDeck();
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
  // Market quotes taken through the day (live-data.js, every 20 minutes). The Bank of Ghana's
  // interbank rate stays the official figure; this is what the market is quoting right now.
  const liveData = () => window.GDC_LIVE || null;
  const LIVE_MAX_AGE = 8 * 3600e3;          // older than this and it is not "now" any more
  function liveQuotes() {
    const LV = liveData();
    if (!LV || !LV.quotes) return [];
    return Object.entries(LV.quotes)
      .filter(([, q]) => q && typeof q.value === "number" && q.at && Date.now() - Date.parse(q.at) < LIVE_MAX_AGE)
      .map(([key, q]) => ({ key, ...q }));
  }
  const LIVE_LABELS = { "US dollar": "usd", "British pound": "gbp", "Euro": "eur", "Chinese yuan": "cny", "Gold price": "gold" };
  const liveFor = label => liveQuotes().find(q => q.key === LIVE_LABELS[label]) || null;
  const liveTime = iso => new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" }) + " GMT";
  // The Bank of Ghana's own interbank rate, read straight from their daily page every twenty
  // minutes by the live-rates job. This is the dashboard's headline figure.
  const BOG_KEYS = { "US dollar": "usd", "British pound": "gbp", "Euro": "eur" };
  const BOG_MAX_AGE = 7 * 864e5;            // a BoG reading older than a week is not "the rate"
  function bogFor(label) {
    const LV = liveData();
    const o = LV && LV.official;
    const key = BOG_KEYS[label];
    if (!o || !key || !o.date || !o.rates || !o.rates[key] || typeof o.rates[key].value !== "number") return null;
    if (Date.now() - Date.parse(`${o.date}T00:00:00Z`) > BOG_MAX_AGE) return null;
    return { value: o.rates[key].value, date: o.date, source: o.source || "Bank of Ghana interbank mid-rate" };
  }
  // Both rates, one above the other, official on top. The Bank of Ghana's interbank rate is
  // the figure in the big type — it is the rate the rest of the page counts with, and the one
  // people mean by "the rate". It carries BoG's own date, taken from the same row the number
  // came from, so the headline figure and its date can never drift apart. The market quote
  // sits under it with the minute it was taken, so the card never implies BoG publishes by
  // the minute. Gold has no official rate and keeps the market price on top.
  function paintMarketLines() {
    $$("[data-market]").forEach(el => {
      const cell = el.closest(".stat");
      const mono = cell && cell.querySelector(".mono");
      if (mono && mono.dataset.base === undefined) mono.dataset.base = mono.innerHTML;
      const label = el.dataset.market;
      const q = liveFor(label);
      const bog = bogFor(label);

      // What the published reading says, and where it came from. BoG's live page wins when it
      // has one, because it is read every twenty minutes rather than once a morning.
      let off = el.dataset.official || "", when = el.dataset.officialdate || "", src = el.dataset.officialsrc || "";
      if (bog) { off = `GH¢${fmt(bog.value, 4)}`; when = dateFmt(`${bog.date}T00:00:00Z`); src = bog.source; }

      // Name the daily figure for what it actually is. When the Bank of Ghana's own page has
      // not yielded a rate the site falls back to a market mid-rate, and saying "official"
      // there would put BoG's name on somebody else's number.
      const kind = label === "Gold price" ? "daily close"
        : /bank of ghana/i.test(src) ? "BoG official"
        : /currency-api|market mid/i.test(src) ? "market mid-rate"
        : "daily rate";

      // Only the three currencies BoG actually publishes lead with the official figure. Every
      // other reading on the page keeps exactly the behaviour it had: it shows a second line
      // only when there is a live quote to put on it, and stays silent otherwise.
      const officialLeads = !!bog;

      if (!q && !officialLeads) {
        if (mono && mono.dataset.base !== undefined) mono.innerHTML = mono.dataset.base;
        el.hidden = true;
        return;
      }

      const dir = q && typeof q.prev === "number" ? (q.value > q.prev ? "up" : q.value < q.prev ? "down" : "") : "";
      const arrow = dir ? `<i class="t-arrow ${dir}">${dir === "up" ? "▲" : "▼"}</i>` : "";
      const shown = q ? (q.key === "gold" ? `US$${fmt(q.value, 0)}` : `GH¢${fmt(q.value, 4)}`) : "";

      if (officialLeads) {
        if (mono) mono.innerHTML = off;
        // The date chip in the corner is built from data.js when the page loads. BoG's page is
        // read every twenty minutes and is the figure now in the big type, so the chip has to
        // carry BoG's date too — otherwise the card shows one number and two different days,
        // which is exactly the inconsistency this replaces. A fresh BoG reading also clears
        // any "update due" mark, because the reading is no longer old.
        if (cell) {
          cell.classList.remove("is-stale");
          const chip = cell.querySelector(".stat-top .date, .stat-top .chip");
          if (chip && when) { chip.className = "date auto"; chip.textContent = when; chip.removeAttribute("title"); }
        }
        el.innerHTML = `<span class="at">${esc(kind)}${when ? ` · ${esc(when)}` : ""}</span>`
          + (q ? `<b class="official">${shown}${arrow}</b><span>market · ${esc(liveTime(q.at))}</span>` : "");
      } else {
        if (mono) mono.innerHTML = `${shown}${arrow}`;
        el.innerHTML = `<span class="at">market · ${esc(liveTime(q.at))}</span>`
          + (off ? `<b class="official">${esc(off)}</b><span>${esc(kind)}${when ? ` · ${esc(when)}` : ""}</span>` : "");
      }
      el.hidden = false;
    });

    // The board view carries the same three currencies in its own compact rows. They are built
    // from data.js, so without this they would keep showing the morning job's figure while the
    // card beside them showed BoG's — the same number with two different days on it.
    Object.keys(BOG_KEYS).forEach(label => {
      const bog = bogFor(label);
      if (!bog) return;
      $$(`[data-bread="${label.replace(/"/g, "")}"]`).forEach(row => {
        const mono = row.querySelector(".mono");
        const date = row.querySelector(".date");
        if (mono) mono.innerHTML = `<span class="p">GH¢</span>${fmt(bog.value, 4)}`;
        if (date) date.textContent = dateFmt(`${bog.date}T00:00:00Z`);
        row.classList.remove("is-stale");
      });
    });
  }

  function liveGroup() {
    const qs = liveQuotes();
    if (!qs.length) return "";
    const items = qs.map(q => {
      const dir = typeof q.prev === "number" ? (q.value > q.prev ? "up" : q.value < q.prev ? "down" : "") : "";
      const shown = q.key === "gold" ? `US$${fmt(q.value, 0)}` : `GH¢${fmt(q.value, 4)}`;
      const name = q.key === "gold" ? "Gold, an ounce" : `${q.name} in cedis`;
      return `<span class="t-item t-live"><span class="t-name">${esc(name)}</span><b class="${dir}">${shown}${dir ? `<i class="t-arrow">${dir === "up" ? "▲" : "▼"}</i>` : ""}</b><span class="t-rev">${esc(liveTime(q.at))}</span></span>`;
    }).join("");
    return `<span class="t-group t-group-live">Market, right now</span>${items}`;
  }

  function renderTicker() {
    if (!tickerTrack || !D.fxTicker) return;
    const growth = allItems.find(i => i.label === "Real GDP growth");
    const perPerson = allItems.find(i => i.label === "Income per person");
    const gdpUsd = D.debt.nominalGdp / D.fx.usd;
    const live = liveGroup();
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
    const copy = `<span class="ticker-copy">${live}<span class="t-group t-group-cedi">Ghana cedi</span>${cedi}<span class="t-group">Ghana GDP</span>${gdp}<span class="t-group">Africa vs GH¢</span>${africa}<span class="t-group">World vs GH¢</span>${world}</span>`;
    const both = copy + copy.replace('class="ticker-copy"', 'class="ticker-copy" aria-hidden="true"');
    tickerTracks.forEach(tr => { if (tr.innerHTML !== both) tr.innerHTML = both; });
    // The strip carries two vintages at once: live market quotes stamped with the minute they
    // were taken, and the daily table, which is published for the previous business day. One
    // bare date beside both reads as though everything is that old, so the label says which
    // is which whenever a live quote is present.
    const liveNow = liveQuotes();
    const newestLive = liveNow.length ? liveNow.map(q => Date.parse(q.at)).sort((a, b) => b - a)[0] : null;
    $$("[data-fx-date]").forEach(el => {
      const daily = FXT.date ? isoDayLabel(FXT.date) : "";
      el.textContent = newestLive
        ? `market ${liveTime(new Date(newestLive).toISOString())} · daily table ${daily}`
        : daily;
    });
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

  /* ================= views: dashboard, news, Africa, papers, briefings ================= */
  const newsView = $("news-view");
  const VIEWS = {
    dashboard: { el: $("dashboard-view") },
    news: { el: newsView, draw: () => renderNews() },
    africa: { el: $("africa-view"), draw: () => renderAfrica() },
    markets: { el: $("markets-view"), draw: () => { renderMarkets(); renderGse(); } },
    world: { el: $("world-view"), draw: () => renderWorld() },
    charts: { el: $("charts-view"), draw: () => renderCharts() },
    papers: { el: $("papers-view"), draw: () => renderPapers() },
    articles: { el: $("articles-view"), draw: () => renderArticles() },
    status: { el: $("status-view"), draw: () => renderStatus() }
  };
  let drawn = {};
  function setView(view) {
    if (!VIEWS[view]) view = "dashboard";
    document.body.dataset.view = view;
    Object.entries(VIEWS).forEach(([name, v]) => { if (v.el) v.el.hidden = name !== view; });
    $$("[data-view-link]").forEach(a => (a.dataset.viewLink === view ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current")));
    const v = VIEWS[view];
    if (v.draw && (!drawn[view] || ["news", "status", "markets", "world"].includes(view))) { v.draw(); drawn[view] = true; }
    fit();
  }
  function routeFromHash() {
    const h = location.hash.replace("#", "");
    if (h === "board") return;
    const view = VIEWS[h] ? h : "dashboard";
    if (view !== document.body.dataset.view) { setView(view); window.scrollTo(0, 0); }
    else if (h === "dashboard") window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", routeFromHash);

  /* ================= Ghana in pictures: the charts portal ================= */
  // One measure per chart, one axis, thin marks, recessive grid. The four series colours
  // are a validated categorical set (blue, orange, aqua, yellow) checked for colour-blind
  // separation against this page's dark surface; text stays in the ink tokens.
  // The categorical palette, checked for colour-blind separation against this dark surface.
  // Hues are assigned in this fixed order and never cycled: a chart that would need a fifth
  // series is split in two instead.
  const SERIES = ["#3987e5", "#d95926", "#199e70", "#c98500"];
  const chartsData = () => ({ H: HIST, A: window.GDC_AUTO || {}, AF: africaData() });

  const niceTop = max => {
    const pow = Math.pow(10, Math.floor(Math.log10(Math.abs(max) || 1)));
    return Math.ceil(max / (pow / 2)) * (pow / 2);
  };
  const axisFmt = (v, dec) => (Math.abs(v) >= 1000 ? fmt(v, 0) : fmt(v, dec ?? (Math.abs(v) < 10 ? 1 : 0)));
  const showAt = (v, o) => `${o.pre || ""}${axisFmt(v, o.dec)}${o.unit || ""}`;

  // Axis labels, shortened to suit the span. Slicing the last four characters off every label
  // turns a run of months into a row of identical years, and an ISO date into nonsense, so the
  // shape of the labels decides what is shown.
  const MON_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function axisTicks(labels) {
    const strs = labels.map(l => String(l));
    const years = new Set(strs.map(l => (l.match(/(19|20)\d{2}/) || [])[0]).filter(Boolean));
    const manyYears = years.size > 1;
    return strs.map(l => {
      const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(l);
      if (iso) return manyYears ? `${MON_SHORT[+iso[2] - 1]} ${iso[1].slice(2)}` : `${+iso[3]} ${MON_SHORT[+iso[2] - 1]}`;
      const mon = /^([A-Za-z]{3})[a-z]*\s+((19|20)\d{2})$/.exec(l);
      if (mon) return manyYears ? `${mon[1]} ${mon[2].slice(2)}` : mon[1];
      const yr = /^((19|20)\d{2})$/.exec(l.trim());
      if (yr) return yr[1];
      return l.length > 9 ? l.slice(-8) : l;          // anything else: keep it short
    });
  }

  // Every chart returns its picture AND the numbers behind it, so the same payload can feed
  // the read-out under the pointer, the table view and the CSV download. One source, three uses.
  function chartData(cols, rows, colors, opts) {
    return { cols, rows, colors, unit: opts.unit || "", pre: opts.pre || "", dec: opts.dec };
  }

  // a line (or area) over an evenly spaced series
  function pLine(series, opts = {}) {
    const W = 760, H = 300, L = 54, R = 16, T = 18, B = 34;
    const all = series.flatMap(s => s.points.map(p => p.value));
    if (!all.length) return null;
    const min = Math.min(...all), max = Math.max(...all);
    const lo = opts.zero === false ? Math.max(0, min - (max - min) * 0.35) : Math.min(0, min);
    const hi = opts.zero === false ? max + (max - min) * 0.25 : niceTop(max);
    const labels = series[0].points.map(p => p.date);
    const x = i => L + (labels.length === 1 ? (W - L - R) / 2 : i * (W - L - R) / (labels.length - 1));
    const y = v => T + (H - T - B) * (1 - (v - lo) / ((hi - lo) || 1));
    const ticks = [0, 0.25, 0.5, 0.75, 1].map(f => lo + (hi - lo) * f);
    const step = Math.max(1, Math.ceil(labels.length / 7));

    const paths = series.map((s, i) => {
      const d = s.points.map((p, k) => `${k ? "L" : "M"}${x(k).toFixed(1)},${y(p.value).toFixed(1)}`).join("");
      const area = opts.area && series.length === 1
        ? `<path class="c-area" d="${d}L${x(s.points.length - 1).toFixed(1)},${y(lo).toFixed(1)}L${x(0).toFixed(1)},${y(lo).toFixed(1)}Z" fill="${SERIES[i]}" opacity=".14"/>` : "";
      const last = s.points[s.points.length - 1];
      return `${area}<path d="${d}" fill="none" stroke="${SERIES[i]}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
        <circle cx="${x(s.points.length - 1).toFixed(1)}" cy="${y(last.value).toFixed(1)}" r="4.5" fill="${SERIES[i]}" stroke="#0d1211" stroke-width="2"/>
        <text class="c-tip-label" x="${(x(s.points.length - 1) - 8).toFixed(1)}" y="${(y(last.value) + (i === 0 ? -12 : 18)).toFixed(1)}" text-anchor="end" fill="${SERIES[i]}">${esc(s.name)} ${axisFmt(last.value, opts.dec)}</text>`;
    }).join("");

    // the crosshair, and one wide hit target per point so a finger can find it
    const marks = labels.map((lab, k) => series.map((s, i) => {
      const p = s.points[k];
      return p ? `<circle class="c-dot" data-i="${k}" cx="${x(k).toFixed(1)}" cy="${y(p.value).toFixed(1)}" r="3.5" fill="${SERIES[i]}"/>` : "";
    }).join("")).join("");
    const hot = labels.map((lab, k) =>
      `<rect class="c-hot" data-i="${k}" data-x="${x(k).toFixed(1)}" x="${(x(k) - (W - L - R) / (labels.length * 2)).toFixed(1)}" y="${T}" width="${Math.max(10, (W - L - R) / labels.length).toFixed(1)}" height="${H - T - B}" fill="transparent"/>`).join("");

    const svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.alt || "")}" preserveAspectRatio="xMidYMid meet">
      ${ticks.map(t => `<line class="c-grid" x1="${L}" x2="${W - R}" y1="${y(t).toFixed(1)}" y2="${y(t).toFixed(1)}"/>
        <text class="c-axis" x="${L - 9}" y="${(y(t) + 4).toFixed(1)}" text-anchor="end">${axisFmt(t, opts.dec)}</text>`).join("")}
      ${axisTicks(labels).map((lab, k) => (k % step === 0 || k === labels.length - 1)
        ? `<text class="c-axis" x="${x(k).toFixed(1)}" y="${H - 12}" text-anchor="middle">${esc(lab)}</text>` : "").join("")}
      <line class="c-cross" x1="0" x2="0" y1="${T}" y2="${H - B}" style="opacity:0"/>
      ${paths}${marks}${hot}
    </svg>`;

    const rows = labels.map((lab, k) => [lab, ...series.map(s => (s.points[k] ? s.points[k].value : null))]);
    return { svg, data: chartData([opts.xName || "Period", ...series.map(s => s.name)], rows, SERIES.slice(0, series.length), opts) };
  }

  // vertical bars for one measure across a handful of periods
  function pBars(points, opts = {}) {
    const W = 760, H = 300, L = 54, R = 16, T = 18, B = 34;
    if (!points.length) return null;
    const hi = niceTop(Math.max(...points.map(p => p.value)));
    const bw = (W - L - R) / points.length;
    const y = v => T + (H - T - B) * (1 - v / (hi || 1));
    const ticks = [0, 0.25, 0.5, 0.75, 1].map(f => hi * f);
    const svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.alt || "")}" preserveAspectRatio="xMidYMid meet">
      ${ticks.map(t => `<line class="c-grid" x1="${L}" x2="${W - R}" y1="${y(t).toFixed(1)}" y2="${y(t).toFixed(1)}"/>
        <text class="c-axis" x="${L - 9}" y="${(y(t) + 4).toFixed(1)}" text-anchor="end">${axisFmt(t, opts.dec)}</text>`).join("")}
      ${(() => { const ticks = axisTicks(points.map(p => p.date)); return points.map((p, i) => {
        const h = Math.max(2, H - B - y(p.value));
        const px = L + i * bw + bw * 0.16, pw = bw * 0.68;
        return `<rect class="c-bar c-hot" data-i="${i}" x="${px.toFixed(1)}" y="${y(p.value).toFixed(1)}" width="${pw.toFixed(1)}" height="${h.toFixed(1)}" rx="4" fill="${p.accent ? SERIES[3] : SERIES[0]}"/>
          <text class="c-axis" x="${(px + pw / 2).toFixed(1)}" y="${H - 12}" text-anchor="middle">${esc(ticks[i])}</text>
          ${i === points.length - 1 || points.length <= 8 ? `<text class="c-val" x="${(px + pw / 2).toFixed(1)}" y="${(y(p.value) - 7).toFixed(1)}" text-anchor="middle">${axisFmt(p.value, opts.dec)}</text>` : ""}`;
      }).join(""); })()}
    </svg>`;
    return { svg, data: chartData([opts.xName || "Period", opts.name || "Value"], points.map(p => [p.date, p.value]), [SERIES[0]], opts) };
  }

  // horizontal bars: good for ranking a list by size
  function pHBars(rows, opts = {}) {
    const W = 760, rowH = 30, T = 10, L = 158, R = 58;
    if (!rows.length) return null;
    const H = T * 2 + rows.length * rowH;
    const hi = niceTop(Math.max(...rows.map(r => r.value)));
    const w = v => Math.max(2, (W - L - R) * (v / (hi || 1)));
    const svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.alt || "")}" preserveAspectRatio="xMidYMid meet">
      ${rows.map((r, i) => {
        const yy = T + i * rowH;
        return `<text class="c-axis c-name" x="${L - 10}" y="${(yy + rowH / 2 + 4).toFixed(1)}" text-anchor="end">${esc(r.name)}</text>
          <rect class="c-bar c-hot" data-i="${i}" x="${L}" y="${(yy + 5).toFixed(1)}" width="${w(r.value).toFixed(1)}" height="${rowH - 12}" rx="4" fill="${r.accent ? SERIES[3] : SERIES[0]}"/>
          <text class="c-val" x="${(L + w(r.value) + 8).toFixed(1)}" y="${(yy + rowH / 2 + 4).toFixed(1)}">${opts.pre || ""}${axisFmt(r.value, opts.dec)}${opts.unit || ""}</text>`;
      }).join("")}
    </svg>`;
    return { svg, data: chartData([opts.xName || "Name", opts.name || "Value"], rows.map(r => [r.name, r.value]), [SERIES[0]], opts) };
  }

  /* ---- a chart card: the picture, the numbers behind it, and a way to take both away ---- */
  let chartSeq = 0;
  function chartCard(title, blurb, chart, source, legend) {
    if (!chart || !chart.svg) return "";
    const id = `ch${++chartSeq}`;
    const d = chart.data;
    return `<figure class="chart-card" id="${id}" data-title="${esc(title)}">
      <figcaption>
        <h3>${esc(title)}</h3>
        <p>${esc(blurb)}</p>
        ${legend && legend.length > 1 ? `<div class="c-legend">${legend.map((n, i) => `<span><i style="background:${SERIES[i]}"></i>${esc(n)}</span>`).join("")}</div>` : ""}
      </figcaption>
      <div class="chart-box">
        ${chart.svg}
        <div class="c-tip" hidden></div>
      </div>
      <div class="c-tools">
        <button type="button" class="c-btn" data-table="${id}" aria-expanded="false">Read the numbers</button>
        <span class="c-tools-right">
          <button type="button" class="c-btn" data-png="${id}">Download PNG</button>
          <button type="button" class="c-btn" data-csv="${id}">Download CSV</button>
        </span>
      </div>
      <div class="c-table-wrap" hidden>
        <table class="rank-table c-table">
          <thead><tr>${d.cols.map(c => `<th>${esc(c)}</th>`).join("")}</tr></thead>
          <tbody>${d.rows.map(r => `<tr>${r.map((v, i) => `<td${i ? ' class="v"' : ""}>${i === 0 ? esc(String(v)) : (v == null ? "\—" : esc(showAt(v, d)))}</td>`).join("")}</tr>`).join("")}</tbody>
        </table>
      </div>
      <p class="c-src">${esc(source)}</p>
      <script type="application/json" class="c-json">${JSON.stringify(d).replace(/</g, "\\\u003c")}</script>
    </figure>`;
  }

  /* ---- reading a chart: a read-out that follows the pointer, and works under a finger ---- */
  const chartPayload = fig => {
    if (!fig._data) {
      const tag = fig.querySelector(".c-json");
      try { fig._data = JSON.parse(tag.textContent); } catch (e) { fig._data = null; }
    }
    return fig._data;
  };
  function showChartTip(fig, i, clientX) {
    const d = chartPayload(fig);
    const tip = fig.querySelector(".c-tip");
    const box = fig.querySelector(".chart-box");
    if (!d || !tip || !d.rows[i]) return;
    const row = d.rows[i];
    tip.innerHTML = `<b>${esc(String(row[0]))}</b>` + row.slice(1).map((v, j) =>
      `<span><i style="background:${d.colors[j] || SERIES[0]}"></i>${esc(d.cols[j + 1])} <b>${v == null ? "\—" : esc(showAt(v, d))}</b></span>`).join("");
    tip.hidden = false;
    const r = box.getBoundingClientRect();
    const half = tip.offsetWidth / 2;
    const at = Math.min(Math.max((clientX == null ? r.left + r.width / 2 : clientX) - r.left, half + 6), r.width - half - 6);
    tip.style.left = `${at}px`;

    // the crosshair, on charts that have one
    const cross = fig.querySelector(".c-cross");
    const hot = fig.querySelector(`.c-hot[data-i="${i}"]`);
    if (cross && hot && hot.dataset.x) {
      cross.setAttribute("x1", hot.dataset.x);
      cross.setAttribute("x2", hot.dataset.x);
      cross.style.opacity = "1";
    }
    fig.querySelectorAll(".c-dot").forEach(c => c.classList.toggle("on", c.dataset.i === String(i)));
    fig.querySelectorAll(".c-bar").forEach(b => b.classList.toggle("dim", b.dataset.i !== String(i)));
  }
  function hideChartTip(fig) {
    const tip = fig.querySelector(".c-tip");
    if (tip) tip.hidden = true;
    const cross = fig.querySelector(".c-cross");
    if (cross) cross.style.opacity = "0";
    fig.querySelectorAll(".c-dot.on").forEach(c => c.classList.remove("on"));
    fig.querySelectorAll(".c-bar.dim").forEach(b => b.classList.remove("dim"));
  }

  /* ---- taking a chart away: the picture as PNG, the numbers as CSV ---- */
  const saveBlob = (blob, name) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };
  const fileName = (fig, ext) =>
    `${(fig.dataset.title || "chart").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${new Date().toISOString().slice(0, 10)}.${ext}`;

  function chartToCsv(fig) {
    const d = chartPayload(fig);
    if (!d) return;
    const cell = v => (v == null ? "" : /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
    const lines = [d.cols.map(cell).join(","), ...d.rows.map(r => r.map(cell).join(","))];
    saveBlob(new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" }), fileName(fig, "csv"));
  }

  // The SVG on the page leans on the stylesheet for its greys. A file saved to disk has no
  // stylesheet, so every computed colour is written onto the clone before it is rasterised.
  function chartToPng(fig) {
    const src = fig.querySelector("svg");
    if (!src) return;
    const clone = src.cloneNode(true);
    const css = getComputedStyle(document.documentElement);
    const panel = (css.getPropertyValue("--panel") || "#0d1211").trim();
    const ink3 = (css.getPropertyValue("--ink-3") || "#8a9a94").trim();
    const line = (css.getPropertyValue("--line") || "#1d2725").trim();
    const ink = (css.getPropertyValue("--ink") || "#eef3f1").trim();
    clone.querySelectorAll(".c-grid").forEach(el => { el.setAttribute("stroke", line); el.setAttribute("stroke-width", "1"); });
    clone.querySelectorAll(".c-axis").forEach(el => { el.setAttribute("fill", ink3); el.setAttribute("font-size", "11"); el.setAttribute("font-family", "system-ui, sans-serif"); });
    clone.querySelectorAll(".c-val, .c-tip-label").forEach(el => { if (!el.getAttribute("fill")) el.setAttribute("fill", ink); el.setAttribute("font-size", "12"); el.setAttribute("font-family", "system-ui, sans-serif"); el.setAttribute("font-weight", "600"); });
    // the invisible hit targets go, but a bar is both a mark and its own hit target
    clone.querySelectorAll(".c-hot:not(.c-bar), .c-cross, .c-tip, .c-dot").forEach(el => el.remove());
    clone.querySelectorAll("[stroke^='var('], [fill^='var(']").forEach(el => {
      if ((el.getAttribute("stroke") || "").startsWith("var(")) el.setAttribute("stroke", panel);
      if ((el.getAttribute("fill") || "").startsWith("var(")) el.setAttribute("fill", panel);
    });
    const vb = (src.getAttribute("viewBox") || "0 0 760 300").split(/\s+/).map(Number);
    const w = vb[2] || 760, plot = vb[3] || 300, scale = 2;
    // room above for the title and below for the source, so the file explains itself
    const TOP = 56, FOOT = 30, h = plot + TOP + FOOT;
    const title = fig.dataset.title || "";
    const srcText = (fig.querySelector(".c-src") || {}).textContent || "";
    [...clone.children].forEach(el => el.setAttribute("transform", `translate(0, ${TOP})`));
    const wrapped = `<g transform="translate(0,${TOP})">${[...clone.children].map(el => { el.removeAttribute("transform"); return el.outerHTML; }).join("")}</g>`;
    clone.innerHTML = `<rect x="0" y="0" width="${w}" height="${h}" fill="${panel}"/>
      <text x="20" y="34" fill="${ink}" font-family="system-ui, sans-serif" font-size="20" font-weight="700">${esc(title)}</text>
      ${wrapped}
      <text x="20" y="${h - 11}" fill="${ink3}" font-family="system-ui, sans-serif" font-size="12">${esc(srcText)} · alfredo19-boss.github.io/alfre-do-ghana-economic-data</text>`;
    clone.setAttribute("viewBox", `0 0 ${w} ${h}`);
    clone.setAttribute("width", w); clone.setAttribute("height", h);
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    const svgText = new XMLSerializer().serializeToString(clone);
    const img = new Image();
    img.onload = () => {
      const cv = document.createElement("canvas");
      cv.width = w * scale; cv.height = h * scale;
      const ctx = cv.getContext("2d");
      ctx.fillStyle = panel; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.drawImage(img, 0, 0, cv.width, cv.height);
      cv.toBlob(b => { if (b) saveBlob(b, fileName(fig, "png")); }, "image/png");
    };
    img.onerror = () => { /* a browser that refuses the conversion: the CSV is still there */ };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgText);
  }

  /* ---- the charts themselves ---- */
  function renderCharts() {
    const { H, A, AF } = chartsData();
    const cards = [];
    const seriesOf_ = key => (H[key] && H[key].points) || [];
    const readSeries = label => {
      const it = allItems.find(i => i.label === label);
      return it && Array.isArray(it.series) ? it.series.map(p => ({ date: p.date, value: p.value })) : [];
    };

    // the debt itself
    const debtBars = (D.history || []).filter(h => h.debt).map(h => ({ date: String(h.label || h.k).replace("End-", ""), value: h.debt }));
    cards.push(chartCard("Public debt, GH\¢ billion", "Year-end stock, with the latest reported month at the end.",
      pBars(debtBars, { unit: "bn", dec: 0, name: "Public debt", xName: "Period", alt: "Ghana's public debt stock by year" }), "Bank of Ghana \· Ministry of Finance"));

    const ratioBars = (D.history || []).filter(h => h.ratio).map(h => ({ date: String(h.label || h.k).replace("End-", ""), value: h.ratio }));
    cards.push(chartCard("Debt-to-GDP, %", "The burden has almost halved since the 2022 peak.",
      pBars(ratioBars, { unit: "%", dec: 1, name: "Debt-to-GDP", xName: "Period", alt: "Ghana's debt-to-GDP ratio by year" }), "Bank of Ghana \· Ministry of Finance"));

    // debt carried per person, worked out from the two series the site already holds
    const popSeries = seriesOf_("population");
    if (debtBars.length && popSeries.length) {
      const popAtYear = yr => {
        const hit = popSeries.filter(p => String(p.date).slice(0, 4) <= String(yr)).slice(-1)[0];
        return hit ? hit.value : null;
      };
      const perHead = debtBars.map(b => {
        const yr = (String(b.date).match(/(19|20)\d{2}/) || [])[0];
        const pop = yr ? popAtYear(yr) : null;
        return pop ? { date: b.date, value: b.value * 1e9 / pop } : null;
      }).filter(Boolean);
      if (perHead.length > 2) cards.push(chartCard("Debt per person, GH\¢", "The same debt divided by the population of the year it belongs to.",
        pLine([{ name: "Per person", points: perHead }], { area: true, pre: "GH\¢", dec: 0, zero: false, xName: "Period", alt: "Ghana's public debt per person" }),
        "Ghana Statistical Service \· Bank of Ghana"));
    }

    // prices and the cedi
    const infl = seriesOf_("Inflation");
    cards.push(chartCard("Inflation since 1993, %", "Annual average consumer price inflation. The 1990s peaks dwarf anything since.",
      pLine([{ name: "Inflation", points: infl }], { area: true, unit: "%", dec: 1, xName: "Year", alt: "Ghana's annual inflation since 1993" }), "World Bank, World Development Indicators"));

    // inflation against the policy rate, both in per cent, so one scale serves both
    const inflMonthly = readSeries("Inflation"), policy = readSeries("BoG policy rate");
    if (inflMonthly.length > 2 && policy.length > 2) {
      const dates = inflMonthly.map(p => p.date).filter(d => policy.some(q => q.date === d));
      if (dates.length > 2) {
        const pick = (arr, d) => (arr.find(p => p.date === d) || {}).value ?? null;
        cards.push(chartCard("Inflation and the policy rate, %", "What prices are doing, against what the Bank of Ghana charges. The gap between them is the real rate.",
          pLine([
            { name: "Inflation", points: dates.map(d => ({ date: d, value: pick(inflMonthly, d) })) },
            { name: "Policy rate", points: dates.map(d => ({ date: d, value: pick(policy, d) })) }
          ], { unit: "%", dec: 1, zero: false, xName: "Month", alt: "Ghana's inflation against the policy rate" }),
          "Ghana Statistical Service \· Bank of Ghana", ["Inflation", "Policy rate"]));
      }
    }

    const cedi = (A.cediHistory || []).map(c => ({ date: c.date, value: c.rate }));
    const cediPts = cedi.length > 3 ? cedi : (D.cedi || []).map(c => ({ date: c.label || c.date, value: c.rate }));
    cards.push(chartCard("Cedi per US dollar", "Every Bank of Ghana interbank rate this site has recorded.",
      pLine([{ name: "GH\¢ per US$", points: cediPts }], { area: true, zero: false, pre: "GH\¢", dec: 2, xName: "Date", alt: "Cedi per US dollar over recent months" }), "Bank of Ghana interbank mid-rate"));

    // what a litre costs
    const petrol = readSeries("Petrol"), diesel = readSeries("Diesel");
    if (petrol.length > 2 && diesel.length > 2) {
      const dates = petrol.map(p => p.date).filter(d => diesel.some(q => q.date === d));
      if (dates.length > 2) {
        const pick = (arr, d) => (arr.find(p => p.date === d) || {}).value ?? null;
        cards.push(chartCard("Petrol and diesel, GH\¢ a litre", "Pump prices as published, the figure that reaches the trotro fare fastest.",
          pLine([
            { name: "Petrol", points: dates.map(d => ({ date: d, value: pick(petrol, d) })) },
            { name: "Diesel", points: dates.map(d => ({ date: d, value: pick(diesel, d) })) }
          ], { pre: "GH\¢", dec: 2, zero: false, xName: "Date", alt: "Petrol and diesel pump prices" }),
          "National Petroleum Authority", ["Petrol", "Diesel"]));
      }
    }

    // the wider economy, year by year
    const growth = seriesOf_("Real GDP growth");
    if (growth.length > 3) cards.push(chartCard("Real GDP growth, %", "How fast the economy grew each year. 2020 is the pandemic; 2023 the crisis year.",
      pBars(growth.slice(-16), { unit: "%", dec: 1, name: "Real GDP growth", xName: "Year", alt: "Ghana's real GDP growth by year" }), "World Bank, World Development Indicators"));

    const income = seriesOf_("Income per person");
    if (income.length > 3) cards.push(chartCard("Income per person, US$", "Gross national income per head. The dip after 2022 is the cedi as much as the economy.",
      pLine([{ name: "Income per person", points: income }], { area: true, pre: "US$", dec: 0, zero: false, xName: "Year", alt: "Ghana's income per person" }), "World Bank, World Development Indicators"));

    const reserves = seriesOf_("Gross reserves");
    if (reserves.length > 3) cards.push(chartCard("Gross reserves, US$ billion", "What the country holds in foreign currency \— the buffer behind the cedi.",
      pLine([{ name: "Gross reserves", points: reserves }], { area: true, pre: "US$", unit: "bn", dec: 1, xName: "Year", alt: "Ghana's gross international reserves" }), "World Bank \· Bank of Ghana"));

    const remit = seriesOf_("Remittances");
    if (remit.length > 3) cards.push(chartCard("Remittances, US$ billion", "Money sent home by Ghanaians abroad \— bigger than most export lines.",
      pLine([{ name: "Remittances", points: remit }], { area: true, pre: "US$", unit: "bn", dec: 1, xName: "Year", alt: "Remittances to Ghana" }), "World Bank, World Development Indicators"));

    const jobless = seriesOf_("Unemployment rate");
    if (jobless.length > 3) cards.push(chartCard("Unemployment rate, %", "The modelled international estimate, which runs lower than Ghana's own survey.",
      pLine([{ name: "Unemployment", points: jobless }], { area: true, unit: "%", dec: 1, zero: false, xName: "Year", alt: "Ghana's unemployment rate" }), "World Bank / ILO modelled estimate"));

    const people = seriesOf_("population");
    if (people.length > 3) cards.push(chartCard("Population, millions", "Ghana has roughly doubled in a generation \— the denominator under every per-person figure on this site.",
      pLine([{ name: "Population", points: people.map(p => ({ date: p.date, value: p.value / 1e6 })) }], { unit: "m", dec: 1, area: true, zero: false, xName: "Year", alt: "Ghana's population" }), "World Bank, World Development Indicators"));

    // trade
    const ex = seriesOf_("exports"), im = seriesOf_("imports");
    if (ex.length > 3 && im.length > 3) {
      const years = ex.map(p => p.date).filter(d => im.some(q => q.date === d));
      const pick = (arr, d) => (arr.find(p => p.date === d) || {}).value ?? null;
      cards.push(chartCard("Exports and imports, US$ billion", "Goods and services for the whole year. The gap between the lines is the trade balance.",
        pLine([
          { name: "Exports", points: years.map(d => ({ date: d, value: pick(ex, d) })) },
          { name: "Imports", points: years.map(d => ({ date: d, value: pick(im, d) })) }
        ], { pre: "US$", unit: "bn", dec: 1, xName: "Year", alt: "Ghana's exports against imports" }),
        "World Bank, World Development Indicators", ["Exports", "Imports"]));

      const bal = seriesOf_("balance");
      if (bal.length > 3) cards.push(chartCard("Trade balance, US$ billion", "Exports minus imports. Above the line is a surplus; the recent run of them is gold-led.",
        pLine([{ name: "Trade balance", points: bal }], { pre: "US$", unit: "bn", dec: 1, xName: "Year", alt: "Ghana's trade balance" }), "World Bank, World Development Indicators"));
    }

    // gold and cocoa, indexed so two very different prices share one scale
    const gold = seriesOf_("Gold price"), cocoa = seriesOf_("Cocoa world price");
    if (gold.length > 3 && cocoa.length > 3) {
      const years = gold.map(p => p.date).filter(d => cocoa.some(q => q.date === d));
      if (years.length > 3) {
        const base = (arr, d0) => (arr.find(p => p.date === d0) || {}).value || 1;
        const from = years[0];
        const g0 = base(gold, from), c0 = base(cocoa, from);
        const pick = (arr, d) => (arr.find(p => p.date === d) || {}).value ?? null;
        cards.push(chartCard(`Gold and cocoa, ${from} = 100`, "Ghana's two biggest earners, indexed so they share one scale.",
          pLine([
            { name: "Gold", points: years.map(d => ({ date: d, value: pick(gold, d) / g0 * 100 })) },
            { name: "Cocoa", points: years.map(d => ({ date: d, value: pick(cocoa, d) / c0 * 100 })) }
          ], { dec: 0, zero: false, xName: "Year", alt: "Gold and cocoa prices indexed to a common base" }),
          "Futures settlement prices", ["Gold", "Cocoa"]));
      }
    }

    // the budget
    const bud = budgetItems.filter(b => b.key !== "exp");
    if (bud.length) {
      const total = (budgetItems.find(b => b.key === "exp") || {}).value || 0;
      const named = bud.map(b => ({ name: b.label, value: b.value / 1e9 }));
      const rest = total / 1e9 - named.reduce((n, b) => n + b.value, 0);
      cards.push(chartCard(`Where the ${Y} budget goes, GH\¢ billion`,
        "The approved allocations, with everything not named separately grouped at the end.",
        pHBars([...named, ...(rest > 0 ? [{ name: "Everything else", value: rest }] : [])].sort((a, b) => b.value - a.value),
          { pre: "GH\¢", unit: "bn", dec: 1, name: "Allocation", xName: "Line", alt: "How the budget is allocated" }),
        "Ministry of Finance, budget statement"));
    }

    // Ghana against Africa
    if (AF && AF.countries) {
      const list = Object.entries(AF.countries).filter(([, c]) => c.latest)
        .map(([iso, c]) => ({ iso, name: c.name, value: c.latest.value }))
        .sort((a, b) => b.value - a.value);
      const gh = list.find(c => c.iso === "GHA");
      const rows = [...list.slice(0, 8), ...(list.slice(0, 8).includes(gh) ? [] : [gh])].filter(Boolean)
        .map(c => ({ name: c.name, value: c.value, accent: c.iso === "GHA" }));
      cards.push(chartCard("Inflation across Africa, %", "The eight highest rates on the continent, with Ghana marked in gold.",
        pHBars(rows, { unit: "%", dec: 1, name: "Inflation", xName: "Country", alt: "African inflation compared with Ghana" }), AF.source || "National statistics offices"));

      const sized = Object.entries(AF.countries).filter(([, c]) => c.gdp && c.gdp.value)
        .map(([iso, c]) => ({ iso, name: c.name, value: c.gdp.value }))
        .sort((a, b) => b.value - a.value);
      if (sized.length > 4) {
        const ghs = sized.find(c => c.iso === "GHA");
        const top = sized.slice(0, 8);
        cards.push(chartCard("The biggest economies in Africa, US$ billion", "Nominal GDP, with Ghana marked in gold wherever it falls.",
          pHBars([...top, ...(top.includes(ghs) ? [] : [ghs])].filter(Boolean).map(c => ({ name: c.name, value: c.value, accent: c.iso === "GHA" })),
            { pre: "US$", unit: "bn", dec: 0, name: "GDP", xName: "Country", alt: "The largest African economies by GDP" }),
          "IMF estimates"));
      }
    }

    const built = cards.filter(Boolean);
    $("chart-wall").innerHTML = built.join("");
    $("charts-status").textContent = `${built.length} charts`;
    $("charts-note").textContent = "Every chart is drawn from the same figures as the dashboard \— nothing here is smoothed, projected or rebased except where a title says so. Point at any chart, or touch it, to read the value under your finger.";
    setupChartSlider(built.length);
  }

  /* ---- the charts slide, one at a time, with everything still reachable ---- */
  // A wall of sixteen charts is a lot to scroll past. By default they slide: one on screen,
  // arrows and dots to move, and a slow auto-advance that stops the moment anyone touches
  // the controls, reads a value, or opens a table. "Show all" puts the wall back for anyone
  // who would rather scan or print the lot.
  let chartAt = 0, chartTimer = null, chartSlide = true, chartHeld = false;
  const CHART_EVERY = 11000;

  function chartCards() { return $$("#chart-wall > .chart-card"); }
  function paintChartSlider() {
    const cards = chartCards();
    if (!cards.length) return;
    if (chartAt >= cards.length) chartAt = 0;
    if (chartAt < 0) chartAt = cards.length - 1;
    const wall = $("chart-wall");
    wall.classList.toggle("sliding", chartSlide);
    cards.forEach((c, i) => {
      const on = !chartSlide || i === chartAt;
      c.classList.toggle("on", on);
      c.setAttribute("aria-hidden", String(!on));
    });
    const dots = $("chart-dots");
    if (dots) {
      dots.hidden = !chartSlide;
      dots.innerHTML = chartSlide ? cards.map((c, i) =>
        `<button type="button" class="${i === chartAt ? "on" : ""}" data-go="${i}" aria-label="Chart ${i + 1}: ${esc(c.dataset.title || "")}"${i === chartAt ? ' aria-current="true"' : ""}></button>`).join("") : "";
    }
    const at = $("chart-at");
    if (at) at.textContent = chartSlide ? `${chartAt + 1} of ${cards.length}` : `${cards.length} charts`;
    $$("#chart-prev, #chart-next").forEach(b => (b.hidden = !chartSlide));
  }
  function chartGo(n) {
    const cards = chartCards();
    if (!cards.length) return;
    chartAt = (n + cards.length) % cards.length;
    cards.forEach(c => hideChartTip(c));
    paintChartSlider();
  }
  function setupChartSlider(count) {
    chartAt = 0;
    paintChartSlider();
    if (chartTimer) clearInterval(chartTimer);
    if (!count) return;
    chartTimer = setInterval(() => {
      if (!chartSlide || chartHeld) return;
      if (VIEWS.charts.el.hidden) return;                       // nobody is looking
      if (document.hidden) return;                              // the tab is in the background
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      chartGo(chartAt + 1);
    }, CHART_EVERY);
  }

  // reading a value: pointer, finger or the keyboard's own focus
  (() => {
    const wall = $("chart-wall");
    if (!wall) return;
    const figOf = e => e.target.closest && e.target.closest(".chart-card");
    // A finger is not a mouse: a tap fires pointerdown, then a pointerleave a moment later as
    // the finger lifts. Hiding on that would flash the read-out and take it away again, so on
    // touch the value stays put until the next tap somewhere else.
    let touching = false;
    wall.addEventListener("pointermove", e => {
      if (e.pointerType === "touch") return;
      const fig = figOf(e); if (!fig) return;
      const hot = e.target.closest(".c-hot");
      if (hot) { chartHeld = true; showChartTip(fig, +hot.dataset.i, e.clientX); }
      else hideChartTip(fig);
    });
    wall.addEventListener("pointerdown", e => {
      touching = e.pointerType === "touch";
      const fig = figOf(e); if (!fig) return;
      const hot = e.target.closest(".c-hot");
      if (hot) { chartHeld = true; showChartTip(fig, +hot.dataset.i, e.clientX); }
      else if (touching) hideChartTip(fig);
    });
    wall.addEventListener("pointerleave", e => {
      if (touching || e.pointerType === "touch") return;
      chartCards().forEach(hideChartTip);
      chartHeld = false;
    }, true);
    wall.addEventListener("mouseleave", e => {
      if (touching) return;
      const fig = figOf(e); if (fig) hideChartTip(fig);
    }, true);
    // a tap anywhere off the charts clears the read-out
    document.addEventListener("pointerdown", e => {
      if (!touching) return;
      if (e.target.closest && e.target.closest(".chart-box")) return;
      chartCards().forEach(hideChartTip);
    }, true);

    // the buttons under each chart
    wall.addEventListener("click", e => {
      const fig = figOf(e); if (!fig) return;
      const t = e.target.closest("button"); if (!t) return;
      if (t.dataset.png) { chartHeld = true; chartToPng(fig); return; }
      if (t.dataset.csv) { chartHeld = true; chartToCsv(fig); return; }
      if (t.dataset.table) {
        chartHeld = true;
        const box = fig.querySelector(".c-table-wrap");
        const open = box.hidden;
        box.hidden = !open;
        t.setAttribute("aria-expanded", String(open));
        t.textContent = open ? "Hide the numbers" : "Read the numbers";
      }
    });
  })();

  // the slider's own controls
  (() => {
    const prev = $("chart-prev"), next = $("chart-next"), dots = $("chart-dots"), all = $("chart-all");
    if (prev) prev.addEventListener("click", () => { chartHeld = true; chartGo(chartAt - 1); });
    if (next) next.addEventListener("click", () => { chartHeld = true; chartGo(chartAt + 1); });
    if (dots) dots.addEventListener("click", e => {
      const b = e.target.closest("button[data-go]");
      if (b) { chartHeld = true; chartGo(+b.dataset.go); }
    });
    if (all) all.addEventListener("click", () => {
      chartSlide = !chartSlide;
      chartHeld = true;
      all.textContent = chartSlide ? "Show all" : "Show one at a time";
      all.setAttribute("aria-pressed", String(!chartSlide));
      paintChartSlider();
      if (!chartSlide) window.scrollTo({ top: window.scrollY, behavior: "instant" });
    });
    // arrow keys move through the charts while the portal is open
    document.addEventListener("keydown", e => {
      if (VIEWS.charts.el.hidden || !chartSlide) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
      if (e.key === "ArrowRight") { chartHeld = true; chartGo(chartAt + 1); }
      if (e.key === "ArrowLeft") { chartHeld = true; chartGo(chartAt - 1); }
    });
    // a swipe on a touch screen
    let x0 = null;
    const wall = $("chart-wall");
    if (wall) {
      wall.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
      wall.addEventListener("touchend", e => {
        if (x0 == null || !chartSlide) return;
        const dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 60) { chartHeld = true; chartGo(chartAt + (dx < 0 ? 1 : -1)); }
        x0 = null;
      }, { passive: true });
    }
  })();

  /* ================= global markets, and the Ghana Stock Exchange ================= */
  const marketsData = () => window.GDC_MARKETS || null;
  const GROUP_TITLES = {
    indices: ["Share indices", "What the world's stock markets did today"],
    commodities: ["Commodities", "Gold and cocoa are Ghana's two biggest earners; oil moves the fuel price"],
    crypto: ["Crypto", "Quoted around the clock, unlike the exchanges above"],
    currencies: ["Currencies", "The cedi against the currencies Ghana trades in, and the majors against each other"]
  };
  const moveClass = pct => (pct > 0 ? "up" : pct < 0 ? "down" : "flat");
  const moveMark = pct => (pct > 0 ? "▲" : pct < 0 ? "▼" : "—");
  const quoteTime = iso => {
    const ms = Date.now() - Date.parse(iso);
    if (!isFinite(ms)) return "";
    if (ms < 36e5) return `${Math.max(1, Math.round(ms / 6e4))} min ago`;
    if (ms < 864e5) return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" }) + " GMT";
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
  };

  function renderMarkets() {
    const M = marketsData();
    const world = (M && M.world) || {};
    const groups = Object.entries(GROUP_TITLES).filter(([key]) => (world[key] || []).length);
    $("markets-empty").hidden = groups.length > 0;
    $("markets-status").textContent = M && M.updated
      ? `${Object.values(world).reduce((n, l) => n + (l || []).length, 0)} prices · ${timeAgo(M.updated)}`
      : "Waiting for the first run";
    $("markets-body").innerHTML = groups.map(([key, [title, blurb]]) => `
      <section class="block">
        <div class="block-head"><h2>${esc(title)}</h2><p>${esc(blurb)}</p></div>
        <div class="quote-grid">${world[key].map(q => {
          const cls = moveClass(q.pct);
          const trail = Array.isArray(q.history) ? q.history : [];
          return `<article class="quote tappable ${cls}" data-detail="market:${esc(q.symbol)}" tabindex="0" aria-label="${esc(q.name)}: show its trend">
            <span class="q-name">${esc(q.name)}</span>
            <span class="q-value">${q.unit && /^US\$|^GH¢/.test(q.unit) ? esc(q.unit.split("/")[0]) : ""}${fmt(q.value, q.dec ?? 2)}${q.unit && !/^US\$|^GH¢/.test(q.unit) ? `<small>${esc(q.unit)}</small>` : q.unit && q.unit.includes("/") ? `<small>${esc("/" + q.unit.split("/")[1])}</small>` : ""}</span>
            <span class="q-move">${moveMark(q.pct)} ${q.pct == null ? "—" : `${q.pct > 0 ? "+" : ""}${fmt(q.pct, 2)}%`}${q.change == null ? "" : ` <i>${q.change > 0 ? "+" : ""}${fmt(q.change, Math.abs(q.change) < 10 ? 2 : 0)}</i>`}</span>
            ${trail.length > 2 ? `<span class="q-spark">${alfSpark(trail, `${q.name} over time`)}</span>` : ""}
            <span class="q-when">${esc(quoteTime(q.at))}</span>
          </article>`;
        }).join("")}</div>
      </section>`).join("");
    const src = M && M.source ? ` Source: ${esc(M.source)}.` : "";
    $("markets-note").innerHTML = `${esc((M && M.note) || "")}${src} Prices are for information, not for trading.`;
  }

  let gseFind = "";
  function renderGse() {
    const M = marketsData();
    const G = (M && M.ghana) || { equities: [] };
    const all = G.equities || [];
    $("gse-empty").hidden = all.length > 0;
    $("gse-status").textContent = G.updated ? `${all.length} companies · ${timeAgo(G.updated)}` : "Waiting for the first run";

    const index = allItems.find(i => i.label === "GSE Composite Index");
    const up = all.filter(e => (e.change || 0) > 0).length;
    const down = all.filter(e => (e.change || 0) < 0).length;
    const movers = [...all].filter(e => typeof e.pct === "number").sort((a, b) => b.pct - a.pct);
    const top = movers[0], bottom = movers[movers.length - 1];
    $("gse-top").innerHTML = all.length ? `
      <div class="quote-grid gse-summary">
        ${index ? `<article class="quote"><span class="q-name">GSE Composite Index</span><span class="q-value">${fmt(index.value, 0)}</span><span class="q-when">${esc(index.date || "")}</span></article>` : ""}
        <article class="quote up"><span class="q-name">Risers today</span><span class="q-value">${up}</span><span class="q-when">of ${all.length} listed</span></article>
        <article class="quote down"><span class="q-name">Fallers today</span><span class="q-value">${down}</span><span class="q-when">of ${all.length} listed</span></article>
        ${top && top.pct > 0 ? `<article class="quote up"><span class="q-name">Best mover</span><span class="q-value">${esc(top.code)}</span><span class="q-move">▲ +${fmt(top.pct, 2)}%</span></article>` : ""}
        ${bottom && bottom.pct < 0 ? `<article class="quote down"><span class="q-name">Worst mover</span><span class="q-value">${esc(bottom.code)}</span><span class="q-move">▼ ${fmt(bottom.pct, 2)}%</span></article>` : ""}
      </div>` : "";

    const find = gseFind.toLowerCase();
    const rows = all
      .filter(e => !find || e.code.toLowerCase().includes(find) || (e.name || "").toLowerCase().includes(find))
      .sort((a, b) => (b.pct ?? -999) - (a.pct ?? -999));
    $("gse-table").innerHTML = `
      <thead><tr><th>Code</th><th>Company</th><th>Price, GH¢</th><th>Change</th><th>Move</th><th>Volume</th></tr></thead>
      <tbody>${rows.map(e => `<tr>
        <td><b>${esc(e.code)}</b></td>
        <td>${esc(e.name || "")}</td>
        <td class="v">${fmt(e.price, 2)}</td>
        <td class="d ${moveClass(e.change)}">${e.change == null ? "—" : `${e.change > 0 ? "+" : ""}${fmt(e.change, 2)}`}</td>
        <td class="d ${moveClass(e.pct)}">${e.pct == null ? "—" : `${moveMark(e.pct)} ${e.pct > 0 ? "+" : ""}${fmt(e.pct, 2)}%`}</td>
        <td class="d">${e.volume == null ? "—" : fmt(e.volume, 0)}</td>
      </tr>`).join("")}</tbody>`;
    const src = G.sourceUrl ? ` <a href="${esc(G.sourceUrl)}" target="_blank" rel="noopener">${esc(G.source || "Ghana Stock Exchange")}</a>.` : "";
    $("gse-note").innerHTML = `Last traded prices, refreshed every 20 minutes while the exchange is open.${src} For information, not for trading.`;
  }
  $("gse-find").addEventListener("input", e => { gseFind = e.target.value; renderGse(); });

  /* ================= World news ================= */
  // Headlines from the world's wires, through GDELT. Nothing here is summarised or rewritten:
  // the headline, the publisher, the time it was seen and a link to the publisher's own page.
  // The headlines may arrive in either of two places: their own world-data.js, or carried
  // inside news-data.js by the news job. Whichever holds stories is used, so the feature works
  // with or without a separate step in the workflow.
  const worldData = () => {
    const own = window.GDC_WORLD || null;
    if (own && ((own.global || []).length || (own.africa || []).length)) return own;
    const news = window.GDC_NEWS || null;
    if (news && ((news.world || []).length || (news.africa || []).length)) {
      // worldAt is the minute the world lists themselves were last refreshed; news.updated is
      // the Ghana business run, which happens far more often and would overstate how fresh
      // these headlines are.
      return { updated: news.worldAt || news.updated, note: own && own.note, source: "the publishers' own feeds", global: news.world || [], africa: news.africa || [] };
    }
    return own;
  };
  const worldStories = (key = "global") => {
    const W = worldData();
    const list = (W && Array.isArray(W[key])) ? W[key] : [];
    return list
      .filter(i => i && i.title && i.link && i.published)
      .sort((a, b) => Date.parse(b.published) - Date.parse(a.published));
  };

  let worldFind = "";
  function renderWorld() {
    const W = worldData() || {};
    const all = worldStories("global");
    const q = worldFind.trim().toLowerCase();
    const shown = q ? all.filter(i => `${i.title} ${i.source}`.toLowerCase().includes(q)) : all;

    $("world-status").textContent = W.updated
      ? `${all.length} stories · updated ${timeAgo(W.updated)}`
      : "Waiting for the first run";
    $("world-empty").hidden = !!shown.length;

    // the three newest, given room at the top
    const lead = q ? [] : shown.slice(0, 3);
    $("world-lead").innerHTML = lead.map(i => `
      <article class="world-card">
        <div class="story-meta"><span class="src">${esc(i.source)}</span>${i.country ? `<span class="wire-tag">${esc(i.country)}</span>` : ""}<time datetime="${esc(i.published)}">${esc(timeAgo(i.published))}</time></div>
        <h3><a href="${esc(i.link)}" target="_blank" rel="noopener">${esc(i.title)}</a></h3>
      </article>`).join("");
    $("world-lead").hidden = !lead.length;

    const rest = q ? shown : shown.slice(3);
    $("world-list").innerHTML = rest.map(i => {
      const fresh = Date.now() - Date.parse(i.published) < 3 * 3600e3;
      return `<article class="story">
        <div class="story-meta"><span class="src">${esc(i.source)}</span><time datetime="${esc(i.published)}"${fresh ? ' class="fresh"' : ""}>${esc(timeAgo(i.published))}</time></div>
        <h3><a href="${esc(i.link)}" target="_blank" rel="noopener">${esc(i.title)}</a></h3>
      </article>`;
    }).join("");
    $("world-list").hidden = !rest.length;

    const src = W.source ? ` Read from ${esc(W.source)}.` : "";
    $("world-note").innerHTML = `Headlines and links only — each story opens on the publisher's own page, where it belongs.${src} Refreshed about every twenty minutes; anything older than a day and a half drops off.`;
  }
  $("world-find").addEventListener("input", e => { worldFind = e.target.value; renderWorld(); });

  /* ---- the African headline strip above the inflation orbit ---- */
  // One story at a time, sliding on the same rhythm as the board view, so the portal carries
  // what is happening across Africa as well as what prices are doing.
  let afrWireAt = 0, afrWireTimer = null;
  function renderAfrWire() {
    const wrap = $("afr-wire");
    if (!wrap) return;
    const items = worldStories("africa").slice(0, 8);
    wrap.hidden = false;
    if (!items.length) {
      // Nothing to slide yet. Say so plainly rather than vanishing, so it is obvious the strip
      // exists and is waiting on the job rather than broken.
      if (afrWireTimer) { clearInterval(afrWireTimer); afrWireTimer = null; }
      $("afr-wire-stage").innerHTML = `<span class="afr-slide on afr-waiting"><span class="afr-title">African headlines appear here once <b>Update business news</b> has run.</span></span>`;
      $("afr-wire-dots").innerHTML = "";
      return;
    }
    if (afrWireAt >= items.length) afrWireAt = 0;

    $("afr-wire-stage").innerHTML = items.map((i, n) => `
      <a class="afr-slide${n === afrWireAt ? " on" : ""}" href="${esc(i.link)}" target="_blank" rel="noopener">
        <span class="afr-src">${esc(i.source)}</span>
        <span class="afr-title">${esc(i.title)}</span>
        <span class="afr-when">${esc(timeAgo(i.published))}</span>
      </a>`).join("");
    $("afr-wire-dots").innerHTML = items.map((_, n) => `<i class="${n === afrWireAt ? "on" : ""}"></i>`).join("");

    if (!afrWireTimer) {
      afrWireTimer = setInterval(() => {
        const slides = $$(".afr-slide");
        if (!slides.length || VIEWS.africa.el.hidden) return;   // no work while nobody is looking
        afrWireAt = (afrWireAt + 1) % slides.length;
        slides.forEach((el, n) => el.classList.toggle("on", n === afrWireAt));
        $$("#afr-wire-dots i").forEach((d, n) => d.classList.toggle("on", n === afrWireAt));
      }, 6000);
    }
  }

  /* ================= Africa inflation: Ghana at the centre ================= */
  const africaData = () => window.GDC_AFRICA || null;
  function renderAfrica() {
    renderAfrWire();
    const AFRICA = africaData();
    if (!AFRICA || !AFRICA.countries) { $("africa-status").textContent = "No data yet"; return; }
    const gh = AFRICA.countries.GHA;
    const list = Object.entries(AFRICA.countries)
      .map(([iso, c]) => ({ iso, ...c, value: c.latest.value, period: c.latest.period || c.latest.year || "" }))
      .sort((a, b) => a.value - b.value);
    const rank = list.findIndex(c => c.iso === "GHA") + 1;
    const median = list[Math.floor(list.length / 2)].value;
    const ghPeriod = gh.latest.period || gh.latest.year || "";

    $("africa-status").textContent = `${list.length} countries · prevailing rates`;
    $("africa-intro").innerHTML = `Ghana's inflation of <b>${fmt(gh.latest.value, 1)}%</b> in ${esc(ghPeriod)} is the <b>${ordinal(list.length - rank + 1)} highest</b> of ${list.length} African countries, ${Math.abs(gh.latest.value - median) < 0.25 ? `in line with the median of ${fmt(median, 1)}%` : `against a median of ${fmt(median, 1)}%`}. Each country shows the latest month it has published, so the months differ.`;

    // the orbit: Ghana at the centre, the rest on three rings, closest rates nearest the middle.
    // Rings are filled in proportion to their circumference so nothing overlaps.
    const others = list.filter(c => c.iso !== "GHA")
      .sort((a, b) => Math.abs(a.value - gh.latest.value) - Math.abs(b.value - gh.latest.value));
    const RADIUS = [25, 35, 45], TILT = [0, 0.5, 0.25];
    const share = RADIUS.map(r => r / RADIUS.reduce((s, x) => s + x, 0));
    const rings = [[], [], []];
    let cut = 0;
    share.forEach((s, r) => {
      const n = r === 2 ? others.length - cut : Math.round(others.length * s);
      rings[r] = others.slice(cut, cut + n).sort((a, b) => a.value - b.value);
      cut += n;
    });
    $("orbit").classList.toggle("dense", others.length > 30);
    const html = rings.flatMap((ring, r) => ring.map((c, j) => {
      const diff = c.value - gh.latest.value;
      const angle = ((j + TILT[r]) / Math.max(ring.length, 1)) * Math.PI * 2 - Math.PI / 2;
      const x = 50 + RADIUS[r] * Math.cos(angle) * 1.02;
      const y = 50 + RADIUS[r] * Math.sin(angle) * 0.98;
      const band = Math.abs(diff) <= 2 ? "near" : diff > 0 ? "high" : "low";
      return `<button type="button" class="orb ${band}" style="left:${x.toFixed(2)}%;top:${y.toFixed(2)}%" data-iso="${esc(c.iso)}" data-detail="africa:${esc(c.iso)}"
        title="${esc(c.name)}: ${fmt(c.value, 1)}% in ${esc(c.period)} · ${diff > 0 ? "+" : ""}${fmt(diff, 1)} points against Ghana${c.gdp ? ` · economy US$${fmt(c.gdp.value, 0)}bn` : ""}">
        <b>${fmt(c.value, 1)}</b><span>${esc(c.name)}</span></button>`;
    })).join("");

    $("orbit").innerHTML = `
      <div class="orb-rings" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="orb-centre" title="Ghana: ${fmt(gh.latest.value, 1)}% (${esc(ghPeriod)})">
        ${GH_FLAG.replace("gh-flag", "gh-flag orb-flag")}
        <b>${fmt(gh.latest.value, 1)}<small>%</small></b>
        <span>Ghana · ${esc(ghPeriod)}</span>
        ${gh.gdp ? `<span class="orb-gdp">US$${fmt(gh.gdp.value, 0)}bn economy</span>` : ""}
      </div>${html}`;

    $("africa-table").innerHTML = `
      <thead><tr><th>#</th><th>Country</th><th>Inflation</th><th>As of</th><th>Vs Ghana</th><th>Month before</th><th>Economy, US$bn</th></tr></thead>
      <tbody>${list.map((c, i) => {
        const diff = c.value - gh.latest.value;
        const prev = typeof c.prev === "number" ? c.prev
          : (c.series || []).filter(p => p.date !== c.latest.key).slice(-1)[0]?.value;
        const move = typeof prev === "number" ? c.value - prev : null;
        return `<tr class="${c.iso === "GHA" ? "is-ghana" : ""}" data-detail="africa:${esc(c.iso)}" aria-label="${esc(c.name)}: show its readings">
          <td class="n">${i + 1}</td>
          <td>${esc(c.name)}<span class="reg">${esc(c.region)}</span></td>
          <td class="v">${fmt(c.value, 1)}<small>%</small></td>
          <td class="d">${esc(c.period)}</td>
          <td class="d ${diff > 0 ? "up" : diff < 0 ? "down" : ""}">${c.iso === "GHA" ? "—" : `${diff > 0 ? "+" : ""}${fmt(diff, 1)} pts`}</td>
          <td class="d">${typeof prev === "number" ? `${fmt(prev, 1)}% <span class="${move > 0 ? "up" : move < 0 ? "down" : ""}">${move > 0 ? "▲" : move < 0 ? "▼" : "—"}</span>` : "—"}</td>
          <td class="v gdp">${c.gdp ? `${fmt(c.gdp.value, c.gdp.value < 10 ? 1 : 0)}<small>${esc(c.gdp.year)}</small>` : "—"}</td>
        </tr>`;
      }).join("")}</tbody>`;

    markTappable();
    const src = AFRICA.sourceUrl ? ` <a href="${esc(AFRICA.sourceUrl)}" target="_blank" rel="noopener">${esc(AFRICA.source)}</a>.` : "";
    $("africa-note").innerHTML = `${esc(AFRICA.note || "")}${src}${AFRICA.gdpNote ? ` ${esc(AFRICA.gdpNote)}` : ""}`;
  }
  const ordinal = n => `${n}${["th", "st", "nd", "rd"][(n % 100 - n % 10 !== 10) * (n % 10 < 4) * (n % 10)] || "th"}`;

  /* ================= today's papers ================= */
  const paperData = () => window.GDC_PAPERS || { items: [] };
  let paperFilter = "";
  function renderPapers() {
    const PAPERS = paperData();
    const items = (PAPERS.items || []).filter(i => !paperFilter || i.source === paperFilter);
    const mastheads = [...new Set((PAPERS.items || []).map(i => i.source))];
    $("papers-status").textContent = PAPERS.updated
      ? `${(PAPERS.items || []).length} stories · ${timeAgo(PAPERS.updated)} · checked every minute`
      : "Waiting for the first run";
    $("paper-filters").innerHTML = mastheads.length ? [["", "All papers"], ...mastheads.map(m => [m, m])]
      .map(([v, label]) => `<button type="button" data-paper="${esc(v)}" class="${paperFilter === v ? "on" : ""}">${esc(label)}</button>`).join("") : "";
    $("papers-empty").hidden = items.length > 0;

    const byPaper = new Map();
    items.forEach(i => byPaper.set(i.source, [...(byPaper.get(i.source) || []), i]));
    $("papers").innerHTML = [...byPaper.entries()].map(([source, stories]) => {
      const lead = stories[0];
      return `<section class="paper">
        <header class="paper-head">
          <h2>${esc(source)}</h2>
          <span class="note">${stories.length} stor${stories.length === 1 ? "y" : "ies"} · ${esc(timeAgo(lead.published))}</span>
        </header>
        <a class="paper-lead" href="${esc(lead.link)}" target="_blank" rel="noopener">
          <h3>${esc(lead.title)}</h3>
          ${lead.summary ? `<p>${esc(lead.summary)}</p>` : ""}
          <span class="paper-when">${esc(timeAgo(lead.published))}</span>
        </a>
        <ol class="paper-rest">${stories.slice(1).map(s => `
          <li><a href="${esc(s.link)}" target="_blank" rel="noopener">${esc(s.title)}</a><span>${esc(timeAgo(s.published))}</span></li>`).join("")}</ol>
      </section>`;
    }).join("");
  }
  $("paper-filters").addEventListener("click", e => {
    const b = e.target.closest("button[data-paper]");
    if (!b) return;
    paperFilter = b.dataset.paper;
    renderPapers();
  });

  /* ================= briefings ================= */
  const articleData = () => ((window.GDC_ARTICLES || {}).articles || []);
  let openArticle = 0;
  function markdown(md) {
    const inline = t => esc(t)
      .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
      .replace(/\*([^*]+)\*/g, "<i>$1</i>")
      .replace(/`([^`]+)`/g, "<code>$1</code>");
    return md.split(/\n{2,}/).map(block => {
      const b = block.trim();
      if (!b) return "";
      if (b === "---") return "<hr>";
      if (b.startsWith("## ")) return `<h3>${inline(b.slice(3))}</h3>`;
      if (b.startsWith("# ")) return `<h2>${inline(b.slice(2))}</h2>`;
      if (/^- /m.test(b)) return `<ul>${b.split("\n").map(l => `<li>${inline(l.replace(/^- /, ""))}</li>`).join("")}</ul>`;
      return `<p>${inline(b)}</p>`;
    }).join("");
  }
  function renderArticles() {
    const ARTICLES = articleData();
    $("articles-status").textContent = ARTICLES.length
      ? `${ARTICLES.length} briefing${ARTICLES.length === 1 ? "" : "s"} · newest ${esc(ARTICLES[0].date)}`
      : "Waiting for the first run";
    $("articles-empty").hidden = ARTICLES.length > 0;
    if (!ARTICLES.length) { $("article-list").innerHTML = ""; $("article-read").innerHTML = ""; return; }

    $("article-list").innerHTML = ARTICLES.map((a, i) => `
      <button type="button" class="art-item${i === openArticle ? " on" : ""}" data-article="${i}">
        <span class="art-date">${esc(a.date)}</span>
        <span class="art-title">${esc(a.title)}</span>
      </button>`).join("");

    const a = ARTICLES[openArticle];
    $("article-read").innerHTML = `
      <div class="art-head">
        <p class="news-eyebrow">Briefing · ${esc(a.date)}</p>
        <h2>${esc(a.title)}</h2>
        <p class="art-stand">${esc(a.standfirst)}</p>
        <div class="art-actions">
          <a class="btn" href="${esc(a.file)}" download>Download markdown</a>
          <button type="button" class="btn" id="art-print">Save as PDF</button>
          <button type="button" class="btn" id="art-copy">Copy text</button>
        </div>
      </div>
      <div class="art-body" id="art-body">${markdown(a.body)}</div>`;
    $("art-print").addEventListener("click", () => window.print());
    $("art-copy").addEventListener("click", async () => {
      const text = `${a.title}\n\n${a.standfirst}\n\n${a.body}`;
      try { await navigator.clipboard.writeText(text); $("art-copy").textContent = "Copied"; }
      catch { $("art-copy").textContent = "Select the text to copy"; }
      setTimeout(() => ($("art-copy").textContent = "Copy text"), 2200);
    });
  }
  $("article-list").addEventListener("click", e => {
    const b = e.target.closest("[data-article]");
    if (!b) return;
    openArticle = +b.dataset.article;
    renderArticles();
    $("article-read").scrollIntoView({ block: "nearest", behavior: "smooth" });
  });


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
        <div class="story-meta"><span class="src">${esc(i.source)}</span>${i.wire ? `<span class="wire-tag">wire</span>` : ""}<time datetime="${esc(i.published)}"${fresh ? ' class="fresh"' : ""}>${esc(timeAgo(i.published))}</time></div>
        <h3><a href="${esc(i.link)}" target="_blank" rel="noopener">${esc(i.title)}</a></h3>
        ${i.summary ? `<p>${esc(i.summary)}</p>` : ""}
        ${i.topics.length ? `<div class="tags">${i.topics.slice(0, 2).map(k => `<span class="tag">${esc(topicName(k))}</span>`).join("")}</div>` : ""}
      </article>`;
    }).join("");
    $("news-list").hidden = !shown.length;
    $("news-empty").hidden = !!shown.length;
    $("news-status").textContent = N.updated
      ? `Updated ${timeAgo(N.updated)} · this page checks every minute`
      : `${N.sample || "Sample headlines"} · updates start once the news job runs`;
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
  // headlines, papers, the Africa board and the briefings are re-read by the
  // five-minute refresh at the foot of this file.

  /* ================= system status: is everything still arriving? ================= */
  // Every figure on this site comes from a file that some job writes. This page says, in
  // plain language, when each one last delivered and how old each published figure is.
  const DAY_MS = 24 * 3600e3;
  function renderStatus() {
    const now = Date.now();
    const age = iso => (iso ? (now - Date.parse(iso)) / DAY_MS : null);
    const NEWS = window.GDC_NEWS || {}, PAPERS = window.GDC_PAPERS || {},
          AFRICA = window.GDC_AFRICA || {}, ARTS = (window.GDC_ARTICLES || {}).articles || [],
          HISTF = window.GDC_HISTORY || {};
    const lastLog = f => {
      const entry = (f.log || [])[0];
      if (!entry) return "";
      const msgs = Array.isArray(entry.messages) ? entry.messages : [entry];
      return msgs.slice(0, 2).join(" · ");
    };
    const JOBS = [
      { name: "Update market data", feeds: "Cedi rates, gold, cocoa, the ticker",
        every: "Every day, 07:15 GMT", at: A.updated, lateAfter: 2.5, note: lastLog(A) },
      { name: "Update business news", feeds: "Business news tab",
        every: "Every 5 minutes", at: NEWS.updated, lateAfter: 1, note: `${(NEWS.items || []).length} headlines held` },
      { name: "…and today's papers", feeds: "Today's papers tab",
        every: "Every 5 minutes", at: PAPERS.updated, lateAfter: 2, note: `${(PAPERS.items || []).length} front-page stories held` },
      { name: "Update live rates", feeds: "The market quotes in the ticker",
        every: "Every 20 minutes", at: (window.GDC_LIVE || {}).updated, lateAfter: 0.5,
        note: `${Object.keys((window.GDC_LIVE || {}).quotes || {}).length} quotes held` },
      { name: "Update long history", feeds: "The series since 1993",
        every: "Every morning, 06:40 GMT", at: HISTF.updated, lateAfter: 45, note: `${Object.keys(HISTF.series || {}).length} indicators` },
      { name: "…and African inflation", feeds: "Africa inflation tab",
        every: "Every morning, 06:40 GMT", at: AFRICA.updated, lateAfter: 45, note: `${Object.keys(AFRICA.countries || {}).length} countries` },
      { name: "Write weekly briefing", feeds: "Articles tab",
        every: "Mondays, 06:30 GMT", at: (ARTS[0] || {}).published || null,
        fallbackDate: (ARTS[0] || {}).date, lateAfter: 10, note: ARTS.length ? `Newest: ${ARTS[0].title}` : "None yet" },
      { name: "Figures checked by a person", feeds: "data.js — debt, budget, the readings below",
        every: "When an official release lands", at: null, fallbackDate: D.checked, lateAfter: null,
        note: "Recorded through the Actions forms, then merged" }
    ];

    let lateCount = 0, waitingCount = 0;
    const rows = JOBS.map(j => {
      const stamp = j.at || (/^\d{4}-\d{2}-\d{2}/.test(j.fallbackDate || "") ? j.fallbackDate : null);
      const days = age(stamp);
      const waiting = j.lateAfter != null && days == null;
      const late = j.lateAfter != null && days != null && days > j.lateAfter;
      if (late) lateCount++;
      if (waiting) waitingCount++;
      const when = stamp ? timeAgo(stamp) : (j.fallbackDate ? esc(j.fallbackDate) : "Not yet");
      const state = j.lateAfter == null ? ["quiet", "By hand"]
        : waiting ? ["warn", "Waiting for first run"]
        : late ? ["bad", "Late"] : ["good", "On time"];
      return `<tr>
        <td><b>${esc(j.name)}</b><span class="reg">${esc(j.feeds)}</span></td>
        <td class="d">${esc(j.every)}</td>
        <td class="d">${when}</td>
        <td><span class="pill ${state[0]}">${state[1]}</span></td>
        <td class="d note-cell">${esc(j.note || "")}</td>
      </tr>`;
    }).join("");
    $("status-jobs").innerHTML = `<thead><tr><th>Job</th><th>Runs</th><th>Last delivered</th><th>State</th><th>Last word</th></tr></thead><tbody>${rows}</tbody>`;

    // every published reading, oldest first
    const figs = allItems.map(it => ({ it, stale: staleDays(it) })).sort((a, b) => b.stale - a.stale);
    const due = figs.filter(f => f.stale);
    const behind = figs.filter(f => f.it.sourceNewer);
    $("status-figures-note").textContent = due.length
      ? `${due.length} of ${figs.length} figures are past their usual release date and are marked Update due on the dashboard. The site keeps showing the last published value with its date — it never guesses a newer one.`
      : `All ${figs.length} published figures are within their usual release interval.${behind.length ? ` ${behind.length} have a newer third-party estimate waiting to be checked.` : ""}`;
    $("status-figures").innerHTML = `
      <thead><tr><th>Figure</th><th>Value</th><th>Period</th><th>State</th><th>Comes from</th></tr></thead>
      <tbody>${figs.map(f => `<tr>
        <td>${esc(f.it.label)}</td>
        <td class="v">${readValue(f.it)}</td>
        <td class="d">${esc(f.it.date || "—")}</td>
        <td><span class="pill ${f.stale ? "bad" : f.it.sourceNewer ? "warn" : "good"}">${f.stale ? `${f.stale} days old` : f.it.sourceNewer ? "Newer exists" : "Current"}</span></td>
        <td class="d note-cell">${f.it.autoSource ? esc(f.it.autoSource) : "Entered by hand"}</td>
      </tr>`).join("")}</tbody>`;

    const badge = $("status-badge");
    badge.textContent = lateCount
      ? `${lateCount} job${lateCount === 1 ? "" : "s"} need${lateCount === 1 ? "s" : ""} a look`
      : waitingCount ? `${waitingCount} job${waitingCount === 1 ? "" : "s"} not started yet`
      : due.length ? `Jobs healthy · ${due.length} figure${due.length === 1 ? "" : "s"} due`
      : "Everything current";
    badge.closest(".live").classList.toggle("warn", lateCount > 0 || waitingCount > 0);
    $("status-intro").textContent = waitingCount
      ? `How fresh everything on this site is. ${waitingCount} job${waitingCount === 1 ? " has" : "s have"} never delivered — normal before the site is published and the Actions schedules are switched on; run each one once from the Actions tab.`
      : "How fresh everything on this site is: when each automatic job last delivered, and how old every published figure is.";

    // A source that has quietly stopped working is worse than one that has obviously failed,
    // so where a figure is standing in for another source the status page says so outright.
    const standIns = allItems.filter(i => i.autoSource && /currency-api|market mid/i.test(i.autoSource));
    const bogNote = $("status-standin");
    if (bogNote) {
      bogNote.hidden = !standIns.length;
      if (standIns.length) bogNote.innerHTML =
        `<b>${standIns.length} figure${standIns.length === 1 ? " is" : "s are"} using a stand-in source.</b> `
        + `${standIns.map(i => esc(i.label)).join(", ")} ${standIns.length === 1 ? "is" : "are"} coming from a market mid-rate because the Bank of Ghana's daily page did not yield a rate. `
        + `The figures are real market prices and are labelled as such on the dashboard — they are simply not BoG's official numbers. `
        + `The morning job tries four different Bank of Ghana pages before falling back.`;
    }

    // what Alfredo was asked and could not answer, from this browser's own record
    const misses = alfMisses();
    $("status-alf-block").hidden = !misses.length;
    if (misses.length) {
      $("status-misses").innerHTML = `
        <thead><tr><th>Asked</th><th>When</th><th>Language</th><th>What he offered instead</th></tr></thead>
        <tbody>${misses.slice(0, 20).map(m => `<tr>
          <td>${esc(m.q || "")}</td>
          <td class="d">${m.at ? timeAgo(Date.parse(m.at)) : "—"}</td>
          <td class="d">${esc(((LANGS[m.lang] || {}).name) || m.lang || "—")}</td>
          <td class="d note-cell">${(m.near || []).length ? esc((m.near || []).join(", ")) : "Nothing close"}</td>
        </tr>`).join("")}</tbody>`;
    }

    $("status-note").innerHTML = `This page reads the data files themselves, so it reflects what visitors are actually seeing, not what GitHub intended to run. A job marked late usually means the Actions schedule stopped — GitHub pauses scheduled workflows in a repository that has had no activity for 60 days. Open the <b>Actions</b> tab, re-enable them, and run the job once by hand. The page itself re-reads every data file once a minute.`;
  }

  /* ================= Alfredo: ask the dashboard a question ================= */
  // Alfredo answers from the figures this site already holds. If data.js carries an
  // `alfredo.apiUrl`, anything he can't answer is forwarded there and the reply shown;
  // without it he says plainly what he doesn't know.
  const ALF = D.alfredo || {};
  const alfEl = $("alfredo"), alfLog = $("alf-log"), alfInput = $("alf-input");

  /* ---- languages: English, Twi, Ewe, Ga, Hausa (all of it lives in lang-data.js) ---- */
  const LANGS = window.GDC_LANG || { en: { name: "English", speech: "en-GH", strings: {}, suggestions: [], ask: {} } };
  const remember = (k, v) => { try { v === undefined ? null : localStorage.setItem(k, v); } catch (e) { /* private window */ } };
  const recall = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  let alfLang = LANGS[recall("alf.lang")] ? recall("alf.lang") : "en";

  // t("debt.total", { now: "GH¢751bn" }) -> the sentence in the chosen language,
  // falling back to English for anything not translated yet.
  function t(key, vars = {}) {
    const pack = LANGS[alfLang] || LANGS.en;
    const line = (pack.strings || {})[key] || ((LANGS.en.strings || {})[key]) || "";
    return line.replace(/\{(\w+)\}/g, (m, name) => (vars[name] === undefined ? m : String(vars[name])));
  }
  // figure names in the chosen language, English when there is no translation yet
  const L10N = label => (((LANGS[alfLang] || {}).labels || {})[label]) || label;
  const T = (key, vars) => t(key, vars);   // `t` is taken inside alfAnswer, where it means "now"
  const alfSuggestions = () => ((LANGS[alfLang] || LANGS.en).suggestions || LANGS.en.suggestions || []);

  // A question typed or spoken in Twi, Ewe, Ga or Hausa is matched to the same figures as
  // English: the local words carry an English tag along with them into the matching below.
  const ASK_TAGS = { debt: "total debt", percap: "debt per person", inflation: "inflation",
    dollar: "us dollar", population: "population", holiday: "next holiday",
    trade: "exports imports", budget: "budget" };
  // Every language's trigger words, flattened once instead of on every question, so the
  // match is a single pass over a plain list however many languages are installed.
  let ASK_INDEX = null;
  function askIndex() {
    if (ASK_INDEX) return ASK_INDEX;
    ASK_INDEX = [];
    for (const code of Object.keys(LANGS)) {
      const ask = LANGS[code].ask || {};
      for (const [intent, words] of Object.entries(ask)) {
        (words || []).forEach(w => ASK_INDEX.push({ intent, word: String(w).toLowerCase() }));
      }
    }
    return ASK_INDEX;
  }
  function alfLocalIntents(raw) {
    const low = raw.toLowerCase();
    const tags = [];
    const hit = new Set();
    for (const { intent, word } of askIndex()) {
      if (!low.includes(word)) continue;
      hit.add(intent);
      if (ASK_TAGS[intent]) tags.push(ASK_TAGS[intent]);
    }
    return { tags, hit, greet: hit.has("hello"), help: hit.has("help") };
  }

  const alfNorm = q => q.toLowerCase().replace(/[^a-z0-9%\s.-]/g, " ").replace(/\s+/g, " ").trim();
  const alfMoney = v => `${sym()}${fmt(money(v), 0)}`;

  // question words -> a figure on the page
  const ALF_WORDS = {
    "Inflation": ["inflation", "cpi", "prices rising", "cost of living"],
    "Food inflation": ["food inflation", "food prices"],
    "BoG policy rate": ["policy rate", "interest rate", "mpc rate", "central bank rate", "bog rate"],
    "91-day T-bill": ["91 day", "91-day", "treasury bill", "t bill", "tbill"],
    "364-day T-bill": ["364 day", "364-day", "one year bill"],
    "Average lending rate": ["lending rate", "loan rate", "borrowing rate for businesses"],
    "Real GDP growth": ["growth", "gdp growth", "economy growing"],
    "Gross reserves": ["reserves", "foreign reserves", "import cover"],
    "Trade surplus": ["trade surplus", "trade balance"],
    "US dollar": ["dollar", "usd", "cedi rate", "exchange rate", "cedi to the dollar", "forex"],
    "British pound": ["pound", "gbp", "sterling"],
    "Euro": ["euro", "eur"],
    "Nominal GDP": ["gdp", "size of the economy", "nominal gdp"],
    "Gold price": ["gold price", "gold"],
    "Cocoa world price": ["cocoa price", "cocoa"],
    "Cocoa farmgate price": ["farmgate", "farmer price", "cocoa farmer"],
    "BoG gold reserves": ["gold reserves", "bullion", "tonnes of gold"],
    "GSE Composite Index": ["stock market", "gse", "stock exchange", "shares"],
    "Business activity (PMI)": ["pmi", "business activity"],
    "Mobile money payments": ["mobile money", "momo"],
    "Remittances": ["remittance", "diaspora", "money sent home"],
    "Bank bad-loan ratio": ["bad loans", "npl", "non performing"],
    "Petrol": ["petrol", "fuel", "pump price", "gasoline"],
    "Diesel": ["diesel"],
    "Cooking gas (LPG)": ["lpg", "cooking gas", "gas cylinder"],
    "Daily minimum wage": ["minimum wage", "daily wage"],
    "Electricity tariff change": ["electricity", "tariff", "power price", "light bill"],
    "Unemployment rate": ["unemployment", "jobless", "jobs"],
    "Income per person": ["income per person", "gni per capita", "average income"],
    "Multidimensional poverty": ["poverty", "poor"]
  };

  function alfFindReading(q) {
    let best = null;
    for (const [label, words] of Object.entries(ALF_WORDS)) {
      for (const w of words) {
        if (q.includes(w) && (!best || w.length > best.w.length)) best = { label, w };
      }
    }
    if (!best) {
      const hit = allItems.find(i => q.includes(i.label.toLowerCase()));
      if (hit) return hit;
      return null;
    }
    return allItems.find(i => i.label === best.label) || null;
  }

  const alfReadingAnswer = it => {
    const u = unitBits(it);
    const points = seriesOf(it);
    const long = HIST[HIST_ALIAS[it.label] || it.label];
    const prev = points.length > 1 ? points[points.length - 2] : null;
    const move = prev ? it.value - prev.value : 0;
    const trend = prev
      ? t(move > 0 ? "reading.up" : move < 0 ? "reading.down" : "reading.flat",
          { from: showVal(prev.value, u), fromDate: esc(prev.date) })
      : "";
    const range = long
      ? t("reading.range", { since: esc(long.points[0].date),
          high: fmt(Math.max(...long.points.map(p => p.value)), 1),
          low: fmt(Math.min(...long.points.map(p => p.value)), 1) })
      : "";
    // the short note in data.js is written in English; it is shown only in English
    const note = alfLang === "en" && it.note ? `<span class="alf-note">${toneNote(it.note, it.tone)}</span>` : "";
    const nowQ = liveFor(it.label);
    const liveLine = nowQ
      ? `<span class="alf-note">${t("reading.live", { value: nowQ.key === "gold" ? `US$${fmt(nowQ.value, 0)}` : `GH¢${fmt(nowQ.value, 4)}`, time: esc(liveTime(nowQ.at)) })}</span>`
      : "";
    // a picture of where the figure has been, and a way through to the full detail.
    // Its own recent readings come first — they are closer to the figure being quoted than
    // an annual series that may end a year earlier.
    const chartPoints = points.length >= 4 ? points : ((long && long.points) || points);
    const chart = alfSpark(chartPoints, `${it.label} over time`);
    const src = it.seriesSource || it.autoSource || (long && long.source) || "";
    const from = src ? `<span class="alf-note">${t("reading.from", { source: esc(src), date: esc(it.date || "") })}</span>` : "";
    const open = readKey(it) ? `<button type="button" class="alf-open-read" data-detail="read:${readKey(it)}">${t("reading.open")}</button>` : "";
    return `${t("reading", { label: esc(L10N(it.label)), value: showVal(it.value, u), date: esc(it.date || "") })}
      ${liveLine}
      ${note}
      ${trend ? `<span class="alf-note">${trend}</span>` : ""}
      ${range ? `<span class="alf-note">${range}</span>` : ""}
      ${chart}${from}${open}`;
  };

  /* ---- how close two phrasings are, so a near miss can be offered back ---- */
  // Dice coefficient on character pairs: tolerant of typos and of endings ("inflashun",
  // "petrol prices"), and cheap enough to run over every figure name on every miss.
  const alfPairs = s => { const o = []; for (let i = 0; i < s.length - 1; i++) o.push(s.slice(i, i + 2)); return o; };
  function alfDice(a, b) {
    if (a === b) return 1;
    const A = alfPairs(a), B = alfPairs(b);
    if (!A.length || !B.length) return 0;
    const pool = new Map();
    A.forEach(g => pool.set(g, (pool.get(g) || 0) + 1));
    let hit = 0;
    B.forEach(g => { const n = pool.get(g) || 0; if (n > 0) { pool.set(g, n - 1); hit++; } });
    return 2 * hit / (A.length + B.length);
  }
  const ALF_STOP = new Set("the a an of for is are was were what how much many and or to in on at me my mine i you your tell show about please can could do does did give".split(" "));
  // every name a figure answers to, English plus the chosen language.
  // Built once per language rather than on every miss.
  let NAME_INDEX = null, NAME_INDEX_LANG = null;
  function alfNameIndex() {
    if (NAME_INDEX && NAME_INDEX_LANG === alfLang) return NAME_INDEX;
    const out = new Map();
    Object.entries(ALF_WORDS).forEach(([label, words]) => out.set(label, [label.toLowerCase(), ...words]));
    allItems.forEach(i => {
      const words = out.get(i.label) || [i.label.toLowerCase()];
      const local = L10N(i.label);
      if (local && local !== i.label) words.push(String(local).toLowerCase());
      out.set(i.label, words);
    });
    NAME_INDEX = out;
    NAME_INDEX_LANG = alfLang;
    return out;
  }
  // the closest figures to what was actually typed, best first
  function alfNear(q, n = 3) {
    const toks = alfNorm(q).split(" ").filter(w => w.length > 2 && !ALF_STOP.has(w));
    const tries = [];
    toks.forEach((w, i) => { tries.push(w); if (toks[i + 1]) tries.push(`${w} ${toks[i + 1]}`); });
    if (!tries.length) return [];
    const scored = [];
    alfNameIndex().forEach((words, label) => {
      let best = 0;
      words.forEach(p => tries.forEach(c => { const s = alfDice(c, p); if (s > best) best = s; }));
      if (best >= 0.5) scored.push({ label, best });
    });
    return scored.sort((a, b) => b.best - a.best).slice(0, n).map(s => s.label);
  }

  /* ---- a small chart, sized for a chat bubble ---- */
  function alfSpark(points, alt) {
    const pts = (points || []).filter(p => typeof p.value === "number").slice(-24);
    if (pts.length < 3) return "";
    const vals = pts.map(p => p.value);
    const min = Math.min(...vals), max = Math.max(...vals), span = (max - min) || 1;
    const W = 208, H = 46, P = 4;
    const x = i => P + i * (W - 2 * P) / (pts.length - 1);
    const y = v => H - P - (v - min) / span * (H - 2 * P);
    const d = pts.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join("");
    const rising = vals[vals.length - 1] >= vals[0];
    return `<span class="alf-chart">
      <svg class="alf-spark ${rising ? "up" : "down"}" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(alt || "")}">
        <path class="alf-spark-area" d="${d}L${x(pts.length - 1).toFixed(1)},${H - P}L${x(0).toFixed(1)},${H - P}Z"/>
        <path class="alf-spark-line" d="${d}"/>
        <circle class="alf-spark-dot" cx="${x(pts.length - 1).toFixed(1)}" cy="${y(vals[vals.length - 1]).toFixed(1)}" r="3"/>
      </svg>
      <span class="alf-spark-ends">${esc(pts[0].date)} — ${esc(pts[pts.length - 1].date)}</span>
    </span>`;
  }

  /* ---- what he was last talking about, so a follow-up makes sense ---- */
  let alfLast = { item: null, country: null };
  const alfForget = () => { alfLast = { item: null, country: null }; };

  // the long annual series for a figure, or its own recent readings
  const alfSeriesFor = it => {
    const long = HIST[HIST_ALIAS[it.label] || it.label];
    const own = seriesOf(it);
    return (long && long.points && long.points.length > own.length) ? long.points : own;
  };

  // "and last year?", "why?", "where is that from?" — only reached when nothing else matched
  function alfFollowUp(q) {
    const it = alfLast.item;
    if (!it) return null;
    const u = unitBits(it);
    const label = esc(L10N(it.label));

    if (/^(why|why is|why was|how come)\b/.test(q)) {
      const pts = seriesOf(it);
      const prev = pts.length > 1 ? pts[pts.length - 2] : null;
      const move = prev ? it.value - prev.value : 0;
      const trend = prev
        ? `<span class="alf-note">${T(move > 0 ? "reading.up" : move < 0 ? "reading.down" : "reading.flat", { from: showVal(prev.value, u), fromDate: esc(prev.date) })}</span>`
        : "";
      return `${T("follow.why", { label })} ${it.note && alfLang === "en" ? toneNote(it.note, it.tone) : ""}${trend}${alfSourceLine(it)}`.trim();
    }

    if (/(source|where.*(from|get)|who says|who published|is it true)/.test(q))
      return `${T("follow.source", { label })} ${alfSourceLine(it) || esc(it.date || "")}`;

    if (/(last year|a year ago|year before|previously|earlier|before that|what about (the )?(past|history)|since when|trend|history)/.test(q))
      return alfChangeAnswer(it, q);

    if (/(high|highest|peak|record|low|lowest|worst|best|weakest|strongest|cheapest|dearest|most expensive)/.test(q))
      return alfExtremeAnswer(it, q);

    if (/^(and|what about|how about|ok|okay)\b/.test(q) && q.split(" ").length <= 4)
      return alfReadingAnswer(it);

    return null;
  }

  const alfSourceLine = it => {
    const src = it.seriesSource || it.autoSource || (HIST[HIST_ALIAS[it.label] || it.label] || {}).source || "";
    return src ? `<span class="alf-note">${T("reading.from", { source: esc(src), date: esc(it.date || "") })}</span>` : "";
  };

  // a gap between two readings of the same figure: percentages move in points, not per cent
  const alfGap = (diff, it, u) =>
    (it.unit || "").trim() === "%" ? `${fmt(Math.abs(diff), 1)} points` : showVal(Math.abs(diff), u);

  // how a figure has moved: to a named year if one is given, otherwise a year back.
  // The "now" end is always the figure published on the page, never the last point of an
  // annual series that may stop a year short of it.
  function alfChangeAnswer(it, q) {
    const pts = alfSeriesFor(it);
    if (pts.length < 2) return null;
    const u = unitBits(it);
    const yearOf = p => +((String((p || {}).date || "").match(/\b(19|20)\d{2}\b/) || [])[0] || 0);
    const now = { date: it.date || (pts[pts.length - 1] || {}).date, value: it.value };
    const nowYear = yearOf(now);
    const wanted = (q.match(/\b(19|20)\d{2}\b/) || [])[0];

    let then = null;
    if (wanted) then = pts.filter(p => String(p.date).includes(wanted)).slice(-1)[0] || null;
    if (!then && nowYear) then = pts.filter(p => yearOf(p) === nowYear - 1).slice(-1)[0] || null;
    if (!then) then = pts.filter(p => yearOf(p) < nowYear).slice(-1)[0] || pts[Math.max(0, pts.length - 13)];
    if (!then || then.date === now.date) return null;

    const diff = now.value - then.value;
    // a relative percentage on top of a figure already measured in per cent reads as a second,
    // different number for the same move, so it is only shown for levels and money
    const pct = (it.unit || "").trim() !== "%" && then.value ? Math.abs(diff / then.value) * 100 : null;
    const line = pts.some(p => p.date === now.date) ? pts : [...pts, now];
    return `${T("change", {
      label: esc(L10N(it.label)), from: showVal(then.value, u), fromDate: esc(then.date),
      to: showVal(now.value, u), toDate: esc(now.date),
      direction: T(diff > 0 ? "rose" : diff < 0 ? "fell" : "held"),
      gap: alfGap(diff, it, u)
    })}${pct !== null && isFinite(pct) ? ` <span class="alf-note">${T("change.pct", { pct: fmt(pct, 1) })}</span>` : ""}
      ${alfSpark(line, `${it.label} over time`)}${alfOpenLink(it)}`;
  }

  // the high or low of a figure across everything the site holds
  function alfExtremeAnswer(it, q) {
    const pts = alfSeriesFor(it);
    if (pts.length < 3) return null;
    // "weakest" for a currency means the most cedis per dollar, so it belongs with the highs
    const wantLow = /(low|lowest|least|smallest|best|strongest|cheapest)/.test(q) && !/(high|highest|peak|record|worst|weakest|dearest|most expensive)/.test(q);
    const pick = pts.reduce((a, b) => (wantLow ? (b.value < a.value ? b : a) : (b.value > a.value ? b : a)));
    const u = unitBits(it);
    const now = { date: it.date || (pts[pts.length - 1] || {}).date, value: it.value };
    const line = pts.some(p => p.date === now.date) ? pts : [...pts, now];
    return `${T(wantLow ? "extreme.low" : "extreme.high", {
      label: esc(L10N(it.label)), value: showVal(pick.value, u), date: esc(pick.date),
      since: esc(pts[0].date), now: showVal(it.value, u), nowDate: esc(it.date || "")
    })} ${alfSpark(line, `${it.label} over time`)}${alfOpenLink(it)}`;
  }

  const alfOpenLink = it => {
    const key = readKey(it);
    return key ? `<button type="button" class="alf-open-read" data-detail="read:${key}">${T("reading.open")}</button>` : "";
  };

  /* ---- two figures at once ---- */
  const ALF_SPLIT = /\bvs\.?\b|\bversus\b|\bcompared (?:to|with)\b|\bagainst\b|\bor\b|\bthan\b|\bminus\b|\band\b/;
  function alfCompare(q) {
    // the classic one first: is money actually earning anything above inflation?
    const pol = readBy("BoG policy rate"), infl = readBy("Inflation");
    if (pol && infl && /(real (interest )?rate|above inflation|beat(s|ing)? inflation|ahead of inflation|policy rate.*inflation|inflation.*policy rate)/.test(q)) {
      const real = pol.value - infl.value;
      return T("real.rate", {
        policy: fmt(pol.value, 1), policyDate: esc(pol.date || ""),
        inflation: fmt(infl.value, 1), inflationDate: esc(infl.date || ""),
        real: fmt(Math.abs(real), 1), direction: T(real >= 0 ? "above" : "below")
      });
    }
    const parts = q.split(ALF_SPLIT);
    if (parts.length < 2) return null;
    const a = alfFindReading(parts[0]);
    const b = alfFindReading(parts.slice(1).join(" "));
    if (!a || !b || a === b) return null;
    const ua = unitBits(a), ub = unitBits(b);
    const same = (a.unit || "") === (b.unit || "");
    const gap = same
      ? ` <span class="alf-note">${T("compare.gap", {
          higher: esc(L10N(a.value >= b.value ? a.label : b.label)),
          gap: showVal(Math.abs(a.value - b.value), ua)
        })}</span>` : "";
    alfLast.item = a;
    return `${T("compare", {
      a: esc(L10N(a.label)), av: showVal(a.value, ua), ad: esc(a.date || ""),
      b: esc(L10N(b.label)), bv: showVal(b.value, ub), bd: esc(b.date || "")
    })}${gap}`;
  }

  function alfAnswer(raw) {
    const local = alfLocalIntents(raw);
    let q = alfNorm(`${raw} ${local.tags.join(" ")}`);
    const t0 = Date.now();
    const t = t0;
    if (!q) return null;

    // manners first, so "thank you Alfredo" is taken as thanks and not as his name
    if (local.hit.has("thanks") || /\b(thanks|thank you|thank u|thankyou|thx|i appreciate|much obliged|well done|good job|nice one)\b/.test(q))
      return T("thanks");

    // apostrophes are stripped before matching, so "that's all" arrives as "that s all"
    if (local.hit.has("bye") || /\b(bye|goodbye|good bye|see you|goodnight|good night|that s all|thats all|i m done|im done|nothing else|no more questions)\b/.test(q))
      return T("bye");

    if (local.hit.has("howareyou") || /\b(how are you|how you dey|how far|are you (ok|well|fine)|hope you are well)\b/.test(q))
      return T("howareyou");

    // His name. Said on its own it is someone calling him, and he answers at once. Said as
    // part of a real question — "Alfredo, what is inflation?" — the name is dropped and the
    // question answered, which is what the person actually wanted.
    if (/\balfredo\b/.test(q)) {
      const rest = q.replace(/\b(alfredo|hi|hello|hey|yo|ok|okay|please|oh|eh)\b/g, " ").replace(/[^a-z0-9%]+/g, " ").trim();
      if (!rest || rest.length < 4) return T("iam");
      q = q.replace(/\balfredo\b/g, " ").replace(/\s+/g, " ").trim();
    }

    if (local.greet || /^(hi|hello|hey|good (morning|afternoon|evening)|ete sen|akwaaba)\b/.test(q))
      return T("hello");

    if (local.help || /(help|what can you|how do you work|who are you)/.test(q))
      return T("help", { count: allItems.length });

    // the live counters
    if (/(debt per person|each person|per capita|how much do i owe|每)/.test(q) || (/per person/.test(q) && /debt/.test(q)))
      return T("debt.percap", { value: alfMoney(LIVE.percap[0](t)), pop: fmt(popAt(t), 0) });

    if (/(household|my family|family of)/.test(q)) {
      const n = +(q.match(/(\d+)\s*(people|person|member)/) || [])[1] || household;
      return T("debt.household", { n, share: alfMoney(debtAt(t) / popAt(t) * n), ytd: alfMoney((debtAt(t) - P.total) / popAt(t) * n) });
    }

    // "debt to gdp" begins with the word debt but is a question about the ratio, handled below
    if ((/(total debt|public debt|how much (does|do) ghana owe|debt (right )?now|national debt|what is the debt|how much debt|the debt)/.test(q) || /^debt\b/.test(q)) && !/(gdp|ratio|per cent of|percent of)/.test(q))
      return T("debt.total", { now: alfMoney(debtAt(t)), latestLabel: esc(L.label), latest: alfMoney(L.total), perSecond: `${sym()}${fmt(money(rate.total), 0)}`, prevLabel: esc(P.label) });

    if (/(domestic debt|owed at home)/.test(q)) return T("debt.domestic", { value: alfMoney(LIVE.dom[0](t)), share: fmt(L.domestic / L.total * 100, 1), label: esc(L.label) });
    if (/(external debt|foreign debt|owed abroad)/.test(q)) return T("debt.external", { value: alfMoney(LIVE.ext[0](t)), share: fmt(100 - L.domestic / L.total * 100, 1) });
    if (/(debt to gdp|debt-to-gdp|ratio)/.test(q)) return T("debt.ratio", { live: fmt(LIVE.ratio[0](t), 1), reported: fmt(D.debt.ratioLatest, 1), label: esc(L.label), peak: fmt(D.debt.ratioPeak.value, 1), peakLabel: esc(D.debt.ratioPeak.label) });
    if (/(borrowed today|today'?s borrowing)/.test(q)) return T("debt.today", { value: alfMoney(LIVE.today[0](t)) });
    if (/(this year|so far this year|ytd)/.test(q) && /(borrow|debt)/.test(q)) return T("debt.ytd", { value: alfMoney(LIVE.ytd[0](t)), label: esc(P.label) });
    if (/(per second|every second|how fast)/.test(q)) return T("debt.rate", { perSecond: `${sym()}${fmt(money(rate.total), 0)}`, perDay: `${sym()}${fmt(money(rate.total * DAY) / 1e6, 1)}`, prevLabel: esc(P.label), latestLabel: esc(L.label) });
    if (/(population|how many people|how many ghanaians)/.test(q)) return T("population", { pop: fmt(popAt(t), 0), source: esc(D.population.source), base: fmt(D.population.base / 1e6, 1), growth: fmt(D.population.growth * 100, 1) });

    // how it works
    if (/(how (is|are) .*(worked out|calculated|estimated)|where do.*numbers|is it real|accurate|guess)/.test(q))
      return T("method", { label: esc(L.label), months: D.debt.paceMonths });

    // budget
    if (/(budget|revenue|spending|tax|interest)/.test(q) && !/inflation/.test(q)) {
      const line = /tax/.test(q) ? "tax" : /interest/.test(q) ? "int" : /wage/.test(q) ? "wage" : /capital/.test(q) ? "cap" : /revenue|income/.test(q) ? "rev" : "exp";
      const b = budgetItems.find(x => x.key === line);
      if (b) return `${T("budget", { label: esc(L10N(b.label)), value: alfMoney(b.value), year: Y, toDate: alfMoney(b.value * yearFrac(t)) })}${alfLang === "en" && b.note ? ` <span class="alf-note">${esc(b.note)}</span>` : ""}`;
    }

    // trade
    if (/(export|import|trade)/.test(q)) {
      const surplus = readBy("Trade surplus").value ?? 0;
      return T("trade", { exports: fmt(D.trade.totalExports, 1), period: esc(D.trade.period), gold: fmt(D.trade.goldExports, 1), imports: fmt(D.trade.totalExports - surplus, 1), surplus: fmt(surplus, 1) });
    }

    // the calendar
    if (/(holiday|next holiday|public holiday|independence|founder|when is)/.test(q)) {
      const next = calendarFrom(dayStart(t), 3);
      if (next.length) return T("calendar", { list: next.map(e => T("calendar.item", { name: esc(e.entry.name), date: esc(calDateFmt(e.at)) })).join(", ") });
    }

    // news
    if (/(news|headline|what'?s happening|story)/.test(q)) {
      const items = newsItems().slice(0, 3);
      if (items.length) return `${T("news")}<ul class="alf-list">${items.map(n => `<li><a href="${esc(n.link)}" target="_blank" rel="noopener">${esc(n.title)}</a> <span class="alf-date">${esc(n.source)}</span></li>`).join("")}</ul>`;
    }

    // Africa comparison
    const AFRICA = africaData();
    const africaList = AFRICA ? Object.entries(AFRICA.countries).map(([iso, c]) => ({ iso, ...c, value: c.latest.value })).sort((a, b) => a.value - b.value) : [];
    const namedCountry = africaList
      .filter(c => new RegExp(`\\b${c.name.toLowerCase().replace(/[^a-z ]/g, ".")}\\b`).test(q))
      .sort((a, b) => b.name.length - a.name.length)[0];
    if (AFRICA && (namedCountry || /(africa|african|compare.*countr|other countries|region)/.test(q))) {
      const list = africaList;
      const gh = AFRICA.countries.GHA;
      const named = namedCountry;
      if (named && named.iso !== "GHA") {
        alfLast.country = named;
        const diff = gh.latest.value - named.value;
        const per = p => esc(p.latest.period || p.latest.year || "");
        const size = named.gdp ? ` <span class="alf-note">${T("africa.gdp", { country: esc(named.name), gdp: fmt(named.gdp.value, named.gdp.value < 10 ? 1 : 0), year: esc(named.gdp.year) })}</span>` : "";
        return T("africa.country", { country: esc(named.name), value: fmt(named.value, 1), period: per(named), ghana: fmt(gh.latest.value, 1), ghanaPeriod: per(gh), gap: fmt(Math.abs(diff), 1), direction: T(diff > 0 ? "higher" : "lower") }) + size;
      }
      const rank = list.findIndex(c => c.iso === "GHA") + 1;
      return `${T("africa.rank", { ghana: fmt(gh.latest.value, 1), period: esc(gh.latest.period || gh.latest.year || ""), rank: ordinal(list.length - rank + 1), count: list.length, highest: esc(list[list.length - 1].name), highestValue: fmt(list[list.length - 1].value, 1), lowest: esc(list[0].name), lowestValue: fmt(list[0].value, 1) })} <a href="#africa">${T("africa.open")}</a>.`;
    }

    // two figures at once: "the policy rate against inflation", "petrol or diesel"
    const two = alfCompare(q);
    if (two) return two;

    // any published reading, with its history
    const it = alfFindReading(q);
    if (it) {
      alfLast.item = it;
      if (/(chang|mov|ris|ros|fall|fell|since|a year ago|last year|trend|history|over time)/.test(q)) {
        const moved = alfChangeAnswer(it, q);
        if (moved) return moved;
      }
      if (/(high|highest|peak|record|low|lowest|worst|best|weakest|strongest|cheapest|dearest|most expensive)/.test(q)) {
        const ext = alfExtremeAnswer(it, q);
        if (ext) return ext;
      }
      return alfReadingAnswer(it);
    }

    // nothing named at all: it may be following on from the last answer
    const follow = alfFollowUp(q);
    if (follow) return follow;

    return null;
  }

  // A wall display can be left open for days. Keeping every message would grow the page
  // without limit, so the oldest fall away once the conversation is long — well past
  // anything a reader would scroll back through.
  const ALF_LOG_MAX = 60;
  function alfSay(who, html) {
    const div = document.createElement("div");
    div.className = `alf-msg ${who}`;
    div.innerHTML = html;
    alfLog.appendChild(div);
    while (alfLog.children.length > ALF_LOG_MAX) alfLog.removeChild(alfLog.firstChild);
    alfLog.scrollTop = alfLog.scrollHeight;
    return div;
  }

  async function alfAsk(question) {
    alfSay("you", esc(question));
    const local = alfAnswer(question);
    if (local) { alfSay("alf", local); speak(local); return; }

    if (!ALF.apiUrl) {
      // a dead end helps nobody: offer the figures closest to what was actually asked
      const near = alfNear(question);
      noteMiss(question, near);
      if (near.length) {
        const chips = near.map(l => `<button type="button" class="alf-guess" data-ask="${esc(l)}">${esc(L10N(l))}</button>`).join("");
        const lead = T("unknown.near");
        alfSay("alf", `${lead}<span class="alf-guesses">${chips}</span>`);
        speak(lead);
        return;
      }
      const miss = T("unknown", { count: allItems.length });
      alfSay("alf", miss);
      speak(miss);
      return;
    }
    const waiting = alfSay("alf", `<span class="alf-wait">Asking…</span>`);
    try {
      const res = await fetch(ALF.apiUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question, context: alfContext() })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      waiting.innerHTML = esc(data.answer || "No answer came back.").replace(/\n/g, "<br>");
      speak(waiting.innerHTML);
    } catch (e) {
      waiting.innerHTML = `I couldn't reach the assistant just then. Everything on the dashboard I can still answer myself.`;
    }
  }

  // Questions Alfredo could not answer, kept in this browser only so the person running the
  // site can see what people actually ask and teach him those words. Nothing is sent anywhere.
  function noteMiss(question, near) {
    try {
      const list = JSON.parse(recall("alf.misses") || "[]");
      list.unshift({ q: String(question).slice(0, 140), at: new Date().toISOString(), lang: alfLang, near });
      remember("alf.misses", JSON.stringify(list.slice(0, 40)));
    } catch (e) { /* private window, or storage full: not worth interrupting the answer */ }
  }
  // a declaration, not a const: the status page renders before this block is reached
  function alfMisses() { try { return JSON.parse(recall("alf.misses") || "[]"); } catch (e) { return []; } }

  // tapping one of the "did you mean" chips asks that question properly
  alfLog.addEventListener("click", e => {
    const b = e.target.closest("button[data-ask]");
    if (b) alfAsk(b.dataset.ask);
  });

  // what an external assistant would need to answer well
  function alfContext() {
    const t = Date.now();
    return {
      updated: D.checked,
      debt: { estimate: Math.round(debtAt(t)), latestReading: L.total, latestLabel: L.label, perSecond: Math.round(rate.total), ratio: D.debt.ratioLatest },
      population: Math.round(popAt(t)),
      budget: Object.fromEntries(budgetItems.map(b => [b.label, b.value])),
      trade: D.trade,
      readings: allItems.map(i => ({ label: i.label, value: i.value, unit: i.unit, date: i.date }))
    };
  }

  /* ---- Alfredo out loud, and listening ---- */
  const synth = window.speechSynthesis || null;
  const Recogniser = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  let speakOn = recall("alf.speak") === "1";
  let listening = false, recogniser = null;

  const plainText = html => {
    const d = document.createElement("div");
    d.innerHTML = html;
    return (d.textContent || "").replace(/\s+/g, " ").trim();
  };
  // Which installed voice to use. A device usually has several English voices and no
  // Ghanaian one at all, so this tries the exact language, then any close relative the
  // language pack names, and only then falls back to English — saying so the first time.
  let saidNoVoice = {};

  // The Web Speech API doesn't say whether a voice is a man or a woman, so this matches the
  // names devices actually ship. It only sets the default — the chooser lists every voice.
  const MALE_NAMES = /\b(male|man|daniel|alex|fred|thomas|george|david|mark|ryan|james|oliver|arthur|gordon|nathan|aaron|reed|rocko|jamie|lee|rishi|guy|william|tom|john|paul|peter|eric|carlos|diego|kwame|kofi|samuel|michael|richard|christopher|brian|liam|noah|ethan|junior)\b/i;
  const FEMALE_NAMES = /\b(female|woman|samantha|victoria|karen|moira|tessa|fiona|serena|allison|ava|susan|zoe|kate|emma|olivia|sophia|amelie|joana|luciana|paulina|nora|ama|akua|abena|mary|sarah|linda|jenny|aria|michelle)\b/i;
  const isMale = v => MALE_NAMES.test(v.name || "") || (!FEMALE_NAMES.test(v.name || "") && /male/i.test(v.name || ""));
  // devices ship both a thin old voice and a fuller modern one under similar names
  const GOOD_VOICE = /\b(natural|neural|enhanced|premium|siri|google|online|eloquence)\b/i;
  const quality = v => (GOOD_VOICE.test(v.name || "") ? 2 : 0) + (v.localService === false ? 1 : 0);
  const bestOf = list => [...list].sort((a, b) => quality(b) - quality(a))[0];

  // voices worth offering for the language in play: its own first, then English
  function voicesFor(pack) {
    const all = (synth && synth.getVoices()) || [];
    if (!all.length) return [];
    const want = [(pack.speech || "en-GH").toLowerCase(), ...(pack.voiceHints || []).map(h => h.toLowerCase())];
    const near = all.filter(v => want.some(h => (v.lang || "").toLowerCase().startsWith(h.slice(0, 2))));
    const english = all.filter(v => (v.lang || "").toLowerCase().startsWith("en") && !near.includes(v));
    return [...near, ...english];
  }

  function chosenVoice(pack) {
    const list = voicesFor(pack);
    if (!list.length) return null;
    const saved = recall(`alf.voice.${alfLang}`);
    const match = saved && list.find(v => v.name === saved);
    if (match) return match;
    // a voice in the right language first; among those, a man's voice by default
    const want = [(pack.speech || "en-GH").toLowerCase(), ...(pack.voiceHints || []).map(h => h.toLowerCase())];
    const own = list.filter(v => want.some(h => (v.lang || "").toLowerCase().startsWith(h.slice(0, 2)) && h.slice(0, 2) !== "en"));
    const pool = own.length ? own : list;
    const men = pool.filter(isMale);
    return bestOf(men.length ? men : pool);        // the fullest-sounding man's voice available
  }

  function drawVoices() {
    const bar = $("alf-voicebar"), sel = $("alf-voice");
    if (!bar || !sel) return;
    const pack = LANGS[alfLang] || {};
    const list = voicesFor(pack);
    bar.hidden = list.length < 2;             // nothing to choose between
    if (bar.hidden) return;
    const current = chosenVoice(pack);
    sel.innerHTML = list.map(v => {
      const kind = isMale(v) ? "man" : FEMALE_NAMES.test(v.name || "") ? "woman" : "";
      return `<option value="${esc(v.name)}"${current && v.name === current.name ? " selected" : ""}>${esc(v.name)} · ${esc(v.lang)}${kind ? ` · ${kind}` : ""}</option>`;
    }).join("");
  }

  // Choosing a voice means walking every voice the device has installed, which on a laptop
  // can be a hundred or more. The answer only changes when the device's voice list changes,
  // so it is worked out once per language and kept.
  let VOICE_CACHE = {};
  function pickVoice(pack) {
    const voices = (synth && synth.getVoices()) || [];
    if (!voices.length) return { voice: null, matched: false };
    const key = `${pack.speech || "en-GH"}|${voices.length}`;
    if (!VOICE_CACHE[key]) VOICE_CACHE[key] = pickVoiceFresh(pack, voices);
    return VOICE_CACHE[key];
  }
  function pickVoiceFresh(pack, voices) {
    const want = (pack.speech || "en-GH").toLowerCase();
    // English entries in voiceHints are stand-ins, not a match — they must not suppress the
    // "no voice for this language" note, so they are left to the fallback below.
    const wantsEnglish = want.startsWith("en");
    const hints = [want, ...(pack.voiceHints || []).map(h => h.toLowerCase())]
      .filter(h => wantsEnglish || !h.startsWith("en"));
    for (const h of hints) {
      const exact = voices.find(v => (v.lang || "").toLowerCase().replace("_", "-") === h);
      if (exact) return { voice: exact, matched: true };
      const loose = voices.find(v => (v.lang || "").toLowerCase().startsWith(h.slice(0, 2)));
      if (loose) return { voice: loose, matched: true };
    }
    const english = voices.find(v => (v.lang || "").toLowerCase().startsWith("en-gh"))
      || voices.find(v => (v.lang || "").toLowerCase().startsWith("en-ng"))
      || voices.find(v => (v.lang || "").toLowerCase().startsWith("en-gb"))
      || voices.find(v => (v.lang || "").toLowerCase().startsWith("en"));
    return { voice: english || null, matched: false };
  }

  // If data.js carries `alfredo.ttsUrl`, the text is sent there instead and whatever audio
  // comes back is played. That is where a Ghanaian text-to-speech service plugs in.
  async function speakThroughService(text, code) {
    const res = await fetch(ALF.ttsUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text, lang: code, speech: (LANGS[code] || {}).speech || code })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const type = res.headers.get("content-type") || "";
    let src;
    if (type.includes("application/json")) {
      const data = await res.json();
      src = data.audio || data.url;                 // a data: URI, or an address to play
      if (!src) throw new Error("no audio in the reply");
    } else {
      src = URL.createObjectURL(await res.blob());
    }
    const player = new Audio(src);
    await player.play();
  }

  // What gets read aloud, as against what is on screen. A chart's date range, the button
  // through to the history and the caveats underneath are all worth reading with the eye and
  // tedious to sit through, so the voice takes the answer itself and starts sooner for it.
  function spokenText(html) {
    const d = document.createElement("div");
    d.innerHTML = html;
    d.querySelectorAll("svg, .alf-spark-ends, .alf-open-read, .alf-guesses").forEach(n => n.remove());
    const lead = (d.textContent || "").replace(/\s+/g, " ").trim();
    if (lead.length <= 260) return lead;
    // a long answer: read to the end of the sentence that carries the figure
    const cut = lead.slice(0, 260).lastIndexOf(". ");
    return cut > 60 ? lead.slice(0, cut + 1) : lead.slice(0, 260);
  }

  function speak(html) {
    if (!speakOn) return;
    const text = spokenText(html);
    if (!text) return;
    const code = alfLang;
    const pack = LANGS[code] || {};

    if (ALF.ttsUrl) {
      speakThroughService(text, code).catch(() => speakWithDevice(text, pack, code));
      return;
    }
    speakWithDevice(text, pack, code);
  }

  function speakWithDevice(text, pack, code) {
    if (!synth) return;
    try {
      synth.cancel();
      const say = new SpeechSynthesisUtterance(text);
      const picked = chosenVoice(pack);
      const { voice: auto, matched } = pickVoice(pack);
      const voice = picked || auto;
      try { if (voice) say.voice = voice; } catch (e) { /* a stale voice: the browser picks its own */ }
      say.lang = voice ? voice.lang : "en-GB";
      say.rate = matched ? 0.98 : 0.94;             // a fraction slower when the voice is a stand-in
      synth.speak(say);
      if (!matched && code !== "en" && !saidNoVoice[code]) {
        saidNoVoice[code] = true;
        alfSay("alf", `<span class="alf-note">${T("voice.none", { language: pack.name || code })}</span>`);
      }
    } catch (e) { /* no voice on this device: the answer is on screen anyway */ }
  }
  if (synth && typeof synth.addEventListener === "function") synth.addEventListener("voiceschanged", () => { saidNoVoice = {}; VOICE_CACHE = {}; drawVoices(); });
  // Ask the browser for its voice list now rather than at the moment of the first answer:
  // on Chrome the first call is what triggers the list to load, and doing it here means the
  // first thing Alfredo says starts speaking straight away instead of after a pause.
  if (synth) { try { synth.getVoices(); } catch (e) { /* no voices on this device */ } }
  $("alf-voice").addEventListener("change", e => {
    remember(`alf.voice.${alfLang}`, e.target.value);
    const pack = LANGS[alfLang] || {};
    if (speakOn) speakWithDevice(`${(pack.strings || {})["ui.send"] || "Ask"}. ${T("hello").replace(/<[^>]*>/g, "").slice(0, 90)}`, pack, alfLang);
  });
  function setSpeak(on) {
    speakOn = on;
    remember("alf.speak", on ? "1" : "0");
    const b = $("alf-speak");
    b.setAttribute("aria-pressed", String(on));
    b.classList.toggle("on", on);
    if (!on && synth) synth.cancel();
  }

  function listen() {
    if (!Recogniser) { alfSay("alf", T("ui.micNone")); return; }
    if (listening) { try { recogniser.stop(); } catch (e) { /* already stopping */ } return; }
    recogniser = new Recogniser();
    recogniser.lang = (LANGS[alfLang] || {}).speech || "en-GH";
    recogniser.interimResults = false;
    recogniser.maxAlternatives = 1;
    const mic = $("alf-mic");
    const note = alfSay("alf", `<span class="alf-wait">${T("ui.listening")}</span>`);
    listening = true;
    mic.classList.add("on");
    const stop = () => { listening = false; mic.classList.remove("on"); };
    recogniser.onresult = e => {
      const said = (e.results[0] && e.results[0][0] && e.results[0][0].transcript || "").trim();
      note.remove();
      stop();
      if (said) alfAsk(said); else alfSay("alf", T("ui.noSpeech"));
    };
    recogniser.onerror = e => {
      note.remove();
      stop();
      if (e.error === "not-allowed" || e.error === "service-not-allowed") alfSay("alf", T("ui.micBlocked"));
      else if (e.error === "language-not-supported") {
        // no model for this language on the device: listen in English instead
        try {
          const again = new Recogniser();
          again.lang = "en-GH";
          again.onresult = ev => { const said = (ev.results[0][0].transcript || "").trim(); if (said) alfAsk(said); };
          again.start();
          listening = true; mic.classList.add("on");
          again.onend = stop;
          return;
        } catch (err) { /* fall through */ }
        alfSay("alf", T("ui.noSpeech"));
      } else if (e.error !== "aborted") alfSay("alf", T("ui.noSpeech"));
    };
    recogniser.onend = () => { note.remove(); stop(); };
    try { recogniser.start(); } catch (e) { note.remove(); stop(); }
  }

  /* ---- language chooser ---- */
  function drawLangs() {
    $("alf-langs").innerHTML = Object.entries(LANGS)
      .map(([code, l]) => `<button type="button" data-lang="${esc(code)}" class="${code === alfLang ? "on" : ""}" lang="${esc(code)}">${esc(l.name)}</button>`)
      .join("");
    drawVoices();
    alfInput.placeholder = T("ui.placeholder");
    $("alf-send").textContent = T("ui.send");
    $("alf-chips").innerHTML = alfSuggestions().map(x => `<button type="button">${esc(x)}</button>`).join("");
  }
  function setLang(code) {
    if (!LANGS[code]) return;
    alfLang = code;
    remember("alf.lang", code);
    drawLangs();
    newChat();
  }
  $("alf-langs").addEventListener("click", e => {
    const b = e.target.closest("button[data-lang]");
    if (b) setLang(b.dataset.lang);
  });
  function newChat() {
    if (synth) synth.cancel();
    alfForget();
    alfLog.innerHTML = "";
    const note = T("note.figures");
    alfSay("alf", T("greeting") + (note ? ` <span class="alf-note">${note}</span>` : ""));
    $("alf-chips").innerHTML = alfSuggestions().map(x => `<button type="button">${esc(x)}</button>`).join("");
    alfInput.value = "";
    setTimeout(() => alfInput.focus(), 40);
  }
  $("alf-new").addEventListener("click", newChat);
  $("alf-speak").addEventListener("click", () => setSpeak(!speakOn));
  if (Recogniser) $("alf-mic").hidden = false;
  $("alf-mic").addEventListener("click", listen);
  setSpeak(speakOn);
  drawLangs();

  function alfOpen(open) {
    alfEl.hidden = !open;
    $("alf-open").setAttribute("aria-expanded", String(open));
    if (!open && synth) synth.cancel();
    if (open) {
      if (!alfLog.children.length) {
        const note = T("note.figures");
        alfSay("alf", T("greeting") + (note ? ` <span class="alf-note">${note}</span>` : ""));
      }
      setTimeout(() => alfInput.focus(), 60);
    }
  }
  $("alf-open").addEventListener("click", () => alfOpen(alfEl.hidden));
  $("alf-close").addEventListener("click", () => alfOpen(false));
  $("alf-chips").addEventListener("click", e => {
    const b = e.target.closest("button");
    if (!b) return;
    alfAsk(b.textContent);
  });
  $("alf-form").addEventListener("submit", e => {
    e.preventDefault();
    const q = alfInput.value.trim();
    if (!q) return;
    alfInput.value = "";
    alfAsk(q);
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !alfEl.hidden && sheetEl.hidden) alfOpen(false);
  });


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

  /* ---- board view: everything the site holds, in rotation ---- */
  // The counters stay put at the top. The lower panel turns every 15 seconds so a wall
  // display eventually shows all of it: the debt, live rates, news, Africa, the papers and
  // the week's briefing. A panel with nothing behind it yet is left out rather than shown empty.
  function boardDeckPages() {
    const pages = [];
    const qs = liveQuotes();
    if (qs.length) {
      pages.push({ key: "live", tag: "Market, right now", html: `<div class="b-grid b-grid-5">${qs.slice(0, 5).map(q => {
        const dir = typeof q.prev === "number" ? (q.value > q.prev ? "up" : q.value < q.prev ? "down" : "") : "";
        return `<div class="b-cellule">
          <span class="b-label">${esc(q.key === "gold" ? "Gold, an ounce" : `${q.name} in cedis`)}</span>
          <span class="mono big ${dir}">${q.key === "gold" ? `US$${fmt(q.value, 0)}` : `GH¢${fmt(q.value, 4)}`}${dir ? `<i class="t-arrow">${dir === "up" ? "▲" : "▼"}</i>` : ""}</span>
          <span class="b-when">${esc(liveTime(q.at))}</span>
        </div>`;
      }).join("")}</div>` });
    }

    const news = newsItems().slice(0, 4);
    if (news.length) {
      pages.push({ key: "news", tag: "Ghana business news", html: `<ol class="b-heads">${news.map(n => `
        <li><span class="b-head-title">${esc(n.title)}</span><span class="b-when">${esc(n.source)} · ${esc(timeAgo(n.published))}</span></li>`).join("")}</ol>` });
    }

    const AF = africaData();
    if (AF && AF.countries && AF.countries.GHA) {
      const list = Object.values(AF.countries).filter(c => c.latest).sort((a, b) => a.latest.value - b.latest.value);
      const gh = AF.countries.GHA;
      const top = list.slice(-4).reverse(), low = list.slice(0, 3);
      const chip = c => `<span class="b-chip ${c.latest.value > gh.latest.value ? "high" : c.latest.value < gh.latest.value ? "low" : ""}"><b>${fmt(c.latest.value, 1)}%</b>${esc(c.name)}</span>`;
      pages.push({ key: "africa", tag: "Inflation across Africa", html: `
        <div class="b-africa">
          <div class="b-africa-gh">
            <span class="b-label">Ghana · ${esc(gh.latest.period || "")}</span>
            <span class="mono big gold">${fmt(gh.latest.value, 1)}%</span>
            <span class="b-when">${ordinal(list.length - list.findIndex(c => c === gh))} highest of ${list.length}</span>
          </div>
          <div class="b-africa-rows">
            <div><span class="b-label">Highest</span><div class="b-chips">${top.map(chip).join("")}</div></div>
            <div><span class="b-label">Lowest</span><div class="b-chips">${low.map(chip).join("")}</div></div>
          </div>
        </div>` });
    }

    const papers = (paperData().items || []);
    if (papers.length) {
      const byPaper = new Map();
      papers.forEach(i => { if (!byPaper.has(i.source)) byPaper.set(i.source, i); });
      pages.push({ key: "papers", tag: "Today's papers", html: `<div class="b-grid b-grid-3">${[...byPaper.entries()].slice(0, 3).map(([source, lead]) => `
        <div class="b-cellule b-paper">
          <span class="b-label">${esc(source)}</span>
          <span class="b-head-title">${esc(lead.title)}</span>
          <span class="b-when">${esc(timeAgo(lead.published))}</span>
        </div>`).join("")}</div>` });
    }

    // what things cost
    const costLabels = ["Petrol", "Diesel", "Cooking gas (LPG)", "Daily minimum wage", "Electricity tariff change"];
    const cost = costLabels.map(l => allItems.find(i => i.label === l)).filter(Boolean);
    if (cost.length) {
      pages.push({ key: "cost", tag: "What things cost", html: `<div class="b-grid b-grid-5">${cost.map(it => `
        <div class="b-cellule">
          <span class="b-label">${esc(it.label)}</span>
          <span class="mono big">${readValue(it)}</span>
          <span class="b-when">${esc(it.date || "")}</span>
        </div>`).join("")}</div>` });
    }

    // what lenders think
    if ((D.ratings || []).length) {
      pages.push({ key: "ratings", tag: "Credit ratings", html: `<div class="b-grid b-grid-3">${D.ratings.map(r => `
        <div class="b-cellule">
          <span class="b-label">${esc(r.agency)}</span>
          <span class="mono big gold">${esc(r.rating)}</span>
          <span class="b-when">${esc(r.outlook || "")} outlook · ${esc(r.date || "")}${r.note ? ` · ${esc(r.note)}` : ""}</span>
        </div>`).join("")}</div>` });
    }

    // the days ahead
    const ahead = calendarFrom(dayStart(Date.now()), 4);
    if (ahead.length) {
      pages.push({ key: "days", tag: "The days ahead", html: `<div class="b-grid b-grid-4">${ahead.map(e => `
        <div class="b-cellule">
          <span class="b-label">${esc(calDateFmt(e.at))}</span>
          <span class="b-head-title">${esc(e.entry.name)}</span>
          <span class="b-when">${e.entry.kind === "holiday" ? "Public holiday" : esc(e.entry.note || "Economic release")}</span>
        </div>`).join("")}</div>` });
    }

    // the world's markets
    const M = marketsData();
    const world = (M && M.world) || {};
    const pick = [...(world.commodities || []).slice(0, 3), ...(world.indices || []).slice(0, 2)];
    if (pick.length) {
      pages.push({ key: "world", tag: "World markets", html: `<div class="b-grid b-grid-5">${pick.map(q => `
        <div class="b-cellule">
          <span class="b-label">${esc(q.name)}</span>
          <span class="mono big ${moveClass(q.pct)}">${/US\$/.test(q.unit || "") ? "US$" : ""}${fmt(q.value, q.dec ?? 2)}</span>
          <span class="b-when">${moveMark(q.pct)} ${q.pct == null ? "" : `${q.pct > 0 ? "+" : ""}${fmt(q.pct, 2)}%`} · ${esc(quoteTime(q.at))}</span>
        </div>`).join("")}</div>` });
    }

    // the Accra exchange
    const gse = ((M && M.ghana) || {}).equities || [];
    if (gse.length) {
      const movers = [...gse].filter(e => typeof e.pct === "number").sort((a, b) => b.pct - a.pct);
      const idx = allItems.find(i => i.label === "GSE Composite Index");
      const show = [...movers.slice(0, 2), ...movers.slice(-2).reverse()];
      pages.push({ key: "gse", tag: "Ghana Stock Exchange", html: `<div class="b-grid b-grid-5">
        ${idx ? `<div class="b-cellule"><span class="b-label">GSE Composite Index</span><span class="mono big gold">${fmt(idx.value, 0)}</span><span class="b-when">${esc(idx.date || "")}</span></div>` : ""}
        ${show.map(e => `<div class="b-cellule">
          <span class="b-label">${esc(e.name || e.code)}</span>
          <span class="mono big ${moveClass(e.pct)}">GH¢${fmt(e.price, 2)}</span>
          <span class="b-when">${moveMark(e.pct)} ${e.pct > 0 ? "+" : ""}${fmt(e.pct, 2)}%</span>
        </div>`).join("")}
      </div>` });
    }

    // what the world's wires are carrying, in the same shape as the Ghana headlines panel
    const wworld = worldStories("global").slice(0, 4);
    if (wworld.length) {
      pages.push({ key: "wnews", tag: "Global news", html: `<ol class="b-heads">${wworld.map(n => `
        <li><span class="b-head-title">${esc(n.title)}</span><span class="b-when">${esc(n.source)} · ${esc(timeAgo(n.published))}</span></li>`).join("")}</ol>` });
    }

    // and what is being reported across Africa
    const wafrica = worldStories("africa").slice(0, 4);
    if (wafrica.length) {
      pages.push({ key: "anews", tag: "Across Africa", html: `<ol class="b-heads">${wafrica.map(n => `
        <li><span class="b-head-title">${esc(n.title)}</span><span class="b-when">${esc(n.source)} · ${esc(timeAgo(n.published))}</span></li>`).join("")}</ol>` });
    }

    const art = articleData()[0];
    if (art) {
      const points = (art.body || "").split(/\n/).filter(l => /^- /.test(l)).slice(0, 3).map(l => l.replace(/^- /, "").replace(/\*\*/g, ""));
      pages.push({ key: "brief", tag: `Briefing · ${esc(art.date)}`, html: `
        <div class="b-brief">
          <span class="b-head-title big">${esc(art.title)}</span>
          <span class="b-when">${esc(art.standfirst || "")}</span>
          ${points.length ? `<ul class="b-brief-points">${points.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
        </div>` });
    }
    return pages;
  }

  function renderBoardDeck() {
    const deck = $("b-deck");
    if (!deck) return;
    $$(".b-deck-page[data-built]").forEach(el => el.remove());
    const dots = $("b-deck-dots");
    boardDeckPages().forEach(p => {
      const el = document.createElement("div");
      el.className = "b-deck-page";
      el.dataset.deck = p.key;
      el.dataset.built = "1";
      el.innerHTML = `<span class="b-deck-tag">${p.tag}</span>${p.html}`;
      deck.insertBefore(el, dots);
    });
    const pages = $$(".b-deck-page");
    dots.innerHTML = pages.map((_, i) => `<i class="${i === boardDeckAt ? "on" : ""}"></i>`).join("");
    if (boardDeckAt >= pages.length) boardDeckAt = 0;
    pages.forEach((el, i) => el.classList.toggle("on", i === boardDeckAt));
  }

  let boardPage = 0, boardDeckAt = 0;
  setInterval(() => {
    if (board.hidden || !sheetEl.hidden || !alfEl.hidden) return;   // hold while someone is reading
    const strip = $$(".b-page");
    if (strip.length) {
      boardPage = (boardPage + 1) % strip.length;
      strip.forEach((p, i) => p.classList.toggle("on", i === boardPage));
    }
    const pages = $$(".b-deck-page");
    if (pages.length > 1) {
      boardDeckAt = (boardDeckAt + 1) % pages.length;
      pages.forEach((p, i) => p.classList.toggle("on", i === boardDeckAt));
      $$("#b-deck-dots i").forEach((d, i) => d.classList.toggle("on", i === boardDeckAt));
    }
  }, 15000);


  /* ================= refresh everything every minute ================= */
  // The whole page — dashboard figures, business news, today's papers, the Africa
  // board and the briefings — re-reads its own data files every minute.
  //
  // Files that feed the counters force a reload, because every figure on the page is
  // worked out from them. The portals are swapped in quietly instead: the file is
  // re-run, the open portal redrawn, and the reader keeps their place and filters.
  const REFRESH_MS = 1 * 60 * 1000;   // how often the page re-reads its data files
  (() => {
    if (!/^https?:/.test(location.protocol)) return;
    const RELOAD = ["data.js", "auto-data.js", "history-data.js"];
    const QUIET = {
      "news-data.js": () => {
        drawn.news = false; drawn.world = false;
        if (!VIEWS.news.el.hidden) renderNews();
        if (!VIEWS.world.el.hidden) renderWorld();      // the world headlines ride in this file
        if (!VIEWS.africa.el.hidden) renderAfrWire();
        if (!board.hidden) renderBoardDeck();
      },
      "papers-data.js": () => { drawn.papers = false; if (!VIEWS.papers.el.hidden) renderPapers(); if (!board.hidden) renderBoardDeck(); },
      "africa-data.js": () => { drawn.africa = false; if (!VIEWS.africa.el.hidden) renderAfrica(); if (!board.hidden) renderBoardDeck(); },
      "articles-data.js": () => { drawn.articles = false; if (!VIEWS.articles.el.hidden) renderArticles(); if (!board.hidden) renderBoardDeck(); },
      "world-data.js": () => {
        drawn.world = false;
        if (!VIEWS.world.el.hidden) renderWorld();
        if (!VIEWS.africa.el.hidden) renderAfrWire();
        if (!board.hidden) renderBoardDeck();
      },
      "markets-data.js": () => {
        drawn.markets = false;
        if (!VIEWS.markets.el.hidden) { renderMarkets(); renderGse(); }
        if (!board.hidden) renderBoardDeck();
      },
      "live-data.js": () => { renderTicker(); paintMarketLines(); if (!board.hidden) renderBoardDeck(); if (!VIEWS.status.el.hidden) renderStatus(); }
    };
    const fingerprints = new Map();
    let pending = false, busy = false;

    const hash = text => {
      let h = 5381;
      for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
      return `${text.length}:${h}`;
    };
    const changed = async file => {
      const res = await fetch(`${file}?t=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) throw new Error(res.status);
      const fp = hash(await res.text());
      const seen = fingerprints.get(file);
      fingerprints.set(file, fp);
      return !!seen && seen !== fp;
    };
    // re-run a data file in place, so window.GDC_* picks up the new figures
    const reload = file => new Promise((done, fail) => {
      const sc = document.createElement("script");
      sc.src = `${file}?t=${Date.now()}`;
      sc.onload = () => { sc.remove(); done(); };
      sc.onerror = () => { sc.remove(); fail(new Error("could not load")); };
      document.body.appendChild(sc);
    });

    async function check() {
      if (document.hidden || busy) return;
      busy = true;
      try {
        for (const file of RELOAD) {
          try { if (await changed(file)) { pending = true; break; } }
          catch (e) { /* offline, or mid-deploy: try again next minute */ }
        }
        if (!pending) {
          for (const [file, redraw] of Object.entries(QUIET)) {
            try { if (await changed(file)) { await reload(file); redraw(); } }
            catch (e) { /* leave the figures already on the page */ }
          }
        }
        // a full reload waits until the reader is not in the middle of something
        if (pending && sheetEl.hidden && board.hidden && alfEl.hidden) location.reload();
      } finally { busy = false; }
    }

    check();
    setInterval(check, REFRESH_MS);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) check(); });
  })();

  /* ================= start ================= */
  paintMoney();
  tick();
  fit();
  if (location.hash === "#board") openBoard(false);
  routeFromHash();
  renderNews();
  paintMarketLines();
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

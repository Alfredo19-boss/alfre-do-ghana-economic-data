/*
 * Alfredo presenter kit for Alfredo Ghana Economic Data.
 * The same presenting features as the Alfredo Ghana Economic Model:
 *   - click any number (the zoom-in cursor) to show it full screen with notes; running numbers keep moving
 *   - Talk to Alfredo hands-free, like a voice assistant, in the language picked in the Alfredo panel
 *   - Voice projector: say a figure ("inflation", "GDP") and it is put up on the screen
 *   - Edit tools: pen, highlighter, laser, arrow, box, circle, text, spotlight, magnifier,
 *     blank screen, timer, whiteboard, undo, redo
 *   - Sounds you can choose and turn down
 * Safe to remove: delete this file and its <script> line, and the site works as before.
 */
(function () {
  "use strict";
  if (window.top !== window) return;            // inside the Economic Model, which brings its own tools
  if (window.__alfPro) return; window.__alfPro = 1;
  var G = {"n":[["cpi","How fast prices across a basket of goods and services rose over the past twelve months.","It sets what wages and savings can actually buy, and it guides the Bank of Ghana’s interest rate decisions.",["inflation","cpi","consumer price","cost of living"]],["food","Yearly price rise for food and non-alcoholic drinks.","Food takes a large share of household spending, especially for poorer families.",["food inflation","food prices"]],["nonfood","Yearly price rise for everything except food, such as transport, housing and services.","It shows price pressure from fuel, the cedi and utility costs.",["non-food","non food"]],["mpr","The rate the Bank of Ghana sets to guide borrowing costs across the economy.","A lower rate can make loans cheaper. A higher rate is used to cool inflation.",["policy rate","interest rate","mpr","monetary policy"]],["usd","How many cedis one US dollar costs, at the Bank of Ghana’s interbank rate.","A weaker cedi makes imports, fuel and foreign debt payments dearer.",["dollar","cedi","exchange rate","usd"]],["tb91","The interest government pays to borrow for three months.","It is a benchmark for short-term borrowing and savings rates.",["t-bill","treasury bill","91-day","91 day"]],["lend","The average interest rate banks charge borrowers.","It affects whether businesses and households can afford to borrow.",["lending rate"]],["gdp","How much more the economy produced than a year earlier, after removing price changes.","Growth supports jobs, incomes and government revenue.",["gdp growth","economic growth","gdp","growth"]],["ciea","The Bank of Ghana’s monthly measure of activity, drawing on spending, credit, trade and production.","It gives an early signal before official GDP figures arrive.",["ciea","economic activity","composite index"]],["debt","Everything the government owes compared with the size of the economy in a year.","A higher ratio means less room to spend and greater risk if growth or the cedi weakens.",["debt to gdp","debt ratio","debt-to-gdp","debt"]],["debtbn","Total government domestic and external debt at the last published reading.","It is the amount on which interest and repayments are owed.",["public debt","total debt","national debt"]],["tax","Tax collected so far this year as a share of the economy.","It shows how much the state funds from its own resources.",["tax","tax revenue"]],["bal","Government revenue minus spending, leaving out interest payments.","A surplus helps bring debt down.",["primary balance","budget balance","fiscal balance"]],["unemp","The share of people who want work and can’t find it, as measured by Ghana Statistical Service.","It shows whether growth is reaching workers, especially young people.",["unemployment","jobless","jobs"]],["gold","The world price of one ounce of gold.","Gold is Ghana’s biggest export, so it drives foreign earnings and the cedi.",["gold"]],["cocoa","The world price of one tonne of cocoa.","Cocoa supports farm incomes and export earnings.",["cocoa"]],["brent","The world benchmark price of one barrel of crude oil.","It affects Ghana’s oil earnings as well as what people pay for fuel.",["brent","oil price","crude"]],["gir","Foreign currency and gold held by the Bank of Ghana.","Reserves pay for imports and help steady the cedi.",["reserves","foreign reserves","gross reserves"]],["ca","Ghana’s trade, income and transfers with the world, as a share of the economy.","A surplus means more foreign currency is coming in than going out.",["current account","balance of payments","bop"]],["momo","The value of mobile money payments in a month.","It shows how far digital payments have reached daily life and business.",["mobile money","momo"]],["npl","The share of bank loans not being repaid on time.","High levels make banks more careful about lending.",["bad loans","npl","non-performing"]]],"k":[["debt to gdp","debt"],["debt ratio","debt"],["public debt","live:debt"],["national debt","live:debt"],["total debt","live:debt"],["total gdp","m:Total GDP"],["nominal gdp","m:Total GDP"],["size of the economy","m:Total GDP"],["gdp","gdp"],["economic growth","gdp"],["growth rate","gdp"],["food inflation","food"],["non food inflation","nonfood"],["producer price","m:Producer price"],["producer inflation","m:Producer price"],["inflation","cpi"],["cost of living","cpi"],["exchange rate","usd"],["dollar","usd"],["cedi","usd"],["policy rate","mpr"],["interest rate","mpr"],["treasury bill","tb91"],["t-bill","tb91"],["lending rate","lend"],["reserves","gir"],["current account","m:Current account"],["balance of payments","m:Current account"],["trade balance","m:Trade balance"],["trade surplus","m:Trade balance"],["exports","m:Total exports"],["imports","m:Total imports"],["remittances","m:Remittances"],["foreign direct investment","m:Foreign direct"],["fdi","m:Foreign direct"],["money supply","m:Money supply"],["bank deposits","m:Bank deposits"],["deposits","m:Bank deposits"],["private sector credit","m:Private sector credit"],["credit growth","m:Private sector credit"],["capital adequacy","m:Bank capital"],["bad loans","npl"],["non-performing","npl"],["unemployment","unemp"],["jobless","unemp"],["gold price","gold"],["cocoa","cocoa"],["oil price","brent"],["brent","brent"],["crude","brent"],["mobile money","momo"],["momo","momo"],["purchasing managers","m:Purchasing"],["pmi","m:Purchasing"],["consumer confidence","m:Consumer confidence"],["business confidence","m:Business confidence"],["food insecurity","m:Food insecurity"],["industrial production","m:Industrial production"],["productivity","m:Productivity"],["terms of trade","m:Terms of trade"],["eurobond","m:Eurobond"],["tariff","m:Electricity and water"],["inequality","m:Inequality"],["gini","m:Inequality"],["primary balance","bal"],["budget balance","bal"],["tax revenue","tax"],["container","m:Container traffic"],["forest","m:Forest area"]]};
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var store = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  var RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var lang = function () { var c = store.get("alf.lang") || "en", L = window.GDC_LANG || {}; return { code: c, speech: (L[c] && L[c].speech) || "en-GH" }; };

  /* ---------- sound ---------- */
  var SND = { on: true, vol: 0.4, pack: "classic", ctx: null };
  try { var sv = JSON.parse(store.get("alfredoSound") || "null"); if (sv) { SND.on = sv.on !== false; SND.vol = sv.vol != null ? sv.vol : 0.4; SND.pack = sv.pack || "classic"; } } catch (e) {}
  var PACKS = { classic: ["sine", [660, 880], [520, 390], 1320], chimes: ["triangle", [784, 1175], [988, 659], 1568], marimba: ["sine", [523, 659], [659, 440], 880], digital: ["square", [880, 1320], [660, 440], 1760], soft: ["sine", [440, 554], [494, 370], 740] };
  var PACKN = { classic: "Classic", chimes: "Chimes", marimba: "Marimba", digital: "Digital", soft: "Soft" };
  function tone(f, t0, d, type, g) {
    var c = SND.ctx, o = c.createOscillator(), a = c.createGain();
    o.type = type; o.frequency.value = f; a.gain.setValueAtTime(0.0001, t0);
    a.gain.exponentialRampToValueAtTime(Math.max(0.0002, g * SND.vol), t0 + 0.012);
    a.gain.exponentialRampToValueAtTime(0.0001, t0 + d); o.connect(a); a.connect(c.destination); o.start(t0); o.stop(t0 + d + 0.02);
  }
  function sfx(kind) {
    if (!SND.on || SND.vol <= 0) return;
    try {
      SND.ctx = SND.ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (SND.ctx.state === "suspended") SND.ctx.resume();
      var P = PACKS[SND.pack] || PACKS.classic, t = SND.ctx.currentTime, g = P[0] === "square" ? 0.05 : 0.16;
      if (kind === "open") { tone(P[1][0], t, 0.18, P[0], g); tone(P[1][1], t + 0.07, 0.26, P[0], g); }
      else if (kind === "close") { tone(P[2][0], t, 0.16, P[0], g); tone(P[2][1], t + 0.06, 0.22, P[0], g); }
      else if (kind === "listen") { tone(P[1][1], t, 0.12, "sine", g); }
      else tone(P[3], t, 0.06, P[0], g * 0.6);
    } catch (e) {}
  }
  function sndSave() { store.set("alfredoSound", JSON.stringify({ on: SND.on, vol: SND.vol, pack: SND.pack })); }

  /* ---------- finding a figure and its label ---------- */
  var NUM = /(?:GH¢|US\$|GHS|€|£|\$)?\s?[−\-+]?\d[\d,]*(?:\.\d+)?\s?(?:%|×|bn|tn|m\b|billion|million|trillion|pp)?/g;
  var NOZOOM = "a,button,input,select,textarea,label,summary,[role=tab],nav,.alfredo,#alfredo,#ap-o,#ap-bar,#ap-wb,#ap-talk,#ap-tm,#ap-snd,.sheet,#sheet,svg,.ticker";
  function walk(el) { return (el.textContent || "").replace(/\s+/g, " ").trim(); }
  function pick(t) {
    var led = t.closest && t.closest(".led"); if (led) { var lit = led.querySelector(".lit"); if (lit) return lit; }
    return t;
  }
  function cleanText(e) { var c = e.cloneNode(true); [].forEach.call(c.querySelectorAll(".chip,.badge,.pill,[class*=status],[class*=live]"), function (x) { x.remove(); }); return walk(c); }
  function firstLine(e) { if (e.matches && e.matches(".k,.t-name,.label,[class*=label],h2,h3,h4,dt")) return cleanText(e); var own = [].filter.call(e.childNodes, function (n) { return n.nodeType === 3; }).map(function (n) { return n.nodeValue; }).join(" ").replace(/\s+/g, " ").trim(); if (own.length > 3) return own; return cleanText(e); }
  var CUR = /^(GH¢|US\$|GHS|€|£|\$|USD|GH₵)$/;
  function labelFor(el) {
    var me = walk(el), a = el, i;
    for (i = 0; i < 6 && a && a !== document.body; i++) {
      var c = a.querySelectorAll ? a.querySelectorAll(".k,.t-name,.label,[class*=label],[class*=title],h2,h3,h4,dt,figcaption,.ms-what,.eyebrow,[class*=eyebrow]") : [];
      for (var j = 0; j < c.length; j++) { var own = [].filter.call(c[j].childNodes, function (n) { return n.nodeType === 3; }).map(function (n) { return n.nodeValue; }).join(" ").replace(/\s+/g, " ").trim(), s = cleanText(c[j]); if (s && s.length < 90 && !CUR.test(s) && s !== me && c[j] !== el && !c[j].contains(el) && !/^[\d\s.,%¢$€£+\-−×]+$/.test(s)) return s; }
      var p = a.previousElementSibling;
      while (p) { var pk = p.querySelector && p.querySelector(".k,.t-name,.label,[class*=label],h2,h3,h4,dt"), ps = firstLine(pk || p); if (ps && ps.length < 90 && !CUR.test(ps) && !/^[\d\s.,%¢$€£+\-−×]+$/.test(ps) && !p.classList.contains("ghost")) return ps; p = p.previousElementSibling; }
      a = a.parentElement;
    }
    var sec = el.closest("section,article"); var h = sec && sec.querySelector("h2,h3"); return h ? walk(h) : "Alfredo Ghana Economic Data";
  }
  function noteFor(label) {
    var l = " " + label.toLowerCase() + " ", best = null, bl = 0;
    (G ? G.n : []).forEach(function (n) { (n[3] || []).forEach(function (a) { if (l.indexOf(a.toLowerCase()) >= 0 && a.length > bl) { best = n; bl = a.length; } }); });
    return best ? { w: best[1], y: best[2] } : null;
  }
  function tokenAt(x, y, t) {
    var r = null;
    if (document.caretRangeFromPoint) r = document.caretRangeFromPoint(x, y);
    else if (document.caretPositionFromPoint) { var cp = document.caretPositionFromPoint(x, y); if (cp) { r = document.createRange(); r.setStart(cp.offsetNode, cp.offset); } }
    if (r && r.startContainer.nodeType === 3 && t.contains(r.startContainer)) {
      var s = r.startContainer.nodeValue, o = r.startOffset, m; NUM.lastIndex = 0;
      while ((m = NUM.exec(s))) { if (o >= m.index - 1 && o <= m.index + m[0].length + 1 && /\d/.test(m[0])) return m[0].trim(); if (m.index === NUM.lastIndex) NUM.lastIndex++; }
    }
    var w = walk(t); NUM.lastIndex = 0; var mm = w.match(NUM); if (mm) { mm = mm.filter(function (v) { return /\d/.test(v); }); if (mm.length === 1) return mm[0].trim(); }
    return null;
  }
  function isNumeric(s) { return /\d/.test(s) && s.replace(NUM, "").replace(/[\s·,()a-z]/gi, "").length < 3; }


  /* ---------- history beside a figure ---------- */
  var LONGL = { population: "population", exports: "exports", imports: "imports", balance: "trade balance", gdp: "gdp", tax: "tax revenue", revenue: "government revenue", oil: "oil rents", metals: "metals in exports", fuelex: "fuel in exports", foodex: "food in exports", fdi: "foreign direct investment" };
  function histFor(label) {
    var l = String(label || "").toLowerCase(), T = [], D = window.GDC_DATA || {}, H = (window.GDC_HISTORY || {}).series || {};
    var items = (D.economy || []).reduce(function (a, g) { return a.concat(g.items || []); }, []);
    var it = null, bl = 0;
    items.forEach(function (i) { var n = String(i.label).toLowerCase(); if (l.indexOf(n) >= 0 && n.length > bl) { it = i; bl = n.length; } });
    if (it && it.series && it.series.length > 1) T.push({ t: "Monthly", pts: it.series.map(function (p) { return [p.date, +p.value]; }), u: it.unit || "", src: "Alfredo Ghana Economic Data" });
    if (/debt/.test(l) && D.debt && D.debt.readings) { var c = /gdp|ratio/.test(l) ? "ratio" : /domestic/.test(l) ? "domestic" : /external|foreign/.test(l) ? "external" : "total"; var P = D.debt.readings.filter(function (r) { return r[c] != null; }).map(function (r) { return [r.date.slice(0, 7), +r[c]]; }); if (P.length > 1) T.push({ t: "Published readings", pts: P, u: c === "ratio" ? "%" : "GH¢bn", src: "Bank of Ghana" }); }
    var hk = null; hl = 0;
    Object.keys(H).forEach(function (k) { var n = (LONGL[k] || k).toLowerCase(); if (n.length > 2 && l.indexOf(n) >= 0 && n.length > hl) { hk = k; hl = n.length; } });
    if (!hk && /dollar|cedi/.test(l) && H["US dollar"]) hk = "US dollar";
    if (hk && H[hk].points && H[hk].points.length > 2) T.push({ t: "Yearly", pts: H[hk].points.map(function (p) { return Array.isArray(p) ? [String(p[0]), +p[1]] : [String(p.year || p.date), +p.value]; }), u: H[hk].unit || "", src: H[hk].source || "World Bank" });
    return T.filter(function (t) { return t.pts.length > 1 && t.pts.every(function (p) { return !isNaN(p[1]); }); });
  }
  var hl = 0;
  function fmtH(v, u) { var a = Math.abs(v), d = u === "%" ? (a < 1 ? 2 : 1) : a >= 1000 ? 0 : a >= 10 ? 1 : 2, n = v.toLocaleString("en-GB", { minimumFractionDigits: d, maximumFractionDigits: d }); if (u === "%") return n + "%"; if (/^GH¢bn/.test(u)) return "GH¢" + n + "bn"; if (/^US\$bn/.test(u)) return "US$" + n + "bn"; if (u === "GH¢" || u === "US$") return u + n; return u && u.length < 9 ? n + " " + u : n; }
  function histChart(P) { var W = 560, H = 220, v = P.map(function (p) { return p[1]; }), mn = Math.min.apply(0, v), mx = Math.max.apply(0, v), pad = (mx - mn) * 0.12 || 1, X = function (i) { return 8 + 544 * i / Math.max(1, P.length - 1); }, Y = function (x) { return 16 + 178 * (1 - (x - mn + pad) / (mx - mn + 2 * pad)); }, d = P.map(function (p, i) { return X(i).toFixed(1) + "," + Y(p[1]).toFixed(1); }).join("L"), li = P.length - 1; return '<svg class="ap-hc" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="History chart"><path d="M' + X(0) + ",194L" + d + "L" + X(li) + ',194Z" class="ap-ha"/><path d="M' + d + '" class="ap-hl"/><circle cx="' + X(li) + '" cy="' + Y(v[li]) + '" r="6" class="ap-hn"/><text x="8" y="214" class="ap-hx">' + esc(P[0][0]) + '</text><text x="552" y="214" text-anchor="end" class="ap-hx">' + esc(P[li][0]) + "</text></svg>"; }
  function histView(T, j) { var t = T[j], P = t.pts, v = P.map(function (p) { return p[1]; }), last = v[v.length - 1], first = v[0], hi = Math.max.apply(0, v), lo = Math.min.apply(0, v), dir = last === first ? "unchanged" : last > first ? "higher" : "lower"; return '<div class="ap-htabs">' + T.map(function (x, i) { return '<button type="button" data-ht="' + i + '"' + (i === j ? ' class="on"' : "") + ">" + esc(x.t) + "</button>"; }).join("") + "</div>" + histChart(P) + '<p class="ap-hs">' + esc(P[P.length - 1][0]) + ": <b>" + fmtH(last, t.u) + "</b>, " + dir + (dir === "unchanged" ? "" : " than " + fmtH(first, t.u) + " in " + esc(P[0][0])) + ". Highest " + fmtH(hi, t.u) + ", lowest " + fmtH(lo, t.u) + '.</p><ol class="ap-hli">' + P.slice(-8).reverse().map(function (p) { return "<li><span>" + esc(p[0]) + "</span><b>" + fmtH(p[1], t.u) + "</b></li>"; }).join("") + '</ol><p class="ap-src">' + esc(t.src) + "</p>"; }
  var HSON = false;
  function histDeco(label) {
    var R = $("ap-r"), T = histFor(label); if (!T.length) return;
    var about = R.innerHTML, j = 0;
    R.innerHTML = '<div class="ap-hbar" role="tablist"><button type="button" data-hv="a" class="on">About</button><button type="button" data-hv="h">History</button></div><div id="ap-about">' + about + '</div><div id="ap-hist" hidden></div>';
    var paint = function () { $("ap-hist").innerHTML = histView(T, j); [].forEach.call($("ap-hist").querySelectorAll("[data-ht]"), function (b) { b.onclick = function () { j = +b.dataset.ht; paint(); sfx("tick"); }; }); };
    var set = function (h) { HSON = h; [].forEach.call(R.querySelectorAll(".ap-hbar button"), function (b) { b.classList.toggle("on", (b.dataset.hv === "h") === h); }); $("ap-about").hidden = h; $("ap-hist").hidden = !h; if (h) paint(); };
    R.querySelector(".ap-hbar").onclick = function (e) { var b = e.target.closest("button"); if (b) { set(b.dataset.hv === "h"); sfx("tick"); } };
    if (HSON) set(true);
  }

  /* ---------- big screen ---------- */
  var SP = { cur: null, list: [], i: -1, timer: 0, from: null };
  function overlay() {
    var O = $("ap-o"); if (O) return O;
    O = document.createElement("div"); O.id = "ap-o"; O.hidden = true; O.setAttribute("role", "dialog"); O.setAttribute("aria-modal", "true"); O.setAttribute("aria-label", "Figure, full screen");
    O.innerHTML = '<div class="ap-in"><div class="ap-l"><p class="ap-lab" id="ap-lab"></p><div class="ap-num" id="ap-num"><span id="ap-v"></span></div><p class="ap-live" id="ap-live" hidden><i></i>Running, live</p></div><div class="ap-r" id="ap-r"></div></div><div class="ap-nav"><button type="button" id="ap-prev" aria-label="Previous figure">‹</button><button type="button" id="ap-det">Open details</button><button type="button" id="ap-next" aria-label="Next figure">›</button><button type="button" id="ap-x" aria-label="Close">×</button></div>';
    document.body.appendChild(O);
    $("ap-x").onclick = close; $("ap-prev").onclick = function () { step(-1); }; $("ap-next").onclick = function () { step(1); };
    $("ap-det").onclick = function () { var el = SP.from; close(); if (el) { var d = el.closest("[data-detail]"); if (d) { SP.pass = 1; d.click(); SP.pass = 0; } } };
    var x0 = null, y0 = null;
    O.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    O.addEventListener("touchend", function (e) { if (x0 == null) return; var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null; if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1); else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) close(); }, { passive: true });
    return O;
  }
  function figures() {
    var out = [], seen = new Set();
    document.querySelectorAll(".lit,.mono,.num,b,strong,.cmp-big,td,.v,[class*=value]").forEach(function (e) {
      if (e.children.length > 2 || seen.has(e) || e.closest(NOZOOM)) return;
      var s = walk(e); if (!isNumeric(s) || s.length > 40) return;
      var r = e.getClientRects(); if (!r.length || !e.offsetParent && getComputedStyle(e).position !== "fixed") return;
      seen.add(e); out.push(e);
    });
    return out;
  }
  function fit() {
    var N = $("ap-num"), V = $("ap-v"); if (!N || !V) return; N.style.fontSize = "";
    var fs = parseFloat(getComputedStyle(N).fontSize), av = N.parentElement.clientWidth - 6;
    for (var c = 0; c < 14 && V.getBoundingClientRect().width > av && fs > 24; c++) { fs *= Math.max(0.82, av / V.getBoundingClientRect().width); N.style.fontSize = fs + "px"; }
  }
  function show(el, tok) {
    el = pick(el); var O = overlay(), whole = isNumeric(walk(el)), v = tok || walk(el), label = labelFor(el), N = noteFor(label);
    var para = el.closest("p,li"), ctx = para ? walk(para) : "";
    SP.cur = { el: el, label: label, whole: whole }; SP.from = el;
    $("ap-lab").textContent = label; $("ap-v").textContent = v; $("ap-live").hidden = !(whole && el.closest(".led,[class*=live],[class*=clock],[class*=count]"));
    var R = "";
    if (N && N.w) R += '<h3>What it is</h3><p>' + esc(N.w) + "</p>";
    if (N && N.y) R += '<h3>Why it matters</h3><p>' + esc(N.y) + "</p>";
    if (ctx && ctx.length > v.length + 3 && ctx.length < 300) R += '<h3>On the dashboard</h3><p>' + esc(ctx) + "</p>";
    if (!R) R = '<h3>On the dashboard</h3><p>' + esc(label) + ".</p>";
    R += '<p class="ap-src">Alfredo Ghana Economic Data</p>';
    $("ap-r").innerHTML = R;
    try { histDeco(label); } catch (e) {}
    $("ap-det").hidden = !el.closest("[data-detail]");
    SP.list = figures(); SP.i = SP.list.indexOf(el);
    if (O.hidden) { O.hidden = false; document.documentElement.classList.add("ap-lock"); requestAnimationFrame(function () { O.classList.add("in"); }); sfx("open"); } else sfx("tick");
    O.classList.remove("swap"); void O.offsetWidth; O.classList.add("swap");
    fit(); clearInterval(SP.timer);
    if (whole) SP.timer = setInterval(function () { if (!SP.cur || !SP.cur.el.isConnected) return; var nv = walk(SP.cur.el); if (/\d/.test(nv) && $("ap-v").textContent !== nv) { var L = $("ap-v").textContent.length; $("ap-v").textContent = nv; if (L !== nv.length) fit(); } }, 200);
    $("ap-x").focus({ preventScroll: true });
  }
  function close() { var O = $("ap-o"); if (!O || O.hidden) return; clearInterval(SP.timer); O.classList.remove("in"); document.documentElement.classList.remove("ap-lock"); sfx("close"); setTimeout(function () { O.hidden = true; }, RM ? 0 : 220); SP.cur = null; }
  function step(d) { if (!SP.list.length) SP.list = figures(); if (!SP.list.length) return; SP.i = (SP.i + d + SP.list.length) % SP.list.length; show(SP.list[SP.i]); }
  function showText(t) {
    var O = overlay(); SP.cur = null; clearInterval(SP.timer);
    $("ap-lab").textContent = "Alfredo Ghana Economic Data"; $("ap-v").textContent = ""; $("ap-live").hidden = true;
    $("ap-r").innerHTML = '<p class="ap-big">' + esc(t) + "</p>"; $("ap-det").hidden = true;
    if (O.hidden) { O.hidden = false; document.documentElement.classList.add("ap-lock"); requestAnimationFrame(function () { O.classList.add("in"); }); sfx("open"); }
  }
  addEventListener("resize", function () { var O = $("ap-o"); if (O && !O.hidden) fit(); });
  document.addEventListener("keydown", function (e) {
    var O = $("ap-o"); if (!O || O.hidden) return;
    if (e.key === "Escape") { e.preventDefault(); e.stopImmediatePropagation(); close(); }
    else if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); e.stopImmediatePropagation(); step(1); }
    else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); e.stopImmediatePropagation(); step(-1); }
    else if ((e.key === "h" || e.key === "H") && document.querySelector("#ap-r .ap-hbar")) { e.preventDefault(); document.querySelector('#ap-r .ap-hbar [data-hv="' + (HSON ? "a" : "h") + '"]').click(); }
  }, true);
  document.addEventListener("click", function (e) {
    if (SP.pass || PN.tool) return;
    var t = e.target; if (!t.closest || t.closest(NOZOOM)) return;
    if (String(getSelection()).length > 1) return;
    var el = pick(t), tok = tokenAt(e.clientX, e.clientY, el);
    if (tok) { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); show(el, isNumeric(walk(el)) ? null : tok); return; }
    var b = t.closest("p,li,h1,h2,h3"); if (b && !b.closest("a,button")) { var s = walk(b); if (s.length > 12 && s.length < 500 && !t.closest("[data-detail]")) { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); showText(s); } }
  }, true);
  /* long press on a touch screen does the same */
  (function () { var tm = 0, sx = 0, sy = 0; document.addEventListener("touchstart", function (e) { if (PN.tool || e.touches.length > 1) return; var t = e.target; if (!t.closest || t.closest(NOZOOM)) return; sx = e.touches[0].clientX; sy = e.touches[0].clientY; tm = setTimeout(function () { var el = pick(t), tok = tokenAt(sx, sy, el); if (tok) show(el, isNumeric(walk(el)) ? null : tok); }, 520); }, { passive: true }); document.addEventListener("touchmove", function (e) { if (Math.abs(e.touches[0].clientX - sx) + Math.abs(e.touches[0].clientY - sy) > 12) clearTimeout(tm); }, { passive: true }); document.addEventListener("touchend", function () { clearTimeout(tm); }, { passive: true }); })();

  /* ---------- voice ---------- */
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  function findFigure(phrase) {
    var p = phrase.toLowerCase().replace(/[-\u2010-\u2014]/g, " "), F = figures(), best = null, bs = 0;
    F.forEach(function (el) { var l = labelFor(el).toLowerCase().replace(/[-\u2010-\u2014]/g, " "), s = 0; if (l.indexOf(p) >= 0) s = 10 + p.length; else p.split(/\s+/).forEach(function (w) { if (w.length > 2 && l.indexOf(w) >= 0) s += w.length; }); if (s > bs) { bs = s; best = el; } });
    return bs >= 4 ? best : null;
  }
  function heardFigure(text) {
    var l = " " + text.toLowerCase().replace(/[^a-z0-9 \-]/g, " ").replace(/\bg d p\b/g, "gdp") + " ", best = null, bi = -1;
    (G ? G.k : []).forEach(function (r) { var i = l.lastIndexOf(" " + r[0]); if (i < 0) return; var e = i + r[0].length; if (e > bi || (e === bi && best && r[0].length > best.length)) { bi = e; best = r[0]; } });
    return bi >= 0 ? best : null;
  }
  var SYN = { "debt to gdp": "debt", "debt ratio": "debt", "public debt": "debt", "national debt": "debt", "total debt": "debt", "exchange rate": "dollar", "cedi": "dollar", "interest rate": "policy rate", "treasury bill": "t-bill", "cost of living": "inflation", "economic growth": "gdp", "growth rate": "gdp", "oil price": "oil", "brent": "oil", "crude": "oil", "jobless": "unemployment", "bad loans": "bad loan", "momo": "mobile money", "gold price": "gold" };
  function project(text) { var k = heardFigure(text); if (!k) return false; var el = findFigure(k) || (SYN[k] && findFigure(SYN[k])); if (!el) return false; show(el); return true; }

  /* voice projector: listens all the time and puts up the figure you mention */
  var VP = { on: false, rec: null, last: 0, lastK: "" };
  function vpSet(on) {
    VP.on = on; document.querySelectorAll("[data-ap-vp]").forEach(function (b) { b.setAttribute("aria-pressed", on); });
    pill(on ? "Voice projector on. Mention a figure, for example “inflation”." : "");
    if (!on) { try { VP.rec && VP.rec.abort(); } catch (e) {} VP.rec = null; return; }
    if (!SR) { pill("Voice isn’t supported in this browser. Try Chrome, Edge or Safari."); VP.on = false; return; }
    var r = new SR(); VP.rec = r; r.lang = "en-GH"; r.continuous = true; r.interimResults = true;
    r.onresult = function (e) { for (var i = e.resultIndex; i < e.results.length; i++) { var s = e.results[i][0].transcript; caption(s); if (/\b(close( it| this)?)$/i.test(s.trim()) && e.results[i].isFinal) { close(); continue; } if (/\bnext( one)?$/i.test(s.trim()) && e.results[i].isFinal) { step(1); continue; } var k = heardFigure(s); if (!k) continue; var now = Date.now(); if ((k === VP.lastK && now - VP.last < 9000) || now - VP.last < 2500) continue; if (project(s)) { VP.last = now; VP.lastK = k; pill("Projected: " + (SP.cur ? SP.cur.label : k)); } } };
    r.onerror = function (e) { if (e.error === "not-allowed" || e.error === "service-not-allowed") { pill("The microphone is blocked. Allow it in your browser."); vpSet(false); } };
    r.onend = function () { if (VP.on && VP.rec === r) setTimeout(function () { try { r.start(); } catch (e) {} }, 250); };
    try { r.start(); } catch (e) {}
  }
  function pill(msg) {
    var P = $("ap-pill"); if (!P) { P = document.createElement("div"); P.id = "ap-pill"; P.setAttribute("role", "status"); P.innerHTML = '<i></i><span></span><button type="button" aria-label="Stop listening">×</button>'; document.body.appendChild(P); P.querySelector("button").onclick = function () { vpSet(false); }; }
    P.hidden = !msg; P.querySelector("span").textContent = msg || "";
  }
  var capT = 0; function caption(s) { var C = $("ap-cap"); if (!C) { C = document.createElement("div"); C.id = "ap-cap"; document.body.appendChild(C); } C.textContent = s; C.hidden = !s; clearTimeout(capT); capT = setTimeout(function () { C.hidden = true; }, 3500); }

  /* talk to Alfredo, hands-free */
  var TK = { on: false, state: "idle", rec: null, spoke: false };
  function talkUI() {
    var T = $("ap-talk"); if (T) return T;
    T = document.createElement("div"); T.id = "ap-talk"; T.hidden = true; T.setAttribute("role", "dialog"); T.setAttribute("aria-label", "Talking to Alfredo");
    T.innerHTML = '<button type="button" class="ap-orb" id="ap-orb" aria-label="Tap to talk or interrupt"><i></i><i></i><i></i></button><p id="ap-ts">Listening…</p><p id="ap-tq"></p><button type="button" class="ap-end" id="ap-end">End</button>';
    document.body.appendChild(T);
    $("ap-end").onclick = function () { talk(false); };
    $("ap-orb").onclick = function () { if (TK.state === "speak") { try { speechSynthesis.cancel(); } catch (e) {} listen(); } else if (TK.state !== "listen") listen(); };
    return T;
  }
  function tState(s, txt) { TK.state = s; var T = talkUI(); T.dataset.s = s; $("ap-ts").textContent = { listen: "Listening…", think: "Thinking…", speak: "Speaking. Tap to interrupt.", idle: "Tap the circle to talk" }[s] || ""; if (txt != null) $("ap-tq").textContent = txt; }
  function talk(on) {
    TK.on = on; var T = talkUI();
    if (!on) { T.classList.remove("in"); setTimeout(function () { T.hidden = true; }, 200); try { TK.rec && TK.rec.abort(); } catch (e) {} try { speechSynthesis.cancel(); } catch (e) {} restoreSpeak(); sfx("close"); return; }
    if (!SR) { alert("Talking needs a browser that can listen, such as Chrome, Edge or Safari."); TK.on = false; return; }
    T.hidden = false; requestAnimationFrame(function () { T.classList.add("in"); }); sfx("open"); forceSpeak(); listen();
  }
  var hadSpeak = null;
  function forceSpeak() { var b = $("alf-speak"); if (!b) return; hadSpeak = b.getAttribute("aria-pressed") === "true"; if (!hadSpeak) b.click(); }
  function restoreSpeak() { var b = $("alf-speak"); if (b && hadSpeak === false && b.getAttribute("aria-pressed") === "true") b.click(); hadSpeak = null; }
  function listen() {
    if (!TK.on) return; try { TK.rec && TK.rec.abort(); } catch (e) {}
    var r = new SR(), L = lang(); TK.rec = r; r.lang = /^(en|fr)/.test(L.speech) ? L.speech : "en-GH"; r.interimResults = true; r.continuous = false;
    var got = ""; tState("listen", ""); sfx("listen");
    r.onresult = function (e) { got = ""; for (var i = 0; i < e.results.length; i++) got += e.results[i][0].transcript; $("ap-tq").textContent = got; };
    r.onerror = function (e) { if (e.error === "not-allowed") { tState("idle", "The microphone is blocked. Allow it in your browser."); TK.on = false; } };
    r.onend = function () { if (!TK.on || TK.rec !== r) return; if (got.trim()) handle(got.trim()); else tState("idle", "I didn’t catch that. Tap the circle to try again."); };
    try { r.start(); } catch (e) {}
  }
  function handle(q) {
    var l = q.toLowerCase();
    if (/^(stop|goodbye|bye|end|that's all|that is all|thank you,? bye)\b/.test(l)) { talk(false); return; }
    if (/^(close|hide)( it| that| this)?$/.test(l)) { close(); listen(); return; }
    if (/^(next|next one)$/.test(l)) { step(1); listen(); return; }
    if (/\b(show|project|display|put up|bring up|zoom( in)?( on)?)\b/.test(l) && project(q)) { say("Here it is.", listen); return; }
    var form = $("alf-form"), inp = $("alf-input"), log = $("alf-log");
    if (!form || !inp || !log) { tState("idle", "Alfredo isn’t on this page."); return; }
    if ($("alfredo") && $("alfredo").hidden && $("alf-open")) $("alf-open").click();
    tState("think", q);
    var n0 = log.children.length; inp.value = q; inp.dispatchEvent(new Event("input", { bubbles: true }));
    if (form.requestSubmit) form.requestSubmit(); else form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    var t0 = Date.now(), lastTxt = "", stable = 0;
    var iv = setInterval(function () {
      if (!TK.on) { clearInterval(iv); return; }
      var M = [].slice.call(log.children, Math.max(0, n0)).filter(function (m) { return m.classList.contains("alf") && !m.querySelector(".alf-dots"); });
      var txt = M.map(walk).join(" ");
      if (txt && txt === lastTxt) stable++; else { stable = 0; lastTxt = txt; }
      if ((txt && stable >= 3) || Date.now() - t0 > 20000) {
        clearInterval(iv); if (!txt) { tState("idle", "No answer came back. Tap to try again."); return; }
        $("ap-tq").textContent = txt.length > 220 ? txt.slice(0, 217) + "…" : txt; tState("speak");
        var started = Date.now(), seen = false;
        var w = setInterval(function () { var s = window.speechSynthesis && speechSynthesis.speaking; if (s) seen = true; if (!TK.on) { clearInterval(w); return; } if ((seen && !s) || (!seen && Date.now() - started > 2500)) { clearInterval(w); if (TK.state === "speak") setTimeout(listen, 350); } }, 200);
      }
    }, 250);
  }
  function say(t, then) { try { speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(t); u.lang = lang().speech; u.onend = function () { then && then(); }; tState("speak"); speechSynthesis.speak(u); } catch (e) { then && then(); } }

  /* ---------- edit tools ---------- */
  var PN = { tool: null, c: "#f26a4f", w: 4, marks: [], redo: [], vis: true };
  var COLS = ["#f26a4f", "#f6c14b", "#4fc58c", "#4aa3ff", "#ffffff"];
  var TOOLS = [["pen", "Pen"], ["mark", "Highlighter"], ["laser", "Laser"], ["arrow", "Arrow"], ["box", "Box"], ["oval", "Circle"], ["text", "Text"], ["spot", "Spotlight"]];
  function svg() {
    var S = $("ap-svg"); if (S) return S;
    S = document.createElementNS("http://www.w3.org/2000/svg", "svg"); S.id = "ap-svg"; S.setAttribute("aria-hidden", "true"); document.body.appendChild(S);
    var H = document.createElement("div"); H.id = "ap-hit"; H.hidden = true; document.body.appendChild(H); hitWire(H); sizeSvg(); return S;
  }
  function sizeSvg() { var S = $("ap-svg"); if (!S) return; var w = Math.max(document.documentElement.scrollWidth, innerWidth), h = Math.max(document.documentElement.scrollHeight, innerHeight); S.setAttribute("width", w); S.setAttribute("height", h); S.style.width = w + "px"; S.style.height = h + "px"; }
  addEventListener("resize", sizeSvg); setInterval(sizeSvg, 2000);
  function pathOf(P) { return "M" + P.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join("L"); }
  function markSvg(m) {
    var c = m.c, w = m.w;
    if (m.t === "pen") return '<path d="' + pathOf(m.p) + '" fill="none" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>';
    if (m.t === "mark") return '<path d="' + pathOf(m.p) + '" fill="none" stroke="' + c + '" stroke-opacity=".38" stroke-width="' + w * 4 + '" stroke-linecap="round" stroke-linejoin="round"/>';
    var a = m.p[0], b = m.p[m.p.length - 1], l = Math.min(a[0], b[0]), t = Math.min(a[1], b[1]), W = Math.abs(a[0] - b[0]), Hh = Math.abs(a[1] - b[1]);
    if (m.t === "box") return '<rect x="' + l + '" y="' + t + '" width="' + W + '" height="' + Hh + '" rx="6" fill="none" stroke="' + c + '" stroke-width="' + w + '"/>';
    if (m.t === "oval") return '<ellipse cx="' + (l + W / 2) + '" cy="' + (t + Hh / 2) + '" rx="' + (W / 2 + 6) + '" ry="' + (Hh / 2 + 6) + '" fill="none" stroke="' + c + '" stroke-width="' + w + '"/>';
    if (m.t === "arrow") { var an = Math.atan2(b[1] - a[1], b[0] - a[0]), L = Math.max(14, w * 4), h1 = [b[0] - L * Math.cos(an - 0.5), b[1] - L * Math.sin(an - 0.5)], h2 = [b[0] - L * Math.cos(an + 0.5), b[1] - L * Math.sin(an + 0.5)]; return '<path d="M' + a + "L" + b + "M" + h1 + "L" + b + "L" + h2 + '" fill="none" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>'; }
    if (m.t === "spot") return '<path fill-rule="evenodd" fill="rgba(0,0,0,.72)" d="M-9999,-9999H99999V99999H-9999ZM' + l + "," + t + "V" + (t + Hh) + "H" + (l + W) + "V" + t + 'Z"/>';
    if (m.t === "text") return '<text x="' + a[0] + '" y="' + a[1] + '" fill="' + c + '" font-size="' + (14 + w * 3) + '" font-weight="700" stroke="#000" stroke-width="' + (2 + w / 2) + '" paint-order="stroke" font-family="system-ui,sans-serif">' + esc(m.s) + "</text>";
    return "";
  }
  function draw(cur) { var S = svg(); S.innerHTML = (PN.vis ? PN.marks : []).concat(cur ? [cur] : []).map(markSvg).join(""); }
  function hitWire(H) {
    var d = null;
    H.addEventListener("pointerdown", function (e) {
      if (!PN.tool) return; e.preventDefault(); try { H.setPointerCapture(e.pointerId); } catch (x) {}
      var p = [e.clientX + scrollX, e.clientY + scrollY];
      if (PN.tool === "laser") { d = { laser: 1 }; laser(e.clientX, e.clientY); return; }
      if (PN.tool === "text") { var s = prompt("Text to add"); if (s) { PN.marks.push({ t: "text", c: PN.c, w: PN.w, p: [p], s: s }); PN.redo = []; draw(); sfx("tick"); } return; }
      d = { t: PN.tool, c: PN.c, w: PN.w, p: [p] };
    });
    H.addEventListener("pointermove", function (e) {
      if (!d) return; if (d.laser) { laser(e.clientX, e.clientY); return; }
      var p = [e.clientX + scrollX, e.clientY + scrollY];
      if (d.t === "pen" || d.t === "mark") d.p.push(p); else d.p[1] = p;
      draw(d);
    });
    var up = function () { if (!d) return; if (!d.laser && d.p.length > 1) { PN.marks.push(d); PN.redo = []; sfx("tick"); } d = null; draw(); };
    H.addEventListener("pointerup", up); H.addEventListener("pointercancel", up);
  }
  var lzT = 0; function laser(x, y) { var D = document.createElement("i"); D.className = "ap-lz"; D.style.left = x + "px"; D.style.top = y + "px"; document.body.appendChild(D); setTimeout(function () { D.remove(); }, 650); }
  function setTool(t) {
    PN.tool = PN.tool === t ? null : t; svg(); var H = $("ap-hit"); H.hidden = !PN.tool; H.dataset.t = PN.tool || "";
    document.querySelectorAll("#ap-bar [data-t]").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.t === PN.tool); });
  }
  function bar() {
    var B = $("ap-bar"); if (B) return B;
    B = document.createElement("div"); B.id = "ap-bar"; B.hidden = true; B.setAttribute("role", "toolbar"); B.setAttribute("aria-label", "Edit tools");
    B.innerHTML = '<span class="ap-grp">' + TOOLS.map(function (t) { return '<button type="button" data-t="' + t[0] + '" aria-pressed="false">' + t[1] + "</button>"; }).join("") + '</span><span class="ap-grp">' + COLS.map(function (c, i) { return '<button type="button" class="ap-c" data-c="' + c + '" style="--c:' + c + '" aria-label="Colour ' + (i + 1) + '" aria-pressed="' + (c === PN.c) + '"></button>'; }).join("") + '<label class="ap-w">Size <input type="range" min="2" max="12" value="4" id="ap-wv"></label></span><span class="ap-grp"><button type="button" data-x="undo">Undo</button><button type="button" data-x="redo">Redo</button><button type="button" data-x="hide" aria-pressed="false">Hide marks</button><button type="button" data-x="clear">Clear</button></span><span class="ap-grp"><button type="button" data-ap-vp aria-pressed="false">Voice projector</button><button type="button" data-x="talk">Talk to Alfredo</button><button type="button" data-x="lens" aria-pressed="false">Magnifier</button><button type="button" data-x="board">Whiteboard</button><button type="button" data-x="timer">Timer</button><button type="button" data-x="black">Blank screen</button><button type="button" data-x="sound">Sound</button></span><button type="button" class="ap-bx" data-x="close" aria-label="Close edit tools">×</button>';
    document.body.appendChild(B);
    B.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return; sfx("tick");
      if (b.dataset.t) return setTool(b.dataset.t);
      if (b.dataset.c) { PN.c = b.dataset.c; B.querySelectorAll(".ap-c").forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); return; }
      if (b.hasAttribute("data-ap-vp")) return vpSet(!VP.on);
      var x = b.dataset.x;
      if (x === "undo") { if (PN.marks.length) PN.redo.push(PN.marks.pop()); draw(); }
      else if (x === "redo") { if (PN.redo.length) PN.marks.push(PN.redo.pop()); draw(); }
      else if (x === "clear") { if (PN.marks.length) { PN.redo = PN.marks.slice().reverse(); PN.marks = []; draw(); } }
      else if (x === "hide") { PN.vis = !PN.vis; b.setAttribute("aria-pressed", !PN.vis); draw(); }
      else if (x === "talk") talk(true);
      else if (x === "lens") { lensOn = !lensOn; b.setAttribute("aria-pressed", lensOn); lens(); }
      else if (x === "board") board();
      else if (x === "timer") timer();
      else if (x === "black") blank();
      else if (x === "sound") sndPanel();
      else if (x === "close") tools(false);
    });
    $("ap-wv").oninput = function (e) { PN.w = +e.target.value; };
    return B;
  }
  function tools(on) { var B = bar(); B.hidden = !on; if (!on) setTool(null); var f = $("ap-fab"); if (f) f.setAttribute("aria-expanded", on); }
  /* magnifier */
  var lensOn = false, lensMv = null;
  function lens() {
    var L = $("ap-lens");
    if (!lensOn) { if (L) L.hidden = true; if (lensMv) removeEventListener("pointermove", lensMv); return; }
    if (!L) { L = document.createElement("div"); L.id = "ap-lens"; document.body.appendChild(L); }
    L.hidden = false;
    lensMv = function (e) { var el = document.elementFromPoint(e.clientX, e.clientY); L.style.left = (e.clientX - 110) + "px"; L.style.top = (e.clientY - 150) + "px"; if (!el || L.contains(el)) return; var t = walk(el.closest("p,li,td,div") || el); NUM.lastIndex = 0; L.textContent = t.slice(0, 60); };
    addEventListener("pointermove", lensMv);
  }
  /* whiteboard */
  function board() {
    var W = $("ap-wb"); if (W) { W.hidden = !W.hidden; return; }
    W = document.createElement("div"); W.id = "ap-wb"; W.innerHTML = '<canvas></canvas><div class="ap-wbb"><button type="button" data-w="clear">Clear</button><button type="button" data-w="light">Light board</button><button type="button" data-w="x" aria-label="Close whiteboard">×</button></div>'; document.body.appendChild(W);
    var C = W.querySelector("canvas"), g = C.getContext("2d"), dr = null;
    var size = function () { var d = devicePixelRatio || 1; C.width = innerWidth * d; C.height = innerHeight * d; g.setTransform(d, 0, 0, d, 0, 0); g.lineCap = "round"; g.lineJoin = "round"; };
    size(); addEventListener("resize", size);
    C.addEventListener("pointerdown", function (e) { dr = [e.clientX, e.clientY]; g.strokeStyle = W.classList.contains("light") && PN.c === "#ffffff" ? "#111" : PN.c; g.lineWidth = PN.w; try { C.setPointerCapture(e.pointerId); } catch (x) {} });
    C.addEventListener("pointermove", function (e) { if (!dr) return; g.beginPath(); g.moveTo(dr[0], dr[1]); g.lineTo(e.clientX, e.clientY); g.stroke(); dr = [e.clientX, e.clientY]; });
    C.addEventListener("pointerup", function () { dr = null; });
    W.querySelector(".ap-wbb").onclick = function (e) { var b = e.target.closest("button"); if (!b) return; if (b.dataset.w === "clear") g.clearRect(0, 0, C.width, C.height); else if (b.dataset.w === "light") W.classList.toggle("light"); else W.hidden = true; };
  }
  /* timer */
  var TM = { end: 0, iv: 0 };
  function timer() {
    var T = $("ap-tm"); if (T) { T.hidden = !T.hidden; return; }
    T = document.createElement("div"); T.id = "ap-tm"; T.innerHTML = '<output id="ap-tmo">0:00</output><div><button type="button" data-m="1">1 min</button><button type="button" data-m="3">3</button><button type="button" data-m="5">5</button><button type="button" data-m="10">10</button><button type="button" data-m="0">Stop</button><button type="button" data-m="x" aria-label="Close timer">×</button></div>'; document.body.appendChild(T);
    T.onclick = function (e) { var b = e.target.closest("button"); if (!b) return; var m = b.dataset.m; if (m === "x") { T.hidden = true; return; } clearInterval(TM.iv); T.dataset.s = ""; if (m === "0") { $("ap-tmo").textContent = "0:00"; return; } TM.end = Date.now() + m * 60000; TM.iv = setInterval(tick, 250); tick(); };
    function tick() { var r = Math.max(0, TM.end - Date.now()), s = Math.ceil(r / 1000); $("ap-tmo").textContent = Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); T.dataset.s = s <= 0 ? "done" : s <= 30 ? "low" : ""; if (r <= 0) { clearInterval(TM.iv); sfx("open"); } }
  }
  /* blank screen */
  function blank() { var B = $("ap-blk"); if (!B) { B = document.createElement("button"); B.id = "ap-blk"; B.type = "button"; B.setAttribute("aria-label", "Blank screen. Tap or press a key to return"); document.body.appendChild(B); B.onclick = function () { B.hidden = true; }; } B.hidden = false; B.focus(); }
  /* sound panel */
  function sndPanel() {
    var P = $("ap-snd"); if (P) { P.hidden = !P.hidden; return; }
    P = document.createElement("div"); P.id = "ap-snd"; P.setAttribute("role", "dialog"); P.setAttribute("aria-label", "Sound");
    P.innerHTML = '<label><input type="checkbox" id="ap-son"' + (SND.on ? " checked" : "") + '> Sounds on</label><label>Volume <input type="range" id="ap-svol" min="0" max="100" value="' + Math.round(SND.vol * 100) + '"></label><label>Sound set <select id="ap-spk">' + Object.keys(PACKS).map(function (k) { return '<option value="' + k + '"' + (k === SND.pack ? " selected" : "") + ">" + PACKN[k] + "</option>"; }).join("") + '</select></label><button type="button" id="ap-sx">Done</button>';
    document.body.appendChild(P);
    $("ap-son").onchange = function (e) { SND.on = e.target.checked; sndSave(); sfx("open"); };
    $("ap-svol").oninput = function (e) { SND.vol = e.target.value / 100; sndSave(); };
    $("ap-svol").onchange = function () { sfx("open"); };
    $("ap-spk").onchange = function (e) { SND.pack = e.target.value; sndSave(); sfx("open"); };
    $("ap-sx").onclick = function () { P.hidden = true; };
  }
  /* keyboard shortcuts, when not typing */
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable) return;
    var blk = $("ap-blk"); if (blk && !blk.hidden) { blk.hidden = true; e.preventDefault(); return; }
    var k = e.key.toLowerCase();
    if (k === "escape" && PN.tool) { setTool(null); return; }
    if (e.shiftKey && k === "e") { tools($("ap-bar") ? $("ap-bar").hidden : true); e.preventDefault(); }
    else if (e.shiftKey && k === "v") { vpSet(!VP.on); e.preventDefault(); }
    else if (e.shiftKey && k === "b") { blank(); e.preventDefault(); }
    else if (e.shiftKey && k === "t") { talk(!TK.on); e.preventDefault(); }
  });


  /* ---------- camera: show Alfredo a chart, newspaper or price list ---------- */
  var CAM = { stream: null, face: "environment" };
  function camUI() {
    var S = $("ap-cam"); if (S) return S;
    S = document.createElement("div"); S.id = "ap-cam"; S.hidden = true; S.setAttribute("role", "dialog"); S.setAttribute("aria-label", "Camera");
    S.innerHTML = '<video id="ap-cv" playsinline muted></video><p id="ap-cm"></p><div class="ap-cb"><button type="button" id="ap-shot">Take photo</button><button type="button" id="ap-flip">Switch camera</button><button type="button" id="ap-pick">Choose a photo</button><button type="button" id="ap-cx">Cancel</button></div><input type="file" accept="image/*" id="ap-file" hidden>';
    document.body.appendChild(S);
    $("ap-cx").onclick = camStop; $("ap-pick").onclick = function () { $("ap-file").click(); };
    $("ap-flip").onclick = function () { CAM.face = CAM.face === "environment" ? "user" : "environment"; camStart(); };
    $("ap-shot").onclick = function () { var V = $("ap-cv"); if (!V.videoWidth) return; var c = document.createElement("canvas"), k = Math.min(1, 1600 / Math.max(V.videoWidth, V.videoHeight)); c.width = Math.round(V.videoWidth * k); c.height = Math.round(V.videoHeight * k); c.getContext("2d").drawImage(V, 0, 0, c.width, c.height); c.toBlob(function (b) { camStop(); if (b) readPhoto(b); }, "image/jpeg", 0.86); };
    $("ap-file").onchange = function (e) { var f = e.target.files && e.target.files[0]; e.target.value = ""; camStop(); if (f) readPhoto(f); };
    return S;
  }
  function camStop() { if (CAM.stream) { CAM.stream.getTracks().forEach(function (t) { t.stop(); }); CAM.stream = null; } var S = $("ap-cam"); if (S) S.hidden = true; }
  function camStart() {
    var S = camUI(), V = $("ap-cv"); S.hidden = false; $("ap-cm").textContent = "Starting the camera…";
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { $("ap-cm").textContent = "This browser can’t open the camera here. Choose a photo instead."; return; }
    if (CAM.stream) { CAM.stream.getTracks().forEach(function (t) { t.stop(); }); CAM.stream = null; }
    navigator.mediaDevices.getUserMedia({ video: { facingMode: CAM.face, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false }).then(function (st) { CAM.stream = st; V.srcObject = st; V.play().catch(function () {}); $("ap-cm").textContent = "Point at a chart, a newspaper, a price list or a receipt."; sfx("open"); }).catch(function (e) { $("ap-cm").textContent = e && e.name === "NotAllowedError" ? "The camera is blocked. Allow it in your browser settings, or choose a photo instead." : "No camera was found. Choose a photo instead."; });
  }
  function ocrLib() { return window.Tesseract ? Promise.resolve(window.Tesseract) : new Promise(function (res, rej) { var sc = document.createElement("script"); sc.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js"; sc.onload = function () { res(window.Tesseract); }; sc.onerror = rej; document.head.appendChild(sc); }); }
  function readPhoto(blob) {
    var log = $("alf-log"); if ($("alfredo") && $("alfredo").hidden && $("alf-open")) $("alf-open").click();
    var url = URL.createObjectURL(blob), msg = document.createElement("div"); msg.className = "alf-msg you ap-photo"; msg.innerHTML = '<img alt="Your photo" src="' + url + '">';
    if (log) { log.appendChild(msg); log.scrollTop = log.scrollHeight; }
    var note = document.createElement("div"); note.className = "alf-msg alf"; note.textContent = "Reading the text in your photo…"; if (log) log.appendChild(note);
    ocrLib().then(function (T) { return T.recognize(blob, "eng"); }).then(function (r) {
      var txt = String(r && r.data && r.data.text || "").replace(/\s+/g, " ").trim();
      if (txt.replace(/[^A-Za-z0-9]/g, "").length < 8) { note.textContent = "I couldn’t find readable text in that photo. Try a closer, sharper picture of the figures."; return; }
      note.textContent = "I read: “" + (txt.length > 220 ? txt.slice(0, 217) + "…" : txt) + "”";
      var inp = $("alf-input"), form = $("alf-form"); if (!inp || !form) return;
      inp.value = txt.slice(0, 240); inp.dispatchEvent(new Event("input", { bubbles: true }));
      if (form.requestSubmit) form.requestSubmit(); else form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    }).catch(function () { note.textContent = "I couldn’t read that photo. The text reader needs an internet connection; try again in a moment."; });
  }

  /* ---------- documents ---------- */
  const DOCL={pdf:'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',pdfw:'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',docx:'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js',xlsx:'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'};
  function docJs(u,g){return window[g]?Promise.resolve(window[g]):new Promise((res,rej)=>{const s=document.createElement('script');s.src=u;s.onload=()=>window[g]?res(window[g]):rej(new Error('load'));s.onerror=()=>rej(new Error('load'));document.head.append(s)})}
  const docKind=f=>{const n=f.name.toLowerCase();if(/\.pdf$/.test(n)||f.type=='application/pdf')return'pdf';if(/\.docx$/.test(n))return'docx';if(/\.(xlsx|xls|ods)$/.test(n))return'xlsx';if(/\.(csv|tsv)$/.test(n))return'csv';if(/\.(txt|md|json|html?|xml)$/.test(n)||/^text\//.test(f.type))return'txt';if(/^image\//.test(f.type))return'img';if(/\.(doc|ppt|pptx)$/.test(n))return'old';return''};
  const DOCN={pdf:'PDF',docx:'Word document',xlsx:'spreadsheet',csv:'CSV file',txt:'text file'};
  const DOC={cur:null,MAX:25e6,SEND:120000};
  function docSplit(r,sep){const o=[];let c='',q=false;for(const ch of r){if(ch=='"'){q=!q;continue}if(ch==sep&&!q){o.push(c);c='';continue}c+=ch}o.push(c);return o}
  function docRows(R){if(!R.length)return'';const H=R[0].map((h,i)=>String(h||'').trim()||('Column '+(i+1)));return R.slice(1,3001).map(r=>r.map((v,i)=>String(v).trim()?H[i]+': '+String(v).trim():'').filter(Boolean).join('; ')).filter(Boolean).join('\n')}
  const DOC_KW=[['inflation','cpi'],['policy rate','mpr'],['monetary policy rate','mpr'],['exchange rate','usd'],['cedi','usd'],['treasury bill','tb91'],['t-bill','tb91'],['lending rate','lend'],['gdp growth','gdp'],['economic growth','gdp'],['real gdp','gdp'],['debt','debt'],['tax revenue','tax'],['primary balance','bal'],['unemployment','unemp'],['gold','gold'],['cocoa','cocoa'],['crude','brent'],['oil price','brent'],['reserves','gir'],['current account','ca'],['mobile money','momo'],['non-performing','npl'],['revenue',''],['expenditure',''],['spending',''],['deficit',''],['exports',''],['imports',''],['budget','']];
  const DOC_STOP=new Set('the a an and or of to in on for with what which who how is are was were does do did this that these those it its about from by as at be been can could would should tell me please show give document file report say says said there their they them you your i we our'.split(' '));
  function docSents(D){const out=[];let page='',sheet=false,buf=[];const flush=()=>{const t=buf.join(' ').replace(/(\w)- (\w)/g,'$1$2').replace(/\s+/g,' ');buf=[];t.split(/(?<=[.!?])\s+(?=[A-Z0-9“"(])/).forEach(x=>{x=x.trim();if(x.length>=25&&x.length<=420)out.push({s:x,page});else if(x.length>420)x.match(/.{1,400}(\s|$)/g).forEach(y=>out.push({s:y.trim(),page}))})};D.text.split(/\n/).forEach(line=>{const m=line.match(/^\[\[(page|sheet) ([^\]]+)\]\]$/);if(m){flush();sheet=m[1]=='sheet';page=(sheet?'sheet ':'page ')+m[2];return}if(sheet){const t=line.trim();if(t.length>=3)out.push({s:t,page});return}if(!line.trim()){flush();return}buf.push(line.trim())});flush();return out}
  const docNum=s=>/(\d[\d,]*\.?\d*\s?(%|per ?cent|percent|bn|billion|million|m\b)|GH[¢₵S]|US\$|\$\s?\d)/i.test(s);
  async function docRead(f,st){const k=docKind(f),D={name:f.name,kind:k,pages:0,text:'',note:''};
   if(k=='pdf'){st('Opening the PDF…');const L=await docJs(DOCL.pdf,'pdfjsLib');try{L.GlobalWorkerOptions.workerSrc=DOCL.pdfw}catch(_){}const pdf=await L.getDocument({data:new Uint8Array(await f.arrayBuffer())}).promise;D.pages=pdf.numPages;const out=[];for(let i=1;i<=pdf.numPages;i++){if(i%5==1)st(`Reading page ${i} of ${pdf.numPages}…`);const pg=await pdf.getPage(i),tc=await pg.getTextContent();let line='',last=null;const parts=[];tc.items.forEach(it=>{const y=it.transform?Math.round(it.transform[5]):0;if(last!=null&&Math.abs(y-last)>3){parts.push(line);line=''}line+=(line&&!/\s$/.test(line)?' ':'')+it.str;last=y});parts.push(line);out.push(`[[page ${i}]]\n`+parts.join('\n'));if(out.join('').length>DOC.SEND*1.6){D.note=`Only the first ${i} of ${pdf.numPages} pages were read, because the document is very long.`;break}}D.text=out.join('\n');
    const bare=D.text.replace(/\[\[page \d+\]\]/g,'').replace(/\s+/g,'');if(bare.length<40*Math.min(D.pages,3)){st('This looks like a scanned PDF. Reading the text from the images…');try{const T=await ocrLib(),n=Math.min(pdf.numPages,4),o=[];for(let i=1;i<=n;i++){st(`Reading scanned page ${i} of ${n}…`);const pg=await pdf.getPage(i),vp=pg.getViewport({scale:2}),c=document.createElement('canvas');c.width=vp.width;c.height=vp.height;await pg.render({canvasContext:c.getContext('2d'),viewport:vp}).promise;const r=await T.recognize(c,'eng');o.push(`[[page ${i}]]\n`+(r.data&&r.data.text||''))}D.text=o.join('\n');if(pdf.numPages>n)D.note=`It is a scanned document, so only the first ${n} pages were read.`}catch(_){D.note='It is a scanned document and the text reader could not load.'}}}
   else if(k=='docx'){st('Opening the Word document…');const M=await docJs(DOCL.docx,'mammoth');const r=await M.extractRawText({arrayBuffer:await f.arrayBuffer()});D.text=r.value||''}
   else if(k=='xlsx'){st('Opening the spreadsheet…');const X=await docJs(DOCL.xlsx,'XLSX');const wb=X.read(new Uint8Array(await f.arrayBuffer()),{type:'array'});D.sheets=wb.SheetNames.length;D.text=wb.SheetNames.map(n=>`[[sheet ${n}]]\n`+docRows(X.utils.sheet_to_json(wb.Sheets[n],{header:1,blankrows:false,defval:''}))).join('\n\n')}
   else if(k=='csv'){const t=await f.text(),sep=/\.tsv$/i.test(f.name)?'\t':',';D.text='[[sheet 1]]\n'+docRows(t.split(/\r?\n/).filter(Boolean).map(r=>docSplit(r,sep)))}
   else if(k=='txt'){D.text=await f.text();if(/\.html?$/i.test(f.name)){const t=document.createElement('div');t.innerHTML=D.text.replace(/<(script|style)[\s\S]*?<\/\1>/gi,'');D.text=t.textContent}}
   D.text=D.text.replace(/\u0000/g,'').replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim();D.words=(D.text.replace(/\[\[(page|sheet)[^\]]*\]\]/g,'').match(/\S+/g)||[]).length;return D}
  function docLocal(D,q){const S=docSents(D),l=String(q||'').toLowerCase(),gen=!l.trim()||/summar|overview|key (figures|points|numbers)|what (is|does) (this|it) (about|say)|main points|highlights/.test(l);const where=x=>x.page?` (${x.page})`:'';
   if(gen){const sc=S.map((x,i)=>{const t=x.s.toLowerCase();let v=0;DOC_KW.forEach(([w])=>{if(t.includes(w))v+=2});if(docNum(x.s))v+=3;return{...x,i,v}}).filter(x=>x.v>=5).sort((a,b)=>b.v-a.v).slice(0,6).sort((a,b)=>a.i-b.i);const head=`Here’s what stands out in ${D.name}${D.pages?', a '+D.pages+'-page '+DOCN[D.kind]:''}:`;if(!sc.length){const f=S.slice(0,3);return head+'\n\n'+(f.length?f.map(x=>'“'+x.s+'”'+where(x)).join('\n\n'):'It doesn’t seem to contain many sentences I can pick out.')}
      return head+'\n\n'+sc.map(x=>'• “'+x.s+'”'+where(x)).join('\n')}
   const W=[...new Set(l.replace(/[^a-z0-9%\- ]/g,' ').split(/\s+/).filter(w=>w.length>2&&!DOC_STOP.has(w)))];if(!W.length)return docLocal(D,'');
   const sc=S.map((x,i)=>{const t=x.s.toLowerCase();let v=0;W.forEach(w=>{if(t.includes(w))v+=w.length>5?3:2});if(v&&docNum(x.s))v+=1;return{...x,i,v}}).filter(x=>x.v>=Math.min(4,W.length*2)).sort((a,b)=>b.v-a.v).slice(0,3);
   if(!sc.length)return`I looked through ${D.name} and couldn’t find anything about that. Try other words, or ask for a summary.`;
   return(sc.length==1?'The document says:':'Here’s what the document says:')+'\n\n'+sc.map(x=>'“'+x.s+'”'+where(x)).join('\n\n')}
  
  function docMsg(cls, text) { var log = $("alf-log"); if (!log) return null; var m = document.createElement("div"); m.className = "alf-msg " + cls; m.style.whiteSpace = "pre-line"; m.textContent = text; log.appendChild(m); log.scrollTop = log.scrollHeight; return m; }
  function docBar() { var f = $("alf-form"); if (!f) return; var A = $("ap-docA"); if (!A) { A = document.createElement("div"); A.id = "ap-docA"; A.innerHTML = '<span aria-hidden="true">📄</span><span class="dT"><b></b><small></small></span><button type="button" aria-label="Remove document">×</button>'; f.parentNode.insertBefore(A, f); A.querySelector("button").onclick = function () { DOC.cur = null; docBar(); docMsg("alf", "Okay, I’ve put that document away."); }; } var D = DOC.cur; A.hidden = !D; if (D) { A.querySelector("b").textContent = D.name; A.querySelector("small").textContent = [DOCN[D.kind], D.pages ? D.pages + " pages" : "", D.words.toLocaleString("en-GB") + " words"].filter(Boolean).join(" · "); } }
  function docPick(f) {
    if (!f) return; var k = docKind(f); if ($("alfredo") && $("alfredo").hidden && $("alf-open")) $("alf-open").click();
    if (k === "img") { readPhoto(f); return; }
    if (!k || k === "old") { docMsg("alf", "I can read PDF, Word (.docx), Excel, CSV and text files, and photos. Please save it in one of those formats and upload it again."); return; }
    if (f.size > DOC.MAX) { docMsg("alf", "That file is over 25 MB. Please upload a smaller one."); return; }
    var P = docMsg("alf", "Opening " + f.name + "…");
    docRead(f, function (t) { P.textContent = t; }).then(function (D) { if (D.words < 5) { P.textContent = "I opened " + f.name + " but couldn’t find any text in it."; return; } DOC.cur = D; docBar(); P.textContent = "Got it. I’ve read " + f.name + ": " + (D.pages ? D.pages + " pages, " : "") + D.words.toLocaleString("en-GB") + " words." + (D.note ? " " + D.note : "") + " Ask me anything about it, or press send with an empty box for a summary."; sfx("open"); })
      .catch(function (e) { P.textContent = "I couldn’t open " + f.name + ". " + (e && e.message === "load" ? "The document reader needs an internet connection; try again in a moment." : "It may be damaged or password protected."); });
  }
  document.addEventListener("submit", function (e) {
    if (!DOC.cur || !e.target || e.target.id !== "alf-form") return;
    e.preventDefault(); e.stopImmediatePropagation();
    var inp = $("alf-input"), q = (inp.value || "").trim(); inp.value = "";
    docMsg("you", q || "Summarise this document"); var a = docLocal(DOC.cur, q); docMsg("alf", a);
    if (TK.on) { say(a.replace(/[“”•]/g, ""), listen); }
  }, true);

  /* ---------- buttons on the page ---------- */
  function mount() {
    if (!$("ap-fab")) { var f = document.createElement("button"); f.id = "ap-fab"; f.type = "button"; f.textContent = "Edit tools"; f.setAttribute("aria-expanded", "false"); f.title = "Pen, laser, spotlight, voice projector and more (Shift+E)"; f.onclick = function () { tools(bar().hidden); }; document.body.appendChild(f); }
    var T = $("alf-speak"); if (T && !$("ap-talkb")) { var b = document.createElement("button"); b.type = "button"; b.id = "ap-talkb"; b.className = "alf-icon ap-talkb"; b.title = "Talk to Alfredo, hands-free"; b.setAttribute("aria-label", "Talk to Alfredo, hands-free"); b.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="7" y="2.5" width="6" height="10" rx="3"/><path d="M4.5 9.5a5.5 5.5 0 0011 0M10 15v3"/></svg>'; b.onclick = function () { talk(true); }; T.parentNode.insertBefore(b, T); }
    if (T && !$("ap-docb")) { var db = document.createElement("button"); db.type = "button"; db.id = "ap-docb"; db.className = "alf-icon ap-talkb"; db.title = "Upload a document: PDF, Word, Excel, CSV or text"; db.setAttribute("aria-label", "Upload a document"); db.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.5l-8 8a5 5 0 0 1-7-7l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.7 1.7 0 0 1-2.4-2.4l7.8-7.8"/></svg>'; var dfi = document.createElement("input"); dfi.type = "file"; dfi.hidden = true; dfi.id = "ap-docf"; dfi.accept = ".pdf,.docx,.xlsx,.xls,.ods,.csv,.tsv,.txt,.md,.json,.html,image/*"; document.body.appendChild(dfi); dfi.onchange = function () { var f = dfi.files && dfi.files[0]; dfi.value = ""; docPick(f); }; db.onclick = function () { dfi.click(); }; T.parentNode.insertBefore(db, T); }
    if (T && !$("ap-camb")) { var cb = document.createElement("button"); cb.type = "button"; cb.id = "ap-camb"; cb.className = "alf-icon ap-talkb"; cb.title = "Camera: show Alfredo a chart, newspaper or price list"; cb.setAttribute("aria-label", "Camera"); cb.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 6.5h2.6l1.6-2.2h5.6l1.6 2.2H17v9.5H3z"/><circle cx="10" cy="11" r="3"/></svg>'; cb.onclick = camStart; T.parentNode.insertBefore(cb, $("ap-talkb") || T); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
  window.AlfredoPro = { readDocument: docPick, camera: camStart, readPhoto: readPhoto, show: show, project: project, talk: talk, voiceProjector: vpSet, tools: tools };
})();

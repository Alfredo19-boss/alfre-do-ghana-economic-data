# Alfredo Ghana Economic Data

A live, LED-style dashboard of Ghana's economy: public debt counting in real time, the 2026 budget, gold, cocoa and oil, credit ratings, markets, cost of living and key indicators.

It's a plain static site: no build step, no framework, no server.

## Features

- Live ticking counters for total, domestic and external debt, debt per person, debt-to-GDP and the 2026 budget
- **Widescreen layout**: on monitors 1680px and wider the page spreads into a full-width grid
- **Board view**: a single 16:9 screen for TVs, projectors and wall displays. The counters stay fixed at the top; the panel at the foot turns every 15 seconds through twelve views — debt milestones, live market rates, Ghana business news, African inflation, today's papers, what things cost, credit ratings, the days ahead, world markets, the Ghana Stock Exchange, global news, African news and the week's briefing — so a wall display shows everything the site holds within about three minutes. A panel with no data behind it yet is left out rather than shown empty. Ask Alfredo is on the board too, for a touch screen in a reception or classroom; while someone has him open, or has a figure's history panel open, the rotation holds still until they close it. Click *Board view*, or open `yoursite/#board` to launch straight into it (handy for a TV browser). Press Esc to leave.
- **Tap any figure for its history**: a chart, a table of past readings and a plain-language trend read-out slide in from the side on a desktop and up from the bottom on a phone. Works by touch, mouse or keyboard (Tab to a figure, press Enter; Esc closes).
- **The long view, 1993 to today**: around 30 annual series — inflation, growth, income per person, population, reserves, the cedi, exports, imports, the trade balance, remittances, unemployment, nominal GDP, the lending rate, bad loans, the current account, poverty, private credit, the real interest rate, tax and government revenue, government debt, oil's share of the economy, metals and food exports, pump prices, foreign investment, and the gold and cocoa price back to 2000 — each with its own chart, trend and year-by-year table behind the figure it belongs to. Where no long run exists (T-bill rates, mobile money, the minimum wage, tariffs), the panel says so plainly instead of leaving a gap.
- **National days**: a flag banner on Independence Day, Founder's Day and every other public holiday, plus the dates ahead (Bank of Ghana rate decisions, budget day, inflation releases)
- Milestone countdowns (next GH¢1bn, GH¢10bn, GH¢100bn, GH¢1 trillion)
- Household share calculator (remembers the household size on that device)
- Everyday comparisons: years of revenue, days of minimum-wage work, Free SHS, School Feeding, Big Push
- WhatsApp, X, Facebook and copy-link sharing
- Gold, cocoa & markets: gold and cocoa prices, gold/cocoa/oil exports, BoG gold reserves, Jubilee output, credit ratings with a ladder to investment grade, GSE index, PMI, mobile money, remittances, bank bad loans
- Cost of living and fiscal risks: petrol, diesel, LPG, minimum wage, electricity tariffs, energy sector shortfall, Eurobond payments, arrears
- Indicators worked out automatically: real interest rate, interest vs tax revenue, gold share of exports, debt per person in US$
- Cedi per US dollar chart; board view alternates between economy and markets readouts every 12 seconds
- **Green rates ticker** under the header: GH¢ against world and African currencies (Bank of Ghana interbank rates, market rates for currencies BoG does not quote) plus Ghana's GDP, updated daily
- **Market, right now**: a live cedi quote for the dollar, pound, euro and yuan plus the gold price, refreshed every 20 minutes and stamped with the minute it was taken, alongside the Bank of Ghana's official once-a-morning rate
- **Ghana's GDP so far this year** as a live green counter in the hero
- **Business news tab** (`#news`): Ghana business headlines from publishers' RSS feeds plus **Reuters wire stories** about Ghana and West Africa, refreshed every five minutes, with search, topic and source filters and a market snapshot
- **Africa inflation tab** (`#africa`): a strip of African headlines slides across the top, one story at a time on the board view's rhythm; below it, Ghana's inflation at the centre of an orbit of every other African country, each showing its latest published month-on-year rate, with a ranked table and a panel per country
- **Today's papers tab** (`#papers`): the day's front-page stories from Daily Graphic, Graphic Business, Graphic Sports, MyJoyOnline, Citi Newsroom, GNA and the Ghanaian Times — headline, short summary and a link to the publisher
- **Articles tab** (`#articles`): a weekly briefing written automatically from the site's own figures, readable on the page and downloadable as markdown or PDF
- **Ask Alfredo**: a chat box that answers questions about any figure on the dashboard — what it is, when it was published, how it has moved and how it is worked out. He draws a small chart of the figure he has just quoted, names its source, and offers a button through to its full history. He follows a conversation, so *"and last year?"*, *"why?"* and *"where is that from?"* work on whatever he answered last. He compares two figures at once (*"the policy rate against inflation"*, *"petrol or diesel"*) and finds a figure's high or low across everything the site holds. A question he can't place comes back with the closest figures as buttons rather than a dead end, and every question he couldn't answer is kept in that browser and listed on the **System status** page, so you can see what to teach him
- **He answers to his name and to manners**: say *Alfredo* and he replies at once — *"Yes, I am here. How can I help you today?"* Say it as part of a question (*"Alfredo, what is inflation?"*) and he drops the name and answers the question instead. *Thank you*, *goodbye* and *how are you* all get a proper reply, in whichever of the five languages is selected — `medaase`, `akpe`, `oyiwaladɔŋŋ` and `na gode` are all understood
- **Alfredo in five languages**: English, Twi, Ewe, Ga and Hausa. Questions typed or spoken in any of them are understood, and answers come back in the chosen language. All the wording lives in `lang-data.js`
- **Ask by voice, listen to the answer**: a microphone button dictates the question, and a speaker button reads the answer aloud
- **Charts tab** (`#charts`): the dashboard's figures drawn rather than listed — the debt by year, debt-to-GDP, inflation since 1993, the cedi, exports against imports, gold and cocoa indexed to a common base, where the budget goes, and Ghana against the highest inflation rates in Africa. Hover any chart for a value; the series colours are a colour-blind-checked set
- **Global markets tab** (`#markets`): world share indices, commodities (gold, cocoa, oil, copper, coffee), crypto and the major currency pairs, each with the day's move and the moment it was quoted, refreshed every 20 minutes. Every tile is tappable and carries its own trend line: the job keeps **one closing price a day for each instrument, up to 180 days**, built up by the site as it runs, so the chart behind a tile lengthens on its own. Nothing is backfilled — a trail starts the day the job first sees a price
- **Global news tab** (`#world`): what the world's wires are carrying right now — Reuters, the Associated Press, the BBC, Al Jazeera, France 24 and CNBC — with the three newest given room at the top and a search box. Headlines and links only; every story opens on the publisher's own page
- **The Ghana Stock Exchange** now sits inside the Global markets tab: every listed company with its last traded price, the day's risers and fallers, and a search box
- **A newer figure elsewhere**: where a third party (the World Bank, the IMF, the ILO) publishes a more recent estimate than Ghana's own release, the dashboard shows it underneath the official figure, labelled and dated, instead of quietly replacing it
- **System status page** (`#status`, linked from the footer): when each automatic job last delivered, whether it is on time, and the age of every published figure
- GH¢ / US$ toggle, charts with keyboard-accessible tooltips, data table, sources

```
index.html                 page structure, meta tags
styles.css                 all styling
app.js                     live counters, charts, staleness warnings, board view
lang-data.js               what Alfredo says in English, Twi, Ewe, Ga and Hausa (safe to edit)
data.js                    figures entered and checked by people
auto-data.js               rates and prices fetched automatically every day (do not edit)
news-data.js               business headlines fetched automatically every 5 minutes (do not edit)
world-data.js              global and African headlines, every 5 minutes (do not edit)
live-data.js               market quotes for the cedi, refreshed every 20 minutes (do not edit)
markets-data.js            world markets and GSE prices, refreshed every 20 minutes (do not edit)
history-data.js            annual World Bank series since 1993 (do not edit)
africa-data.js             African inflation comparison, refreshed each morning (do not edit)
papers-data.js             today's newspaper front pages, refreshed every 5 minutes (do not edit)
articles-data.js           the weekly briefings shown on the Articles tab (do not edit)
articles/                  the same briefings as markdown files, for download
favicon.svg, og-image.png  icon and share preview
scripts/                   update scripts used by the GitHub automations
.github/workflows/         the eight GitHub automations
.github/data-watch/        what the release watcher has already seen
```

## Preview locally

Open `index.html` in a browser, or run a tiny server from this folder:

```bash
npx serve .
# or
python3 -m http.server 8080
```

## Publish it (pick one)

> **Use Git (Option A) if you want the automatic updates.** The automations live in the hidden `.github` folder. GitHub's drag-and-drop upload often skips hidden folders; `git push` or GitHub Desktop includes them.

### Option A: GitHub Pages (free, good if you want it on your GitHub)

1. Create a new public repo, for example `alfredo-ghana-economic-data`.
2. Push this folder's contents to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Alfredo Ghana Economic Data"
   git branch -M main
   git remote add origin https://github.com/<your-username>/alfredo-ghana-economic-data.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages**. Under *Build and deployment*, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then **Save**.
4. After a minute the site is live at `https://<your-username>.github.io/alfredo-ghana-economic-data/`.
5. Turn on the automations (next section).

### Option B: Netlify Drop (fastest, no Git needed)

1. Go to https://app.netlify.com/drop and sign in.
2. Drag this whole folder onto the page.
3. You get a live URL straight away. Rename it under **Site configuration → Change site name**.

### Option C: Vercel

1. Push the folder to GitHub (steps 1–2 above).
2. At https://vercel.com/new, import the repo. Framework preset: **Other**. No build command, output directory `.`.
3. Deploy.

## After it's live: fix the share preview

Social apps need an absolute image URL. In `index.html`, change:

```html
<meta property="og:image" content="og-image.png">
```

to your real address, and add an `og:url` line, for example:

```html
<meta property="og:image" content="https://<your-username>.github.io/alfredo-ghana-economic-data/og-image.png">
<meta property="og:url" content="https://<your-username>.github.io/alfredo-ghana-economic-data/">
```

Also set `siteUrl` at the top of `data.js` to your live address so the share buttons always link to the right place:

```js
siteUrl: "https://<your-username>.github.io/alfredo-ghana-economic-data/",
```

## Custom domain (optional)

Buy a domain (for example `ghanadebtclock.com`), then:

- **GitHub Pages:** Settings → Pages → Custom domain, and add the DNS records GitHub shows.
- **Netlify / Vercel:** Domains → Add domain, and follow the DNS instructions.

## Automatic updates

The site has three layers, so it stays current without anyone retyping numbers from PDFs:

| What | How it updates | You do |
|---|---|---|
| Exchange rates (US$, £, €), gold price, cocoa price, daily cedi history | **Update market data** runs every day at 07:15 GMT, fetches the Bank of Ghana interbank table (with a market-rate fallback), spot gold and ICE cocoa, checks every value is in a sensible range, and commits `auto-data.js`. The site republishes itself. | Nothing |
| Live cedi and gold quotes | **Update live rates** runs every 20 minutes, takes a market quote for the dollar, pound, euro, yuan and gold, and commits `live-data.js` — but only when a rate has actually moved. Each quote keeps the minute it was taken. This never touches the Bank of Ghana figure. | Nothing |
| World markets and the GSE | The same job runs `scripts/fetch-markets.mjs`: world indices, commodities, crypto and currency pairs from Yahoo Finance, plus every Ghana Stock Exchange listing from the GSE's open feed, into `markets-data.js`. Anything that fails to arrive keeps its last price. | Nothing |
| Figures whose source has moved on | **Update market data** also runs `scripts/refresh-readings.mjs` each morning. A figure marked `"wb": true` in `data.js` — meaning the site's own value comes from that long series — is moved to the newest published year, keeping the old reading in its history. Every other figure is left alone and simply marked: the newer third-party estimate is shown underneath it and listed on the status page for a person to check against the official release. Nothing is ever invented. | Check the flagged ones |
| Official statistics (debt, inflation, policy rate, budget, tariffs, fuel prices…) | **Watch official releases** checks Bank of Ghana, Ghana Statistical Service, Ministry of Finance, PURC and NPA pages every weekday at 09:00 GMT. When something new appears it opens a GitHub **issue** with the links, the figures affected and the lines from the PDF that mention key numbers. | Read the issue, check the PDF |
| Recording the new figures | **Record debt figures** and **Update a reading** are forms in the Actions tab. They edit `data.js` safely (with checks for typos and wrong units) and open a **pull request**. | Fill the form, review, merge |
| The long annual series (1993 onwards) | **Update long history** runs every morning at 06:40 GMT, reads 27 of Ghana's series from the World Bank's open data API (no key needed) plus the gold and cocoa price from the futures market, and commits `history-data.js`. A series that fails to arrive keeps the run already in the file. | Nothing |
| Business news headlines | **Update business news** runs every five minutes, reads RSS feeds from MyJoyOnline, Graphic Online, Graphic Business, The High Street Journal, Ghana Business News, Ghana News Agency and News Ghana, plus Reuters wire stories, keeps business stories (headline, short summary, date, link) and commits `news-data.js` when there are new stories. A quiet run commits nothing. | Nothing |
| African inflation comparison | **Update long history** also runs `scripts/fetch-africa.mjs` every morning. The file ships with the prevailing rate for 53 African countries, checked by hand; the job tops each one up from the World Bank's Global Economic Monitor (monthly CPI, year on year) and only ever replaces a country with a **newer month**, so a missing or failed feed changes nothing. Ghana's own figure is copied from `data.js`, so the board and the dashboard can never disagree. | Nothing |
| Today's papers | **Update business news** also runs `scripts/fetch-papers.mjs` every five minutes, reads the front-page feeds of Daily Graphic, Graphic Business, Graphic Sports, MyJoyOnline, Citi Newsroom, GNA and the Ghanaian Times, keeps the newest eight per masthead from the last three days and commits `papers-data.js`. | Nothing |
| The weekly briefing | **Write weekly briefing** runs every Monday at 06:30 GMT, reads `data.js`, `auto-data.js` and `history-data.js`, writes the week's article into `articles/` and adds it to `articles-data.js`. Every figure in it comes from the site, so nothing is invented. | Read it; edit the markdown file if you want to |
| Checking on all of it | The **System status** page (footer link, or `#status`) reads the data files themselves and shows, per job, when it last delivered and whether that is on time, plus every figure and its age. Look here first if something seems stale. | Glance at it now and then |
| An open page | The page refreshes itself every minute (`REFRESH_MS` in `app.js`). It re-reads all seven data files; the portals (news, papers, Africa, briefings) are swapped in quietly so the reader keeps their place, and a change to the figures behind the counters reloads the page — but never while a detail panel, the board view or Alfredo is open. | Nothing |
| Warnings | The website marks any figure past its usual update date with **Update due**, and shows a notice if the debt data is more than 120 days old, the budget year has ended, or the daily job has stopped. | Nothing |

Nothing official changes on the public site until a person has checked it and merged the pull request.

### One-time setup (5 minutes)

1. **Settings → Actions → General**
   - *Actions permissions*: **Allow all actions and reusable workflows**.
   - *Workflow permissions*: **Read and write permissions**, and tick **Allow GitHub Actions to create and approve pull requests**. Save.
2. **Actions tab**: if GitHub asks, click **I understand my workflows, go ahead and enable them**.
3. Run each scheduled job once by hand: **Actions → Update market data → Run workflow**, then **Update business news**, then **Watch official releases**. The watcher's first run only records what already exists, so it will not open a pile of old issues.
4. **Get alerts**: click **Watch → Custom → Issues** at the top of the repo, so GitHub emails you when a new release is detected. GitHub also emails you if a scheduled job fails.

### Monthly routine when an issue arrives

1. Open the issue and the linked PDF. Compare the copied lines with the PDF.
2. **Public debt**: Actions → **Record debt figures** → Run workflow. Enter the month-end date (for example `2026-07-31`), total, domestic and external debt in GH¢ billion, the debt-to-GDP ratio, and the source link.
3. **Any other figure**: Actions → **Update a reading** → Run workflow. Enter the label exactly as it appears on the site (for example `Inflation`, `BoG policy rate`, `Petrol`), the new value, the period (`Sep 2026`, `16 Sep 2026`, `Q2 2026`, `H1 2026`), and a short note.
4. Open the pull request the workflow created, check the change in `data.js`, and click **Merge**. The site updates within a few minutes. Close the issue.

The live debt estimate recalculates its pace on its own: it uses the newest reading and one about six months earlier (`debt.paceMonths`), so one unusual month does not swing the clock.

### Good to know

- **Scheduled jobs pause if a repo is idle.** GitHub disables scheduled workflows in public repos after 60 days without activity. The daily market-data commit normally keeps the repo active; if the jobs ever stop, open the Actions tab and re-enable them.
- **Source websites change.** If a page is redesigned, the job for that source logs a failure and the site keeps the last good value (and eventually shows **Update due**). Edit the address or pattern in `scripts/fetch-market-data.mjs` or `scripts/watch-releases.mjs`.
- **Reuters and Citi Newsroom** have no usable RSS — Reuters retired its feeds and blocks crawlers, and Citi's feed paths now return HTML — so their headlines come through **GDELT**, a free open index of the world's news (`WIRE` at the top of `scripts/fetch-news.mjs`). The papers job does the same for any masthead whose feed stops working, so a dead feed quietly becomes headlines rather than an empty card. Only the headline, the publisher and the link are stored, every link opens on reuters.com, and wire stories carry a small **wire** tag in the list. Market *data* from Reuters is a paid product, so prices on this site come from Yahoo Finance and the Bank of Ghana instead.
- **News sources** are listed at the top of `scripts/fetch-news.mjs`. Add or remove a feed there; set `filter: true` for feeds that mix general news so only business stories are kept. Headlines and links belong to their publishers; the site shows headlines and short summaries only and links to the full story.
- **African inflation figures** live in `africa-data.js`, one entry per country: `latest` (value, month and a sort key such as `2026-08`), `prev` (the month before) and `series`. To correct one by hand, edit its `latest.value` and `latest.period`; the monthly job leaves it alone unless it finds a later month. Add a country by copying an entry and giving it the right ISO3 code.
- **How live the rates are.** The Bank of Ghana publishes its interbank rate once each morning: that stays the official figure the rest of the page counts with. The market quote in the ticker is as current as a free feed allows — every 20 minutes, GitHub's fastest practical schedule — and always carries its own timestamp, so nothing is presented as newer than it is. Tick-by-tick rates need a paid feed and a server of your own; the sources in `scripts/fetch-live-fx.mjs` are where you would swap one in.
- **Newspaper mastheads** are listed at the top of `scripts/fetch-papers.mjs` (name and feed address). Add or remove one there. As with the news tab, only the headline, a short summary and the link are stored, and every story opens on the publisher's own site.
- **Alfredo's languages** are all in `lang-data.js`, one block per language: `strings` (what he says), `labels` (the names of figures), `suggestions` (the buttons under the chat) and `ask` (words people might use in that language). Anything in `{braces}` is a live figure — keep the braces, move them around the sentence as the language needs. Delete a line and it falls back to English, so a half-finished translation never breaks the page. To add a language, copy a block, change the code and the `name`, and translate what you can. The Twi, Ewe, Ga and Hausa wordings are a first pass and deserve a native speaker's eye.
- **Choosing the voice.** The chat box has a **Voice** list under the language chips, showing every voice installed on that device. It defaults to a voice in the chosen language if one exists, and to a man's voice otherwise; the choice is remembered per language on that device. On a Mac you can install more at *System Settings → Accessibility → Spoken Content → Manage Voices*; on Android, in the Google Text-to-Speech settings.
- **For a real Ghanaian voice**, set `alfredo.ttsUrl` in `data.js` to your own small endpoint. Alfredo POSTs `{ text, lang, speech }` to it and plays whatever audio comes back — either `{ "audio": "data:audio/mp3;base64,…" }`, `{ "url": "…" }`, or the audio file itself. That is where a service with Twi, Ga or Ewe speech plugs in (NLP Ghana's Khaya API is the obvious candidate). The key stays on your endpoint, never in this public page, and if the call fails Alfredo falls back to the device voice.
- **Voice depends on the device, not this site.** Dictation uses the browser's own speech recognition — best on Chrome, Android and desktop; Safari on iPhone is patchy. There is no speech model for Twi, Ewe or Ga anywhere yet, so dictation in those languages falls back to listening in English while Alfredo still answers in the chosen language. Reading answers aloud uses the voices installed on the device: most have English (and often Hausa), few have Ghanaian languages, so Alfredo uses the nearest voice available.
- **Ask Alfredo answers from the site itself**, not from an outside service, so there is no key to buy and nothing to pay for. If you ever want it to answer wider questions, set `alfredo.apiUrl` in `data.js` to your own small endpoint; Alfredo will send the question plus a summary of the current figures and show whatever comes back. Leave it blank and Alfredo stays on the dashboard's own numbers.
- **The weekly briefing** is built by `scripts/write-article.mjs` from the published figures — it does not guess. Change the wording or add a section there. Each article is a plain markdown file in `articles/`, so you can edit one by hand before sharing it.
- **Ticker currencies** are set in `data.js` under `fxTicker` (code, name and how many units to quote, for example 1,000 naira). The daily job fetches whatever is listed.
- **Run the scripts on your computer** (Node 20+): `node scripts/fetch-news.mjs`, `node scripts/fetch-market-data.mjs`, `node scripts/watch-releases.mjs --dry-run`, `node scripts/record-debt.mjs --month-end 2026-07-31 --total 735.2 …`, `node scripts/update-reading.mjs --label "Inflation" --value 4.8 --date "Sep 2026"`, `node scripts/fetch-africa.mjs`, `node scripts/fetch-papers.mjs`, `node scripts/write-article.mjs`.

## data.js field guide

| Field | What it is |
|---|---|
| `checked` | Date shown in the footer as "Figures last checked". Updated by the workflows. |
| `siteUrl` | Your live address, used by the share buttons. |
| `fx` | Fallback exchange rates (the daily job overrides these via `auto-data.js`). |
| `debt.readings` | Official month-end debt in GH¢ billion: `date`, `total`, optional `domestic`, `external`, `ratio` (% of GDP). Add one per month. |
| `debt.paceMonths` | How far back the live estimate looks to measure the borrowing pace (default 6). |
| `debt.staleAfterDays` | Show a warning when the newest debt reading is older than this (default 120). |
| `debt.nominalGdp`, `sinkingFund`, `maturities`, `ratioPeak` | Used for the debt-to-GDP gauge and the debt strip. |
| `budget` | The approved budget year and its annual lines. Change `year` and the values when a new budget is passed. |
| `economy`, `people`, `markets` | Published readings. Each has `label`, `value`, `dec` (decimals), `unit`, `date` (period, e.g. `Aug 2026`), `note`, optional `status`, `tone`, `board` (show on board view), `auto` (key filled by the daily job), `maxAgeDays` (when to show **Update due**; `0` turns the warning off). |
| `ratings` | Fitch, S&P and Moody's rating, outlook, date and the notch ladder. |
| `trade`, `benchmarks` | Figures used in calculated indicators and comparisons. |
| `history` | Year-end debt and debt-to-GDP for the chart. December readings are added automatically. |
| `fxTicker` | Currencies shown in the green ticker: `world` and `africa` lists of `{ code, name, unit }`. |
| `cedi`, `cediNote` | Hand-entered cedi rates on specific dates; the daily job adds more. |
| `series` (on any reading) | Past readings for the tap-for-history panel: a list of `{ "date": "Jul 2026", "value": 4.6 }`, oldest first. Optional `seriesSource` names where they came from. The **Update a reading** form adds the reading it replaces automatically, and the daily market job records its own history in `auto-data.js`, so these fill up on their own. |
| `calendar` | National days and the economic calendar (see below). |
| (`history-data.js`) | Written by the monthly World Bank job. To add an indicator, add a line to `INDICATORS` in `scripts/fetch-history.mjs`; to attach one to a figure, name it after the figure's label or add an alias in `HIST_ALIAS` in `app.js`. |
| `sources` | Title and link for every source listed on the site. |

### Adding a national day or an economic date

`calendar.days` drives the flag banner that appears on the day itself, the "National days & the dates ahead" list, and the pill on the board view. Each entry has a `name`, a `kind` (`holiday` for a public holiday, `observance` for a commemorative day, `economic` for a release or decision), a `blurb`, and one date rule:

| Rule | Fields | Example |
|---|---|---|
| `fixed` | `month`, `day` | Independence Day, 6 March |
| `easter` | `offset` in days from Easter Sunday | Good Friday (`-2`), Easter Monday (`1`) |
| `nth-weekday` | `month`, `weekday` (0 Sunday … 6 Saturday), `nth` | Farmer's Day, the first Friday in December |
| `monthly-weekday` | `weekday`, `nth` | Inflation release, the second Wednesday of each month. Only the next one is listed. |
| `dates` | `dates`: a list of `YYYY-MM-DD` | Eid, and Bank of Ghana rate decisions |

Optional extras: `approx: true` marks the date "Expected" (use it for Eid and for dates government has not fixed yet); `since` plus `sinceWord` prints an anniversary, for example `1957` and `years of independence` gives "69 years of independence"; `sourceTitle` and `sourceUrl` link the entry's source.

Two lists to top up once a year: the Eid dates, once the Office of the Chief Imam announces them, and `Bank of Ghana rate decision`, when the Bank publishes next year's MPC dates.

## How the estimate works

Ghana publishes its debt monthly, two to three months late. The site starts from the latest official total in `debt.readings`. It then adds debt at the pace between that reading and one about `paceMonths` earlier. Budget lines spread the approved annual figures evenly across the year. The page labels these as estimates and gives the date of every published reading.

This is an independent public-education project. It is not affiliated with the Government of Ghana or the Bank of Ghana.

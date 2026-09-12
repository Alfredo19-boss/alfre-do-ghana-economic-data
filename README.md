# Alfredo Ghana Economic Data

A live, LED-style dashboard of Ghana's economy: public debt counting in real time, the 2026 budget, gold, cocoa and oil, credit ratings, markets, cost of living and key indicators.

It's a plain static site: no build step, no framework, no server.

## Features

- Live ticking counters for total, domestic and external debt, debt per person, debt-to-GDP and the 2026 budget
- **Widescreen layout**: on monitors 1680px and wider the page spreads into a full-width grid
- **Board view**: a single 16:9 screen with everything on it, for TVs, projectors and wall displays. Click *Board view*, or open `yoursite/#board` to launch straight into it (handy for a TV browser). Press Esc to leave.
- **Tap any figure for its history**: a chart, a table of past readings and a plain-language trend read-out slide in from the side on a desktop and up from the bottom on a phone. Works by touch, mouse or keyboard (Tab to a figure, press Enter; Esc closes).
- **The long view, 1993 to today**: inflation, growth, income per person, population, reserves, the cedi, exports, imports, the trade balance, remittances, unemployment and nominal GDP carry an annual series from the World Bank, refreshed monthly, with its own chart, trend and year-by-year table.
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
- **Ghana's GDP so far this year** as a live green counter in the hero
- **Business news tab** (`#news`): Ghana business headlines from publishers' RSS feeds, refreshed hourly, with search, topic and source filters and a market snapshot
- GH¢ / US$ toggle, charts with keyboard-accessible tooltips, data table, sources

```
index.html                 page structure, meta tags
styles.css                 all styling
app.js                     live counters, charts, staleness warnings, board view
data.js                    figures entered and checked by people
auto-data.js               rates and prices fetched automatically every day (do not edit)
news-data.js               business headlines fetched automatically every hour (do not edit)
history-data.js            annual World Bank series since 1993 (do not edit)
favicon.svg, og-image.png  icon and share preview
scripts/                   update scripts used by the GitHub automations
.github/workflows/         the six GitHub automations
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
| Official statistics (debt, inflation, policy rate, budget, tariffs, fuel prices…) | **Watch official releases** checks Bank of Ghana, Ghana Statistical Service, Ministry of Finance, PURC and NPA pages every weekday at 09:00 GMT. When something new appears it opens a GitHub **issue** with the links, the figures affected and the lines from the PDF that mention key numbers. | Read the issue, check the PDF |
| Recording the new figures | **Record debt figures** and **Update a reading** are forms in the Actions tab. They edit `data.js` safely (with checks for typos and wrong units) and open a **pull request**. | Fill the form, review, merge |
| The long annual series (1993 onwards) | **Update long history** runs on the 3rd of each month, reads Ghana's series from the World Bank's open data API (no key needed), and commits `history-data.js`. | Nothing |
| Business news headlines | **Update business news** runs every hour, reads RSS feeds from MyJoyOnline, Citi Newsroom, The High Street Journal, Ghana Business News, Ghana News Agency and News Ghana, keeps business stories (headline, short summary, date, link) and commits `news-data.js` when there are new stories. The news tab also reloads headlines every 10 minutes for visitors who keep it open. | Nothing |
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
- **News sources** are listed at the top of `scripts/fetch-news.mjs`. Add or remove a feed there; set `filter: true` for feeds that mix general news so only business stories are kept. Headlines and links belong to their publishers; the site shows headlines and short summaries only and links to the full story.
- **Ticker currencies** are set in `data.js` under `fxTicker` (code, name and how many units to quote, for example 1,000 naira). The daily job fetches whatever is listed.
- **Run the scripts on your computer** (Node 20+): `node scripts/fetch-news.mjs`, `node scripts/fetch-market-data.mjs`, `node scripts/watch-releases.mjs --dry-run`, `node scripts/record-debt.mjs --month-end 2026-07-31 --total 735.2 …`, `node scripts/update-reading.mjs --label "Inflation" --value 4.8 --date "Sep 2026"`.

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

/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-09-21T13:19:13.556Z",
  "note": "The Bank of Ghana's interbank mid-rate is the site's official figure and leads the dashboard; the market quotes beneath it are taken through the day and carry the minute they were read.",
  "source": "Bank of Ghana, with daily mid-market rates for the cedi pairs and Yahoo Finance for gold",
  "official": {
    "date": "2026-09-18",
    "rates": {
      "usd": {
        "value": 11.55
      },
      "gbp": {
        "value": 15.4464
      },
      "eur": {
        "value": 13.2445
      }
    },
    "source": "Bank of Ghana interbank mid-rate",
    "url": "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/"
  },
  "officialAt": "2026-09-21T13:19:13.556Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.5149 (mid-market, 2026-09-20)",
    "gbp: 15.4246 (mid-market, 2026-09-20)",
    "eur: 13.2262 (mid-market, 2026-09-20)",
    "cny: 1.71823 (mid-market, 2026-09-20)",
    "gold: 4400 at 2026-09-21T13:09:01.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: 2026-09-18, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-09-21: 2026-09-18, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: no rate row found",
    "BoG in use: 2026-09-18 · usd 11.55, gbp 15.4464, eur 13.2445"
  ],
  "quotes": {
    "usd": {
      "value": 11.5149,
      "at": "2026-09-20T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.5168
    },
    "gbp": {
      "value": 15.4246,
      "at": "2026-09-20T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.425
    },
    "eur": {
      "value": 13.2262,
      "at": "2026-09-20T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 13.2277
    },
    "cny": {
      "value": 1.71823,
      "at": "2026-09-20T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.7185
    },
    "gold": {
      "value": 4400,
      "at": "2026-09-21T13:09:01.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4388.7
    }
  }
};

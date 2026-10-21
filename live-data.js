/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-10-21T06:33:02.533Z",
  "note": "The Bank of Ghana's interbank mid-rate is the site's official figure and leads the dashboard; the market quotes beneath it are taken through the day and carry the minute they were read.",
  "source": "Bank of Ghana, with daily mid-market rates for the cedi pairs and Yahoo Finance for gold",
  "official": {
    "date": "2026-10-20",
    "rates": {
      "usd": {
        "value": 11.6058
      },
      "gbp": {
        "value": 15.5187
      },
      "eur": {
        "value": 13.0311
      }
    },
    "source": "Bank of Ghana interbank mid-rate",
    "url": "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/"
  },
  "officialAt": "2026-10-21T06:33:02.533Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.6177 (mid-market, 2026-10-20)",
    "gbp: 15.5454 (mid-market, 2026-10-20)",
    "eur: 13.0537 (mid-market, 2026-10-20)",
    "cny: 1.73948 (mid-market, 2026-10-20)",
    "gold: 4132.1 at 2026-10-21T06:22:52.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: 2026-10-20, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-10-21: 2026-10-20, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: no rate row found",
    "BoG in use: 2026-10-20 · usd 11.6058, gbp 15.5187, eur 13.0311"
  ],
  "quotes": {
    "usd": {
      "value": 11.6177,
      "at": "2026-10-20T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.6802
    },
    "gbp": {
      "value": 15.5454,
      "at": "2026-10-20T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.5655
    },
    "eur": {
      "value": 13.0537,
      "at": "2026-10-20T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 13.1163
    },
    "cny": {
      "value": 1.73948,
      "at": "2026-10-20T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.74771
    },
    "gold": {
      "value": 4132.1,
      "at": "2026-10-21T06:22:52.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4127.7
    }
  }
};

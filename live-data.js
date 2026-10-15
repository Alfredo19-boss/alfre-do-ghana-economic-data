/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-10-15T12:05:04.090Z",
  "note": "The Bank of Ghana's interbank mid-rate is the site's official figure and leads the dashboard; the market quotes beneath it are taken through the day and carry the minute they were read.",
  "source": "Bank of Ghana, with daily mid-market rates for the cedi pairs and Yahoo Finance for gold",
  "official": {
    "date": "2026-10-14",
    "rates": {
      "usd": {
        "value": 11.675
      },
      "gbp": {
        "value": 15.3556
      },
      "eur": {
        "value": 12.9868
      }
    },
    "source": "Bank of Ghana interbank mid-rate",
    "url": "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/"
  },
  "officialAt": "2026-10-15T12:05:04.090Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.6561 (mid-market, 2026-10-15)",
    "gbp: 15.4423 (mid-market, 2026-10-15)",
    "eur: 13.0841 (mid-market, 2026-10-15)",
    "cny: 1.74166 (mid-market, 2026-10-15)",
    "gold: 4172.5 at 2026-10-15T11:54:48.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: 2026-10-14, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-10-15: 2026-10-14, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: no rate row found",
    "BoG in use: 2026-10-14 · usd 11.675, gbp 15.3556, eur 12.9868"
  ],
  "quotes": {
    "usd": {
      "value": 11.6561,
      "at": "2026-10-15T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.691
    },
    "gbp": {
      "value": 15.4423,
      "at": "2026-10-15T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.5197
    },
    "eur": {
      "value": 13.0841,
      "at": "2026-10-15T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 13.1067
    },
    "cny": {
      "value": 1.74166,
      "at": "2026-10-15T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.74707
    },
    "gold": {
      "value": 4172.5,
      "at": "2026-10-15T11:54:48.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4154.6
    }
  }
};

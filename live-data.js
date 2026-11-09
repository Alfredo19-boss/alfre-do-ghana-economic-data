/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-11-09T02:57:38.343Z",
  "note": "The Bank of Ghana's interbank mid-rate is the site's official figure and leads the dashboard; the market quotes beneath it are taken through the day and carry the minute they were read.",
  "source": "Bank of Ghana, with daily mid-market rates for the cedi pairs and Yahoo Finance for gold",
  "official": {
    "date": "2026-11-06",
    "rates": {
      "usd": {
        "value": 11.64
      },
      "gbp": {
        "value": 15.5505
      },
      "eur": {
        "value": 12.976
      }
    },
    "source": "Bank of Ghana interbank mid-rate",
    "url": "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/"
  },
  "officialAt": "2026-11-09T02:57:38.343Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.678 (mid-market, 2026-11-08)",
    "gbp: 15.5973 (mid-market, 2026-11-08)",
    "eur: 13.0204 (mid-market, 2026-11-08)",
    "cny: 1.74938 (mid-market, 2026-11-08)",
    "gold: 4134.4 at 2026-11-09T02:47:22.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: 2026-11-06, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-11-09: 2026-11-06, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: no rate row found",
    "BoG in use: 2026-11-06 · usd 11.64, gbp 15.5505, eur 12.976"
  ],
  "quotes": {
    "usd": {
      "value": 11.678,
      "at": "2026-11-08T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.7128
    },
    "gbp": {
      "value": 15.5973,
      "at": "2026-11-08T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.6394
    },
    "eur": {
      "value": 13.0204,
      "at": "2026-11-08T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 13.0484
    },
    "cny": {
      "value": 1.74938,
      "at": "2026-11-08T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.75459
    },
    "gold": {
      "value": 4134.4,
      "at": "2026-11-09T02:47:22.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4079.8
    }
  }
};

/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-11-03T17:09:01.675Z",
  "note": "The Bank of Ghana's interbank mid-rate is the site's official figure and leads the dashboard; the market quotes beneath it are taken through the day and carry the minute they were read.",
  "source": "Bank of Ghana, with daily mid-market rates for the cedi pairs and Yahoo Finance for gold",
  "official": {
    "date": "2026-11-03",
    "rates": {
      "usd": {
        "value": 11.66
      },
      "gbp": {
        "value": 15.6355
      },
      "eur": {
        "value": 13.0372
      }
    },
    "source": "Bank of Ghana interbank mid-rate",
    "url": "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/"
  },
  "officialAt": "2026-11-03T17:09:01.675Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.667 (mid-market, 2026-11-02)",
    "gbp: 15.6349 (mid-market, 2026-11-02)",
    "eur: 13.0483 (mid-market, 2026-11-02)",
    "cny: 1.75465 (mid-market, 2026-11-02)",
    "gold: 3936.4 at 2026-11-03T16:58:47.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: 2026-11-03, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-11-03: 2026-11-03, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: no rate row found",
    "BoG in use: 2026-11-03 · usd 11.66, gbp 15.6355, eur 13.0372"
  ],
  "quotes": {
    "usd": {
      "value": 11.667,
      "at": "2026-11-02T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.6427
    },
    "gbp": {
      "value": 15.6349,
      "at": "2026-11-02T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.5965
    },
    "eur": {
      "value": 13.0483,
      "at": "2026-11-02T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 13.0445
    },
    "cny": {
      "value": 1.75465,
      "at": "2026-11-02T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.74908
    },
    "gold": {
      "value": 3936.4,
      "at": "2026-11-03T16:58:47.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 3907.1
    }
  }
};

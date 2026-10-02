/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-10-02T13:56:36.318Z",
  "note": "The Bank of Ghana's interbank mid-rate is the site's official figure and leads the dashboard; the market quotes beneath it are taken through the day and carry the minute they were read.",
  "source": "Bank of Ghana, with daily mid-market rates for the cedi pairs and Yahoo Finance for gold",
  "official": {
    "date": "2026-10-01",
    "rates": {
      "usd": {
        "value": 11.715
      },
      "gbp": {
        "value": 15.4521
      },
      "eur": {
        "value": 13.1496
      }
    },
    "source": "Bank of Ghana interbank mid-rate",
    "url": "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/"
  },
  "officialAt": "2026-10-02T13:56:36.318Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.7198 (mid-market, 2026-10-01)",
    "gbp: 15.5247 (mid-market, 2026-10-01)",
    "eur: 13.2629 (mid-market, 2026-10-01)",
    "cny: 1.74782 (mid-market, 2026-10-01)",
    "gold: 4218.8 at 2026-10-02T13:46:25.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: 2026-10-01, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-10-02: 2026-10-01, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: no rate row found",
    "BoG in use: 2026-10-01 · usd 11.715, gbp 15.4521, eur 13.1496"
  ],
  "quotes": {
    "usd": {
      "value": 11.7198,
      "at": "2026-10-01T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.6752
    },
    "gbp": {
      "value": 15.5247,
      "at": "2026-10-01T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.4436
    },
    "eur": {
      "value": 13.2629,
      "at": "2026-10-01T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 13.2306
    },
    "cny": {
      "value": 1.74782,
      "at": "2026-10-01T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.7412
    },
    "gold": {
      "value": 4218.8,
      "at": "2026-10-02T13:46:25.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4209.3
    }
  }
};

/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-11-02T01:48:03.691Z",
  "note": "The Bank of Ghana's interbank mid-rate is the site's official figure and leads the dashboard; the market quotes beneath it are taken through the day and carry the minute they were read.",
  "source": "Bank of Ghana, with daily mid-market rates for the cedi pairs and Yahoo Finance for gold",
  "official": {
    "date": "2026-10-30",
    "rates": {
      "usd": {
        "value": 11.62
      },
      "gbp": {
        "value": 15.5627
      },
      "eur": {
        "value": 12.9619
      }
    },
    "source": "Bank of Ghana interbank mid-rate",
    "url": "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/"
  },
  "officialAt": "2026-11-02T01:48:03.691Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.6427 (mid-market, 2026-11-01)",
    "gbp: 15.5965 (mid-market, 2026-11-01)",
    "eur: 13.0445 (mid-market, 2026-11-01)",
    "cny: 1.74908 (mid-market, 2026-11-01)",
    "gold: 3919.4 at 2026-11-02T01:37:53.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: 2026-10-30, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-11-02: 2026-10-30, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: no rate row found",
    "BoG in use: 2026-10-30 · usd 11.62, gbp 15.5627, eur 12.9619"
  ],
  "quotes": {
    "usd": {
      "value": 11.6427,
      "at": "2026-11-01T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.6438
    },
    "gbp": {
      "value": 15.5965,
      "at": "2026-11-01T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.5896
    },
    "eur": {
      "value": 13.0445,
      "at": "2026-11-01T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 12.9968
    },
    "cny": {
      "value": 1.74908,
      "at": "2026-11-01T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.74924
    },
    "gold": {
      "value": 3919.4,
      "at": "2026-11-02T01:37:53.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 3898.9
    }
  }
};

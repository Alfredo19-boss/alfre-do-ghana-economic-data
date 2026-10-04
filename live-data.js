/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-10-04T21:55:01.521Z",
  "note": "The Bank of Ghana's interbank mid-rate is the site's official figure and leads the dashboard; the market quotes beneath it are taken through the day and carry the minute they were read.",
  "source": "Bank of Ghana, with daily mid-market rates for the cedi pairs and Yahoo Finance for gold",
  "official": {
    "date": "2026-10-02",
    "rates": {
      "usd": {
        "value": 11.71
      },
      "gbp": {
        "value": 15.4871
      },
      "eur": {
        "value": 13.176
      }
    },
    "source": "Bank of Ghana interbank mid-rate",
    "url": "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/"
  },
  "officialAt": "2026-10-04T21:55:01.521Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.7347 (mid-market, 2026-10-04)",
    "gbp: 15.5386 (mid-market, 2026-10-04)",
    "eur: 13.2111 (mid-market, 2026-10-04)",
    "cny: 1.74944 (mid-market, 2026-10-04)",
    "gold: 4162.3 at 2026-10-02T20:59:58.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: 2026-10-02, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-10-04: 2026-10-02, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: no rate row found",
    "BoG in use: 2026-10-02 · usd 11.71, gbp 15.4871, eur 13.176"
  ],
  "quotes": {
    "usd": {
      "value": 11.7347,
      "at": "2026-10-04T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.7351
    },
    "gbp": {
      "value": 15.5386,
      "at": "2026-10-04T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.5361
    },
    "eur": {
      "value": 13.2111,
      "at": "2026-10-04T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 13.2059
    },
    "cny": {
      "value": 1.74944,
      "at": "2026-10-04T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.75021
    },
    "gold": {
      "value": 4162.3,
      "at": "2026-10-02T20:59:58.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4172.1
    }
  }
};

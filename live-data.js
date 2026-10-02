/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-10-02T20:49:00.219Z",
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
  "officialAt": "2026-10-02T20:49:00.219Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.7476 (mid-market, 2026-10-02)",
    "gbp: 15.5202 (mid-market, 2026-10-02)",
    "eur: 13.2199 (mid-market, 2026-10-02)",
    "cny: 1.75157 (mid-market, 2026-10-02)",
    "gold: 4168.4 at 2026-10-02T20:38:45.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: 2026-10-02, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-10-02: 2026-10-02, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: no rate row found",
    "BoG in use: 2026-10-02 · usd 11.71, gbp 15.4871, eur 13.176"
  ],
  "quotes": {
    "usd": {
      "value": 11.7476,
      "at": "2026-10-02T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.7198
    },
    "gbp": {
      "value": 15.5202,
      "at": "2026-10-02T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.5247
    },
    "eur": {
      "value": 13.2199,
      "at": "2026-10-02T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 13.2629
    },
    "cny": {
      "value": 1.75157,
      "at": "2026-10-02T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.74782
    },
    "gold": {
      "value": 4168.4,
      "at": "2026-10-02T20:38:45.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4171.9
    }
  }
};

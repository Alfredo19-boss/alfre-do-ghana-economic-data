/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-10-08T13:42:50.313Z",
  "note": "The Bank of Ghana's interbank mid-rate is the site's official figure and leads the dashboard; the market quotes beneath it are taken through the day and carry the minute they were read.",
  "source": "Bank of Ghana, with daily mid-market rates for the cedi pairs and Yahoo Finance for gold",
  "official": {
    "date": "2026-10-07",
    "rates": {
      "usd": {
        "value": 11.83
      },
      "gbp": {
        "value": 15.6268
      },
      "eur": {
        "value": 13.2375
      }
    },
    "source": "Bank of Ghana interbank mid-rate",
    "url": "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/"
  },
  "officialAt": "2026-10-08T13:42:50.313Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.7671 (mid-market, 2026-10-07)",
    "gbp: 15.5892 (mid-market, 2026-10-07)",
    "eur: 13.2152 (mid-market, 2026-10-07)",
    "cny: 1.75488 (mid-market, 2026-10-07)",
    "gold: 4152.7 at 2026-10-08T13:32:38.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: 2026-10-07, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-10-08: 2026-10-07, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: no rate row found",
    "BoG in use: 2026-10-07 · usd 11.83, gbp 15.6268, eur 13.2375"
  ],
  "quotes": {
    "usd": {
      "value": 11.7671,
      "at": "2026-10-07T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.7567
    },
    "gbp": {
      "value": 15.5892,
      "at": "2026-10-07T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.5352
    },
    "eur": {
      "value": 13.2152,
      "at": "2026-10-07T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 13.1849
    },
    "cny": {
      "value": 1.75488,
      "at": "2026-10-07T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.75337
    },
    "gold": {
      "value": 4152.7,
      "at": "2026-10-08T13:32:38.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4143.5
    }
  }
};

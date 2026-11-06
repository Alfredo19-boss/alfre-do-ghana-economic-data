/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-11-06T16:14:22.147Z",
  "note": "The Bank of Ghana's interbank mid-rate is the site's official figure and leads the dashboard; the market quotes beneath it are taken through the day and carry the minute they were read.",
  "source": "Bank of Ghana, with daily mid-market rates for the cedi pairs and Yahoo Finance for gold",
  "official": {
    "date": "2026-11-05",
    "rates": {
      "usd": {
        "value": 11.66
      },
      "gbp": {
        "value": 15.709
      },
      "eur": {
        "value": 13.0935
      }
    },
    "source": "Bank of Ghana interbank mid-rate",
    "url": "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/"
  },
  "officialAt": "2026-11-06T16:14:22.147Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.6675 (mid-market, 2026-11-06)",
    "gbp: 15.6644 (mid-market, 2026-11-06)",
    "eur: 13.0642 (mid-market, 2026-11-06)",
    "cny: 1.74943 (mid-market, 2026-11-06)",
    "gold: 4066.8 at 2026-11-06T16:04:11.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: 2026-11-05, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-11-06: 2026-11-05, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: no rate row found",
    "BoG in use: 2026-11-05 · usd 11.66, gbp 15.709, eur 13.0935"
  ],
  "quotes": {
    "usd": {
      "value": 11.6675,
      "at": "2026-11-06T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.6511
    },
    "gbp": {
      "value": 15.6644,
      "at": "2026-11-06T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.717
    },
    "eur": {
      "value": 13.0642,
      "at": "2026-11-06T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 13.1203
    },
    "cny": {
      "value": 1.74943,
      "at": "2026-11-06T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.74697
    },
    "gold": {
      "value": 4066.8,
      "at": "2026-11-06T16:04:11.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4073.4
    }
  }
};

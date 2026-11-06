/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-11-06T08:29:30.213Z",
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
  "officialAt": "2026-11-06T08:29:30.213Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.6511 (mid-market, 2026-11-05)",
    "gbp: 15.717 (mid-market, 2026-11-05)",
    "eur: 13.1203 (mid-market, 2026-11-05)",
    "cny: 1.74697 (mid-market, 2026-11-05)",
    "gold: 4073.4 at 2026-11-06T08:19:16.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: 2026-11-05, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-11-06: 2026-11-05, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: no rate row found",
    "BoG in use: 2026-11-05 · usd 11.66, gbp 15.709, eur 13.0935"
  ],
  "quotes": {
    "usd": {
      "value": 11.6511,
      "at": "2026-11-05T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.63
    },
    "gbp": {
      "value": 15.717,
      "at": "2026-11-05T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.6474
    },
    "eur": {
      "value": 13.1203,
      "at": "2026-11-05T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 13.0621
    },
    "cny": {
      "value": 1.74697,
      "at": "2026-11-05T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.73997
    },
    "gold": {
      "value": 4073.4,
      "at": "2026-11-06T08:19:16.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4102
    }
  }
};

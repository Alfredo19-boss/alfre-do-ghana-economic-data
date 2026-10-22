/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-10-22T14:23:03.187Z",
  "note": "The Bank of Ghana's interbank mid-rate is the site's official figure and leads the dashboard; the market quotes beneath it are taken through the day and carry the minute they were read.",
  "source": "Bank of Ghana, with daily mid-market rates for the cedi pairs and Yahoo Finance for gold",
  "official": {
    "date": "2026-10-21",
    "rates": {
      "usd": {
        "value": 11.655
      },
      "gbp": {
        "value": 15.6031
      },
      "eur": {
        "value": 13.0751
      }
    },
    "source": "Bank of Ghana interbank mid-rate",
    "url": "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/"
  },
  "officialAt": "2026-10-22T14:23:03.187Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.6188 (mid-market, 2026-10-21)",
    "gbp: 15.5411 (mid-market, 2026-10-21)",
    "eur: 13.0456 (mid-market, 2026-10-21)",
    "cny: 1.73968 (mid-market, 2026-10-21)",
    "gold: 4066 at 2026-10-22T14:12:51.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: 2026-10-21, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-10-22: 2026-10-21, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: failed (HTTP 502)",
    "BoG in use: 2026-10-21 · usd 11.655, gbp 15.6031, eur 13.0751"
  ],
  "quotes": {
    "usd": {
      "value": 11.6188,
      "at": "2026-10-21T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.6177
    },
    "gbp": {
      "value": 15.5411,
      "at": "2026-10-21T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.5454
    },
    "eur": {
      "value": 13.0456,
      "at": "2026-10-21T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 13.0537
    },
    "cny": {
      "value": 1.73968,
      "at": "2026-10-21T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.73948
    },
    "gold": {
      "value": 4066,
      "at": "2026-10-22T14:12:51.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4108.8
    }
  }
};

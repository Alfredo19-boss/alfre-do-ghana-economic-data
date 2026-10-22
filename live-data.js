/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-10-22T22:09:05.213Z",
  "note": "The Bank of Ghana's interbank mid-rate is the site's official figure and leads the dashboard; the market quotes beneath it are taken through the day and carry the minute they were read.",
  "source": "Bank of Ghana, with daily mid-market rates for the cedi pairs and Yahoo Finance for gold",
  "official": {
    "date": "2026-10-22",
    "rates": {
      "usd": {
        "value": 11.605
      },
      "gbp": {
        "value": 15.5281
      },
      "eur": {
        "value": 13.0105
      }
    },
    "source": "Bank of Ghana interbank mid-rate",
    "url": "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/"
  },
  "officialAt": "2026-10-22T22:09:05.213Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.6263 (mid-market, 2026-10-22)",
    "gbp: 15.5766 (mid-market, 2026-10-22)",
    "eur: 13.0716 (mid-market, 2026-10-22)",
    "cny: 1.74184 (mid-market, 2026-10-22)",
    "gold: 4039.8 at 2026-10-22T20:59:59.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: 2026-10-22, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-10-22: 2026-10-22, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: no rate row found",
    "BoG in use: 2026-10-22 · usd 11.605, gbp 15.5281, eur 13.0105"
  ],
  "quotes": {
    "usd": {
      "value": 11.6263,
      "at": "2026-10-22T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.6188
    },
    "gbp": {
      "value": 15.5766,
      "at": "2026-10-22T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.5411
    },
    "eur": {
      "value": 13.0716,
      "at": "2026-10-22T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 13.0456
    },
    "cny": {
      "value": 1.74184,
      "at": "2026-10-22T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.73968
    },
    "gold": {
      "value": 4039.8,
      "at": "2026-10-22T20:59:59.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4052.7
    }
  }
};

/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-09-25T22:28:43.530Z",
  "note": "The Bank of Ghana's interbank mid-rate is the site's official figure and leads the dashboard; the market quotes beneath it are taken through the day and carry the minute they were read.",
  "source": "Bank of Ghana, with daily mid-market rates for the cedi pairs and Yahoo Finance for gold",
  "official": {
    "date": "2026-09-25",
    "rates": {
      "usd": {
        "value": 11.6225
      },
      "gbp": {
        "value": 15.3958
      },
      "eur": {
        "value": 13.2443
      }
    },
    "source": "Bank of Ghana interbank mid-rate",
    "url": "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/"
  },
  "officialAt": "2026-09-25T22:28:43.530Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.5953 (mid-market, 2026-09-25)",
    "gbp: 15.3192 (mid-market, 2026-09-25)",
    "eur: 13.1835 (mid-market, 2026-09-25)",
    "cny: 1.7273 (mid-market, 2026-09-25)",
    "gold: 4320.5 at 2026-09-25T20:59:59.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: 2026-09-25, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-09-25: 2026-09-25, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: no rate row found",
    "BoG in use: 2026-09-25 · usd 11.6225, gbp 15.3958, eur 13.2443"
  ],
  "quotes": {
    "usd": {
      "value": 11.5953,
      "at": "2026-09-25T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.5845
    },
    "gbp": {
      "value": 15.3192,
      "at": "2026-09-25T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.3317
    },
    "eur": {
      "value": 13.1835,
      "at": "2026-09-25T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 13.1794
    },
    "cny": {
      "value": 1.7273,
      "at": "2026-09-25T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.72533
    },
    "gold": {
      "value": 4320.5,
      "at": "2026-09-25T20:59:59.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4329.6
    }
  }
};

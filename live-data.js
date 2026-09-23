/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-09-23T12:10:55.271Z",
  "note": "The Bank of Ghana's interbank mid-rate is the site's official figure and leads the dashboard; the market quotes beneath it are taken through the day and carry the minute they were read.",
  "source": "Bank of Ghana, with daily mid-market rates for the cedi pairs and Yahoo Finance for gold",
  "official": {
    "date": "2026-09-22",
    "rates": {
      "usd": {
        "value": 11.5705
      },
      "gbp": {
        "value": 15.4154
      },
      "eur": {
        "value": 13.2293
      }
    },
    "source": "Bank of Ghana interbank mid-rate",
    "url": "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/"
  },
  "officialAt": "2026-09-23T12:10:55.271Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.5151 (mid-market, 2026-09-22)",
    "gbp: 15.4102 (mid-market, 2026-09-22)",
    "eur: 13.2132 (mid-market, 2026-09-22)",
    "cny: 1.71965 (mid-market, 2026-09-22)",
    "gold: 4349.1 at 2026-09-23T12:00:40.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: 2026-09-22, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-09-23: 2026-09-22, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: no rate row found",
    "BoG in use: 2026-09-22 · usd 11.5705, gbp 15.4154, eur 13.2293"
  ],
  "quotes": {
    "usd": {
      "value": 11.5151,
      "at": "2026-09-22T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.5149
    },
    "gbp": {
      "value": 15.4102,
      "at": "2026-09-22T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.4105
    },
    "eur": {
      "value": 13.2132,
      "at": "2026-09-22T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 13.2161
    },
    "cny": {
      "value": 1.71965,
      "at": "2026-09-22T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.71964
    },
    "gold": {
      "value": 4349.1,
      "at": "2026-09-23T12:00:40.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4367.2
    }
  }
};

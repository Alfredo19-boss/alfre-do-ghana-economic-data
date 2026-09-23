/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-09-23T20:28:54.812Z",
  "note": "The Bank of Ghana's interbank mid-rate is the site's official figure and leads the dashboard; the market quotes beneath it are taken through the day and carry the minute they were read.",
  "source": "Bank of Ghana, with daily mid-market rates for the cedi pairs and Yahoo Finance for gold",
  "official": {
    "date": "2026-09-23",
    "rates": {
      "usd": {
        "value": 11.595
      },
      "gbp": {
        "value": 15.3582
      },
      "eur": {
        "value": 13.2045
      }
    },
    "source": "Bank of Ghana interbank mid-rate",
    "url": "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/"
  },
  "officialAt": "2026-09-23T20:28:54.812Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.5151 (mid-market, 2026-09-22)",
    "gbp: 15.4102 (mid-market, 2026-09-22)",
    "eur: 13.2132 (mid-market, 2026-09-22)",
    "cny: 1.71965 (mid-market, 2026-09-22)",
    "gold: 4321.7 at 2026-09-23T20:18:38.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: 2026-09-23, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-09-23: 2026-09-23, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: no rate row found",
    "BoG in use: 2026-09-23 · usd 11.595, gbp 15.3582, eur 13.2045"
  ],
  "quotes": {
    "usd": {
      "value": 11.5511,
      "at": "2026-09-23T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.5151
    },
    "gbp": {
      "value": 15.3825,
      "at": "2026-09-23T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.4102
    },
    "eur": {
      "value": 13.1986,
      "at": "2026-09-23T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 13.2132
    },
    "cny": {
      "value": 1.72284,
      "at": "2026-09-23T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.71965
    },
    "gold": {
      "value": 4321.7,
      "at": "2026-09-23T20:18:38.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4316.2
    }
  }
};

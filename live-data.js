/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-10-12T02:28:52.418Z",
  "note": "The Bank of Ghana's interbank mid-rate is the site's official figure and leads the dashboard; the market quotes beneath it are taken through the day and carry the minute they were read.",
  "source": "Bank of Ghana, with daily mid-market rates for the cedi pairs and Yahoo Finance for gold",
  "official": {
    "date": "2026-10-09",
    "rates": {
      "usd": {
        "value": 11.79
      },
      "gbp": {
        "value": 15.597
      },
      "eur": {
        "value": 13.1977
      }
    },
    "source": "Bank of Ghana interbank mid-rate",
    "url": "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/"
  },
  "officialAt": "2026-10-12T02:28:52.418Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.7659 (mid-market, 2026-10-11)",
    "gbp: 15.5649 (mid-market, 2026-10-11)",
    "eur: 13.1821 (mid-market, 2026-10-11)",
    "cny: 1.75601 (mid-market, 2026-10-11)",
    "gold: 4236.3 at 2026-10-12T02:18:35.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: 2026-10-09, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-10-12: 2026-10-09, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: no rate row found",
    "BoG in use: 2026-10-09 · usd 11.79, gbp 15.597, eur 13.1977"
  ],
  "quotes": {
    "usd": {
      "value": 11.7659,
      "at": "2026-10-11T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.8632
    },
    "gbp": {
      "value": 15.5649,
      "at": "2026-10-11T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.6984
    },
    "eur": {
      "value": 13.1821,
      "at": "2026-10-11T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 13.2889
    },
    "cny": {
      "value": 1.75601,
      "at": "2026-10-11T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.77147
    },
    "gold": {
      "value": 4236.3,
      "at": "2026-10-12T02:18:35.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4209.1
    }
  }
};

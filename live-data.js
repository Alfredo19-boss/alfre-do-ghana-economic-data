/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-10-09T23:09:11.861Z",
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
  "officialAt": "2026-10-09T23:09:11.861Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.7626 (mid-market, 2026-10-09)",
    "gbp: 15.582 (mid-market, 2026-10-09)",
    "eur: 13.2194 (mid-market, 2026-10-09)",
    "cny: 1.75628 (mid-market, 2026-10-09)",
    "gold: 4220.3 at 2026-10-09T20:59:59.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: 2026-10-09, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-10-09: 2026-10-09, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: no rate row found",
    "BoG in use: 2026-10-09 · usd 11.79, gbp 15.597, eur 13.1977"
  ],
  "quotes": {
    "usd": {
      "value": 11.7626,
      "at": "2026-10-09T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.801
    },
    "gbp": {
      "value": 15.582,
      "at": "2026-10-09T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.5857
    },
    "eur": {
      "value": 13.2194,
      "at": "2026-10-09T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 13.223
    },
    "cny": {
      "value": 1.75628,
      "at": "2026-10-09T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.76048
    },
    "gold": {
      "value": 4220.3,
      "at": "2026-10-09T20:59:59.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4221.7
    }
  }
};

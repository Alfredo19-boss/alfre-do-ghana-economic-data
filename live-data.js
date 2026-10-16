/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-10-16T22:11:28.478Z",
  "note": "The Bank of Ghana's interbank mid-rate is the site's official figure and leads the dashboard; the market quotes beneath it are taken through the day and carry the minute they were read.",
  "source": "Bank of Ghana, with daily mid-market rates for the cedi pairs and Yahoo Finance for gold",
  "official": {
    "date": "2026-10-16",
    "rates": {
      "usd": {
        "value": 11.665
      },
      "gbp": {
        "value": 15.5454
      },
      "eur": {
        "value": 13.0964
      }
    },
    "source": "Bank of Ghana interbank mid-rate",
    "url": "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/"
  },
  "officialAt": "2026-10-16T22:11:28.478Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.6365 (mid-market, 2026-10-16)",
    "gbp: 15.4799 (mid-market, 2026-10-16)",
    "eur: 13.0766 (mid-market, 2026-10-16)",
    "cny: 1.73952 (mid-market, 2026-10-16)",
    "gold: 4186.7 at 2026-10-16T20:59:59.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: 2026-10-16, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-10-16: 2026-10-16, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: no rate row found",
    "BoG in use: 2026-10-16 · usd 11.665, gbp 15.5454, eur 13.0964"
  ],
  "quotes": {
    "usd": {
      "value": 11.6365,
      "at": "2026-10-16T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.6561
    },
    "gbp": {
      "value": 15.4799,
      "at": "2026-10-16T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.4423
    },
    "eur": {
      "value": 13.0766,
      "at": "2026-10-16T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 13.0841
    },
    "cny": {
      "value": 1.73952,
      "at": "2026-10-16T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.74166
    },
    "gold": {
      "value": 4186.7,
      "at": "2026-10-16T20:59:59.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4185.8
    }
  }
};

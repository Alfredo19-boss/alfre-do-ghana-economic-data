/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-09-28T06:21:48.578Z",
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
  "officialAt": "2026-09-28T06:21:48.578Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.6169 (mid-market, 2026-09-27)",
    "gbp: 15.3911 (mid-market, 2026-09-27)",
    "eur: 13.234 (mid-market, 2026-09-27)",
    "cny: 1.72994 (mid-market, 2026-09-27)",
    "gold: 4213 at 2026-09-28T06:11:31.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: 2026-09-25, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-09-28: 2026-09-25, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: no rate row found",
    "BoG in use: 2026-09-25 · usd 11.6225, gbp 15.3958, eur 13.2443"
  ],
  "quotes": {
    "usd": {
      "value": 11.6169,
      "at": "2026-09-27T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.6168
    },
    "gbp": {
      "value": 15.3911,
      "at": "2026-09-27T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.3879
    },
    "eur": {
      "value": 13.234,
      "at": "2026-09-27T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 13.233
    },
    "cny": {
      "value": 1.72994,
      "at": "2026-09-27T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.73054
    },
    "gold": {
      "value": 4213,
      "at": "2026-09-28T06:11:31.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4271
    }
  }
};

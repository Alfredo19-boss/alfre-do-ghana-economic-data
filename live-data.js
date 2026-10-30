/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-10-30T02:55:15.420Z",
  "note": "The Bank of Ghana's interbank mid-rate is the site's official figure and leads the dashboard; the market quotes beneath it are taken through the day and carry the minute they were read.",
  "source": "Bank of Ghana, with daily mid-market rates for the cedi pairs and Yahoo Finance for gold",
  "official": {
    "date": "2026-10-29",
    "rates": {
      "usd": {
        "value": 11.6515
      },
      "gbp": {
        "value": 15.574
      },
      "eur": {
        "value": 13.0017
      }
    },
    "source": "Bank of Ghana interbank mid-rate",
    "url": "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/"
  },
  "officialAt": "2026-10-30T02:55:15.420Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.635 (mid-market, 2026-10-29)",
    "gbp: 15.4974 (mid-market, 2026-10-29)",
    "eur: 12.9653 (mid-market, 2026-10-29)",
    "cny: 1.7464 (mid-market, 2026-10-29)",
    "gold: 4011.7 at 2026-10-30T02:45:00.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: 2026-10-29, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-10-30: 2026-10-29, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: no rate row found",
    "BoG in use: 2026-10-29 · usd 11.6515, gbp 15.574, eur 13.0017"
  ],
  "quotes": {
    "usd": {
      "value": 11.635,
      "at": "2026-10-29T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.6566
    },
    "gbp": {
      "value": 15.4974,
      "at": "2026-10-29T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.4982
    },
    "eur": {
      "value": 12.9653,
      "at": "2026-10-29T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 12.9644
    },
    "cny": {
      "value": 1.7464,
      "at": "2026-10-29T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.74823
    },
    "gold": {
      "value": 4011.7,
      "at": "2026-10-30T02:45:00.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4026.3
    }
  }
};

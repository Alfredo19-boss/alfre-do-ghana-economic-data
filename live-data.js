/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-10-07T00:48:03.332Z",
  "note": "The Bank of Ghana's interbank mid-rate is the site's official figure and leads the dashboard; the market quotes beneath it are taken through the day and carry the minute they were read.",
  "source": "Bank of Ghana, with daily mid-market rates for the cedi pairs and Yahoo Finance for gold",
  "official": {
    "date": "2026-10-06",
    "rates": {
      "usd": {
        "value": 11.8
      },
      "gbp": {
        "value": 15.6639
      },
      "eur": {
        "value": 13.2886
      }
    },
    "source": "Bank of Ghana interbank mid-rate",
    "url": "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/"
  },
  "officialAt": "2026-10-07T00:48:03.332Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.7567 (mid-market, 2026-10-06)",
    "gbp: 15.5352 (mid-market, 2026-10-06)",
    "eur: 13.1849 (mid-market, 2026-10-06)",
    "cny: 1.75337 (mid-market, 2026-10-06)",
    "gold: 4187.4 at 2026-10-07T00:37:48.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: 2026-10-06, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-10-07: 2026-10-06, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: no rate row found",
    "BoG in use: 2026-10-06 · usd 11.8, gbp 15.6639, eur 13.2886"
  ],
  "quotes": {
    "usd": {
      "value": 11.7567,
      "at": "2026-10-06T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.7243
    },
    "gbp": {
      "value": 15.5352,
      "at": "2026-10-06T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.4868
    },
    "eur": {
      "value": 13.1849,
      "at": "2026-10-06T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 13.1118
    },
    "cny": {
      "value": 1.75337,
      "at": "2026-10-06T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.74855
    },
    "gold": {
      "value": 4187.4,
      "at": "2026-10-07T00:37:48.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4192.8
    }
  }
};

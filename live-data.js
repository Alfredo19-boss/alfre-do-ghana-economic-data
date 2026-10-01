/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-10-01T09:24:44.181Z",
  "note": "The Bank of Ghana's interbank mid-rate is the site's official figure and leads the dashboard; the market quotes beneath it are taken through the day and carry the minute they were read.",
  "source": "Bank of Ghana, with daily mid-market rates for the cedi pairs and Yahoo Finance for gold",
  "official": {
    "date": "2026-09-30",
    "rates": {
      "usd": {
        "value": 11.71
      },
      "gbp": {
        "value": 15.5298
      },
      "eur": {
        "value": 13.2785
      }
    },
    "source": "Bank of Ghana interbank mid-rate",
    "url": "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/"
  },
  "officialAt": "2026-10-01T09:24:44.181Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.6752 (mid-market, 2026-09-30)",
    "gbp: 15.4436 (mid-market, 2026-09-30)",
    "eur: 13.2306 (mid-market, 2026-09-30)",
    "cny: 1.7412 (mid-market, 2026-09-30)",
    "gold: 4190.2 at 2026-10-01T09:14:32.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: 2026-09-30, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-10-01: 2026-09-30, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: no rate row found",
    "BoG in use: 2026-09-30 · usd 11.71, gbp 15.5298, eur 13.2785"
  ],
  "quotes": {
    "usd": {
      "value": 11.6752,
      "at": "2026-09-30T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.6462
    },
    "gbp": {
      "value": 15.4436,
      "at": "2026-09-30T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.4175
    },
    "eur": {
      "value": 13.2306,
      "at": "2026-09-30T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 13.2309
    },
    "cny": {
      "value": 1.7412,
      "at": "2026-09-30T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.73622
    },
    "gold": {
      "value": 4190.2,
      "at": "2026-10-01T09:14:32.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4184
    }
  }
};

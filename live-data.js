/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-09-19T04:35:03.648Z",
  "note": "The Bank of Ghana's interbank mid-rate is the site's official figure and leads the dashboard; the market quotes beneath it are taken through the day and carry the minute they were read.",
  "source": "Bank of Ghana, with daily mid-market rates for the cedi pairs and Yahoo Finance for gold",
  "official": {
    "date": "2026-09-18",
    "rates": {
      "usd": {
        "value": 11.55
      },
      "gbp": {
        "value": 15.4464
      },
      "eur": {
        "value": 13.2445
      }
    },
    "source": "Bank of Ghana interbank mid-rate",
    "url": "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/"
  },
  "officialAt": "2026-09-19T04:35:03.648Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.5088 (mid-market, 2026-09-18)",
    "gbp: 15.3953 (mid-market, 2026-09-18)",
    "eur: 13.2254 (mid-market, 2026-09-18)",
    "cny: 1.71579 (mid-market, 2026-09-18)",
    "gold: 4424.9 at 2026-09-18T20:59:59.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: 2026-09-18, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-09-19: 2026-09-18, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: no rate row found",
    "BoG in use: 2026-09-18 · usd 11.55, gbp 15.4464, eur 13.2445"
  ],
  "quotes": {
    "usd": {
      "value": 11.5088,
      "at": "2026-09-18T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.48
    },
    "gbp": {
      "value": 15.3953,
      "at": "2026-09-18T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.3807
    },
    "eur": {
      "value": 13.2254,
      "at": "2026-09-18T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 13.1893
    },
    "cny": {
      "value": 1.71579,
      "at": "2026-09-18T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.7095
    },
    "gold": {
      "value": 4424.9,
      "at": "2026-09-18T20:59:59.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4415.9
    }
  }
};

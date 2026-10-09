/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-10-09T06:19:07.533Z",
  "note": "The Bank of Ghana's interbank mid-rate is the site's official figure and leads the dashboard; the market quotes beneath it are taken through the day and carry the minute they were read.",
  "source": "Bank of Ghana, with daily mid-market rates for the cedi pairs and Yahoo Finance for gold",
  "official": {
    "date": "2026-10-08",
    "rates": {
      "usd": {
        "value": 11.78
      },
      "gbp": {
        "value": 15.5585
      },
      "eur": {
        "value": 13.1824
      }
    },
    "source": "Bank of Ghana interbank mid-rate",
    "url": "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/"
  },
  "officialAt": "2026-10-09T06:19:07.533Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.801 (mid-market, 2026-10-08)",
    "gbp: 15.5857 (mid-market, 2026-10-08)",
    "eur: 13.223 (mid-market, 2026-10-08)",
    "cny: 1.76048 (mid-market, 2026-10-08)",
    "gold: 4220.5 at 2026-10-09T06:08:56.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: 2026-10-08, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-10-09: 2026-10-08, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: no rate row found",
    "BoG in use: 2026-10-08 · usd 11.78, gbp 15.5585, eur 13.1824"
  ],
  "quotes": {
    "usd": {
      "value": 11.801,
      "at": "2026-10-08T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.7671
    },
    "gbp": {
      "value": 15.5857,
      "at": "2026-10-08T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.5892
    },
    "eur": {
      "value": 13.223,
      "at": "2026-10-08T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 13.2152
    },
    "cny": {
      "value": 1.76048,
      "at": "2026-10-08T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.75488
    },
    "gold": {
      "value": 4220.5,
      "at": "2026-10-09T06:08:56.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4169.2
    }
  }
};

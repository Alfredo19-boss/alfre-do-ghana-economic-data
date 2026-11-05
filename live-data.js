/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-11-05T05:28:26.239Z",
  "note": "The Bank of Ghana's interbank mid-rate is the site's official figure and leads the dashboard; the market quotes beneath it are taken through the day and carry the minute they were read.",
  "source": "Bank of Ghana, with daily mid-market rates for the cedi pairs and Yahoo Finance for gold",
  "official": {
    "date": "2026-11-04",
    "rates": {
      "usd": {
        "value": 11.66
      },
      "gbp": {
        "value": 15.7049
      },
      "eur": {
        "value": 13.0999
      }
    },
    "source": "Bank of Ghana interbank mid-rate",
    "url": "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/"
  },
  "officialAt": "2026-11-05T05:28:26.239Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.63 (mid-market, 2026-11-04)",
    "gbp: 15.6474 (mid-market, 2026-11-04)",
    "eur: 13.0621 (mid-market, 2026-11-04)",
    "cny: 1.73997 (mid-market, 2026-11-04)",
    "gold: 4141.9 at 2026-11-05T05:18:05.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: 2026-11-04, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-11-05: failed (HTTP 502)",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: no rate row found",
    "BoG in use: 2026-11-04 · usd 11.66, gbp 15.7049, eur 13.0999"
  ],
  "quotes": {
    "usd": {
      "value": 11.63,
      "at": "2026-11-04T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.6454
    },
    "gbp": {
      "value": 15.6474,
      "at": "2026-11-04T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.6184
    },
    "eur": {
      "value": 13.0621,
      "at": "2026-11-04T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 13.0344
    },
    "cny": {
      "value": 1.73997,
      "at": "2026-11-04T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.74557
    },
    "gold": {
      "value": 4141.9,
      "at": "2026-11-05T05:18:05.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4072.3
    }
  }
};

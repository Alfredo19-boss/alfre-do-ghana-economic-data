/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-11-07T22:30:07.156Z",
  "note": "The Bank of Ghana's interbank mid-rate is the site's official figure and leads the dashboard; the market quotes beneath it are taken through the day and carry the minute they were read.",
  "source": "Bank of Ghana, with daily mid-market rates for the cedi pairs and Yahoo Finance for gold",
  "official": {
    "date": "2026-11-06",
    "rates": {
      "usd": {
        "value": 11.64
      },
      "gbp": {
        "value": 15.5505
      },
      "eur": {
        "value": 12.976
      }
    },
    "source": "Bank of Ghana interbank mid-rate",
    "url": "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/"
  },
  "officialAt": "2026-11-07T22:30:07.156Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.7128 (mid-market, 2026-11-07)",
    "gbp: 15.6394 (mid-market, 2026-11-07)",
    "eur: 13.0484 (mid-market, 2026-11-07)",
    "cny: 1.75459 (mid-market, 2026-11-07)",
    "gold: 4074.9 at 2026-11-06T21:59:59.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: 2026-11-06, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-11-07: 2026-11-06, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: no rate row found",
    "BoG in use: 2026-11-06 · usd 11.64, gbp 15.5505, eur 12.976"
  ],
  "quotes": {
    "usd": {
      "value": 11.7128,
      "at": "2026-11-07T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.6675
    },
    "gbp": {
      "value": 15.6394,
      "at": "2026-11-07T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.6644
    },
    "eur": {
      "value": 13.0484,
      "at": "2026-11-07T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 13.0642
    },
    "cny": {
      "value": 1.75459,
      "at": "2026-11-07T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.74943
    },
    "gold": {
      "value": 4074.9,
      "at": "2026-11-06T21:59:59.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4079.5
    }
  }
};

/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-10-19T17:22:44.819Z",
  "note": "The Bank of Ghana's interbank mid-rate is the site's official figure and leads the dashboard; the market quotes beneath it are taken through the day and carry the minute they were read.",
  "source": "Bank of Ghana, with daily mid-market rates for the cedi pairs and Yahoo Finance for gold",
  "official": {
    "date": "2026-10-19",
    "rates": {
      "usd": {
        "value": 11.665
      },
      "gbp": {
        "value": 15.5151
      },
      "eur": {
        "value": 13.0697
      }
    },
    "source": "Bank of Ghana interbank mid-rate",
    "url": "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/"
  },
  "officialAt": "2026-10-19T17:22:44.819Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.6802 (mid-market, 2026-10-19)",
    "gbp: 15.5655 (mid-market, 2026-10-19)",
    "eur: 13.1163 (mid-market, 2026-10-19)",
    "cny: 1.74771 (mid-market, 2026-10-19)",
    "gold: 4157.5 at 2026-10-19T17:12:28.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: 2026-10-19, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-10-19: 2026-10-19, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: no rate row found",
    "BoG in use: 2026-10-19 · usd 11.665, gbp 15.5151, eur 13.0697"
  ],
  "quotes": {
    "usd": {
      "value": 11.6802,
      "at": "2026-10-19T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.6537
    },
    "gbp": {
      "value": 15.5655,
      "at": "2026-10-19T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.5329
    },
    "eur": {
      "value": 13.1163,
      "at": "2026-10-19T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 13.0975
    },
    "cny": {
      "value": 1.74771,
      "at": "2026-10-19T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.74276
    },
    "gold": {
      "value": 4157.5,
      "at": "2026-10-19T17:12:28.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4182.9
    }
  }
};

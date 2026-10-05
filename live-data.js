/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-10-05T21:51:29.835Z",
  "note": "The Bank of Ghana's interbank mid-rate is the site's official figure and leads the dashboard; the market quotes beneath it are taken through the day and carry the minute they were read.",
  "source": "Bank of Ghana, with daily mid-market rates for the cedi pairs and Yahoo Finance for gold",
  "official": {
    "date": "2026-10-05",
    "rates": {
      "usd": {
        "value": 11.765
      },
      "gbp": {
        "value": 15.5504
      },
      "eur": {
        "value": 13.1906
      }
    },
    "source": "Bank of Ghana interbank mid-rate",
    "url": "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/"
  },
  "officialAt": "2026-10-05T21:51:29.835Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.7243 (mid-market, 2026-10-05)",
    "gbp: 15.4868 (mid-market, 2026-10-05)",
    "eur: 13.1118 (mid-market, 2026-10-05)",
    "cny: 1.74855 (mid-market, 2026-10-05)",
    "gold: 4167.6 at 2026-10-05T21:00:00.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: 2026-10-05, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-10-05: 2026-10-05, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: no rate row found",
    "BoG in use: 2026-10-05 · usd 11.765, gbp 15.5504, eur 13.1906"
  ],
  "quotes": {
    "usd": {
      "value": 11.7243,
      "at": "2026-10-05T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.7347
    },
    "gbp": {
      "value": 15.4868,
      "at": "2026-10-05T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.5386
    },
    "eur": {
      "value": 13.1118,
      "at": "2026-10-05T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 13.2111
    },
    "cny": {
      "value": 1.74855,
      "at": "2026-10-05T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.74944
    },
    "gold": {
      "value": 4167.6,
      "at": "2026-10-05T21:00:00.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4167.8
    }
  }
};

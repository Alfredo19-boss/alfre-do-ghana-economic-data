/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-09-25T14:44:10.588Z",
  "note": "The Bank of Ghana's interbank mid-rate is the site's official figure and leads the dashboard; the market quotes beneath it are taken through the day and carry the minute they were read.",
  "source": "Bank of Ghana, with daily mid-market rates for the cedi pairs and Yahoo Finance for gold",
  "official": {
    "date": "2026-09-24",
    "rates": {
      "usd": {
        "value": 11.6157
      },
      "gbp": {
        "value": 15.3728
      },
      "eur": {
        "value": 13.2217
      }
    },
    "source": "Bank of Ghana interbank mid-rate",
    "url": "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/"
  },
  "officialAt": "2026-09-25T14:44:10.589Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.5845 (mid-market, 2026-09-24)",
    "gbp: 15.3317 (mid-market, 2026-09-24)",
    "eur: 13.1794 (mid-market, 2026-09-24)",
    "cny: 1.72533 (mid-market, 2026-09-24)",
    "gold: 4300.5 at 2026-09-25T14:33:36.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: failed (fetch failed)",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-09-25: failed (fetch failed)",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: failed (fetch failed)",
    "BoG in use: 2026-09-24 · usd 11.6157, gbp 15.3728, eur 13.2217"
  ],
  "quotes": {
    "usd": {
      "value": 11.5845,
      "at": "2026-09-24T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.5511
    },
    "gbp": {
      "value": 15.3317,
      "at": "2026-09-24T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.3825
    },
    "eur": {
      "value": 13.1794,
      "at": "2026-09-24T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 13.1986
    },
    "cny": {
      "value": 1.72533,
      "at": "2026-09-24T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.72284
    },
    "gold": {
      "value": 4300.5,
      "at": "2026-09-25T14:33:36.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4329
    }
  }
};

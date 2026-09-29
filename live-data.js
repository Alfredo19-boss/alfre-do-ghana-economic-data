/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-09-29T13:19:30.855Z",
  "note": "The Bank of Ghana's interbank mid-rate is the site's official figure and leads the dashboard; the market quotes beneath it are taken through the day and carry the minute they were read.",
  "source": "Bank of Ghana, with daily mid-market rates for the cedi pairs and Yahoo Finance for gold",
  "official": {
    "date": "2026-09-28",
    "rates": {
      "usd": {
        "value": 11.66
      },
      "gbp": {
        "value": 15.4676
      },
      "eur": {
        "value": 13.2638
      }
    },
    "source": "Bank of Ghana interbank mid-rate",
    "url": "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/"
  },
  "officialAt": "2026-09-29T13:19:30.855Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.6131 (mid-market, 2026-09-28)",
    "gbp: 15.3825 (mid-market, 2026-09-28)",
    "eur: 13.2263 (mid-market, 2026-09-28)",
    "cny: 1.72983 (mid-market, 2026-09-28)",
    "gold: 4191.1 at 2026-09-29T13:08:57.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: failed (fetch failed)",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-09-29: failed (fetch failed)",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: failed (fetch failed)",
    "BoG in use: 2026-09-28 · usd 11.66, gbp 15.4676, eur 13.2638"
  ],
  "quotes": {
    "usd": {
      "value": 11.6131,
      "at": "2026-09-28T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.6169
    },
    "gbp": {
      "value": 15.3825,
      "at": "2026-09-28T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.3911
    },
    "eur": {
      "value": 13.2263,
      "at": "2026-09-28T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 13.234
    },
    "cny": {
      "value": 1.72983,
      "at": "2026-09-28T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.72994
    },
    "gold": {
      "value": 4191.1,
      "at": "2026-09-29T13:08:57.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4174.4
    }
  }
};

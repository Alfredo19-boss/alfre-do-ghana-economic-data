/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-09-29T22:51:49.981Z",
  "note": "The Bank of Ghana's interbank mid-rate is the site's official figure and leads the dashboard; the market quotes beneath it are taken through the day and carry the minute they were read.",
  "source": "Bank of Ghana, with daily mid-market rates for the cedi pairs and Yahoo Finance for gold",
  "official": {
    "date": "2026-09-29",
    "rates": {
      "usd": {
        "value": 11.69
      },
      "gbp": {
        "value": 15.4443
      },
      "eur": {
        "value": 13.2438
      }
    },
    "source": "Bank of Ghana interbank mid-rate",
    "url": "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/"
  },
  "officialAt": "2026-09-29T22:51:49.981Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.6462 (mid-market, 2026-09-29)",
    "gbp: 15.4175 (mid-market, 2026-09-29)",
    "eur: 13.2309 (mid-market, 2026-09-29)",
    "cny: 1.73622 (mid-market, 2026-09-29)",
    "gold: 4210.4 at 2026-09-29T22:40:58.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: failed (fetch failed)",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-09-29: failed (fetch failed)",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: failed (fetch failed)",
    "BoG in use: 2026-09-29 · usd 11.69, gbp 15.4443, eur 13.2438"
  ],
  "quotes": {
    "usd": {
      "value": 11.6462,
      "at": "2026-09-29T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.6131
    },
    "gbp": {
      "value": 15.4175,
      "at": "2026-09-29T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.3825
    },
    "eur": {
      "value": 13.2309,
      "at": "2026-09-29T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 13.2263
    },
    "cny": {
      "value": 1.73622,
      "at": "2026-09-29T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.72983
    },
    "gold": {
      "value": 4210.4,
      "at": "2026-09-29T22:40:58.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4196
    }
  }
};

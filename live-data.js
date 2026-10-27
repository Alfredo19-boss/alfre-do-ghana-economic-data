/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-10-27T14:21:41.798Z",
  "note": "The Bank of Ghana's interbank mid-rate is the site's official figure and leads the dashboard; the market quotes beneath it are taken through the day and carry the minute they were read.",
  "source": "Bank of Ghana, with daily mid-market rates for the cedi pairs and Yahoo Finance for gold",
  "official": {
    "date": "2026-10-26",
    "rates": {
      "usd": {
        "value": 11.65
      },
      "gbp": {
        "value": 15.5487
      },
      "eur": {
        "value": 13.0223
      }
    },
    "source": "Bank of Ghana interbank mid-rate",
    "url": "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/"
  },
  "officialAt": "2026-10-27T14:21:41.798Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.622 (mid-market, 2026-10-27)",
    "gbp: 15.5056 (mid-market, 2026-10-27)",
    "eur: 12.984 (mid-market, 2026-10-27)",
    "cny: 1.74289 (mid-market, 2026-10-27)",
    "gold: 4052.2 at 2026-10-27T14:11:18.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: 2026-10-26, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-10-27: 2026-10-26, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: no rate row found",
    "BoG in use: 2026-10-26 · usd 11.65, gbp 15.5487, eur 13.0223"
  ],
  "quotes": {
    "usd": {
      "value": 11.622,
      "at": "2026-10-27T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.628
    },
    "gbp": {
      "value": 15.5056,
      "at": "2026-10-27T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.5601
    },
    "eur": {
      "value": 12.984,
      "at": "2026-10-27T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 13.0487
    },
    "cny": {
      "value": 1.74289,
      "at": "2026-10-27T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.74339
    },
    "gold": {
      "value": 4052.2,
      "at": "2026-10-27T14:11:18.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4015.9
    }
  }
};

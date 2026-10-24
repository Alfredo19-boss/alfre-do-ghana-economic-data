/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-10-24T14:52:31.721Z",
  "note": "The Bank of Ghana's interbank mid-rate is the site's official figure and leads the dashboard; the market quotes beneath it are taken through the day and carry the minute they were read.",
  "source": "Bank of Ghana, with daily mid-market rates for the cedi pairs and Yahoo Finance for gold",
  "official": {
    "date": "2026-10-23",
    "rates": {
      "usd": {
        "value": 11.65
      },
      "gbp": {
        "value": 15.572
      },
      "eur": {
        "value": 13.0408
      }
    },
    "source": "Bank of Ghana interbank mid-rate",
    "url": "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/"
  },
  "officialAt": "2026-10-24T14:52:31.721Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.5989 (mid-market, 2026-10-24)",
    "gbp: 15.5178 (mid-market, 2026-10-24)",
    "eur: 12.9954 (mid-market, 2026-10-24)",
    "cny: 1.73831 (mid-market, 2026-10-24)",
    "gold: 4007.9 at 2026-10-23T20:59:58.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: 2026-10-23, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-10-24: 2026-10-23, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: no rate row found",
    "BoG in use: 2026-10-23 · usd 11.65, gbp 15.572, eur 13.0408"
  ],
  "quotes": {
    "usd": {
      "value": 11.5989,
      "at": "2026-10-24T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.605
    },
    "gbp": {
      "value": 15.5178,
      "at": "2026-10-24T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.5444
    },
    "eur": {
      "value": 12.9954,
      "at": "2026-10-24T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 13.0134
    },
    "cny": {
      "value": 1.73831,
      "at": "2026-10-24T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.73904
    },
    "gold": {
      "value": 4007.9,
      "at": "2026-10-23T20:59:58.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4010
    }
  }
};

/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-10-28T20:48:40.571Z",
  "note": "The Bank of Ghana's interbank mid-rate is the site's official figure and leads the dashboard; the market quotes beneath it are taken through the day and carry the minute they were read.",
  "source": "Bank of Ghana, with daily mid-market rates for the cedi pairs and Yahoo Finance for gold",
  "official": {
    "date": "2026-10-28",
    "rates": {
      "usd": {
        "value": 11.6258
      },
      "gbp": {
        "value": 15.4647
      },
      "eur": {
        "value": 12.9455
      }
    },
    "source": "Bank of Ghana interbank mid-rate",
    "url": "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/"
  },
  "officialAt": "2026-10-28T20:48:40.571Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.6566 (mid-market, 2026-10-28)",
    "gbp: 15.4982 (mid-market, 2026-10-28)",
    "eur: 12.9644 (mid-market, 2026-10-28)",
    "cny: 1.74823 (mid-market, 2026-10-28)",
    "gold: 4078.5 at 2026-10-28T20:38:27.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: 2026-10-28, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-10-28: 2026-10-28, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: no rate row found",
    "BoG in use: 2026-10-28 · usd 11.6258, gbp 15.4647, eur 12.9455"
  ],
  "quotes": {
    "usd": {
      "value": 11.6566,
      "at": "2026-10-28T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.622
    },
    "gbp": {
      "value": 15.4982,
      "at": "2026-10-28T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.5056
    },
    "eur": {
      "value": 12.9644,
      "at": "2026-10-28T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 12.984
    },
    "cny": {
      "value": 1.74823,
      "at": "2026-10-28T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.74289
    },
    "gold": {
      "value": 4078.5,
      "at": "2026-10-28T20:38:27.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4057.8
    }
  }
};

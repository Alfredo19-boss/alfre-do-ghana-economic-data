/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-10-26T23:19:02.416Z",
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
  "officialAt": "2026-10-26T23:19:02.416Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.628 (mid-market, 2026-10-26)",
    "gbp: 15.5601 (mid-market, 2026-10-26)",
    "eur: 13.0487 (mid-market, 2026-10-26)",
    "cny: 1.74339 (mid-market, 2026-10-26)",
    "gold: 4024.5 at 2026-10-26T23:08:22.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: 2026-10-26, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-10-26: 2026-10-26, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: no rate row found",
    "BoG in use: 2026-10-26 · usd 11.65, gbp 15.5487, eur 13.0223"
  ],
  "quotes": {
    "usd": {
      "value": 11.628,
      "at": "2026-10-26T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.6072
    },
    "gbp": {
      "value": 15.5601,
      "at": "2026-10-26T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.5215
    },
    "eur": {
      "value": 13.0487,
      "at": "2026-10-26T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 13.0028
    },
    "cny": {
      "value": 1.74339,
      "at": "2026-10-26T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.73987
    },
    "gold": {
      "value": 4024.5,
      "at": "2026-10-26T23:08:22.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4025.4
    }
  }
};

/*
 * Alfredo Ghana Economic Data: live market quotes for the cedi, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_LIVE = {
  "updated": "2026-10-13T08:25:45.832Z",
  "note": "The Bank of Ghana's interbank mid-rate is the site's official figure and leads the dashboard; the market quotes beneath it are taken through the day and carry the minute they were read.",
  "source": "Bank of Ghana, with daily mid-market rates for the cedi pairs and Yahoo Finance for gold",
  "official": {
    "date": "2026-10-12",
    "rates": {
      "usd": {
        "value": 11.77
      },
      "gbp": {
        "value": 15.5417
      },
      "eur": {
        "value": 13.1325
      }
    },
    "source": "Bank of Ghana interbank mid-rate",
    "url": "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/"
  },
  "officialAt": "2026-10-13T08:25:45.833Z",
  "log": [
    "cedi mid-rates: 4 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "usd: 11.7699 (mid-market, 2026-10-12)",
    "gbp: 15.5784 (mid-market, 2026-10-12)",
    "eur: 13.1828 (mid-market, 2026-10-12)",
    "cny: 1.75852 (mid-market, 2026-10-12)",
    "gold: 4214 at 2026-10-13T08:15:34.000Z",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/: 2026-10-12, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/?date=2026-10-13: 2026-10-12, usd/gbp/eur",
    "BoG https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/: no rate row found",
    "BoG in use: 2026-10-12 · usd 11.77, gbp 15.5417, eur 13.1325"
  ],
  "quotes": {
    "usd": {
      "value": 11.7699,
      "at": "2026-10-12T00:00:00.000Z",
      "daily": true,
      "name": "US dollar",
      "prev": 11.7659
    },
    "gbp": {
      "value": 15.5784,
      "at": "2026-10-12T00:00:00.000Z",
      "daily": true,
      "name": "British pound",
      "prev": 15.5649
    },
    "eur": {
      "value": 13.1828,
      "at": "2026-10-12T00:00:00.000Z",
      "daily": true,
      "name": "Euro",
      "prev": 13.1821
    },
    "cny": {
      "value": 1.75852,
      "at": "2026-10-12T00:00:00.000Z",
      "daily": true,
      "name": "Chinese yuan",
      "prev": 1.75601
    },
    "gold": {
      "value": 4214,
      "at": "2026-10-13T08:15:34.000Z",
      "name": "Gold, US$ an ounce",
      "prev": 4181.5
    }
  }
};

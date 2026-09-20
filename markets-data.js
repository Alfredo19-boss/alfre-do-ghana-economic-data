/*
 * Alfredo Ghana Economic Data: world markets and Ghana Stock Exchange prices, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_MARKETS = {
  "updated": "2026-09-20T17:19:51.574Z",
  "note": "Market prices as last traded. World figures from Yahoo Finance; Ghana Stock Exchange prices from the GSE's open feed. Exchanges close overnight and at weekends, so a price carries the moment it was quoted.",
  "source": "Yahoo Finance · Ghana Stock Exchange",
  "log": [
    "cedi mid-rates: 6 pairs from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    "indices: 9/9 fresh, 9 held",
    "commodities: 10/10 fresh, 10 held",
    "crypto: 2/2 fresh, 2 held",
    "currencies: 8/8 fresh, 8 held",
    "GSE https://dev.kwayisi.org/apis/gse/live: failed (fetch failed)",
    "GSE https://dev.kwayisi.org/apis/gse/equities: failed (fetch failed)",
    "GSE https://api.ghana-api.dev/api/v1/stock-market/live: failed (HTTP 404)",
    "GSE https://api.ghana-api.dev/api/v1/stock-market/stocks: failed (HTTP 404)"
  ],
  "world": {
    "indices": [
      {
        "symbol": "^GSPC",
        "name": "S&P 500",
        "unit": "",
        "dec": 0,
        "value": 7650.5,
        "prev": 7656.98,
        "change": -6.48,
        "pct": -0.08,
        "at": "2026-09-18T21:29:48.000Z",
        "history": [
          {
            "date": "2026-09-15",
            "value": 7585.73
          },
          {
            "date": "2026-09-16",
            "value": 7551.81
          },
          {
            "date": "2026-09-17",
            "value": 7637.76
          },
          {
            "date": "2026-09-18",
            "value": 7650.5
          }
        ]
      },
      {
        "symbol": "^DJI",
        "name": "Dow Jones",
        "unit": "",
        "dec": 0,
        "value": 51682.64,
        "prev": 52573.29,
        "change": -890.65,
        "pct": -1.69,
        "at": "2026-09-18T21:52:27.000Z",
        "history": [
          {
            "date": "2026-09-15",
            "value": 52093.11
          },
          {
            "date": "2026-09-16",
            "value": 51461.9
          },
          {
            "date": "2026-09-17",
            "value": 51778.04
          },
          {
            "date": "2026-09-18",
            "value": 51682.64
          }
        ]
      },
      {
        "symbol": "^IXIC",
        "name": "Nasdaq",
        "unit": "",
        "dec": 0,
        "value": 26522.545,
        "prev": 26333.04,
        "change": 189.505,
        "pct": 0.72,
        "at": "2026-09-18T21:15:59.000Z",
        "history": [
          {
            "date": "2026-09-15",
            "value": 25981.57
          },
          {
            "date": "2026-09-16",
            "value": 25978.424
          },
          {
            "date": "2026-09-17",
            "value": 26418.299
          },
          {
            "date": "2026-09-18",
            "value": 26522.545
          }
        ]
      },
      {
        "symbol": "^FTSE",
        "name": "FTSE 100 · London",
        "unit": "",
        "dec": 0,
        "value": 10659.13,
        "prev": 10650.4,
        "change": 8.73,
        "pct": 0.08,
        "at": "2026-09-18T15:40:20.000Z",
        "history": [
          {
            "date": "2026-09-15",
            "value": 10658.13
          },
          {
            "date": "2026-09-16",
            "value": 10688.47
          },
          {
            "date": "2026-09-17",
            "value": 10816.14
          },
          {
            "date": "2026-09-18",
            "value": 10659.13
          }
        ]
      },
      {
        "symbol": "^GDAXI",
        "name": "DAX · Frankfurt",
        "unit": "",
        "dec": 0,
        "value": 25304.06,
        "prev": 25568.56,
        "change": -264.5,
        "pct": -1.03,
        "at": "2026-09-18T16:00:00.000Z",
        "history": [
          {
            "date": "2026-09-15",
            "value": 25402.28
          },
          {
            "date": "2026-09-16",
            "value": 25537.75
          },
          {
            "date": "2026-09-17",
            "value": 25716.71
          },
          {
            "date": "2026-09-18",
            "value": 25304.06
          }
        ]
      },
      {
        "symbol": "^N225",
        "name": "Nikkei 225 · Tokyo",
        "unit": "",
        "dec": 0,
        "value": 65018.95,
        "prev": 63492.99,
        "change": 1525.96,
        "pct": 2.4,
        "at": "2026-09-18T06:45:03.000Z",
        "history": [
          {
            "date": "2026-09-16",
            "value": 63923
          },
          {
            "date": "2026-09-17",
            "value": 64136.25
          },
          {
            "date": "2026-09-18",
            "value": 65018.95
          }
        ]
      },
      {
        "symbol": "^HSI",
        "name": "Hang Seng · Hong Kong",
        "unit": "",
        "dec": 0,
        "value": 24750.78,
        "prev": 24805.63,
        "change": -54.85,
        "pct": -0.22,
        "at": "2026-09-18T08:08:58.000Z",
        "history": [
          {
            "date": "2026-09-16",
            "value": 24713.78
          },
          {
            "date": "2026-09-17",
            "value": 24604.29
          },
          {
            "date": "2026-09-16",
            "value": 24713.8
          },
          {
            "date": "2026-09-17",
            "value": 24604.29
          },
          {
            "date": "2026-09-18",
            "value": 24750.78
          }
        ]
      },
      {
        "symbol": "^JN0U.JO",
        "name": "JSE Top 40 · Johannesburg",
        "unit": "",
        "dec": 0,
        "value": 6938.28,
        "prev": 6993.73,
        "change": -55.45,
        "pct": -0.79,
        "at": "2026-09-18T15:28:01.000Z",
        "history": [
          {
            "date": "2026-09-15",
            "value": 7037.04
          },
          {
            "date": "2026-09-16",
            "value": 7003.45
          },
          {
            "date": "2026-09-17",
            "value": 7040.92
          },
          {
            "date": "2026-09-18",
            "value": 6938.28
          }
        ]
      },
      {
        "symbol": "^NSEI",
        "name": "Nifty 50 · India",
        "unit": "",
        "dec": 0,
        "value": 23346.4,
        "prev": 23118.6,
        "change": 227.8,
        "pct": 0.99,
        "at": "2026-09-18T10:01:14.000Z",
        "history": [
          {
            "date": "2026-09-16",
            "value": 23217.6
          },
          {
            "date": "2026-09-17",
            "value": 23294.35
          },
          {
            "date": "2026-09-16",
            "value": 23217.6
          },
          {
            "date": "2026-09-17",
            "value": 23270.6
          },
          {
            "date": "2026-09-18",
            "value": 23346.4
          }
        ]
      }
    ],
    "commodities": [
      {
        "symbol": "GC=F",
        "name": "Gold",
        "unit": "US$/oz",
        "dec": 0,
        "value": 4424.9,
        "prev": 4332.8,
        "change": 92.1,
        "pct": 2.13,
        "at": "2026-09-18T20:59:59.000Z",
        "history": [
          {
            "date": "2026-09-16",
            "value": 4311.1
          },
          {
            "date": "2026-09-17",
            "value": 4383.6
          },
          {
            "date": "2026-09-18",
            "value": 4424.9
          }
        ]
      },
      {
        "symbol": "SI=F",
        "name": "Silver",
        "unit": "US$/oz",
        "dec": 2,
        "value": 67.149,
        "prev": 63.236,
        "change": 3.913,
        "pct": 6.19,
        "at": "2026-09-18T20:59:59.000Z",
        "history": [
          {
            "date": "2026-09-16",
            "value": 63.49
          },
          {
            "date": "2026-09-17",
            "value": 65.915
          },
          {
            "date": "2026-09-18",
            "value": 67.149
          }
        ]
      },
      {
        "symbol": "HG=F",
        "name": "Copper",
        "unit": "US$/lb",
        "dec": 2,
        "value": 6.6915,
        "prev": 6.3685,
        "change": 0.323,
        "pct": 5.07,
        "at": "2026-09-18T20:59:58.000Z",
        "history": [
          {
            "date": "2026-09-16",
            "value": 6.448
          },
          {
            "date": "2026-09-17",
            "value": 6.6195
          },
          {
            "date": "2026-09-18",
            "value": 6.6915
          }
        ]
      },
      {
        "symbol": "CL=F",
        "name": "Crude oil · WTI",
        "unit": "US$/bbl",
        "dec": 2,
        "value": 96.08,
        "prev": 105.83,
        "change": -9.75,
        "pct": -9.21,
        "at": "2026-09-18T20:59:57.000Z",
        "history": [
          {
            "date": "2026-09-16",
            "value": 101.98
          },
          {
            "date": "2026-09-17",
            "value": 101.17
          },
          {
            "date": "2026-09-18",
            "value": 96.08
          }
        ]
      },
      {
        "symbol": "BZ=F",
        "name": "Crude oil · Brent",
        "unit": "US$/bbl",
        "dec": 2,
        "value": 99.29,
        "prev": 108.75,
        "change": -9.46,
        "pct": -8.7,
        "at": "2026-09-18T20:58:56.000Z",
        "history": [
          {
            "date": "2026-09-16",
            "value": 105.52
          },
          {
            "date": "2026-09-17",
            "value": 104.07
          },
          {
            "date": "2026-09-18",
            "value": 99.29
          }
        ]
      },
      {
        "symbol": "NG=F",
        "name": "Natural gas",
        "unit": "US$/MMBtu",
        "dec": 2,
        "value": 2.912,
        "prev": 2.919,
        "change": -0.007,
        "pct": -0.24,
        "at": "2026-09-18T21:00:00.000Z",
        "history": [
          {
            "date": "2026-09-16",
            "value": 2.893
          },
          {
            "date": "2026-09-17",
            "value": 2.861
          },
          {
            "date": "2026-09-18",
            "value": 2.912
          }
        ]
      },
      {
        "symbol": "CC=F",
        "name": "Cocoa",
        "unit": "US$/t",
        "dec": 0,
        "value": 5330,
        "prev": 5895,
        "change": -565,
        "pct": -9.58,
        "at": "2026-09-18T17:29:59.000Z",
        "history": [
          {
            "date": "2026-09-15",
            "value": 5860
          },
          {
            "date": "2026-09-16",
            "value": 5951
          },
          {
            "date": "2026-09-17",
            "value": 5620
          },
          {
            "date": "2026-09-18",
            "value": 5330
          }
        ]
      },
      {
        "symbol": "KC=F",
        "name": "Coffee",
        "unit": "US¢/lb",
        "dec": 1,
        "value": 277.2,
        "prev": 299.65,
        "change": -22.45,
        "pct": -7.49,
        "at": "2026-09-18T17:29:55.000Z",
        "history": [
          {
            "date": "2026-09-15",
            "value": 283.35
          },
          {
            "date": "2026-09-16",
            "value": 279.75
          },
          {
            "date": "2026-09-17",
            "value": 276.75
          },
          {
            "date": "2026-09-18",
            "value": 277.2
          }
        ]
      },
      {
        "symbol": "ZC=F",
        "name": "Maize",
        "unit": "US¢/bu",
        "dec": 1,
        "value": 527.5,
        "prev": 535.75,
        "change": -8.25,
        "pct": -1.54,
        "at": "2026-09-18T18:19:59.000Z",
        "history": [
          {
            "date": "2026-09-16",
            "value": 534
          },
          {
            "date": "2026-09-17",
            "value": 531
          },
          {
            "date": "2026-09-18",
            "value": 527.5
          }
        ]
      },
      {
        "symbol": "CT=F",
        "name": "Cotton",
        "unit": "US¢/lb",
        "dec": 2,
        "value": 81.21,
        "prev": 81.1,
        "change": 0.11,
        "pct": 0.14,
        "at": "2026-09-18T15:30:46.000Z",
        "history": [
          {
            "date": "2026-09-15",
            "value": 84.54
          },
          {
            "date": "2026-09-16",
            "value": 84.51
          },
          {
            "date": "2026-09-17",
            "value": 82.68
          },
          {
            "date": "2026-09-18",
            "value": 81.21
          }
        ]
      }
    ],
    "crypto": [
      {
        "symbol": "BTC-USD",
        "name": "Bitcoin",
        "unit": "US$",
        "dec": 0,
        "value": 81246.33,
        "prev": 76150.32,
        "change": 5096.01,
        "pct": 6.69,
        "at": "2026-09-20T17:19:24.000Z",
        "history": [
          {
            "date": "2026-09-16",
            "value": 75579.06
          },
          {
            "date": "2026-09-17",
            "value": 76375
          },
          {
            "date": "2026-09-18",
            "value": 81300.33
          },
          {
            "date": "2026-09-19",
            "value": 81279.17
          },
          {
            "date": "2026-09-20",
            "value": 81246.33
          }
        ]
      },
      {
        "symbol": "ETH-USD",
        "name": "Ethereum",
        "unit": "US$",
        "dec": 0,
        "value": 2636.06,
        "prev": 2416.1199,
        "change": 219.94,
        "pct": 9.1,
        "at": "2026-09-20T17:19:24.000Z",
        "history": [
          {
            "date": "2026-09-16",
            "value": 2389.58
          },
          {
            "date": "2026-09-17",
            "value": 2445.44
          },
          {
            "date": "2026-09-18",
            "value": 2631.46
          },
          {
            "date": "2026-09-19",
            "value": 2631.44
          },
          {
            "date": "2026-09-20",
            "value": 2636.06
          }
        ]
      }
    ],
    "currencies": [
      {
        "symbol": "GHS=X",
        "name": "US dollar in cedis",
        "unit": "GH¢",
        "dec": 4,
        "value": 11.516757,
        "prev": 11.514917,
        "change": 0.00184,
        "pct": 0.02,
        "at": "2026-09-19T00:00:00.000Z",
        "daily": true,
        "history": [
          {
            "date": "2026-09-16",
            "value": 11.48
          },
          {
            "date": "2026-09-17",
            "value": 11.5
          },
          {
            "date": "2026-09-18",
            "value": 11.508757
          },
          {
            "date": "2026-09-19",
            "value": 11.516757
          },
          {
            "date": "2026-09-20",
            "value": 11.514917
          },
          {
            "date": "2026-09-19",
            "value": 11.516757
          }
        ]
      },
      {
        "symbol": "EURGHS=X",
        "name": "Euro in cedis",
        "unit": "GH¢",
        "dec": 4,
        "value": 13.227748,
        "prev": 13.226212,
        "change": 0.001536,
        "pct": 0.01,
        "at": "2026-09-19T00:00:00.000Z",
        "daily": true,
        "history": [
          {
            "date": "2026-09-16",
            "value": 13.1618
          },
          {
            "date": "2026-09-17",
            "value": 13.2005
          },
          {
            "date": "2026-09-18",
            "value": 13.225392
          },
          {
            "date": "2026-09-19",
            "value": 13.227748
          },
          {
            "date": "2026-09-20",
            "value": 13.226212
          },
          {
            "date": "2026-09-19",
            "value": 13.227748
          }
        ]
      },
      {
        "symbol": "GBPGHS=X",
        "name": "Pound in cedis",
        "unit": "GH¢",
        "dec": 4,
        "value": 15.425047,
        "prev": 15.42458,
        "change": 0.000467,
        "pct": 0,
        "at": "2026-09-19T00:00:00.000Z",
        "daily": true,
        "history": [
          {
            "date": "2026-09-16",
            "value": 15.3714
          },
          {
            "date": "2026-09-17",
            "value": 15.3651
          },
          {
            "date": "2026-09-18",
            "value": 15.395316
          },
          {
            "date": "2026-09-19",
            "value": 15.425047
          },
          {
            "date": "2026-09-20",
            "value": 15.42458
          },
          {
            "date": "2026-09-19",
            "value": 15.425047
          }
        ]
      },
      {
        "symbol": "EURUSD=X",
        "name": "Euro in dollars",
        "unit": "US$",
        "dec": 4,
        "value": 1.149,
        "prev": 1.1594,
        "change": -0.0104,
        "pct": -0.9,
        "at": "2026-09-18T21:29:10.000Z",
        "history": [
          {
            "date": "2026-09-16",
            "value": 1.1471
          },
          {
            "date": "2026-09-17",
            "value": 1.1478
          },
          {
            "date": "2026-09-18",
            "value": 1.149
          }
        ]
      },
      {
        "symbol": "GBPUSD=X",
        "name": "Pound in dollars",
        "unit": "US$",
        "dec": 4,
        "value": 1.3393,
        "prev": 1.3526,
        "change": -0.0133,
        "pct": -0.98,
        "at": "2026-09-20T00:17:06.000Z",
        "history": [
          {
            "date": "2026-09-16",
            "value": 1.3381
          },
          {
            "date": "2026-09-17",
            "value": 1.3356
          },
          {
            "date": "2026-09-18",
            "value": 1.3394
          },
          {
            "date": "2026-09-19",
            "value": 1.3393
          },
          {
            "date": "2026-09-20",
            "value": 1.3393
          }
        ]
      },
      {
        "symbol": "NGNGHS=X",
        "name": "Naira in cedis",
        "unit": "GH¢",
        "dec": 4,
        "value": 0.0086471393,
        "prev": 0.0086459074,
        "change": 0.0000012319,
        "pct": 0.01,
        "at": "2026-09-19T00:00:00.000Z",
        "daily": true,
        "history": [
          {
            "date": "2026-09-18",
            "value": 0.0086399546
          },
          {
            "date": "2026-09-19",
            "value": 0.0086471393
          },
          {
            "date": "2026-09-20",
            "value": 0.0086459074
          },
          {
            "date": "2026-09-19",
            "value": 0.0086471393
          }
        ]
      },
      {
        "symbol": "ZARGHS=X",
        "name": "Rand in cedis",
        "unit": "GH¢",
        "dec": 4,
        "value": 0.7085693,
        "prev": 0.70749419,
        "change": 0.00107511,
        "pct": 0.15,
        "at": "2026-09-19T00:00:00.000Z",
        "daily": true,
        "history": [
          {
            "date": "2026-09-16",
            "value": 0.7
          },
          {
            "date": "2026-09-17",
            "value": 0.7066
          },
          {
            "date": "2026-09-18",
            "value": 0.70890675
          },
          {
            "date": "2026-09-19",
            "value": 0.7085693
          },
          {
            "date": "2026-09-20",
            "value": 0.70749419
          },
          {
            "date": "2026-09-19",
            "value": 0.7085693
          }
        ]
      },
      {
        "symbol": "CNYGHS=X",
        "name": "Yuan in cedis",
        "unit": "GH¢",
        "dec": 4,
        "value": 1.7184974,
        "prev": 1.7182341,
        "change": 0.0002633,
        "pct": 0.02,
        "at": "2026-09-19T00:00:00.000Z",
        "daily": true,
        "history": [
          {
            "date": "2026-09-16",
            "value": 1.7073
          },
          {
            "date": "2026-09-17",
            "value": 1.7092
          },
          {
            "date": "2026-09-18",
            "value": 1.715792
          },
          {
            "date": "2026-09-19",
            "value": 1.7184974
          },
          {
            "date": "2026-09-20",
            "value": 1.7182341
          },
          {
            "date": "2026-09-19",
            "value": 1.7184974
          }
        ]
      }
    ]
  },
  "ghana": {
    "updated": "2026-09-19T04:35:45.002Z",
    "source": "Ghana Stock Exchange, via a published price table",
    "sourceUrl": "https://gse.com.gh/",
    "equities": [
      {
        "code": "BANK",
        "name": "Lending Rate (APR)",
        "price": 3,
        "change": null,
        "pct": null,
        "volume": null
      },
      {
        "code": "COUNTRY",
        "name": "Inflation (y/y)",
        "price": 2026,
        "change": null,
        "pct": null,
        "volume": null
      },
      {
        "code": "GHANA",
        "name": "GHANA",
        "price": 118.3,
        "change": null,
        "pct": null,
        "volume": null
      },
      {
        "code": "KENYA",
        "name": "KENYA",
        "price": 147.3,
        "change": null,
        "pct": null,
        "volume": null
      },
      {
        "code": "NIGERIA",
        "name": "NIGERIA",
        "price": 377.4,
        "change": null,
        "pct": null,
        "volume": null
      }
    ]
  }
};

/*
 * Alfredo Ghana Economic Data: world markets and Ghana Stock Exchange prices, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_MARKETS = {
  "updated": "2026-09-18T09:11:54.641Z",
  "note": "Market prices as last traded. World figures from Yahoo Finance; Ghana Stock Exchange prices from the GSE's open feed. Exchanges close overnight and at weekends, so a price carries the moment it was quoted.",
  "source": "Yahoo Finance · Ghana Stock Exchange",
  "log": [
    "indices: 9/9 fresh, 9 held",
    "commodities: 10/10 fresh, 10 held",
    "crypto: 2/2 fresh, 2 held",
    "NGNGHS=X: HTTP 404",
    "currencies: 7/8 fresh, 7 held",
    "GSE https://dev.kwayisi.org/apis/gse/live: failed (fetch failed)",
    "GSE https://dev.kwayisi.org/apis/gse/equities: failed (fetch failed)",
    "GSE https://afx.kwayisi.org/gse/: failed (fetch failed)"
  ],
  "world": {
    "indices": [
      {
        "symbol": "^GSPC",
        "name": "S&P 500",
        "unit": "",
        "dec": 0,
        "value": 7637.76,
        "prev": 7591.7,
        "change": 46.06,
        "pct": 0.61,
        "at": "2026-09-17T20:34:50.000Z",
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
          }
        ]
      },
      {
        "symbol": "^DJI",
        "name": "Dow Jones",
        "unit": "",
        "dec": 0,
        "value": 51778.04,
        "prev": 52064.1,
        "change": -286.06,
        "pct": -0.55,
        "at": "2026-09-17T20:35:03.000Z",
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
          }
        ]
      },
      {
        "symbol": "^IXIC",
        "name": "Nasdaq",
        "unit": "",
        "dec": 0,
        "value": 26418.299,
        "prev": 26081.72,
        "change": 336.579,
        "pct": 1.29,
        "at": "2026-09-17T21:15:59.000Z",
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
          }
        ]
      },
      {
        "symbol": "^FTSE",
        "name": "FTSE 100 · London",
        "unit": "",
        "dec": 0,
        "value": 10761.96,
        "prev": 10650.4,
        "change": 111.56,
        "pct": 1.05,
        "at": "2026-09-18T08:56:10.000Z",
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
            "value": 10761.96
          }
        ]
      },
      {
        "symbol": "^GDAXI",
        "name": "DAX · Frankfurt",
        "unit": "",
        "dec": 0,
        "value": 25605.86,
        "prev": 25568.56,
        "change": 37.3,
        "pct": 0.15,
        "at": "2026-09-18T08:56:10.000Z",
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
            "value": 25605.86
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
        "value": 7034.75,
        "prev": 6993.73,
        "change": 41.02,
        "pct": 0.59,
        "at": "2026-09-18T08:56:11.000Z",
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
            "value": 7034.75
          }
        ]
      },
      {
        "symbol": "^NSEI",
        "name": "Nifty 50 · India",
        "unit": "",
        "dec": 0,
        "value": 23367.5,
        "prev": 23118.6,
        "change": 248.9,
        "pct": 1.08,
        "at": "2026-09-18T09:11:12.000Z",
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
            "value": 23367.5
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
        "value": 4432,
        "prev": 4351.9,
        "change": 80.1,
        "pct": 1.84,
        "at": "2026-09-18T09:01:07.000Z",
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
            "value": 4432
          }
        ]
      },
      {
        "symbol": "SI=F",
        "name": "Silver",
        "unit": "US$/oz",
        "dec": 2,
        "value": 67.775,
        "prev": 63.513,
        "change": 4.262,
        "pct": 6.71,
        "at": "2026-09-18T09:00:57.000Z",
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
            "value": 67.775
          }
        ]
      },
      {
        "symbol": "HG=F",
        "name": "Copper",
        "unit": "US$/lb",
        "dec": 2,
        "value": 6.666,
        "prev": 6.33,
        "change": 0.336,
        "pct": 5.31,
        "at": "2026-09-18T09:01:10.000Z",
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
            "value": 6.666
          }
        ]
      },
      {
        "symbol": "CL=F",
        "name": "Crude oil · WTI",
        "unit": "US$/bbl",
        "dec": 2,
        "value": 95.51,
        "prev": 101.39,
        "change": -5.88,
        "pct": -5.8,
        "at": "2026-09-18T09:01:11.000Z",
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
            "value": 95.51
          }
        ]
      },
      {
        "symbol": "BZ=F",
        "name": "Crude oil · Brent",
        "unit": "US$/bbl",
        "dec": 2,
        "value": 98.43,
        "prev": 105.68,
        "change": -7.25,
        "pct": -6.86,
        "at": "2026-09-18T09:01:11.000Z",
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
            "value": 98.43
          }
        ]
      },
      {
        "symbol": "NG=F",
        "name": "Natural gas",
        "unit": "US$/MMBtu",
        "dec": 2,
        "value": 2.853,
        "prev": 2.896,
        "change": -0.043,
        "pct": -1.48,
        "at": "2026-09-18T09:00:20.000Z",
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
            "value": 2.853
          }
        ]
      },
      {
        "symbol": "CC=F",
        "name": "Cocoa",
        "unit": "US$/t",
        "dec": 0,
        "value": 5620,
        "prev": 5995,
        "change": -375,
        "pct": -6.26,
        "at": "2026-09-18T08:51:12.000Z",
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
            "value": 5620
          }
        ]
      },
      {
        "symbol": "KC=F",
        "name": "Coffee",
        "unit": "US¢/lb",
        "dec": 1,
        "value": 278.8,
        "prev": 307.35,
        "change": -28.55,
        "pct": -9.29,
        "at": "2026-09-18T08:50:48.000Z",
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
            "value": 278.8
          }
        ]
      },
      {
        "symbol": "ZC=F",
        "name": "Maize",
        "unit": "US¢/bu",
        "dec": 1,
        "value": 528.5,
        "prev": 512,
        "change": 16.5,
        "pct": 3.22,
        "at": "2026-09-18T09:00:57.000Z",
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
            "value": 528.5
          }
        ]
      },
      {
        "symbol": "CT=F",
        "name": "Cotton",
        "unit": "US¢/lb",
        "dec": 2,
        "value": 82.39,
        "prev": 80.64,
        "change": 1.75,
        "pct": 2.17,
        "at": "2026-09-18T07:30:30.000Z",
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
            "value": 82.39
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
        "value": 78300,
        "prev": 78163.38,
        "change": 136.62,
        "pct": 0.17,
        "at": "2026-09-18T09:11:14.000Z",
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
            "value": 78300
          }
        ]
      },
      {
        "symbol": "ETH-USD",
        "name": "Ethereum",
        "unit": "US$",
        "dec": 0,
        "value": 2506.92,
        "prev": 2514.407,
        "change": -7.487,
        "pct": -0.3,
        "at": "2026-09-18T09:11:11.000Z",
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
            "value": 2506.92
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
        "value": 11.5,
        "prev": 11.1091,
        "change": 0.3909,
        "pct": 3.52,
        "at": "2026-09-18T04:17:33.000Z",
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
            "value": 11.5
          }
        ]
      },
      {
        "symbol": "EURGHS=X",
        "name": "Euro in cedis",
        "unit": "GH¢",
        "dec": 4,
        "value": 13.2142,
        "prev": 12.896,
        "change": 0.3182,
        "pct": 2.47,
        "at": "2026-09-18T04:43:57.000Z",
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
            "value": 13.2142
          }
        ]
      },
      {
        "symbol": "GBPGHS=X",
        "name": "Pound in cedis",
        "unit": "GH¢",
        "dec": 4,
        "value": 15.3799,
        "prev": 15.3651,
        "change": 0.0148,
        "pct": 0.1,
        "at": "2026-09-18T04:43:57.000Z",
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
            "value": 15.3799
          }
        ]
      },
      {
        "symbol": "EURUSD=X",
        "name": "Euro in dollars",
        "unit": "US$",
        "dec": 4,
        "value": 1.1486,
        "prev": 1.1594,
        "change": -0.0108,
        "pct": -0.93,
        "at": "2026-09-18T09:10:58.000Z",
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
            "value": 1.1486
          }
        ]
      },
      {
        "symbol": "GBPUSD=X",
        "name": "Pound in dollars",
        "unit": "US$",
        "dec": 4,
        "value": 1.337,
        "prev": 1.3526,
        "change": -0.0156,
        "pct": -1.15,
        "at": "2026-09-18T09:10:58.000Z",
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
            "value": 1.337
          }
        ]
      },
      {
        "symbol": "ZARGHS=X",
        "name": "Rand in cedis",
        "unit": "GH¢",
        "dec": 4,
        "value": 0.7081,
        "prev": 0.7066,
        "change": 0.0015,
        "pct": 0.21,
        "at": "2026-09-18T04:43:57.000Z",
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
            "value": 0.7081
          }
        ]
      },
      {
        "symbol": "CNYGHS=X",
        "name": "Yuan in cedis",
        "unit": "GH¢",
        "dec": 4,
        "value": 1.7128,
        "prev": 1.7092,
        "change": 0.0036,
        "pct": 0.21,
        "at": "2026-09-18T04:43:57.000Z",
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
            "value": 1.7128
          }
        ]
      }
    ]
  },
  "ghana": {
    "updated": null,
    "equities": []
  }
};

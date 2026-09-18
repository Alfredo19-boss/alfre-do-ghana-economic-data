/*
 * Alfredo Ghana Economic Data: world markets and Ghana Stock Exchange prices, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_MARKETS = {
  "updated": "2026-09-18T13:40:56.747Z",
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
        "value": 7641.28,
        "prev": 7656.98,
        "change": -15.7,
        "pct": -0.21,
        "at": "2026-09-18T13:40:08.000Z",
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
            "value": 7641.28
          }
        ]
      },
      {
        "symbol": "^DJI",
        "name": "Dow Jones",
        "unit": "",
        "dec": 0,
        "value": 51652.41,
        "prev": 52573.29,
        "change": -920.88,
        "pct": -1.75,
        "at": "2026-09-18T13:40:09.000Z",
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
            "value": 51652.41
          }
        ]
      },
      {
        "symbol": "^IXIC",
        "name": "Nasdaq",
        "unit": "",
        "dec": 0,
        "value": 26513.725,
        "prev": 26333.04,
        "change": 180.685,
        "pct": 0.69,
        "at": "2026-09-18T13:40:05.000Z",
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
            "value": 26513.725
          }
        ]
      },
      {
        "symbol": "^FTSE",
        "name": "FTSE 100 · London",
        "unit": "",
        "dec": 0,
        "value": 10686.93,
        "prev": 10650.4,
        "change": 36.53,
        "pct": 0.34,
        "at": "2026-09-18T13:25:09.000Z",
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
            "value": 10686.93
          }
        ]
      },
      {
        "symbol": "^GDAXI",
        "name": "DAX · Frankfurt",
        "unit": "",
        "dec": 0,
        "value": 25403.05,
        "prev": 25568.56,
        "change": -165.51,
        "pct": -0.65,
        "at": "2026-09-18T13:25:10.000Z",
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
            "value": 25403.05
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
        "value": 6968.67,
        "prev": 6993.73,
        "change": -25.06,
        "pct": -0.36,
        "at": "2026-09-18T13:25:11.000Z",
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
            "value": 6968.67
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
        "value": 4406,
        "prev": 4351.9,
        "change": 54.1,
        "pct": 1.24,
        "at": "2026-09-18T13:30:11.000Z",
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
            "value": 4406
          }
        ]
      },
      {
        "symbol": "SI=F",
        "name": "Silver",
        "unit": "US$/oz",
        "dec": 2,
        "value": 67.05,
        "prev": 63.513,
        "change": 3.537,
        "pct": 5.57,
        "at": "2026-09-18T13:30:11.000Z",
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
            "value": 67.05
          }
        ]
      },
      {
        "symbol": "HG=F",
        "name": "Copper",
        "unit": "US$/lb",
        "dec": 2,
        "value": 6.6725,
        "prev": 6.33,
        "change": 0.3425,
        "pct": 5.41,
        "at": "2026-09-18T13:30:13.000Z",
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
            "value": 6.6725
          }
        ]
      },
      {
        "symbol": "CL=F",
        "name": "Crude oil · WTI",
        "unit": "US$/bbl",
        "dec": 2,
        "value": 97.59,
        "prev": 101.39,
        "change": -3.8,
        "pct": -3.75,
        "at": "2026-09-18T13:30:13.000Z",
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
            "value": 97.59
          }
        ]
      },
      {
        "symbol": "BZ=F",
        "name": "Crude oil · Brent",
        "unit": "US$/bbl",
        "dec": 2,
        "value": 99.62,
        "prev": 105.68,
        "change": -6.06,
        "pct": -5.73,
        "at": "2026-09-18T13:30:14.000Z",
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
            "value": 99.62
          }
        ]
      },
      {
        "symbol": "NG=F",
        "name": "Natural gas",
        "unit": "US$/MMBtu",
        "dec": 2,
        "value": 2.916,
        "prev": 2.896,
        "change": 0.02,
        "pct": 0.69,
        "at": "2026-09-18T13:30:14.000Z",
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
            "value": 2.916
          }
        ]
      },
      {
        "symbol": "CC=F",
        "name": "Cocoa",
        "unit": "US$/t",
        "dec": 0,
        "value": 5490,
        "prev": 5995,
        "change": -505,
        "pct": -8.42,
        "at": "2026-09-18T13:20:08.000Z",
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
            "value": 5490
          }
        ]
      },
      {
        "symbol": "KC=F",
        "name": "Coffee",
        "unit": "US¢/lb",
        "dec": 1,
        "value": 278.55,
        "prev": 307.35,
        "change": -28.8,
        "pct": -9.37,
        "at": "2026-09-18T13:20:15.000Z",
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
            "value": 278.55
          }
        ]
      },
      {
        "symbol": "ZC=F",
        "name": "Maize",
        "unit": "US¢/bu",
        "dec": 1,
        "value": 529.5,
        "prev": 512,
        "change": 17.5,
        "pct": 3.42,
        "at": "2026-09-18T13:30:16.000Z",
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
            "value": 529.5
          }
        ]
      },
      {
        "symbol": "CT=F",
        "name": "Cotton",
        "unit": "US¢/lb",
        "dec": 2,
        "value": 81.64,
        "prev": 80.64,
        "change": 1,
        "pct": 1.24,
        "at": "2026-09-18T12:30:38.000Z",
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
            "value": 81.64
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
        "value": 78921.74,
        "prev": 78163.38,
        "change": 758.36,
        "pct": 0.97,
        "at": "2026-09-18T13:40:15.000Z",
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
            "value": 78921.74
          }
        ]
      },
      {
        "symbol": "ETH-USD",
        "name": "Ethereum",
        "unit": "US$",
        "dec": 0,
        "value": 2525.37,
        "prev": 2514.407,
        "change": 10.963,
        "pct": 0.44,
        "at": "2026-09-18T13:40:12.000Z",
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
            "value": 2525.37
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
        "value": 11.48,
        "prev": 11.1091,
        "change": 0.3709,
        "pct": 3.34,
        "at": "2026-09-18T13:24:08.000Z",
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
            "value": 11.48
          }
        ]
      },
      {
        "symbol": "EURGHS=X",
        "name": "Euro in cedis",
        "unit": "GH¢",
        "dec": 4,
        "value": 13.1608,
        "prev": 12.896,
        "change": 0.2648,
        "pct": 2.05,
        "at": "2026-09-18T13:38:59.000Z",
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
            "value": 13.1608
          }
        ]
      },
      {
        "symbol": "GBPGHS=X",
        "name": "Pound in cedis",
        "unit": "GH¢",
        "dec": 4,
        "value": 15.3195,
        "prev": 15.3651,
        "change": -0.0456,
        "pct": -0.3,
        "at": "2026-09-18T13:38:59.000Z",
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
            "value": 15.3195
          }
        ]
      },
      {
        "symbol": "EURUSD=X",
        "name": "Euro in dollars",
        "unit": "US$",
        "dec": 4,
        "value": 1.1465,
        "prev": 1.1594,
        "change": -0.0129,
        "pct": -1.11,
        "at": "2026-09-18T13:39:59.000Z",
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
            "value": 1.1465
          }
        ]
      },
      {
        "symbol": "GBPUSD=X",
        "name": "Pound in dollars",
        "unit": "US$",
        "dec": 4,
        "value": 1.3343,
        "prev": 1.3526,
        "change": -0.0183,
        "pct": -1.35,
        "at": "2026-09-18T13:39:59.000Z",
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
            "value": 1.3343
          }
        ]
      },
      {
        "symbol": "ZARGHS=X",
        "name": "Rand in cedis",
        "unit": "GH¢",
        "dec": 4,
        "value": 0.7039,
        "prev": 0.7066,
        "change": -0.0027,
        "pct": -0.38,
        "at": "2026-09-18T13:38:59.000Z",
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
            "value": 0.7039
          }
        ]
      },
      {
        "symbol": "CNYGHS=X",
        "name": "Yuan in cedis",
        "unit": "GH¢",
        "dec": 4,
        "value": 1.7082,
        "prev": 1.7092,
        "change": -0.001,
        "pct": -0.06,
        "at": "2026-09-18T13:38:59.000Z",
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
            "value": 1.7082
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

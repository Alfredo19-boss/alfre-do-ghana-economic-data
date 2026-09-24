/*
 * Alfredo Ghana Economic Data: world markets and Ghana Stock Exchange prices, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_MARKETS = {
  "updated": "2026-09-24T12:35:05.535Z",
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
        "value": 7706.03,
        "prev": 7551.81,
        "change": 154.22,
        "pct": 2.04,
        "at": "2026-09-23T20:36:22.000Z",
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
          },
          {
            "date": "2026-09-21",
            "value": 7764.7
          },
          {
            "date": "2026-09-22",
            "value": 7764.64
          },
          {
            "date": "2026-09-23",
            "value": 7706.03
          }
        ]
      },
      {
        "symbol": "^DJI",
        "name": "Dow Jones",
        "unit": "",
        "dec": 0,
        "value": 51511.59,
        "prev": 51461.9,
        "change": 49.69,
        "pct": 0.1,
        "at": "2026-09-23T20:36:26.000Z",
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
          },
          {
            "date": "2026-09-21",
            "value": 52048.83
          },
          {
            "date": "2026-09-22",
            "value": 51863.69
          },
          {
            "date": "2026-09-23",
            "value": 51511.59
          }
        ]
      },
      {
        "symbol": "^IXIC",
        "name": "Nasdaq",
        "unit": "",
        "dec": 0,
        "value": 26936.037,
        "prev": 25978.43,
        "change": 957.607,
        "pct": 3.69,
        "at": "2026-09-23T21:15:59.000Z",
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
          },
          {
            "date": "2026-09-21",
            "value": 27122.094
          },
          {
            "date": "2026-09-22",
            "value": 27244.277
          },
          {
            "date": "2026-09-23",
            "value": 26936.037
          }
        ]
      },
      {
        "symbol": "^FTSE",
        "name": "FTSE 100 · London",
        "unit": "",
        "dec": 0,
        "value": 10719.66,
        "prev": 10816.1,
        "change": -96.44,
        "pct": -0.89,
        "at": "2026-09-24T12:19:34.000Z",
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
          },
          {
            "date": "2026-09-21",
            "value": 10739.01
          },
          {
            "date": "2026-09-22",
            "value": 10708.33
          },
          {
            "date": "2026-09-23",
            "value": 10705.26
          },
          {
            "date": "2026-09-24",
            "value": 10719.66
          }
        ]
      },
      {
        "symbol": "^GDAXI",
        "name": "DAX · Frankfurt",
        "unit": "",
        "dec": 0,
        "value": 25362.52,
        "prev": 25716.71,
        "change": -354.19,
        "pct": -1.38,
        "at": "2026-09-24T12:19:36.000Z",
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
          },
          {
            "date": "2026-09-21",
            "value": 25575.01
          },
          {
            "date": "2026-09-22",
            "value": 25578.85
          },
          {
            "date": "2026-09-23",
            "value": 25410.63
          },
          {
            "date": "2026-09-24",
            "value": 25362.52
          }
        ]
      },
      {
        "symbol": "^N225",
        "name": "Nikkei 225 · Tokyo",
        "unit": "",
        "dec": 0,
        "value": 65513.99,
        "prev": 63484.1,
        "change": 2029.89,
        "pct": 3.2,
        "at": "2026-09-24T06:45:03.000Z",
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
          },
          {
            "date": "2026-09-24",
            "value": 65513.99
          }
        ]
      },
      {
        "symbol": "^HSI",
        "name": "Hang Seng · Hong Kong",
        "unit": "",
        "dec": 0,
        "value": 24761.13,
        "prev": 24604.29,
        "change": 156.84,
        "pct": 0.64,
        "at": "2026-09-24T08:08:56.000Z",
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
          },
          {
            "date": "2026-09-21",
            "value": 25042.71
          },
          {
            "date": "2026-09-22",
            "value": 25087.75
          },
          {
            "date": "2026-09-23",
            "value": 24834.12
          },
          {
            "date": "2026-09-24",
            "value": 24761.13
          }
        ]
      },
      {
        "symbol": "^JN0U.JO",
        "name": "JSE Top 40 · Johannesburg",
        "unit": "",
        "dec": 0,
        "value": 6814.95,
        "prev": 7040.92,
        "change": -225.97,
        "pct": -3.21,
        "at": "2026-09-23T15:28:01.000Z",
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
          },
          {
            "date": "2026-09-21",
            "value": 6974.91
          },
          {
            "date": "2026-09-22",
            "value": 6993.11
          },
          {
            "date": "2026-09-23",
            "value": 6814.95
          }
        ]
      },
      {
        "symbol": "^NSEI",
        "name": "Nifty 50 · India",
        "unit": "",
        "dec": 0,
        "value": 23063.1,
        "prev": 23346.4,
        "change": -283.3,
        "pct": -1.21,
        "at": "2026-09-24T10:01:13.000Z",
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
          },
          {
            "date": "2026-09-21",
            "value": 23414.3
          },
          {
            "date": "2026-09-22",
            "value": 23329
          },
          {
            "date": "2026-09-23",
            "value": 23446.8
          },
          {
            "date": "2026-09-24",
            "value": 23063.1
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
        "value": 4301.6,
        "prev": 4383.9,
        "change": -82.3,
        "pct": -1.88,
        "at": "2026-09-24T12:24:35.000Z",
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
          },
          {
            "date": "2026-09-20",
            "value": 4412.1
          },
          {
            "date": "2026-09-21",
            "value": 4399.6
          },
          {
            "date": "2026-09-22",
            "value": 4400.2
          },
          {
            "date": "2026-09-23",
            "value": 4324
          },
          {
            "date": "2026-09-24",
            "value": 4301.6
          }
        ]
      },
      {
        "symbol": "SI=F",
        "name": "Silver",
        "unit": "US$/oz",
        "dec": 2,
        "value": 64.06,
        "prev": 65.825,
        "change": -1.765,
        "pct": -2.68,
        "at": "2026-09-24T12:24:30.000Z",
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
          },
          {
            "date": "2026-09-20",
            "value": 66.82
          },
          {
            "date": "2026-09-21",
            "value": 66.905
          },
          {
            "date": "2026-09-22",
            "value": 67.8
          },
          {
            "date": "2026-09-23",
            "value": 64.915
          },
          {
            "date": "2026-09-24",
            "value": 64.06
          }
        ]
      },
      {
        "symbol": "HG=F",
        "name": "Copper",
        "unit": "US$/lb",
        "dec": 2,
        "value": 6.758,
        "prev": 6.6865,
        "change": 0.0715,
        "pct": 1.07,
        "at": "2026-09-24T12:24:37.000Z",
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
          },
          {
            "date": "2026-09-20",
            "value": 6.7125
          },
          {
            "date": "2026-09-21",
            "value": 6.7985
          },
          {
            "date": "2026-09-22",
            "value": 6.901
          },
          {
            "date": "2026-09-23",
            "value": 6.7895
          },
          {
            "date": "2026-09-24",
            "value": 6.758
          }
        ]
      },
      {
        "symbol": "CL=F",
        "name": "Crude oil · WTI",
        "unit": "US$/bbl",
        "dec": 2,
        "value": 93.64,
        "prev": 95.78,
        "change": -2.14,
        "pct": -2.23,
        "at": "2026-09-24T12:24:36.000Z",
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
          },
          {
            "date": "2026-09-20",
            "value": 95.92
          },
          {
            "date": "2026-09-21",
            "value": 92.16
          },
          {
            "date": "2026-09-22",
            "value": 89.65
          },
          {
            "date": "2026-09-23",
            "value": 92.25
          },
          {
            "date": "2026-09-24",
            "value": 93.64
          }
        ]
      },
      {
        "symbol": "BZ=F",
        "name": "Crude oil · Brent",
        "unit": "US$/bbl",
        "dec": 2,
        "value": 105.07,
        "prev": 100.34,
        "change": 4.73,
        "pct": 4.71,
        "at": "2026-09-24T12:24:31.000Z",
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
          },
          {
            "date": "2026-09-20",
            "value": 99.38
          },
          {
            "date": "2026-09-21",
            "value": 96.03
          },
          {
            "date": "2026-09-22",
            "value": 98.44
          },
          {
            "date": "2026-09-23",
            "value": 97.88
          },
          {
            "date": "2026-09-24",
            "value": 105.07
          }
        ]
      },
      {
        "symbol": "NG=F",
        "name": "Natural gas",
        "unit": "US$/MMBtu",
        "dec": 2,
        "value": 3.138,
        "prev": 2.836,
        "change": 0.302,
        "pct": 10.65,
        "at": "2026-09-24T12:24:36.000Z",
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
          },
          {
            "date": "2026-09-20",
            "value": 2.884
          },
          {
            "date": "2026-09-21",
            "value": 2.828
          },
          {
            "date": "2026-09-22",
            "value": 3.171
          },
          {
            "date": "2026-09-23",
            "value": 3.17
          },
          {
            "date": "2026-09-24",
            "value": 3.138
          }
        ]
      },
      {
        "symbol": "CC=F",
        "name": "Cocoa",
        "unit": "US$/t",
        "dec": 0,
        "value": 5596,
        "prev": 5351,
        "change": 245,
        "pct": 4.58,
        "at": "2026-09-24T12:14:38.000Z",
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
          },
          {
            "date": "2026-09-21",
            "value": 5307
          },
          {
            "date": "2026-09-22",
            "value": 5419
          },
          {
            "date": "2026-09-23",
            "value": 5519
          },
          {
            "date": "2026-09-24",
            "value": 5596
          }
        ]
      },
      {
        "symbol": "KC=F",
        "name": "Coffee",
        "unit": "US¢/lb",
        "dec": 1,
        "value": 274.7,
        "prev": 276.4,
        "change": -1.7,
        "pct": -0.62,
        "at": "2026-09-24T12:14:25.000Z",
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
          },
          {
            "date": "2026-09-21",
            "value": 274.5
          },
          {
            "date": "2026-09-22",
            "value": 271.75
          },
          {
            "date": "2026-09-23",
            "value": 274.9
          },
          {
            "date": "2026-09-24",
            "value": 274.7
          }
        ]
      },
      {
        "symbol": "ZC=F",
        "name": "Maize",
        "unit": "US¢/bu",
        "dec": 1,
        "value": 527.75,
        "prev": 543,
        "change": -15.25,
        "pct": -2.81,
        "at": "2026-09-24T12:23:40.000Z",
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
          },
          {
            "date": "2026-09-21",
            "value": 543
          },
          {
            "date": "2026-09-22",
            "value": 536.25
          },
          {
            "date": "2026-09-23",
            "value": 528.75
          },
          {
            "date": "2026-09-24",
            "value": 527.75
          }
        ]
      },
      {
        "symbol": "CT=F",
        "name": "Cotton",
        "unit": "US¢/lb",
        "dec": 2,
        "value": 83.22,
        "prev": 79.85,
        "change": 3.37,
        "pct": 4.22,
        "at": "2026-09-24T09:30:36.000Z",
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
          },
          {
            "date": "2026-09-21",
            "value": 83.53
          },
          {
            "date": "2026-09-22",
            "value": 82.77
          },
          {
            "date": "2026-09-23",
            "value": 83.02
          },
          {
            "date": "2026-09-24",
            "value": 83.22
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
        "value": 83388.84,
        "prev": 81142.61,
        "change": 2246.23,
        "pct": 2.77,
        "at": "2026-09-24T12:34:36.000Z",
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
            "value": 81195.08
          },
          {
            "date": "2026-09-21",
            "value": 86518.53
          },
          {
            "date": "2026-09-22",
            "value": 86163.59
          },
          {
            "date": "2026-09-23",
            "value": 84508.86
          },
          {
            "date": "2026-09-24",
            "value": 83388.84
          }
        ]
      },
      {
        "symbol": "ETH-USD",
        "name": "Ethereum",
        "unit": "US$",
        "dec": 0,
        "value": 2642.24,
        "prev": 2642.9976,
        "change": -0.7576,
        "pct": -0.03,
        "at": "2026-09-24T12:34:36.000Z",
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
            "value": 2636.8
          },
          {
            "date": "2026-09-21",
            "value": 2782.5
          },
          {
            "date": "2026-09-22",
            "value": 2755.05
          },
          {
            "date": "2026-09-23",
            "value": 2687.38
          },
          {
            "date": "2026-09-24",
            "value": 2642.24
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
        "value": 11.551085,
        "prev": 11.515146,
        "change": 0.035939,
        "pct": 0.31,
        "at": "2026-09-23T00:00:00.000Z",
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
          },
          {
            "date": "2026-09-20",
            "value": 11.514917
          },
          {
            "date": "2026-09-21",
            "value": 11.514879
          },
          {
            "date": "2026-09-22",
            "value": 11.515146
          },
          {
            "date": "2026-09-21",
            "value": 11.514879
          },
          {
            "date": "2026-09-22",
            "value": 11.515146
          },
          {
            "date": "2026-09-23",
            "value": 11.551085
          }
        ]
      },
      {
        "symbol": "EURGHS=X",
        "name": "Euro in cedis",
        "unit": "GH¢",
        "dec": 4,
        "value": 13.198597,
        "prev": 13.213215,
        "change": -0.014618,
        "pct": -0.11,
        "at": "2026-09-23T00:00:00.000Z",
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
          },
          {
            "date": "2026-09-20",
            "value": 13.226212
          },
          {
            "date": "2026-09-21",
            "value": 13.216136
          },
          {
            "date": "2026-09-22",
            "value": 13.213215
          },
          {
            "date": "2026-09-21",
            "value": 13.216136
          },
          {
            "date": "2026-09-22",
            "value": 13.213215
          },
          {
            "date": "2026-09-23",
            "value": 13.198597
          }
        ]
      },
      {
        "symbol": "GBPGHS=X",
        "name": "Pound in cedis",
        "unit": "GH¢",
        "dec": 4,
        "value": 15.382479,
        "prev": 15.410232,
        "change": -0.027753,
        "pct": -0.18,
        "at": "2026-09-23T00:00:00.000Z",
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
          },
          {
            "date": "2026-09-20",
            "value": 15.42458
          },
          {
            "date": "2026-09-21",
            "value": 15.410545
          },
          {
            "date": "2026-09-22",
            "value": 15.410232
          },
          {
            "date": "2026-09-21",
            "value": 15.410545
          },
          {
            "date": "2026-09-22",
            "value": 15.410232
          },
          {
            "date": "2026-09-23",
            "value": 15.382479
          }
        ]
      },
      {
        "symbol": "EURUSD=X",
        "name": "Euro in dollars",
        "unit": "US$",
        "dec": 4,
        "value": 1.1366,
        "prev": 1.1476,
        "change": -0.011,
        "pct": -0.96,
        "at": "2026-09-24T12:34:07.000Z",
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
          },
          {
            "date": "2026-09-20",
            "value": 1.1482
          },
          {
            "date": "2026-09-21",
            "value": 1.1468
          },
          {
            "date": "2026-09-22",
            "value": 1.1451
          },
          {
            "date": "2026-09-23",
            "value": 1.1387
          },
          {
            "date": "2026-09-24",
            "value": 1.1366
          }
        ]
      },
      {
        "symbol": "GBPUSD=X",
        "name": "Pound in dollars",
        "unit": "US$",
        "dec": 4,
        "value": 1.3217,
        "prev": 1.3358,
        "change": -0.0141,
        "pct": -1.06,
        "at": "2026-09-24T12:34:07.000Z",
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
            "value": 1.3389
          },
          {
            "date": "2026-09-21",
            "value": 1.337
          },
          {
            "date": "2026-09-22",
            "value": 1.3344
          },
          {
            "date": "2026-09-23",
            "value": 1.3242
          },
          {
            "date": "2026-09-24",
            "value": 1.3217
          }
        ]
      },
      {
        "symbol": "NGNGHS=X",
        "name": "Naira in cedis",
        "unit": "GH¢",
        "dec": 4,
        "value": 0.0087183859,
        "prev": 0.0086821277,
        "change": 0.0000362582,
        "pct": 0.42,
        "at": "2026-09-23T00:00:00.000Z",
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
          },
          {
            "date": "2026-09-20",
            "value": 0.0086459074
          },
          {
            "date": "2026-09-21",
            "value": 0.0086536612
          },
          {
            "date": "2026-09-22",
            "value": 0.0086821277
          },
          {
            "date": "2026-09-21",
            "value": 0.0086536612
          },
          {
            "date": "2026-09-22",
            "value": 0.0086821277
          },
          {
            "date": "2026-09-23",
            "value": 0.0087183859
          }
        ]
      },
      {
        "symbol": "ZARGHS=X",
        "name": "Rand in cedis",
        "unit": "GH¢",
        "dec": 4,
        "value": 0.71320759,
        "prev": 0.70859968,
        "change": 0.00460791,
        "pct": 0.65,
        "at": "2026-09-23T00:00:00.000Z",
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
          },
          {
            "date": "2026-09-20",
            "value": 0.70749419
          },
          {
            "date": "2026-09-21",
            "value": 0.70967854
          },
          {
            "date": "2026-09-22",
            "value": 0.70859968
          },
          {
            "date": "2026-09-21",
            "value": 0.70967854
          },
          {
            "date": "2026-09-22",
            "value": 0.70859968
          },
          {
            "date": "2026-09-23",
            "value": 0.71320759
          }
        ]
      },
      {
        "symbol": "CNYGHS=X",
        "name": "Yuan in cedis",
        "unit": "GH¢",
        "dec": 4,
        "value": 1.722838,
        "prev": 1.7196464,
        "change": 0.0031916,
        "pct": 0.19,
        "at": "2026-09-23T00:00:00.000Z",
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
          },
          {
            "date": "2026-09-20",
            "value": 1.7182341
          },
          {
            "date": "2026-09-21",
            "value": 1.7196358
          },
          {
            "date": "2026-09-22",
            "value": 1.7196464
          },
          {
            "date": "2026-09-21",
            "value": 1.7196358
          },
          {
            "date": "2026-09-22",
            "value": 1.7196464
          },
          {
            "date": "2026-09-23",
            "value": 1.722838
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

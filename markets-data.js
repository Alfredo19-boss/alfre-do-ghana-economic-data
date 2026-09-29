/*
 * Alfredo Ghana Economic Data: world markets and Ghana Stock Exchange prices, fetched by
 * .github/workflows/live-rates.yml every 20 minutes. Do not edit by hand.
 */
window.GDC_MARKETS = {
  "updated": "2026-09-29T18:42:57.284Z",
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
        "value": 7679.51,
        "prev": 7764.64,
        "change": -85.13,
        "pct": -1.1,
        "at": "2026-09-29T18:42:24.000Z",
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
          },
          {
            "date": "2026-09-24",
            "value": 7704.13
          },
          {
            "date": "2026-09-25",
            "value": 7743.41
          },
          {
            "date": "2026-09-28",
            "value": 7683.69
          },
          {
            "date": "2026-09-29",
            "value": 7679.51
          }
        ]
      },
      {
        "symbol": "^DJI",
        "name": "Dow Jones",
        "unit": "",
        "dec": 0,
        "value": 51366.58,
        "prev": 51863.69,
        "change": -497.11,
        "pct": -0.96,
        "at": "2026-09-29T18:42:25.000Z",
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
          },
          {
            "date": "2026-09-24",
            "value": 51349.98
          },
          {
            "date": "2026-09-25",
            "value": 51828.62
          },
          {
            "date": "2026-09-28",
            "value": 51481.51
          },
          {
            "date": "2026-09-29",
            "value": 51366.58
          }
        ]
      },
      {
        "symbol": "^IXIC",
        "name": "Nasdaq",
        "unit": "",
        "dec": 0,
        "value": 26830.377,
        "prev": 27244.28,
        "change": -413.903,
        "pct": -1.52,
        "at": "2026-09-29T18:42:24.000Z",
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
          },
          {
            "date": "2026-09-24",
            "value": 26939.373
          },
          {
            "date": "2026-09-25",
            "value": 27068.717
          },
          {
            "date": "2026-09-28",
            "value": 26820.38
          },
          {
            "date": "2026-09-29",
            "value": 26830.377
          }
        ]
      },
      {
        "symbol": "^FTSE",
        "name": "FTSE 100 · London",
        "unit": "",
        "dec": 0,
        "value": 10636.71,
        "prev": 10708.3,
        "change": -71.59,
        "pct": -0.67,
        "at": "2026-09-29T15:35:29.000Z",
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
            "value": 10679.99
          },
          {
            "date": "2026-09-25",
            "value": 10695.25
          },
          {
            "date": "2026-09-28",
            "value": 10684.88
          },
          {
            "date": "2026-09-29",
            "value": 10636.71
          }
        ]
      },
      {
        "symbol": "^GDAXI",
        "name": "DAX · Frankfurt",
        "unit": "",
        "dec": 0,
        "value": 25399.21,
        "prev": 25578.85,
        "change": -179.64,
        "pct": -0.7,
        "at": "2026-09-29T16:00:00.000Z",
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
            "value": 25266.53
          },
          {
            "date": "2026-09-25",
            "value": 25408.64
          },
          {
            "date": "2026-09-28",
            "value": 25374.42
          },
          {
            "date": "2026-09-29",
            "value": 25399.21
          }
        ]
      },
      {
        "symbol": "^N225",
        "name": "Nikkei 225 · Tokyo",
        "unit": "",
        "dec": 0,
        "value": 65481.27,
        "prev": 65018.95,
        "change": 462.32,
        "pct": 0.71,
        "at": "2026-09-29T06:45:02.000Z",
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
          },
          {
            "date": "2026-09-25",
            "value": 66364.2
          },
          {
            "date": "2026-09-28",
            "value": 65877.62
          },
          {
            "date": "2026-09-29",
            "value": 65481.27
          }
        ]
      },
      {
        "symbol": "^HSI",
        "name": "Hang Seng · Hong Kong",
        "unit": "",
        "dec": 0,
        "value": 24523.57,
        "prev": 25087.75,
        "change": -564.18,
        "pct": -2.25,
        "at": "2026-09-29T08:08:26.000Z",
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
          },
          {
            "date": "2026-09-25",
            "value": 24510.09
          },
          {
            "date": "2026-09-28",
            "value": 24642.51
          },
          {
            "date": "2026-09-29",
            "value": 24523.57
          }
        ]
      },
      {
        "symbol": "^JN0U.JO",
        "name": "JSE Top 40 · Johannesburg",
        "unit": "",
        "dec": 0,
        "value": 6655.94,
        "prev": 6993.11,
        "change": -337.17,
        "pct": -4.82,
        "at": "2026-09-29T15:28:01.000Z",
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
          },
          {
            "date": "2026-09-25",
            "value": 6791.9
          },
          {
            "date": "2026-09-28",
            "value": 6621.22
          },
          {
            "date": "2026-09-29",
            "value": 6655.94
          }
        ]
      },
      {
        "symbol": "^NSEI",
        "name": "Nifty 50 · India",
        "unit": "",
        "dec": 0,
        "value": 22716.2,
        "prev": 23446.8,
        "change": -730.6,
        "pct": -3.12,
        "at": "2026-09-29T10:01:37.000Z",
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
          },
          {
            "date": "2026-09-25",
            "value": 23140.5
          },
          {
            "date": "2026-09-28",
            "value": 22780.25
          },
          {
            "date": "2026-09-29",
            "value": 22716.2
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
        "value": 4195.8,
        "prev": 4298,
        "change": -102.2,
        "pct": -2.38,
        "at": "2026-09-29T18:32:27.000Z",
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
            "value": 4308.7
          },
          {
            "date": "2026-09-25",
            "value": 4321.2
          },
          {
            "date": "2026-09-27",
            "value": 4321.2
          },
          {
            "date": "2026-09-28",
            "value": 4148.2
          },
          {
            "date": "2026-09-29",
            "value": 4195.8
          }
        ]
      },
      {
        "symbol": "SI=F",
        "name": "Silver",
        "unit": "US$/oz",
        "dec": 2,
        "value": 61.465,
        "prev": 63.457,
        "change": -1.992,
        "pct": -3.14,
        "at": "2026-09-29T18:32:26.000Z",
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
            "value": 64.195
          },
          {
            "date": "2026-09-25",
            "value": 64.801
          },
          {
            "date": "2026-09-27",
            "value": 64.801
          },
          {
            "date": "2026-09-28",
            "value": 61.03
          },
          {
            "date": "2026-09-29",
            "value": 61.465
          }
        ]
      },
      {
        "symbol": "HG=F",
        "name": "Copper",
        "unit": "US$/lb",
        "dec": 2,
        "value": 6.632,
        "prev": 6.7185,
        "change": -0.0865,
        "pct": -1.29,
        "at": "2026-09-29T18:32:02.000Z",
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
            "value": 6.777
          },
          {
            "date": "2026-09-25",
            "value": 6.766
          },
          {
            "date": "2026-09-27",
            "value": 6.766
          },
          {
            "date": "2026-09-28",
            "value": 6.607
          },
          {
            "date": "2026-09-29",
            "value": 6.632
          }
        ]
      },
      {
        "symbol": "CL=F",
        "name": "Crude oil · WTI",
        "unit": "US$/bbl",
        "dec": 2,
        "value": 89.43,
        "prev": 94.61,
        "change": -5.18,
        "pct": -5.48,
        "at": "2026-09-29T18:32:28.000Z",
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
            "value": 94.01
          },
          {
            "date": "2026-09-25",
            "value": 92.41
          },
          {
            "date": "2026-09-27",
            "value": 92.41
          },
          {
            "date": "2026-09-28",
            "value": 93.29
          },
          {
            "date": "2026-09-29",
            "value": 89.43
          }
        ]
      },
      {
        "symbol": "BZ=F",
        "name": "Crude oil · Brent",
        "unit": "US$/bbl",
        "dec": 2,
        "value": 96.23,
        "prev": 106.6,
        "change": -10.37,
        "pct": -9.73,
        "at": "2026-09-29T18:32:27.000Z",
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
            "value": 106.18
          },
          {
            "date": "2026-09-25",
            "value": 97.44
          },
          {
            "date": "2026-09-27",
            "value": 97.44
          },
          {
            "date": "2026-09-28",
            "value": 98.6
          },
          {
            "date": "2026-09-29",
            "value": 96.23
          }
        ]
      },
      {
        "symbol": "NG=F",
        "name": "Natural gas",
        "unit": "US$/MMBtu",
        "dec": 2,
        "value": 3.005,
        "prev": 3.297,
        "change": -0.292,
        "pct": -8.86,
        "at": "2026-09-29T18:32:27.000Z",
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
            "value": 3.277
          },
          {
            "date": "2026-09-25",
            "value": 3.225
          },
          {
            "date": "2026-09-27",
            "value": 3.225
          },
          {
            "date": "2026-09-28",
            "value": 3.145
          },
          {
            "date": "2026-09-29",
            "value": 3.005
          }
        ]
      },
      {
        "symbol": "CC=F",
        "name": "Cocoa",
        "unit": "US$/t",
        "dec": 0,
        "value": 5354,
        "prev": 5590,
        "change": -236,
        "pct": -4.22,
        "at": "2026-09-29T17:29:54.000Z",
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
            "value": 5594
          },
          {
            "date": "2026-09-25",
            "value": 5603
          },
          {
            "date": "2026-09-28",
            "value": 5607
          },
          {
            "date": "2026-09-29",
            "value": 5354
          }
        ]
      },
      {
        "symbol": "KC=F",
        "name": "Coffee",
        "unit": "US¢/lb",
        "dec": 1,
        "value": 292.7,
        "prev": 275.35,
        "change": 17.35,
        "pct": 6.3,
        "at": "2026-09-29T17:29:58.000Z",
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
            "value": 276.6
          },
          {
            "date": "2026-09-25",
            "value": 278.1
          },
          {
            "date": "2026-09-28",
            "value": 288.4
          },
          {
            "date": "2026-09-29",
            "value": 292.7
          }
        ]
      },
      {
        "symbol": "ZC=F",
        "name": "Maize",
        "unit": "US¢/bu",
        "dec": 1,
        "value": 522.25,
        "prev": 527.5,
        "change": -5.25,
        "pct": -1,
        "at": "2026-09-29T18:19:59.000Z",
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
            "value": 526.5
          },
          {
            "date": "2026-09-25",
            "value": 528.25
          },
          {
            "date": "2026-09-28",
            "value": 522.25
          },
          {
            "date": "2026-09-29",
            "value": 522.25
          }
        ]
      },
      {
        "symbol": "CT=F",
        "name": "Cotton",
        "unit": "US¢/lb",
        "dec": 2,
        "value": 78.86,
        "prev": 79.51,
        "change": -0.65,
        "pct": -0.82,
        "at": "2026-09-29T15:30:20.000Z",
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
            "value": 83.36
          },
          {
            "date": "2026-09-25",
            "value": 82.49
          },
          {
            "date": "2026-09-28",
            "value": 82.52
          },
          {
            "date": "2026-09-29",
            "value": 78.86
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
        "value": 83643.45,
        "prev": 84034.92,
        "change": -391.47,
        "pct": -0.47,
        "at": "2026-09-29T18:42:32.000Z",
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
            "value": 84380.9
          },
          {
            "date": "2026-09-25",
            "value": 83888.64
          },
          {
            "date": "2026-09-26",
            "value": 84409.48
          },
          {
            "date": "2026-09-27",
            "value": 84375.62
          },
          {
            "date": "2026-09-28",
            "value": 83444.78
          },
          {
            "date": "2026-09-29",
            "value": 83643.45
          }
        ]
      },
      {
        "symbol": "ETH-USD",
        "name": "Ethereum",
        "unit": "US$",
        "dec": 0,
        "value": 2694.9,
        "prev": 2690.4756,
        "change": 4.4244,
        "pct": 0.16,
        "at": "2026-09-29T18:42:32.000Z",
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
            "value": 2689.15
          },
          {
            "date": "2026-09-25",
            "value": 2687.5
          },
          {
            "date": "2026-09-26",
            "value": 2694.97
          },
          {
            "date": "2026-09-27",
            "value": 2676.01
          },
          {
            "date": "2026-09-28",
            "value": 2679.78
          },
          {
            "date": "2026-09-29",
            "value": 2694.9
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
        "value": 11.613149,
        "prev": 11.616906,
        "change": -0.003757,
        "pct": -0.03,
        "at": "2026-09-28T00:00:00.000Z",
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
          },
          {
            "date": "2026-09-24",
            "value": 11.584478
          },
          {
            "date": "2026-09-23",
            "value": 11.551085
          },
          {
            "date": "2026-09-24",
            "value": 11.584478
          },
          {
            "date": "2026-09-25",
            "value": 11.595325
          },
          {
            "date": "2026-09-26",
            "value": 11.616777
          },
          {
            "date": "2026-09-27",
            "value": 11.616906
          },
          {
            "date": "2026-09-28",
            "value": 11.613149
          }
        ]
      },
      {
        "symbol": "EURGHS=X",
        "name": "Euro in cedis",
        "unit": "GH¢",
        "dec": 4,
        "value": 13.226258,
        "prev": 13.234016,
        "change": -0.007758,
        "pct": -0.06,
        "at": "2026-09-28T00:00:00.000Z",
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
          },
          {
            "date": "2026-09-24",
            "value": 13.179399
          },
          {
            "date": "2026-09-23",
            "value": 13.198597
          },
          {
            "date": "2026-09-24",
            "value": 13.179399
          },
          {
            "date": "2026-09-25",
            "value": 13.183482
          },
          {
            "date": "2026-09-26",
            "value": 13.232983
          },
          {
            "date": "2026-09-27",
            "value": 13.234016
          },
          {
            "date": "2026-09-28",
            "value": 13.226258
          }
        ]
      },
      {
        "symbol": "GBPGHS=X",
        "name": "Pound in cedis",
        "unit": "GH¢",
        "dec": 4,
        "value": 15.382527,
        "prev": 15.391106,
        "change": -0.008579,
        "pct": -0.06,
        "at": "2026-09-28T00:00:00.000Z",
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
          },
          {
            "date": "2026-09-24",
            "value": 15.331695
          },
          {
            "date": "2026-09-23",
            "value": 15.382479
          },
          {
            "date": "2026-09-24",
            "value": 15.331695
          },
          {
            "date": "2026-09-25",
            "value": 15.319158
          },
          {
            "date": "2026-09-26",
            "value": 15.387914
          },
          {
            "date": "2026-09-27",
            "value": 15.391106
          },
          {
            "date": "2026-09-28",
            "value": 15.382527
          }
        ]
      },
      {
        "symbol": "EURUSD=X",
        "name": "Euro in dollars",
        "unit": "US$",
        "dec": 4,
        "value": 1.1346,
        "prev": 1.1448,
        "change": -0.0102,
        "pct": -0.89,
        "at": "2026-09-29T18:41:59.000Z",
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
            "value": 1.138
          },
          {
            "date": "2026-09-25",
            "value": 1.1392
          },
          {
            "date": "2026-09-26",
            "value": 1.1401
          },
          {
            "date": "2026-09-27",
            "value": 1.1387
          },
          {
            "date": "2026-09-28",
            "value": 1.1374
          },
          {
            "date": "2026-09-29",
            "value": 1.1346
          }
        ]
      },
      {
        "symbol": "GBPUSD=X",
        "name": "Pound in dollars",
        "unit": "US$",
        "dec": 4,
        "value": 1.3235,
        "prev": 1.3343,
        "change": -0.0108,
        "pct": -0.81,
        "at": "2026-09-29T18:41:59.000Z",
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
            "value": 1.3214
          },
          {
            "date": "2026-09-25",
            "value": 1.3246
          },
          {
            "date": "2026-09-26",
            "value": 1.3246
          },
          {
            "date": "2026-09-27",
            "value": 1.3235
          },
          {
            "date": "2026-09-28",
            "value": 1.3254
          },
          {
            "date": "2026-09-29",
            "value": 1.3235
          }
        ]
      },
      {
        "symbol": "NGNGHS=X",
        "name": "Naira in cedis",
        "unit": "GH¢",
        "dec": 4,
        "value": 0.0087402552,
        "prev": 0.0087373361,
        "change": 0.0000029191,
        "pct": 0.03,
        "at": "2026-09-28T00:00:00.000Z",
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
          },
          {
            "date": "2026-09-24",
            "value": 0.0087322509
          },
          {
            "date": "2026-09-23",
            "value": 0.0087183859
          },
          {
            "date": "2026-09-24",
            "value": 0.0087322509
          },
          {
            "date": "2026-09-25",
            "value": 0.0087389157
          },
          {
            "date": "2026-09-26",
            "value": 0.0087392546
          },
          {
            "date": "2026-09-27",
            "value": 0.0087373361
          },
          {
            "date": "2026-09-28",
            "value": 0.0087402552
          }
        ]
      },
      {
        "symbol": "ZARGHS=X",
        "name": "Rand in cedis",
        "unit": "GH¢",
        "dec": 4,
        "value": 0.71004931,
        "prev": 0.71313894,
        "change": -0.00308963,
        "pct": -0.43,
        "at": "2026-09-28T00:00:00.000Z",
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
          },
          {
            "date": "2026-09-24",
            "value": 0.70721462
          },
          {
            "date": "2026-09-23",
            "value": 0.71320759
          },
          {
            "date": "2026-09-24",
            "value": 0.70721462
          },
          {
            "date": "2026-09-25",
            "value": 0.70585799
          },
          {
            "date": "2026-09-26",
            "value": 0.71222521
          },
          {
            "date": "2026-09-27",
            "value": 0.71313894
          },
          {
            "date": "2026-09-28",
            "value": 0.71004931
          }
        ]
      },
      {
        "symbol": "CNYGHS=X",
        "name": "Yuan in cedis",
        "unit": "GH¢",
        "dec": 4,
        "value": 1.7298255,
        "prev": 1.7299402,
        "change": -0.0001147,
        "pct": -0.01,
        "at": "2026-09-28T00:00:00.000Z",
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
          },
          {
            "date": "2026-09-24",
            "value": 1.7253322
          },
          {
            "date": "2026-09-23",
            "value": 1.722838
          },
          {
            "date": "2026-09-24",
            "value": 1.7253322
          },
          {
            "date": "2026-09-25",
            "value": 1.7273016
          },
          {
            "date": "2026-09-26",
            "value": 1.7305357
          },
          {
            "date": "2026-09-27",
            "value": 1.7299402
          },
          {
            "date": "2026-09-28",
            "value": 1.7298255
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

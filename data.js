/*
 * Alfredo Ghana Economic Data: figures entered and checked by people.
 * Edit values here, or use the "Record debt figures" / "Update a reading" workflows on GitHub,
 * which edit this file for you and open a pull request to review.
 * Money is in GH¢ unless a unit says otherwise. Debt readings are in GH¢ billion.
 * Field guide: see README.md ("data.js field guide").
 */
window.GDC_DATA = {
  "checked": "12 September 2026",
  "siteUrl": "",
  "fx": {
    "usd": 11.44,
    "gbp": 15.5,
    "eur": 13.31,
    "date": "2026-09-10"
  },
  "debt": {
    "paceMonths": 6,
    "staleAfterDays": 120,
    "readings": [
      {
        "date": "2025-12-31",
        "total": 641.111,
        "domestic": 333.756,
        "external": 307.355,
        "ratio": 44.7
      },
      {
        "date": "2026-01-31",
        "total": 663.4
      },
      {
        "date": "2026-02-28",
        "total": 674.1
      },
      {
        "date": "2026-03-31",
        "total": 686.1
      },
      {
        "date": "2026-04-30",
        "total": 695.9
      },
      {
        "date": "2026-05-31",
        "total": 720.8,
        "domestic": 379.1,
        "ratio": 45.1
      },
      {
        "date": "2026-06-30",
        "total": 719.52,
        "domestic": 391.115,
        "external": 328.405,
        "ratio": 45
      }
    ],
    "ratioPeak": {
      "value": 61.8,
      "label": "end-2024"
    },
    "nominalGdp": 1598930000000,
    "sinkingFund": {
      "value": 15600000000,
      "target": 30000000000,
      "date": "Jul 2026"
    },
    "maturities": [
      {
        "year": 2027,
        "value": 58000000000
      },
      {
        "year": 2028,
        "value": 53000000000
      }
    ]
  },
  "population": {
    "base": 34400000,
    "date": "2026-07-01T00:00:00Z",
    "growth": 0.021,
    "source": "National Population Council"
  },
  "budget": {
    "year": 2026,
    "in": [
      {
        "key": "rev",
        "label": "Revenue & grants",
        "value": 268100000000,
        "note": "H1 actual 7.8% of GDP vs 7.9% target"
      },
      {
        "key": "tax",
        "label": "Tax revenue",
        "sub": true,
        "value": 233400000000,
        "note": "Direct taxes GH¢115.4bn · goods & services GH¢86.4bn"
      },
      {
        "key": "oth",
        "label": "Non-tax revenue & grants",
        "sub": true,
        "value": 34700000000,
        "note": "Fees, oil proceeds, dividends and donor grants"
      }
    ],
    "out": [
      {
        "key": "exp",
        "label": "Total spending",
        "value": 302500000000,
        "note": "H1 actual GH¢143.7bn, 47.5% of plan"
      },
      {
        "key": "wage",
        "label": "Public sector wages",
        "value": 90800000000,
        "note": "H1 actual GH¢48.8bn"
      },
      {
        "key": "int",
        "label": "Interest on debt",
        "value": 57700000000,
        "note": "H1 domestic interest GH¢21.5bn",
        "cost": true
      },
      {
        "key": "cap",
        "label": "Capital projects",
        "value": 57500000000,
        "note": "Roads, schools, hospitals, rail"
      }
    ]
  },
  "benchmarks": {
    "minWageDaily": 21.77,
    "minWageDate": "1 Jan 2026",
    "allocations": [
      {
        "key": "fshs",
        "label": "Free SHS",
        "value": 4200000000
      },
      {
        "key": "feeding",
        "label": "School Feeding Programme",
        "value": 1980000000
      },
      {
        "key": "bigpush",
        "label": "Big Push roads and infrastructure",
        "value": 30000000000
      },
      {
        "key": "nhis",
        "label": "NHIS claims and primary healthcare",
        "value": 9000000000
      }
    ]
  },
  "people": [
    {
      "board": true,
      "label": "Unemployment rate",
      "value": 12.8,
      "dec": 1,
      "unit": "%",
      "note": "Average of Q1–Q3 2025 · Ghana Statistical Service",
      "status": [
        "warn",
        "High"
      ],
      "date": "Q1–Q3 2025",
      "maxAgeDays": 0
    },
    {
      "label": "Income per person",
      "value": 3385,
      "dec": 0,
      "unit": "US$",
      "pre": true,
      "note": "2025 · up US$850 on 2024",
      "status": [
        "good",
        "Rising"
      ],
      "date": "2025"
    },
    {
      "label": "Multidimensional poverty",
      "value": 21.9,
      "dec": 1,
      "unit": "%",
      "note": "Down from 24.9% · 950,000 people exited",
      "status": [
        "good",
        "Falling"
      ],
      "date": "2025"
    }
  ],
  "economy": [
    {
      "group": "Prices & interest rates",
      "items": [
        {
          "board": true,
          "label": "Inflation",
          "value": 5,
          "dec": 1,
          "unit": "%",
          "date": "Aug 2026",
          "note": "▲ from 4.6% · target 8 ± 2%",
          "tone": "bad",
          "status": [
            "good",
            "In target"
          ],
          "series": [
            {
              "date": "Jan 2026",
              "value": 3.8
            },
            {
              "date": "Feb 2026",
              "value": 3.3
            },
            {
              "date": "Mar 2026",
              "value": 3.2
            },
            {
              "date": "Apr 2026",
              "value": 3.4
            },
            {
              "date": "May 2026",
              "value": 3.7
            },
            {
              "date": "Jun 2026",
              "value": 5.3
            },
            {
              "date": "Jul 2026",
              "value": 4.6
            },
            {
              "date": "Aug 2026",
              "value": 5
            }
          ],
          "seriesSource": "Ghana Statistical Service monthly CPI releases"
        },
        {
          "label": "Food inflation",
          "value": 3,
          "dec": 1,
          "unit": "%",
          "date": "Aug 2026",
          "note": "▼ from 3.1% in July",
          "tone": "good"
        },
        {
          "label": "Non-food inflation",
          "value": 6.8,
          "dec": 1,
          "unit": "%",
          "date": "Aug 2026",
          "note": "▲ from 6.7% · rent, transport",
          "tone": "bad"
        },
        {
          "board": true,
          "label": "BoG policy rate",
          "value": 14,
          "dec": 1,
          "unit": "%",
          "date": "Jul 2026",
          "note": "Held at the 131st MPC meeting",
          "series": [
            {
              "date": "Sep 2025",
              "value": 21.5
            },
            {
              "date": "Dec 2025",
              "value": 18
            },
            {
              "date": "Jan 2026",
              "value": 15.5
            },
            {
              "date": "Mar 2026",
              "value": 14
            },
            {
              "date": "May 2026",
              "value": 14
            },
            {
              "date": "Jul 2026",
              "value": 14
            }
          ],
          "seriesSource": "Bank of Ghana MPC decisions"
        },
        {
          "board": true,
          "label": "91-day T-bill",
          "value": 4.8,
          "dec": 2,
          "unit": "%",
          "date": "7 Sep 2026",
          "note": "▼ 14 basis points · 182-day at 6.67%",
          "series": [
            {
              "date": "4 Sep 2026",
              "value": 6.68
            }
          ]
        },
        {
          "label": "364-day T-bill",
          "value": 10.11,
          "dec": 2,
          "unit": "%",
          "date": "7 Sep 2026",
          "note": "▼ 66 basis points · weekly government auction",
          "series": [
            {
              "date": "4 Sep 2026",
              "value": 12
            }
          ]
        },
        {
          "label": "Average lending rate",
          "value": 15.6,
          "dec": 1,
          "unit": "%",
          "date": "Jun 2026",
          "note": "▼ from 27% a year earlier",
          "tone": "good"
        },
        {
          "label": "Private credit growth",
          "value": 41.2,
          "dec": 1,
          "unit": "%",
          "date": "Jun 2026",
          "note": "34.1% after inflation"
        }
      ]
    },
    {
      "group": "Growth & external",
      "items": [
        {
          "board": true,
          "label": "Real GDP growth",
          "value": 6.4,
          "dec": 1,
          "unit": "%",
          "date": "Q1 2026",
          "note": "2026 target at least 4.8%",
          "status": [
            "good",
            "Strong"
          ]
        },
        {
          "board": true,
          "label": "Gross reserves",
          "value": 12.9,
          "dec": 1,
          "unit": "US$bn",
          "date": "Jun 2026",
          "note": "5 months of imports · ▼ from 13.8",
          "tone": "bad",
          "series": [
            {
              "date": "Dec 2024",
              "value": 8.98
            },
            {
              "date": "Dec 2025",
              "value": 13.8
            },
            {
              "date": "Jun 2026",
              "value": 12.9
            }
          ],
          "seriesSource": "Bank of Ghana reserve statements"
        },
        {
          "label": "Trade surplus",
          "value": 8.8,
          "dec": 1,
          "unit": "US$bn",
          "date": "H1 2026",
          "note": "US$5.8bn in H1 2025 · gold-led"
        },
        {
          "label": "Current account surplus",
          "value": 5.1,
          "dec": 1,
          "unit": "US$bn",
          "date": "H1 2026",
          "note": "US$4.1bn in H1 2025"
        }
      ]
    },
    {
      "group": "Cedi & output",
      "items": [
        {
          "board": true,
          "label": "US dollar",
          "value": 11.44,
          "dec": 2,
          "unit": "GH¢",
          "pre": true,
          "date": "10 Sep 2026",
          "note": "▲ cedi down 9.5% this year to 17 Jul",
          "tone": "bad",
          "auto": "fx.usd"
        },
        {
          "board": true,
          "label": "British pound",
          "value": 15.5,
          "dec": 2,
          "unit": "GH¢",
          "pre": true,
          "date": "10 Sep 2026",
          "note": "BoG interbank mid-rate",
          "auto": "fx.gbp"
        },
        {
          "board": true,
          "label": "Euro",
          "value": 13.31,
          "dec": 2,
          "unit": "GH¢",
          "pre": true,
          "date": "10 Sep 2026",
          "note": "BoG interbank mid-rate",
          "auto": "fx.eur"
        },
        {
          "label": "Nominal GDP",
          "value": 1599,
          "dec": 0,
          "unit": "GH¢bn",
          "date": "2026 proj.",
          "note": "Used for the live debt ratio"
        }
      ]
    }
  ],
  "ratings": [
    {
      "agency": "Fitch",
      "rating": "B",
      "outlook": "Positive",
      "date": "8 May 2026",
      "note": "Upgraded from B-",
      "scale": [
        "CCC",
        "CCC+",
        "B-",
        "B",
        "B+",
        "BB-",
        "BB",
        "BB+",
        "BBB-"
      ]
    },
    {
      "agency": "S&P Global",
      "rating": "B-",
      "outlook": "Stable",
      "date": "27 Mar 2026",
      "note": "Affirmed at B-",
      "scale": [
        "CCC",
        "CCC+",
        "B-",
        "B",
        "B+",
        "BB-",
        "BB",
        "BB+",
        "BBB-"
      ]
    },
    {
      "agency": "Moody’s",
      "rating": "Caa1",
      "outlook": "Positive",
      "date": "Apr 2026",
      "note": "Outlook raised to positive",
      "scale": [
        "Caa2",
        "Caa1",
        "B3",
        "B2",
        "B1",
        "Ba3",
        "Ba2",
        "Ba1",
        "Baa3"
      ]
    }
  ],
  "trade": {
    "period": "H1 2026",
    "totalExports": 18.2,
    "goldExports": 12.5
  },
  "markets": [
    {
      "group": "Gold, cocoa & oil",
      "items": [
        {
          "board": true,
          "label": "Gold price",
          "value": 4368,
          "dec": 0,
          "unit": "US$",
          "pre": true,
          "date": "10 Sep 2026",
          "note": "Per ounce · record US$5,597 on 29 Jan 2026",
          "auto": "gold.usdPerOz"
        },
        {
          "label": "Gold exports",
          "value": 12.5,
          "dec": 1,
          "unit": "US$bn",
          "date": "H1 2026",
          "note": "▲ from US$8.3bn in H1 2025",
          "tone": "good"
        },
        {
          "label": "BoG gold reserves",
          "value": 24.4,
          "dec": 1,
          "unit": "tonnes",
          "date": "Jun 2026",
          "note": "▲ from 18.6 tonnes at end-2025",
          "tone": "good"
        },
        {
          "label": "Jubilee oil output",
          "value": 95000,
          "dec": 0,
          "unit": "bpd",
          "date": "Jul 2026",
          "note": "Barrels a day · first rise after six years of decline"
        },
        {
          "board": true,
          "label": "Cocoa world price",
          "value": 5619,
          "dec": 0,
          "unit": "US$",
          "pre": true,
          "date": "10 Sep 2026",
          "note": "Per tonne, New York futures",
          "auto": "cocoa.usdPerTonne"
        },
        {
          "board": true,
          "label": "Cocoa farmgate price",
          "value": 2587,
          "dec": 0,
          "unit": "GH¢",
          "pre": true,
          "date": "Feb 2026",
          "note": "Per 64kg bag · a 6% rise is planned for 2026/27",
          "maxAgeDays": 260
        },
        {
          "label": "Cocoa exports",
          "value": 2.2,
          "dec": 1,
          "unit": "US$bn",
          "date": "H1 2026",
          "note": "US$2.1bn in H1 2025"
        },
        {
          "label": "Oil exports",
          "value": 1.7,
          "dec": 1,
          "unit": "US$bn",
          "date": "H1 2026",
          "note": "Crude oil export earnings"
        }
      ]
    },
    {
      "group": "Markets & money",
      "items": [
        {
          "board": true,
          "label": "GSE Composite Index",
          "value": 14724,
          "dec": 0,
          "unit": "pts",
          "date": "4 Sep 2026",
          "note": "▲ 67.9% so far in 2026",
          "tone": "good"
        },
        {
          "board": true,
          "label": "Business activity (PMI)",
          "value": 50.8,
          "dec": 1,
          "unit": "",
          "date": "Aug 2026",
          "note": "▲ from 49.2 · above 50 means growth",
          "tone": "good",
          "status": [
            "good",
            "Expanding"
          ]
        },
        {
          "board": true,
          "label": "Mobile money payments",
          "value": 492.9,
          "dec": 1,
          "unit": "GH¢bn",
          "date": "Jun 2026",
          "note": "In one month · up 52% on June 2025"
        },
        {
          "label": "Mobile money balances",
          "value": 40,
          "dec": 0,
          "unit": "GH¢bn",
          "date": "Jun 2026",
          "note": "Held in wallets · up from GH¢28.9bn"
        },
        {
          "label": "Active mobile money accounts",
          "value": 26.4,
          "dec": 1,
          "unit": "million",
          "date": "Jun 2026",
          "note": "84.6 million registered"
        },
        {
          "board": true,
          "label": "Remittances",
          "value": 3.65,
          "dec": 2,
          "unit": "US$bn",
          "date": "H1 2026",
          "note": "▼ from US$3.93bn in H1 2025",
          "tone": "bad"
        },
        {
          "label": "Bank bad-loan ratio",
          "value": 16.1,
          "dec": 1,
          "unit": "%",
          "date": "Jun 2026",
          "note": "▼ from 23.1% · BoG wants below 10%",
          "tone": "good"
        },
        {
          "label": "Bank lending growth",
          "value": 39.4,
          "dec": 1,
          "unit": "%",
          "date": "Jun 2026",
          "note": "Gross loans reached GH¢124.3bn"
        }
      ]
    },
    {
      "group": "Cost of living",
      "items": [
        {
          "board": true,
          "label": "Petrol",
          "value": 16.39,
          "dec": 2,
          "unit": "GH¢",
          "pre": true,
          "date": "1 Sep 2026",
          "note": "Per litre · projected average pump price"
        },
        {
          "board": true,
          "label": "Diesel",
          "value": 17.6,
          "dec": 2,
          "unit": "GH¢",
          "pre": true,
          "date": "1 Sep 2026",
          "note": "Per litre · projected average pump price"
        },
        {
          "label": "Cooking gas (LPG)",
          "value": 13.73,
          "dec": 2,
          "unit": "GH¢",
          "pre": true,
          "date": "1 Sep 2026",
          "note": "Per kg · ▼ 0.9% on the last window",
          "tone": "good"
        },
        {
          "label": "Daily minimum wage",
          "value": 21.77,
          "dec": 2,
          "unit": "GH¢",
          "pre": true,
          "date": "Jan 2026",
          "note": "▲ 9% from GH¢19.97",
          "tone": "good",
          "maxAgeDays": 400
        }
      ]
    },
    {
      "group": "Energy & fiscal risks",
      "items": [
        {
          "label": "Electricity tariff change",
          "value": 3.49,
          "dec": 2,
          "unit": "%",
          "date": "Jul 2026",
          "note": "▲ Q3 rise after a 4.81% cut in Q2 · water +0.85%",
          "tone": "bad",
          "maxAgeDays": 80
        },
        {
          "label": "Energy sector shortfall",
          "value": 1.1,
          "dec": 2,
          "unit": "US$bn",
          "date": "2026 proj.",
          "note": "Power US$925m · gas US$178m (IMF)"
        },
        {
          "label": "Eurobond payments due",
          "value": 1.5,
          "dec": 1,
          "unit": "US$bn",
          "date": "2026",
          "note": "Owed to Eurobond holders this year"
        },
        {
          "label": "Road arrears paid",
          "value": 23.1,
          "dec": 1,
          "unit": "GH¢bn",
          "date": "Jul 2026",
          "note": "Contractor arrears and Big Push payments"
        }
      ]
    }
  ],
  "cedi": [
    {
      "date": "2025-12-31",
      "label": "End-2025",
      "rate": 10.45
    },
    {
      "date": "2026-06-03",
      "label": "3 Jun 2026",
      "rate": 11.78
    },
    {
      "date": "2026-09-03",
      "label": "3 Sep 2026",
      "rate": 11.34
    },
    {
      "date": "2026-09-10",
      "label": "10 Sep 2026",
      "rate": 11.44
    }
  ],
  "cediNote": "Year-to-date loss against the dollar: 7.9% at end-June and 10.4% at end-July (Bank of Ghana).",
  "history": [
    {
      "k": "2020",
      "label": "End-2020",
      "debt": 315.1,
      "ratio": 80.4
    },
    {
      "k": "2021",
      "label": "End-2021",
      "debt": 362.5,
      "ratio": 78.5
    },
    {
      "k": "2022",
      "label": "End-2022",
      "debt": 448,
      "ratio": 72.9
    },
    {
      "k": "2023",
      "label": "End-2023",
      "debt": 610,
      "ratio": 68.7
    },
    {
      "k": "2024",
      "label": "End-2024",
      "debt": 726.7,
      "ratio": 61.8
    },
    {
      "k": "2025",
      "label": "End-2025",
      "debt": 641.1,
      "ratio": 44.7
    },
    {
      "k": "Jun ’26",
      "label": "End-June 2026",
      "debt": 719.5,
      "ratio": 45,
      "partial": true
    }
  ],
  "sources": [
    [
      "T-bills auction, 7 September 2026 (MyJoyOnline)",
      "https://www.myjoyonline.com/t-bills-auction-government-exceeds-target-by-51-interest-rates-fall-again/"
    ],
    [
      "Bank of Ghana debt data, June 2026 (MyJoyOnline)",
      "https://www.myjoyonline.com/domestic-debt-increased-by-gh%C2%A257bn-to-gh%C2%A2391bn-in-june-2026-total-public-debt-now-gh%C2%A2719-5bn/"
    ],
    [
      "Domestic and external split, Dec 2025 – Jun 2026 (Ourhomeland)",
      "https://ourhomelandghana.com/ghanas-public-debt-rises-gh%C2%A278-41bn-in-six-months/"
    ],
    [
      "Monthly debt, January – May 2026 (MyJoyOnline)",
      "https://www.myjoyonline.com/ghanas-public-debt-hits-gh%C2%A2720-8bn-in-may-2026/"
    ],
    [
      "2024 Annual Public Debt Report (Ministry of Finance)",
      "https://www.mofep.gov.gh/sites/default/files/reports/economic/2024-Annual-Public-Debt-Report.pdf"
    ],
    [
      "FY2026 budget fiscal tables (IC Africa)",
      "https://cms.ic.africa/wp-content/uploads/2025/11/17_11_25_Ghana_039_s_FY2026_Budget.pdf"
    ],
    [
      "2026 Mid-Year Budget Review figures (Citi Newsroom)",
      "https://www.citinewsroom.com/2026/07/12-economic-figures-that-matter-from-ghanas-2026-mid-year-budget-review/"
    ],
    [
      "Mid-Year Budget Review highlights (Ghana News Agency)",
      "https://gna.org.gh/2026/07/highlights-2026-mid-year-budget-review/"
    ],
    [
      "BoG July 2026 policy decision (Citi Newsroom)",
      "https://www.citinewsroom.com/2026/07/bog-holds-policy-rate-at-14-as-middle-east-conflict-fuels-inflation-risks/"
    ],
    [
      "August 2026 inflation, GSS (MyJoyOnline)",
      "https://www.myjoyonline.com/ghanas-inflation-rises-to-5-0-in-august-2026/"
    ],
    [
      "BoG exchange rates, 10 Sep 2026 (Pulse Ghana)",
      "https://www.pulse.com.gh/story/ghana-cedi-to-dollar-rate-september-10-2026091011114350179"
    ],
    [
      "Treasury bill auction, 4 Sep 2026 (Mansa Markets)",
      "https://www.mansamarkets.com/ghana/bonds"
    ],
    [
      "Unemployment Q1–Q3 2025, GSS (Citi Newsroom)",
      "https://citinewsroom.com/2025/12/unemployment-remains-elevated-at-12-8-in-first-three-quarters-of-2025/"
    ],
    [
      "2026 budget sectoral allocations (The High Street Journal)",
      "https://thehighstreetjournal.com/2026-budget-in-focus-key-sectoral-allocations/"
    ],
    [
      "2026 national daily minimum wage (WageIndicator)",
      "https://wageindicator.org/work/minimum-wage/updates/2026/minimum-wage-updated-in-ghana-from-1-january-2026-january-01-2026/"
    ],
    [
      "Gold price, 10 Sep 2026 (Forbes Advisor)",
      "https://www.forbes.com/advisor/investing/gold-price/"
    ],
    [
      "H1 2026 export earnings (MyJoyOnline)",
      "https://www.myjoyonline.com/gold-boom-pushes-ghanas-export-earnings-to-record-18-2bn-in-first-half-of-2026/"
    ],
    [
      "BoG gold reserves, June 2026 (TV BRICS)",
      "https://tvbrics.com/en/news/ghana-increases-gold-reserves-to-24-4-tonnes-in-first-half-of-2026/"
    ],
    [
      "Cocoa world and farmgate prices (Mansa Markets)",
      "https://www.mansamarkets.com/blog/cocoa-price-in-ghana-today"
    ],
    [
      "Planned 6% cocoa price rise (Bloomberg)",
      "https://www.bloomberg.com/news/articles/2026-09-09/ghana-plans-6-cocoa-price-hike-risking-more-ivorian-smuggling"
    ],
    [
      "Jubilee oil output (MyJoyOnline)",
      "https://www.myjoyonline.com/jubilee-field-crude-output-hits-95000-barrels-per-day-as-ghana-reverses-production-decline/"
    ],
    [
      "Fuel prices from 1 Sep 2026 (The Herald Ghana)",
      "https://theheraldghana.com/petrol-diesel-prices-go-up-today/"
    ],
    [
      "Fitch upgrade to B (GBC)",
      "https://www.gbcghanaonline.com/news/business/fitch-ghana-ato/2026/"
    ],
    [
      "S&P affirms B- (Daily Market Forces)",
      "https://dmarketforces.com/ghana-ratings-affirmed-at-b-b-outlook-remains-stable-sp/"
    ],
    [
      "Moody’s outlook to positive (Citi Newsroom)",
      "https://citinewsroom.com/2026/04/moodys-upgrades-ghanas-outlook-to-positive-affirms-caa1-rating/"
    ],
    [
      "GSE Composite Index (Citi Newsroom)",
      "https://www.citinewsroom.com/2026/09/ghana-stocks-soar-as-databank-projects-81-gain-for-2026/"
    ],
    [
      "Ghana PMI, August 2026 (Trading Economics)",
      "https://tradingeconomics.com/ghana/composite-pmi"
    ],
    [
      "Mobile money, June 2026 (MyJoyOnline)",
      "https://www.myjoyonline.com/mobile-money-transactions-hit-gh%C2%A2492-9bn-in-june/"
    ],
    [
      "Remittances, H1 2026 (MyJoyOnline)",
      "https://www.myjoyonline.com/remittances-drop-marginally-year-on-year-to-us3-65bn-in-half-year-2026/"
    ],
    [
      "Banking NPLs, June 2026 (MyJoyOnline)",
      "https://www.myjoyonline.com/banking-sector-npls-fall-to-gh%C2%A219-9bn-as-asset-quality-improves/"
    ],
    [
      "PURC Q3 2026 tariffs (Citi Newsroom)",
      "https://www.citinewsroom.com/2026/06/electricity-tariffs-up-3-49-water-0-85-effective-july-1/"
    ],
    [
      "Energy sector shortfall, IMF (MyJoyOnline)",
      "https://www.myjoyonline.com/energy-sector-shortfall-persists-to-balloon-to-us1-10bn-in-2026-imf/"
    ],
    [
      "Eurobond payments due in 2026 (Citi Newsroom)",
      "https://citinewsroom.com/2026/02/ghana-owes-1-5bn-to-eurobond-holders-in-2026-ato-forson/"
    ],
    [
      "Road contractor arrears paid (MyJoyOnline)",
      "https://www.myjoyonline.com/government-disburses-gh23-1-billion-to-clear-road-contractors-arrears-roads-minister/"
    ],
    [
      "Cedi at end-2025 (GhanaWeb)",
      "https://www.ghanaweb.com/GhanaHomePage/business/Cedi-ends-2025-selling-at-GH-10-45-to-the-dollar-on-the-interbank-market-2015786"
    ],
    [
      "Cedi on 3 Jun 2026 (ModernGhana)",
      "https://www.modernghana.com/news/1498896/june-3-cedi-depreciates-further-sells-at-ghs125.amp"
    ],
    [
      "Cedi year-to-date loss, July 2026 (The Ghana Report)",
      "https://theghanareport.com/business/cedi-depreciated-by-3-1-to-dollar-in-july-2026-increasing-year-to-date-loss-to-10-4/"
    ],
    [
      "2026 population projection, NPC (GhanaWeb)",
      "https://www.ghanaweb.com/GhanaHomePage/NewsArchive/Ghana-039-s-population-projected-to-reach-34-4-million-in-2026-NPC-2030087"
    ],
    [
      "Ministry of the Interior: statutory public holidays and commemorative days",
      "https://www.mint.gov.gh/statutory-public-holidays/"
    ],
    [
      "Bank of Ghana: MPC meeting dates",
      "https://www.bog.gov.gh/monetary-policy/mpc-meeting-dates/"
    ]
  ],
  "fxTicker": {
    "note": "GH¢ per unit of each currency. Bank of Ghana interbank mid-rates where published, market mid-rates otherwise.",
    "world": [
      {
        "code": "USD",
        "name": "US dollar",
        "unit": 1
      },
      {
        "code": "EUR",
        "name": "Euro",
        "unit": 1
      },
      {
        "code": "GBP",
        "name": "British pound",
        "unit": 1
      },
      {
        "code": "CNY",
        "name": "Chinese yuan",
        "unit": 1
      },
      {
        "code": "JPY",
        "name": "Japanese yen",
        "unit": 100
      },
      {
        "code": "CHF",
        "name": "Swiss franc",
        "unit": 1
      },
      {
        "code": "CAD",
        "name": "Canadian dollar",
        "unit": 1
      },
      {
        "code": "AUD",
        "name": "Australian dollar",
        "unit": 1
      },
      {
        "code": "AED",
        "name": "UAE dirham",
        "unit": 1
      },
      {
        "code": "INR",
        "name": "Indian rupee",
        "unit": 100
      },
      {
        "code": "SAR",
        "name": "Saudi riyal",
        "unit": 1
      }
    ],
    "africa": [
      {
        "code": "NGN",
        "name": "Nigerian naira",
        "unit": 1000
      },
      {
        "code": "XOF",
        "name": "West African CFA franc",
        "unit": 1000
      },
      {
        "code": "ZAR",
        "name": "South African rand",
        "unit": 1
      },
      {
        "code": "KES",
        "name": "Kenyan shilling",
        "unit": 100
      },
      {
        "code": "EGP",
        "name": "Egyptian pound",
        "unit": 10
      },
      {
        "code": "MAD",
        "name": "Moroccan dirham",
        "unit": 1
      },
      {
        "code": "XAF",
        "name": "Central African CFA franc",
        "unit": 1000
      },
      {
        "code": "TZS",
        "name": "Tanzanian shilling",
        "unit": 1000
      },
      {
        "code": "UGX",
        "name": "Ugandan shilling",
        "unit": 1000
      },
      {
        "code": "ETB",
        "name": "Ethiopian birr",
        "unit": 100
      },
      {
        "code": "RWF",
        "name": "Rwandan franc",
        "unit": 1000
      },
      {
        "code": "GMD",
        "name": "Gambian dalasi",
        "unit": 100
      },
      {
        "code": "SLL",
        "name": "Sierra Leonean leone (old)",
        "unit": 1000
      },
      {
        "code": "BWP",
        "name": "Botswana pula",
        "unit": 1
      }
    ]
  },
  "calendar": {
    "note": "Statutory holidays and commemorative days follow the Ministry of the Interior list. Islamic holidays are fixed by the Office of the Chief Imam, so dates marked “expected” move by a day or two. When a holiday falls on a weekend, government usually declares the following Monday.",
    "sourceTitle": "Ministry of the Interior: statutory public holidays and commemorative days",
    "sourceUrl": "https://www.mint.gov.gh/statutory-public-holidays/",
    "days": [
      {
        "name": "New Year's Day",
        "kind": "holiday",
        "rule": "fixed",
        "month": 1,
        "day": 1,
        "blurb": "Public holiday. Banks, the stock exchange and government offices are closed."
      },
      {
        "name": "Constitution Day",
        "kind": "holiday",
        "rule": "fixed",
        "month": 1,
        "day": 7,
        "since": 1993,
        "sinceWord": "years under the Fourth Republic",
        "blurb": "Marks the 1992 Constitution coming into force in 1993."
      },
      {
        "name": "Independence Day",
        "kind": "holiday",
        "rule": "fixed",
        "month": 3,
        "day": 6,
        "since": 1957,
        "sinceWord": "years of independence",
        "blurb": "Ghana became the first country in sub-Saharan Africa to win independence, on 6 March 1957."
      },
      {
        "name": "Good Friday",
        "kind": "holiday",
        "rule": "easter",
        "offset": -2,
        "blurb": "Public holiday."
      },
      {
        "name": "Easter Monday",
        "kind": "holiday",
        "rule": "easter",
        "offset": 1,
        "blurb": "Public holiday."
      },
      {
        "name": "Workers' Day",
        "kind": "holiday",
        "rule": "fixed",
        "month": 5,
        "day": 1,
        "blurb": "May Day. Public holiday, marked by the workers' parade and the Trades Union Congress address."
      },
      {
        "name": "African Union Day",
        "kind": "observance",
        "rule": "fixed",
        "month": 5,
        "day": 25,
        "since": 1963,
        "sinceWord": "years since the OAU was founded",
        "blurb": "Commemorative day, not a holiday: offices and markets stay open."
      },
      {
        "name": "Republic Day",
        "kind": "holiday",
        "rule": "fixed",
        "month": 7,
        "day": 1,
        "since": 1960,
        "sinceWord": "years as a republic",
        "blurb": "Ghana became a republic on 1 July 1960."
      },
      {
        "name": "Founder's Day",
        "kind": "holiday",
        "rule": "fixed",
        "month": 9,
        "day": 21,
        "since": 1909,
        "sinceWord": "years since Kwame Nkrumah's birth",
        "blurb": "Kwame Nkrumah's birthday, also kept as Kwame Nkrumah Memorial Day."
      },
      {
        "name": "Farmer's Day",
        "kind": "holiday",
        "rule": "nth-weekday",
        "month": 12,
        "weekday": 5,
        "nth": 1,
        "blurb": "The first Friday in December. National Best Farmer awards; cocoa and food crops take the stage."
      },
      {
        "name": "Christmas Day",
        "kind": "holiday",
        "rule": "fixed",
        "month": 12,
        "day": 25,
        "blurb": "Public holiday."
      },
      {
        "name": "Boxing Day",
        "kind": "holiday",
        "rule": "fixed",
        "month": 12,
        "day": 26,
        "blurb": "Public holiday."
      },
      {
        "name": "Eid-ul-Fitr",
        "kind": "holiday",
        "rule": "dates",
        "approx": true,
        "dates": [
          "2027-02-09",
          "2028-01-29"
        ],
        "blurb": "End of Ramadan. The date is announced by the Office of the Chief Imam."
      },
      {
        "name": "Eid-ul-Adha",
        "kind": "holiday",
        "rule": "dates",
        "approx": true,
        "dates": [
          "2027-04-17",
          "2028-04-05"
        ],
        "blurb": "Festival of sacrifice. The date is announced by the Office of the Chief Imam."
      },
      {
        "name": "Shaqq Day",
        "kind": "holiday",
        "rule": "dates",
        "approx": true,
        "dates": [],
        "blurb": "Public holiday announced alongside Eid by the Office of the Chief Imam."
      },
      {
        "name": "Bank of Ghana rate decision",
        "kind": "economic",
        "rule": "dates",
        "dates": [
          "2026-09-24",
          "2026-11-18"
        ],
        "blurb": "The Monetary Policy Committee announces the policy rate. Six meetings a year; the Bank publishes the dates in advance.",
        "sourceTitle": "Bank of Ghana: MPC meeting dates",
        "sourceUrl": "https://www.bog.gov.gh/monetary-policy/mpc-meeting-dates/"
      },
      {
        "name": "Budget statement",
        "kind": "economic",
        "rule": "fixed",
        "month": 11,
        "day": 13,
        "approx": true,
        "blurb": "The Finance Minister presents the budget to Parliament, usually in mid-November. Parliament sets the exact day.",
        "sourceTitle": "Parliament of Ghana",
        "sourceUrl": "https://www.parliament.gh/press"
      },
      {
        "name": "Inflation release",
        "kind": "economic",
        "rule": "monthly-weekday",
        "weekday": 3,
        "nth": 2,
        "approx": true,
        "blurb": "The Ghana Statistical Service publishes the Consumer Price Index for the previous month, usually mid-month.",
        "sourceTitle": "Ghana Statistical Service: CPI",
        "sourceUrl": "https://www.statsghana.gov.gh/releases/upcoming/cpi-release"
      }
    ]
  }
};

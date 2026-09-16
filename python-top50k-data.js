// Generated from the audited Top50k download-weighted summary.
window.PYTHON_TOP50K_COVERAGE = {
  "meta": {
    "generatedAt": "2026-09-15T14:43:55.559Z",
    "rankingSnapshotAt": "2026-09-15T08:40:09.045Z",
    "window": {
      "start": "2026-08-16",
      "endExclusive": "2026-09-15",
      "days": 30
    },
    "cutoff": 50000,
    "metric": "目录包名命中的下载量加权覆盖率",
    "formula": "同场景、Top50000内、已完成目录包名命中库的下载量之和 / 同场景、Top50000内全部库的下载量之和",
    "categoryPolicy": "沿用packages-classified.jsonl的唯一主标签；不按已完成目录旧标签重新分组，不重复计算辅助标签",
    "completionPolicy": "当前python-library-capabilities.js全部库名，包括适配和直接可用记录；PEP503归一化匹配",
    "changedMatchFlags": 0,
    "catalogNormalizedNames": 27248,
    "source": "ClickPy / PyPI download-log mirror; not independently verified against BigQuery",
    "provenance": {
      "rankingSha256": "7b71de8f8b68696158b09dccdb66b7244c5f44f0ae8d8e82fd60e9e3ccdd652d",
      "catalogSha256": "b52cea38d59a93787737c56c2ff49d1a6eef90c0458ebddef66c49776115db39",
      "classificationSha256": "3fbc6dde8055e9cbf6c416a39f3a36accaa8d4023db5006782c327d9dab7f17b"
    },
    "limitations": [
      "统计窗口为2026-08-16至2026-09-14 UTC；混合2026-08-24前后下载计数口径，镜像同步完整性及官方BigQuery对照未验证。",
      "下载计数包含自动化、CI及间接依赖，不能换算成用户数、项目数或实际场景端到端完成度。",
      "按分发包名命中，不核对版本/操作系统/架构；命中库的全部版本、全部平台下载均计入加权分子，并非鸿蒙平台实际下载量。",
      "主标签来自阶段分类，名称候选、多义及其他/待确认均保留；不代表每个包功能已经人工确认。",
      "仅覆盖Top50000分母，不是整个PyPI；其他/待确认保留在总量中，不因未分类而剔除。"
    ]
  },
  "total": {
    "packages": 50000,
    "matchedPackages": 12082,
    "totalDownloads": 139567021774,
    "matchedDownloads": 105369147867,
    "unmatchedDownloads": 34197873907,
    "downloadWeightedCoverage": 0.7549716725891278,
    "packageCoverage": 0.24164
  },
  "categories": [
    {
      "id": "domain",
      "label": "业务与行业组件",
      "packages": 832,
      "matchedPackages": 179,
      "totalDownloads": 354453757,
      "matchedDownloads": 234684501,
      "confidence": {
        "仅包名/关键词候选": {
          "packages": 370,
          "matchedPackages": 73,
          "totalDownloads": 159749042,
          "matchedDownloads": 138723406,
          "unmatchedDownloads": 21025636,
          "downloadWeightedCoverage": 0.8683833359075793,
          "packageCoverage": 0.1972972972972973
        },
        "功能元数据规则匹配": {
          "packages": 422,
          "matchedPackages": 100,
          "totalDownloads": 189579100,
          "matchedDownloads": 95370482,
          "unmatchedDownloads": 94208618,
          "downloadWeightedCoverage": 0.5030643251286666,
          "packageCoverage": 0.23696682464454977
        },
        "多义待复核": {
          "packages": 40,
          "matchedPackages": 6,
          "totalDownloads": 5125615,
          "matchedDownloads": 590613,
          "unmatchedDownloads": 4535002,
          "downloadWeightedCoverage": 0.11522773364757205,
          "packageCoverage": 0.15
        }
      },
      "topMissing": [
        {
          "rank": 708,
          "name": "holidays",
          "categoryId": "domain",
          "category": "业务与行业组件",
          "downloads": 27192148,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 1501,
          "name": "cuda-python",
          "categoryId": "domain",
          "category": "业务与行业组件",
          "downloads": 7330861,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 1651,
          "name": "eth-utils",
          "categoryId": "domain",
          "category": "业务与行业组件",
          "downloads": 6162695,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 1666,
          "name": "eth-hash",
          "categoryId": "domain",
          "category": "业务与行业组件",
          "downloads": 6075608,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 1673,
          "name": "eth-typing",
          "categoryId": "domain",
          "category": "业务与行业组件",
          "downloads": 6031803,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 1681,
          "name": "eth-abi",
          "categoryId": "domain",
          "category": "业务与行业组件",
          "downloads": 5988773,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 1776,
          "name": "eth-keyfile",
          "categoryId": "domain",
          "category": "业务与行业组件",
          "downloads": 5485541,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 1849,
          "name": "web3",
          "categoryId": "domain",
          "category": "业务与行业组件",
          "downloads": 5123905,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 2185,
          "name": "fhir-resources",
          "categoryId": "domain",
          "category": "业务与行业组件",
          "downloads": 3705130,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 2242,
          "name": "ccxt",
          "categoryId": "domain",
          "category": "业务与行业组件",
          "downloads": 3521131,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        }
      ],
      "topMatched": [
        {
          "rank": 434,
          "name": "zope-interface",
          "categoryId": "domain",
          "category": "业务与行业组件",
          "downloads": 51157097,
          "matched": true,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 569,
          "name": "stripe",
          "categoryId": "domain",
          "category": "业务与行业组件",
          "downloads": 36539506,
          "matched": true,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 573,
          "name": "gspread",
          "categoryId": "domain",
          "category": "业务与行业组件",
          "downloads": 36110078,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 746,
          "name": "zope-event",
          "categoryId": "domain",
          "category": "业务与行业组件",
          "downloads": 24943222,
          "matched": true,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 814,
          "name": "yfinance",
          "categoryId": "domain",
          "category": "业务与行业组件",
          "downloads": 21922515,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        }
      ],
      "unmatchedDownloads": 119769256,
      "downloadWeightedCoverage": 0.6621018859732385,
      "packageCoverage": 0.21514423076923078,
      "shareOfTop50kDownloads": 0.0025396669821755222
    },
    {
      "id": "agent-tui",
      "label": "Agent与TUI开发",
      "packages": 1149,
      "matchedPackages": 281,
      "totalDownloads": 6010328104,
      "matchedDownloads": 3438053625,
      "confidence": {
        "功能元数据规则匹配": {
          "packages": 466,
          "matchedPackages": 109,
          "totalDownloads": 3823684358,
          "matchedDownloads": 2531554180,
          "unmatchedDownloads": 1292130178,
          "downloadWeightedCoverage": 0.6620719554697093,
          "packageCoverage": 0.23390557939914164
        },
        "仅包名/关键词候选": {
          "packages": 483,
          "matchedPackages": 133,
          "totalDownloads": 1945272789,
          "matchedDownloads": 828920924,
          "unmatchedDownloads": 1116351865,
          "downloadWeightedCoverage": 0.4261206596253889,
          "packageCoverage": 0.2753623188405797
        },
        "多义待复核": {
          "packages": 200,
          "matchedPackages": 39,
          "totalDownloads": 241370957,
          "matchedDownloads": 77578521,
          "unmatchedDownloads": 163792436,
          "downloadWeightedCoverage": 0.32140785272687133,
          "packageCoverage": 0.195
        }
      },
      "topMissing": [
        {
          "rank": 102,
          "name": "openai",
          "categoryId": "agent-tui",
          "category": "Agent与TUI开发",
          "downloads": 324546965,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 110,
          "name": "colorama",
          "categoryId": "agent-tui",
          "category": "Agent与TUI开发",
          "downloads": 291692325,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 125,
          "name": "mcp",
          "categoryId": "agent-tui",
          "category": "Agent与TUI开发",
          "downloads": 251079021,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 157,
          "name": "prompt-toolkit",
          "categoryId": "agent-tui",
          "category": "Agent与TUI开发",
          "downloads": 192987969,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 158,
          "name": "langchain",
          "categoryId": "agent-tui",
          "category": "Agent与TUI开发",
          "downloads": 192609382,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 189,
          "name": "textual",
          "categoryId": "agent-tui",
          "category": "Agent与TUI开发",
          "downloads": 166421339,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 203,
          "name": "anthropic",
          "categoryId": "agent-tui",
          "category": "Agent与TUI开发",
          "downloads": 155691634,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 207,
          "name": "langchain-core",
          "categoryId": "agent-tui",
          "category": "Agent与TUI开发",
          "downloads": 154836813,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 236,
          "name": "pexpect",
          "categoryId": "agent-tui",
          "category": "Agent与TUI开发",
          "downloads": 134510908,
          "matched": false,
          "classificationConfidence": "多义待复核"
        },
        {
          "rank": 380,
          "name": "argcomplete",
          "categoryId": "agent-tui",
          "category": "Agent与TUI开发",
          "downloads": 62099700,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        }
      ],
      "topMatched": [
        {
          "rank": 20,
          "name": "click",
          "categoryId": "agent-tui",
          "category": "Agent与TUI开发",
          "downloads": 873433733,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 53,
          "name": "rich",
          "categoryId": "agent-tui",
          "category": "Agent与TUI开发",
          "downloads": 479271721,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 58,
          "name": "tqdm",
          "categoryId": "agent-tui",
          "category": "Agent与TUI开发",
          "downloads": 457554608,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 115,
          "name": "litellm",
          "categoryId": "agent-tui",
          "category": "Agent与TUI开发",
          "downloads": 275113050,
          "matched": true,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 120,
          "name": "typer",
          "categoryId": "agent-tui",
          "category": "Agent与TUI开发",
          "downloads": 267122629,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        }
      ],
      "unmatchedDownloads": 2572274479,
      "downloadWeightedCoverage": 0.5720242831189037,
      "packageCoverage": 0.24456048738033073,
      "shareOfTop50kDownloads": 0.0430640994384224
    },
    {
      "id": "foundation",
      "label": "开发基础库",
      "packages": 2478,
      "matchedPackages": 988,
      "totalDownloads": 35819186066,
      "matchedDownloads": 31763473349,
      "confidence": {
        "功能元数据规则匹配": {
          "packages": 1928,
          "matchedPackages": 779,
          "totalDownloads": 30838679728,
          "matchedDownloads": 27067934711,
          "unmatchedDownloads": 3770745017,
          "downloadWeightedCoverage": 0.8777267687767986,
          "packageCoverage": 0.404045643153527
        },
        "仅包名/关键词候选": {
          "packages": 323,
          "matchedPackages": 146,
          "totalDownloads": 4762346100,
          "matchedDownloads": 4504924153,
          "unmatchedDownloads": 257421947,
          "downloadWeightedCoverage": 0.9459464008716209,
          "packageCoverage": 0.4520123839009288
        },
        "多义待复核": {
          "packages": 227,
          "matchedPackages": 63,
          "totalDownloads": 218160238,
          "matchedDownloads": 190614485,
          "unmatchedDownloads": 27545753,
          "downloadWeightedCoverage": 0.8737361434304999,
          "packageCoverage": 0.2775330396475771
        }
      },
      "topMissing": [
        {
          "rank": 12,
          "name": "pygments",
          "categoryId": "foundation",
          "category": "开发基础库",
          "downloads": 1008309887,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 28,
          "name": "attrs",
          "categoryId": "foundation",
          "category": "开发基础库",
          "downloads": 741850881,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 77,
          "name": "zipp",
          "categoryId": "foundation",
          "category": "开发基础库",
          "downloads": 400093153,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 113,
          "name": "et-xmlfile",
          "categoryId": "foundation",
          "category": "开发基础库",
          "downloads": 286213140,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 124,
          "name": "wcwidth",
          "categoryId": "foundation",
          "category": "开发基础库",
          "downloads": 251694787,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 151,
          "name": "defusedxml",
          "categoryId": "foundation",
          "category": "开发基础库",
          "downloads": 201191512,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 194,
          "name": "cfgv",
          "categoryId": "foundation",
          "category": "开发基础库",
          "downloads": 164951284,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 201,
          "name": "toml",
          "categoryId": "foundation",
          "category": "开发基础库",
          "downloads": 156450324,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 232,
          "name": "deprecated",
          "categoryId": "foundation",
          "category": "开发基础库",
          "downloads": 138823467,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 265,
          "name": "babel",
          "categoryId": "foundation",
          "category": "开发基础库",
          "downloads": 110516600,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        }
      ],
      "topMatched": [
        {
          "rank": 3,
          "name": "typing-extensions",
          "categoryId": "foundation",
          "category": "开发基础库",
          "downloads": 1494435437,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 8,
          "name": "charset-normalizer",
          "categoryId": "foundation",
          "category": "开发基础库",
          "downloads": 1316202418,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 13,
          "name": "pluggy",
          "categoryId": "foundation",
          "category": "开发基础库",
          "downloads": 991211335,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 14,
          "name": "python-dateutil",
          "categoryId": "foundation",
          "category": "开发基础库",
          "downloads": 958635071,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 15,
          "name": "pyyaml",
          "categoryId": "foundation",
          "category": "开发基础库",
          "downloads": 956731264,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        }
      ],
      "unmatchedDownloads": 4055712717,
      "downloadWeightedCoverage": 0.8867726165098505,
      "packageCoverage": 0.3987086359967716,
      "shareOfTop50kDownloads": 0.25664505562067363
    },
    {
      "id": "cloud",
      "label": "云服务与DevOps",
      "packages": 2176,
      "matchedPackages": 348,
      "totalDownloads": 10309994071,
      "matchedDownloads": 4911545926,
      "confidence": {
        "功能元数据规则匹配": {
          "packages": 417,
          "matchedPackages": 125,
          "totalDownloads": 7400899097,
          "matchedDownloads": 3205239175,
          "unmatchedDownloads": 4195659922,
          "downloadWeightedCoverage": 0.4330878090608293,
          "packageCoverage": 0.2997601918465228
        },
        "仅包名/关键词候选": {
          "packages": 1697,
          "matchedPackages": 212,
          "totalDownloads": 2753597939,
          "matchedDownloads": 1700607953,
          "unmatchedDownloads": 1052989986,
          "downloadWeightedCoverage": 0.6175948670333458,
          "packageCoverage": 0.1249263406010607
        },
        "多义待复核": {
          "packages": 62,
          "matchedPackages": 11,
          "totalDownloads": 155497035,
          "matchedDownloads": 5698798,
          "unmatchedDownloads": 149798237,
          "downloadWeightedCoverage": 0.03664891745363505,
          "packageCoverage": 0.1774193548387097
        }
      },
      "topMissing": [
        {
          "rank": 1,
          "name": "boto3",
          "categoryId": "cloud",
          "category": "云服务与DevOps",
          "downloads": 2670818442,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 17,
          "name": "botocore",
          "categoryId": "cloud",
          "category": "云服务与DevOps",
          "downloads": 911505705,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 213,
          "name": "google-cloud-bigquery",
          "categoryId": "cloud",
          "category": "云服务与DevOps",
          "downloads": 150657998,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 240,
          "name": "execnet",
          "categoryId": "cloud",
          "category": "云服务与DevOps",
          "downloads": 132049545,
          "matched": false,
          "classificationConfidence": "多义待复核"
        },
        {
          "rank": 290,
          "name": "google-cloud-aiplatform",
          "categoryId": "cloud",
          "category": "云服务与DevOps",
          "downloads": 94079803,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 393,
          "name": "google-cloud-pubsub",
          "categoryId": "cloud",
          "category": "云服务与DevOps",
          "downloads": 59846036,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 431,
          "name": "google-cloud-logging",
          "categoryId": "cloud",
          "category": "云服务与DevOps",
          "downloads": 51333506,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 473,
          "name": "google-cloud-kms",
          "categoryId": "cloud",
          "category": "云服务与DevOps",
          "downloads": 46370039,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 496,
          "name": "google-cloud-compute",
          "categoryId": "cloud",
          "category": "云服务与DevOps",
          "downloads": 43409530,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 531,
          "name": "google-cloud-dlp",
          "categoryId": "cloud",
          "category": "云服务与DevOps",
          "downloads": 39625237,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        }
      ],
      "topMatched": [
        {
          "rank": 30,
          "name": "aiobotocore",
          "categoryId": "cloud",
          "category": "云服务与DevOps",
          "downloads": 712561227,
          "matched": true,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 31,
          "name": "s3transfer",
          "categoryId": "cloud",
          "category": "云服务与DevOps",
          "downloads": 684787572,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 64,
          "name": "ghapi",
          "categoryId": "cloud",
          "category": "云服务与DevOps",
          "downloads": 441583466,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 94,
          "name": "google-api-core",
          "categoryId": "cloud",
          "category": "云服务与DevOps",
          "downloads": 333421071,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 174,
          "name": "azure-core",
          "categoryId": "cloud",
          "category": "云服务与DevOps",
          "downloads": 176352776,
          "matched": true,
          "classificationConfidence": "仅包名/关键词候选"
        }
      ],
      "unmatchedDownloads": 5398448145,
      "downloadWeightedCoverage": 0.47638688171656857,
      "packageCoverage": 0.15992647058823528,
      "shareOfTop50kDownloads": 0.07387127660927599
    },
    {
      "id": "testing",
      "label": "测试与质量",
      "packages": 3172,
      "matchedPackages": 1649,
      "totalDownloads": 6462346239,
      "matchedDownloads": 4189669088,
      "confidence": {
        "功能元数据规则匹配": {
          "packages": 1117,
          "matchedPackages": 366,
          "totalDownloads": 3955637048,
          "matchedDownloads": 2333556751,
          "unmatchedDownloads": 1622080297,
          "downloadWeightedCoverage": 0.5899319686521451,
          "packageCoverage": 0.3276633840644584
        },
        "仅包名/关键词候选": {
          "packages": 1791,
          "matchedPackages": 1216,
          "totalDownloads": 2291409403,
          "matchedDownloads": 1755314051,
          "unmatchedDownloads": 536095352,
          "downloadWeightedCoverage": 0.7660412184317112,
          "packageCoverage": 0.6789503070910106
        },
        "多义待复核": {
          "packages": 264,
          "matchedPackages": 67,
          "totalDownloads": 215299788,
          "matchedDownloads": 100798286,
          "unmatchedDownloads": 114501502,
          "downloadWeightedCoverage": 0.46817642941664206,
          "packageCoverage": 0.2537878787878788
        }
      },
      "topMissing": [
        {
          "rank": 23,
          "name": "pytest",
          "categoryId": "testing",
          "category": "测试与质量",
          "downloads": 849581149,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 131,
          "name": "pytest-asyncio",
          "categoryId": "testing",
          "category": "测试与质量",
          "downloads": 232870593,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 188,
          "name": "pre-commit",
          "categoryId": "testing",
          "category": "测试与质量",
          "downloads": 166551645,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 221,
          "name": "pytest-json-ctrf",
          "categoryId": "testing",
          "category": "测试与质量",
          "downloads": 144213996,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 281,
          "name": "isort",
          "categoryId": "testing",
          "category": "测试与质量",
          "downloads": 101385375,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 312,
          "name": "pytest-timeout",
          "categoryId": "testing",
          "category": "测试与质量",
          "downloads": 83108535,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 357,
          "name": "beartype",
          "categoryId": "testing",
          "category": "测试与质量",
          "downloads": 69185363,
          "matched": false,
          "classificationConfidence": "多义待复核"
        },
        {
          "rank": 445,
          "name": "py",
          "categoryId": "testing",
          "category": "测试与质量",
          "downloads": 49855095,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 505,
          "name": "pylint",
          "categoryId": "testing",
          "category": "测试与质量",
          "downloads": 42587642,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 535,
          "name": "ty",
          "categoryId": "testing",
          "category": "测试与质量",
          "downloads": 38994443,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        }
      ],
      "topMatched": [
        {
          "rank": 109,
          "name": "ruff",
          "categoryId": "testing",
          "category": "测试与质量",
          "downloads": 294406788,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 112,
          "name": "coverage",
          "categoryId": "testing",
          "category": "测试与质量",
          "downloads": 287344465,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 119,
          "name": "mypy-extensions",
          "categoryId": "testing",
          "category": "测试与质量",
          "downloads": 268300774,
          "matched": true,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 147,
          "name": "pytest-cov",
          "categoryId": "testing",
          "category": "测试与质量",
          "downloads": 205938371,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 192,
          "name": "mypy",
          "categoryId": "testing",
          "category": "测试与质量",
          "downloads": 165431265,
          "matched": true,
          "classificationConfidence": "仅包名/关键词候选"
        }
      ],
      "unmatchedDownloads": 2272677151,
      "downloadWeightedCoverage": 0.6483201198220416,
      "packageCoverage": 0.5198612862547288,
      "shareOfTop50kDownloads": 0.04630281678908673
    },
    {
      "id": "ai",
      "label": "AI与机器学习",
      "packages": 2062,
      "matchedPackages": 216,
      "totalDownloads": 3297724712,
      "matchedDownloads": 1771066597,
      "confidence": {
        "功能元数据规则匹配": {
          "packages": 1399,
          "matchedPackages": 147,
          "totalDownloads": 2787138800,
          "matchedDownloads": 1590819020,
          "unmatchedDownloads": 1196319780,
          "downloadWeightedCoverage": 0.5707713659613938,
          "packageCoverage": 0.10507505360972123
        },
        "仅包名/关键词候选": {
          "packages": 246,
          "matchedPackages": 29,
          "totalDownloads": 327172203,
          "matchedDownloads": 90846740,
          "unmatchedDownloads": 236325463,
          "downloadWeightedCoverage": 0.2776725503174853,
          "packageCoverage": 0.11788617886178862
        },
        "多义待复核": {
          "packages": 417,
          "matchedPackages": 40,
          "totalDownloads": 183413709,
          "matchedDownloads": 89400837,
          "unmatchedDownloads": 94012872,
          "downloadWeightedCoverage": 0.4874272347875589,
          "packageCoverage": 0.09592326139088729
        }
      },
      "topMissing": [
        {
          "rank": 264,
          "name": "ipython",
          "categoryId": "ai",
          "category": "AI与机器学习",
          "downloads": 111998645,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 278,
          "name": "datasets",
          "categoryId": "ai",
          "category": "AI与机器学习",
          "downloads": 102904836,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 444,
          "name": "triton",
          "categoryId": "ai",
          "category": "AI与机器学习",
          "downloads": 49887571,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 579,
          "name": "strands-agents",
          "categoryId": "ai",
          "category": "AI与机器学习",
          "downloads": 35027004,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 608,
          "name": "nvidia-nccl-cu13",
          "categoryId": "ai",
          "category": "AI与机器学习",
          "downloads": 33217139,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 618,
          "name": "nvidia-nccl-cu12",
          "categoryId": "ai",
          "category": "AI与机器学习",
          "downloads": 32510219,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 637,
          "name": "nvidia-cudnn-cu13",
          "categoryId": "ai",
          "category": "AI与机器学习",
          "downloads": 31190303,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 658,
          "name": "nvidia-cublas",
          "categoryId": "ai",
          "category": "AI与机器学习",
          "downloads": 30059794,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 670,
          "name": "nvidia-nvjitlink",
          "categoryId": "ai",
          "category": "AI与机器学习",
          "downloads": 29610201,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 671,
          "name": "nvidia-cusparselt-cu13",
          "categoryId": "ai",
          "category": "AI与机器学习",
          "downloads": 29509405,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        }
      ],
      "topMatched": [
        {
          "rank": 106,
          "name": "huggingface-hub",
          "categoryId": "ai",
          "category": "AI与机器学习",
          "downloads": 304450582,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 140,
          "name": "hf-xet",
          "categoryId": "ai",
          "category": "AI与机器学习",
          "downloads": 213858628,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 152,
          "name": "scikit-learn",
          "categoryId": "ai",
          "category": "AI与机器学习",
          "downloads": 200394542,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 160,
          "name": "tokenizers",
          "categoryId": "ai",
          "category": "AI与机器学习",
          "downloads": 189114967,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 252,
          "name": "transformers",
          "categoryId": "ai",
          "category": "AI与机器学习",
          "downloads": 123167476,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        }
      ],
      "unmatchedDownloads": 1526658115,
      "downloadWeightedCoverage": 0.5370571383825079,
      "packageCoverage": 0.10475266731328807,
      "shareOfTop50kDownloads": 0.02362825164629496
    },
    {
      "id": "network",
      "label": "网络与协议",
      "packages": 1151,
      "matchedPackages": 353,
      "totalDownloads": 14002456494,
      "matchedDownloads": 12632075050,
      "confidence": {
        "功能元数据规则匹配": {
          "packages": 811,
          "matchedPackages": 236,
          "totalDownloads": 13098960919,
          "matchedDownloads": 11889459752,
          "unmatchedDownloads": 1209501167,
          "downloadWeightedCoverage": 0.9076643426544145,
          "packageCoverage": 0.2909987669543773
        },
        "仅包名/关键词候选": {
          "packages": 111,
          "matchedPackages": 40,
          "totalDownloads": 696846859,
          "matchedDownloads": 551601841,
          "unmatchedDownloads": 145245018,
          "downloadWeightedCoverage": 0.7915682389550671,
          "packageCoverage": 0.36036036036036034
        },
        "多义待复核": {
          "packages": 229,
          "matchedPackages": 77,
          "totalDownloads": 206648716,
          "matchedDownloads": 191013457,
          "unmatchedDownloads": 15635259,
          "downloadWeightedCoverage": 0.9243389491953098,
          "packageCoverage": 0.33624454148471616
        }
      },
      "topMissing": [
        {
          "rank": 129,
          "name": "dnspython",
          "categoryId": "network",
          "category": "网络与协议",
          "downloads": 241057634,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 153,
          "name": "httpx2",
          "categoryId": "network",
          "category": "网络与协议",
          "downloads": 200189571,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 156,
          "name": "httpcore2",
          "categoryId": "network",
          "category": "网络与协议",
          "downloads": 197748778,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 229,
          "name": "backoff",
          "categoryId": "network",
          "category": "网络与协议",
          "downloads": 140380348,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 231,
          "name": "google-api-python-client",
          "categoryId": "network",
          "category": "网络与协议",
          "downloads": 139704774,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 370,
          "name": "requests-file",
          "categoryId": "network",
          "category": "网络与协议",
          "downloads": 64808483,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 577,
          "name": "aiohttp-retry",
          "categoryId": "network",
          "category": "网络与协议",
          "downloads": 35439010,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 586,
          "name": "grpcio-health-checking",
          "categoryId": "network",
          "category": "网络与协议",
          "downloads": 34662766,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 677,
          "name": "trio-websocket",
          "categoryId": "network",
          "category": "网络与协议",
          "downloads": 29334336,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 680,
          "name": "jupyter-lsp",
          "categoryId": "network",
          "category": "网络与协议",
          "downloads": 28916339,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        }
      ],
      "topMatched": [
        {
          "rank": 4,
          "name": "idna",
          "categoryId": "network",
          "category": "网络与协议",
          "downloads": 1460558251,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 6,
          "name": "urllib3",
          "categoryId": "network",
          "category": "网络与协议",
          "downloads": 1426075169,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 7,
          "name": "requests",
          "categoryId": "network",
          "category": "网络与协议",
          "downloads": 1338007483,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 27,
          "name": "h11",
          "categoryId": "network",
          "category": "网络与协议",
          "downloads": 758758059,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 34,
          "name": "httpx",
          "categoryId": "network",
          "category": "网络与协议",
          "downloads": 654841826,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        }
      ],
      "unmatchedDownloads": 1370381444,
      "downloadWeightedCoverage": 0.9021327833021868,
      "packageCoverage": 0.30668983492615115,
      "shareOfTop50kDownloads": 0.10032783042883935
    },
    {
      "id": "backend",
      "label": "后端开发库",
      "packages": 2956,
      "matchedPackages": 691,
      "totalDownloads": 3662498055,
      "matchedDownloads": 1908628069,
      "confidence": {
        "功能元数据规则匹配": {
          "packages": 2015,
          "matchedPackages": 468,
          "totalDownloads": 3091770508,
          "matchedDownloads": 1485408142,
          "unmatchedDownloads": 1606362366,
          "downloadWeightedCoverage": 0.4804393269670195,
          "packageCoverage": 0.23225806451612904
        },
        "多义待复核": {
          "packages": 321,
          "matchedPackages": 65,
          "totalDownloads": 300906899,
          "matchedDownloads": 228239016,
          "unmatchedDownloads": 72667883,
          "downloadWeightedCoverage": 0.7585037656448016,
          "packageCoverage": 0.20249221183800623
        },
        "仅包名/关键词候选": {
          "packages": 620,
          "matchedPackages": 158,
          "totalDownloads": 269820648,
          "matchedDownloads": 194980911,
          "unmatchedDownloads": 74839737,
          "downloadWeightedCoverage": 0.7226315422680328,
          "packageCoverage": 0.25483870967741934
        }
      },
      "topMissing": [
        {
          "rank": 47,
          "name": "starlette",
          "categoryId": "backend",
          "category": "后端开发库",
          "downloads": 513190529,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 71,
          "name": "fastapi",
          "categoryId": "backend",
          "category": "后端开发库",
          "downloads": 417907367,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 205,
          "name": "flask",
          "categoryId": "backend",
          "category": "后端开发库",
          "downloads": 155342304,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 482,
          "name": "celery",
          "categoryId": "backend",
          "category": "后端开发库",
          "downloads": 45679800,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 498,
          "name": "django",
          "categoryId": "backend",
          "category": "后端开发库",
          "downloads": 43370464,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 551,
          "name": "fastapi-cloud-cli",
          "categoryId": "backend",
          "category": "后端开发库",
          "downloads": 37822310,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 763,
          "name": "djangorestframework",
          "categoryId": "backend",
          "category": "后端开发库",
          "downloads": 24344732,
          "matched": false,
          "classificationConfidence": "多义待复核"
        },
        {
          "rank": 787,
          "name": "openapi-spec-validator",
          "categoryId": "backend",
          "category": "后端开发库",
          "downloads": 23326557,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 838,
          "name": "slowapi",
          "categoryId": "backend",
          "category": "后端开发库",
          "downloads": 21183812,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 902,
          "name": "django-cors-headers",
          "categoryId": "backend",
          "category": "后端开发库",
          "downloads": 18834643,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        }
      ],
      "topMatched": [
        {
          "rank": 46,
          "name": "uvicorn",
          "categoryId": "backend",
          "category": "后端开发库",
          "downloads": 514816310,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 148,
          "name": "werkzeug",
          "categoryId": "backend",
          "category": "后端开发库",
          "downloads": 205347863,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 247,
          "name": "asgiref",
          "categoryId": "backend",
          "category": "后端开发库",
          "downloads": 126608848,
          "matched": true,
          "classificationConfidence": "多义待复核"
        },
        {
          "rank": 267,
          "name": "gunicorn",
          "categoryId": "backend",
          "category": "后端开发库",
          "downloads": 108909680,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 275,
          "name": "tornado",
          "categoryId": "backend",
          "category": "后端开发库",
          "downloads": 103559989,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        }
      ],
      "unmatchedDownloads": 1753869986,
      "downloadWeightedCoverage": 0.5211273945645822,
      "packageCoverage": 0.2337618403247632,
      "shareOfTop50kDownloads": 0.026241858631408356
    },
    {
      "id": "data",
      "label": "数据处理与可视化",
      "packages": 812,
      "matchedPackages": 140,
      "totalDownloads": 2618758351,
      "matchedDownloads": 1696150614,
      "confidence": {
        "功能元数据规则匹配": {
          "packages": 293,
          "matchedPackages": 57,
          "totalDownloads": 1650295315,
          "matchedDownloads": 1338246702,
          "unmatchedDownloads": 312048613,
          "downloadWeightedCoverage": 0.8109134709626198,
          "packageCoverage": 0.1945392491467577
        },
        "多义待复核": {
          "packages": 86,
          "matchedPackages": 14,
          "totalDownloads": 211673506,
          "matchedDownloads": 51215157,
          "unmatchedDownloads": 160458349,
          "downloadWeightedCoverage": 0.2419535536960398,
          "packageCoverage": 0.16279069767441862
        },
        "仅包名/关键词候选": {
          "packages": 433,
          "matchedPackages": 69,
          "totalDownloads": 756789530,
          "matchedDownloads": 306688755,
          "unmatchedDownloads": 450100775,
          "downloadWeightedCoverage": 0.4052497330400435,
          "packageCoverage": 0.15935334872979215
        }
      },
      "topMissing": [
        {
          "rank": 190,
          "name": "tabulate",
          "categoryId": "data",
          "category": "数据处理与可视化",
          "downloads": 166182398,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 249,
          "name": "narwhals",
          "categoryId": "data",
          "category": "数据处理与可视化",
          "downloads": 125872355,
          "matched": false,
          "classificationConfidence": "多义待复核"
        },
        {
          "rank": 451,
          "name": "pyarrow-hotfix",
          "categoryId": "data",
          "category": "数据处理与可视化",
          "downloads": 48853151,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 518,
          "name": "dbt-core",
          "categoryId": "data",
          "category": "数据处理与可视化",
          "downloads": 41363290,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 533,
          "name": "graphviz",
          "categoryId": "data",
          "category": "数据处理与可视化",
          "downloads": 39128387,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 663,
          "name": "seaborn",
          "categoryId": "data",
          "category": "数据处理与可视化",
          "downloads": 29772807,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 719,
          "name": "pandas-stubs",
          "categoryId": "data",
          "category": "数据处理与可视化",
          "downloads": 26653618,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 762,
          "name": "dask",
          "categoryId": "data",
          "category": "数据处理与可视化",
          "downloads": 24375853,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 774,
          "name": "agate",
          "categoryId": "data",
          "category": "数据处理与可视化",
          "downloads": 23959880,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 783,
          "name": "apache-airflow-providers-common-sql",
          "categoryId": "data",
          "category": "数据处理与可视化",
          "downloads": 23481147,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        }
      ],
      "topMatched": [
        {
          "rank": 41,
          "name": "pandas",
          "categoryId": "data",
          "category": "数据处理与可视化",
          "downloads": 578695924,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 89,
          "name": "pyarrow",
          "categoryId": "data",
          "category": "数据处理与可视化",
          "downloads": 351985787,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 180,
          "name": "matplotlib",
          "categoryId": "data",
          "category": "数据处理与可视化",
          "downloads": 172961547,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 287,
          "name": "matplotlib-inline",
          "categoryId": "data",
          "category": "数据处理与可视化",
          "downloads": 96724742,
          "matched": true,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 408,
          "name": "polars",
          "categoryId": "data",
          "category": "数据处理与可视化",
          "downloads": 56393020,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        }
      ],
      "unmatchedDownloads": 922607737,
      "downloadWeightedCoverage": 0.6476926797588282,
      "packageCoverage": 0.1724137931034483,
      "shareOfTop50kDownloads": 0.01876344653424316
    },
    {
      "id": "database",
      "label": "数据库与存储",
      "packages": 1153,
      "matchedPackages": 268,
      "totalDownloads": 3335190099,
      "matchedDownloads": 2546011114,
      "confidence": {
        "功能元数据规则匹配": {
          "packages": 820,
          "matchedPackages": 196,
          "totalDownloads": 2934739729,
          "matchedDownloads": 2293003195,
          "unmatchedDownloads": 641736534,
          "downloadWeightedCoverage": 0.7813310231027987,
          "packageCoverage": 0.23902439024390243
        },
        "多义待复核": {
          "packages": 218,
          "matchedPackages": 49,
          "totalDownloads": 263196448,
          "matchedDownloads": 167880490,
          "unmatchedDownloads": 95315958,
          "downloadWeightedCoverage": 0.6378524150903435,
          "packageCoverage": 0.22477064220183487
        },
        "仅包名/关键词候选": {
          "packages": 115,
          "matchedPackages": 23,
          "totalDownloads": 137253922,
          "matchedDownloads": 85127429,
          "unmatchedDownloads": 52126493,
          "downloadWeightedCoverage": 0.620218553754697,
          "packageCoverage": 0.2
        }
      },
      "topMissing": [
        {
          "rank": 251,
          "name": "psycopg",
          "categoryId": "database",
          "category": "数据库与存储",
          "downloads": 123558349,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 259,
          "name": "psycopg-binary",
          "categoryId": "database",
          "category": "数据库与存储",
          "downloads": 118127501,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 441,
          "name": "portalocker",
          "categoryId": "database",
          "category": "数据库与存储",
          "downloads": 50175286,
          "matched": false,
          "classificationConfidence": "多义待复核"
        },
        {
          "rank": 495,
          "name": "pg8000",
          "categoryId": "database",
          "category": "数据库与存储",
          "downloads": 43535627,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 567,
          "name": "fakeredis",
          "categoryId": "database",
          "category": "数据库与存储",
          "downloads": 36756691,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 572,
          "name": "psycopg-pool",
          "categoryId": "database",
          "category": "数据库与存储",
          "downloads": 36127877,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 591,
          "name": "mysql-connector-python",
          "categoryId": "database",
          "category": "数据库与存储",
          "downloads": 34112861,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 627,
          "name": "weaviate-client",
          "categoryId": "database",
          "category": "数据库与存储",
          "downloads": 31669434,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 722,
          "name": "sqlalchemy-bigquery",
          "categoryId": "database",
          "category": "数据库与存储",
          "downloads": 26475194,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 751,
          "name": "postgrest",
          "categoryId": "database",
          "category": "数据库与存储",
          "downloads": 24877562,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        }
      ],
      "topMatched": [
        {
          "rank": 91,
          "name": "sqlalchemy",
          "categoryId": "database",
          "category": "数据库与存储",
          "downloads": 344980699,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 134,
          "name": "psycopg2-binary",
          "categoryId": "database",
          "category": "数据库与存储",
          "downloads": 220451987,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 145,
          "name": "redis",
          "categoryId": "database",
          "category": "数据库与存储",
          "downloads": 207549578,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 164,
          "name": "alembic",
          "categoryId": "database",
          "category": "数据库与存储",
          "downloads": 185977882,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 181,
          "name": "gitdb",
          "categoryId": "database",
          "category": "数据库与存储",
          "downloads": 172530446,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        }
      ],
      "unmatchedDownloads": 789178985,
      "downloadWeightedCoverage": 0.7633781099204444,
      "packageCoverage": 0.23243712055507373,
      "shareOfTop50kDownloads": 0.0238966917586065
    },
    {
      "id": "observability",
      "label": "日志与可观测性",
      "packages": 657,
      "matchedPackages": 247,
      "totalDownloads": 4546958316,
      "matchedDownloads": 3664820437,
      "confidence": {
        "功能元数据规则匹配": {
          "packages": 478,
          "matchedPackages": 207,
          "totalDownloads": 4237718858,
          "matchedDownloads": 3589283724,
          "unmatchedDownloads": 648435134,
          "downloadWeightedCoverage": 0.8469848624394044,
          "packageCoverage": 0.4330543933054393
        },
        "仅包名/关键词候选": {
          "packages": 81,
          "matchedPackages": 17,
          "totalDownloads": 222011802,
          "matchedDownloads": 8842753,
          "unmatchedDownloads": 213169049,
          "downloadWeightedCoverage": 0.03983010326631194,
          "packageCoverage": 0.20987654320987653
        },
        "多义待复核": {
          "packages": 98,
          "matchedPackages": 23,
          "totalDownloads": 87227656,
          "matchedDownloads": 66693960,
          "unmatchedDownloads": 20533696,
          "downloadWeightedCoverage": 0.7645964944879409,
          "packageCoverage": 0.23469387755102042
        }
      },
      "topMissing": [
        {
          "rank": 121,
          "name": "opentelemetry-proto",
          "categoryId": "observability",
          "category": "日志与可观测性",
          "downloads": 259501549,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 237,
          "name": "sentry-sdk",
          "categoryId": "observability",
          "category": "日志与可观测性",
          "downloads": 134013071,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 432,
          "name": "datadog",
          "categoryId": "observability",
          "category": "日志与可观测性",
          "downloads": 51305215,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 484,
          "name": "opentelemetry-instrumentation-httpx",
          "categoryId": "observability",
          "category": "日志与可观测性",
          "downloads": 45274506,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 553,
          "name": "coloredlogs",
          "categoryId": "observability",
          "category": "日志与可观测性",
          "downloads": 37761010,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 615,
          "name": "opentelemetry-instrumentation-psycopg2",
          "categoryId": "observability",
          "category": "日志与可观测性",
          "downloads": 32571935,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 688,
          "name": "opentelemetry-instrumentation-sqlalchemy",
          "categoryId": "observability",
          "category": "日志与可观测性",
          "downloads": 28646064,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 795,
          "name": "opentelemetry-instrumentation-aiohttp-client",
          "categoryId": "observability",
          "category": "日志与可观测性",
          "downloads": 22834503,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 798,
          "name": "langfuse",
          "categoryId": "observability",
          "category": "日志与可观测性",
          "downloads": 22782609,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 870,
          "name": "opentelemetry-instrumentation-redis",
          "categoryId": "observability",
          "category": "日志与可观测性",
          "downloads": 19789181,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        }
      ],
      "topMatched": [
        {
          "rank": 79,
          "name": "opentelemetry-api",
          "categoryId": "observability",
          "category": "日志与可观测性",
          "downloads": 398021145,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 86,
          "name": "opentelemetry-semantic-conventions",
          "categoryId": "observability",
          "category": "日志与可观测性",
          "downloads": 370217416,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 104,
          "name": "opentelemetry-sdk",
          "categoryId": "observability",
          "category": "日志与可观测性",
          "downloads": 313123642,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 133,
          "name": "opentelemetry-exporter-otlp-proto-common",
          "categoryId": "observability",
          "category": "日志与可观测性",
          "downloads": 225745339,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 135,
          "name": "opentelemetry-exporter-otlp-proto-http",
          "categoryId": "observability",
          "category": "日志与可观测性",
          "downloads": 219822258,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        }
      ],
      "unmatchedDownloads": 882137879,
      "downloadWeightedCoverage": 0.80599384958162,
      "packageCoverage": 0.3759512937595129,
      "shareOfTop50kDownloads": 0.03257903090719282
    },
    {
      "id": "other",
      "label": "其他/待确认",
      "packages": 25358,
      "matchedPackages": 5291,
      "totalDownloads": 20737340130,
      "matchedDownloads": 15014699434,
      "confidence": {
        "待确认": {
          "packages": 25358,
          "matchedPackages": 5291,
          "totalDownloads": 20737340130,
          "matchedDownloads": 15014699434,
          "unmatchedDownloads": 5722640696,
          "downloadWeightedCoverage": 0.7240417208703998,
          "packageCoverage": 0.20865210190078082
        }
      },
      "topMissing": [
        {
          "rank": 128,
          "name": "distlib",
          "categoryId": "other",
          "category": "其他/待确认",
          "downloads": 244401308,
          "matched": false,
          "classificationConfidence": "待确认"
        },
        {
          "rank": 143,
          "name": "truststore",
          "categoryId": "other",
          "category": "其他/待确认",
          "downloads": 211974250,
          "matched": false,
          "classificationConfidence": "待确认"
        },
        {
          "rank": 171,
          "name": "joblib",
          "categoryId": "other",
          "category": "其他/待确认",
          "downloads": 180245615,
          "matched": false,
          "classificationConfidence": "待确认"
        },
        {
          "rank": 173,
          "name": "google-genai",
          "categoryId": "other",
          "category": "其他/待确认",
          "downloads": 177160714,
          "matched": false,
          "classificationConfidence": "待确认"
        },
        {
          "rank": 294,
          "name": "pure-eval",
          "categoryId": "other",
          "category": "其他/待确认",
          "downloads": 93533111,
          "matched": false,
          "classificationConfidence": "待确认"
        },
        {
          "rank": 296,
          "name": "vcs-versioning",
          "categoryId": "other",
          "category": "其他/待确认",
          "downloads": 92462129,
          "matched": false,
          "classificationConfidence": "待确认"
        },
        {
          "rank": 311,
          "name": "awswrangler",
          "categoryId": "other",
          "category": "其他/待确认",
          "downloads": 84142989,
          "matched": false,
          "classificationConfidence": "待确认"
        },
        {
          "rank": 328,
          "name": "py4j",
          "categoryId": "other",
          "category": "其他/待确认",
          "downloads": 76533258,
          "matched": false,
          "classificationConfidence": "待确认"
        },
        {
          "rank": 330,
          "name": "griffelib",
          "categoryId": "other",
          "category": "其他/待确认",
          "downloads": 76136925,
          "matched": false,
          "classificationConfidence": "待确认"
        },
        {
          "rank": 342,
          "name": "importlib-resources",
          "categoryId": "other",
          "category": "其他/待确认",
          "downloads": 72627837,
          "matched": false,
          "classificationConfidence": "待确认"
        }
      ],
      "topMatched": [
        {
          "rank": 80,
          "name": "greenlet",
          "categoryId": "other",
          "category": "其他/待确认",
          "downloads": 393152038,
          "matched": true,
          "classificationConfidence": "待确认"
        },
        {
          "rank": 132,
          "name": "sortedcontainers",
          "categoryId": "other",
          "category": "其他/待确认",
          "downloads": 226168124,
          "matched": true,
          "classificationConfidence": "待确认"
        },
        {
          "rank": 138,
          "name": "httptools",
          "categoryId": "other",
          "category": "其他/待确认",
          "downloads": 218138705,
          "matched": true,
          "classificationConfidence": "待确认"
        },
        {
          "rank": 149,
          "name": "python-discovery",
          "categoryId": "other",
          "category": "其他/待确认",
          "downloads": 205273927,
          "matched": true,
          "classificationConfidence": "待确认"
        },
        {
          "rank": 154,
          "name": "tiktoken",
          "categoryId": "other",
          "category": "其他/待确认",
          "downloads": 199936417,
          "matched": true,
          "classificationConfidence": "待确认"
        }
      ],
      "unmatchedDownloads": 5722640696,
      "downloadWeightedCoverage": 0.7240417208703998,
      "packageCoverage": 0.20865210190078082,
      "shareOfTop50kDownloads": 0.1485833821372204
    },
    {
      "id": "messaging",
      "label": "消息与业务集成",
      "packages": 369,
      "matchedPackages": 91,
      "totalDownloads": 428508510,
      "matchedDownloads": 217246418,
      "confidence": {
        "功能元数据规则匹配": {
          "packages": 192,
          "matchedPackages": 52,
          "totalDownloads": 293772959,
          "matchedDownloads": 123255345,
          "unmatchedDownloads": 170517614,
          "downloadWeightedCoverage": 0.41955987174435616,
          "packageCoverage": 0.2708333333333333
        },
        "仅包名/关键词候选": {
          "packages": 40,
          "matchedPackages": 5,
          "totalDownloads": 78006788,
          "matchedDownloads": 48087782,
          "unmatchedDownloads": 29919006,
          "downloadWeightedCoverage": 0.6164563781295546,
          "packageCoverage": 0.125
        },
        "多义待复核": {
          "packages": 137,
          "matchedPackages": 34,
          "totalDownloads": 56728763,
          "matchedDownloads": 45903291,
          "unmatchedDownloads": 10825472,
          "downloadWeightedCoverage": 0.8091713722014351,
          "packageCoverage": 0.24817518248175183
        }
      },
      "topMissing": [
        {
          "rank": 326,
          "name": "slack-sdk",
          "categoryId": "messaging",
          "category": "消息与业务集成",
          "downloads": 78738505,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 489,
          "name": "amqp",
          "categoryId": "messaging",
          "category": "消息与业务集成",
          "downloads": 44625814,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 978,
          "name": "python-telegram-bot",
          "categoryId": "messaging",
          "category": "消息与业务集成",
          "downloads": 16433852,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 1129,
          "name": "slack-bolt",
          "categoryId": "messaging",
          "category": "消息与业务集成",
          "downloads": 12560284,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 1188,
          "name": "pika",
          "categoryId": "messaging",
          "category": "消息与业务集成",
          "downloads": 11379645,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 1376,
          "name": "apprise",
          "categoryId": "messaging",
          "category": "消息与业务集成",
          "downloads": 8614309,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 1675,
          "name": "aiormq",
          "categoryId": "messaging",
          "category": "消息与业务集成",
          "downloads": 6006780,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 1678,
          "name": "aio-pika",
          "categoryId": "messaging",
          "category": "消息与业务集成",
          "downloads": 5998445,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 1786,
          "name": "uamqp",
          "categoryId": "messaging",
          "category": "消息与业务集成",
          "downloads": 5433335,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 2331,
          "name": "dagster-slack",
          "categoryId": "messaging",
          "category": "消息与业务集成",
          "downloads": 3227355,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        }
      ],
      "topMatched": [
        {
          "rank": 472,
          "name": "confluent-kafka",
          "categoryId": "messaging",
          "category": "消息与业务集成",
          "downloads": 46476863,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 476,
          "name": "kombu",
          "categoryId": "messaging",
          "category": "消息与业务集成",
          "downloads": 46098617,
          "matched": true,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 890,
          "name": "kafka-python",
          "categoryId": "messaging",
          "category": "消息与业务集成",
          "downloads": 19105660,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 1090,
          "name": "aiosmtplib",
          "categoryId": "messaging",
          "category": "消息与业务集成",
          "downloads": 13369776,
          "matched": true,
          "classificationConfidence": "多义待复核"
        },
        {
          "rank": 1110,
          "name": "aiokafka",
          "categoryId": "messaging",
          "category": "消息与业务集成",
          "downloads": 12922782,
          "matched": true,
          "classificationConfidence": "多义待复核"
        }
      ],
      "unmatchedDownloads": 211262092,
      "downloadWeightedCoverage": 0.5069827388025503,
      "packageCoverage": 0.24661246612466126,
      "shareOfTop50kDownloads": 0.0030702705019662966
    },
    {
      "id": "security",
      "label": "安全与身份",
      "packages": 758,
      "matchedPackages": 225,
      "totalDownloads": 6944451995,
      "matchedDownloads": 6247716419,
      "confidence": {
        "功能元数据规则匹配": {
          "packages": 588,
          "matchedPackages": 182,
          "totalDownloads": 6024168071,
          "matchedDownloads": 5565170621,
          "unmatchedDownloads": 458997450,
          "downloadWeightedCoverage": 0.9238073299764681,
          "packageCoverage": 0.30952380952380953
        },
        "仅包名/关键词候选": {
          "packages": 50,
          "matchedPackages": 18,
          "totalDownloads": 847861689,
          "matchedDownloads": 668244061,
          "unmatchedDownloads": 179617628,
          "downloadWeightedCoverage": 0.7881522065092388,
          "packageCoverage": 0.36
        },
        "多义待复核": {
          "packages": 120,
          "matchedPackages": 25,
          "totalDownloads": 72422235,
          "matchedDownloads": 14301737,
          "unmatchedDownloads": 58120498,
          "downloadWeightedCoverage": 0.1974771560143097,
          "packageCoverage": 0.20833333333333334
        }
      },
      "topMissing": [
        {
          "rank": 197,
          "name": "keyring",
          "categoryId": "security",
          "category": "安全与身份",
          "downloads": 162697520,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 198,
          "name": "msal",
          "categoryId": "security",
          "category": "安全与身份",
          "downloads": 162478279,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 274,
          "name": "joserfc",
          "categoryId": "security",
          "category": "安全与身份",
          "downloads": 104409515,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 703,
          "name": "oauth2client",
          "categoryId": "security",
          "category": "安全与身份",
          "downloads": 27500546,
          "matched": false,
          "classificationConfidence": "多义待复核"
        },
        {
          "rank": 734,
          "name": "bandit",
          "categoryId": "security",
          "category": "安全与身份",
          "downloads": 25589963,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 848,
          "name": "id",
          "categoryId": "security",
          "category": "安全与身份",
          "downloads": 20994705,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 942,
          "name": "oscrypto",
          "categoryId": "security",
          "category": "安全与身份",
          "downloads": 17353966,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 966,
          "name": "pyspnego",
          "categoryId": "security",
          "category": "安全与身份",
          "downloads": 16787830,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 1029,
          "name": "python-gnupg",
          "categoryId": "security",
          "category": "安全与身份",
          "downloads": 14920278,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 1045,
          "name": "keyrings-google-artifactregistry-auth",
          "categoryId": "security",
          "category": "安全与身份",
          "downloads": 14513416,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        }
      ],
      "topMatched": [
        {
          "rank": 5,
          "name": "certifi",
          "categoryId": "security",
          "category": "安全与身份",
          "downloads": 1430279564,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 9,
          "name": "cryptography",
          "categoryId": "security",
          "category": "安全与身份",
          "downloads": 1155136388,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 42,
          "name": "pyjwt",
          "categoryId": "security",
          "category": "安全与身份",
          "downloads": 560443026,
          "matched": true,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 74,
          "name": "google-auth",
          "categoryId": "security",
          "category": "安全与身份",
          "downloads": 414028572,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 116,
          "name": "requests-oauthlib",
          "categoryId": "security",
          "category": "安全与身份",
          "downloads": 271721017,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        }
      ],
      "unmatchedDownloads": 696735576,
      "downloadWeightedCoverage": 0.8996701861426,
      "packageCoverage": 0.29683377308707126,
      "shareOfTop50kDownloads": 0.049757112437672474
    },
    {
      "id": "build",
      "label": "构建与工程工具",
      "packages": 871,
      "matchedPackages": 226,
      "totalDownloads": 7566769060,
      "matchedDownloads": 5253513175,
      "confidence": {
        "功能元数据规则匹配": {
          "packages": 551,
          "matchedPackages": 149,
          "totalDownloads": 6607901120,
          "matchedDownloads": 4739171733,
          "unmatchedDownloads": 1868729387,
          "downloadWeightedCoverage": 0.7171977375169923,
          "packageCoverage": 0.27041742286751363
        },
        "仅包名/关键词候选": {
          "packages": 114,
          "matchedPackages": 41,
          "totalDownloads": 793176828,
          "matchedDownloads": 385575395,
          "unmatchedDownloads": 407601433,
          "downloadWeightedCoverage": 0.4861153041651893,
          "packageCoverage": 0.35964912280701755
        },
        "多义待复核": {
          "packages": 206,
          "matchedPackages": 36,
          "totalDownloads": 165691112,
          "matchedDownloads": 128766047,
          "unmatchedDownloads": 36925065,
          "downloadWeightedCoverage": 0.7771451675693987,
          "packageCoverage": 0.17475728155339806
        }
      },
      "topMissing": [
        {
          "rank": 10,
          "name": "setuptools",
          "categoryId": "build",
          "category": "构建与工程工具",
          "downloads": 1148444076,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 85,
          "name": "hatchling",
          "categoryId": "build",
          "category": "构建与工程工具",
          "downloads": 381668744,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 103,
          "name": "virtualenv",
          "categoryId": "build",
          "category": "构建与工程工具",
          "downloads": 323294803,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 282,
          "name": "asttokens",
          "categoryId": "build",
          "category": "构建与工程工具",
          "downloads": 100459606,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 365,
          "name": "invoke",
          "categoryId": "build",
          "category": "构建与工程工具",
          "downloads": 66272915,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 446,
          "name": "poetry",
          "categoryId": "build",
          "category": "构建与工程工具",
          "downloads": 49745370,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 683,
          "name": "pip-requirements-parser",
          "categoryId": "build",
          "category": "构建与工程工具",
          "downloads": 28888349,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 728,
          "name": "pip-audit",
          "categoryId": "build",
          "category": "构建与工程工具",
          "downloads": 26006474,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 892,
          "name": "sshtunnel",
          "categoryId": "build",
          "category": "构建与工程工具",
          "downloads": 19050959,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 933,
          "name": "pipenv",
          "categoryId": "build",
          "category": "构建与工程工具",
          "downloads": 17607504,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        }
      ],
      "topMatched": [
        {
          "rank": 2,
          "name": "packaging",
          "categoryId": "build",
          "category": "构建与工程工具",
          "downloads": 1778766101,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 54,
          "name": "pip",
          "categoryId": "build",
          "category": "构建与工程工具",
          "downloads": 474575868,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 70,
          "name": "wheel",
          "categoryId": "build",
          "category": "构建与工程工具",
          "downloads": 428873272,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 75,
          "name": "annotated-doc",
          "categoryId": "build",
          "category": "构建与工程工具",
          "downloads": 408021624,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 76,
          "name": "importlib-metadata",
          "categoryId": "build",
          "category": "构建与工程工具",
          "downloads": 401855854,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        }
      ],
      "unmatchedDownloads": 2313255885,
      "downloadWeightedCoverage": 0.6942875001658898,
      "packageCoverage": 0.25947187141216993,
      "shareOfTop50kDownloads": 0.05421602441479923
    },
    {
      "id": "system-iot",
      "label": "系统、IoT与硬件",
      "packages": 559,
      "matchedPackages": 121,
      "totalDownloads": 6255768081,
      "matchedDownloads": 4220830465,
      "confidence": {
        "功能元数据规则匹配": {
          "packages": 394,
          "matchedPackages": 88,
          "totalDownloads": 6036265047,
          "matchedDownloads": 4068391024,
          "unmatchedDownloads": 1967874023,
          "downloadWeightedCoverage": 0.6739914487389804,
          "packageCoverage": 0.2233502538071066
        },
        "多义待复核": {
          "packages": 58,
          "matchedPackages": 9,
          "totalDownloads": 151122101,
          "matchedDownloads": 123927181,
          "unmatchedDownloads": 27194920,
          "downloadWeightedCoverage": 0.8200467051473828,
          "packageCoverage": 0.15517241379310345
        },
        "仅包名/关键词候选": {
          "packages": 107,
          "matchedPackages": 24,
          "totalDownloads": 68380933,
          "matchedDownloads": 28512260,
          "unmatchedDownloads": 39868673,
          "downloadWeightedCoverage": 0.41696213767659474,
          "packageCoverage": 0.22429906542056074
        }
      },
      "topMissing": [
        {
          "rank": 36,
          "name": "fsspec",
          "categoryId": "system-iot",
          "category": "系统、IoT与硬件",
          "downloads": 648702982,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 38,
          "name": "platformdirs",
          "categoryId": "system-iot",
          "category": "系统、IoT与硬件",
          "downloads": 600417699,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 43,
          "name": "filelock",
          "categoryId": "system-iot",
          "category": "系统、IoT与硬件",
          "downloads": 541402099,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 394,
          "name": "gcsfs",
          "categoryId": "system-iot",
          "category": "系统、IoT与硬件",
          "downloads": 59340033,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 562,
          "name": "filetype",
          "categoryId": "system-iot",
          "category": "系统、IoT与硬件",
          "downloads": 37102575,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 758,
          "name": "pathvalidate",
          "categoryId": "system-iot",
          "category": "系统、IoT与硬件",
          "downloads": 24648075,
          "matched": false,
          "classificationConfidence": "多义待复核"
        },
        {
          "rank": 785,
          "name": "pywin32",
          "categoryId": "system-iot",
          "category": "系统、IoT与硬件",
          "downloads": 23466117,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 1033,
          "name": "pox",
          "categoryId": "system-iot",
          "category": "系统、IoT与硬件",
          "downloads": 14708468,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 1098,
          "name": "pyserial",
          "categoryId": "system-iot",
          "category": "系统、IoT与硬件",
          "downloads": 13209534,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 1324,
          "name": "pywin32-ctypes",
          "categoryId": "system-iot",
          "category": "系统、IoT与硬件",
          "downloads": 9219919,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        }
      ],
      "topMatched": [
        {
          "rank": 11,
          "name": "cffi",
          "categoryId": "system-iot",
          "category": "系统、IoT与硬件",
          "downloads": 1014901908,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 22,
          "name": "anyio",
          "categoryId": "system-iot",
          "category": "系统、IoT与硬件",
          "downloads": 850095645,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 72,
          "name": "sniffio",
          "categoryId": "system-iot",
          "category": "系统、IoT与硬件",
          "downloads": 416683187,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 81,
          "name": "s3fs",
          "categoryId": "system-iot",
          "category": "系统、IoT与硬件",
          "downloads": 392852134,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 105,
          "name": "watchfiles",
          "categoryId": "system-iot",
          "category": "系统、IoT与硬件",
          "downloads": 311231930,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        }
      ],
      "unmatchedDownloads": 2034937616,
      "downloadWeightedCoverage": 0.6747101891164242,
      "packageCoverage": 0.21645796064400716,
      "shareOfTop50kDownloads": 0.04482268089900153
    },
    {
      "id": "office",
      "label": "通用办公开发",
      "packages": 428,
      "matchedPackages": 92,
      "totalDownloads": 1618303750,
      "matchedDownloads": 1249807420,
      "confidence": {
        "功能元数据规则匹配": {
          "packages": 263,
          "matchedPackages": 55,
          "totalDownloads": 1160187250,
          "matchedDownloads": 845666531,
          "unmatchedDownloads": 314520719,
          "downloadWeightedCoverage": 0.7289052099133135,
          "packageCoverage": 0.20912547528517111
        },
        "多义待复核": {
          "packages": 82,
          "matchedPackages": 21,
          "totalDownloads": 342100295,
          "matchedDownloads": 294567064,
          "unmatchedDownloads": 47533231,
          "downloadWeightedCoverage": 0.8610546915780941,
          "packageCoverage": 0.25609756097560976
        },
        "仅包名/关键词候选": {
          "packages": 83,
          "matchedPackages": 16,
          "totalDownloads": 116016205,
          "matchedDownloads": 109573825,
          "unmatchedDownloads": 6442380,
          "downloadWeightedCoverage": 0.9444699988247331,
          "packageCoverage": 0.1927710843373494
        }
      },
      "topMissing": [
        {
          "rank": 248,
          "name": "pypdf",
          "categoryId": "office",
          "category": "通用办公开发",
          "downloads": 126471671,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 429,
          "name": "python-pptx",
          "categoryId": "office",
          "category": "通用办公开发",
          "downloads": 51817576,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 509,
          "name": "pdfplumber",
          "categoryId": "office",
          "category": "通用办公开发",
          "downloads": 42273523,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 583,
          "name": "sphinx",
          "categoryId": "office",
          "category": "通用办公开发",
          "downloads": 34785568,
          "matched": false,
          "classificationConfidence": "多义待复核"
        },
        {
          "rank": 946,
          "name": "pypdf2",
          "categoryId": "office",
          "category": "通用办公开发",
          "downloads": 17237673,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 969,
          "name": "youtube-transcript-api",
          "categoryId": "office",
          "category": "通用办公开发",
          "downloads": 16766677,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 1701,
          "name": "pyhanko",
          "categoryId": "office",
          "category": "通用办公开发",
          "downloads": 5885719,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 1790,
          "name": "pymupdf-layout",
          "categoryId": "office",
          "category": "通用办公开发",
          "downloads": 5395588,
          "matched": false,
          "classificationConfidence": "多义待复核"
        },
        {
          "rank": 1817,
          "name": "docling",
          "categoryId": "office",
          "category": "通用办公开发",
          "downloads": 5246311,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 2138,
          "name": "patchright",
          "categoryId": "office",
          "category": "通用办公开发",
          "downloads": 3841657,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        }
      ],
      "topMatched": [
        {
          "rank": 111,
          "name": "openpyxl",
          "categoryId": "office",
          "category": "通用办公开发",
          "downloads": 288880453,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 206,
          "name": "docutils",
          "categoryId": "office",
          "category": "通用办公开发",
          "downloads": 155328598,
          "matched": true,
          "classificationConfidence": "多义待复核"
        },
        {
          "rank": 293,
          "name": "python-docx",
          "categoryId": "office",
          "category": "通用办公开发",
          "downloads": 93745324,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 297,
          "name": "playwright",
          "categoryId": "office",
          "category": "通用办公开发",
          "downloads": 92430594,
          "matched": true,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 305,
          "name": "pymupdf",
          "categoryId": "office",
          "category": "通用办公开发",
          "downloads": 87345033,
          "matched": true,
          "classificationConfidence": "多义待复核"
        }
      ],
      "unmatchedDownloads": 368496330,
      "downloadWeightedCoverage": 0.7722947067261013,
      "packageCoverage": 0.21495327102803738,
      "shareOfTop50kDownloads": 0.011595172909976607
    },
    {
      "id": "automation",
      "label": "自动化与数据采集",
      "packages": 131,
      "matchedPackages": 30,
      "totalDownloads": 877249989,
      "matchedDownloads": 823938788,
      "confidence": {
        "功能元数据规则匹配": {
          "packages": 52,
          "matchedPackages": 19,
          "totalDownloads": 724680611,
          "matchedDownloads": 711167798,
          "unmatchedDownloads": 13512813,
          "downloadWeightedCoverage": 0.9813534227425329,
          "packageCoverage": 0.36538461538461536
        },
        "仅包名/关键词候选": {
          "packages": 60,
          "matchedPackages": 9,
          "totalDownloads": 137028049,
          "matchedDownloads": 111948190,
          "unmatchedDownloads": 25079859,
          "downloadWeightedCoverage": 0.8169728082459964,
          "packageCoverage": 0.15
        },
        "多义待复核": {
          "packages": 19,
          "matchedPackages": 2,
          "totalDownloads": 15541329,
          "matchedDownloads": 822800,
          "unmatchedDownloads": 14718529,
          "downloadWeightedCoverage": 0.05294270522167056,
          "packageCoverage": 0.10526315789473684
        }
      },
      "topMissing": [
        {
          "rank": 1147,
          "name": "courlan",
          "categoryId": "automation",
          "category": "自动化与数据采集",
          "downloads": 12188629,
          "matched": false,
          "classificationConfidence": "多义待复核"
        },
        {
          "rank": 1389,
          "name": "prefect",
          "categoryId": "automation",
          "category": "自动化与数据采集",
          "downloads": 8466080,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 1725,
          "name": "firecrawl-py",
          "categoryId": "automation",
          "category": "自动化与数据采集",
          "downloads": 5743522,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 1950,
          "name": "scrapy",
          "categoryId": "automation",
          "category": "自动化与数据采集",
          "downloads": 4651078,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 2341,
          "name": "prefect-aws",
          "categoryId": "automation",
          "category": "自动化与数据采集",
          "downloads": 3211612,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 2508,
          "name": "scrapy-playwright",
          "categoryId": "automation",
          "category": "自动化与数据采集",
          "downloads": 2789039,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 2934,
          "name": "seleniumbase",
          "categoryId": "automation",
          "category": "自动化与数据采集",
          "downloads": 2071459,
          "matched": false,
          "classificationConfidence": "多义待复核"
        },
        {
          "rank": 3067,
          "name": "yt-dlp-ejs",
          "categoryId": "automation",
          "category": "自动化与数据采集",
          "downloads": 1871061,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 3423,
          "name": "prefect-cloud",
          "categoryId": "automation",
          "category": "自动化与数据采集",
          "downloads": 1501409,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 3632,
          "name": "crawl4ai",
          "categoryId": "automation",
          "category": "自动化与数据采集",
          "downloads": 1329723,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        }
      ],
      "topMatched": [
        {
          "rank": 97,
          "name": "beautifulsoup4",
          "categoryId": "automation",
          "category": "自动化与数据采集",
          "downloads": 330592416,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 98,
          "name": "soupsieve",
          "categoryId": "automation",
          "category": "自动化与数据采集",
          "downloads": 330238902,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 325,
          "name": "croniter",
          "categoryId": "automation",
          "category": "自动化与数据采集",
          "downloads": 78756722,
          "matched": true,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 539,
          "name": "apscheduler",
          "categoryId": "automation",
          "category": "自动化与数据采集",
          "downloads": 38395208,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 934,
          "name": "bs4",
          "categoryId": "automation",
          "category": "自动化与数据采集",
          "downloads": 17537849,
          "matched": true,
          "classificationConfidence": "仅包名/关键词候选"
        }
      ],
      "unmatchedDownloads": 53311201,
      "downloadWeightedCoverage": 0.9392291802012208,
      "packageCoverage": 0.22900763358778625,
      "shareOfTop50kDownloads": 0.006285510558651351
    },
    {
      "id": "science",
      "label": "科学计算与地理空间",
      "packages": 2031,
      "matchedPackages": 423,
      "totalDownloads": 2531777632,
      "matchedDownloads": 2001466868,
      "confidence": {
        "功能元数据规则匹配": {
          "packages": 1594,
          "matchedPackages": 325,
          "totalDownloads": 2114799542,
          "matchedDownloads": 1618312005,
          "unmatchedDownloads": 496487537,
          "downloadWeightedCoverage": 0.7652318684869471,
          "packageCoverage": 0.2038895859473024
        },
        "多义待复核": {
          "packages": 240,
          "matchedPackages": 54,
          "totalDownloads": 247888537,
          "matchedDownloads": 234920929,
          "unmatchedDownloads": 12967608,
          "downloadWeightedCoverage": 0.9476877464487194,
          "packageCoverage": 0.225
        },
        "仅包名/关键词候选": {
          "packages": 197,
          "matchedPackages": 44,
          "totalDownloads": 169089553,
          "matchedDownloads": 148233934,
          "unmatchedDownloads": 20855619,
          "downloadWeightedCoverage": 0.876659328563013,
          "packageCoverage": 0.2233502538071066
        }
      },
      "topMissing": [
        {
          "rank": 144,
          "name": "networkx",
          "categoryId": "science",
          "category": "科学计算与地理空间",
          "downloads": 208976870,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 225,
          "name": "sympy",
          "categoryId": "science",
          "category": "科学计算与地理空间",
          "downloads": 143438757,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 993,
          "name": "optuna",
          "categoryId": "science",
          "category": "科学计算与地理空间",
          "downloads": 16125219,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 1037,
          "name": "geopandas",
          "categoryId": "science",
          "category": "科学计算与地理空间",
          "downloads": 14691309,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 1150,
          "name": "xarray",
          "categoryId": "science",
          "category": "科学计算与地理空间",
          "downloads": 12127869,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 1222,
          "name": "geopy",
          "categoryId": "science",
          "category": "科学计算与地理空间",
          "downloads": 10786224,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 1483,
          "name": "formulaic",
          "categoryId": "science",
          "category": "科学计算与地理空间",
          "downloads": 7455569,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 1619,
          "name": "ortools",
          "categoryId": "science",
          "category": "科学计算与地理空间",
          "downloads": 6360111,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 1687,
          "name": "rasterio",
          "categoryId": "science",
          "category": "科学计算与地理空间",
          "downloads": 5958942,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 1958,
          "name": "exchange-calendars",
          "categoryId": "science",
          "category": "科学计算与地理空间",
          "downloads": 4608108,
          "matched": false,
          "classificationConfidence": "多义待复核"
        }
      ],
      "topMatched": [
        {
          "rank": 21,
          "name": "numpy",
          "categoryId": "science",
          "category": "科学计算与地理空间",
          "downloads": 863198774,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 101,
          "name": "scipy",
          "categoryId": "science",
          "category": "科学计算与地理空间",
          "downloads": 325870980,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 216,
          "name": "contourpy",
          "categoryId": "science",
          "category": "科学计算与地理空间",
          "downloads": 149356296,
          "matched": true,
          "classificationConfidence": "多义待复核"
        },
        {
          "rank": 235,
          "name": "mpmath",
          "categoryId": "science",
          "category": "科学计算与地理空间",
          "downloads": 136492815,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 378,
          "name": "shapely",
          "categoryId": "science",
          "category": "科学计算与地理空间",
          "downloads": 63212058,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        }
      ],
      "unmatchedDownloads": 530310764,
      "downloadWeightedCoverage": 0.7905381747207094,
      "packageCoverage": 0.20827178729689808,
      "shareOfTop50kDownloads": 0.018140228256068196
    },
    {
      "id": "frontend",
      "label": "前端与交互式应用",
      "packages": 329,
      "matchedPackages": 84,
      "totalDownloads": 927394088,
      "matchedDownloads": 696910641,
      "confidence": {
        "功能元数据规则匹配": {
          "packages": 154,
          "matchedPackages": 22,
          "totalDownloads": 842942763,
          "matchedDownloads": 630063450,
          "unmatchedDownloads": 212879313,
          "downloadWeightedCoverage": 0.7474569776928022,
          "packageCoverage": 0.14285714285714285
        },
        "仅包名/关键词候选": {
          "packages": 155,
          "matchedPackages": 57,
          "totalDownloads": 72602257,
          "matchedDownloads": 56253050,
          "unmatchedDownloads": 16349207,
          "downloadWeightedCoverage": 0.7748113119954384,
          "packageCoverage": 0.36774193548387096
        },
        "多义待复核": {
          "packages": 20,
          "matchedPackages": 5,
          "totalDownloads": 11849068,
          "matchedDownloads": 10594141,
          "unmatchedDownloads": 1254927,
          "downloadWeightedCoverage": 0.8940906575943357,
          "packageCoverage": 0.25
        }
      },
      "topMissing": [
        {
          "rank": 204,
          "name": "jeepney",
          "categoryId": "frontend",
          "category": "前端与交互式应用",
          "downloads": 155376889,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 804,
          "name": "streamlit",
          "categoryId": "frontend",
          "category": "前端与交互式应用",
          "downloads": 22441679,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 1528,
          "name": "dash",
          "categoryId": "frontend",
          "category": "前端与交互式应用",
          "downloads": 7049453,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 1576,
          "name": "dagster-webserver",
          "categoryId": "frontend",
          "category": "前端与交互式应用",
          "downloads": 6747363,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 2205,
          "name": "pyside6-essentials",
          "categoryId": "frontend",
          "category": "前端与交互式应用",
          "downloads": 3627889,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 2299,
          "name": "pyside6-addons",
          "categoryId": "frontend",
          "category": "前端与交互式应用",
          "downloads": 3339400,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 2340,
          "name": "pyside6",
          "categoryId": "frontend",
          "category": "前端与交互式应用",
          "downloads": 3214279,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 2521,
          "name": "qtpy",
          "categoryId": "frontend",
          "category": "前端与交互式应用",
          "downloads": 2757345,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 2819,
          "name": "pyqt5",
          "categoryId": "frontend",
          "category": "前端与交互式应用",
          "downloads": 2271081,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 2838,
          "name": "panel",
          "categoryId": "frontend",
          "category": "前端与交互式应用",
          "downloads": 2231488,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        }
      ],
      "topMatched": [
        {
          "rank": 39,
          "name": "jinja2",
          "categoryId": "frontend",
          "category": "前端与交互式应用",
          "downloads": 590846191,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 588,
          "name": "send2trash",
          "categoryId": "frontend",
          "category": "前端与交互式应用",
          "downloads": 34479763,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 602,
          "name": "ipywidgets",
          "categoryId": "frontend",
          "category": "前端与交互式应用",
          "downloads": 33569125,
          "matched": true,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 1260,
          "name": "screeninfo",
          "categoryId": "frontend",
          "category": "前端与交互式应用",
          "downloads": 10236351,
          "matched": true,
          "classificationConfidence": "多义待复核"
        },
        {
          "rank": 1470,
          "name": "easygui",
          "categoryId": "frontend",
          "category": "前端与交互式应用",
          "downloads": 7579398,
          "matched": true,
          "classificationConfidence": "仅包名/关键词候选"
        }
      ],
      "unmatchedDownloads": 230483447,
      "downloadWeightedCoverage": 0.7514719470586058,
      "packageCoverage": 0.2553191489361702,
      "shareOfTop50kDownloads": 0.006644793850381958
    },
    {
      "id": "multimedia",
      "label": "多媒体与图形",
      "packages": 568,
      "matchedPackages": 139,
      "totalDownloads": 1259564275,
      "matchedDownloads": 886839869,
      "confidence": {
        "功能元数据规则匹配": {
          "packages": 474,
          "matchedPackages": 115,
          "totalDownloads": 806337785,
          "matchedDownloads": 674358275,
          "unmatchedDownloads": 131979510,
          "downloadWeightedCoverage": 0.8363223050498619,
          "packageCoverage": 0.24261603375527427
        },
        "多义待复核": {
          "packages": 67,
          "matchedPackages": 14,
          "totalDownloads": 289840052,
          "matchedDownloads": 88077101,
          "unmatchedDownloads": 201762951,
          "downloadWeightedCoverage": 0.3038817457843956,
          "packageCoverage": 0.208955223880597
        },
        "仅包名/关键词候选": {
          "packages": 27,
          "matchedPackages": 10,
          "totalDownloads": 163386438,
          "matchedDownloads": 124404493,
          "unmatchedDownloads": 38981945,
          "downloadWeightedCoverage": 0.7614126026788098,
          "packageCoverage": 0.37037037037037035
        }
      },
      "topMissing": [
        {
          "rank": 155,
          "name": "fonttools",
          "categoryId": "multimedia",
          "category": "多媒体与图形",
          "downloads": 199497740,
          "matched": false,
          "classificationConfidence": "多义待复核"
        },
        {
          "rank": 545,
          "name": "imageio",
          "categoryId": "multimedia",
          "category": "多媒体与图形",
          "downloads": 38023160,
          "matched": false,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 818,
          "name": "imagesize",
          "categoryId": "multimedia",
          "category": "多媒体与图形",
          "downloads": 21893370,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 865,
          "name": "pydeck",
          "categoryId": "multimedia",
          "category": "多媒体与图形",
          "downloads": 20122431,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 898,
          "name": "pydub",
          "categoryId": "multimedia",
          "category": "多媒体与图形",
          "downloads": 18893538,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 1104,
          "name": "cairocffi",
          "categoryId": "multimedia",
          "category": "多媒体与图形",
          "downloads": 13090230,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 1297,
          "name": "trimesh",
          "categoryId": "multimedia",
          "category": "多媒体与图形",
          "downloads": 9543636,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 1616,
          "name": "audioread",
          "categoryId": "multimedia",
          "category": "多媒体与图形",
          "downloads": 6411818,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 2212,
          "name": "vtk",
          "categoryId": "multimedia",
          "category": "多媒体与图形",
          "downloads": 3610830,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 2266,
          "name": "ffmpy",
          "categoryId": "multimedia",
          "category": "多媒体与图形",
          "downloads": 3444806,
          "matched": false,
          "classificationConfidence": "功能元数据规则匹配"
        }
      ],
      "topMatched": [
        {
          "rank": 66,
          "name": "pillow",
          "categoryId": "multimedia",
          "category": "多媒体与图形",
          "downloads": 437626640,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        },
        {
          "rank": 390,
          "name": "pypdfium2",
          "categoryId": "multimedia",
          "category": "多媒体与图形",
          "downloads": 60357480,
          "matched": true,
          "classificationConfidence": "多义待复核"
        },
        {
          "rank": 529,
          "name": "opencv-python-headless",
          "categoryId": "multimedia",
          "category": "多媒体与图形",
          "downloads": 39922953,
          "matched": true,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 563,
          "name": "opencv-python",
          "categoryId": "multimedia",
          "category": "多媒体与图形",
          "downloads": 37054988,
          "matched": true,
          "classificationConfidence": "仅包名/关键词候选"
        },
        {
          "rank": 636,
          "name": "qrcode",
          "categoryId": "multimedia",
          "category": "多媒体与图形",
          "downloads": 31224827,
          "matched": true,
          "classificationConfidence": "功能元数据规则匹配"
        }
      ],
      "unmatchedDownloads": 372724406,
      "downloadWeightedCoverage": 0.704084647843795,
      "packageCoverage": 0.24471830985915494,
      "shareOfTop50kDownloads": 0.009024798688042542
    }
  ]
};

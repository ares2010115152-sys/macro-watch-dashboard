const STORE_KEY = "macro-watch-state-v1";

const statusMeta = {
  green: { label: "绿灯", score: 0 },
  yellow: { label: "黄灯", score: 1 },
  amber: { label: "黄灯偏红", score: 2 },
  red: { label: "红灯", score: 3 },
};

const defaultIndicators = [
  {
    id: "brent",
    name: "布伦特原油",
    category: "能源与航运",
    unit: "美元/桶",
    value: 95.46,
    asOf: "2026-05-27",
    source: "Reuters / MarketScreener / TradingEconomics",
    frequency: "每日",
    summary: true,
    thesis: "能源通胀压力已显性化；站稳120美元后，美股估值压力会明显放大。",
    rule: { mode: "higherRisk", green: 90, yellow: 105, amber: 120 },
  },
  {
    id: "distillate",
    name: "美国馏分油库存",
    category: "能源与航运",
    unit: "百万桶",
    value: 100.8,
    asOf: "2026-05-22",
    source: "EIA Weekly Petroleum Status Report",
    frequency: "每周",
    summary: true,
    thesis: "柴油、取暖油和工业物流链条的压力指标；跌破100百万桶会强化供应短缺叙事。",
    rule: { mode: "lowerRisk", green: 120, yellow: 110, amber: 100 },
  },
  {
    id: "ust10y",
    name: "美国10年期国债收益率",
    category: "利率与流动性",
    unit: "%",
    value: 4.48,
    asOf: "2026-05-27",
    source: "Federal Reserve H.15",
    frequency: "每日",
    summary: true,
    thesis: "长端利率是AI估值与美股风险偏好的折现率核心；逼近5%会触发更强估值重定价。",
    rule: { mode: "higherRisk", green: 4.2, yellow: 4.6, amber: 4.9 },
  },
  {
    id: "spxPe",
    name: "标普500远期PE",
    category: "AI与美股",
    unit: "倍",
    value: 22.52,
    asOf: "2026-05-27",
    source: "D.A. Davidson sector valuation matrix / FactSet口径",
    frequency: "每周",
    summary: true,
    thesis: "估值不必极端才会脆弱；在高油价和高长债环境下，20倍以上安全垫偏薄。",
    rule: { mode: "higherRisk", green: 18.5, yellow: 20.5, amber: 22.5 },
  },
  {
    id: "mag7Capex",
    name: "云厂商AI资本开支",
    category: "AI与美股",
    unit: "十亿美元",
    value: 830,
    asOf: "2026-05-06",
    source: "TrendForce九大CSP资本支出预估",
    frequency: "季报",
    summary: true,
    thesis: "AI FOMO的资金强度指标；CapEx越高，越需要利润率、现金流和能源供给兑现。",
    rule: { mode: "higherRisk", green: 600, yellow: 750, amber: 900 },
  },
  {
    id: "wti",
    name: "WTI原油",
    category: "能源与航运",
    unit: "美元/桶",
    value: 88.68,
    asOf: "2026-05-27",
    source: "Investing.com historical NYMEX WTI",
    frequency: "每日",
    thesis: "美国本土供需与炼厂原料压力的高频指标。",
    rule: { mode: "higherRisk", green: 85, yellow: 100, amber: 115 },
  },
  {
    id: "usCrudeInv",
    name: "美国商业原油库存",
    category: "能源与航运",
    unit: "百万桶",
    value: 441.7,
    asOf: "2026-05-22",
    source: "EIA Weekly Petroleum Status Report",
    frequency: "每周",
    thesis: "库存是否仍在掩盖供需缺口；连续去库比单周绝对数更重要。",
    rule: { mode: "lowerRisk", green: 465, yellow: 435, amber: 410 },
  },
  {
    id: "spr",
    name: "美国战略石油储备",
    category: "能源与航运",
    unit: "百万桶",
    value: 365.1,
    asOf: "2026-05-22",
    source: "EIA SPR",
    frequency: "每周",
    thesis: "政策缓冲垫；库存越低，越难依赖SPR长期压油价。",
    rule: { mode: "lowerRisk", green: 500, yellow: 430, amber: 380 },
  },
  {
    id: "hormuzRisk",
    name: "霍尔木兹航运风险",
    category: "能源与航运",
    unit: "分",
    value: 65,
    asOf: "2026-05-27",
    source: "航运新闻 / 谈判进展 / AIS手工评分",
    frequency: "每日",
    thesis: "把地缘叙事量化为0-100分：封锁、保险、船期延误、护航强度共同打分。",
    rule: { mode: "higherRisk", green: 30, yellow: 55, amber: 75 },
  },
  {
    id: "hormuzCrossings",
    name: "霍尔木兹船舶通行量",
    category: "能源与航运",
    unit: "艘/日",
    value: 26,
    asOf: "2026-05-27",
    source: "用户材料 / MUFG-Bloomberg ship-crossing chart",
    frequency: "每日",
    thesis: "短期消息能放大反弹，但与战前约130艘/日相比，26艘仍说明运输系统远未恢复。",
    rule: { mode: "lowerRisk", green: 130, yellow: 80, amber: 30 },
  },
  {
    id: "brentFrontSpread",
    name: "布伦特近月-六月价差",
    category: "能源与航运",
    unit: "美元/桶",
    value: 12,
    asOf: "2026-05-27",
    source: "Brent futures curve screens / 用户材料",
    frequency: "每日",
    thesis: "现货紧张的曲线信号；虽然较上月35美元高点回落，20美元仍不是宽松油市。",
    rule: { mode: "higherRisk", green: 5, yellow: 10, amber: 20 },
  },
  {
    id: "ieaOilDeficit",
    name: "IEA 2026油市缺口预估",
    category: "能源与航运",
    unit: "百万桶/日",
    value: 1.78,
    asOf: "2026-05-13",
    source: "IEA Oil Market Report - May 2026",
    frequency: "每月",
    thesis: "油价是否只是情绪市，要看全年供需缺口是否仍为正；IEA仍给出明显赤字。",
    rule: { mode: "higherRisk", green: 0, yellow: 0.6, amber: 1.2 },
  },
  {
    id: "cpiHeadline",
    name: "美国CPI同比",
    category: "通胀",
    unit: "%",
    value: 3.8,
    asOf: "2026-04-30",
    source: "BLS CPI",
    frequency: "每月",
    thesis: "通胀重新抬头会削弱降息预期，放大高估值资产压力。",
    rule: { mode: "higherRisk", green: 2.6, yellow: 3.3, amber: 4.0 },
  },
  {
    id: "coreCpi",
    name: "美国核心CPI同比",
    category: "通胀",
    unit: "%",
    value: 2.8,
    asOf: "2026-04-30",
    source: "BLS CPI",
    frequency: "每月",
    thesis: "服务通胀与工资黏性的核心读数。",
    rule: { mode: "higherRisk", green: 2.8, yellow: 3.4, amber: 4.0 },
  },
  {
    id: "cpi3mSaar",
    name: "核心CPI三个月年化",
    category: "通胀",
    unit: "%",
    value: 3.4,
    asOf: "2026-04-30",
    source: "BLS CPI计算",
    frequency: "每月",
    thesis: "比同比更敏感，能捕捉通胀重新加速。",
    rule: { mode: "higherRisk", green: 2.8, yellow: 3.6, amber: 4.5 },
  },
  {
    id: "ppiEnergy",
    name: "PPI能源分项",
    category: "通胀",
    unit: "%",
    value: 2.8,
    asOf: "2026-05-27",
    source: "BLS PPI",
    frequency: "每月",
    thesis: "上游成本向企业利润和终端价格传导的先行指标。",
    rule: { mode: "higherRisk", green: 0.5, yellow: 2.0, amber: 4.0 },
  },
  {
    id: "realYield",
    name: "10年期实际利率",
    category: "利率与流动性",
    unit: "%",
    value: 2.09,
    asOf: "2026-05-27",
    source: "Federal Reserve H.15 TIPS",
    frequency: "每日",
    thesis: "黄金和成长股共同关注的折现率；实际利率高位会压制黄金，但危机阶段会被避险需求抵消。",
    rule: { mode: "higherRisk", green: 1.5, yellow: 2.0, amber: 2.4 },
  },
  {
    id: "dxy",
    name: "美元指数DXY",
    category: "利率与流动性",
    unit: "点",
    value: 99.17,
    asOf: "2026-05-27",
    source: "GoldPriceTracker / ICE DXY口径",
    frequency: "每日",
    thesis: "美元走强会收紧全球流动性；美元走弱叠加高油价会强化黄金与资源重估。",
    rule: { mode: "higherRisk", green: 100, yellow: 104, amber: 108 },
  },
  {
    id: "tga",
    name: "美国财政部TGA账户",
    category: "利率与流动性",
    unit: "十亿美元",
    value: 830,
    asOf: "2026-05-27",
    source: "StreetStats / Federal Reserve H.4.1",
    frequency: "每日",
    thesis: "TGA上升通常抽走银行体系流动性；需要和RRP、准备金合看。",
    rule: { mode: "higherRisk", green: 500, yellow: 750, amber: 1000 },
  },
  {
    id: "rrp",
    name: "隔夜逆回购RRP",
    category: "利率与流动性",
    unit: "十亿美元",
    value: 2,
    asOf: "2026-05-27",
    source: "StreetStats / Federal Reserve H.4.1",
    frequency: "每日",
    thesis: "RRP是可释放的流动性缓冲；越低，财政抽水对市场的冲击越直接。",
    rule: { mode: "lowerRisk", green: 900, yellow: 500, amber: 200 },
  },
  {
    id: "bankReserves",
    name: "银行准备金",
    category: "利率与流动性",
    unit: "万亿美元",
    value: 3.067,
    asOf: "2026-05-27",
    source: "StreetStats / Federal Reserve H.4.1",
    frequency: "每周",
    thesis: "准备金下行会提高流动性事故概率，尤其在再融资高峰期。",
    rule: { mode: "lowerRisk", green: 3.4, yellow: 3.0, amber: 2.75 },
  },
  {
    id: "hySpread",
    name: "美国高收益债利差",
    category: "利率与流动性",
    unit: "bp",
    value: 272,
    asOf: "2026-05-28",
    source: "StreetStats / ICE BofA口径",
    frequency: "每日",
    thesis: "信用市场是否开始承认衰退与盈利风险。",
    rule: { mode: "higherRisk", green: 330, yellow: 430, amber: 550 },
  },
  {
    id: "buffettIndicator",
    name: "巴菲特指标",
    category: "市场脆弱性",
    unit: "%",
    value: 227,
    asOf: "2026-05-28",
    source: "buffettindicator.org / 公开市值GDP口径",
    frequency: "每日",
    thesis: "美股总市值相对GDP的估值压力表；历史高位代表市场对好消息依赖更强。",
    rule: { mode: "higherRisk", green: 135, yellow: 180, amber: 230 },
  },
  {
    id: "spxCrashProb",
    name: "SPX年内30%尾部下跌概率",
    category: "市场脆弱性",
    unit: "%",
    value: 9,
    asOf: "2026-01-28",
    source: "TS Lombard via Seeking Alpha",
    frequency: "每周",
    thesis: "不是崩盘预测，而是期权市场给尾部风险的价格；若风险上升而指数仍亢奋，保护会变贵。",
    rule: { mode: "higherRisk", green: 5, yellow: 8, amber: 12 },
  },
  {
    id: "privateCreditRedemptions",
    name: "私募信贷赎回压力",
    category: "私人信贷",
    unit: "%",
    value: 11.3,
    asOf: "2026-04-06",
    source: "Reuters / Barings fund filing",
    frequency: "事件",
    thesis: "Barings一只私募信贷基金一季度赎回请求占比；赎回超过流动性闸门是信用链条预警。",
    rule: { mode: "higherRisk", green: 5, yellow: 7.5, amber: 10 },
  },
  {
    id: "loanDefaultRate",
    name: "低评级贷款12个月违约率",
    category: "私人信贷",
    unit: "%",
    value: 5.5,
    asOf: "2026-01-31",
    source: "U.S. Bank / PitchBook LCD / Moody's",
    frequency: "每月",
    thesis: "流动性危机前，先观察公开杠杆贷款与私募信贷借款人的现金流恶化。",
    rule: { mode: "higherRisk", green: 3, yellow: 4.5, amber: 6 },
  },
  {
    id: "gold",
    name: "现货黄金",
    category: "黄金与避险",
    unit: "美元/盎司",
    value: 4520.06,
    asOf: "2026-05-27",
    source: "GoldPrice.org / GoldAPI口径",
    frequency: "每日",
    thesis: "油价极端化后的承接资产；关注实际利率、美元信用和央行购金。",
    rule: { mode: "higherRisk", green: 2800, yellow: 3300, amber: 3800 },
  },
  {
    id: "goldOilRatio",
    name: "金油比",
    category: "黄金与避险",
    unit: "倍",
    value: 47.35,
    asOf: "2026-05-27",
    source: "XAUUSD / Brent计算",
    frequency: "每日",
    thesis: "衡量黄金相对原油的防守性估值；油价上冲时比值下行，转黄金时观察修复。",
    rule: { mode: "rangeRisk", lowRed: 12, lowAmber: 18, highAmber: 38, highRed: 45 },
  },
  {
    id: "ndxBreadth",
    name: "纳指100成分股广度",
    category: "AI与美股",
    unit: "%高于200日线",
    value: 57.85,
    asOf: "2026-05-29",
    source: "Dean Financials / 美股200日线广度",
    frequency: "每日",
    thesis: "指数若由少数巨头托住，广度会先恶化。",
    rule: { mode: "lowerRisk", green: 65, yellow: 50, amber: 38 },
  },
  {
    id: "aiFcf",
    name: "AI链自由现金流覆盖率",
    category: "AI与美股",
    unit: "%",
    value: 62,
    asOf: "2026-05-27",
    source: "公司财报汇总",
    frequency: "季报",
    thesis: "用自由现金流覆盖资本开支，低于60%说明AI投资对外部融资和估值更敏感。",
    rule: { mode: "lowerRisk", green: 90, yellow: 70, amber: 55 },
  },
  {
    id: "vix",
    name: "VIX波动率",
    category: "AI与美股",
    unit: "点",
    value: 16.29,
    asOf: "2026-05-27",
    source: "StreetStats / CBOE",
    frequency: "每日",
    thesis: "低波动叠加高宏观风险时，代表保护成本仍未充分定价。",
    rule: { mode: "rangeRisk", lowRed: 10, lowAmber: 14, highAmber: 28, highRed: 36 },
  },
  {
    id: "sofrRate",
    name: "SOFR隔夜融资利率",
    category: "泡沫破裂前瞻",
    unit: "%",
    value: 3.62,
    asOf: "2026-05-28",
    source: "SOFRRate / New York Fed口径",
    frequency: "每日",
    thesis: "SOFR是最后确认型资金压力指标；若突然脱离政策利率走高，说明回购市场开始缺现金。",
    rule: { mode: "higherRisk", green: 3.8, yellow: 4.3, amber: 4.8 },
  },
  {
    id: "fundingSpreadProxy",
    name: "金融CP-SOFR利差代理",
    category: "泡沫破裂前瞻",
    unit: "bp",
    value: 9,
    asOf: "2026-05-27",
    source: "Federal Reserve H.15 / SOFR计算",
    frequency: "每日",
    thesis: "用金融商业票据利率与SOFR的差值近似观察FRA-OIS/TED压力；超过30bp代表银行间信用溢价开始抬升。",
    rule: { mode: "higherRisk", green: 15, yellow: 30, amber: 50 },
  },
  {
    id: "srfUsage",
    name: "美联储SRF使用量",
    category: "泡沫破裂前瞻",
    unit: "十亿美元",
    value: 0,
    asOf: "2026-05-27",
    source: "New York Fed repo operations / 手工复核",
    frequency: "每日",
    thesis: "SRF是私人回购市场失灵后的央行后门；频繁或大额使用代表交易商资产负债表被抵押品塞满。",
    rule: { mode: "higherRisk", green: 5, yellow: 25, amber: 75 },
  },
  {
    id: "swapLineUsage",
    name: "央行美元互换使用量",
    category: "泡沫破裂前瞻",
    unit: "十亿美元",
    value: 0.016,
    asOf: "2026-05-21",
    source: "Federal Reserve H.4.1",
    frequency: "每周",
    thesis: "美元互换额度是离岸美元荒的全球化确认信号；从零附近跳升通常意味着危机开始跨境传染。",
    rule: { mode: "higherRisk", green: 1, yellow: 10, amber: 50 },
  },
  {
    id: "moveIndex",
    name: "MOVE美债波动率",
    category: "泡沫破裂前瞻",
    unit: "点",
    value: 73.33,
    asOf: "2026-06-01",
    source: "StreetStats / ICE BofA MOVE",
    frequency: "每日",
    thesis: "MOVE衡量利率市场是否进入无序波动；若与VIX一起上行，股债流动性会同步承压。",
    rule: { mode: "higherRisk", green: 85, yellow: 110, amber: 140 },
  },
  {
    id: "cloAaaSpread",
    name: "CLO AAA利差",
    category: "泡沫破裂前瞻",
    unit: "bp",
    value: 126,
    asOf: "2026-05-27",
    source: "Octus CLO pipeline / CLO市场口径",
    frequency: "每周",
    thesis: "CLO AAA是杠杆贷款证券化管道的水温；若突然走阔，低评级贷款和私人信贷会先失血。",
    rule: { mode: "higherRisk", green: 140, yellow: 180, amber: 250 },
  },
  {
    id: "spacexIpoRaise",
    name: "SpaceX IPO融资目标",
    category: "泡沫破裂前瞻",
    unit: "十亿美元",
    value: 75,
    asOf: "2026-05-27",
    source: "Le Monde / Kiplinger / Axios",
    frequency: "事件",
    thesis: "巨型IPO会检验市场承接力；若定价、簿记或上市表现不佳，可能触发AI相关估值重估。",
    rule: { mode: "higherRisk", green: 20, yellow: 50, amber: 75 },
  },
  {
    id: "spacexValuation",
    name: "SpaceX IPO估值目标",
    category: "泡沫破裂前瞻",
    unit: "十亿美元",
    value: 1800,
    asOf: "2026-05-27",
    source: "Le Monde / Axios / 市场报道",
    frequency: "事件",
    thesis: "估值越高，越依赖AI与太空叙事的持续融资能力；破发会从叙事风险切到流动性风险。",
    rule: { mode: "higherRisk", green: 500, yellow: 1000, amber: 1750 },
  },
  {
    id: "deepseekPriceCut",
    name: "DeepSeek V4-Pro降价幅度",
    category: "泡沫破裂前瞻",
    unit: "%",
    value: 75,
    asOf: "2026-05-27",
    source: "Computerworld / DeepSeek公告口径",
    frequency: "事件",
    thesis: "AI推理价格快速下行会压缩高毛利叙事；若价格战持续，AI资本开支回报率会被重新估值。",
    rule: { mode: "higherRisk", green: 25, yellow: 50, amber: 75 },
  },
  {
    id: "copperProducerZ",
    name: "COMEX铜生产商净空头Z值",
    category: "泡沫破裂前瞻",
    unit: "Z",
    value: -2.2,
    asOf: "2026-05-27",
    source: "CFTC COT / 用户材料",
    frequency: "每周",
    thesis: "生产商极端净空通常代表现货商在高位积极套保；当投机资金同时拥挤做多时，是商品泡沫后段信号。",
    rule: { mode: "lowerRisk", green: -0.5, yellow: -1.5, amber: -2.0 },
  },
  {
    id: "copperManagedMoneyPct",
    name: "COMEX铜投机净多百分位",
    category: "泡沫破裂前瞻",
    unit: "%",
    value: 94,
    asOf: "2026-05-27",
    source: "CFTC COT / 用户材料",
    frequency: "每周",
    thesis: "投机资金接近历史高位净多，若价格冲高乏力，后续容易从逼空转为多头踩踏。",
    rule: { mode: "higherRisk", green: 70, yellow: 85, amber: 95 },
  },
  {
    id: "ashareNewAccounts",
    name: "个人投资者A股新增开户数",
    category: "A股散户情绪",
    unit: "万户/月",
    value: 248.03,
    asOf: "2026-04-30",
    source: "上交所数据 / 证券时报",
    frequency: "每月",
    thesis: "散户入场门票；4月环比降温但仍高于去年同期，说明情绪从脉冲式狂热回到活跃区。",
    rule: { mode: "higherRisk", green: 180, yellow: 350, amber: 500 },
  },
  {
    id: "ashareMarginBalance",
    name: "A股融资余额",
    category: "A股散户情绪",
    unit: "万亿元",
    value: 2.9109,
    asOf: "2026-05-26",
    source: "证券时报数据宝",
    frequency: "每日",
    thesis: "杠杆资金的总水位；突破历史高位说明风险偏好和追涨资金都在升温。",
    rule: { mode: "higherRisk", green: 2.2, yellow: 2.6, amber: 2.8 },
  },
  {
    id: "ashareMarginUsers",
    name: "两融参与人数",
    category: "A股散户情绪",
    unit: "万人",
    value: 64.05,
    asOf: "2026-05-11",
    source: "数据宝 / 新浪",
    frequency: "每日",
    thesis: "更激进的中大户资金扩张；人数创新高时，杠杆交易的脆弱性上升。",
    rule: { mode: "higherRisk", green: 45, yellow: 58, amber: 70 },
  },
  {
    id: "ashareMarginBuyRatio",
    name: "两融交易额占比",
    category: "A股散户情绪",
    unit: "%",
    value: 10.89,
    asOf: "2026-05-25",
    source: "新浪财经 / 数据宝",
    frequency: "每周",
    thesis: "两融交易额/A股成交额，可作为杠杆资金交易热度的高频替代指标；超过10%进入危险区，超过11%代表追涨明显过热。",
    rule: { mode: "higherRisk", green: 7, yellow: 10, amber: 11 },
  },
  {
    id: "ashareTurnover",
    name: "两市日均成交额",
    category: "A股散户情绪",
    unit: "亿元",
    value: 32385.6,
    asOf: "2026-05-27",
    source: "澎湃新闻 / 新浪财经收盘数据",
    frequency: "每日",
    thesis: "市场交投温度计；5月27日成交维持3.2万亿高位，但个股普跌说明分歧和结构拥挤在放大。",
    rule: { mode: "higherRisk", green: 15000, yellow: 20000, amber: 25000 },
  },
  {
    id: "ashareEquityFundIssuance",
    name: "权益类新基金首募",
    category: "A股散户情绪",
    unit: "亿元/年内",
    value: 2660,
    asOf: "2026-05-20",
    source: "上证报 / 新浪财经",
    frequency: "每周",
    thesis: "基金渠道入市热度；爆款基金增多通常是行情中后期的同步/微滞后信号。",
    rule: { mode: "higherRisk", green: 1000, yellow: 2000, amber: 4000 },
  },
  {
    id: "ashareLimitUpCount",
    name: "涨停家数",
    category: "A股散户情绪",
    unit: "家",
    value: 60,
    asOf: "2026-05-27",
    source: "雪球/收盘复盘口径",
    frequency: "每日",
    thesis: "短线投机情绪；约60只涨停但近4500只个股下跌，说明热点仍在但市场广度明显恶化。",
    rule: { mode: "higherRisk", green: 50, yellow: 100, amber: 150 },
  },
  {
    id: "ashareSmallOrderInflow",
    name: "小单资金净流入",
    category: "A股散户情绪",
    unit: "亿元",
    value: 12500,
    asOf: "2026-04-03",
    source: "新浪新闻资金流向报道",
    frequency: "每周",
    thesis: "散户真金白银；越跌越买可支撑市场，但若机构同步流出，容易形成散户接盘结构。",
    rule: { mode: "higherRisk", green: 1000, yellow: 5000, amber: 10000 },
  },
  {
    id: "ashareSearchHeat",
    name: "搜索/社媒关注热度",
    category: "A股散户情绪",
    unit: "分位",
    value: null,
    asOf: "",
    source: "百度指数 / 微信指数 / 抖音热榜",
    frequency: "每周",
    thesis: "最先行的注意力指标；突破过去一年90%分位时，代表散户心动阶段明显升温。",
    rule: { mode: "higherRisk", green: 60, yellow: 80, amber: 90 },
  },
  {
    id: "ashareAppHeat",
    name: "券商APP活跃度",
    category: "A股散户情绪",
    unit: "分",
    value: null,
    asOf: "",
    source: "七麦数据 / QuestMobile / 券商APP榜单",
    frequency: "每周",
    thesis: "开户和交易前置动作；下载排名和DAU通常领先开户数1-2周。",
    rule: { mode: "higherRisk", green: 6, yellow: 8, amber: 9 },
  },
];

const seedRecords = [
  ["brent", "2026-03-31", 88, "风险溢价尚未完全进入油价"],
  ["brent", "2026-04-15", 96, "航运担忧升温"],
  ["brent", "2026-05-01", 103, "库存压力显性化"],
  ["brent", "2026-05-19", 110.42, "谈判乐观前的风险溢价高位"],
  ["brent", "2026-05-20", 105.02, "谈判消息压制，供需风险未解除"],
  ["brent", "2026-05-27", 95.46, "美伊协议预期压低油价，但通行风险仍未清零"],
  ["wti", "2026-05-19", 103.15, "消息缓和前的高位"],
  ["wti", "2026-05-20", 98.26, "Reuters记录：单日回落约6%"],
  ["wti", "2026-05-27", 88.68, "WTI跌破90美元，市场交易和平预期"],
  ["usCrudeInv", "2026-05-15", 445, "EIA周报：商业原油库存继续下降"],
  ["usCrudeInv", "2026-05-22", 441.7, "EIA周报：商业原油库存下降3.327百万桶"],
  ["distillate", "2026-03-31", 116, "五年区间下沿附近"],
  ["distillate", "2026-04-15", 111, "库存继续下降"],
  ["distillate", "2026-05-01", 106, "柴油链条偏紧"],
  ["distillate", "2026-05-20", 102.5, "当前观察盘：接近100百万桶压力线"],
  ["distillate", "2026-05-22", 100.8, "馏分油库存继续逼近100百万桶压力线"],
  ["ust10y", "2026-03-31", 4.15, "长债压力温和"],
  ["ust10y", "2026-04-15", 4.35, "降息预期削弱"],
  ["ust10y", "2026-05-01", 4.48, "估值折现率上行"],
  ["ust10y", "2026-05-20", 4.67, "长债进入估值压制区间"],
  ["ust10y", "2026-05-21", 4.604, "油价消息回落后，利率压力仍未消失"],
  ["ust10y", "2026-05-27", 4.48, "H.15口径：10年美债收益率仍处高估值压力区"],
  ["spxPe", "2026-03-31", 19.4, "估值偏高但尚可解释"],
  ["spxPe", "2026-04-15", 20.1, "AI权重继续托估值"],
  ["spxPe", "2026-05-01", 20.6, "安全垫收窄"],
  ["spxPe", "2026-05-20", 20.8, "示例当前值"],
  ["spxPe", "2026-05-27", 22.52, "S&P 500 FY1估值进入高压力区"],
  ["mag7Capex", "2026-03-31", 650, "AI投资维持高位"],
  ["mag7Capex", "2026-04-15", 720, "CapEx指引上修"],
  ["mag7Capex", "2026-05-01", 790, "融资与电力约束升温"],
  ["mag7Capex", "2026-05-20", 830, "当前观察盘：AI资本开支维持高强度"],
  ["gold", "2026-03-31", 3050, "央行购金支撑"],
  ["gold", "2026-04-15", 3180, "避险需求升温"],
  ["gold", "2026-05-01", 3280, "实际利率与避险拉扯"],
  ["gold", "2026-05-20", 4489, "当前观察盘：黄金位于高位避险区间"],
  ["gold", "2026-05-27", 4520.06, "金价高位震荡，避险需求仍在"],
  ["hormuzCrossings", "2026-05-20", 26, "通行边际改善，但远低于战前正常水平"],
  ["hormuzCrossings", "2026-05-27", 26, "通行仍未恢复到战前约130艘/日"],
  ["brentFrontSpread", "2026-05-20", 20, "近端紧张较高点回落但仍显著"],
  ["brentFrontSpread", "2026-05-27", 12, "曲线较此前高点变浅，但仍保持倒挂"],
  ["ieaOilDeficit", "2026-05-13", 1.78, "IEA五月报告仍预估全年赤字"],
  ["buffettIndicator", "2026-05-19", 252, "美国总市值/GDP处于强高估区"],
  ["buffettIndicator", "2026-05-28", 227, "总市值/GDP仍显著高于历史常态"],
  ["privateCreditRedemptions", "2026-04-06", 11.3, "赎回请求明显高于常见流动性闸门"],
  ["loanDefaultRate", "2026-01-31", 5.5, "低评级贷款违约率偏高"],
  ["sofrRate", "2026-05-28", 3.62, "SOFR仍贴近政策利率，尚未失控"],
  ["fundingSpreadProxy", "2026-05-27", 9, "金融CP-SOFR利差仍在正常区间"],
  ["srfUsage", "2026-05-27", 0, "SRF未出现大额使用"],
  ["swapLineUsage", "2026-05-21", 0.016, "央行美元互换使用量接近零"],
  ["moveIndex", "2026-06-01", 73.33, "美债波动率回落到相对平静区间"],
  ["hySpread", "2026-05-28", 272, "高收益债OAS仍处低位，信用市场尚未承认压力"],
  ["cloAaaSpread", "2026-05-27", 126, "CLO AAA利差仍紧，证券化管道未明显失血"],
  ["spacexIpoRaise", "2026-05-27", 75, "SpaceX拟融资规模创纪录，检验市场承接力"],
  ["spacexValuation", "2026-05-27", 1800, "SpaceX目标估值接近历史最大IPO级别"],
  ["deepseekPriceCut", "2026-05-27", 75, "DeepSeek V4-Pro降价确认AI推理价格战"],
  ["copperProducerZ", "2026-05-27", -2.2, "铜生产商净空头进入极端区域"],
  ["copperManagedMoneyPct", "2026-05-27", 94, "铜投机资金净多接近历史高位"],
  ["ashareNewAccounts", "2026-01-31", 491.58, "开年开户热度高"],
  ["ashareNewAccounts", "2026-02-28", 252.3, "春节因素后回落"],
  ["ashareNewAccounts", "2026-03-31", 460.14, "环比增长82.38%，散户入场加速"],
  ["ashareNewAccounts", "2026-04-30", 248.03, "4月个人投资者开户环比明显降温"],
  ["ashareMarginBalance", "2026-05-08", 2.8, "融资余额首次突破2.8万亿元"],
  ["ashareMarginBalance", "2026-05-11", 2.8339, "两融余额刷新历史高位"],
  ["ashareMarginBalance", "2026-05-25", 2.9035, "融资余额首次突破2.9万亿元"],
  ["ashareMarginBalance", "2026-05-26", 2.9109, "融资余额继续抬升"],
  ["ashareMarginUsers", "2026-05-11", 64.05, "参与两融交易人数创阶段新高"],
  ["ashareMarginBuyRatio", "2026-03-20", 9.01, "接近危险区但未突破11%极端线"],
  ["ashareMarginBuyRatio", "2026-05-25", 10.89, "两融交易额占A股成交额约10.89%"],
  ["ashareTurnover", "2026-04-30", 23437.9, "央行披露4月两市日均成交额"],
  ["ashareTurnover", "2026-05-27", 32385.6, "两市成交额维持3.2万亿高位但市场广度恶化"],
  ["ashareEquityFundIssuance", "2026-05-20", 2660, "权益类新基金年内首募升温"],
  ["ashareLimitUpCount", "2026-05-21", 40, "调整日涨停家数回落，短线情绪降温"],
  ["ashareLimitUpCount", "2026-05-27", 60, "约60只涨停但近4500只股票下跌"],
  ["ashareSmallOrderInflow", "2026-04-03", 12500, "3月以来小单累计净流入"],
];

const categories = ["全部类别", ...new Set(defaultIndicators.map((item) => item.category))];

const events = [
  {
    cadence: "每日",
    title: "油价、黄金、长债、美元、VIX",
    body: "更新布伦特、WTI、XAUUSD、10年美债、DXY、VIX和信用利差，观察三重压力是否同步升温。",
  },
  {
    cadence: "每周",
    title: "API / EIA原油与馏分油库存",
    body: "关注商业原油、馏分油、炼厂开工率、Cushing、SPR和隐含需求。",
  },
  {
    cadence: "每周",
    title: "流动性与财政抽水",
    body: "跟踪TGA、RRP、银行准备金、票据发行和长债拍卖结果。",
  },
  {
    cadence: "每周",
    title: "私人信贷与CLO压力",
    body: "跟踪BDC净值、PIK占比、开放式基金赎回/闸门、杠杆贷款违约率和CLO价差。",
  },
  {
    cadence: "每月",
    title: "CPI / PPI / PCE",
    body: "记录同比、环比、三个月年化、能源分项、房租、超级核心服务。",
  },
  {
    cadence: "每月",
    title: "IEA / OPEC月报",
    body: "比较需求预测、剩余产能、库存变化和供应缺口假设。",
  },
  {
    cadence: "季报",
    title: "AI资本开支与现金流",
    body: "检查云厂商CapEx、数据中心电力约束、自由现金流覆盖率和回报率指引。",
  },
];

const ashareMonitorRows = [
  {
    dimension: "散户规模",
    id: "ashareNewAccounts",
    threshold: "危险区 >350万户；狂热区 >500万户",
    logic: "开户数是滞后确认指标，激增代表赚钱效应已经扩散。",
  },
  {
    dimension: "散户规模",
    id: "ashareMarginUsers",
    threshold: "活跃区 >60万人",
    logic: "两融参与人数扩张，代表高风险偏好群体正在扩大。",
  },
  {
    dimension: "注意力",
    id: "ashareSearchHeat",
    threshold: "过去一年90%分位以上",
    logic: "搜索和社媒热度通常领先开户与转账，是心动阶段的先行信号。",
  },
  {
    dimension: "注意力",
    id: "ashareAppHeat",
    threshold: "9-10分为过热",
    logic: "券商APP下载和DAU上升，常领先开户数1-2周。",
  },
  {
    dimension: "杠杆资金",
    id: "ashareMarginBuyRatio",
    threshold: "危险区 >10%；极度危险 >11%",
    logic: "融资买入额占比越高，行情越依赖杠杆追涨，回撤弹性越大。",
  },
  {
    dimension: "杠杆资金",
    id: "ashareMarginBalance",
    threshold: "高位区 >2.6万亿；极端区 >2.8万亿",
    logic: "融资余额是杠杆资金总水位，连续新高需警惕踩踏风险。",
  },
  {
    dimension: "交易热度",
    id: "ashareTurnover",
    threshold: "活跃区 >2万亿；狂热区 >2.5万亿",
    logic: "成交额是温度计，放量上涨是燃料，放量滞涨是分歧。",
  },
  {
    dimension: "交易热度",
    id: "ashareLimitUpCount",
    threshold: "活跃区 >100家；投机区 >150家",
    logic: "涨停潮代表赚钱效应扩散；若指数新高但涨停减少，是顶背离。",
  },
  {
    dimension: "基金渠道",
    id: "ashareEquityFundIssuance",
    threshold: "升温 >2000亿；狂热 >4000亿",
    logic: "爆款基金与比例配售往往出现在行情中后期。",
  },
  {
    dimension: "散户资金",
    id: "ashareSmallOrderInflow",
    threshold: "周度极值 >200亿；累计极值需谨慎",
    logic: "小单持续净流入可支撑市场，但机构流出时可能演变为散户接盘。",
  },
];

const ashareSignalGroups = [
  {
    title: "心动：注意力先行",
    body: "搜索指数、社媒讨论、券商APP下载和DAU先动，通常领先开户与转账。",
    ids: ["ashareSearchHeat", "ashareAppHeat"],
  },
  {
    title: "行动：资金开始入场",
    body: "开户、基金申购、银证转账和ETF净申购共振，确认赚钱效应扩散。",
    ids: ["ashareNewAccounts", "ashareEquityFundIssuance"],
  },
  {
    title: "加速：杠杆与成交放大",
    body: "两融余额、融资买入占比和成交额同步抬升，进入高波动阶段。",
    ids: ["ashareMarginBalance", "ashareMarginBuyRatio", "ashareTurnover"],
  },
  {
    title: "过热：顶背离风险",
    body: "指数创新高但涨停、广度、融资买入或基金热度不再创新高，是动能衰竭信号。",
    ids: ["ashareLimitUpCount", "ashareSmallOrderInflow"],
  },
];

const ashareHistory = [
  {
    period: "2006-2007",
    signal: "2007年8月开户数突破800万户",
    after: "约2个月后上证指数见6124点历史大顶，随后进入熊市。",
  },
  {
    period: "2009",
    signal: "2月开户放量，7月继续升温",
    after: "8月指数见3478点，开户与高点几乎同步，后续转为震荡。",
  },
  {
    period: "2014-2015",
    signal: "2015年4-6月月均开户超400万户",
    after: "6月见顶后快速股灾，开户和杠杆同步过热是核心风险。",
  },
  {
    period: "2021",
    signal: "存款搬家但开户未极端化",
    after: "核心资产见顶后结构性调整，说明资金面不能替代业绩兑现。",
  },
  {
    period: "2024-2025",
    signal: "2024年10月开户脉冲",
    after: "短期冲高后震荡，政策和产业基本面决定后续能否再走强。",
  },
];

const bubbleStages = [
  {
    title: "01 导火索：估值神话开始承压",
    body: "SpaceX 超大规模融资、AI 模型价格战、科技股高估值共同构成叙事层压力。当前红灯主要集中在这里，说明市场还在狂欢，但对资金承接力的要求已经很高。",
    ids: ["spacexValuation", "spacexIpoRaise", "deepseekPriceCut", "spxPe", "mag7Capex"],
  },
  {
    title: "02 微观资金：非银融资压力",
    body: "SOFR、金融 CP-SOFR 利差、SRF 和央行互换额度用于确认美元融资是否真正紧张。现在这些指标仍偏绿，意味着流动性危机尚未全面爆发。",
    ids: ["sofrRate", "fundingSpreadProxy", "srfUsage", "swapLineUsage"],
  },
  {
    title: "03 资产失血：信用与波动确认",
    body: "VIX、MOVE、高收益债 OAS、CLO AAA 利差会在风险偏好塌陷后快速变色。若这些指标从绿灯同步转黄或转红，估值回调就会切换成去杠杆。",
    ids: ["vix", "moveIndex", "hySpread", "cloAaaSpread", "privateCreditRedemptions"],
  },
  {
    title: "04 跨市场传染：拥挤仓位反转",
    body: "COMEX 铜的生产商极端套保和投机净多显示商品端拥挤度很高。若美元、黄金、商品和股票同时出现异常波动，说明资金开始跨市场撤退。",
    ids: ["copperProducerZ", "copperManagedMoneyPct", "dxy", "gold", "rrp", "bankReserves"],
  },
];

const bubbleMonitorRows = [
  {
    layer: "导火索",
    id: "spacexValuation",
    threshold: ">10000亿美元进入叙事极端；>17500亿美元为红灯",
    logic: "巨型 IPO 是流动性试金石。高估值需要极强承接力，一旦定价、认购或上市表现不佳，AI 科技股会被迫重估。",
  },
  {
    layer: "导火索",
    id: "spacexIpoRaise",
    threshold: ">500亿美元为黄灯；>750亿美元为红灯",
    logic: "融资规模越大，对市场现金的抽水越强；若与财政发债、AI 融资潮同频，会放大美元流动性压力。",
  },
  {
    layer: "导火索",
    id: "deepseekPriceCut",
    threshold: "降价>50%为黄灯；>75%为红灯",
    logic: "模型降价说明 AI 推理正进入价格战。它会压低毛利率预期，使市场重新审视高 CapEx 的投资回报。",
  },
  {
    layer: "估值",
    id: "spxPe",
    threshold: "远期 PE >20.5 倍偏贵；>22.5 倍进入高压区",
    logic: "估值越高，越依赖低利率和高增长叙事。若长债收益率不下行，估值安全垫会很薄。",
  },
  {
    layer: "资金压力",
    id: "fundingSpreadProxy",
    threshold: ">30bp 为融资压力；>50bp 为危机确认",
    logic: "用金融 CP-SOFR 近似观察 FRA-OIS/TED 压力。利差突然走阔意味着银行间信用溢价开始抬升。",
  },
  {
    layer: "资金压力",
    id: "sofrRate",
    threshold: ">4.3% 转黄；>4.8% 转红",
    logic: "SOFR 通常是后验确认指标；若与政策利率明显脱钩上行，说明回购市场现金开始不足。",
  },
  {
    layer: "央行后门",
    id: "srfUsage",
    threshold: ">250亿美元需警惕；>750亿美元为红灯",
    logic: "SRF 使用量上升说明私人回购市场承接能力不足，交易商资产负债表被抵押品挤压。",
  },
  {
    layer: "全球美元荒",
    id: "swapLineUsage",
    threshold: ">100亿美元转黄；>500亿美元为红灯",
    logic: "央行美元互换额度激增通常意味着离岸美元紧张，危机从局部传导到全球。",
  },
  {
    layer: "信用失血",
    id: "hySpread",
    threshold: ">400bp 转黄；>600bp 为红灯",
    logic: "高收益债 OAS 是烧钱企业融资成本的温度计。若快速走阔，AI 和私募信贷链条会先承压。",
  },
  {
    layer: "信用失血",
    id: "cloAaaSpread",
    threshold: ">180bp 转黄；>250bp 为红灯",
    logic: "CLO 是杠杆贷款的核心通道。AAA 利差走阔说明证券化买盘开始要求更高风险补偿。",
  },
  {
    layer: "波动确认",
    id: "vix",
    threshold: "低于14说明风险被低估；高于28说明恐慌升温",
    logic: "当前 VIX 不高，说明保护成本仍便宜；若突然上穿 25-30，市场可能从乐观切到强制保护。",
  },
  {
    layer: "波动确认",
    id: "moveIndex",
    threshold: ">110 转黄；>140 为红灯",
    logic: "MOVE 衡量美债波动。若股债波动同时升温，流动性压力会从权益扩散到抵押品市场。",
  },
  {
    layer: "拥挤仓位",
    id: "copperProducerZ",
    threshold: "Z<-1.5 偏热；Z<-2.0 极端",
    logic: "生产商极端净空意味着实体端在高位积极套保，通常不是左侧买入信号，而是后段风险提示。",
  },
  {
    layer: "拥挤仓位",
    id: "copperManagedMoneyPct",
    threshold: ">85% 偏热；>95% 极端",
    logic: "投机资金接近历史高位净多。若价格无法继续上行，多头踩踏会放大商品端波动。",
  },
];

const roadmap = [
  {
    id: "stage1",
    title: "第一阶段：6月逐步建仓原油",
    trigger: "布伦特站稳110-120美元，库存继续下降，美伊谈判没有实质缓和。",
    risk: "若布伦特跌回90美元下方，降低风险敞口。",
    allocation: [
      ["原油/能源敞口", 20, 35, "oil"],
      ["黄金", 10, 15, "gold"],
      ["现金/短债", 30, 40, "cash"],
      ["防守权益", 10, 20, "equity"],
    ],
  },
  {
    id: "stage2",
    title: "第二阶段：趋势确认后加仓能源",
    trigger: "布伦特突破120-130美元，10年美债逼近4.8%-5.0%。",
    risk: "关注政策干预、SPR释放和需求破坏迹象。",
    allocation: [
      ["原油/能源敞口", 35, 50, "oil"],
      ["黄金", 10, 20, "gold"],
      ["现金/短债", 20, 30, "cash"],
      ["美股低配", 5, 15, "equity"],
    ],
  },
  {
    id: "stage3",
    title: "第三阶段：油价破150后切换黄金",
    trigger: "布伦特上破150美元，市场开始交易衰退、信用和政策转向。",
    risk: "避免在极端油价阶段继续线性追高原油。",
    allocation: [
      ["黄金", 35, 50, "gold"],
      ["原油/能源敞口", 15, 25, "oil"],
      ["现金/短债", 20, 30, "cash"],
      ["防守权益", 5, 15, "equity"],
    ],
  },
];

let state = loadState();

function loadState() {
  const raw = localStorage.getItem(STORE_KEY);
  if (!raw) {
    return cloneDefaultState();
  }
  try {
    const parsed = JSON.parse(raw);
    if (!parsed.indicators || !parsed.records) return cloneDefaultState();
    return mergeStoredState(parsed);
  } catch {
    return cloneDefaultState();
  }
}

  function mergeStoredState(stored) {
    const storedById = new Map(stored.indicators.map((indicator) => [indicator.id, indicator]));
    const indicators = defaultIndicators.map((indicator) => {
      const saved = storedById.get(indicator.id);
      return saved ? { ...clone(indicator), ...saved, rule: clone(indicator.rule) } : clone(indicator);
    });
    const extraIndicators = stored.indicators.filter((indicator) => !defaultIndicators.some((item) => item.id === indicator.id));
    const records = Array.isArray(stored.records) ? clone(stored.records) : [];
    const existingSeedKeys = new Set(records.map((record) => `${record.indicatorId}|${record.date}|${record.value}`));
    seedRecords.forEach(([indicatorId, date, value, note]) => {
      const key = `${indicatorId}|${date}|${value}`;
      if (!existingSeedKeys.has(key)) {
        records.push({
          id: uid(),
          indicatorId,
          date,
          value,
          note,
          createdAt: new Date().toISOString(),
        });
      }
    });
    return {
      indicators: [...indicators, ...extraIndicators],
      records,
    };
  }

function cloneDefaultState() {
  return {
    indicators: clone(defaultIndicators),
    records: seedRecords.map(([indicatorId, date, value, note]) => ({
      id: uid(),
      indicatorId,
      date,
      value,
      note,
      createdAt: new Date().toISOString(),
    })),
  };
}

function clone(value) {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function uid() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function byId(id) {
  return state.indicators.find((item) => item.id === id);
}

function formatValue(indicator) {
  if (indicator.value === null || indicator.value === undefined || Number.isNaN(Number(indicator.value))) {
    return "未录入";
  }
  const value = Number(indicator.value);
  const decimals = Math.abs(value) < 10 ? 2 : value % 1 === 0 ? 0 : 1;
  return `${value.toFixed(decimals)} ${indicator.unit}`;
}

function getStatus(indicator) {
  if (indicator.value === null || indicator.value === undefined || indicator.value === "") {
    return { level: "yellow", label: "待录入", score: 1 };
  }
  const value = Number(indicator.value);
  const rule = indicator.rule;
  if (!rule || Number.isNaN(value)) return { level: "yellow", label: "待确认", score: 1 };

  let level = "green";
  if (rule.mode === "higherRisk") {
    if (value <= rule.green) level = "green";
    else if (value <= rule.yellow) level = "yellow";
    else if (value <= rule.amber) level = "amber";
    else level = "red";
  }

  if (rule.mode === "lowerRisk") {
    if (value >= rule.green) level = "green";
    else if (value >= rule.yellow) level = "yellow";
    else if (value >= rule.amber) level = "amber";
    else level = "red";
  }

  if (rule.mode === "rangeRisk") {
    if (value <= rule.lowRed || value >= rule.highRed) level = "red";
    else if (value <= rule.lowAmber || value >= rule.highAmber) level = "amber";
    else level = "green";
  }

  return { level, ...statusMeta[level] };
}

function createStatusBadge(indicator) {
  const status = getStatus(indicator);
  return `<span class="status-badge"><span class="status-dot ${status.level}"></span>${status.label}</span>`;
}

function setTrafficLight(el, level) {
  const redActive = level === "red" || level === "amber";
  const yellowActive = level === "yellow" || level === "amber";
  const greenActive = level === "green";
  el.innerHTML = `
    <span class="red ${redActive ? "active" : ""}"></span>
    <span class="yellow ${yellowActive ? "active" : ""}"></span>
    <span class="green ${greenActive ? "active" : ""}"></span>
  `;
}

function getCriticalIndicators() {
  return [
    "brent",
    "hormuzCrossings",
    "ieaOilDeficit",
    "ust10y",
    "spxPe",
    "buffettIndicator",
    "spacexValuation",
    "fundingSpreadProxy",
    "privateCreditRedemptions",
    "mag7Capex",
  ]
    .map(byId)
    .filter(Boolean);
}

function getOverallStatus() {
  const critical = getCriticalIndicators();
  const avg = critical.reduce((sum, item) => sum + getStatus(item).score, 0) / critical.length;
  const redCount = critical.filter((item) => getStatus(item).level === "red").length;
  if (redCount >= 2 || avg >= 2.35) return { level: "red", label: "红灯", reason: "多个核心指标进入压力区，需优先控制回撤。" };
  if (avg >= 1.45) return { level: "amber", label: "黄灯偏红", reason: "油价、长债与AI估值压力同时存在。" };
  if (avg >= 0.7) return { level: "yellow", label: "黄灯", reason: "风险升温但尚未形成共振。" };
  return { level: "green", label: "绿灯", reason: "核心压力指标处于可控区间。" };
}

function currentStageId() {
  const brent = Number(byId("brent")?.value || 0);
  if (brent >= 150) return "stage3";
  if (brent >= 120) return "stage2";
  return "stage1";
}

function renderAll() {
  renderNavCounts();
  renderOverall();
  renderSummary();
  renderTriggers();
  renderWatchPanels();
  renderChartOptions();
  renderTrendChart();
  renderFilters();
  renderIndicatorTable();
  renderAshare();
  renderBubble();
  renderEntryOptions();
  renderRecentRecords();
  renderRoadmap();
  renderEvents();
}

function renderNavCounts() {
  document.getElementById("recordCount").textContent = state.records.length;
}

function renderOverall() {
  const overall = getOverallStatus();
  setTrafficLight(document.getElementById("overallLight"), overall.level);
  document.getElementById("overallStatus").textContent = overall.label;
  document.getElementById("overallReason").textContent = overall.reason;
}

function renderSummary() {
  const grid = document.getElementById("summaryGrid");
  grid.innerHTML = getCriticalIndicators()
    .map((indicator) => {
      const status = getStatus(indicator);
      return `
        <article class="metric-card">
          <div class="metric-top">
            <h3>${indicator.name}</h3>
            <span class="status-dot ${status.level}" title="${status.label}"></span>
          </div>
          <div class="metric-value">${formatValue(indicator)}</div>
          <p>${indicator.thesis}</p>
        </article>
      `;
    })
    .join("");
}

function renderTriggers() {
  const stage = roadmap.find((item) => item.id === currentStageId());
  document.getElementById("stagePill").textContent = stage.title.split("：")[0];

  const checks = [
    {
      indicator: byId("brent"),
      title: "原油趋势",
      body: "布伦特站稳110-120美元进入建仓窗口；120-130美元确认趋势；150美元后考虑转黄金。",
    },
    {
      indicator: byId("ust10y"),
      title: "长债压力",
      body: "10年美债逼近4.8%-5.0%时，高估值AI链的折现率压力会显著加大。",
    },
    {
      indicator: byId("distillate"),
      title: "柴油链条",
      body: "馏分油库存若跌破100百万桶，供应短缺从叙事变成实体约束。",
    },
    {
      indicator: byId("mag7Capex"),
      title: "AI FOMO",
      body: "资本开支继续上修但现金流覆盖不足时，市场会开始审视回报率。",
    },
    {
      indicator: byId("privateCreditRedemptions"),
      title: "私人信贷赎回",
      body: "赎回压力或闸门事件若扩散，风险会从估值回撤切到流动性抛售。",
    },
    {
      indicator: byId("buffettIndicator"),
      title: "估值缓冲垫",
      body: "总市值/GDP处于极高区间时，市场还能反复，但每次利好都更依赖流动性支撑。",
    },
  ];

  document.getElementById("triggerList").innerHTML = checks
    .map(({ indicator, title, body }) => {
      const status = getStatus(indicator);
      return `
        <div class="trigger-item">
          <span class="status-dot ${status.level}"></span>
          <div>
            <strong>${title}：${formatValue(indicator)}</strong>
            <p>${body}</p>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderWatchPanels() {
  renderWatchGrid("fragilityGrid", [
    "buffettIndicator",
    "spxCrashProb",
    "privateCreditRedemptions",
    "loanDefaultRate",
  ]);
  renderWatchGrid("oilPulseGrid", [
    "brent",
    "wti",
    "hormuzCrossings",
    "brentFrontSpread",
    "ieaOilDeficit",
  ]);
}

function renderWatchGrid(id, indicatorIds) {
  const grid = document.getElementById(id);
  if (!grid) return;
  grid.innerHTML = indicatorIds
    .map(byId)
    .filter(Boolean)
    .map((indicator) => {
      const status = getStatus(indicator);
      return `
        <article class="watch-item">
          <div class="watch-head">
            <strong>${indicator.name}</strong>
            <span class="status-dot ${status.level}" title="${status.label}"></span>
          </div>
          <div class="watch-value">${formatValue(indicator)}</div>
          <p>${indicator.thesis}</p>
          <span>${indicator.asOf} · ${indicator.source}</span>
        </article>
      `;
    })
    .join("");
}

function renderChartOptions() {
  const select = document.getElementById("chartIndicator");
  const current = select.value || "brent";
  select.innerHTML = state.indicators
    .map((item) => `<option value="${item.id}">${item.name}</option>`)
    .join("");
  select.value = byId(current) ? current : "brent";
}

function getRecordsFor(indicatorId) {
  return state.records
    .filter((record) => record.indicatorId === indicatorId)
    .sort((a, b) => a.date.localeCompare(b.date));
}

function renderTrendChart() {
  const svg = document.getElementById("trendChart");
  const indicator = byId(document.getElementById("chartIndicator").value || "brent");
  const records = getRecordsFor(indicator.id);
  const width = 900;
  const height = 260;
  const pad = 42;
  svg.innerHTML = "";

  if (!records.length) {
    svg.innerHTML = `<text x="450" y="135" text-anchor="middle" fill="#a8a296">暂无历史记录</text>`;
    return;
  }

  const values = records.map((record) => Number(record.value));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || Math.max(1, Math.abs(max) * 0.08);
  const yMin = min - span * 0.15;
  const yMax = max + span * 0.15;
  const points = records.map((record, index) => {
    const x = records.length === 1 ? width / 2 : pad + (index * (width - pad * 2)) / (records.length - 1);
    const y = height - pad - ((Number(record.value) - yMin) / (yMax - yMin)) * (height - pad * 2);
    return { x, y, record };
  });

  const path = points.map((point) => `${point.x},${point.y}`).join(" ");
  const grid = [0, 1, 2, 3].map((tick) => {
    const y = pad + (tick * (height - pad * 2)) / 3;
    const value = yMax - (tick * (yMax - yMin)) / 3;
    return `
      <line x1="${pad}" x2="${width - pad}" y1="${y}" y2="${y}" stroke="#2f312b" />
      <text x="12" y="${y + 4}" fill="#a8a296" font-size="12">${value.toFixed(1)}</text>
    `;
  });

  svg.innerHTML = `
    <rect x="0" y="0" width="${width}" height="${height}" fill="#11120f"></rect>
    ${grid.join("")}
    <polyline points="${path}" fill="none" stroke="#d7ad53" stroke-width="3"></polyline>
    ${points
      .map(
        (point) => `
        <circle cx="${point.x}" cy="${point.y}" r="5" fill="#d7ad53"></circle>
        <text x="${point.x}" y="${height - 14}" text-anchor="middle" fill="#a8a296" font-size="12">${point.record.date.slice(5)}</text>
      `,
      )
      .join("")}
    <text x="${pad}" y="24" fill="#f1eee5" font-size="16" font-weight="700">${indicator.name}（${indicator.unit}）</text>
  `;
}

function renderFilters() {
  const categoryFilter = document.getElementById("categoryFilter");
  if (categoryFilter.options.length === 0) {
    categoryFilter.innerHTML = categories.map((category) => `<option value="${category}">${category}</option>`).join("");
  }
}

function renderIndicatorTable() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const category = document.getElementById("categoryFilter").value || "全部类别";
  const statusFilter = document.getElementById("statusFilter").value || "all";

  const rows = state.indicators.filter((indicator) => {
    const status = getStatus(indicator).level;
    const text = `${indicator.name} ${indicator.category} ${indicator.source} ${indicator.thesis}`.toLowerCase();
    return (
      (category === "全部类别" || indicator.category === category) &&
      (statusFilter === "all" || status === statusFilter) &&
      (!query || text.includes(query))
    );
  });

  document.getElementById("indicatorTable").innerHTML = rows
    .map(
      (indicator) => `
      <tr>
        <td>
          <div class="indicator-name">
            <strong>${indicator.name}</strong>
            <span>${indicator.category}</span>
          </div>
        </td>
        <td>${formatValue(indicator)}</td>
        <td>${createStatusBadge(indicator)}</td>
        <td>${indicator.thesis}</td>
        <td>${indicator.source}<br><span class="muted">${indicator.frequency}</span></td>
        <td>${indicator.asOf || "未录入"}</td>
      </tr>
    `,
    )
    .join("");
}

function renderAshare() {
  const rows = ashareMonitorRows
    .map((row) => ({ ...row, indicator: byId(row.id) }))
    .filter((row) => row.indicator);
  const scored = rows.filter((row) => row.indicator.value !== null && row.indicator.value !== undefined && row.indicator.value !== "");
  const heatScore = scored.length
    ? Math.round((scored.reduce((sum, row) => sum + getStatus(row.indicator).score, 0) / (scored.length * 3)) * 100)
    : 0;
  const status =
    heatScore >= 82 ? "狂热预警" : heatScore >= 62 ? "升温偏热" : heatScore >= 42 ? "活跃观察" : "冷静区间";
  const reason =
    heatScore >= 82
      ? "多维指标进入过热区，重点观察顶背离和杠杆松动。"
      : heatScore >= 62
        ? "资金入市进行中，波动会比趋势早一步放大。"
        : heatScore >= 42
          ? "情绪活跃但尚未形成全面共振。"
          : "散户情绪尚未进入高温区。";

  document.getElementById("ashareScore").textContent = `${heatScore}`;
  document.getElementById("ashareStatus").textContent = status;
  document.getElementById("ashareReason").textContent = reason;

  document.getElementById("ashareHeatGrid").innerHTML = ashareSignalGroups
    .map((group) => {
      const groupIndicators = group.ids.map(byId).filter(Boolean);
      const hotCount = groupIndicators.filter((indicator) => ["amber", "red"].includes(getStatus(indicator).level)).length;
      return `
        <article class="ashare-card">
          <div class="ashare-card-head">
            <strong>${group.title}</strong>
            <span>${hotCount}/${groupIndicators.length}</span>
          </div>
          <p>${group.body}</p>
          <div class="ashare-mini-list">
            ${groupIndicators
              .map((indicator) => {
                const status = getStatus(indicator);
                return `
                  <div>
                    <span class="status-dot ${status.level}"></span>
                    <em>${indicator.name}</em>
                    <strong>${formatValue(indicator)}</strong>
                  </div>
                `;
              })
              .join("")}
          </div>
        </article>
      `;
    })
    .join("");

  document.getElementById("ashareMonitorTable").innerHTML = rows
    .map(({ dimension, indicator, threshold, logic }) => {
      return `
        <tr>
          <td>${dimension}</td>
          <td>
            <div class="indicator-name">
              <strong>${indicator.name}</strong>
              <span>${indicator.source}</span>
            </div>
          </td>
          <td>${formatValue(indicator)}<br><span class="muted">${indicator.asOf || "待录入"}</span></td>
          <td>${createStatusBadge(indicator)}</td>
          <td>${threshold}</td>
          <td>${logic}</td>
        </tr>
      `;
    })
    .join("");

  document.getElementById("ashareChecklist").innerHTML = ashareSignalGroups
    .map(
      (group) => `
      <div class="retail-signal-item">
        <strong>${group.title}</strong>
        <p>${group.body}</p>
      </div>
    `,
    )
    .join("");

  document.getElementById("ashareHistory").innerHTML = ashareHistory
    .map(
      (item) => `
      <div class="history-item">
        <span>${item.period}</span>
        <strong>${item.signal}</strong>
        <p>${item.after}</p>
      </div>
    `,
    )
    .join("");
}

function renderBubble() {
  const rows = bubbleMonitorRows
    .map((row) => ({ ...row, indicator: byId(row.id) }))
    .filter((row) => row.indicator);

  const score = Math.round((rows.reduce((sum, row) => sum + getStatus(row.indicator).score, 0) / rows.length) * 33.3);
  const redCount = rows.filter((row) => getStatus(row.indicator).level === "red").length;
  const amberCount = rows.filter((row) => getStatus(row.indicator).level === "amber").length;
  const fundingStress = ["fundingSpreadProxy", "sofrRate", "srfUsage", "swapLineUsage", "hySpread", "cloAaaSpread"].some((id) => {
    const indicator = byId(id);
    return indicator && ["amber", "red"].includes(getStatus(indicator).level);
  });

  let status = "叙事过热，危机未确认";
  let reason = "红灯主要集中在估值、融资规模和AI价格战，SOFR、SRF、互换额度和信用利差仍偏绿。";
  if (fundingStress && redCount >= 3) {
    status = "流动性危机确认";
    reason = "估值端红灯已经传导到融资、信用或央行后门指标，需要把它视为去杠杆阶段。";
  } else if (fundingStress || amberCount >= 4) {
    status = "压力扩散";
    reason = "导火索之外，资金或信用指标开始变色，市场可能从估值回调切换到流动性抛售。";
  } else if (redCount >= 3) {
    status = "泡沫后段";
    reason = "叙事和仓位指标已明显过热，但资金市场尚未给出系统性失血确认。";
  }

  document.getElementById("bubbleScore").textContent = score;
  document.getElementById("bubbleStatus").textContent = status;
  document.getElementById("bubbleReason").textContent = reason;

  document.getElementById("bubbleChain").innerHTML = bubbleStages
    .map((stage) => {
      const indicators = stage.ids.map(byId).filter(Boolean);
      const avg = indicators.length
        ? indicators.reduce((sum, indicator) => sum + getStatus(indicator).score, 0) / indicators.length
        : 0;
      const level = avg >= 2.2 ? "red" : avg >= 1.4 ? "amber" : avg >= 0.7 ? "yellow" : "green";
      return `
        <article class="bubble-step ${level}">
          <div class="bubble-step-head">
            <strong>${stage.title}</strong>
            <span class="status-dot ${level}"></span>
          </div>
          <p>${stage.body}</p>
          <div class="bubble-mini-list">
            ${indicators
              .map(
                (indicator) => `
                  <div>
                    <span class="status-dot ${getStatus(indicator).level}"></span>
                    <em>${indicator.name}</em>
                    <strong>${formatValue(indicator)}</strong>
                  </div>
                `,
              )
              .join("")}
          </div>
        </article>
      `;
    })
    .join("");

  document.getElementById("bubbleSignalGrid").innerHTML = rows
    .slice(0, 8)
    .map(({ layer, indicator, threshold, logic }) => {
      const status = getStatus(indicator);
      return `
        <article class="bubble-card ${status.level}">
          <div class="bubble-card-head">
            <span>${layer}</span>
            ${createStatusBadge(indicator)}
          </div>
          <strong>${indicator.name}</strong>
          <div class="bubble-value">${formatValue(indicator)}</div>
          <p>${logic}</p>
          <em>${threshold}</em>
        </article>
      `;
    })
    .join("");

  document.getElementById("bubbleTable").innerHTML = rows
    .map(({ layer, indicator, threshold, logic }) => {
      return `
        <tr>
          <td>${layer}</td>
          <td>
            <div class="indicator-name">
              <strong>${indicator.name}</strong>
              <span>${indicator.source}</span>
            </div>
          </td>
          <td>${formatValue(indicator)}<br><span class="muted">${indicator.asOf || "待录入"}</span></td>
          <td>${createStatusBadge(indicator)}</td>
          <td>${threshold}</td>
          <td>${logic}</td>
        </tr>
      `;
    })
    .join("");
}

function renderEntryOptions() {
  const select = document.getElementById("entryIndicator");
  const current = select.value || "brent";
  select.innerHTML = state.indicators
    .map((item) => `<option value="${item.id}">${item.category} / ${item.name}</option>`)
    .join("");
  select.value = byId(current) ? current : "brent";
  document.getElementById("entryDate").value ||= new Date().toISOString().slice(0, 10);
}

function renderRecentRecords() {
  const recent = [...state.records]
    .sort((a, b) => `${b.date}${b.createdAt}`.localeCompare(`${a.date}${a.createdAt}`))
    .slice(0, 8);

  document.getElementById("recentRecords").innerHTML = recent
    .map((record) => {
      const indicator = byId(record.indicatorId);
      return `
        <div class="record-item">
          <strong>${indicator?.name || "未知指标"}：${Number(record.value).toLocaleString("zh-CN")} ${indicator?.unit || ""}</strong>
          <p>${record.date} · ${record.note || "无备注"}</p>
        </div>
      `;
    })
    .join("");
}

function renderRoadmap() {
  const active = currentStageId();
  document.getElementById("roadmap").innerHTML = roadmap
    .map(
      (stage) => `
      <article class="road-card ${stage.id === active ? "active" : ""}">
        <div>
          <p class="eyebrow">${stage.id === active ? "Current Stage" : "Scenario"}</p>
          <h3>${stage.title}</h3>
        </div>
        <div class="allocation-bars">
          ${stage.allocation
            .map(([name, low, high, type]) => {
              const color = type === "oil" ? "#4b4a44" : type === "gold" ? "#d7ad53" : type === "cash" ? "#6ca8b6" : "#8b8f7c";
              return `
                <div class="bar-row">
                  <div class="bar-label"><span>${name}</span><strong>${low}%-${high}%</strong></div>
                  <div class="bar-track"><div class="bar-fill" style="width:${high}%; background:${color}"></div></div>
                </div>
              `;
            })
            .join("")}
        </div>
        <p><strong>触发：</strong>${stage.trigger}</p>
        <p><strong>风控：</strong>${stage.risk}</p>
      </article>
    `,
    )
    .join("");
}

function renderEvents() {
  document.getElementById("eventGrid").innerHTML = events
    .map(
      (event) => `
      <article class="event-item">
        <span>${event.cadence}</span>
        <strong>${event.title}</strong>
        <p>${event.body}</p>
      </article>
    `,
    )
    .join("");
}

function saveRecord(event) {
  event.preventDefault();
  const indicatorId = document.getElementById("entryIndicator").value;
  const value = Number(document.getElementById("entryValue").value);
  const date = document.getElementById("entryDate").value;
  const note = document.getElementById("entryNote").value.trim();
  const indicator = byId(indicatorId);
  if (!indicator || Number.isNaN(value) || !date) return;

  state.records.push({
    id: uid(),
    indicatorId,
    value,
    date,
    note,
    createdAt: new Date().toISOString(),
  });

  indicator.value = value;
  indicator.asOf = date;
  saveState();
  document.getElementById("entryValue").value = "";
  document.getElementById("entryNote").value = "";
  renderAll();
}

function exportJson() {
  downloadFile(
    `macro-watch-${new Date().toISOString().slice(0, 10)}.json`,
    JSON.stringify(state, null, 2),
    "application/json",
  );
}

function exportCsv() {
  const rows = [["date", "indicator", "category", "value", "unit", "status", "note", "source"]];
  state.records
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .forEach((record) => {
      const indicator = byId(record.indicatorId);
      if (!indicator) return;
      rows.push([
        record.date,
        indicator.name,
        indicator.category,
        record.value,
        indicator.unit,
        getStatus(indicator).label,
        record.note || "",
        indicator.source,
      ]);
    });
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
  downloadFile(`macro-watch-${new Date().toISOString().slice(0, 10)}.csv`, `\ufeff${csv}`, "text/csv;charset=utf-8");
}

function csvCell(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function importJson(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      if (!Array.isArray(parsed.indicators) || !Array.isArray(parsed.records)) {
        throw new Error("Invalid file");
      }
      state = parsed;
      saveState();
      renderAll();
    } catch {
      alert("导入失败：文件结构不正确。");
    }
  };
  reader.readAsText(file);
}

function resetDemo() {
  if (!confirm("恢复示例数据会覆盖当前本地记录，确认继续？")) return;
  state = cloneDefaultState();
  saveState();
  renderAll();
}

function wireEvents() {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
      document.querySelectorAll(".view").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      document.getElementById(button.dataset.view).classList.add("active");
    });
  });

  document.getElementById("chartIndicator").addEventListener("change", renderTrendChart);
  document.getElementById("searchInput").addEventListener("input", renderIndicatorTable);
  document.getElementById("categoryFilter").addEventListener("change", renderIndicatorTable);
  document.getElementById("statusFilter").addEventListener("change", renderIndicatorTable);
  document.getElementById("entryForm").addEventListener("submit", saveRecord);
  document.getElementById("exportJsonBtn").addEventListener("click", exportJson);
  document.getElementById("exportCsvBtn").addEventListener("click", exportCsv);
  document.getElementById("importFile").addEventListener("change", (event) => importJson(event.target.files[0]));
  document.getElementById("resetDemoBtn").addEventListener("click", resetDemo);
}

wireEvents();
saveState();
renderAll();

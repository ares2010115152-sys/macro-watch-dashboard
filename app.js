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
    value: 73.20,
    asOf: "2026-06-30",
    source: "WSJ / ICE Brent early Europe",
    frequency: "每日",
    summary: true,
    thesis: "油价回到冲突前附近，说明市场在交易谈判乐观；但若霍尔木兹流量恢复慢于预期，低油价会反过来形成挤空燃料。",
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
    value: 4.37,
    asOf: "2026-06-30",
    source: "WSJ / Tradeweb；Fed H.15 Jun26为4.38%",
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
    value: 69.91,
    asOf: "2026-06-30",
    source: "WSJ / NYMEX WTI early Europe",
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
    value: 2.18,
    asOf: "2026-06-26",
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
    value: 101.318,
    asOf: "2026-06-30",
    source: "WSJ / ICE DXY",
    frequency: "每日",
    thesis: "美元走强会收紧全球流动性；美元走弱叠加高油价会强化黄金与资源重估。",
    rule: { mode: "higherRisk", green: 100, yellow: 104, amber: 108 },
  },
  {
    id: "tga",
    name: "美国财政部TGA账户",
    category: "利率与流动性",
    unit: "十亿美元",
    value: 918.7,
    asOf: "2026-06-24",
    source: "Federal Reserve H.4.1",
    frequency: "每日",
    thesis: "TGA上升通常抽走银行体系流动性；需要和RRP、准备金合看。",
    rule: { mode: "higherRisk", green: 500, yellow: 750, amber: 1000 },
  },
  {
    id: "rrp",
    name: "隔夜逆回购RRP",
    category: "利率与流动性",
    unit: "十亿美元",
    value: 2.278,
    asOf: "2026-06-24",
    source: "Federal Reserve H.4.1 / RRP others口径",
    frequency: "每日",
    thesis: "RRP是可释放的流动性缓冲；越低，财政抽水对市场的冲击越直接。",
    rule: { mode: "lowerRisk", green: 900, yellow: 500, amber: 200 },
  },
  {
    id: "bankReserves",
    name: "银行准备金",
    category: "利率与流动性",
    unit: "万亿美元",
    value: 2.951,
    asOf: "2026-06-24",
    source: "Federal Reserve H.4.1",
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
    name: "黄金价格参考",
    category: "黄金与避险",
    unit: "美元/盎司",
    value: 4044.30,
    asOf: "2026-06-30",
    source: "WSJ / New York gold futures",
    frequency: "每日",
    thesis: "油价极端化后的承接资产；关注实际利率、美元信用和央行购金。",
    rule: { mode: "higherRisk", green: 2800, yellow: 3300, amber: 3800 },
  },
  {
    id: "goldOilRatio",
    name: "金油比",
    category: "黄金与避险",
    unit: "倍",
    value: 55.25,
    asOf: "2026-06-30",
    source: "NY gold futures / Brent futures计算",
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
    value: 16.17,
    asOf: "2026-06-02",
    source: "Cboe volume snapshot / VIX",
    frequency: "每日",
    thesis: "低波动叠加高宏观风险时，代表保护成本仍未充分定价。",
    rule: { mode: "rangeRisk", lowRed: 10, lowAmber: 14, highAmber: 28, highRed: 36 },
  },
  {
    id: "sofrRate",
    name: "SOFR隔夜融资利率",
    category: "泡沫破裂前瞻",
    unit: "%",
    value: 3.63,
    asOf: "2026-06-26",
    source: "Federal Reserve H.15 / EFFR近似口径",
    frequency: "每日",
    thesis: "SOFR是最后确认型资金压力指标；若突然脱离政策利率走高，说明回购市场开始缺现金。",
    rule: { mode: "higherRisk", green: 3.8, yellow: 4.3, amber: 4.8 },
  },
  {
    id: "fundingSpreadProxy",
    name: "金融CP-SOFR利差代理",
    category: "泡沫破裂前瞻",
    unit: "bp",
    value: 18,
    asOf: "2026-06-26",
    source: "Federal Reserve H.15 / 3M金融CP-EFFR计算",
    frequency: "每日",
    thesis: "用金融商业票据利率与SOFR的差值近似观察FRA-OIS/TED压力；超过30bp代表银行间信用溢价开始抬升。",
    rule: { mode: "higherRisk", green: 15, yellow: 30, amber: 50 },
  },
  {
    id: "srfUsage",
    name: "美联储SRF使用量",
    category: "泡沫破裂前瞻",
    unit: "十亿美元",
    value: 0.004,
    asOf: "2026-06-24",
    source: "Federal Reserve H.4.1 repo agreements others",
    frequency: "每日",
    thesis: "SRF是私人回购市场失灵后的央行后门；频繁或大额使用代表交易商资产负债表被抵押品塞满。",
    rule: { mode: "higherRisk", green: 5, yellow: 25, amber: 75 },
  },
  {
    id: "swapLineUsage",
    name: "央行美元互换使用量",
    category: "泡沫破裂前瞻",
    unit: "十亿美元",
    value: 0.035,
    asOf: "2026-06-24",
    source: "Federal Reserve H.4.1",
    frequency: "每周",
    thesis: "美元互换额度是离岸美元荒的全球化确认信号；从零附近跳升通常意味着危机开始跨境传染。",
    rule: { mode: "higherRisk", green: 1, yellow: 10, amber: 50 },
  },
  {
    id: "rrpDrawdownPct",
    name: "RRP蓄水池耗尽幅度",
    category: "泡沫破裂前瞻",
    unit: "%",
    value: 99.98,
    asOf: "2026-06-24",
    source: "Federal Reserve H.4.1 / 2022年底2.55万亿美元峰值计算",
    frequency: "每周",
    thesis: "RRP从2.55万亿美元级别缩到零附近，说明缩表已从消化闲钱进入抽取银行体系血液的阶段。",
    rule: { mode: "higherRisk", green: 80, yellow: 95, amber: 99 },
  },
  {
    id: "rrpVs2019Buffer",
    name: "RRP相对2019缓冲垫",
    category: "泡沫破裂前瞻",
    unit: "%",
    value: 0.035,
    asOf: "2026-06-24",
    source: "Federal Reserve H.4.1 / 2019约1.3万亿美元缓冲对比",
    frequency: "每周",
    thesis: "2019年回购危机时RRP仍有约1.3万亿美元级缓冲；当前others口径只剩零头，意味着同等冲击下政策反应窗口更窄。",
    rule: { mode: "lowerRisk", green: 40, yellow: 10, amber: 1 },
  },
  {
    id: "reserveDrainPhase",
    name: "准备金抽水阶段",
    category: "泡沫破裂前瞻",
    unit: "分",
    value: 72,
    asOf: "2026-06-24",
    source: "RRP / TGA / 银行准备金综合评分",
    frequency: "每周",
    thesis: "把RRP接近零、TGA高位和准备金跌破3万亿美元合成一张水位表；高于70说明系统从消化闲钱进入消耗核心流动性。",
    rule: { mode: "higherRisk", green: 45, yellow: 60, amber: 75 },
  },
  {
    id: "sofrIorbStress",
    name: "SOFR-IORB异常压力",
    category: "泡沫破裂前瞻",
    unit: "bp",
    value: 0,
    asOf: "2026-06-30",
    source: "SOFR / IORB手工监控项",
    frequency: "每日",
    thesis: "真正的回购市场警报不是政策利率本身，而是SOFR突然高于准备金利率；2019年式跳升会迫使杠杆资金平仓。",
    rule: { mode: "higherRisk", green: 5, yellow: 20, amber: 50 },
  },
  {
    id: "basisTradeStress",
    name: "美债基差交易压力",
    category: "泡沫破裂前瞻",
    unit: "分",
    value: 70,
    asOf: "2026-06-30",
    source: "用户材料 / 国债期现基差与杠杆交易手工评分",
    frequency: "每周",
    thesis: "做空国债期货、买入现货国债的基差交易高度依赖低成本短融；回购利率跳升会把套利变成踩踏。",
    rule: { mode: "higherRisk", green: 45, yellow: 65, amber: 80 },
  },
  {
    id: "aiCapexLiquidityDrain",
    name: "AI基建年度抽水",
    category: "泡沫破裂前瞻",
    unit: "十亿美元/年",
    value: 700,
    asOf: "2026-06-30",
    source: "用户材料 / 超大规模数据中心资本开支估算",
    frequency: "季报",
    thesis: "AI数据中心把货币基金、回购和企业现金转化为GPU、服务器、电力和钢筋水泥；短期支撑叙事，长期消耗市场可交易流动性。",
    rule: { mode: "higherRisk", green: 300, yellow: 550, amber: 800 },
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
    id: "jgb10y",
    name: "日本10年期国债收益率",
    category: "日元套息与美元流动性",
    unit: "%",
    value: 2.57,
    asOf: "2026-06-15",
    source: "WSJ / MUFG JGB market note",
    frequency: "每日",
    thesis: "日元融资不再便宜的本征信号；10Y JGB稳在2%以上会提高日本资金回流和套息平仓概率。",
    rule: { mode: "higherRisk", green: 1.5, yellow: 2.0, amber: 2.6 },
  },
  {
    id: "bojPolicyRate",
    name: "日本央行政策利率",
    category: "日元套息与美元流动性",
    unit: "%",
    value: 1.00,
    asOf: "2026-06-16",
    source: "BOJ decision / AP / Guardian",
    frequency: "会议",
    thesis: "腾讯元宝链接强调的核心阈值：当BOJ政策利率逼近1.5%，日元融资从近似免费变成有成本，套息交易收益结构会改变。",
    rule: { mode: "higherRisk", green: 0.75, yellow: 1.25, amber: 1.5 },
  },
  {
    id: "usdJpy",
    name: "USD/JPY",
    category: "日元套息与美元流动性",
    unit: "日元/美元",
    value: 162.40,
    asOf: "2026-06-30",
    source: "WSJ / FactSet",
    frequency: "每日",
    thesis: "高于160说明日元融资仍在供氧但干预压力急升；真正平仓相变通常要观察USD/JPY跌破140且BOJ利率继续上行。",
    rule: { mode: "rangeRisk", lowRed: 135, lowAmber: 140, highAmber: 160, highRed: 170 },
  },
  {
    id: "foreignUstCustody",
    name: "外国官方托管美债",
    category: "日元套息与美元流动性",
    unit: "万亿美元",
    value: 2.640,
    asOf: "2026-06-24",
    source: "Federal Reserve H.4.1 custody data",
    frequency: "每周",
    thesis: "观察外国官方买盘是否慢慢退潮；若托管美债持续下降，美债融资需要更高收益率吸引边际买家。",
    rule: { mode: "lowerRisk", green: 2.9, yellow: 2.75, amber: 2.65 },
  },
  {
    id: "yenCarryStress",
    name: "日元套息平仓压力",
    category: "日元套息与美元流动性",
    unit: "分",
    value: 68,
    asOf: "2026-06-30",
    source: "USD/JPY / BOJ利率 / JGB / VIX / 美元缓冲综合评分",
    frequency: "每日",
    thesis: "暗流动性仍在供氧，但日元跌至162上方后，干预和被迫加息的尾部风险上升；重点看BOJ 1.5%、USD/JPY跌破140、VIX>28能否共振。",
    rule: { mode: "higherRisk", green: 45, yellow: 60, amber: 75 },
  },
  {
    id: "vixAbove28Days",
    name: "VIX高压持续天数",
    category: "日元套息与美元流动性",
    unit: "天",
    value: 0,
    asOf: "2026-06-30",
    source: "Cboe / MarketWatch volatility notes",
    frequency: "每日",
    thesis: "链接中给出的第三个相变条件：VIX上穿28并持续，才说明从估值波动进入强制降杠杆反馈。",
    rule: { mode: "higherRisk", green: 0, yellow: 2, amber: 5 },
  },
  {
    id: "ctaConvexityNeed",
    name: "CTA/长波动防守需求",
    category: "日元套息与美元流动性",
    unit: "分",
    value: 64,
    asOf: "2026-06-30",
    source: "VIX / SOFR / USDJPY / 相关性升高综合评分",
    frequency: "每周",
    thesis: "若相关性趋近1，普通多头和私募资产会一起失血；现金、短周期CTA、长波动和尾部保护的相对价值上升。",
    rule: { mode: "higherRisk", green: 40, yellow: 60, amber: 75 },
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
    value: 2.890973,
    asOf: "2026-05-29",
    source: "新浪财经 / 东北证券两融周报",
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
    value: 10.12,
    asOf: "2026-05-29",
    source: "新浪财经 / 东北证券两融周报",
    frequency: "每周",
    thesis: "两融交易额/A股成交额，可作为杠杆资金交易热度的高频替代指标；超过10%进入危险区，超过11%代表追涨明显过热。",
    rule: { mode: "higherRisk", green: 7, yellow: 10, amber: 11 },
  },
  {
    id: "ashareTurnover",
    name: "两市日均成交额",
    category: "A股散户情绪",
    unit: "亿元",
    value: 28132,
    asOf: "2026-06-02",
    source: "东方财富Choice / 天天基金网",
    frequency: "每日",
    thesis: "市场交投温度计；6月2日成交仍超2.8万亿，但上涨家数仅约1500只，说明分歧和结构拥挤仍在放大。",
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
    value: 95,
    asOf: "2026-06-02",
    source: "东方财富Choice / 天天基金网",
    frequency: "每日",
    thesis: "短线投机情绪；6月2日近百股涨停，但上涨股票仅约1500只，说明题材仍热、广度仍弱。",
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
  {
    id: "ashareIndependenceScore",
    name: "A股独立行情强度",
    category: "A股散户情绪",
    unit: "分",
    value: 76,
    asOf: "2026-06-30",
    source: "用户材料 / 成交额、科创50、半导体、国产替代综合评分",
    frequency: "每日",
    thesis: "衡量A股上涨是否来自国内流动性和产业政策，而不是单纯跟随美联储和外资风险偏好。",
    rule: { mode: "higherRisk", green: 45, yellow: 65, amber: 80 },
  },
  {
    id: "star50SemisBreadth",
    name: "科创半导体广度",
    category: "A股散户情绪",
    unit: "分",
    value: 82,
    asOf: "2026-06-18",
    source: "用户材料 / 科创50、半导体设备、AI芯片手工评分",
    frequency: "每日",
    thesis: "如果上涨集中在AI芯片、半导体设备、国产替代，说明中国资产逻辑更偏产业自主，而非美联储降息交易。",
    rule: { mode: "higherRisk", green: 50, yellow: 70, amber: 88 },
  },
  {
    id: "usdcnhSensitivity",
    name: "人民币外流敏感度",
    category: "A股散户情绪",
    unit: "分",
    value: 58,
    asOf: "2026-06-30",
    source: "用户材料 / DXY、USD/CNH、北向资金手工评分",
    frequency: "每日",
    thesis: "人民币在6.75附近、美元指数上100时，北向资金仍敏感；若美联储重新鹰派，中美利差扩大将考验A股独立行情。",
    rule: { mode: "higherRisk", green: 45, yellow: 65, amber: 80 },
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
  ["gold", "2026-06-03", 5158.7, "COMEX黄金期货继续处于极端避险高位"],
  ["hormuzCrossings", "2026-05-20", 26, "通行边际改善，但远低于战前正常水平"],
  ["hormuzCrossings", "2026-05-27", 26, "通行仍未恢复到战前约130艘/日"],
  ["brent", "2026-06-02", 96.00, "布伦特8月合约收于96美元，油价受谈判预期压制但仍处高位"],
  ["wti", "2026-06-02", 93.76, "WTI 7月合约收于93.76美元"],
  ["ust10y", "2026-06-01", 4.47, "Fed H.15最新口径，长债收益率仍压制估值"],
  ["ust10y", "2026-06-09", 4.53, "10年美债收益率重新上行，接近4.5%以上压力区"],
  ["realYield", "2026-06-01", 2.07, "10年TIPS收益率仍在2%以上"],
  ["realYield", "2026-06-09", 2.20, "实际利率升至2.2%，对黄金和成长股形成双重约束"],
  ["dxy", "2026-06-03", 99.23, "美元指数维持99附近"],
  ["vix", "2026-06-02", 16.17, "VIX仍低，市场保护成本偏低"],
  ["goldOilRatio", "2026-06-03", 53.74, "黄金相对原油防守溢价继续抬升"],
  ["brentFrontSpread", "2026-05-20", 20, "近端紧张较高点回落但仍显著"],
  ["brentFrontSpread", "2026-05-27", 12, "曲线较此前高点变浅，但仍保持倒挂"],
  ["ieaOilDeficit", "2026-05-13", 1.78, "IEA五月报告仍预估全年赤字"],
  ["buffettIndicator", "2026-05-19", 252, "美国总市值/GDP处于强高估区"],
  ["buffettIndicator", "2026-05-28", 227, "总市值/GDP仍显著高于历史常态"],
  ["privateCreditRedemptions", "2026-04-06", 11.3, "赎回请求明显高于常见流动性闸门"],
  ["loanDefaultRate", "2026-01-31", 5.5, "低评级贷款违约率偏高"],
  ["sofrRate", "2026-05-28", 3.62, "SOFR仍贴近政策利率，尚未失控"],
  ["sofrRate", "2026-06-01", 3.62, "SOFR/政策利率仍平稳，尚未确认回购压力"],
  ["sofrRate", "2026-06-09", 3.62, "SOFR仍未跳升，美元资金压力尚未确认"],
  ["fundingSpreadProxy", "2026-05-27", 9, "金融CP-SOFR利差仍在正常区间"],
  ["fundingSpreadProxy", "2026-06-01", 8, "金融CP-SOFR利差继续偏低"],
  ["fundingSpreadProxy", "2026-06-09", 4, "商业票据与政策利率利差仍低"],
  ["tga", "2026-06-03", 875.7, "TGA升至8757亿美元，财政抽水压力偏高"],
  ["rrp", "2026-06-03", 6.0, "ON RRP缓冲接近耗尽"],
  ["bankReserves", "2026-06-03", 3.014, "准备金降至约3.014万亿美元，接近观察线"],
  ["srfUsage", "2026-05-27", 0, "SRF未出现大额使用"],
  ["srfUsage", "2026-06-03", 0.004, "回购后门未大额动用"],
  ["swapLineUsage", "2026-05-21", 0.016, "央行美元互换使用量接近零"],
  ["swapLineUsage", "2026-06-03", 0.116, "美元互换额度仍很低但较零附近略有抬升"],
  ["jgb10y", "2026-06-11", 2.8, "10Y JGB处于多年高位，日元融资成本压力上升"],
  ["jgb10y", "2026-06-15", 2.57, "10Y JGB仍处高位，但较前期极端读数回落"],
  ["bojPolicyRate", "2026-06-16", 1.00, "BOJ加息至1%，离1.5%套息成本相变线仍有距离"],
  ["usdJpy", "2026-06-30", 162.40, "日元跌至近40年低位，供氧仍在但干预压力上升"],
  ["foreignUstCustody", "2026-06-03", 2.667, "外国官方托管美债低于3万亿美元，观察外资买盘退潮"],
  ["foreignUstCustody", "2026-06-24", 2.640, "外国官方托管美债继续处于低位，观察边际买盘承接"],
  ["yenCarryStress", "2026-06-11", 76, "日元套息压力综合评分进入红灯边缘"],
  ["yenCarryStress", "2026-06-30", 68, "日元暗流动性仍在供氧，但汇率干预和BOJ继续加息风险升温"],
  ["vixAbove28Days", "2026-06-30", 0, "VIX尚未持续站上28，强制降杠杆反馈未确认"],
  ["ctaConvexityNeed", "2026-06-30", 64, "套息暗流动性与季末波动共存，现金、CTA和长波动保护价值上升"],
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
  ["ashareMarginBalance", "2026-05-29", 2.890973, "融资余额小幅回落但仍接近高位"],
  ["ashareMarginUsers", "2026-05-11", 64.05, "参与两融交易人数创阶段新高"],
  ["ashareMarginBuyRatio", "2026-03-20", 9.01, "接近危险区但未突破11%极端线"],
  ["ashareMarginBuyRatio", "2026-05-25", 10.89, "两融交易额占A股成交额约10.89%"],
  ["ashareMarginBuyRatio", "2026-05-29", 10.12, "两融成交占比仍高于10%危险区"],
  ["ashareTurnover", "2026-04-30", 23437.9, "央行披露4月两市日均成交额"],
  ["ashareTurnover", "2026-05-27", 32385.6, "两市成交额维持3.2万亿高位但市场广度恶化"],
  ["ashareTurnover", "2026-06-02", 28132, "两市成交额仍超2.8万亿但较前期缩量"],
  ["ashareEquityFundIssuance", "2026-05-20", 2660, "权益类新基金年内首募升温"],
  ["ashareLimitUpCount", "2026-05-21", 40, "调整日涨停家数回落，短线情绪降温"],
  ["ashareLimitUpCount", "2026-05-27", 60, "约60只涨停但近4500只股票下跌"],
  ["ashareLimitUpCount", "2026-06-02", 95, "近百股涨停但上涨家数约1500只，结构行情特征明显"],
  ["ashareSmallOrderInflow", "2026-04-03", 12500, "3月以来小单累计净流入"],
  ["brent", "2026-06-30", 73.20, "美伊谈判预期压低油价，布伦特回到冲突前附近"],
  ["wti", "2026-06-30", 69.91, "WTI跌至70美元附近，市场交易通航恢复过快的乐观假设"],
  ["ust10y", "2026-06-30", 4.37, "10年美债收益率仍处高估值资产压力区"],
  ["realYield", "2026-06-26", 2.18, "10年TIPS收益率仍高于2%，折现率约束未消失"],
  ["dxy", "2026-06-30", 101.318, "美元指数反弹至101上方"],
  ["gold", "2026-06-30", 4044.30, "纽约金期货仍在高位但受美元和加息预期压制"],
  ["goldOilRatio", "2026-06-30", 55.25, "油价快速回落后金油比处于高防守溢价"],
  ["tga", "2026-06-24", 918.7, "TGA接近9200亿美元，财政抽水压力偏高"],
  ["rrp", "2026-06-24", 2.278, "ON RRP others口径接近零，缓冲垫几乎耗尽"],
  ["bankReserves", "2026-06-24", 2.951, "准备金跌破3万亿美元观察线"],
  ["sofrRate", "2026-06-26", 3.63, "隔夜资金利率仍贴近政策利率，尚未失控"],
  ["fundingSpreadProxy", "2026-06-26", 18, "金融CP-EFFR利差抬至18bp，仍未突破30bp压力线"],
  ["srfUsage", "2026-06-24", 0.004, "美联储回购后门仍未被大额动用"],
  ["swapLineUsage", "2026-06-24", 0.035, "央行美元互换使用量仍接近零"],
  ["rrpDrawdownPct", "2022-12-31", 0, "RRP蓄水池处于2.55万亿美元峰值附近"],
  ["rrpDrawdownPct", "2024-12-31", 88, "RRP蓄水池大幅下降，缩表主要仍在消化闲置流动性"],
  ["rrpDrawdownPct", "2026-06-24", 99.98, "RRP others口径接近零，蓄水池基本耗尽"],
  ["rrpVs2019Buffer", "2019-09-17", 100, "2019回购危机时仍有约1.3万亿美元级缓冲"],
  ["rrpVs2019Buffer", "2026-06-24", 0.035, "当前RRP others相对2019缓冲只剩零头"],
  ["reserveDrainPhase", "2026-06-03", 58, "准备金约3.014万亿美元，刚接近观察线"],
  ["reserveDrainPhase", "2026-06-24", 72, "准备金跌破3万亿美元，系统进入抽水深水区"],
  ["sofrIorbStress", "2019-09-17", 500, "2019年SOFR相对政策利率异常跳升，回购危机确认"],
  ["sofrIorbStress", "2026-06-30", 0, "当前尚未出现SOFR-IORB异常跳升"],
  ["basisTradeStress", "2026-05-31", 62, "基差交易杠杆偏高但尚未失控"],
  ["basisTradeStress", "2026-06-30", 70, "RRP耗尽后，基差交易对回购利率更敏感"],
  ["aiCapexLiquidityDrain", "2024-12-31", 420, "AI资本开支已开始显著抽走可交易流动性"],
  ["aiCapexLiquidityDrain", "2026-06-30", 700, "超大规模数据中心建设形成年度级抽水"],
  ["ashareIndependenceScore", "2026-06-02", 60, "A股结构行情开始与美元逻辑分化"],
  ["ashareIndependenceScore", "2026-06-30", 76, "国内流动性与产业自主逻辑强化A股独立性"],
  ["star50SemisBreadth", "2026-06-18", 82, "科创、半导体设备和国产替代成为A股主要弹性来源"],
  ["usdcnhSensitivity", "2026-06-30", 58, "美元指数突破100、人民币6.75附近，北向资金仍需观察"],
];

const categories = ["全部类别", ...new Set(defaultIndicators.map((item) => item.category))];

const events = [
  {
    cadence: "每日",
    title: "油价、黄金、长债、美元、VIX",
    body: "更新布伦特、WTI、XAUUSD、10年美债、DXY、VIX和信用利差，观察三重压力是否同步升温。",
  },
  {
    cadence: "每日",
    title: "日元套息与JGB压力",
    body: "跟踪10Y JGB、USD/JPY、BOJ政策利率、VIX高压持续天数和风险资产是否同步去杠杆。",
  },
  {
    cadence: "每日",
    title: "RRP、准备金与SOFR异常",
    body: "跟踪RRP others、TGA、银行准备金、SOFR-IORB和SRF使用量，确认缩表是否从消化闲钱进入抽取核心流动性。",
  },
  {
    cadence: "每周",
    title: "AI基建抽水与基差交易",
    body: "观察科技巨头CapEx、公司债融资、货币基金流向和美债基差交易压力，判断AI叙事是否开始吞噬市场流动性。",
  },
  {
    cadence: "每日",
    title: "中国资产独立行情",
    body: "跟踪A股成交额、科创半导体广度、人民币汇率和北向资金敏感度，区分国内产业逻辑与全球risk-on。",
  },
  {
    cadence: "每周",
    title: "API / EIA原油与馏分油库存",
    body: "关注商业原油、馏分油、炼厂开工率、Cushing、SPR和隐含需求。",
  },
  {
    cadence: "每周",
    title: "流动性与财政抽水",
    body: "跟踪TGA、ON RRP、银行准备金、外国官方托管美债、票据发行和长债拍卖结果。",
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
  {
    dimension: "中国资产分化",
    id: "ashareIndependenceScore",
    threshold: ">65说明独立性增强；>80说明结构拥挤",
    logic: "区分A股上涨是国内流动性和产业政策驱动，还是单纯跟随全球risk-on。",
  },
  {
    dimension: "中国资产分化",
    id: "star50SemisBreadth",
    threshold: ">70为产业主线强；>88为拥挤",
    logic: "科创、半导体和国产替代广度越强，越说明行情与中国自主产业周期相关。",
  },
  {
    dimension: "汇率约束",
    id: "usdcnhSensitivity",
    threshold: ">65转黄；>80转红",
    logic: "若美元走强和中美利差扩大，人民币与北向资金会重新约束A股弹性。",
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
  {
    title: "分化：中国资产独立性",
    body: "科创半导体、国产替代和人民币敏感度决定A股能否脱离美元流动性的单一叙事。",
    ids: ["ashareIndependenceScore", "star50SemisBreadth", "usdcnhSensitivity"],
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
    body: "SpaceX 超大规模融资、AI 模型价格战、科技股高估值与AI基建抽水共同构成叙事层压力。市场还在狂欢，但资金承接力和债券市场购买力已经被持续消耗。",
    ids: ["spacexValuation", "spacexIpoRaise", "deepseekPriceCut", "spxPe", "mag7Capex", "aiCapexLiquidityDrain"],
  },
  {
    title: "02 日元扳机：套息交易平仓",
    body: "当前的“流动性盛宴”更像是日元低息资金在给全球风险资产供氧。真正相变不是某一天，而是BOJ政策利率逼近1.5%、USD/JPY从高位转向140下方、波动率持续升温时，借日元买高Beta资产的链条开始降杠杆。",
    ids: ["bojPolicyRate", "usdJpy", "jgb10y", "yenCarryStress", "foreignUstCustody"],
  },
  {
    title: "03 美元流动性：缓冲被抽干",
    body: "QT、TGA上升、RRP蓄水池耗尽、准备金下行会削薄缓冲。此时市场不是已经崩盘，而是从“消化闲钱”进入“抽取核心流动性”的脆弱阶段。",
    ids: ["tga", "rrp", "rrpDrawdownPct", "rrpVs2019Buffer", "bankReserves", "reserveDrainPhase"],
  },
  {
    title: "04 回购踩踏：从缺水到抽血",
    body: "SOFR-IORB、CP利差、SRF、互换额度和美债基差交易是确认指标。只有这些一起跳，才说明风险从估值回调切到现金荒和平仓链。",
    ids: ["sofrIorbStress", "sofrRate", "fundingSpreadProxy", "basisTradeStress", "srfUsage", "swapLineUsage"],
  },
  {
    title: "05 跨市场传染：信用、波动与中国分化",
    body: "VIX、MOVE、信用利差和中国资产独立性共同决定冲击范围。A股若由国内流动性和产业自主驱动，可能先分化；但汇率和美元流动性仍是尾部约束。",
    ids: ["vix", "moveIndex", "hySpread", "cloAaaSpread", "ashareIndependenceScore", "star50SemisBreadth", "usdcnhSensitivity"],
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
    layer: "AI抽水",
    id: "aiCapexLiquidityDrain",
    threshold: ">5500亿美元转黄；>8000亿美元红灯",
    logic: "AI基建把可交易现金转成长期固定资产。它短期强化科技叙事，长期会与财政发债、公司债和回购市场争夺资金。",
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
    layer: "日元扳机",
    id: "jgb10y",
    threshold: "10Y JGB >2%转黄；>2.6%进入红灯区",
    logic: "日本本土无风险利率抬升会削弱海外套息交易的经济性，是日元不再便宜的本征信号。",
  },
  {
    layer: "日元扳机",
    id: "bojPolicyRate",
    threshold: "1.25%转黄；1.5%为核心相变线",
    logic: "BOJ政策利率越接近1.5%，日元借贷成本越难再被忽略。若Fed不重新扩表，套息资金会失去最便宜的底层融资。",
  },
  {
    layer: "日元扳机",
    id: "usdJpy",
    threshold: ">160为干预压力；<140且BOJ继续加息为平仓确认",
    logic: "日元越弱，短期越像流动性供氧；但162上方会逼近日本干预和被迫加息风险。真正危险的是高位反转后跌破140，套息交易被迫还日元。",
  },
  {
    layer: "日元扳机",
    id: "yenCarryStress",
    threshold: ">60为冒烟；>75为平仓边缘",
    logic: "把BOJ利率、USD/JPY、JGB、VIX、SOFR和美元缓冲压成综合分，用来提示套息链条是否正在从供氧转向反噬。",
  },
  {
    layer: "美元缓冲",
    id: "rrp",
    threshold: "<2000亿美元转红；当前ON RRP近零说明缓冲薄",
    logic: "ON RRP是财政抽水和QT的缓冲垫；余额越低，TGA上升越容易直接抽走银行体系流动性。",
  },
  {
    layer: "美元缓冲",
    id: "rrpDrawdownPct",
    threshold: ">95%为黄灯；>99%为红灯",
    logic: "RRP耗尽幅度越高，说明缩表已经基本消化掉过去的闲置蓄水池，下一步压力会更直接落到银行准备金。",
  },
  {
    layer: "美元缓冲",
    id: "rrpVs2019Buffer",
    threshold: "<10%转黄；<1%转红",
    logic: "2019年回购危机仍有约1.3万亿美元级RRP缓冲；当前相对缓冲极低，同等冲击下政策反应窗口更窄。",
  },
  {
    layer: "美元缓冲",
    id: "bankReserves",
    threshold: "<3万亿美元转黄；<2.75万亿美元转红",
    logic: "准备金越接近稀缺区，SOFR和repo越容易在季末或冲击日跳升。",
  },
  {
    layer: "美元缓冲",
    id: "reserveDrainPhase",
    threshold: ">60转黄；>75转红",
    logic: "把TGA、RRP和准备金合成水位分数。它回答的是缩表还在消化闲钱，还是已经开始抽取金融系统血液。",
  },
  {
    layer: "回购确认",
    id: "sofrIorbStress",
    threshold: ">20bp转黄；>50bp红灯",
    logic: "SOFR明显高于IORB代表银行间现金短缺开始显性化，是2019式回购事故的前置信号。",
  },
  {
    layer: "回购确认",
    id: "basisTradeStress",
    threshold: ">65转黄；>80红灯",
    logic: "美债基差交易依赖短融滚动。回购成本跳升会让套利链条从赚薄利变成被迫平仓。",
  },
  {
    layer: "美债买盘",
    id: "foreignUstCustody",
    threshold: "<2.75万亿美元转黄；<2.65万亿美元转红",
    logic: "外国官方托管美债持续下降，意味着美国财政融资需要更多依赖本土和杠杆资金承接。",
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
    id: "vixAbove28Days",
    threshold: "连续2天转黄；连续5天以上为红灯",
    logic: "单日上穿VIX 28可能只是事件冲击，持续上穿才说明保护需求进入反馈循环，CTA、风险平价和杠杆资金会同步降风险。",
  },
  {
    layer: "防守配置",
    id: "ctaConvexityNeed",
    threshold: ">60提示提高现金/CTA/长波动；>75进入强防守",
    logic: "若相关性趋近1，私募信贷和PE/VC的估值平滑会掩盖流动性风险；真正有用的是现金、短周期CTA、长波动和高质量抵押品。",
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
  {
    layer: "中国分化",
    id: "ashareIndependenceScore",
    threshold: ">65说明独立性增强；>80说明结构拥挤",
    logic: "A股若靠国内流动性、产业政策和国产替代上涨，可以短期脱离美股；但分数过高也说明拥挤度升温。",
  },
  {
    layer: "中国分化",
    id: "usdcnhSensitivity",
    threshold: ">65转黄；>80红灯",
    logic: "人民币和北向资金是中国资产独立行情的约束。美元走强或中美利差扩大，会把分化行情重新拉回外部流动性框架。",
  },
];

const roadmap = [
  {
    id: "stage1",
    title: "第一阶段：三季度末前保留科技进攻",
    trigger: "AI业绩叙事仍强、VIX未持续站上28、SOFR/CP利差未越过30bp，科技股高斜率行情仍可能惯性延续。",
    risk: "不追无现金流小票；若科技股放量冲高但广度恶化，开始把盈利转入现金和资源观察仓。",
    allocation: [
      ["科技/AI龙头", 35, 50, "tech"],
      ["恒生科技观察仓", 5, 12, "hkTech"],
      ["现金/短债", 20, 30, "cash"],
      ["大宗商品/能源", 5, 12, "commodity"],
      ["黄金/贵金属", 8, 15, "gold"],
    ],
  },
  {
    id: "stage2",
    title: "第二阶段：临近9月逐步减科技转资源贵金属",
    trigger: "进入9月前后，财政发债、季末资金面、BOJ继续加息、日元高位反转风险开始叠加。",
    risk: "转仓要分批，不在单日恐慌里一次性切换；若VIX仍低且信用利差不动，保留部分科技右侧仓位。",
    allocation: [
      ["科技/AI龙头", 18, 30, "tech"],
      ["大宗商品/能源", 18, 30, "commodity"],
      ["黄金/贵金属", 18, 28, "gold"],
      ["现金/短债", 25, 35, "cash"],
      ["恒生科技观察仓", 5, 10, "hkTech"],
    ],
  },
  {
    id: "stage3",
    title: "第三阶段：流动性危机触发后防共振下跌",
    trigger: "VIX持续站上28、金融CP利差突破30-50bp、SRF或互换额度跳升，风险资产相关性趋近1。",
    risk: "危机初段黄金和大宗也可能被卖出换现金；优先保现金、短久期、高流动性和长波动保护。",
    allocation: [
      ["现金/短债", 45, 60, "cash"],
      ["黄金/贵金属", 12, 22, "gold"],
      ["CTA/长波动", 10, 18, "vol"],
      ["大宗商品/能源", 5, 12, "commodity"],
      ["权益低配", 0, 8, "equity"],
    ],
  },
  {
    id: "stage4",
    title: "第四阶段：定向放水后做反弹与黄金主升",
    trigger: "美元指数转弱、政策通过SRF/互换/定向工具托底，市场从现金荒切回再通胀和弱美元交易。",
    risk: "只在美元走弱、信用利差停止扩大、流动性工具生效后加风险；不要在第一根暴跌里急着抄底。",
    allocation: [
      ["恒生科技", 18, 30, "hkTech"],
      ["大宗商品/能源", 22, 35, "commodity"],
      ["黄金/贵金属", 25, 40, "gold"],
      ["现金/短债", 15, 25, "cash"],
      ["美股科技精选", 5, 12, "tech"],
    ],
  },
];

const allocationTimeline = [
  { label: "7-8月", title: "科技进攻", tech: 48, hkTech: 8, commodity: 8, gold: 12, cash: 24 },
  { label: "9月前后", title: "降科技转资源", tech: 24, hkTech: 8, commodity: 26, gold: 24, cash: 18 },
  { label: "危机触发", title: "现金与凸性", tech: 5, hkTech: 4, commodity: 8, gold: 18, cash: 50, vol: 15 },
  { label: "定向放水后", title: "弱美元反弹", tech: 8, hkTech: 26, commodity: 30, gold: 28, cash: 8 },
];

const crisisFlow = [
  {
    title: "AI与科技FOMO",
    body: "高斜率上涨、估值扩张和AI基建抽水同时发生，科技从资金供给方变成资金需求方。",
    ids: ["spxPe", "mag7Capex", "aiCapexLiquidityDrain"],
  },
  {
    title: "日元暗流动性",
    body: "借日元换美元买风险资产，USD/JPY高位意味着供氧仍在但尾部风险上升。",
    ids: ["usdJpy", "bojPolicyRate", "yenCarryStress"],
  },
  {
    title: "美元缓冲变薄",
    body: "TGA抬升、RRP耗尽、准备金跌破观察线，缩表从消化闲钱进入抽取核心流动性。",
    ids: ["tga", "rrpDrawdownPct", "rrpVs2019Buffer", "reserveDrainPhase"],
  },
  {
    title: "回购踩踏确认",
    body: "SOFR-IORB、融资利差、基差交易、SRF或互换额度跳升，说明风险从缺水进入抽血。",
    ids: ["sofrIorbStress", "fundingSpreadProxy", "basisTradeStress", "srfUsage"],
  },
  {
    title: "定向放水后再定价",
    body: "美元转弱、政策托底后，恒生科技、大宗商品和黄金重新获得弹性；A股独立性决定反弹质量。",
    ids: ["dxy", "gold", "ctaConvexityNeed", "ashareIndependenceScore"],
  },
];

const assetPathSeries = [
  { name: "科技/AI", color: "#7da0d6", values: [70, 88, 42, 52] },
  { name: "恒生科技", color: "#5bb7a4", values: [42, 48, 32, 78] },
  { name: "大宗商品", color: "#b87945", values: [45, 58, 36, 74] },
  { name: "黄金", color: "#d7ad53", values: [58, 66, 52, 88] },
  { name: "美元指数", color: "#a8a296", values: [62, 68, 76, 38] },
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
      if (!saved) return clone(indicator);
      const merged = { ...clone(indicator), ...saved, rule: clone(indicator.rule) };
      if ((indicator.asOf || "") > (saved.asOf || "")) {
        merged.value = indicator.value;
        merged.asOf = indicator.asOf;
        merged.source = indicator.source;
        merged.thesis = indicator.thesis;
        merged.frequency = indicator.frequency;
      }
      return merged;
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
    "jgb10y",
    "yenCarryStress",
    "rrp",
    "rrpDrawdownPct",
    "bankReserves",
    "reserveDrainPhase",
    "sofrIorbStress",
    "fundingSpreadProxy",
    "basisTradeStress",
    "privateCreditRedemptions",
    "mag7Capex",
    "aiCapexLiquidityDrain",
    "ashareIndependenceScore",
  ]
    .map(byId)
    .filter(Boolean);
}

function getOverallStatus() {
  const critical = getCriticalIndicators();
  const avg = critical.reduce((sum, item) => sum + getStatus(item).score, 0) / critical.length;
  const redCount = critical.filter((item) => getStatus(item).level === "red").length;
  if (redCount >= 2 || avg >= 2.35) return { level: "red", label: "红灯", reason: "多个核心指标进入压力区，需优先控制回撤。" };
  if (avg >= 1.45) return { level: "amber", label: "黄灯偏红", reason: "RRP耗尽、AI抽水和杠杆交易压力正在叠加。" };
  if (avg >= 0.7) return { level: "yellow", label: "黄灯", reason: "风险升温但尚未形成共振。" };
  return { level: "green", label: "绿灯", reason: "核心压力指标处于可控区间。" };
}

function currentStageId() {
  const dxy = Number(byId("dxy")?.value || 0);
  const gold = Number(byId("gold")?.value || 0);
  const fundingSpread = Number(byId("fundingSpreadProxy")?.value || 0);
  const vixDays = Number(byId("vixAbove28Days")?.value || 0);
  const ctaNeed = Number(byId("ctaConvexityNeed")?.value || 0);
  const month = new Date().getMonth() + 1;
  if (dxy > 0 && dxy < 100 && gold >= 3800 && fundingSpread < 30) return "stage4";
  if (vixDays >= 2 || fundingSpread >= 30 || ctaNeed >= 75) return "stage3";
  if (month >= 9) return "stage2";
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
  renderPlaybookVisuals();
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
        <article class="metric-card ${status.level}">
          <div class="metric-top">
            <h3>${indicator.name}</h3>
            <span class="status-dot ${status.level}" title="${status.label}"></span>
          </div>
          <div class="metric-value">${formatValue(indicator)}</div>
          ${renderMiniSparkline(indicator.id)}
          <p>${indicator.thesis}</p>
        </article>
      `;
    })
    .join("");
}

function renderMiniSparkline(indicatorId) {
  const records = getRecordsFor(indicatorId).slice(-8);
  if (records.length < 2) return `<div class="mini-sparkline empty"></div>`;
  const width = 140;
  const height = 36;
  const values = records.map((record) => Number(record.value));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const points = values
    .map((value, index) => {
      const x = (index * width) / (values.length - 1);
      const y = height - 5 - ((value - min) / span) * (height - 10);
      return `${x},${y}`;
    })
    .join(" ");
  const tone = values[values.length - 1] >= values[0] ? "up" : "down";
  return `
    <svg class="mini-sparkline ${tone}" viewBox="0 0 ${width} ${height}" aria-hidden="true">
      <polyline points="${points}" fill="none" stroke="currentColor" stroke-width="2.4" vector-effect="non-scaling-stroke"></polyline>
    </svg>
  `;
}

function renderTriggers() {
  const stage = roadmap.find((item) => item.id === currentStageId());
  document.getElementById("stagePill").textContent = stage.title.split("：")[0];
  const playbookStage = document.getElementById("playbookStagePill");
  if (playbookStage) playbookStage.textContent = stage.title.split("：")[0];

  const checks = [
    {
      indicator: byId("aiCapexLiquidityDrain"),
      title: "AI抽水",
      body: "AI基建既支撑科技叙事，也把可交易现金变成长期固定资产；CapEx越高，越要看现金流覆盖。",
    },
    {
      indicator: byId("reserveDrainPhase"),
      title: "美元水位",
      body: "RRP耗尽后，缩表从消化闲钱进入抽取准备金；准备金跌破3万亿美元后要盯SOFR跳升。",
    },
    {
      indicator: byId("sofrIorbStress"),
      title: "回购确认",
      body: "SOFR-IORB异常、SRF使用量跳升和基差交易压力共振，才说明风险从缺水进入抽血。",
    },
    {
      indicator: byId("ashareIndependenceScore"),
      title: "中国分化",
      body: "A股若由国内流动性和国产替代驱动，能阶段性脱离美股；但人民币和北向资金仍是约束。",
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
              const colorMap = {
                tech: "#7da0d6",
                hkTech: "#5bb7a4",
                commodity: "#b87945",
                oil: "#b87945",
                gold: "#d7ad53",
                cash: "#6ca8b6",
                vol: "#b86c76",
                equity: "#8b8f7c",
              };
              const color = colorMap[type] || "#8b8f7c";
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

function renderPlaybookVisuals() {
  renderAllocationTimeline();
  renderCrisisFlow();
  renderAssetPathChart();
}

function renderAllocationTimeline() {
  const svg = document.getElementById("allocationTimeline");
  if (!svg) return;
  const colors = {
    tech: "#7da0d6",
    hkTech: "#5bb7a4",
    commodity: "#b87945",
    gold: "#d7ad53",
    cash: "#6ca8b6",
    vol: "#b86c76",
  };
  const keys = [
    ["tech", "科技"],
    ["hkTech", "恒生科技"],
    ["commodity", "大宗"],
    ["gold", "黄金"],
    ["cash", "现金"],
    ["vol", "凸性"],
  ];
  const width = 900;
  const cardW = 198;
  const gap = 24;
  const startX = 38;
  const barY = 132;
  svg.innerHTML = `
    <rect x="0" y="0" width="${width}" height="310" fill="#10110f"></rect>
    <line x1="58" x2="842" y1="72" y2="72" stroke="#3b3d35" stroke-width="2"></line>
    ${allocationTimeline
      .map((item, index) => {
        const x = startX + index * (cardW + gap);
        let cursor = x;
        const bars = keys
          .map(([key, label]) => {
            const value = item[key] || 0;
            if (!value) return "";
            const segmentW = (value / 100) * cardW;
            const part = `<rect x="${cursor}" y="${barY}" width="${segmentW}" height="24" fill="${colors[key]}"><title>${label} ${value}%</title></rect>`;
            cursor += segmentW;
            return part;
          })
          .join("");
        return `
          <circle cx="${x + cardW / 2}" cy="72" r="9" fill="${index === allocationTimeline.length - 1 ? "#d7ad53" : "#6ca8b6"}"></circle>
          <text x="${x + cardW / 2}" y="44" text-anchor="middle" fill="#e8e2d3" font-size="16" font-weight="700">${item.label}</text>
          <text x="${x + cardW / 2}" y="103" text-anchor="middle" fill="#a8a296" font-size="13">${item.title}</text>
          <rect x="${x}" y="124" width="${cardW}" height="40" fill="#151712" stroke="#303328"></rect>
          ${bars}
          <text x="${x}" y="196" fill="#7da0d6" font-size="12">科技 ${item.tech || 0}%</text>
          <text x="${x}" y="218" fill="#5bb7a4" font-size="12">恒科 ${item.hkTech || 0}%</text>
          <text x="${x}" y="240" fill="#b87945" font-size="12">大宗 ${item.commodity || 0}%</text>
          <text x="${x + 96}" y="196" fill="#d7ad53" font-size="12">黄金 ${item.gold || 0}%</text>
          <text x="${x + 96}" y="218" fill="#6ca8b6" font-size="12">现金 ${item.cash || 0}%</text>
          <text x="${x + 96}" y="240" fill="#b86c76" font-size="12">凸性 ${item.vol || 0}%</text>
        `;
      })
      .join("")}
  `;
}

function renderCrisisFlow() {
  const root = document.getElementById("crisisFlow");
  if (!root) return;
  root.innerHTML = crisisFlow
    .map((step, index) => {
      const statuses = step.ids.map(byId).filter(Boolean).map(getStatus);
      const score = statuses.length ? statuses.reduce((sum, item) => sum + item.score, 0) / statuses.length : 1;
      const level = score >= 2.35 ? "red" : score >= 1.45 ? "amber" : score >= 0.7 ? "yellow" : "green";
      return `
        <article class="flow-step">
          <div class="flow-index ${level}">${String(index + 1).padStart(2, "0")}</div>
          <div>
            <strong>${step.title}</strong>
            <p>${step.body}</p>
            <div class="flow-tags">
              ${step.ids
                .map((id) => {
                  const indicator = byId(id);
                  if (!indicator) return "";
                  return `<span><i class="status-dot ${getStatus(indicator).level}"></i>${indicator.name}</span>`;
                })
                .join("")}
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderAssetPathChart() {
  const svg = document.getElementById("assetPathChart");
  if (!svg) return;
  const width = 980;
  const height = 330;
  const padX = 62;
  const padY = 42;
  const labels = ["7-8月", "9月附近", "流动性冲击", "定向放水后"];
  const xFor = (index) => padX + (index * (width - padX * 2)) / (labels.length - 1);
  const yFor = (value) => height - padY - ((value - 20) / 75) * (height - padY * 2);
  const grid = [20, 40, 60, 80].map((value) => {
    const y = yFor(value);
    return `<line x1="${padX}" x2="${width - padX}" y1="${y}" y2="${y}" stroke="#2f312b"></line><text x="18" y="${y + 4}" fill="#8f8b82" font-size="12">${value}</text>`;
  });
  const paths = assetPathSeries
    .map((series) => {
      const points = series.values.map((value, index) => `${xFor(index)},${yFor(value)}`).join(" ");
      const dots = series.values
        .map((value, index) => `<circle cx="${xFor(index)}" cy="${yFor(value)}" r="4" fill="${series.color}"></circle>`)
        .join("");
      return `<polyline points="${points}" fill="none" stroke="${series.color}" stroke-width="3"></polyline>${dots}`;
    })
    .join("");
  const legend = assetPathSeries
    .map((series, index) => {
      const x = 70 + index * 172;
      return `<circle cx="${x}" cy="294" r="5" fill="${series.color}"></circle><text x="${x + 10}" y="298" fill="#d8d2c4" font-size="13">${series.name}</text>`;
    })
    .join("");
  svg.innerHTML = `
    <rect x="0" y="0" width="${width}" height="${height}" fill="#10110f"></rect>
    ${grid.join("")}
    ${labels.map((label, index) => `<text x="${xFor(index)}" y="28" text-anchor="middle" fill="#a8a296" font-size="13">${label}</text>`).join("")}
    ${labels.map((_, index) => `<line x1="${xFor(index)}" x2="${xFor(index)}" y1="${padY}" y2="${height - padY}" stroke="#25271f"></line>`).join("")}
    ${paths}
    ${legend}
  `;
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

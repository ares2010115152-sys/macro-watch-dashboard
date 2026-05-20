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
    value: 110.42,
    asOf: "2026-05-19",
    source: "TECHi / ICE Brent futures",
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
    value: 102.5,
    asOf: "2026-05-08",
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
    value: 4.67,
    asOf: "2026-05-20",
    source: "MarketScreener / YCharts / FRED口径",
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
    value: 20.8,
    asOf: "2026-04-22",
    source: "Reuters review / TrustFinance / FactSet口径",
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
    value: 103.15,
    asOf: "2026-05-19",
    source: "TECHi / NYMEX WTI futures",
    frequency: "每日",
    thesis: "美国本土供需与炼厂原料压力的高频指标。",
    rule: { mode: "higherRisk", green: 85, yellow: 100, amber: 115 },
  },
  {
    id: "usCrudeInv",
    name: "美国商业原油库存",
    category: "能源与航运",
    unit: "百万桶",
    value: 452.9,
    asOf: "2026-05-08",
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
    value: 384.1,
    asOf: "2026-05-08",
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
    value: 75,
    asOf: "2026-05-20",
    source: "航运新闻 / 保险费率 / AIS",
    frequency: "每日",
    thesis: "把地缘叙事量化为0-100分：封锁、保险、船期延误、护航强度共同打分。",
    rule: { mode: "higherRisk", green: 30, yellow: 55, amber: 75 },
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
    asOf: "2026-05-20",
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
    value: 2.15,
    asOf: "2026-05-20",
    source: "TIPS / FRED",
    frequency: "每日",
    thesis: "黄金和成长股共同关注的折现率；实际利率高位会压制黄金，但危机阶段会被避险需求抵消。",
    rule: { mode: "higherRisk", green: 1.5, yellow: 2.0, amber: 2.4 },
  },
  {
    id: "dxy",
    name: "美元指数DXY",
    category: "利率与流动性",
    unit: "点",
    value: 104,
    asOf: "2026-05-20",
    source: "ICE DXY",
    frequency: "每日",
    thesis: "美元走强会收紧全球流动性；美元走弱叠加高油价会强化黄金与资源重估。",
    rule: { mode: "higherRisk", green: 100, yellow: 104, amber: 108 },
  },
  {
    id: "tga",
    name: "美国财政部TGA账户",
    category: "利率与流动性",
    unit: "十亿美元",
    value: 780,
    asOf: "2026-05-20",
    source: "U.S. Treasury Daily Statement",
    frequency: "每日",
    thesis: "TGA上升通常抽走银行体系流动性；需要和RRP、准备金合看。",
    rule: { mode: "higherRisk", green: 500, yellow: 750, amber: 1000 },
  },
  {
    id: "rrp",
    name: "隔夜逆回购RRP",
    category: "利率与流动性",
    unit: "十亿美元",
    value: 350,
    asOf: "2026-05-20",
    source: "New York Fed",
    frequency: "每日",
    thesis: "RRP是可释放的流动性缓冲；越低，财政抽水对市场的冲击越直接。",
    rule: { mode: "lowerRisk", green: 900, yellow: 500, amber: 200 },
  },
  {
    id: "bankReserves",
    name: "银行准备金",
    category: "利率与流动性",
    unit: "万亿美元",
    value: 3.25,
    asOf: "2026-05-20",
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
    value: 340,
    asOf: "2026-05-20",
    source: "ICE BofA / FRED",
    frequency: "每日",
    thesis: "信用市场是否开始承认衰退与盈利风险。",
    rule: { mode: "higherRisk", green: 330, yellow: 430, amber: 550 },
  },
  {
    id: "gold",
    name: "现货黄金",
    category: "黄金与避险",
    unit: "美元/盎司",
    value: 4489,
    asOf: "2026-05-20",
    source: "GoldAPI.io / MyGoldCalc",
    frequency: "每日",
    thesis: "油价极端化后的承接资产；关注实际利率、美元信用和央行购金。",
    rule: { mode: "higherRisk", green: 2800, yellow: 3300, amber: 3800 },
  },
  {
    id: "goldOilRatio",
    name: "金油比",
    category: "黄金与避险",
    unit: "倍",
    value: 40.7,
    asOf: "2026-05-20",
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
    value: 47,
    asOf: "2026-05-20",
    source: "交易所 / 技术统计",
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
    asOf: "2026-05-20",
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
    value: 18,
    asOf: "2026-05-20",
    source: "CBOE",
    frequency: "每日",
    thesis: "低波动叠加高宏观风险时，代表保护成本仍未充分定价。",
    rule: { mode: "rangeRisk", lowRed: 10, lowAmber: 14, highAmber: 28, highRed: 36 },
  },
];

const seedRecords = [
  ["brent", "2026-03-31", 88, "风险溢价尚未完全进入油价"],
  ["brent", "2026-04-15", 96, "航运担忧升温"],
  ["brent", "2026-05-01", 103, "库存压力显性化"],
  ["brent", "2026-05-20", 110.42, "当前观察盘：油价处于红灯区间"],
  ["distillate", "2026-03-31", 116, "五年区间下沿附近"],
  ["distillate", "2026-04-15", 111, "库存继续下降"],
  ["distillate", "2026-05-01", 106, "柴油链条偏紧"],
  ["distillate", "2026-05-20", 102.5, "当前观察盘：接近100百万桶压力线"],
  ["ust10y", "2026-03-31", 4.15, "长债压力温和"],
  ["ust10y", "2026-04-15", 4.35, "降息预期削弱"],
  ["ust10y", "2026-05-01", 4.48, "估值折现率上行"],
  ["ust10y", "2026-05-20", 4.67, "当前观察盘：长债进入估值压制区间"],
  ["spxPe", "2026-03-31", 19.4, "估值偏高但尚可解释"],
  ["spxPe", "2026-04-15", 20.1, "AI权重继续托估值"],
  ["spxPe", "2026-05-01", 20.6, "安全垫收窄"],
  ["spxPe", "2026-05-20", 20.8, "示例当前值"],
  ["mag7Capex", "2026-03-31", 650, "AI投资维持高位"],
  ["mag7Capex", "2026-04-15", 720, "CapEx指引上修"],
  ["mag7Capex", "2026-05-01", 790, "融资与电力约束升温"],
  ["mag7Capex", "2026-05-20", 830, "当前观察盘：AI资本开支维持高强度"],
  ["gold", "2026-03-31", 3050, "央行购金支撑"],
  ["gold", "2026-04-15", 3180, "避险需求升温"],
  ["gold", "2026-05-01", 3280, "实际利率与避险拉扯"],
  ["gold", "2026-05-20", 4489, "当前观察盘：黄金位于高位避险区间"],
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
    return parsed;
  } catch {
    return cloneDefaultState();
  }
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
  return ["brent", "distillate", "ust10y", "spxPe", "mag7Capex"].map(byId).filter(Boolean);
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
  renderChartOptions();
  renderTrendChart();
  renderFilters();
  renderIndicatorTable();
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

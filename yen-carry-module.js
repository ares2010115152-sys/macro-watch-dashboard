(function () {
  const indicators = [
    { id: "yenCarryReversalProb", name: "日元套息反转概率", value: 57, unit: "%", asOf: "2026-07-28", source: "USD/JPY / JGB / GPIF / 寿险 / SOFR综合评分", rule: { mode: "higherRisk", green: 35, yellow: 55, amber: 70 } },
    { id: "usdJpy", name: "USD/JPY", value: 163.86, unit: "", asOf: "2026-07-28", source: "外汇市场收盘区间", rule: { mode: "rangeRisk", lowAmber: 148, lowRed: 140, highAmber: 160, highRed: 170 } },
    { id: "usdJpyReversalSpeed", name: "USD/JPY反转速度", value: 16, unit: "分", asOf: "2026-07-28", source: "近5日高点后回落幅度与速度监控", rule: { mode: "higherRisk", green: 35, yellow: 55, amber: 75 } },
    { id: "jgb10y", name: "10Y日债收益率", value: 2.78, unit: "%", asOf: "2026-07-28", source: "日本国债市场", rule: { mode: "higherRisk", green: 2.4, yellow: 3.0, amber: 3.5 } },
    { id: "jgbCurveStress", name: "日债曲线压力", value: 72, unit: "分", asOf: "2026-07-28", source: "10Y、20Y、30Y JGB综合评分", rule: { mode: "higherRisk", green: 45, yellow: 65, amber: 80 } },
    { id: "jgbAuctionDemandStress", name: "日债拍卖需求压力", value: 45, unit: "分", asOf: "2026-07-02", source: "日本财务省10Y JGB拍卖结果", rule: { mode: "higherRisk", green: 45, yellow: 65, amber: 80 } },
    { id: "lifeInsurerHedgeRatio", name: "九大寿险外债对冲比", value: 47, unit: "%", asOf: "2026-07-13", source: "用户材料 / 九大寿险对冲比估算", rule: { mode: "lowerRisk", green: 63, yellow: 55, amber: 47 } },
    { id: "gpifReflowGap", name: "GPIF回流有效性缺口", value: 68, unit: "分", asOf: "2026-07-13", source: "GPIF回流政策可执行性评分", rule: { mode: "higherRisk", green: 45, yellow: 65, amber: 80 } },
    { id: "foreignUstCustody", name: "外国官方托管美债", value: 2.623, unit: "万亿美元", asOf: "2026-07-22", source: "Federal Reserve H.4.1", rule: { mode: "lowerRisk", green: 3.0, yellow: 2.75, amber: 2.55 } },
    { id: "bojPolicyRate", name: "BOJ政策利率", value: 1.0, unit: "%", asOf: "2026-07-24", source: "日本银行", rule: { mode: "higherRisk", green: 0.75, yellow: 1.25, amber: 1.5 } },
    { id: "bojActiveHikeWindow", name: "BOJ主动触发窗口", value: 48, unit: "分", asOf: "2026-07-24", source: "7/30-31 BOJ会议 / 2026Q4政策窗", rule: { mode: "higherRisk", green: 35, yellow: 55, amber: 75 } },
    { id: "japanFiscalTrussRisk", name: "日本财政特拉斯风险", value: 64, unit: "分", asOf: "2026-07-13", source: "债务GDP、预算、财政扩张综合评分", rule: { mode: "higherRisk", green: 45, yellow: 65, amber: 82 } },
    { id: "sofrIorbStress", name: "SOFR-IORB异常压力", value: 0, unit: "bp", asOf: "2026-06-30", source: "SOFR / IORB手工监控项", rule: { mode: "higherRisk", green: 5, yellow: 20, amber: 50 } },
    { id: "basisTradeStress", name: "美债基差交易压力", value: 70, unit: "分", asOf: "2026-06-30", source: "国债期现基差与杠杆交易手工评分", rule: { mode: "higherRisk", green: 45, yellow: 65, amber: 80 } },
    { id: "vixAbove28Days", name: "VIX高压持续天数", value: 0, unit: "天", asOf: "2026-06-30", source: "Cboe", rule: { mode: "higherRisk", green: 0, yellow: 2, amber: 5 } },
    { id: "ctaConvexityNeed", name: "CTA/长波动防守需求", value: 64, unit: "分", asOf: "2026-06-30", source: "VIX / SOFR / USDJPY / 相关性", rule: { mode: "higherRisk", green: 40, yellow: 60, amber: 75 } },
  ];

  const bands = [
    { title: "低概率区", range: "0-35", level: "green", body: "日元仍是融资货币，风险资产可以继续吃套息供氧；只做日常观察。" },
    { title: "观察区", range: "35-55", level: "yellow", body: "USD/JPY高位、BOJ口径和日债长端开始扰动，但还不是强平交易。" },
    { title: "预热区", range: "55-70", level: "amber", body: "日债曲线、寿险对冲、GPIF回流和美侧资金面开始共振，准备降风险。" },
    { title: "强平确认区", range: "70+", level: "red", body: "USD/JPY快速回落叠加SOFR/VIX/基差交易变色，套息平仓进入系统传导。" },
  ];

  const layers = [
    { title: "01 价格反转确认", weight: "25%", body: "USD/JPY不是越高越危险，真正危险是从162上方快速跌向154、148、140，说明套息交易开始被动还日元。", ids: ["usdJpy", "usdJpyReversalSpeed", "yenCarryReversalProb"] },
    { title: "02 日债曲线咬住机构", weight: "25%", body: "10Y、15Y、30Y JGB上行会穿透寿险、地区银行和财政三层资产负债表，是日侧主动触发的核心。", ids: ["jgb10y", "jgbCurveStress", "jgbAuctionDemandStress", "lifeInsurerHedgeRatio"] },
    { title: "03 GPIF回流是否有效", weight: "20%", body: "GPIF回流只有在真减海外存量、提高对冲且规模足够时才会改变趋势；只调增量更像延缓失控。", ids: ["gpifReflowGap", "foreignUstCustody", "usdJpy"] },
    { title: "04 政策财政特拉斯化", weight: "15%", body: "BOJ继续加息、高市财政不退、长债拍卖需求走弱，会把日本推向类似英国2022年的长债-养老金反馈。", ids: ["bojPolicyRate", "bojActiveHikeWindow", "japanFiscalTrussRisk", "jgbAuctionDemandStress"] },
    { title: "05 全球联动放大", weight: "15%", body: "日侧强平若撞上美侧SOFR、基差交易和VIX跳升，就从日本问题变成全球风险资产共振。", ids: ["sofrIorbStress", "basisTradeStress", "vixAbove28Days", "ctaConvexityNeed"] },
  ];

  const rows = [
    ["价格确认", "usdJpy", "162上方是政策失败叙事；154/148/140是反转确认阶梯", "套息交易反转不是日元继续贬，而是日元突然升值迫使空日元仓位回补。"],
    ["价格确认", "usdJpyReversalSpeed", ">55转黄；>75进入强平区", "看一周内从高位回落的速度。越快，越容易触发2024年8月式波动率反馈。"],
    ["日债曲线", "jgbCurveStress", "10Y>3%、15Y>4.5%、30Y>5%进入红灯组合", "日债收益率越高，寿险和地区银行持仓重估越痛，财政可持续性也会被市场重新定价。"],
    ["日债承接", "jgbAuctionDemandStress", ">65说明拍卖承压；>80说明长债承接塌陷", "收益率高只是第一步，拍卖需求走弱才说明市场开始拒绝日本财政扩张和央行紧缩的组合。"],
    ["机构资产负债表", "lifeInsurerHedgeRatio", "<55%转黄；<=47%转红", "对冲比低意味着机构暴露在汇率和海外债券双重波动下，日元急升会伤害资产端。"],
    ["机构回流", "gpifReflowGap", ">65说明治标；>80说明政策失效", "如果GPIF只调增量、不减存量、不愿牺牲收益，回流对USD/JPY更像短期口头干预。"],
    ["财政政策", "japanFiscalTrussRisk", ">65转黄；>82红灯", "财政扩张叠加央行紧缩会触发长债收益率飙升，类似英国特拉斯时刻。"],
    ["政策窗口", "bojActiveHikeWindow", "7/31微调=延续；+25bp=预热；Q4逼近1.5%=主动窗", "7/31是诊断期，Q4才是主动触发窗口。关键看BOJ是否把日元和日债问题一起纳入政策反应。"],
    ["全球联动", "sofrIorbStress", ">20bp转黄；>50bp红灯", "日侧反转如果撞上美侧回购市场缺钱，全球套息和基差交易会同时减杠杆。"],
    ["全球联动", "basisTradeStress", ">65转黄；>80红灯", "美债基差交易依赖低成本短融，日元强平会放大全球抵押品市场波动。"],
  ];

  const anchors = [
    { title: "第一档：已发生但可控", period: "2024.3 - 2026.7", signal: "加息5次、USD/JPY仍在162附近，寿险对冲比降至低位，日债长端上行。", global: "日本中小企业、财政和日债收益率已经痛，但还未形成系统爆点。" },
    { title: "第二档：加速窗", period: "2026 Q4", signal: "BOJ逼近1.5%、10Y JGB>3%、15Y>4.5%、GPIF回流乏力。", global: "形态更像日侧主动版2024.8：USD/JPY 162→148→140，日股、寿险、银行先承压。" },
    { title: "第三档：真失控尾部", period: "2027", signal: "日债10Y>3.5%、30Y>5%、USD/JPY破170或急转升，且美侧SOFR同步跳。", global: "日美双爆：套息强平、基差交易踩踏、风险资产相关性趋近1。" },
  ];

  const byId = (id) => indicators.find((item) => item.id === id);
  const meta = {
    green: { label: "绿灯", score: 0 },
    yellow: { label: "黄灯", score: 1 },
    amber: { label: "黄灯偏红", score: 2 },
    red: { label: "红灯", score: 3 },
  };

  function getStatus(item) {
    const value = Number(item.value);
    const rule = item.rule;
    let level = "green";
    if (rule.mode === "higherRisk") {
      if (value >= rule.amber) level = "red";
      else if (value >= rule.yellow) level = "amber";
      else if (value >= rule.green) level = "yellow";
    }
    if (rule.mode === "lowerRisk") {
      if (value <= rule.amber) level = "red";
      else if (value <= rule.yellow) level = "amber";
      else if (value <= rule.green) level = "yellow";
    }
    if (rule.mode === "rangeRisk") {
      if (value <= rule.lowRed || value >= rule.highRed) level = "red";
      else if (value <= rule.lowAmber || value >= rule.highAmber) level = "amber";
    }
    return { level, ...meta[level] };
  }

  function format(item) {
    if (!item) return "--";
    const value = Number(item.value);
    const text = Math.abs(value) >= 100 ? value.toFixed(1) : value.toFixed(2).replace(/\.00$/, "");
    return `${text}${item.unit || ""}`;
  }

  function statusBadge(item) {
    const status = getStatus(item);
    return `<span class="status-badge"><span class="status-dot ${status.level}"></span>${status.label}</span>`;
  }

  function injectStyles() {
    if (document.getElementById("yenCarryModuleStyle")) return;
    const style = document.createElement("style");
    style.id = "yenCarryModuleStyle";
    style.textContent = `
      .carry-stage-strip{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
      .carry-stage-card{position:relative;min-height:154px;border:1px solid var(--line);background:linear-gradient(180deg,rgba(255,255,255,.028),transparent 92px),var(--surface);padding:16px;display:grid;gap:10px;align-content:start;overflow:hidden}
      .carry-stage-card:before{content:"";position:absolute;inset:0 0 auto 0;height:3px;background:var(--green)}
      .carry-stage-card.yellow:before{background:var(--yellow)}.carry-stage-card.amber:before{background:var(--amber)}.carry-stage-card.red:before{background:var(--red)}
      .carry-stage-card.active{border-color:rgba(215,173,83,.68);box-shadow:inset 0 0 0 1px rgba(215,173,83,.18),0 14px 30px rgba(0,0,0,.24)}
      .carry-stage-card div{display:flex;align-items:center;gap:8px}.carry-stage-card strong{color:var(--text);font-size:14px}.carry-stage-card em{color:var(--gold);font-size:24px;font-weight:900;font-style:normal;line-height:1}.carry-stage-card p{color:var(--muted);font-size:12px;line-height:1.62;margin:0}
      .layer-weight{border:1px solid rgba(232,226,211,.14);background:rgba(255,255,255,.04);color:var(--gold);font-size:11px;font-weight:800;line-height:1;padding:6px 7px;white-space:nowrap}
      .bubble-step-head strong{flex:1}
      @media (max-width:1180px){.carry-stage-strip{grid-template-columns:repeat(2,minmax(0,1fr))}}@media (max-width:720px){.carry-stage-strip{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function ensureSection() {
    const nav = document.querySelector(".nav-list");
    if (nav && !nav.querySelector('[data-view="carry"]')) {
      const button = document.createElement("button");
      button.className = "nav-item";
      button.type = "button";
      button.dataset.view = "carry";
      button.innerHTML = '<span class="nav-icon">JPY</span><span>日元反转</span>';
      nav.appendChild(button);
    }
    if (document.getElementById("carry")) return;
    const section = document.createElement("section");
    section.id = "carry";
    section.className = "view";
    section.setAttribute("aria-labelledby", "carryTitle");
    section.innerHTML = `
      <div class="section-head page-head"><div><p class="eyebrow">Yen Carry Reversal</p><h2 id="carryTitle">日元套息交易反转概率监控</h2></div><span class="pill">价格 · 日债 · 机构 · 财政 · 全球联动</span></div>
      <div class="ashare-hero carry-hero"><div><p class="eyebrow">核心判断</p><h3>不要只看日元崩不崩，要看日债、GPIF回流和全球资金面是否咬到一起</h3><p>当前更像“失控前夜”：USD/JPY在高位、日债曲线抬升、寿险对冲比低、GPIF回流被讨论，但尚未进入系统爆点。真正的反转确认，是日元从高位快速升值、日债长端继续上行、BOJ被迫加速、且美侧SOFR/基差交易同步变色。</p></div><div class="heat-score"><span>反转概率</span><strong id="carryScore">--</strong><em id="carryStatus">计算中</em></div></div>
      <div class="carry-stage-strip" id="carryStageStrip"></div><div class="bubble-chain" id="carryLayerGrid"></div>
      <div class="split-layout"><section class="panel"><div class="section-head"><div><p class="eyebrow">Trigger Matrix</p><h3>触发器红绿灯</h3></div><span class="pill" id="carryReason">等待计算</span></div><div class="table-panel compact-table"><table><thead><tr><th>层级</th><th>指标</th><th>当前值</th><th>灯号</th><th>触发阈值</th><th>为什么看它</th></tr></thead><tbody id="carryTable"></tbody></table></div></section><section class="panel"><div class="section-head"><div><p class="eyebrow">Time Anchors</p><h3>三档出问题时间锚</h3></div></div><div class="history-list" id="carryAnchors"></div></section></div>
    `;
    const entry = document.getElementById("entry") || document.getElementById("calendar");
    entry?.parentElement?.insertBefore(section, entry);
  }

  function render() {
    injectStyles();
    ensureSection();
    const probability = byId("yenCarryReversalProb");
    const score = Number(probability.value);
    const status = score >= 70 ? { level: "red", label: "高概率" } : score >= 55 ? { level: "amber", label: "黄灯偏红" } : score >= 35 ? { level: "yellow", label: "黄灯" } : { level: "green", label: "低概率" };
    document.getElementById("carryScore").textContent = Math.round(score);
    document.getElementById("carryStatus").textContent = status.label;
    document.getElementById("carryReason").textContent = score >= 70 ? "反转确认需降风险" : score >= 55 ? "高位预警，等待速度确认" : "仍属观察期";
    document.getElementById("carryStageStrip").innerHTML = bands.map((band) => `<article class="carry-stage-card ${band.level} ${status.level === band.level ? "active" : ""}"><div><span class="status-dot ${band.level}"></span><strong>${band.title}</strong></div><em>${band.range}</em><p>${band.body}</p></article>`).join("");
    document.getElementById("carryLayerGrid").innerHTML = layers.map((layer) => {
      const items = layer.ids.map(byId).filter(Boolean);
      const avg = items.reduce((sum, item) => sum + getStatus(item).score, 0) / items.length;
      const level = avg >= 2.2 ? "red" : avg >= 1.4 ? "amber" : avg >= 0.7 ? "yellow" : "green";
      return `<article class="bubble-step ${level}"><div class="bubble-step-head"><strong>${layer.title}</strong><span class="layer-weight">${layer.weight}</span><span class="status-dot ${level}"></span></div><p>${layer.body}</p><div class="bubble-mini-list">${items.map((item) => `<div><span class="status-dot ${getStatus(item).level}"></span><em>${item.name}</em><strong>${format(item)}</strong></div>`).join("")}</div></article>`;
    }).join("");
    document.getElementById("carryTable").innerHTML = rows.map(([layer, id, threshold, logic]) => {
      const item = byId(id);
      return `<tr><td>${layer}</td><td class="indicator-name"><strong>${item.name}</strong><span>${item.source}</span></td><td>${format(item)}<br><span class="muted">${item.asOf}</span></td><td>${statusBadge(item)}</td><td>${threshold}</td><td>${logic}</td></tr>`;
    }).join("");
    document.getElementById("carryAnchors").innerHTML = anchors.map((item) => `<article class="history-item"><span>${item.period}</span><strong>${item.title}</strong><p><b>触发：</b>${item.signal}</p><p><b>传导：</b>${item.global}</p></article>`).join("");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render);
  else render();
})();

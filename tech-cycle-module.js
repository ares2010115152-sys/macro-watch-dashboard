(function () {
  const sectors = [
    {
      id: "optics",
      name: "光模块",
      icon: "OPT",
      phase: "高位平台验证",
      phaseClass: "amber",
      earningsPeak: "尚未确认，当前约20%平台",
      priceWindow: "2026 Q2-Q4",
      probability: 58,
      confidence: "中",
      series: {
        labels: ["FY26Q2", "FY26Q3", "FY26Q4E"],
        values: [24.7, 21.5, 21.8],
        actualCount: 2,
        source: "Lumentum公司收入；Q4为指引中值",
      },
      thesis: "代表公司收入环比仍维持约20%的高位平台，不能解释成斜率已经快速坍塌。真正的拐点要等下一季指引下修、1.6T放量不再带动毛利率，或强财报后股价失去反应。",
      confirm: ["强财报后不再创新高", "1.6T放量但毛利率下滑", "2027盈利预测停止上修"],
    },
    {
      id: "memory",
      name: "存储 / HBM",
      icon: "HBM",
      phase: "极端加速后正常化",
      phaseClass: "amber",
      earningsPeak: "FY26 Q2-Q3大概率已过",
      priceWindow: "2026 Q3-Q4",
      probability: 76,
      confidence: "中高",
      series: {
        labels: ["FY26Q2", "FY26Q3", "FY26Q4E"],
        values: [74.9, 73.8, 20.6],
        actualCount: 2,
        source: "Micron公司收入；Q4为500亿美元指引中值",
      },
      thesis: "美光收入环比在FY26 Q2-Q3连续接近74%，Q4指引仍增长约21%。因此更准确的表述是“最快增速大概率已过，但收入和盈利仍处高增长”，不等于存储景气已经结束。",
      confirm: ["HBM交付周期缩短", "DRAM涨价速度放缓", "新增产能指引明显上调"],
    },
    {
      id: "pcb",
      name: "高阶 PCB",
      icon: "PCB",
      phase: "加速兑现",
      phaseClass: "yellow",
      earningsPeak: "2026 Q3-Q4",
      priceWindow: "2026年9-12月",
      probability: 65,
      confidence: "中",
      series: { labels: ["26Q1", "26Q2", "26Q3E", "26Q4E", "27Q1E"], values: [18, 35, 29, 16, 8], actualCount: 2, source: "行业模型，非单一公司财报" },
      thesis: "Rubin服务器和交换机定型后，订单排产、良率爬坡再进入收入确认，业绩传导晚于光模块，秋季是主要预期兑现区。",
      confirm: ["高阶产能利用率见顶", "扩产快于订单增量", "收入增长但应收与存货更快"],
    },
    {
      id: "chips",
      name: "AI芯片 / ASIC",
      icon: "GPU",
      phase: "景气扩散",
      phaseClass: "green",
      earningsPeak: "2026 Q3-Q4",
      priceWindow: "2026 Q4-2027 Q1",
      probability: 58,
      confidence: "中",
      series: { labels: ["26Q1", "26Q2", "26Q3E", "26Q4E", "27Q1E"], values: [20, 12, 17, 11, 7], actualCount: 2, source: "行业模型，非单一公司财报" },
      thesis: "博通Q3指引显示ASIC与网络芯片明显加速；英伟达收入创新高不等于环比斜率创新高，板块将先出现内部结构分化。",
      confirm: ["CSP资本开支停止上修", "AI芯片交付周期缩短", "龙头指引首次低于市场上沿"],
    },
    {
      id: "domestic-compute",
      name: "国产算力链",
      icon: "CN-AI",
      phase: "订单兑现期",
      phaseClass: "green",
      earningsPeak: "2026 Q4-2027 Q1",
      priceWindow: "2026 Q4-2027 Q1",
      probability: 56,
      confidence: "中低",
      series: { labels: ["26Q1", "26Q2E", "26Q3E", "26Q4E", "27Q1E"], values: [9, 16, 25, 31, 19], actualCount: 1, source: "招标、供给与交付节奏模型" },
      thesis: "国产AI芯片、服务器、液冷和高速连接的收入确认取决于芯片供给、运营商及政企招标和整机交付，政策驱动更强、季度波动也更大，整体较海外光模块与PCB晚一拍。",
      confirm: ["招标金额增长但交付率下降", "国产芯片供给不再构成瓶颈", "服务器收入增长但回款明显变慢"],
    },
    {
      id: "equipment",
      name: "半导体设备",
      icon: "WFE",
      phase: "后周期扩张",
      phaseClass: "green",
      earningsPeak: "2026 Q4-2027 Q1",
      priceWindow: "2026 Q4-2027 Q1",
      probability: 54,
      confidence: "中低",
      series: { labels: ["26Q1", "26Q2", "26Q3E", "26Q4E", "27Q1E"], values: [8, 13, 18, 21, 12], actualCount: 2, source: "WFE与公司指引模型" },
      thesis: "晶圆厂资本开支和先进封装扩产向设备收入传导最晚；基本面可能最后见顶，但高估值会让股价提前于订单拐点反应。",
      confirm: ["在手订单增速转负", "客户资本开支转向维护", "订单仍强但设备股跌破财报缺口"],
    },
  ];

  function spark(series) {
    const { values, labels, actualCount, source } = series;
    const max = Math.max(...values);
    return `<div class="tech-series-meta"><span>季度收入环比</span><span>实线=已披露 · 虚线=指引/模型</span></div>
    <div class="tech-spark" aria-label="季度收入环比增速，区分已披露与预测">${values.map((value, index) => `
      <div class="tech-spark-col ${index >= actualCount ? "is-estimate" : "is-actual"}">
        <span style="height:${Math.max(8, Math.round((value / max) * 78))}px"></span>
        <b>${value}%</b>
        <em>${labels[index]}</em>
      </div>`).join("")}
    </div><div class="tech-series-source">${source}</div>`;
  }

  function addStyles() {
    if (document.getElementById("techCycleStyles")) return;
    const style = document.createElement("style");
    style.id = "techCycleStyles";
    style.textContent = `
      .tech-hero{position:relative;min-height:390px;border:1px solid var(--line);overflow:hidden;background:#0b0d0c;margin-bottom:16px}
      .tech-hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.58;filter:saturate(.84) contrast(1.05)}
      .tech-hero:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(9,11,9,.96) 0%,rgba(9,11,9,.78) 42%,rgba(9,11,9,.12) 100%),linear-gradient(0deg,rgba(9,11,9,.68),transparent 55%)}
      .tech-hero-copy{position:relative;z-index:1;max-width:690px;padding:44px 38px;display:grid;gap:14px}
      .tech-hero-copy h3{font-size:30px;line-height:1.3}.tech-hero-copy p{color:var(--soft);line-height:1.8}
      .tech-hero-kpis{display:flex;flex-wrap:wrap;gap:9px;margin-top:8px}.tech-hero-kpis span{border:1px solid rgba(215,173,83,.34);background:rgba(12,14,12,.72);padding:8px 10px;color:var(--soft);font-size:12px}
      .tech-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-bottom:16px}
      .tech-card{border:1px solid var(--line);background:linear-gradient(180deg,rgba(255,255,255,.028),transparent 110px),var(--surface);padding:18px;display:grid;gap:15px}
      .tech-card-head{display:flex;gap:12px;align-items:center}.tech-chip{width:46px;height:46px;display:grid;place-items:center;border:1px solid rgba(108,168,182,.34);background:rgba(108,168,182,.08);color:var(--blue);font-size:11px;font-weight:900}
      .tech-card-head div:nth-child(2){flex:1}.tech-card-head strong{display:block}.tech-card-head small{color:var(--muted)}
      .tech-prob{font-size:28px;color:var(--gold);font-weight:900}.tech-prob small{font-size:11px;color:var(--muted);font-weight:600}
      .tech-window{display:grid;grid-template-columns:1fr 1fr;gap:10px}.tech-window div{border:1px solid rgba(232,226,211,.1);background:#11130f;padding:11px}.tech-window span{display:block;color:var(--muted);font-size:11px;margin-bottom:5px}.tech-window b{font-size:13px}
      .tech-card p{font-size:13px;color:var(--soft);line-height:1.72}
      .tech-spark{height:118px;display:flex;gap:8px;align-items:end;border-bottom:1px solid var(--line);padding:4px 5px 0;background:linear-gradient(180deg,transparent,rgba(108,168,182,.025))}
      .tech-spark-col{flex:1;height:112px;display:flex;flex-direction:column;justify-content:end;align-items:center;gap:3px}.tech-spark-col span{width:min(34px,72%);background:linear-gradient(180deg,var(--gold),rgba(108,168,182,.56));border:1px solid rgba(255,255,255,.08)}.tech-spark-col b{font-size:10px}.tech-spark-col em{font-size:10px;color:var(--muted);font-style:normal}
      .tech-spark-col.is-estimate span{background:transparent;border:1px dashed var(--gold)}.tech-series-meta{display:flex;justify-content:space-between;gap:10px;color:var(--muted);font-size:10px}.tech-series-source{margin-top:-10px;color:var(--muted);font-size:10px}
      .tech-checks{display:grid;gap:7px}.tech-checks div{display:grid;grid-template-columns:12px 1fr;gap:8px;color:var(--muted);font-size:12px}.tech-checks i{width:8px;height:8px;border-radius:50%;background:var(--yellow);margin-top:4px}
      .tech-matrix{overflow:auto;border:1px solid var(--line);background:#11130f}.tech-matrix table{min-width:940px;width:100%;border-collapse:collapse}.tech-matrix th,.tech-matrix td{padding:13px;border-bottom:1px solid rgba(232,226,211,.08);text-align:left}.tech-matrix th{color:var(--muted);font-size:11px}.tech-matrix td{font-size:12px;color:var(--soft)}
      .tech-method{margin-top:14px;border:1px solid rgba(215,173,83,.3);background:rgba(215,173,83,.06);padding:15px;color:var(--soft);font-size:13px;line-height:1.72}
      @media(max-width:900px){.tech-grid{grid-template-columns:1fr}.tech-hero-copy{padding:28px 22px}.tech-hero{min-height:430px}.tech-hero img{opacity:.35}.tech-hero-copy h3{font-size:25px}}
    `;
    document.head.appendChild(style);
  }

  function activate(button) {
    document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".view").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    document.getElementById("tech-cycle")?.classList.add("active");
  }

  function mount() {
    addStyles();
    const nav = document.querySelector(".nav-list");
    let navButton = nav?.querySelector('[data-view="tech-cycle"]');
    if (nav && !navButton) {
      navButton = document.createElement("button");
      navButton.className = "nav-item";
      navButton.type = "button";
      navButton.dataset.view = "tech-cycle";
      navButton.innerHTML = '<span class="nav-icon" aria-hidden="true">AI</span>科技斜率';
      const entry = nav.querySelector('[data-view="entry"]');
      nav.insertBefore(navButton, entry);
      navButton.addEventListener("click", () => activate(navButton));
    }

    if (document.getElementById("tech-cycle")) return;
    const section = document.createElement("section");
    section.id = "tech-cycle";
    section.className = "view";
    section.setAttribute("aria-labelledby", "techCycleTitle");
    section.innerHTML = `
      <div class="section-head page-head">
        <div><p class="eyebrow">AI Earnings Slope Monitor</p><h2 id="techCycleTitle">科技环比业绩增速与见顶预测</h2></div>
        <span class="pill">数据更新：2026-07-29</span>
      </div>
      <div class="tech-hero">
        <img src="./tech-earnings-cycle.png" alt="AI硬件产业链业绩周期传导视觉图" />
        <div class="tech-hero-copy">
          <p class="eyebrow">核心结论</p>
          <h3>存储的极端增速或已过峰，光模块仍在约20%的高位平台</h3>
          <p>图表已把公司实际披露和后续指引/行业模型分开。斜率峰值过去只表示环比增速从极端水平回落，不等于收入下降或产业景气结束；顶部仍需盈利预测停止上修与价格行为共同确认。</p>
          <div class="tech-hero-kpis"><span>存储：最快增速大概率已过</span><span>光模块：尚未确认明显减速</span><span>后续：PCB / 芯片 / 国产算力</span></div>
        </div>
      </div>
      <div class="tech-grid">
        ${sectors.map((sector) => `
          <article class="tech-card">
            <div class="tech-card-head">
              <span class="tech-chip">${sector.icon}</span>
              <div><strong>${sector.name}</strong><small>${sector.phase} · 置信度${sector.confidence}</small></div>
              <div class="tech-prob">${sector.probability}%<small>见顶风险</small></div>
            </div>
            <div class="tech-window"><div><span>业绩斜率峰值</span><b>${sector.earningsPeak}</b></div><div><span>股价高风险窗口</span><b>${sector.priceWindow}</b></div></div>
            ${spark(sector.series)}
            <p>${sector.thesis}</p>
            <div class="tech-checks">${sector.confirm.map((item) => `<div><i></i><span>${item}</span></div>`).join("")}</div>
          </article>`).join("")}
      </div>
      <section class="panel">
        <div class="section-head"><div><p class="eyebrow">Peak Matrix</p><h3>产业链见顶顺序与证伪条件</h3></div><span class="pill">实际值与预测值已分列</span></div>
        <div class="tech-matrix"><table><thead><tr><th>顺序</th><th>环节</th><th>当前阶段</th><th>斜率峰值</th><th>价格风险窗</th><th>需要证伪的核心变量</th></tr></thead><tbody>
          ${sectors.map((sector, index) => `<tr><td>${index + 1}</td><td><strong>${sector.name}</strong></td><td>${sector.phase}</td><td>${sector.earningsPeak}</td><td>${sector.priceWindow}</td><td>${sector.confirm[0]}</td></tr>`).join("")}
        </tbody></table></div>
        <div class="tech-method"><strong>口径说明：</strong>光模块采用Lumentum代表性公司收入，存储采用Micron公司收入；带E的季度为公司指引中值或行业模型，不与已披露财报混算。其余板块缺少统一行业口径，保留模型值并明确标注。只有“财报强但股价不涨、下一季预测停止上修、存货或应收快于收入”三类信号至少出现两类，才从预测窗口升级为顶部确认。</div>
      </section>`;
    const entrySection = document.getElementById("entry");
    entrySection?.parentElement?.insertBefore(section, entrySection);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();

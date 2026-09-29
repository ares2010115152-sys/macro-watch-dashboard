(function () {
  const sectors = [
    {
      id: "optics",
      name: "光模块",
      icon: "OPT",
      phase: "实际值再加速，前瞻高位放缓",
      phaseClass: "amber",
      earningsPeak: "FY27Q1E或接近平台峰值",
      priceWindow: "2026 Q2-Q4",
      probability: 52,
      confidence: "中",
      series: {
        labels: ["FY26Q2", "FY26Q3", "FY26Q4", "FY27Q1E"],
        values: [24.7, 21.5, 24.9, 23.8],
        actualCount: 3,
        source: "Lumentum公司收入；FY27Q1E为指引中值",
      },
      thesis: "最新实际收入环比从21.5%重新加速至约24.9%，说明光模块最快增长并没有在上一季确认结束；下一季指引中值隐含约23.8%，只是高位轻微放缓。真正拐点仍要等指引明显下修、1.6T放量不再带动毛利率，或强财报后股价失去反应。",
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
      phase: "财报确认再加速",
      phaseClass: "green",
      earningsPeak: "2026 Q3-Q4仍未确认",
      priceWindow: "2026 Q4-2027 Q2",
      probability: 48,
      confidence: "中高",
      series: { labels: ["NV FY27Q1", "NV FY27Q2", "NV FY27Q3E", "AVGO FY26Q3", "AVGO FY26Q4E"], values: [20.0, 17.9, 12.2, 54.0, 29.9], actualCount: 4, source: "NVIDIA总收入；Broadcom AI半导体收入，E为公司指引中值" },
      thesis: "英伟达Q2收入环比增长17.9%，Q3指引中值仍隐含约12.2%；博通Q3 AI半导体收入环比增长54%，Q4指引再隐含约29.9%。这组数据否定了“AI硬件景气已经坍塌”，但也显示GPU斜率温和放缓、ASIC仍在强加速，板块内部会继续分化。",
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

  const restartWindows = [
    { window: "盈利硬扛", probability: 50, note: "30Y已破5.5%，但回购管道平稳；订单与现金流继续上修可维持第二浪" },
    { window: "长端压顶", probability: 30, note: "30Y维持5.5%以上、CCC利差继续扩大，行情收缩到现金流最强的硬件龙头" },
    { window: "融资事故", probability: 20, note: "SOFR-IORB升破20bp或SRF显著使用，第二浪从估值调整升级为去杠杆" },
  ];

  const peakWindows = [
    { window: "2026 Q4-2027 Q1", probability: 30, note: "30Y持续高于5.5%、CCC继续走阔或日元快速反转，顶部提前" },
    { window: "2027年Q2-Q3", probability: 50, note: "基准情景：融资管道仍稳，股价领先资本开支和盈利斜率一至两个季度见顶" },
    { window: "2027年Q4以后", probability: 20, note: "30Y回到5.2%下方，AI收入和现金流追上资本开支" },
  ];

  const analogs = [
    { cycle: "2000互联网", first: "首轮急跌约35%", restart: "约2个月后反弹约41%-43%", top: "反弹未创新高，随后继续长期下行", lesson: "只有价格反弹、盈利预期继续下修时，是熊市陷阱" },
    { cycle: "2021半导体", first: "首次见顶后回撤约23%", restart: "约3个月后由缺芯与业绩兑现推动", top: "约5个月后形成第二高点", lesson: "高景气延续可产生M顶，但第二浪宽度通常收窄" },
    { cycle: "2021-22光伏", first: "首次见顶后最大回撤约26%", restart: "2022年4月重启", top: "2022年8月再创新高后见顶", lesson: "技术升级与需求上修能推新高，产能过剩决定最终顶部" },
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
      .cycle-callout{border:1px solid rgba(215,173,83,.34);background:linear-gradient(135deg,rgba(215,173,83,.1),rgba(108,168,182,.04));padding:20px;margin-bottom:16px;display:grid;gap:16px}.cycle-callout-head{display:flex;justify-content:space-between;gap:20px;align-items:start}.cycle-callout-head h3{font-size:23px;line-height:1.35}.cycle-callout-head p{color:var(--soft);line-height:1.7;max-width:760px}.cycle-score{min-width:112px;text-align:right;color:var(--gold);font-size:36px;font-weight:900}.cycle-score small{display:block;font-size:10px;color:var(--muted)}
      .cycle-facts{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.cycle-fact{border:1px solid rgba(232,226,211,.1);background:#10120f;padding:12px}.cycle-fact b{display:block;color:var(--soft);margin-bottom:6px}.cycle-fact span{font-size:11px;line-height:1.55;color:var(--muted)}
      .window-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px}.window-panel{border:1px solid var(--line);background:var(--surface);padding:17px}.window-panel h4{margin-bottom:12px}.window-row{display:grid;grid-template-columns:105px 1fr 46px;gap:10px;align-items:center;padding:9px 0;border-bottom:1px solid rgba(232,226,211,.08)}.window-row:last-child{border-bottom:0}.window-row b{font-size:12px}.window-row span{font-size:11px;color:var(--muted);line-height:1.45}.window-row strong{color:var(--gold);text-align:right}
      .analog-table{overflow:auto;border:1px solid var(--line);margin-bottom:16px}.analog-table table{min-width:900px;width:100%;border-collapse:collapse;background:#10120f}.analog-table th,.analog-table td{padding:12px;border-bottom:1px solid rgba(232,226,211,.08);text-align:left;font-size:12px}.analog-table th{color:var(--muted)}.analog-table td{color:var(--soft)}
      @media(max-width:900px){.tech-grid,.window-grid{grid-template-columns:1fr}.cycle-facts{grid-template-columns:1fr}.cycle-callout-head{display:grid}.cycle-score{text-align:left}.tech-hero-copy{padding:28px 22px}.tech-hero{min-height:430px}.tech-hero img{opacity:.35}.tech-hero-copy h3{font-size:25px}}
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
        <span class="pill">数据更新：2026-09-28</span>
      </div>
      <div class="tech-hero">
        <img src="./tech-earnings-cycle.png" alt="AI硬件产业链业绩周期传导视觉图" />
        <div class="tech-hero-copy">
          <p class="eyebrow">核心结论</p>
          <h3>第二浪仍在，但30年美债破5.5%后只能靠盈利、不能再靠估值</h3>
          <p>存储的极端环比增速大概率已经过去，光模块、ASIC和AI服务器仍在增长。美联储维持充裕准备金让融资管道暂时平稳，但准备金管理不是QE，无法压住期限溢价；股票顶部要等盈利上修停止、CCC信用继续恶化和强财报不再推动股价。</p>
          <div class="tech-hero-kpis"><span>长债：5.5%压力线已突破</span><span>管道：SOFR-IORB约0bp</span><span>基准顶部：2027 Q2-Q3</span></div>
        </div>
      </div>
      <section class="cycle-callout">
        <div class="cycle-callout-head"><div><p class="eyebrow">REGIME SHIFT</p><h3>当前进入“长端破位、管道平稳”的估值压缩阶段</h3><p>9月28日30年美债收于约5.55%、10年期约5.23%，图片所称的长端上限已被突破；但SOFR与IORB同为3.90%、SRF和美元互换接近零，暂不支持雷曼判断。下一步要盯长端持续性、CCC信用、自由现金流覆盖与强财报后的价格反应。</p></div><div class="cycle-score">50%<small>2027 Q2-Q3顶部权重</small></div></div>
        <div class="cycle-facts"><div class="cycle-fact"><b>价格层</b><span>纳指创高后回到26,820点，第二浪仍在但开始受长债压制。</span></div><div class="cycle-fact"><b>管道层</b><span>SOFR-IORB约0bp、SRF约100万美元，美元融资尚未失灵。</span></div><div class="cycle-fact"><b>信用层</b><span>整体HY约293bp仍稳，但CCC约1112bp已先行恶化。</span></div></div>
      </section>
      <div class="window-grid">
        <section class="window-panel"><p class="eyebrow">SECOND-WAVE PATH</p><h4>第二浪后续路径概率</h4>${restartWindows.map((item) => `<div class="window-row"><b>${item.window}</b><span>${item.note}</span><strong>${item.probability}%</strong></div>`).join("")}</section>
        <section class="window-panel"><p class="eyebrow">FINAL PEAK WINDOW</p><h4>最终顶部时间概率</h4>${peakWindows.map((item) => `<div class="window-row"><b>${item.window}</b><span>${item.note}</span><strong>${item.probability}%</strong></div>`).join("")}</section>
      </div>
      <div class="analog-table"><table><thead><tr><th>历史样本</th><th>首次调整</th><th>下一浪</th><th>最终顶部</th><th>对本轮的含义</th></tr></thead><tbody>${analogs.map((item) => `<tr><td><strong>${item.cycle}</strong></td><td>${item.first}</td><td>${item.restart}</td><td>${item.top}</td><td>${item.lesson}</td></tr>`).join("")}</tbody></table></div>
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
        <div class="tech-method"><strong>口径说明：</strong>光模块采用Lumentum代表性公司收入，存储采用Micron公司收入；带E的季度为公司指引中值或行业模型，不与已披露财报混算。时间概率是基于当前价格结构、盈利斜率、利率和历史M顶样本的情景权重，不是确定日期。只有“财报强但股价不涨、下一季预测停止上修、存货或应收快于收入”三类信号至少出现两类，才从预测窗口升级为顶部确认。</div>
      </section>`;
    const entrySection = document.getElementById("entry");
    entrySection?.parentElement?.insertBefore(section, entrySection);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();

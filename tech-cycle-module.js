(function () {
  const sectors = [
    {
      id: "optics",
      name: "光模块",
      icon: "OPT",
      phase: "顶部验证",
      phaseClass: "amber",
      earningsPeak: "2026 Q2-Q3",
      priceWindow: "2026 Q2-Q4",
      probability: 72,
      confidence: "中",
      qoq: [42, 24, 12, 8, 7],
      thesis: "800G与1.6T共同放量，但市场已提前交易较多。Q3能否继续上修2027年订单和毛利率，决定Q2是绝对顶还是左顶。",
      confirm: ["强财报后不再创新高", "1.6T放量但毛利率下滑", "2027盈利预测停止上修"],
    },
    {
      id: "memory",
      name: "存储 / HBM",
      icon: "HBM",
      phase: "主升后段",
      phaseClass: "amber",
      earningsPeak: "2026 Q2-Q3",
      priceWindow: "2026 Q3-Q4",
      probability: 76,
      confidence: "中高",
      qoq: [31, 26, 17, 8, 3],
      thesis: "价格、销量与毛利率三重共振最强，但商品属性决定盈利预测会在供给改善前先见顶，是最可能率先完成主升浪的环节。",
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
      qoq: [18, 35, 29, 16, 8],
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
      qoq: [20, 12, 17, 11, 7],
      thesis: "博通Q3指引显示ASIC与网络芯片明显加速；英伟达收入创新高不等于环比斜率创新高，板块将先出现内部结构分化。",
      confirm: ["CSP资本开支停止上修", "AI芯片交付周期缩短", "龙头指引首次低于市场上沿"],
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
      qoq: [8, 13, 18, 21, 12],
      thesis: "晶圆厂资本开支和先进封装扩产向设备收入传导最晚；基本面可能最后见顶，但高估值会让股价提前于订单拐点反应。",
      confirm: ["在手订单增速转负", "客户资本开支转向维护", "订单仍强但设备股跌破财报缺口"],
    },
  ];

  const quarters = ["26Q1", "26Q2", "26Q3", "26Q4", "27Q1"];

  function spark(values) {
    const max = Math.max(...values);
    return `<div class="tech-spark" aria-label="季度环比增速预测">${values.map((value, index) => `
      <div class="tech-spark-col">
        <span style="height:${Math.max(8, Math.round((value / max) * 78))}px"></span>
        <b>${value}%</b>
        <em>${quarters[index]}</em>
      </div>`).join("")}
    </div>`;
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
        <span class="pill">模型更新：2026-07-24</span>
      </div>
      <div class="tech-hero">
        <img src="./tech-earnings-cycle.png" alt="AI硬件产业链业绩周期传导视觉图" />
        <div class="tech-hero-copy">
          <p class="eyebrow">核心结论</p>
          <h3>光模块与存储进入顶部验证，PCB正在兑现，芯片与设备拐点更晚</h3>
          <p>这里的“见顶”不是预测某一天，而是估算盈利预测上修速度、环比增速与股价趋势发生共振反转的时间窗。股价顶部通常领先业绩绝对值顶部，但只有在预测停止上修后才确认。</p>
          <div class="tech-hero-kpis"><span>最早风险：存储 / 光模块</span><span>秋季兑现：高阶PCB</span><span>延后观察：芯片 / 设备</span></div>
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
            ${spark(sector.qoq)}
            <p>${sector.thesis}</p>
            <div class="tech-checks">${sector.confirm.map((item) => `<div><i></i><span>${item}</span></div>`).join("")}</div>
          </article>`).join("")}
      </div>
      <section class="panel">
        <div class="section-head"><div><p class="eyebrow">Peak Matrix</p><h3>产业链见顶顺序与证伪条件</h3></div><span class="pill">预测值 ≠ 已披露财报</span></div>
        <div class="tech-matrix"><table><thead><tr><th>顺序</th><th>环节</th><th>当前阶段</th><th>斜率峰值</th><th>价格风险窗</th><th>需要证伪的核心变量</th></tr></thead><tbody>
          ${sectors.map((sector, index) => `<tr><td>${index + 1}</td><td><strong>${sector.name}</strong></td><td>${sector.phase}</td><td>${sector.earningsPeak}</td><td>${sector.priceWindow}</td><td>${sector.confirm[0]}</td></tr>`).join("")}
        </tbody></table></div>
        <div class="tech-method"><strong>模型方法：</strong>综合季度收入与净利润环比预测、盈利预测上修幅度、产品代际切换、产能利用率、订单交付周期和估值拥挤度。只有“财报强但股价不涨、下一季预测停止上修、存货或应收快于收入”三类信号至少出现两类，才从预测窗口升级为顶部确认。</div>
      </section>`;
    const entrySection = document.getElementById("entry");
    entrySection?.parentElement?.insertBefore(section, entrySection);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();

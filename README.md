# Macro Watch Dashboard

一个用于持续跟踪能源、通胀、利率、AI资本开支、泡沫破裂前瞻指标、日元套息、美元流动性、黄金避险信号与A股散户情绪的静态网页。

线上地址：
https://ares2010115152-sys.github.io/macro-watch-dashboard/

## 使用方式

直接打开 `index.html` 或访问 GitHub Pages 即可使用。网页会把录入数据保存在浏览器 `localStorage`，并支持导出 JSON / CSV。

## 维护说明

- 页面**不读取** `data/*.json`：默认指标硬编码在 `app.js` 的 `defaultIndicators`，数据截止日由 `DATA_CUTOFF` 控制，用户手工录入的数据存在 `localStorage`。`data/` 下的文件只是历史归档快照，改它们不会更新页面。
- 刷新数据的落点：`app.js`（指标值 / `asOf` / `source` / `thesis`、`seedRecords` 历史观测、`DATA_CUTOFF`）、`index.html`、`yen-carry-module.js`、`tech-cycle-module.js` 中写死的日期与结论，以及本文件。
- 纯静态站，无构建步骤；GitHub Pages 由 `main` 分支根目录托管（含 `.nojekyll`），push 到 main 即上线。
- 超过有效窗口的历史观测会被标为“数据过期/待核”并退出综合评分，因此低频指标保留旧 `asOf` 即可，不要为了“看起来新”而改观测日。本次仍保留旧值的低频/主观项：A股开户与两融余额（11月13日全市场完整值未发布）、PPI能源分项、CLO利差、私人信贷、AI资本开支预估、日债曲线与寿险/GPIF等主观评分。

## 当前数据快照

核心数据于 2026-11-14 核验，各指标显示自己的实际观测日。11月11日为美国退伍军人节、美债休市，最近的财政部官方曲线为11月13日；FRED信用利差与SOFR最新可得为11月12日，H.4.1为11月12日发布的11月11日周三余额。10月CPI因2025年10月政府停摆缺失基数而不公布同比，最新同比仍为9月数据。

- 11月13日（美国财政部官方曲线）：10年/30年国债收益率5.15%/5.47%，10年期实际收益率2.91%；较10月9日的5.24%/5.60%回落，但长端仍在压力区。
- 11月12日（FRED / ICE BofA）：整体HY OAS 320bp（11月5日曾达348bp后回落）、CCC及以下1314bp；SOFR 3.90%与IORB 3.90%持平，SOFR-IORB回到0bp。
- 11月11日（H.4.1周三余额）：银行准备金2.970万亿美元、TGA 9121亿美元、RRP others约1.52亿美元；repo agreements others约500万美元仅作SRF代理，不等于逐笔SRF；外国官方托管可交易美债2.524万亿美元。
- 11月13日市场：布伦特约96.34美元（现货/连续报价口径，ICE 1月期货结算价95.84）、WTI约88.56美元、纳指25,136.27点、COMEX黄金约3887.60美元、VIX 19.30、MOVE约98.79、美元指数103.40；USD/JPY亚洲盘逼近160、10Y JGB约2.87%；沪深两市成交16,555亿元，较前一日缩量。
- 10月数据：CPI环比0.4%、核心环比0.3%双双超预期（同比因基数缺失未公布）；PPI同比6.5%、为2022年11月以来最大；非农新增16.5万人、失业率4.1%，9月上修至6.0万；台积电10月营收同比59.7%、创单月新高。

超过有效窗口的历史观测标为“数据过期/待核”，不参与综合评分；情景权重是研究判断，并非统计概率。本次只刷新客观观测值，主观评分与三档情景权重（15% / 45% / 40%）沿用10月13日判断，待复核。

## 泡沫预警

`泡沫预警` 标签页从单纯AI估值泡沫，扩展为四层链条：

1. 导火索：SpaceX巨型IPO、DeepSeek价格战、AI资本开支与美股估值。
2. 日元扳机：BOJ政策利率、USD/JPY、10Y JGB、日元套息平仓压力、外国官方托管美债。
3. 美元流动性：TGA、ON RRP、银行准备金、SOFR、金融CP-EFFR、SRF、央行美元互换。
4. 跨市场传染：VIX、MOVE、高收益债OAS、CLO利差、私人信贷赎回、COMEX铜仓位、CTA/长波动防守需求。

当前判断：海湾供应恢复令布伦特从10月初高位回落约三成、能源通胀压力缓解，但10月核心CPI环比0.3%连续第三个月偏粘、PPI同比6.5%，市场已把12月加息当作基准情形（11月10日CME FedWatch 25bp概率84.2%，11月15日LSEG口径约89%，部分官员提出50bp），美元指数升至103附近。长端仍在5.5%附近、弱信用继续走阔（CCC 1314bp），但SOFR与IORB持平、回购代理用量极低，尚无雷曼式美元融资事故。纳指较10月12日回落约7.7%、AI板块11月剧烈震荡，而台积电10月营收创单月新高，说明当前更接近“盈利验证与估值收缩”，而非流动性事故。股价顶部基准情景仍为2027 Q2-Q3，提前至2026 Q4—2027 Q1的主观权重维持40%（沿用10月判断，本次未调整）。下一个关键验证点是11月17日英伟达FY27Q3财报及财报后的股价反应。

全量快照文件：`data/snapshot-2026-06-30.json`（历史归档，不参与页面渲染）

上一版A股专项文件：`data/a-share-retail-sentiment-2026-06-03.json`

## 配置方案

`配置方案` 标签页为四阶段路径：

1. 先区分盈利硬扛和估值扩张：30年国债持续高于5.5%时，不把指数反弹自动解读为新一轮宽松牛市。
2. 弱信用与财报反应联判：CCC继续走阔、强财报股价不涨时主动收缩高杠杆和纯叙事持仓。
3. 流动性危机触发后防共振下跌：相关性趋近1时，黄金和大宗也可能先被卖出换现金，优先现金、短债、CTA和长波动。
4. 定向放水后做反弹与黄金主升：美元指数转弱、政策工具托底后，恒生科技、大宗商品和黄金重新进入弹性窗口。

## 主要来源

- 美国财政部11月名义与实际收益率曲线：https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?field_tdr_date_value_month=202611&type=daily_treasury_yield_curve
- Federal Reserve H.4.1（11月12日发布）：https://www.federalreserve.gov/releases/h41/current/
- 纽约联储SOFR：https://www.newyorkfed.org/markets/reference-rates/sofr
- FRED / ICE BofA HY与CCC OAS：https://fred.stlouisfed.org/series/BAMLH0A0HYM2 、 https://fred.stlouisfed.org/series/BAMLH0A3HYC
- BLS 9月CPI（10月14日发布）：https://www.bls.gov/news.release/archives/cpi_10142026.htm ；10月CPI（11月10日发布）：新华财经 https://m.cnfin.com/yw-lb//zixun/20261110/4493754_1.html ；10月PPI（11月13日发布）：https://www.bls.gov/news.release/ppi.nr0.htm
- BLS 10月就业报告（11月6日发布）：https://www.cnfin.com/hg-lb/detail/20261107/4492408_1.html
- EIA 11月6日当周石油库存：https://nenghua.mysteel.com/a/26111311/CFDAA0A52B777AD9.html
- 市场收盘与波动率（11月13日）：国际金融报《国际金融要情》 http://mp.weixin.qq.com/s?__biz=MjM5Nzc1NTQ4MA==&mid=2653430540&idx=1&sn=befb4ac8fcbe52f6771eead86bb3cc4 、 Cboe VIX https://vixchart.com/ 、 ICE BofA MOVE https://streetstats.finance/markets/volatility
- 日元与日债（11月13日）：https://investinglive.com/news/investinglive-asia-pacific-market-news-fed-hike-bets-ripple-through-asia/
- 日本央行9月决议：https://www.boj.or.jp/en/mopo/mpmdeci/mpr_2026/k260918a.pdf
- 台积电10月营收报告（SEC 6-K）：https://www.sec.gov/Archives/edgar/data/1046179/000104617926000796/tsm-revenue20261110.htm
- 美光FY26 Q4财报（历史对照）：https://investors.micron.com/news/press-release/2026/Micron-Technology-Inc--Reports-Record-Fiscal-Fourth-Quarter-and-Full-Year-2026-Results/

## 提醒

这是研究监控台，不是自动行情终端。交易前请用行情终端或官方数据源刷新最新价格、库存、利差、汇率与成交数据。

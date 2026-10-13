# Macro Watch Dashboard

一个用于持续跟踪能源、通胀、利率、AI资本开支、泡沫破裂前瞻指标、日元套息、美元流动性、黄金避险信号与A股散户情绪的静态网页。

线上地址：
https://ares2010115152-sys.github.io/macro-watch-dashboard/

## 使用方式

直接打开 `index.html` 或访问 GitHub Pages 即可使用。网页会把录入数据保存在浏览器 `localStorage`，并支持导出 JSON / CSV。

## 当前数据快照

核心数据于2026-10-13核验，各指标显示自己的实际观测日。10月12日美国国债市场休市，因此官方美债曲线最近值为10月9日；9月CPI定于10月14日发布，不能提前填入。

- 10月9日：美国10年/30年国债收益率5.24%/5.60%，10年实际收益率2.91%。
- 10月8日：整体HY / CCC及以下信用利差315bp / 1252bp，SOFR 3.87%、IORB 3.90%。
- 10月7日H.4.1：准备金周三余额3.022万亿美元、TGA 8858亿美元、RRP others约23亿美元；repo agreements others约200万美元仅作SRF代理，不等于逐笔SRF。
- 日银短端政策利率1.25%（9月24日生效）；10月13日亚洲盘USD/JPY约158.26。
- 美光FY26 Q4实际收入542.3亿美元，环比增长30.8%，替代旧版20.6%的指引推算。

超过有效窗口的历史观测标为“数据过期/待核”，不参与综合评分；情景权重是研究判断，并非统计概率。

## 泡沫预警

`泡沫预警` 标签页已从单纯AI估值泡沫，扩展为四层链条：

1. 导火索：SpaceX巨型IPO、DeepSeek价格战、AI资本开支与美股估值。
2. 日元扳机：BOJ政策利率、USD/JPY、10Y JGB、日元套息平仓压力、外国官方托管美债。
3. 美元流动性：TGA、ON RRP、银行准备金、SOFR、金融CP-EFFR、SRF、央行美元互换。
4. 跨市场传染：VIX、MOVE、高收益债OAS、CLO利差、私人信贷赎回、COMEX铜仓位、CTA/长波动防守需求。

当前判断：长债高压、弱信用明显恶化，但SOFR相对IORB未上冲，尚无雷曼式美元融资事故。AI硬件下一浪需要订单、自由现金流与强财报后的价格反应共同确认；股价顶部基准情景为2027 Q2-Q3，提前至2026 Q4—2027 Q1的主观权重上升至40%。

全量快照文件：`data/snapshot-2026-06-30.json`

上一版A股专项文件：`data/a-share-retail-sentiment-2026-06-03.json`

## 配置方案

`配置方案` 标签页已更新为四阶段路径：

1. 先区分盈利硬扛和估值扩张：30年国债持续高于5.5%时，不把指数反弹自动解读为新一轮宽松牛市。
2. 弱信用与财报反应联判：CCC继续走阔、强财报股价不涨时主动收缩高杠杆和纯叙事持仓。
3. 流动性危机触发后防共振下跌：相关性趋近1时，黄金和大宗也可能先被卖出换现金，优先现金、短债、CTA和长波动。
4. 定向放水后做反弹与黄金主升：美元指数转弱、政策工具托底后，恒生科技、大宗商品和黄金重新进入弹性窗口。

## 主要来源

- 美国财政部国债收益率曲线：https://home.treasury.gov/resource-center/data-chart-center/interest-rates
- Federal Reserve H.4.1：https://www.federalreserve.gov/releases/H41/Current/
- 纽约联储SOFR：https://www.newyorkfed.org/markets/reference-rates/sofr
- FRED / ICE HY与CCC OAS：https://fred.stlouisfed.org/series/BAMLH0A0HYM2 、https://fred.stlouisfed.org/series/BAMLH0A3HYC
- 日本央行9月决议：https://www.boj.or.jp/en/mopo/mpmdeci/mpr_2026/k260918a.pdf
- 美光FY26 Q4财报：https://investors.micron.com/news/press-release/2026/Micron-Technology-Inc--Reports-Record-Fiscal-Fourth-Quarter-and-Full-Year-2026-Results/

## 提醒

这是研究监控台，不是自动行情终端。交易前请用行情终端或官方数据源刷新最新价格、库存、利差、汇率与成交数据。

# Macro Watch Dashboard

一个用于持续跟踪能源、通胀、利率、AI资本开支、泡沫破裂前瞻指标、黄金避险信号与A股散户情绪的静态网页。

线上地址：

https://ares2010115152-sys.github.io/macro-watch-dashboard/

## 使用方式

直接打开 `index.html` 或访问 GitHub Pages 即可使用。网页会把录入数据保存在浏览器 `localStorage`，并支持导出 JSON / CSV。

## 当前数据快照

默认数据已按 2026-05-27 或临近日子的公开信息校准，主要包括：

- 布伦特原油：95.46 美元/桶，WTI 原油：88.68 美元/桶
- 霍尔木兹船舶通行量：26 艘/日，仍显著低于战前约 130 艘/日
- 美国商业原油库存：441.7 百万桶，馏分油库存：100.8 百万桶，SPR：365.1 百万桶
- 美国10年期国债收益率：4.48%，10年期实际利率：2.09%
- 现货黄金：4520.06 美元/盎司，美元指数：99.17
- VIX：16.29，MOVE：73.33，高收益债 OAS：272bp，CLO AAA 利差：126bp
- SOFR：3.62%，金融 CP-SOFR 利差代理：9bp，SRF 使用量接近 0，央行美元互换使用量接近 0
- SpaceX IPO 融资目标：750亿美元，估值目标：1.8万亿美元
- DeepSeek V4-Pro 降价幅度：75%
- COMEX 铜生产商净空头 Z 值：-2.20，投机资金净多百分位：94%
- A股融资余额：2.9109 万亿元，两融交易额占比：10.89%，5月27两市成交额：32385.6 亿元

## 新增页面

### 泡沫预警

新增 `泡沫预警` 标签页，用红绿灯形式梳理“估值泡沫到流动性危机”的前瞻指标。页面按四层链条展示：

1. 导火索：SpaceX巨型IPO、DeepSeek价格战、AI资本开支与美股估值
2. 微观资金：SOFR、金融CP-SOFR利差、SRF、央行美元互换额度
3. 资产失血：VIX、MOVE、高收益债OAS、CLO利差、私人信贷赎回
4. 跨市场传染：COMEX铜COT、美元、黄金、RRP和银行准备金

当前判断：红灯主要集中在估值、融资规模、AI价格战和商品仓位拥挤；资金市场指标仍偏绿，因此更接近“泡沫后段/寻找导火索”，尚未确认全面流动性危机。

### A股情绪

`A股情绪` 标签页用于每周跟踪散户入场和市场热度。当前快照日期为 2026-05-27：

- 4月个人投资者A股新增开户数：248.03 万户，较3月降温但仍偏活跃
- A股融资余额：2.9109 万亿元，继续刷新高位
- 两融交易额占比：10.89%，接近 11% 极端警戒线
- 两市成交额：32385.6 亿元，交易热度很高
- 涨停家数约 60 家，但个股普跌，说明市场广度恶化

专项数据文件：`data/a-share-retail-sentiment-2026-05-27.json`

全量快照文件：`data/snapshot-2026-05-27.json`

## 主要来源

- GoldPriceTracker 2026-05-27: https://goldpricetracker.com/gold-price/2026-05-27
- EIA / StoneX weekly petroleum recap: https://www.stonex.com/en/insights/eia-weekly-petroleum-data-recap-2026-05-28/
- Federal Reserve H.15: https://www.federalreserve.gov/releases/h15/
- Federal Reserve H.4.1: https://www.federalreserve.gov/releases/h41/
- SOFR data: https://www.sofrrate.com/
- StreetStats volatility and liquidity dashboards: https://streetstats.finance/markets/volatility
- Buffett Indicator: https://buffettindicator.org/
- CFTC Commitment of Traders: https://www.cftc.gov/MarketReports/CommitmentsofTraders/index.htm
- Le Monde SpaceX financing report: https://www.lemonde.fr/en/economy/article/2026/05/17/at-spacex-elon-musk-s-starship-orbital-dream-is-turning-into-a-financial-nightmare_6741398_19.html
- 4月A股新增开户数: https://www.stcn.com/article/detail/3899286.html
- A股融资余额突破2.9万亿元: https://finance.sina.com.cn/wm/2026-05-26/doc-inhzffss1540928.shtml
- 两融交易额占A股成交额比例: https://stock.stockstar.com/SS2026052600023414.shtml

## 提醒

这是研究监控台，不是自动行情终端。交易前请用行情终端或官方数据源刷新最新价格、库存、利差与成交数据。

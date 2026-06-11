# Macro Watch Dashboard

一个用于持续跟踪能源、通胀、利率、AI资本开支、泡沫破裂前瞻指标、日元套息平仓、美元流动性、黄金避险信号与A股散户情绪的静态网页。

线上地址：

https://ares2010115152-sys.github.io/macro-watch-dashboard/

## 使用方式

直接打开 `index.html` 或访问 GitHub Pages 即可使用。网页会把录入数据保存在浏览器 `localStorage`，并支持导出 JSON / CSV。

## 当前数据快照

默认数据已按 2026-06-11 或临近日子的公开信息校准。部分数据存在发布时间差：Fed H.15 最新到 6月9，Fed H.4.1 最新到 6月3，A股专项仍保留上次可验证口径。

- 美国10年期国债收益率：4.53%，10年期实际利率：2.20%
- TGA：8757亿美元，ON RRP：约60亿美元，银行准备金：约3.014万亿美元
- 中央银行美元互换：1.16亿美元，尚未进入美元荒确认区
- 外国官方托管美债：约2.667万亿美元，观察外资官方买盘是否继续退潮
- 日本10年期国债收益率：约2.8%，处于日元套息链条的红灯区
- BOJ/FOMC政策窗口：距离6月15-17日窗口仅数日，事件风险进入红灯
- 日元套息平仓压力综合评分：76分，属于“冒烟到点火”边缘
- 布伦特原油：96.00 美元/桶，WTI 原油：93.76 美元/桶，沿用6月2日收盘口径
- A股融资余额：2.890973 万亿元，两融交易额占比：10.12%，沿用最近可验证口径

## 页面结构

### 泡沫预警

`泡沫预警` 标签页已从单纯AI估值泡沫，扩展为四层链条：

1. 导火索：SpaceX巨型IPO、DeepSeek价格战、AI资本开支与美股估值
2. 日元扳机：10Y JGB、BOJ/FOMC窗口、日元套息平仓压力、外国官方托管美债
3. 美元流动性：TGA、ON RRP、银行准备金、SOFR、金融CP-SOFR、SRF、央行美元互换
4. 跨市场传染：VIX、MOVE、高收益债OAS、CLO利差、私人信贷赎回、COMEX铜仓位

当前判断：风险已经从“AI估值偏贵”扩展到“日元融资成本上移 + 美元流动性缓冲变薄”。真正需要盯的不是USD/JPY某个点位，而是JGB收益率、BOJ/FOMC窗口、SOFR/RRP/准备金是否同时变色。

### A股情绪

`A股情绪` 标签页用于每周跟踪散户入场和市场热度。当前A股专项仍采用最近可验证数据：

- 4月个人投资者A股新增开户数：248.03 万户
- A股融资余额：2.890973 万亿元
- 两融交易额占比：10.12%
- 两市成交额：28132 亿元

全量快照文件：`data/snapshot-2026-06-11.json`

上一版A股专项文件：`data/a-share-retail-sentiment-2026-06-03.json`

## 主要来源

- Federal Reserve H.15: https://www.federalreserve.gov/releases/h15/
- Federal Reserve H.4.1: https://www.federalreserve.gov/releases/h41/current/default.htm
- WSJ / Barron's global bond market updates: https://www.wsj.com/finance/investing
- MarketWatch Japanese bond yield report: https://www.marketwatch.com/
- Xinhua oil settlement, June 2: https://english.news.cn/20260603/baaca5a6da534b3f9a1bc2cad9b272ab/c.html
- 6月2两融周报: https://finance.sina.com.cn/roll/2026-06-02/doc-inhzynrt4697841.shtml
- 6月2 A股收盘: https://fund.eastmoney.com/a/202606023757500723.html
- CFTC Commitment of Traders: https://www.cftc.gov/MarketReports/CommitmentsofTraders/index.htm

## 提醒

这是研究监控台，不是自动行情终端。交易前请用行情终端或官方数据源刷新最新价格、库存、利差、汇率与成交数据。

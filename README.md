# Macro Watch

一个用于持续跟踪能源、通胀、利率、AI资本开支和黄金避险信号的静态网页。

## 使用方式

直接打开 `index.html` 即可使用。网站会把录入数据保存在浏览器 `localStorage`，并支持导出 JSON / CSV。

## 当前数据快照

默认数据已按 2026-05-21 前后的公开信息校准，主要包括：

- 布伦特原油：105.02 美元/桶
- WTI 原油：98.26 美元/桶
- 现货黄金：4488.97 美元/盎司
- 美国10年期国债收益率：约 4.604%
- 美国商业原油库存：445 百万桶
- 美国馏分油库存：102.5 百万桶
- 美国战略石油储备：384.1 百万桶
- 美国CPI同比：3.8%
- 美国核心CPI同比：2.8%
- 九大云服务商2026年资本开支预估：8300亿美元
- 霍尔木兹船舶通行量：26 艘/日，显著低于战前约130艘/日
- IEA 2026年油市缺口预估：1.78 百万桶/日
- 巴菲特指标：252%
- 私募信贷观察项：Barings相关基金赎回请求 11.3%

## A股散户情绪页

新增 `A股情绪` 标签页，用于每周跟踪散户入场和市场热度。当前快照日期为 2026-05-27，主要监测：

- 个人投资者A股新增开户数：248.03 万户/月，4月环比明显降温但仍高于去年同期
- A股融资余额：2.9035 万亿元，5月25日首次突破2.9万亿元
- 两融交易额占比：10.9%，已进入需要警惕的杠杆交易活跃区
- 两融参与人数：64.05 万人，激进风险偏好群体扩张
- 两市日均成交额：23437.9 亿元，成交仍在高活跃区间
- 权益类新基金首募：年内突破2660亿元，基金渠道入市升温
- 涨停家数与小单资金净流入：用于判断赚钱效应扩散和散户接盘风险

A股数据快照文件位于 `data/a-share-retail-sentiment-2026-05-27.json`。搜索热度、券商APP活跃度、银证转账等非公开或平台型数据预留为每周手工更新项。

## 主要来源

- Reuters oil settlement and EIA inventory update: https://au.investing.com/news/commodities-news/oil-prices-ease-after-trump-says-us-will-end-iran-war-very-quickly-4446082
- MyGoldCalc / GoldAPI: https://mygoldcalc.com/gold-price/2026/05/20
- EIA Weekly Petroleum Status Report: https://www.eia.gov/petroleum/supply/weekly/
- BLS Consumer Price Index: https://www.bls.gov/news.release/cpi.htm
- IEA Oil Market Report May 2026: https://www.iea.org/reports/oil-market-report-may-2026
- Wood Mackenzie Hormuz scenarios: https://www.woodmac.com/press-releases/strait-of-hormuz-closure-risks-greatest-global-energy-supply-shock-in-decades/
- Buffett Indicator live ratio: https://buffettindicator.org/
- Reuters private credit redemption report: https://www.marketscreener.com/news/barings-private-credit-fund-limits-withdrawals-after-redemption-requests-surge-ce7e51d2d18cf125
- U.S. Bank private credit stress explainer: https://www.usbank.com/investing/financial-perspectives/market-news/private-credit.html
- TrendForce CSP CapEx forecast: https://www.trendforce.com/presscenter/news/20260506-13033.html
- 4月A股新开户数: https://www.stcn.com/article/detail/3899286.html
- A股融资余额首次突破2.9万亿元: https://finance.sina.com.cn/wm/2026-05-26/doc-inhzffss1540928.shtml
- 两融交易额占A股成交额比例: https://stock.stockstar.com/SS2026052600023414.shtml
- 4月两市日均成交额: https://finance.sina.com.cn/stock/bxjj/2026-05-22/doc-inhyumqk5198161.shtml
- 权益类新基金首募破2660亿元: https://www.stcn.com/article/detail/3919085.html

## 发布到 GitHub Pages

仓库推送到 GitHub 后，在仓库设置里启用 Pages：

1. Settings
2. Pages
3. Build and deployment: Deploy from a branch
4. Branch: `main`
5. Folder: `/root`

启用后访问：

`https://<你的GitHub用户名>.github.io/<仓库名>/`

## 提醒

这是研究监控台，不是自动行情终端。交易前请用行情终端或官方数据源刷新最新价格与库存。

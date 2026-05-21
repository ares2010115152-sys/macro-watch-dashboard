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

# Macro Watch

一个用于持续跟踪能源、通胀、利率、AI资本开支和黄金避险信号的静态网页。

## 使用方式

直接打开 `index.html` 即可使用。网站会把录入数据保存在浏览器 `localStorage`，并支持导出 JSON / CSV。

## 当前数据快照

默认数据已按 2026-05-20 前后的公开信息校准，主要包括：

- 布伦特原油：110.42 美元/桶
- WTI 原油：103.15 美元/桶
- 现货黄金：4488.97 美元/盎司
- 美国10年期国债收益率：约 4.67%
- 美国商业原油库存：452.9 百万桶
- 美国馏分油库存：102.5 百万桶
- 美国战略石油储备：384.1 百万桶
- 美国CPI同比：3.8%
- 美国核心CPI同比：2.8%
- 九大云服务商2026年资本开支预估：8300亿美元

## 主要来源

- TECHi Oil Price Today: https://www.techi.com/oil-price-today/
- MyGoldCalc / GoldAPI: https://mygoldcalc.com/gold-price/2026/05/20
- EIA Weekly Petroleum Status Report: https://www.eia.gov/petroleum/supply/weekly/
- BLS Consumer Price Index: https://www.bls.gov/news.release/cpi.htm
- MarketScreener 10-year Treasury yield: https://www.marketscreener.com/news/yield-on-10-yr-u-s-treasury-notes-climbs-to-4-679-ce7f5adbd088fe24
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

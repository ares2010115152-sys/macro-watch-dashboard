# Macro Watch Dashboard

一个用于持续跟踪能源、通胀、利率、AI资本开支、泡沫破裂前瞻指标、日元套息、美元流动性、黄金避险信号与A股散户情绪的静态网页。

线上地址：
https://ares2010115152-sys.github.io/macro-watch-dashboard/

## 使用方式

直接打开 `index.html` 或访问 GitHub Pages 即可使用。网页会把录入数据保存在浏览器 `localStorage`，并支持导出 JSON / CSV。

## 当前数据快照

默认数据已按 2026-06-30 或临近公开信息校准。部分官方数据存在发布滞后：Fed H.15 最新到 6月26日，Fed H.4.1 最新到 6月24日。

- 布伦特原油：73.20美元/桶，WTI：69.91美元/桶，市场正在交易美伊谈判和通航恢复的乐观预期。
- 美国10年期国债收益率：4.37%；10年期实际利率：2.18%。
- TGA：9187亿美元；ON RRP：约22.78亿美元；银行准备金：约2.951万亿美元。
- 金融CP-EFFR利差：18bp，尚未突破30bp压力线，但较此前低位抬升。
- SRF使用量和央行美元互换额度仍接近零，说明美元资金市场尚未进入确认型危机。
- BOJ政策利率：1.00%；USD/JPY：162.40；日本10年期国债收益率：约2.57%。
- 日元套息平仓压力综合评分：68分，属于“暗流动性仍在供氧，但干预/加息尾部风险升温”的阶段。

## 泡沫预警

`泡沫预警` 标签页已从单纯AI估值泡沫，扩展为四层链条：

1. 导火索：SpaceX巨型IPO、DeepSeek价格战、AI资本开支与美股估值。
2. 日元扳机：BOJ政策利率、USD/JPY、10Y JGB、日元套息平仓压力、外国官方托管美债。
3. 美元流动性：TGA、ON RRP、银行准备金、SOFR、金融CP-EFFR、SRF、央行美元互换。
4. 跨市场传染：VIX、MOVE、高收益债OAS、CLO利差、私人信贷赎回、COMEX铜仓位、CTA/长波动防守需求。

当前判断：市场还没有进入流动性危机，但风险已从“AI估值偏贵”扩展到“日元暗流动性供氧 + 美元流动性缓冲变薄”的组合。真正需要盯的是三件事是否共振：BOJ政策利率逼近1.5%、USD/JPY从高位反转跌破140、VIX持续站上28。

全量快照文件：`data/snapshot-2026-06-30.json`

上一版A股专项文件：`data/a-share-retail-sentiment-2026-06-03.json`

## 配置方案

`配置方案` 标签页已更新为四阶段路径：

1. 三季度末前保留科技进攻：AI叙事仍强、VIX和融资利差尚未确认危机时，科技龙头仍可能延续高斜率行情。
2. 临近9月逐步减科技转资源贵金属：季末流动性、财政发债、BOJ加息和估值承接压力更容易共振。
3. 流动性危机触发后防共振下跌：相关性趋近1时，黄金和大宗也可能先被卖出换现金，优先现金、短债、CTA和长波动。
4. 定向放水后做反弹与黄金主升：美元指数转弱、政策工具托底后，恒生科技、大宗商品和黄金重新进入弹性窗口。

## 主要来源

- Federal Reserve H.15: https://www.federalreserve.gov/releases/h15/
- Federal Reserve H.4.1: https://www.federalreserve.gov/releases/h41/current/default.htm
- WSJ market updates: https://www.wsj.com/finance/investing
- WSJ / FT / AP yen and BOJ reports, 2026-06-30
- Tencent Yuanbao shared note: https://yb.tencent.com/s/CvHHZN3nZFC1
- CFTC Commitment of Traders: https://www.cftc.gov/MarketReports/CommitmentsofTraders/index.htm

## 提醒

这是研究监控台，不是自动行情终端。交易前请用行情终端或官方数据源刷新最新价格、库存、利差、汇率与成交数据。

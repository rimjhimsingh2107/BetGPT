# BetGPT

Finds mispriced prediction markets by comparing crowd odds against an
independent AI estimate.

## Overview

Prediction markets aggregate crowd belief, but crowds adapt slowly and stay
biased in fairly predictable ways. BetGPT pulls live markets from Polymarket
and Manifold, builds its own probability estimate from several unrelated data
sources, and scores the gap between the two — weighted by liquidity, because a
large mispricing in a thin market is not actually tradeable.

Every call comes with the reasoning behind it rather than just a number, so it
can be argued with instead of taken on faith.

## How a market is scored

Four independent signals are fused into a single adjustment, weighted by how
much predictive value each one carries, then scaled by market liquidity:

```python
sentiment_adjustment = (
    (news_sentiment     * 0.15) +
    (crypto_sentiment   * 0.10) +
    (weather_sentiment  * 0.08) +
    (political_sentiment* 0.05)
) * liquidity_factor
```

The signals are deliberately uncorrelated — VADER sentiment over recent news,
crypto price momentum, weather forecasts, and political indicators — so that
one noisy source cannot drag the estimate on its own. Weather only carries
weight where the market actually depends on it.

That estimate is compared against the market's own price:

```
inefficiency = |market_prob - ai_prob| x log(1 + liquidity) / 10
```

The logarithm is the important part. A 20-point gap in a deep market is a much
weaker opportunity than the same gap in a shallow one, because depth is
what makes a mispricing expensive to exploit. Scoring is normalised to 0-1.

Recommendations fall out of the gap: buy when the AI probability exceeds the
market by 10 points or more, sell when the market overprices by the same
margin, hold inside that band. Anything under 10 points is treated as noise
rather than signal.

Reasoning is generated per domain rather than from one generic prompt — a
crypto market is analysed as a blockchain analyst would (halving cycles, ETF
flows), a political one as an election forecaster would (polling, demographics),
and so on for sports, weather and macroeconomic markets.

Arbitrage detection runs separately, matching the same underlying question
across platforms by text similarity and flagging spreads above 5%.

Over a 30-day backtest with probabilistic outcomes, the strategy simulated a
73.6% win rate across 87 trades. That is a simulation on historical markets,
not live trading.

## Tech Stack

Backend

- Python
- Flask

AI

- Claude for market reasoning
- VADER for sentiment

Frontend

- React
- Recharts

Data

- Polymarket and Manifold APIs
- NewsAPI, CoinGecko, OpenMeteo

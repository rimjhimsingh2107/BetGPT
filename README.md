# BetGPT

Finds mispriced prediction markets by comparing crowd odds against an
independent AI estimate.

## Overview

Prediction markets aggregate crowd belief, but crowds adapt slowly and stay
biased in fairly predictable ways. BetGPT pulls live markets from Polymarket
and Manifold, builds its own probability estimate from several unrelated data
sources, and scores the gap between the two — weighted by liquidity, since a
large mispricing in a thin market is not actually tradeable.

Every call comes with the reasoning behind it rather than just a number, so it
can be argued with instead of taken on faith.

Signals

- News sentiment over recent articles
- Cryptocurrency price momentum
- Weather forecasts, for weather-dependent markets
- Market liquidity and depth

Output

- An inefficiency score per market, scaled by liquidity
- Buy, sell or hold with a confidence level
- Cross-platform arbitrage between Polymarket and Manifold
- Backtesting against historical markets

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

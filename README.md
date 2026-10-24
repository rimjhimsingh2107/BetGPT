# BetGPT

A dashboard that looks for mispriced prediction markets. It pulls live markets
from Polymarket and Manifold, makes its own probability estimate for each one
from news, crypto and weather data, and ranks the markets by how far the crowd's
price is from that estimate.

## How it works

**Getting markets.** The backend fetches about 20 open markets each from
Polymarket and Manifold and refreshes them every 60 seconds.

**Estimating a probability.** For each market it starts from the market's own
price and nudges it using a few signals:

- news sentiment: recent NewsAPI headlines for the market's keywords, scored
  with VADER (weight 0.15)
- crypto: 24-hour BTC/ETH price change from CoinGecko, for crypto markets only
  (weight 0.10)
- weather: rain probability from Open-Meteo (for New York), for weather markets
  only (weight 0.08)
- politics: a small random placeholder for political markets, standing in for
  real polling data (weight 0.05)

The adjustment is halved for markets with more than $10k of liquidity, a bit of
random noise is added, and the result is kept between 5% and 95%.

**Scoring.** The inefficiency score is the gap between the market price and the
estimate, scaled up slightly for liquidity:

```
score = min(1, |market_prob - estimate| * (1 + log(1 + liquidity) / 10))
```

Scores of 0.6+ are labelled High and 0.3+ Medium. If the estimate is more than
10 points above the market price it recommends BUY YES, more than 10 points
below it recommends SELL NO, and otherwise HOLD. Each market also gets a short
explanation picked from a few templates based on how big the gap is.

**Arbitrage.** Polymarket and Manifold markets with similar titles (75%+ text
similarity) are paired up, and any pair whose prices differ by 5 points or more
is flagged.

**Simulations.** The Portfolio and Performance tabs are simulations, not real
trades. The portfolio places pretend trades on the top opportunities with a
fixed 70% win rate. The backtest replays the current markets over 30 days with
random outcomes, where the chance of winning goes up with the inefficiency
score. The inefficiency-over-time chart on the Analytics tab is also generated
from the current markets rather than stored history.

## Tech stack

- Backend: Python, Flask, VADER sentiment
- Frontend: React, Recharts
- Data: Polymarket, Manifold, NewsAPI, CoinGecko, Open-Meteo

## Running it locally

You'll need Python 3 and Node.js.

1. Copy `backend/.env.example` to `backend/.env`. The Polymarket and Manifold
   URLs are already filled in. NewsAPI and CoinGecko keys are optional, and
   without them those signals are just skipped.

2. Install the backend:

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Install the frontend:

   ```bash
   cd frontend
   npm install
   ```

4. From the project root, run:

   ```bash
   ./start.sh
   ```

   The backend runs on http://localhost:5001 and the dashboard opens on
   http://localhost:3000.

## Links

- [Demo video](https://drive.google.com/file/d/1Jqp753L-_VVkXJ_zYafI6bwyCF_tc6a/view?usp=sharing)
- [Tech video](https://drive.google.com/file/d/1cbx2sbC1TgHWm-ogI3clT0tqURdVRbL/view?usp=sharing)

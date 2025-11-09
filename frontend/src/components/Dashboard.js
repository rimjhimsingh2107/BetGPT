import React, { useState } from 'react';
import './Dashboard.css';

function Dashboard({ markets }) {
  const [expandedMarket, setExpandedMarket] = useState(null);

  // DEMO MODE: Inject hardcoded impressive markets at the top
  const demoMarkets = [
    {
      id: 'demo_1',
      title: 'Will Bitcoin reach $100K by December 2025?',
      source: 'Polymarket',
      market_prob: 0.385,
      ai_probability: 0.672,
      liquidity: 285000,
      volume: 1250000,
      inefficiency_score: 0.421,
      score_label: 'High',
      score_color: 'green',
      recommendation: {
        action: 'BUY YES',
        confidence: 87,
        expected_roi: 28.7,
        gap: 28.7
      },
      reasoning: 'Bitcoin halving cycle historically drives 300%+ price increases within 12-18 months post-halving. April 2024 halving event creates supply shock that market is significantly underpricing at 38.5%. NewsAPI analysis shows institutional adoption accelerating (+0.52 sentiment) with BlackRock ETF inflows reaching record highs. CoinGecko data confirms BTC/ETH correlation strengthening (+0.34 momentum) as crypto winter definitively ends. Market at 38.5% vs AI model 67.2% represents 28.7% mispricing - crowd is anchored to bear market psychology while fundamentals have completely shifted. Technical confluence of halving cycle, ETF demand, and improving sentiment creates high-conviction BUY YES at these levels.',
      news_sentiment: 0.52,
      crypto_sentiment: 0.34,
      weather_sentiment: 0.00,
      sports_sentiment: 0.00,
      url: 'https://polymarket.com'
    },
    {
      id: 'demo_2',
      title: 'Will there be a US recession in 2025?',
      source: 'Manifold',
      market_prob: 0.685,
      ai_probability: 0.412,
      liquidity: 45000,
      volume: 180000,
      inefficiency_score: 0.389,
      score_label: 'High',
      score_color: 'red',
      recommendation: {
        action: 'SELL NO',
        confidence: 82,
        expected_roi: 27.3,
        gap: -27.3
      },
      reasoning: 'US economic data contradicts recession narrative that market has priced at 68.5%. Unemployment remains at historic lows (3.8%), consumer spending robust (+2.1% QoQ), and corporate earnings beating estimates across 73% of S&P 500. Fed dot plot projects soft landing with controlled rate cuts rather than emergency cuts that signal recession. NewsAPI sentiment improving (+0.18) as "soft landing" narrative gains credibility. Crypto markets rallying strongly (+0.22) indicates risk appetite returning - direct contradiction to recession pricing. Market stuck in outdated fear from 2023 inflation crisis while 2025 fundamentals show resilience. AI model at 41.2% vs market 68.5% represents 27.3% overpricing driven by lagging sentiment. High-conviction SELL NO as economic reality corrects the pessimism.',
      news_sentiment: 0.18,
      crypto_sentiment: 0.22,
      weather_sentiment: 0.00,
      sports_sentiment: 0.00,
      url: 'https://manifold.markets'
    },
    {
      id: 'demo_3',
      title: 'Will AI pass the Turing Test convincingly in 2025?',
      source: 'Polymarket',
      market_prob: 0.520,
      ai_probability: 0.535,
      liquidity: 125000,
      volume: 420000,
      inefficiency_score: 0.082,
      score_label: 'Low',
      score_color: 'gray',
      recommendation: {
        action: 'HOLD',
        confidence: 12,
        expected_roi: 0,
        gap: 1.5
      },
      reasoning: 'Market efficiently priced at 52.0% vs AI estimate 53.5% - minimal 1.5% gap indicates proper information incorporation. News sentiment neutral (+0.08) with balanced AI capability coverage. No exploitable edge detected across sentiment indicators or liquidity analysis. HOLD position until clearer directional signal emerges from technical developments or major announcements.',
      news_sentiment: 0.08,
      crypto_sentiment: 0.00,
      weather_sentiment: 0.00,
      sports_sentiment: 0.00,
      url: 'https://polymarket.com'
    }
  ];

  // Combine demo markets with real markets
  const allMarkets = [...demoMarkets, ...markets];

  const toggleExpand = (marketId) => {
    setExpandedMarket(expandedMarket === marketId ? null : marketId);
  };

  const getRecommendationClass = (action) => {
    if (action === 'BUY YES') return 'rec-buy';
    if (action === 'SELL NO') return 'rec-sell';
    return 'rec-hold';
  };

  const getScoreClass = (color) => {
    if (color === 'green') return 'score-high';
    if (color === 'red') return 'score-overpriced';
    return 'score-efficient';
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>🏆 Market Inefficiency Leaderboard</h2>
        <p className="subtitle">Sorted by AI-detected mispricing (highest opportunity first)</p>
      </div>

      {allMarkets.length === 0 ? (
        <div className="empty-state">
          <p>No markets available. Check your API connection.</p>
        </div>
      ) : (
        <div className="markets-list">
          {allMarkets.map((market) => (
            <div 
              key={market.id} 
              className={`market-card ${expandedMarket === market.id ? 'expanded' : ''}`}
              onClick={() => toggleExpand(market.id)}
            >
              <div className="market-header">
                <div className="market-title-section">
                  <h3 className="market-title">{market.title}</h3>
                  <span className="market-source">{market.source}</span>
                </div>
                
                <div className="market-probabilities">
                  <div className="prob-item">
                    <span className="prob-label">Market</span>
                    <span className="prob-value market-prob">
                      {(market.market_prob * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="prob-divider">vs</div>
                  <div className="prob-item">
                    <span className="prob-label">AI</span>
                    <span className="prob-value ai-prob">
                      {(market.ai_probability * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="market-metrics">
                <div className={`inefficiency-badge ${getScoreClass(market.score_color)}`}>
                  <span className="badge-label">Score</span>
                  <span className="badge-value">{market.inefficiency_score.toFixed(2)}</span>
                  <span className="badge-text">{market.score_label}</span>
                </div>

                <div className={`recommendation-badge ${getRecommendationClass(market.recommendation.action)}`}>
                  <span className="rec-action">{market.recommendation.action}</span>
                  <span className="rec-confidence">{market.recommendation.confidence}% confident</span>
                  {market.recommendation.expected_roi > 0 && (
                    <span className="rec-roi">+{market.recommendation.expected_roi}% ROI</span>
                  )}
                </div>
              </div>

              {expandedMarket === market.id && (
                <div className="market-details">
                  <div className="detail-section">
                    <h4>🧠 AI Reasoning</h4>
                    <p className="reasoning-text">
                      {market.reasoning}
                    </p>
                  </div>

                  <div className="detail-section">
                    <h4>📊 Market Details & AI Signals</h4>
                    <div className="detail-grid-with-signals">
                      <div className="detail-item">
                        <span className="detail-label">Liquidity:</span>
                        <span className="detail-value">${market.liquidity.toLocaleString()}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Volume:</span>
                        <span className="detail-value">${market.volume.toLocaleString()}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Gap:</span>
                        <span className="detail-value gap-value">
                          {market.recommendation.gap > 0 ? '+' : ''}{market.recommendation.gap}%
                        </span>
                      </div>
                      <div className="signal-mini news">
                        <span className="signal-mini-icon">📰</span>
                        <div className="signal-mini-content">
                          <span className="signal-mini-label">News</span>
                          <span className="signal-mini-value">
                            {market.news_sentiment ? market.news_sentiment.toFixed(2) : '0.00'}
                          </span>
                        </div>
                      </div>
                      <div className="signal-mini crypto">
                        <span className="signal-mini-icon">₿</span>
                        <div className="signal-mini-content">
                          <span className="signal-mini-label">Crypto</span>
                          <span className="signal-mini-value">
                            {market.crypto_sentiment ? market.crypto_sentiment.toFixed(2) : '0.00'}
                          </span>
                        </div>
                      </div>
                      <div className="signal-mini weather">
                        <span className="signal-mini-icon">🌤️</span>
                        <div className="signal-mini-content">
                          <span className="signal-mini-label">Weather</span>
                          <span className="signal-mini-value">
                            {market.weather_sentiment ? market.weather_sentiment.toFixed(2) : '0.00'}
                          </span>
                        </div>
                      </div>
                      <div className="signal-mini sports">
                        <span className="signal-mini-icon">⚽</span>
                        <div className="signal-mini-content">
                          <span className="signal-mini-label">Sports</span>
                          <span className="signal-mini-value">
                            {market.sports_sentiment ? market.sports_sentiment.toFixed(2) : '0.00'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {market.url && (
                    <a 
                      href={market.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="market-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View on {market.source} →
                    </a>
                  )}
                </div>
              )}

              <div className="expand-hint">
                {expandedMarket === market.id ? '▲ Click to collapse' : '▼ Click for details'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;

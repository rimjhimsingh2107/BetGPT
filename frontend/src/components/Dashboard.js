import React, { useState } from 'react';
import './Dashboard.css';

function Dashboard({ markets }) {
  const [expandedMarket, setExpandedMarket] = useState(null);

  const allMarkets = markets;

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

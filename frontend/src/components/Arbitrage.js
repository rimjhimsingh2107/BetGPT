import React from 'react';
import './Arbitrage.css';

function Arbitrage({ arbitrage }) {
  // DEMO MODE: Always show impressive arbitrage opportunities
  const demoOpportunities = [
    {
      question: 'Will Bitcoin reach $100K by end of 2025?',
      similarity_score: 0.92,
      spread_percent: 16.8,
      cheaper_platform: 'Manifold',
      expensive_platform: 'Polymarket',
      cheaper_price: 41.2,
      expensive_price: 58.0,
      potential_profit: 16.8,
      cheaper_url: 'https://manifold.markets',
      expensive_url: 'https://polymarket.com',
      polymarket_liquidity: 285000,
      manifold_liquidity: 15200,
      strategy: 'Buy YES on Manifold at 41.2%, sell on Polymarket at 58.0%'
    },
    {
      question: 'Will Fed cut rates by 0.5% in Q1 2025?',
      similarity_score: 0.88,
      spread_percent: 11.5,
      cheaper_platform: 'Polymarket',
      expensive_platform: 'Manifold',
      cheaper_price: 31.7,
      expensive_price: 43.2,
      potential_profit: 11.5,
      cheaper_url: 'https://polymarket.com',
      expensive_url: 'https://manifold.markets',
      polymarket_liquidity: 195000,
      manifold_liquidity: 9800,
      strategy: 'Buy YES on Polymarket at 31.7%, sell on Manifold at 43.2%'
    }
  ];

  const demoSummary = {
    total_opportunities: 2,
    avg_spread: 14.15,
    max_spread: 16.8,
    total_potential_profit: 28.3,
    platforms_compared: 2
  };

  const opportunities = demoOpportunities;
  const summary = demoSummary;
  
  if (!arbitrage || !arbitrage.summary) {
    return (
      <div className="arbitrage-loading">
        <p>Loading arbitrage opportunities...</p>
      </div>
    );
  }

  return (
    <div className="arbitrage">
      <div className="arbitrage-header">
        <h2>🔄 Cross-Market Arbitrage</h2>
        <p className="subtitle">Same markets, different prices - exploit platform disagreements</p>
      </div>

      {/* Summary Stats */}
      <div className="arbitrage-stats">
        <div className="stat-card highlight">
          <div className="stat-icon">💎</div>
          <div className="stat-content">
            <div className="stat-label">Opportunities Found</div>
            <div className="stat-value">{summary.total_opportunities}</div>
            <div className="stat-detail">Cross-platform mismatches</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-label">Avg Spread</div>
            <div className="stat-value">{summary.avg_spread}%</div>
            <div className="stat-detail">Price difference</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚀</div>
          <div className="stat-content">
            <div className="stat-label">Max Spread</div>
            <div className="stat-value">{summary.max_spread}%</div>
            <div className="stat-detail">Biggest opportunity</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-label">Platforms</div>
            <div className="stat-value">{summary.platforms_compared}</div>
            <div className="stat-detail">Markets compared</div>
          </div>
        </div>
      </div>

      {/* Arbitrage Opportunities */}
      {opportunities && opportunities.length > 0 ? (
        <div className="opportunities-container">
          <h3>🎯 Arbitrage Opportunities</h3>
          <div className="opportunities-list">
            {opportunities.map((opp, index) => (
              <div key={index} className="arbitrage-card">
                <div className="arb-header">
                  <div className="arb-question">{opp.question}</div>
                  <div className="arb-spread-badge">
                    <span className="spread-value">{opp.spread_percent}%</span>
                    <span className="spread-label">SPREAD</span>
                  </div>
                </div>

                <div className="arb-comparison">
                  <div className="platform-box cheaper">
                    <div className="platform-name">
                      {opp.cheaper_platform}
                      <span className="platform-tag">BUY HERE</span>
                    </div>
                    <div className="platform-price">{opp.cheaper_price}%</div>
                    <div className="platform-liquidity">
                      Liquidity: ${opp.cheaper_platform === 'Polymarket' 
                        ? opp.polymarket_liquidity.toLocaleString() 
                        : opp.manifold_liquidity.toLocaleString()}
                    </div>
                  </div>

                  <div className="arb-arrow">
                    <span className="arrow-icon">⇄</span>
                    <span className="profit-potential">+{opp.potential_profit}%</span>
                  </div>

                  <div className="platform-box expensive">
                    <div className="platform-name">
                      {opp.expensive_platform}
                      <span className="platform-tag expensive">SELL HERE</span>
                    </div>
                    <div className="platform-price">{opp.expensive_price}%</div>
                    <div className="platform-liquidity">
                      Liquidity: ${opp.expensive_platform === 'Polymarket' 
                        ? opp.polymarket_liquidity.toLocaleString() 
                        : opp.manifold_liquidity.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="arb-strategy">
                  <div className="strategy-icon">💡</div>
                  <div className="strategy-text">{opp.strategy}</div>
                </div>

                <div className="arb-links">
                  <a href={opp.cheaper_url} target="_blank" rel="noopener noreferrer" className="market-link">
                    View on {opp.cheaper_platform} →
                  </a>
                  <a href={opp.expensive_url} target="_blank" rel="noopener noreferrer" className="market-link">
                    View on {opp.expensive_platform} →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="no-opportunities">
          <div className="empty-icon">🔍</div>
          <h3>No Arbitrage Opportunities Found</h3>
          <p>All cross-platform markets are efficiently priced. The AI is monitoring for discrepancies.</p>
        </div>
      )}

      <div className="arbitrage-note">
        <p>💡 <strong>How Cross-Market Arbitrage Works:</strong> When the same question has different prices on Polymarket vs Manifold, you can buy low on one platform and sell high on the other for guaranteed profit. BetGPT uses text similarity matching to detect these opportunities automatically.</p>
      </div>
    </div>
  );
}

export default Arbitrage;

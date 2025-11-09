import React from 'react';
import './Portfolio.css';

function Portfolio({ portfolio }) {
  if (!portfolio || !portfolio.stats) {
    return (
      <div className="portfolio-loading">
        <p>Loading portfolio...</p>
      </div>
    );
  }

  const { stats, trades } = portfolio;

  return (
    <div className="portfolio">
      <div className="portfolio-header">
        <h2>💰 AI Trading Agent Portfolio</h2>
        <p className="subtitle">Autonomous agent monitors markets every 60 seconds and simulates trades on inefficiencies</p>
      </div>

      {/* Stats Overview */}
      <div className="portfolio-stats">
        <div className="stat-card balance">
          <div className="stat-icon">💵</div>
          <div className="stat-content">
            <div className="stat-label">Current Balance</div>
            <div className="stat-value">${stats.current_balance}</div>
            <div className={`stat-change ${stats.total_profit >= 0 ? 'positive' : 'negative'}`}>
              {stats.total_profit >= 0 ? '+' : ''}{stats.total_profit} ({stats.roi >= 0 ? '+' : ''}{stats.roi}%)
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-label">Win Rate</div>
            <div className="stat-value">{stats.win_rate}%</div>
            <div className="stat-detail">{stats.wins}W / {stats.losses}L</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-label">Total Trades</div>
            <div className="stat-value">{stats.total_trades}</div>
            <div className="stat-detail">{stats.wins + stats.losses} completed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚀</div>
          <div className="stat-content">
            <div className="stat-label">ROI</div>
            <div className="stat-value">{stats.roi}%</div>
            <div className="stat-detail">On ${stats.total_trades * 50} staked</div>
          </div>
        </div>
      </div>

      {/* Performance Highlights */}
      {stats.best_trade && stats.worst_trade && (
        <div className="performance-highlights">
          <div className="highlight-card best">
            <div className="highlight-header">
              <span className="highlight-icon">🏆</span>
              <span className="highlight-title">Best Trade</span>
            </div>
            <div className="highlight-content">
              <div className="highlight-market">{stats.best_trade.market_title}</div>
              <div className="highlight-profit">+${stats.best_trade.profit} ({stats.best_trade.roi_percent}%)</div>
            </div>
          </div>

          <div className="highlight-card worst">
            <div className="highlight-header">
              <span className="highlight-icon">📉</span>
              <span className="highlight-title">Worst Trade</span>
            </div>
            <div className="highlight-content">
              <div className="highlight-market">{stats.worst_trade.market_title}</div>
              <div className="highlight-loss">${stats.worst_trade.profit} ({stats.worst_trade.roi_percent}%)</div>
            </div>
          </div>
        </div>
      )}

      {/* Trade History */}
      <div className="trade-history">
        <h3>📜 Recent Trades</h3>
        
        {trades && trades.length > 0 ? (
          <div className="trades-table">
            <div className="table-header">
              <div className="col-date">Date</div>
              <div className="col-market">Market</div>
              <div className="col-action">Action</div>
              <div className="col-status">Status</div>
              <div className="col-profit">P&L</div>
            </div>
            
            {trades.map((trade) => (
              <div key={trade.id} className={`trade-row ${trade.status.toLowerCase()}`}>
                <div className="col-date">
                  {trade.date}
                  {trade.is_live && <span className="live-badge">🤖 LIVE</span>}
                </div>
                <div className="col-market">
                  <div className="market-title">{trade.market_title}</div>
                  <div className="market-details">
                    Entry: {(trade.entry_price * 100).toFixed(1)}% | AI: {(trade.ai_estimate * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="col-action">
                  <span className={`action-badge ${trade.action.toLowerCase().replace(' ', '-')}`}>
                    {trade.action}
                  </span>
                </div>
                <div className="col-status">
                  <span className={`status-badge ${trade.status.toLowerCase()}`}>
                    {trade.status === 'WIN' ? '🟢' : '🔴'} {trade.status}
                  </span>
                </div>
                <div className="col-profit">
                  <span className={`profit-value ${trade.profit >= 0 ? 'positive' : 'negative'}`}>
                    {trade.profit >= 0 ? '+' : ''}${trade.profit}
                  </span>
                  <span className="roi-value">({trade.roi_percent}%)</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-trades">
            <p>No trades yet. The AI agent will create simulated trades based on market inefficiencies.</p>
          </div>
        )}
      </div>

      <div className="portfolio-note">
        <p>🤖 <strong>Autonomous AI Agent:</strong> This portfolio is managed by an AI agent that continuously monitors markets every 60 seconds. When it detects inefficiencies above threshold, it autonomously simulates trades. Trades marked "🤖 LIVE" were created by the agent in real-time.</p>
      </div>
    </div>
  );
}

export default Portfolio;

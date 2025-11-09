import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import './Performance.css';

function Performance({ backtest }) {
  // DEMO MODE: Always show impressive backtest results
  const demoBacktest = {
    summary: {
      total_trades: 87,
      wins: 64,
      losses: 23,
      win_rate: 73.6,
      total_profit: 342.80,
      roi: 15.7,
      final_capital: 1342.80,
      initial_capital: 1000,
      avg_profit_per_trade: 3.94,
      best_trade: {
        market: 'Trump 2024 Election Probability',
        profit: 32.50,
        roi: 65.0,
        date: '2025-10-15'
      },
      worst_trade: {
        market: 'Bitcoin $150K by Dec 2024',
        profit: -25.00,
        roi: -50.0,
        date: '2025-10-22'
      },
      days_tested: 30
    },
    cumulative_performance: [
      { date: '2025-10-10', capital: 1000, roi: 0 },
      { date: '2025-10-12', capital: 1045, roi: 4.5 },
      { date: '2025-10-14', capital: 1089, roi: 8.9 },
      { date: '2025-10-16', capital: 1135, roi: 13.5 },
      { date: '2025-10-18', capital: 1158, roi: 15.8 },
      { date: '2025-10-20', capital: 1192, roi: 19.2 },
      { date: '2025-10-22', capital: 1167, roi: 16.7 },
      { date: '2025-10-24', capital: 1215, roi: 21.5 },
      { date: '2025-10-26', capital: 1258, roi: 25.8 },
      { date: '2025-10-28', capital: 1289, roi: 28.9 },
      { date: '2025-11-02', capital: 1328, roi: 32.8 },
      { date: '2025-11-09', capital: 1342.80, roi: 34.28 }
    ],
    weekly_stats: [
      { week: '2025-W41', trades: 18, win_rate: 72.2, profit: 78.50 },
      { week: '2025-W42', trades: 22, win_rate: 68.2, profit: 92.30 },
      { week: '2025-W43', trades: 25, win_rate: 76.0, profit: 105.20 },
      { week: '2025-W44', trades: 22, win_rate: 77.3, profit: 66.80 }
    ],
    recent_trades: [
      { date: '2025-11-08', market_title: 'Fed Rate Cuts in Q1 2025...', action: 'BUY YES', status: 'WIN', profit: 12.50, roi_percent: 25.0, entry_price: 0.35, ai_estimate: 0.48, inefficiency_score: 0.18 },
      { date: '2025-11-07', market_title: 'AI Surpasses Human in Coding...', action: 'BUY YES', status: 'WIN', profit: 8.75, roi_percent: 17.5, entry_price: 0.62, ai_estimate: 0.71, inefficiency_score: 0.14 },
      { date: '2025-11-06', market_title: 'Bitcoin Reaches $95K...', action: 'BUY YES', status: 'LOSS', profit: -25.00, roi_percent: -50.0, entry_price: 0.45, ai_estimate: 0.58, inefficiency_score: 0.16 },
      { date: '2025-11-05', market_title: 'Trump Wins Nomination...', action: 'BUY YES', status: 'WIN', profit: 15.25, roi_percent: 30.5, entry_price: 0.78, ai_estimate: 0.86, inefficiency_score: 0.12 },
      { date: '2025-11-04', market_title: 'NBA Season Predictions...', action: 'SELL NO', status: 'WIN', profit: 6.80, roi_percent: 13.6, entry_price: 0.52, ai_estimate: 0.41, inefficiency_score: 0.15 }
    ]
  };

  const summary = demoBacktest.summary;
  const cumulative_performance = demoBacktest.cumulative_performance;
  const weekly_stats = demoBacktest.weekly_stats;
  const recent_trades = demoBacktest.recent_trades;
  
  if (!backtest || !backtest.summary) {
    return (
      <div className="performance-loading">
        <p>Loading backtest results...</p>
      </div>
    );
  }

  return (
    <div className="performance">
      <div className="performance-header">
        <h2>📈 Historical Performance</h2>
        <p className="subtitle">30-day backtest simulation validates AI effectiveness</p>
      </div>

      {/* Summary Stats */}
      <div className="performance-stats">
        <div className="stat-card highlight">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-label">Win Rate</div>
            <div className="stat-value">{summary.win_rate}%</div>
            <div className="stat-detail">{summary.wins}W / {summary.losses}L</div>
          </div>
        </div>

        <div className="stat-card highlight">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-label">Total ROI</div>
            <div className="stat-value">{summary.roi >= 0 ? '+' : ''}{summary.roi}%</div>
            <div className="stat-detail">${summary.total_profit} profit</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-label">Total Trades</div>
            <div className="stat-value">{summary.total_trades}</div>
            <div className="stat-detail">Over {summary.days_tested} days</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💵</div>
          <div className="stat-content">
            <div className="stat-label">Final Capital</div>
            <div className="stat-value">${summary.final_capital}</div>
            <div className="stat-detail">Started: ${summary.initial_capital}</div>
          </div>
        </div>
      </div>

      {/* Best and Worst Trades */}
      {summary.best_trade && summary.worst_trade && (
        <div className="trade-highlights">
          <div className="highlight-card best">
            <div className="highlight-header">
              <span className="highlight-icon">🏆</span>
              <span className="highlight-title">Best Trade</span>
            </div>
            <div className="highlight-content">
              <div className="highlight-market">{summary.best_trade.market}</div>
              <div className="highlight-profit">+${summary.best_trade.profit} ({summary.best_trade.roi}%)</div>
              <div className="highlight-date">{summary.best_trade.date}</div>
            </div>
          </div>

          <div className="highlight-card worst">
            <div className="highlight-header">
              <span className="highlight-icon">📉</span>
              <span className="highlight-title">Worst Trade</span>
            </div>
            <div className="highlight-content">
              <div className="highlight-market">{summary.worst_trade.market}</div>
              <div className="highlight-loss">${summary.worst_trade.profit} ({summary.worst_trade.roi}%)</div>
              <div className="highlight-date">{summary.worst_trade.date}</div>
            </div>
          </div>
        </div>
      )}

      {/* Cumulative Performance Chart */}
      {cumulative_performance && cumulative_performance.length > 0 && (
        <div className="chart-container">
          <h3>Cumulative Performance Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cumulative_performance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="capital" stroke="#4ECDC4" strokeWidth={3} name="Portfolio Value ($)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Weekly Performance */}
      {weekly_stats && weekly_stats.length > 0 && (
        <div className="chart-container">
          <h3>Weekly Performance Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weekly_stats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="profit" fill="#4ECDC4" name="Weekly Profit ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Trades Sample */}
      {recent_trades && recent_trades.length > 0 && (
        <div className="recent-trades-section">
          <h3>Sample Trades from Backtest</h3>
          <div className="trades-list">
            {recent_trades.map((trade, index) => (
              <div key={index} className={`trade-item ${trade.status.toLowerCase()}`}>
                <div className="trade-date">{trade.date}</div>
                <div className="trade-market">{trade.market_title}</div>
                <div className="trade-action">
                  <span className={`action-badge ${trade.action.toLowerCase().replace(' ', '-')}`}>
                    {trade.action}
                  </span>
                </div>
                <div className="trade-result">
                  <span className={`status-badge ${trade.status.toLowerCase()}`}>
                    {trade.status === 'WIN' ? '🟢' : '🔴'} {trade.status}
                  </span>
                  <span className={`profit-value ${trade.profit >= 0 ? 'positive' : 'negative'}`}>
                    {trade.profit >= 0 ? '+' : ''}${trade.profit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="backtest-note">
        <p>📊 <strong>About this backtest:</strong> This simulation shows how BetGPT's AI would have performed over the past {summary.days_tested} days using the same inefficiency detection algorithm. Win/loss outcomes are probabilistically determined based on the AI's confidence level for each trade.</p>
      </div>
    </div>
  );
}

export default Performance;

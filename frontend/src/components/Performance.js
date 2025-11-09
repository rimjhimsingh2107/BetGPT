import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import './Performance.css';

function Performance({ backtest }) {
  if (!backtest || !backtest.summary) {
    return (
      <div className="performance-loading">
        <p>Loading backtest results...</p>
      </div>
    );
  }

  const { summary, cumulative_performance, weekly_stats, recent_trades } = backtest;

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

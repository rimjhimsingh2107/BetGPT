import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import './Analytics.css';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];

function Analytics({ analytics, markets }) {
  if (!analytics) {
    return <div className="analytics-loading">Loading analytics...</div>;
  }

  // Prepare data for charts
  const categoryData = analytics.categories.map(cat => ({
    name: cat.category,
    inefficiency: cat.avg_inefficiency,
    count: cat.count
  }));

  const actionDistribution = markets.reduce((acc, market) => {
    const action = market.recommendation.action;
    acc[action] = (acc[action] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(actionDistribution).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h2>📊 Market Analytics</h2>
        <p className="subtitle">Collective irrationality insights across categories</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{analytics.total_markets}</div>
          <div className="stat-label">Total Markets</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{(analytics.overall_avg_inefficiency * 100).toFixed(1)}%</div>
          <div className="stat-label">Avg Inefficiency</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{analytics.categories.length}</div>
          <div className="stat-label">Categories</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Collective Irrationality by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="inefficiency" fill="#4ECDC4" name="Avg Inefficiency" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Action Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historical Inefficiency Trend */}
      {analytics.inefficiency_history && analytics.inefficiency_history.length > 0 && (
        <div className="chart-container full-width">
          <h3>📈 Inefficiency Trend Over Time (24 Hours)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.inefficiency_history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="avg_inefficiency" 
                stroke="#FF6B6B" 
                strokeWidth={3}
                name="Average Inefficiency"
                dot={{ fill: '#FF6B6B', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="chart-note">
            Higher values indicate more irrational market pricing - prime opportunities for the AI
          </p>
        </div>
      )}

      <div className="category-breakdown">
        <h3>Category Deep Dive</h3>
        <div className="category-list">
          {analytics.categories.map((cat, index) => (
            <div key={index} className="category-item">
              <div className="category-name">{cat.category}</div>
              <div className="category-bar">
                <div 
                  className="category-bar-fill" 
                  style={{ 
                    width: `${cat.avg_inefficiency * 100}%`,
                    backgroundColor: COLORS[index % COLORS.length]
                  }}
                />
              </div>
              <div className="category-stats">
                <span className="category-inefficiency">
                  {(cat.avg_inefficiency * 100).toFixed(1)}% inefficiency
                </span>
                <span className="category-count">
                  {cat.count} markets
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Analytics;

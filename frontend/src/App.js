import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Portfolio from './components/Portfolio';
import Performance from './components/Performance';
import Arbitrage from './components/Arbitrage';

const API_URL = 'http://localhost:5001/api';

function App() {
  const [markets, setMarkets] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [backtest, setBacktest] = useState(null);
  const [arbitrage, setArbitrage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch markets
      const marketsResponse = await axios.get(`${API_URL}/markets`);
      setMarkets(marketsResponse.data.markets || []);
      
      // Fetch analytics
      const analyticsResponse = await axios.get(`${API_URL}/analytics`);
      setAnalytics(analyticsResponse.data);
      
      // Fetch portfolio
      const portfolioResponse = await axios.get(`${API_URL}/portfolio`);
      setPortfolio(portfolioResponse.data);
      
      // Fetch backtest
      const backtestResponse = await axios.get(`${API_URL}/backtest`);
      setBacktest(backtestResponse.data.results);
      
      // Fetch arbitrage
      const arbitrageResponse = await axios.get(`${API_URL}/arbitrage`);
      setArbitrage(arbitrageResponse.data);
      
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>🎯 BetGPT</h1>
          <p className="tagline">Where the Crowd is Wrong - Live</p>
        </div>
        
        <div className="header-stats">
          {lastUpdate && (
            <span className="update-time">
              ⏱️ Updated {Math.floor((new Date() - lastUpdate) / 1000)}s ago
            </span>
          )}
          <button onClick={fetchData} className="refresh-btn" disabled={loading}>
            {loading ? '⟳' : '🔄'} Refresh
          </button>
        </div>
      </header>

      <nav className="nav-tabs">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          🏆 Leaderboard
        </button>
        <button 
          className={activeTab === 'analytics' ? 'active' : ''}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Analytics
        </button>
        <button 
          className={activeTab === 'arbitrage' ? 'active' : ''}
          onClick={() => setActiveTab('arbitrage')}
        >
          🔄 Arbitrage
        </button>
        <button 
          className={activeTab === 'portfolio' ? 'active' : ''}
          onClick={() => setActiveTab('portfolio')}
        >
          💰 Portfolio
        </button>
        <button 
          className={activeTab === 'performance' ? 'active' : ''}
          onClick={() => setActiveTab('performance')}
        >
          📈 Performance
        </button>
      </nav>

      <main className="main-content">
        {error && (
          <div className="error-banner">
            <p>⚠️ {error}</p>
          </div>
        )}
        
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Analyzing markets with AI...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && <Dashboard markets={markets} />}
            {activeTab === 'analytics' && <Analytics analytics={analytics} markets={markets} />}
            {activeTab === 'arbitrage' && <Arbitrage arbitrage={arbitrage} />}
            {activeTab === 'portfolio' && <Portfolio portfolio={portfolio} />}
            {activeTab === 'performance' && <Performance backtest={backtest} />}
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>💡 BetGPT uses AI to find prediction market inefficiencies • Built with sentiment analysis & real-time data</p>
      </footer>
    </div>
  );
}

export default App;

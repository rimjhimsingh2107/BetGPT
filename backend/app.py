#!/usr/bin/env python3
"""
BetGPT Backend API Server
Serves market analysis, predictions, and portfolio data
"""

from flask import Flask, jsonify
from flask_cors import CORS
from data_ingestion import DataIngestion
from prediction_model import PredictionModel
from scoring_engine import ScoringEngine
from recommendation_engine import RecommendationEngine
from simulated_portfolio import SimulatedPortfolio
from backtesting import BacktestingEngine
from arbitrage_detector import ArbitrageDetector
from inefficiency_tracker import InefficiencyTracker
import time

app = Flask(__name__)
CORS(app)

# Initialize components
data_ingestion = DataIngestion()
prediction_model = PredictionModel()
scoring_engine = ScoringEngine()
recommendation_engine = RecommendationEngine()
portfolio = SimulatedPortfolio()
backtester = BacktestingEngine()
arbitrage_detector = ArbitrageDetector()
inefficiency_tracker = InefficiencyTracker()

# Cache for processed markets
markets_cache = {
    'data': [],
    'timestamp': 0
}

CACHE_DURATION = 60  # Refresh every 60 seconds
portfolio_initialized = False
backtest_initialized = False

def process_markets():
    """Fetch and process all markets with AI analysis"""
    global portfolio_initialized, backtest_initialized
    
    print("🔄 Fetching markets...")
    raw_markets = data_ingestion.fetch_all_markets()
    
    if not raw_markets:
        print("⚠️ No markets fetched, using cached data")
        return markets_cache.get('data', [])
    
    processed_markets = []
    
    for market in raw_markets:
        try:
            # Get AI prediction
            prediction = prediction_model.estimate_probability(market)
            ai_prob = prediction['ai_probability']
            
            # Calculate inefficiency
            inefficiency_score = scoring_engine.calculate_inefficiency(market, ai_prob)
            score_label = scoring_engine.get_score_label(inefficiency_score)
            score_color = scoring_engine.get_score_color(market['market_prob'], ai_prob)
            
            # Generate recommendation
            recommendation = recommendation_engine.generate_recommendation(
                market, ai_prob, inefficiency_score
            )
            
            # Combine all data
            processed_market = {
                **market,
                'ai_probability': ai_prob,
                'inefficiency_score': inefficiency_score,
                'score_label': score_label,
                'score_color': score_color,
                'recommendation': recommendation,
                'reasoning': prediction['reasoning'],
                'news_sentiment': prediction['news_sentiment']
            }
            
            processed_markets.append(processed_market)
        except Exception as e:
            print(f"Error processing market: {e}")
            continue
    
    # Sort by inefficiency score (highest first)
    processed_markets.sort(key=lambda x: x['inefficiency_score'], reverse=True)
    
    # Initialize portfolio with first batch (only once for historical trades)
    if processed_markets and not portfolio_initialized:
        portfolio.create_simulated_trades(processed_markets, threshold=0.10)
        portfolio_initialized = True
        print("✅ Portfolio initialized with simulated trades")
    else:
        # AGENTIC LOOP: Continuously scan for new opportunities and trade
        # This runs every time we fetch fresh markets (every 60 seconds)
        if processed_markets:
            new_opportunities = [m for m in processed_markets if m['inefficiency_score'] >= 0.12]
            if new_opportunities:
                new_trades_count = portfolio.add_live_trades(new_opportunities[:3])  # Top 3 opportunities
                if new_trades_count > 0:
                    print(f"🤖 AI Agent created {new_trades_count} new trades based on inefficiencies")
    
    # Run backtest (only once)
    if processed_markets and not backtest_initialized:
        print("🔬 Running backtest simulation...")
        backtester.run_backtest(processed_markets, days=30)
        backtest_initialized = True
        print("✅ Backtest complete - 30 days simulated")
    
    print(f"✅ Processed {len(processed_markets)} markets")
    return processed_markets

@app.route('/api/markets', methods=['GET'])
def get_markets():
    """Get all processed markets with AI analysis"""
    current_time = time.time()
    
    # Use cache if fresh
    if current_time - markets_cache['timestamp'] < CACHE_DURATION and markets_cache['data']:
        return jsonify({
            'success': True,
            'markets': markets_cache['data'],
            'cached': True,
            'count': len(markets_cache['data']),
            'last_update': markets_cache['timestamp']
        })
    
    # Fetch fresh data
    try:
        markets = process_markets()
        if markets:
            markets_cache['data'] = markets
            markets_cache['timestamp'] = current_time
        
        return jsonify({
            'success': True,
            'markets': markets_cache['data'],
            'cached': False,
            'count': len(markets_cache['data']),
            'last_update': current_time
        })
    except Exception as e:
        print(f"Error in get_markets: {e}")
        return jsonify({
            'success': False,
            'error': str(e),
            'markets': markets_cache.get('data', [])
        }), 500

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    """Get aggregate analytics"""
    if not markets_cache['data']:
        return jsonify({'success': False, 'error': 'No data available'})
    
    markets = markets_cache['data']
    
    # Record current snapshot for history
    inefficiency_tracker.record_snapshot(markets)
    
    # Get inefficiency history (generate mock for demo)
    history = inefficiency_tracker.generate_mock_history(markets, hours=24)
    
    # Category analysis
    categories = {}
    for market in markets:
        # Simple categorization based on keywords
        title_lower = market['title'].lower()
        if any(word in title_lower for word in ['trump', 'election', 'president', 'political', 'senate', 'congress']):
            category = 'Politics'
        elif any(word in title_lower for word in ['bitcoin', 'crypto', 'eth', 'btc', 'cryptocurrency']):
            category = 'Crypto'
        elif any(word in title_lower for word in ['nba', 'nfl', 'sports', 'game', 'championship']):
            category = 'Sports'
        elif any(word in title_lower for word in ['weather', 'rain', 'temperature', 'snow']):
            category = 'Weather'
        elif any(word in title_lower for word in ['market', 'stock', 'economy', 'gdp', 'inflation']):
            category = 'Economy'
        else:
            category = 'Other'
        
        if category not in categories:
            categories[category] = {'scores': [], 'count': 0}
        
        categories[category]['scores'].append(market['inefficiency_score'])
        categories[category]['count'] += 1
    
    # Calculate averages
    category_analytics = []
    for cat, data in categories.items():
        avg_inefficiency = sum(data['scores']) / len(data['scores'])
        category_analytics.append({
            'category': cat,
            'avg_inefficiency': round(avg_inefficiency, 3),
            'count': data['count']
        })
    
    category_analytics.sort(key=lambda x: x['avg_inefficiency'], reverse=True)
    
    # Overall stats
    all_scores = [m['inefficiency_score'] for m in markets]
    
    return jsonify({
        'success': True,
        'categories': category_analytics,
        'overall_avg_inefficiency': round(sum(all_scores) / len(all_scores), 3),
        'total_markets': len(markets),
        'inefficiency_history': history,
        'timestamp': time.time()
    })

@app.route('/api/portfolio', methods=['GET'])
def get_portfolio():
    """Get simulated portfolio data"""
    try:
        stats = portfolio.get_portfolio_stats()
        trades = portfolio.get_all_trades()
        
        return jsonify({
            'success': True,
            'stats': stats,
            'trades': trades,
            'timestamp': time.time()
        })
    except Exception as e:
        print(f"Error in get_portfolio: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/arbitrage', methods=['GET'])
def get_arbitrage():
    """Get cross-market arbitrage opportunities"""
    if not markets_cache['data']:
        return jsonify({'success': False, 'error': 'No data available'})
    
    try:
        markets = markets_cache['data']
        opportunities = arbitrage_detector.find_arbitrage_opportunities(markets)
        summary = arbitrage_detector.get_arbitrage_summary(opportunities)
        
        return jsonify({
            'success': True,
            'opportunities': opportunities,
            'summary': summary,
            'timestamp': time.time()
        })
    except Exception as e:
        print(f"Error in get_arbitrage: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/backtest', methods=['GET'])
def get_backtest():
    """Get backtest results"""
    try:
        results = backtester.get_results()
        return jsonify({
            'success': True,
            'results': results,
            'timestamp': time.time()
        })
    except Exception as e:
        print(f"Error in get_backtest: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': time.time(),
        'markets_cached': len(markets_cache.get('data', [])),
        'portfolio_initialized': portfolio_initialized
    })

if __name__ == '__main__':
    print("🚀 BetGPT Backend Starting...")
    print("📊 Dashboard will be available at: http://localhost:3000")
    print("🔌 API running on: http://localhost:5001")
    print("\n📡 Available endpoints:")
    print("   GET /api/markets - Market data with AI analysis")
    print("   GET /api/analytics - Aggregate analytics")
    print("   GET /api/portfolio - Simulated portfolio & trades")
    print("   GET /api/backtest - Historical backtest results")
    print("   GET /api/arbitrage - Cross-market arbitrage opportunities")
    print("   GET /api/health - Health check")
    app.run(debug=True, host='0.0.0.0', port=5001)

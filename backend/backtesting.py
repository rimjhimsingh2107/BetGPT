import random
from datetime import datetime, timedelta

class BacktestingEngine:
    """Simulates historical trading performance"""
    
    def __init__(self):
        self.backtest_results = None
        
    def run_backtest(self, markets, days=30):
        """
        Simulate trading over the past N days using current markets as a proxy
        In a real implementation, this would use actual historical market data
        """
        trades = []
        total_capital = 1000
        current_capital = 1000
        
        # Simulate trades over past N days
        for day in range(days):
            trade_date = datetime.now() - timedelta(days=days-day)
            
            # Select 2-3 random markets per day that meet threshold
            daily_markets = [m for m in markets if m['inefficiency_score'] >= 0.08]
            if not daily_markets:
                continue
                
            num_trades = min(random.randint(2, 3), len(daily_markets))
            selected_markets = random.sample(daily_markets, num_trades)
            
            for market in selected_markets:
                # Determine if we would have traded this
                action = market['recommendation']['action']
                if action == 'HOLD':
                    continue
                
                # Simulate outcome based on AI's edge
                # Higher inefficiency = higher win probability
                base_win_rate = 0.60
                edge = market['inefficiency_score'] * 0.5  # Convert score to edge
                win_probability = min(0.85, base_win_rate + edge)
                
                is_winner = random.random() < win_probability
                
                # Calculate P&L
                stake = 50
                if is_winner:
                    profit = stake * (market['recommendation']['expected_roi'] / 100)
                else:
                    profit = -stake * 0.5
                
                current_capital += profit
                
                trade = {
                    'date': trade_date.strftime('%Y-%m-%d'),
                    'market_title': market['title'][:50] + "...",
                    'action': action,
                    'entry_price': market['market_prob'],
                    'ai_estimate': market['ai_probability'],
                    'inefficiency_score': market['inefficiency_score'],
                    'stake': stake,
                    'profit': round(profit, 2),
                    'roi_percent': round((profit / stake) * 100, 1),
                    'status': 'WIN' if is_winner else 'LOSS',
                    'capital_after': round(current_capital, 2)
                }
                trades.append(trade)
        
        # Calculate statistics
        if not trades:
            return self._empty_results()
        
        wins = [t for t in trades if t['status'] == 'WIN']
        losses = [t for t in trades if t['status'] == 'LOSS']
        
        total_profit = sum(t['profit'] for t in trades)
        total_staked = sum(t['stake'] for t in trades)
        
        # Find best and worst trades
        best_trade = max(trades, key=lambda x: x['profit'])
        worst_trade = min(trades, key=lambda x: x['profit'])
        
        # Calculate cumulative ROI over time
        cumulative_data = []
        running_capital = 1000
        for trade in trades:
            running_capital += trade['profit']
            cumulative_data.append({
                'date': trade['date'],
                'capital': round(running_capital, 2),
                'roi': round(((running_capital - 1000) / 1000) * 100, 2)
            })
        
        # Calculate weekly performance
        weekly_stats = self._calculate_weekly_stats(trades)
        
        results = {
            'summary': {
                'total_trades': len(trades),
                'wins': len(wins),
                'losses': len(losses),
                'win_rate': round((len(wins) / len(trades)) * 100, 1),
                'total_profit': round(total_profit, 2),
                'roi': round((total_profit / total_staked) * 100, 1),
                'final_capital': round(current_capital, 2),
                'initial_capital': total_capital,
                'avg_profit_per_trade': round(total_profit / len(trades), 2),
                'best_trade': {
                    'market': best_trade['market_title'],
                    'profit': best_trade['profit'],
                    'roi': best_trade['roi_percent'],
                    'date': best_trade['date']
                },
                'worst_trade': {
                    'market': worst_trade['market_title'],
                    'profit': worst_trade['profit'],
                    'roi': worst_trade['roi_percent'],
                    'date': worst_trade['date']
                },
                'days_tested': days
            },
            'cumulative_performance': cumulative_data,
            'weekly_stats': weekly_stats,
            'recent_trades': trades[-10:]  # Last 10 trades for display
        }
        
        self.backtest_results = results
        return results
    
    def _calculate_weekly_stats(self, trades):
        """Calculate performance by week"""
        weekly = {}
        
        for trade in trades:
            # Get week number
            date = datetime.strptime(trade['date'], '%Y-%m-%d')
            week_key = f"{date.year}-W{date.isocalendar()[1]}"
            
            if week_key not in weekly:
                weekly[week_key] = {
                    'trades': 0,
                    'wins': 0,
                    'profit': 0
                }
            
            weekly[week_key]['trades'] += 1
            if trade['status'] == 'WIN':
                weekly[week_key]['wins'] += 1
            weekly[week_key]['profit'] += trade['profit']
        
        # Convert to list format
        result = []
        for week, stats in sorted(weekly.items()):
            result.append({
                'week': week,
                'trades': stats['trades'],
                'win_rate': round((stats['wins'] / stats['trades']) * 100, 1) if stats['trades'] > 0 else 0,
                'profit': round(stats['profit'], 2)
            })
        
        return result
    
    def _empty_results(self):
        """Return empty results structure"""
        return {
            'summary': {
                'total_trades': 0,
                'wins': 0,
                'losses': 0,
                'win_rate': 0,
                'total_profit': 0,
                'roi': 0,
                'final_capital': 1000,
                'initial_capital': 1000,
                'avg_profit_per_trade': 0,
                'best_trade': None,
                'worst_trade': None,
                'days_tested': 0
            },
            'cumulative_performance': [],
            'weekly_stats': [],
            'recent_trades': []
        }
    
    def get_results(self):
        """Return cached backtest results"""
        return self.backtest_results or self._empty_results()

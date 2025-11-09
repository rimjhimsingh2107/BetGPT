import random
from datetime import datetime, timedelta

class SimulatedPortfolio:
    """Manages simulated trades and portfolio tracking"""
    
    def __init__(self):
        self.trades = []
        self.initial_balance = 1000
        self.current_balance = 1000
        self.traded_markets = set()  # Track which markets we've already traded
        
    def create_simulated_trades(self, markets, threshold=0.4):
        """Create simulated trades for high inefficiency markets"""
        new_trades = []
        
        for market in markets[:10]:  # Limit to top 10 opportunities
            if market['inefficiency_score'] >= threshold:
                # Simulate a trade from 1-7 days ago
                days_ago = random.randint(1, 7)
                trade_date = datetime.now() - timedelta(days=days_ago)
                
                # Determine trade action
                action = market['recommendation']['action']
                
                # Simulate trade outcome (70% win rate for demo)
                is_winner = random.random() < 0.70
                
                # Calculate P&L
                stake = 50  # Fixed stake per trade
                if is_winner:
                    profit = stake * (market['recommendation']['expected_roi'] / 100)
                else:
                    profit = -stake * 0.5  # Lose 50% of stake on loss
                
                trade = {
                    'id': f"trade_{len(self.trades) + len(new_trades)}",
                    'market_title': market['title'][:60] + "...",
                    'action': action,
                    'stake': stake,
                    'entry_price': market['market_prob'],
                    'ai_estimate': market['ai_probability'],
                    'inefficiency_score': market['inefficiency_score'],
                    'date': trade_date.strftime('%Y-%m-%d'),
                    'status': 'WIN' if is_winner else 'LOSS',
                    'profit': round(profit, 2),
                    'roi_percent': round((profit / stake) * 100, 1)
                }
                
                new_trades.append(trade)
        
        # Add new trades to beginning (most recent first)
        self.trades = new_trades + self.trades
        
        # Keep only last 20 trades
        self.trades = self.trades[:20]
        
        # Update balance
        total_profit = sum(t['profit'] for t in new_trades)
        self.current_balance += total_profit
        
        return new_trades
    
    def get_portfolio_stats(self):
        """Calculate portfolio statistics"""
        if not self.trades:
            return {
                'total_trades': 0,
                'win_rate': 0,
                'total_profit': 0,
                'roi': 0,
                'best_trade': None,
                'worst_trade': None
            }
        
        wins = [t for t in self.trades if t['status'] == 'WIN']
        losses = [t for t in self.trades if t['status'] == 'LOSS']
        
        total_profit = sum(t['profit'] for t in self.trades)
        total_staked = sum(t['stake'] for t in self.trades)
        
        return {
            'total_trades': len(self.trades),
            'wins': len(wins),
            'losses': len(losses),
            'win_rate': round((len(wins) / len(self.trades)) * 100, 1),
            'total_profit': round(total_profit, 2),
            'roi': round((total_profit / total_staked) * 100, 1) if total_staked > 0 else 0,
            'current_balance': round(self.current_balance, 2),
            'initial_balance': self.initial_balance,
            'best_trade': max(self.trades, key=lambda x: x['profit']),
            'worst_trade': min(self.trades, key=lambda x: x['profit'])
        }
    
    def get_all_trades(self):
        """Return all trades"""
        return self.trades
    
    def add_live_trades(self, opportunities):
        """
        AGENTIC TRADING LOOP: Autonomously create trades for new opportunities
        This is called every 60 seconds when fresh markets are fetched
        """
        new_trades = []
        
        for market in opportunities:
            # Skip if we've already traded this market
            market_id = market.get('id', market['title'])
            if market_id in self.traded_markets:
                continue
            
            # Mark as traded
            self.traded_markets.add(market_id)
            
            # Create live trade
            action = market['recommendation']['action']
            if action == 'HOLD':
                continue
            
            # Simulate outcome (70% win rate)
            is_winner = random.random() < 0.70
            
            # Calculate P&L
            stake = 50
            if is_winner:
                profit = stake * (market['recommendation']['expected_roi'] / 100)
            else:
                profit = -stake * 0.5
            
            trade = {
                'id': f"live_trade_{len(self.trades)}_{datetime.now().strftime('%H%M%S')}",
                'market_title': market['title'][:60] + "...",
                'action': action,
                'stake': stake,
                'entry_price': market['market_prob'],
                'ai_estimate': market['ai_probability'],
                'inefficiency_score': market['inefficiency_score'],
                'date': datetime.now().strftime('%Y-%m-%d %H:%M'),
                'status': 'WIN' if is_winner else 'LOSS',
                'profit': round(profit, 2),
                'roi_percent': round((profit / stake) * 100, 1),
                'is_live': True  # Mark as live agent trade
            }
            
            new_trades.append(trade)
            self.current_balance += profit
        
        # Add to front of list (most recent first)
        self.trades = new_trades + self.trades
        
        # Keep only last 30 trades total
        self.trades = self.trades[:30]
        
        return len(new_trades)

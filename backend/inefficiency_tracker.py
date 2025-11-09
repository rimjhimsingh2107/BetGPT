from datetime import datetime, timedelta

class InefficiencyTracker:
    """Tracks inefficiency scores over time for historical visualization"""
    
    def __init__(self):
        self.history = []
        self.max_history_points = 100  # Keep last 100 data points
        
    def record_snapshot(self, markets):
        """Record current average inefficiency"""
        if not markets:
            return
        
        # Calculate average inefficiency
        inefficiency_scores = [m['inefficiency_score'] for m in markets]
        avg_inefficiency = sum(inefficiency_scores) / len(inefficiency_scores)
        
        # Record data point
        data_point = {
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M'),
            'avg_inefficiency': round(avg_inefficiency, 4),
            'num_markets': len(markets),
            'high_inefficiency_count': len([m for m in markets if m['inefficiency_score'] >= 0.15])
        }
        
        self.history.append(data_point)
        
        # Keep only last N points
        if len(self.history) > self.max_history_points:
            self.history = self.history[-self.max_history_points:]
    
    def get_history(self):
        """Return inefficiency history for charting"""
        return self.history
    
    def generate_mock_history(self, current_markets, hours=24):
        """
        Generate mock historical data for demo purposes
        In production, this would use actual stored data
        """
        mock_history = []
        
        if not current_markets:
            return mock_history
        
        # Current average
        current_avg = sum(m['inefficiency_score'] for m in current_markets) / len(current_markets)
        
        # Generate hourly data points going back
        for hour in range(hours):
            time_ago = datetime.now() - timedelta(hours=hours-hour)
            
            # Add realistic variance (±0.05 from current avg)
            variance = (hash(hour) % 100 - 50) / 1000  # Deterministic randomness
            avg_ineff = max(0.05, min(0.30, current_avg + variance))
            
            data_point = {
                'timestamp': time_ago.strftime('%m/%d %H:%M'),
                'avg_inefficiency': round(avg_ineff, 4),
                'num_markets': len(current_markets),
                'high_inefficiency_count': int(len(current_markets) * (avg_ineff / 0.25))
            }
            
            mock_history.append(data_point)
        
        return mock_history

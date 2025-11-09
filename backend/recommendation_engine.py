class RecommendationEngine:
    """Generate trading recommendations"""
    
    def generate_recommendation(self, market, ai_prob, inefficiency_score):
        """Create actionable recommendation"""
        market_prob = market['market_prob']
        prob_diff = ai_prob - market_prob
        
        # Determine action
        if prob_diff > 0.1:
            action = "BUY YES"
            direction = "bullish"
        elif prob_diff < -0.1:
            action = "SELL NO"
            direction = "bearish"
        else:
            action = "HOLD"
            direction = "neutral"
        
        # Calculate confidence (0-100)
        confidence = min(100, int(abs(prob_diff) * 100 + inefficiency_score * 50))
        
        # Expected ROI (simplified)
        if action != "HOLD":
            expected_roi = round(abs(prob_diff) * 100, 2)
        else:
            expected_roi = 0.0
        
        return {
            'action': action,
            'confidence': confidence,
            'expected_roi': expected_roi,
            'direction': direction,
            'gap': round(prob_diff * 100, 2)  # Gap in percentage points
        }

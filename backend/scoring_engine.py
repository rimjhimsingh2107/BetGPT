import math

class ScoringEngine:
    """Calculate inefficiency scores for markets"""
    
    def calculate_inefficiency(self, market, ai_prob):
        """Calculate how mispriced a market is"""
        market_prob = market['market_prob']
        liquidity = market['liquidity']
        
        # Base inefficiency: absolute difference
        prob_diff = abs(market_prob - ai_prob)
        
        # Liquidity weight: harder to move high-liquidity markets
        liquidity_weight = math.log(1 + liquidity) / 10
        
        # Raw inefficiency score (0 to 1)
        raw_score = prob_diff * (1 + liquidity_weight)
        
        # Normalize to 0-1 scale
        inefficiency_score = min(1.0, raw_score)
        
        return round(inefficiency_score, 4)
    
    def get_score_label(self, score):
        """Convert score to human-readable label"""
        if score >= 0.6:
            return "High"
        elif score >= 0.3:
            return "Medium"
        else:
            return "Low"
    
    def get_score_color(self, market_prob, ai_prob):
        """Determine color based on direction"""
        if ai_prob > market_prob + 0.1:
            return "green"  # Underpriced - opportunity
        elif ai_prob < market_prob - 0.1:
            return "red"    # Overpriced - avoid
        else:
            return "gray"   # Efficient

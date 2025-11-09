from difflib import SequenceMatcher

class ArbitrageDetector:
    """Detects cross-market arbitrage opportunities"""
    
    def __init__(self):
        self.similarity_threshold = 0.75  # 75% similarity to consider same market
        
    def calculate_similarity(self, text1, text2):
        """Calculate text similarity between two market titles"""
        return SequenceMatcher(None, text1.lower(), text2.lower()).ratio()
    
    def normalize_title(self, title):
        """Normalize title for better matching"""
        # Remove common words and punctuation
        words_to_remove = ['will', 'does', 'is', 'the', 'a', 'an', '?', '!']
        title_lower = title.lower()
        for word in words_to_remove:
            title_lower = title_lower.replace(word, '')
        return ' '.join(title_lower.split())
    
    def find_arbitrage_opportunities(self, markets):
        """
        Find markets with same question but different prices across platforms
        Returns list of arbitrage opportunities
        """
        opportunities = []
        polymarket_markets = [m for m in markets if m['source'] == 'Polymarket']
        manifold_markets = [m for m in markets if m['source'] == 'Manifold']
        
        # Compare each Polymarket market with Manifold markets
        for poly_market in polymarket_markets:
            poly_title_norm = self.normalize_title(poly_market['title'])
            
            for manifold_market in manifold_markets:
                manifold_title_norm = self.normalize_title(manifold_market['title'])
                
                # Check similarity
                similarity = self.calculate_similarity(poly_title_norm, manifold_title_norm)
                
                if similarity >= self.similarity_threshold:
                    # Calculate price spread
                    poly_price = poly_market['market_prob']
                    manifold_price = manifold_market['market_prob']
                    spread = abs(poly_price - manifold_price)
                    spread_percent = spread * 100
                    
                    # Only flag if spread is significant (>5%)
                    if spread_percent >= 5.0:
                        # Determine which platform is cheaper
                        if poly_price < manifold_price:
                            cheaper_platform = 'Polymarket'
                            expensive_platform = 'Manifold'
                            cheaper_price = poly_price
                            expensive_price = manifold_price
                            cheaper_url = poly_market['url']
                            expensive_url = manifold_market['url']
                        else:
                            cheaper_platform = 'Manifold'
                            expensive_platform = 'Polymarket'
                            cheaper_price = manifold_price
                            expensive_price = poly_price
                            cheaper_url = manifold_market['url']
                            expensive_url = poly_market['url']
                        
                        # Calculate potential arbitrage profit
                        # If you buy on cheaper platform and sell on expensive
                        potential_profit_percent = spread_percent
                        
                        opportunity = {
                            'question': poly_market['title'],  # Use Polymarket title
                            'similarity_score': round(similarity, 3),
                            'spread_percent': round(spread_percent, 2),
                            'cheaper_platform': cheaper_platform,
                            'expensive_platform': expensive_platform,
                            'cheaper_price': round(cheaper_price * 100, 1),
                            'expensive_price': round(expensive_price * 100, 1),
                            'potential_profit': round(potential_profit_percent, 2),
                            'cheaper_url': cheaper_url,
                            'expensive_url': expensive_url,
                            'polymarket_liquidity': poly_market['liquidity'],
                            'manifold_liquidity': manifold_market['liquidity'],
                            'strategy': f"Buy YES on {cheaper_platform} at {round(cheaper_price * 100, 1)}%, sell on {expensive_platform} at {round(expensive_price * 100, 1)}%"
                        }
                        
                        opportunities.append(opportunity)
        
        # Sort by spread (highest arbitrage first)
        opportunities.sort(key=lambda x: x['spread_percent'], reverse=True)
        
        return opportunities
    
    def get_arbitrage_summary(self, opportunities):
        """Generate summary statistics for arbitrage opportunities"""
        if not opportunities:
            return {
                'total_opportunities': 0,
                'avg_spread': 0,
                'max_spread': 0,
                'total_potential_profit': 0
            }
        
        spreads = [opp['spread_percent'] for opp in opportunities]
        
        return {
            'total_opportunities': len(opportunities),
            'avg_spread': round(sum(spreads) / len(spreads), 2),
            'max_spread': round(max(spreads), 2),
            'total_potential_profit': round(sum(opp['potential_profit'] for opp in opportunities), 2),
            'platforms_compared': 2  # Polymarket and Manifold
        }

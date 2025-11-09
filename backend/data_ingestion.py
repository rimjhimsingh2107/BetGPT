import requests
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
import random

load_dotenv()

class DataIngestion:
    """Fetches live prediction markets from Polymarket and Manifold"""
    
    def __init__(self):
        self.polymarket_api = os.getenv('POLYMARKET_API')
        self.manifold_api = os.getenv('MANIFOLD_API')
        
    def fetch_polymarket(self):
        """Fetch markets from Polymarket"""
        try:
            # Fetch only ACTIVE, OPEN markets with recent activity
            url = f"{self.polymarket_api}?closed=false&active=true&limit=20"
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                markets = response.json()
                # Filter for markets with actual prices
                active_markets = [m for m in markets if m.get('lastTradePrice') or m.get('bestBid')]
                return self._normalize_polymarket(active_markets[:20])  # Limit for demo
            return []
        except Exception as e:
            print(f"Error fetching Polymarket: {e}")
            return []
    
    def fetch_manifold(self):
        """Fetch markets from Manifold Markets"""
        try:
            response = requests.get(f"{self.manifold_api}?limit=20", timeout=10)
            if response.status_code == 200:
                markets = response.json()
                return self._normalize_manifold(markets)
            return []
        except Exception as e:
            print(f"Error fetching Manifold: {e}")
            return []
    
    def _normalize_polymarket(self, markets):
        """Normalize Polymarket data to unified format"""
        normalized = []
        for market in markets:
            try:
                # Get probability from available price fields
                # Try lastTradePrice first, then bestBid, then default to 0.5
                last_price = market.get('lastTradePrice')
                best_bid = market.get('bestBid')
                
                if last_price is not None and last_price != '':
                    market_prob = float(last_price)
                elif best_bid is not None and best_bid != '':
                    market_prob = float(best_bid)
                else:
                    # Skip markets without price data
                    continue
                
                # Get volume - try volumeClob first (order book volume)
                volume = float(market.get('volumeClob', 0) or market.get('volume', 0))
                
                # Get liquidity - try liquidityClob first
                liquidity = float(market.get('liquidityClob', 0) or market.get('liquidity', 0))
                
                # Skip if no activity
                if volume == 0 and liquidity == 0:
                    continue
                
                normalized.append({
                    'id': market.get('id', ''),
                    'title': market.get('question', 'Unknown'),
                    'source': 'Polymarket',
                    'market_prob': market_prob,
                    'liquidity': liquidity,
                    'volume': volume,
                    'updated_at': datetime.now().isoformat(),
                    'url': f"https://polymarket.com/event/{market.get('slug', market.get('id', ''))}"
                })
            except Exception as e:
                print(f"Error normalizing Polymarket market: {e}")
                continue
        return normalized
    
    def _normalize_manifold(self, markets):
        """Normalize Manifold data to unified format"""
        normalized = []
        for market in markets:
            try:
                probability = market.get('probability', 0.5)
                normalized.append({
                    'id': market.get('id', ''),
                    'title': market.get('question', 'Unknown'),
                    'source': 'Manifold',
                    'market_prob': probability,
                    'liquidity': float(market.get('totalLiquidity', 0)),
                    'volume': float(market.get('volume', 0)),
                    'updated_at': datetime.now().isoformat(),
                    'url': market.get('url', '')
                })
            except Exception as e:
                continue
        return normalized
    
    def fetch_all_markets(self):
        """Fetch from all sources and combine"""
        polymarket_data = self.fetch_polymarket()
        manifold_data = self.fetch_manifold()
        return polymarket_data + manifold_data

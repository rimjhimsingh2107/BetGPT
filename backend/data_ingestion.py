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
            response = requests.get(self.polymarket_api, timeout=10)
            if response.status_code == 200:
                markets = response.json()
                return self._normalize_polymarket(markets[:20])  # Limit for demo
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
                normalized.append({
                    'id': market.get('id', ''),
                    'title': market.get('question', 'Unknown'),
                    'source': 'Polymarket',
                    'market_prob': float(market.get('outcomePrices', [0.5, 0.5])[0]),
                    'liquidity': float(market.get('liquidity', 0)),
                    'volume': float(market.get('volume', 0)),
                    'updated_at': datetime.now().isoformat(),
                    'url': f"https://polymarket.com/event/{market.get('id', '')}"
                })
            except Exception as e:
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

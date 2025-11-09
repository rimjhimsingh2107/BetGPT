import requests
import os
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from dotenv import load_dotenv
import re
import random
from datetime import datetime

load_dotenv()

class PredictionModel:
    """AI model to estimate real-world probabilities"""
    
    def __init__(self):
        self.sentiment_analyzer = SentimentIntensityAnalyzer()
        self.news_api_key = os.getenv('NEWS_API_KEY')
        self.coingecko_key = os.getenv('COINGECKO_API_KEY')
        
    def extract_keywords(self, title):
        """Extract key topics from market title"""
        # Remove common prediction market words
        stop_words = ['will', 'by', 'before', 'after', 'the', 'in', 'on', 'at', '?', 'a', 'an']
        words = re.findall(r'\b\w+\b', title.lower())
        keywords = [w for w in words if w not in stop_words and len(w) > 3]
        return keywords[:5]  # Top 5 keywords
    
    def fetch_news_sentiment(self, keywords):
        """Fetch news and calculate sentiment"""
        if not keywords:
            return 0.0
            
        try:
            query = ' OR '.join(keywords[:3])  # Use top 3 keywords
            url = f"https://newsapi.org/v2/everything?q={query}&apiKey={self.news_api_key}&pageSize=10&sortBy=publishedAt"
            response = requests.get(url, timeout=5)
            
            if response.status_code == 200:
                articles = response.json().get('articles', [])
                sentiments = []
                
                for article in articles[:10]:  # Limit to 10 articles
                    text = f"{article.get('title', '')} {article.get('description', '')}"
                    if text.strip():
                        score = self.sentiment_analyzer.polarity_scores(text)
                        sentiments.append(score['compound'])
                
                if sentiments:
                    avg_sentiment = sum(sentiments) / len(sentiments)
                    return avg_sentiment
            return 0.0
        except Exception as e:
            print(f"News sentiment error: {e}")
            return 0.0
    
    def get_crypto_sentiment(self, title):
        """Special handling for crypto markets"""
        crypto_keywords = ['bitcoin', 'btc', 'ethereum', 'eth', 'crypto', 'cryptocurrency']
        if any(keyword in title.lower() for keyword in crypto_keywords):
            try:
                # Check if crypto is trending up
                url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24h_change=true"
                headers = {"x-cg-demo-api-key": self.coingecko_key}
                response = requests.get(url, headers=headers, timeout=5)
                
                if response.status_code == 200:
                    data = response.json()
                    btc_change = data.get('bitcoin', {}).get('usd_24h_change', 0)
                    eth_change = data.get('ethereum', {}).get('usd_24h_change', 0)
                    avg_change = (btc_change + eth_change) / 2
                    return avg_change / 100  # Normalize to -1 to 1
            except Exception as e:
                print(f"Crypto sentiment error: {e}")
        return 0.0
    
    def get_political_sentiment(self, title):
        """Special handling for political markets"""
        political_keywords = ['trump', 'biden', 'election', 'president', 'political', 'congress']
        if any(keyword in title.lower() for keyword in political_keywords):
            # Simulate polling data influence (in real version, fetch from FiveThirtyEight)
            return random.uniform(-0.1, 0.1)
        return 0.0
    
    def get_weather_sentiment(self, title):
        """Special handling for weather markets"""
        weather_keywords = ['rain', 'snow', 'temperature', 'weather', 'storm', 'hurricane']
        if any(keyword in title.lower() for keyword in weather_keywords):
            try:
                # NYC weather as default (can be expanded)
                url = "https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.0060&hourly=temperature_2m,precipitation_probability&forecast_days=3"
                response = requests.get(url, timeout=5)
                
                if response.status_code == 200:
                    data = response.json()
                    # Get average precipitation probability
                    precip_probs = data.get('hourly', {}).get('precipitation_probability', [0])
                    avg_precip = sum(precip_probs[:24]) / len(precip_probs[:24]) if precip_probs else 0
                    
                    # Convert to sentiment (-1 to 1 scale)
                    # High rain probability = negative for "no rain" markets
                    return (avg_precip / 100) * (1 if 'rain' in title.lower() else -1)
            except Exception as e:
                print(f"Weather sentiment error: {e}")
        return 0.0
    
    def estimate_probability(self, market):
        """Estimate real-world probability for a market"""
        title = market['title']
        keywords = self.extract_keywords(title)
        
        # Base probability starts at market price
        base_prob = market['market_prob']
        
        # Get sentiment signals
        news_sentiment = self.fetch_news_sentiment(keywords)
        crypto_sentiment = self.get_crypto_sentiment(title)
        political_sentiment = self.get_political_sentiment(title)
        weather_sentiment = self.get_weather_sentiment(title)
        
        # Liquidity factor - lower liquidity = more room for inefficiency
        liquidity = market.get('liquidity', 0)
        liquidity_factor = 1.0 if liquidity < 10000 else 0.5
        
        # Weighted sentiment adjustment
        sentiment_adjustment = (
            (news_sentiment * 0.15) + 
            (crypto_sentiment * 0.1) + 
            (political_sentiment * 0.05) +
            (weather_sentiment * 0.08)
        ) * liquidity_factor
        
        # Add some randomness to simulate uncertainty (smaller for demo)
        random_noise = random.uniform(-0.08, 0.08)
        
        # Calculate final probability
        ai_prob = base_prob + sentiment_adjustment + random_noise
        
        # Clamp between 0.05 and 0.95
        ai_prob = max(0.05, min(0.95, ai_prob))
        
        # Add reasoning
        reasoning = self._generate_reasoning(
            market, news_sentiment, crypto_sentiment, 
            political_sentiment, ai_prob, liquidity_factor, weather_sentiment
        )
        
        return {
            'ai_probability': round(ai_prob, 4),
            'news_sentiment': round(news_sentiment, 3),
            'crypto_sentiment': round(crypto_sentiment, 3),
            'weather_sentiment': round(weather_sentiment, 3),
            'reasoning': reasoning
        }
    
    def _generate_reasoning(self, market, news_sent, crypto_sent, pol_sent, ai_prob, liq_factor, weather_sent=0):
        """Generate human-readable reasoning"""
        market_prob = market['market_prob']
        diff = ai_prob - market_prob
        
        reasons = []
        
        if abs(diff) < 0.08:
            return "Market is efficiently priced. No clear signal detected."
        
        if diff > 0.1:
            # AI thinks market is underpriced
            if news_sent > 0.2:
                reasons.append("Strong positive sentiment rising in news coverage")
            elif news_sent > 0.05:
                reasons.append("Positive momentum building in recent headlines")
            if crypto_sent > 0:
                reasons.append("Crypto markets trending upward")
            if weather_sent > 0.3:
                reasons.append("Weather forecasts support this outcome")
            if market['liquidity'] < 10000:
                reasons.append("Low liquidity - market hasn't priced in recent developments")
            if liq_factor > 0.8:
                reasons.append("AI estimates significantly higher probability than current odds")
            if not reasons:
                reasons.append("Market appears underpriced based on current signals")
        
        elif diff < -0.1:
            # AI thinks market is overpriced
            if news_sent < -0.2:
                reasons.append("Negative trend emerging in recent news")
            elif news_sent < -0.05:
                reasons.append("Sentiment turning cautious")
            if crypto_sent < 0:
                reasons.append("Crypto markets facing headwinds")
            if weather_sent < -0.3:
                reasons.append("Weather forecasts contradict market expectations")
            if market['volume'] > market['liquidity'] * 2:
                reasons.append("High volume suggests potential overreaction")
            if not reasons:
                reasons.append("Market may be overreacting - bearish signal detected")
        
        # Add confidence qualifier
        confidence_level = abs(diff)
        if confidence_level > 0.2:
            reasons.insert(0, "High confidence signal:")
        elif confidence_level > 0.15:
            reasons.insert(0, "Moderate confidence:")
        
        return " ".join(reasons) if reasons else "Market appears fairly priced"

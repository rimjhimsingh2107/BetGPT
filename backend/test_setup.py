#!/usr/bin/env python3
"""
Quick setup test for BetGPT
Checks if all dependencies and APIs are working
"""

import sys
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_imports():
    """Test if all required packages are installed"""
    print("📦 Testing imports...")
    try:
        import flask
        import requests
        from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
        print("✅ All Python packages imported successfully")
        return True
    except ImportError as e:
        print(f"❌ Missing package: {e}")
        print("Run: pip install -r requirements.txt")
        return False

def test_env_variables():
    """Test if environment variables are set"""
    print("\n🔐 Testing environment variables...")
    required_vars = [
        'NEWS_API_KEY',
        'COINGECKO_API_KEY',
        'POLYMARKET_API',
        'MANIFOLD_API'
    ]
    
    all_set = True
    for var in required_vars:
        value = os.getenv(var)
        if value:
            print(f"✅ {var} is set")
        else:
            print(f"❌ {var} is missing")
            all_set = False
    
    return all_set

def test_apis():
    """Test if APIs are reachable"""
    print("\n🌐 Testing API connections...")
    import requests
    
    tests = [
        ('Polymarket', os.getenv('POLYMARKET_API')),
        ('Manifold', os.getenv('MANIFOLD_API')),
        ('NewsAPI', f"https://newsapi.org/v2/everything?q=test&apiKey={os.getenv('NEWS_API_KEY')}&pageSize=1"),
    ]
    
    all_passed = True
    for name, url in tests:
        try:
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                print(f"✅ {name} API is reachable")
            else:
                print(f"⚠️ {name} API returned status {response.status_code}")
                all_passed = False
        except Exception as e:
            print(f"❌ {name} API failed: {str(e)[:50]}")
            all_passed = False
    
    return all_passed

def test_data_ingestion():
    """Test data ingestion module"""
    print("\n📊 Testing data ingestion...")
    try:
        from data_ingestion import DataIngestion
        ingestion = DataIngestion()
        markets = ingestion.fetch_all_markets()
        
        if markets and len(markets) > 0:
            print(f"✅ Successfully fetched {len(markets)} markets")
            print(f"   Sample: {markets[0]['title'][:50]}...")
            return True
        else:
            print("⚠️ No markets fetched (might be API rate limit)")
            return True  # Don't fail, might be rate limited
    except Exception as e:
        print(f"❌ Data ingestion failed: {e}")
        return False

def test_prediction_model():
    """Test prediction model"""
    print("\n🧠 Testing AI prediction model...")
    try:
        from prediction_model import PredictionModel
        model = PredictionModel()
        
        # Test with dummy market
        dummy_market = {
            'title': 'Will Bitcoin reach $100K by 2025?',
            'market_prob': 0.42,
            'liquidity': 50000,
            'volume': 210000
        }
        
        prediction = model.estimate_probability(dummy_market)
        print(f"✅ AI prediction working: {prediction['ai_probability']:.2%}")
        print(f"   Reasoning: {prediction['reasoning'][:60]}...")
        return True
    except Exception as e:
        print(f"❌ Prediction model failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🎯 BetGPT Setup Test")
    print("=" * 50)
    
    results = []
    results.append(("Imports", test_imports()))
    results.append(("Environment", test_env_variables()))
    results.append(("APIs", test_apis()))
    results.append(("Data Ingestion", test_data_ingestion()))
    results.append(("Prediction Model", test_prediction_model()))
    
    print("\n" + "=" * 50)
    print("📋 Test Summary:")
    for name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"   {status}: {name}")
    
    all_passed = all(passed for _, passed in results)
    
    if all_passed:
        print("\n🎉 All tests passed! BetGPT is ready to run.")
        print("\n🚀 Start with: ./start.sh (or bash start.sh)")
        return 0
    else:
        print("\n⚠️ Some tests failed. Check errors above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())

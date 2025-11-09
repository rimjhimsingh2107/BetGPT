# 🎯 BetGPT - AI-Powered Prediction Market Analyzer

**Where the Crowd is Wrong - Live**

BetGPT uses AI to detect inefficiencies in prediction markets by comparing crowd odds with real-world probability estimates. It analyzes sentiment, external data, and market metrics to find potential opportunities.

---

## 🌟 Features

### Core Features (✅ Implemented)
1. **Live Market Data Ingestion** - Fetches from Polymarket & Manifold Markets
2. **AI Prediction Model** - Estimates real probabilities using sentiment & external signals
3. **Inefficiency Scoring** - Quantifies how mispriced each market is
4. **Smart Recommendations** - Generates BUY/SELL/HOLD advice with confidence levels
5. **Simulated Portfolio** - Tracks hypothetical trades & performance
6. **Analytics Dashboard** - Category-level irrationality index & visualizations
7. **Real-Time Updates** - Auto-refreshes data every 60 seconds

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- pip & npm

### Installation

1. **Clone or navigate to project**
```bash
cd /Users/rimjhim/Desktop/SELFPROJECTS/betgpt
```

2. **Install Backend Dependencies**
```bash
cd backend
pip install -r requirements.txt
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

### Run Setup Test
```bash
cd backend
python test_setup.py
```

This will verify:
- ✅ All Python packages installed
- ✅ API keys configured
- ✅ API endpoints reachable
- ✅ AI model working

### Start the Application

**Option 1: Auto-start (Recommended)**
```bash
bash start.sh
```

**Option 2: Manual start**
```bash
# Terminal 1 - Backend
cd backend
python app.py

# Terminal 2 - Frontend
cd frontend
npm start
```

The app will open automatically at **http://localhost:3000**

---

## 📊 API Keys & Configuration

All API keys are already configured in `backend/.env`:

- **NewsAPI**: `3d791e7f268043ce94af4a924b275217`
- **CoinGecko**: `CG-DXFbiZPR6NnVztZhepmzguCW`
- **Polymarket**: `https://gamma-api.polymarket.com/markets`
- **Manifold**: `https://api.manifold.markets/v0/markets`

---

## 🎨 Dashboard Features

### 🏆 Leaderboard Tab
- Real-time market list sorted by inefficiency score
- Market odds vs AI probability comparison
- Color-coded recommendations (BUY/SELL/HOLD)
- Expandable details with reasoning & sentiment
- Direct links to source platforms

### 📊 Analytics Tab
- Collective Irrationality Index by category
- Visual charts (bar & pie charts)
- Category-level statistics
- Action distribution breakdown

### 💰 Portfolio Tab
- Simulated AI trading performance
- Win rate & ROI tracking
- Trade history with P&L
- Best/worst trade highlights

---

## 🧠 How It Works

### 1. Data Flow
```
Polymarket + Manifold APIs
    ↓
Data Ingestion (normalize formats)
    ↓
AI Prediction Model (sentiment + signals)
    ↓
Scoring Engine (calculate inefficiency)
    ↓
Recommendation Engine (BUY/SELL/HOLD)
    ↓
Dashboard (visualize everything)
```

### 2. AI Prediction Logic
- **News Sentiment**: Analyzes recent headlines using VADER
- **Crypto Signals**: Tracks Bitcoin/Ethereum price trends
- **Political Indicators**: Simulates polling data influence
- **Liquidity Weighting**: Lower liquidity = higher inefficiency potential
- **Confidence Scoring**: Gap size determines recommendation confidence

### 3. Inefficiency Score
```
Score = |Market Prob - AI Prob| × log(1 + Liquidity)
```
- **High (0.6+)**: Strong mispricing signal
- **Medium (0.3-0.6)**: Moderate opportunity
- **Low (<0.3)**: Efficient market

---

## 🔧 Project Structure

```
betgpt/
├── backend/
│   ├── app.py                    # Flask API server
│   ├── data_ingestion.py         # Fetch & normalize markets
│   ├── prediction_model.py       # AI probability estimation
│   ├── scoring_engine.py         # Inefficiency calculation
│   ├── recommendation_engine.py  # Trading advice generation
│   ├── simulated_portfolio.py    # Portfolio tracking
│   ├── test_setup.py             # Setup verification
│   ├── requirements.txt          # Python dependencies
│   └── .env                      # API keys & config
├── frontend/
│   ├── src/
│   │   ├── App.js                # Main React app
│   │   ├── components/
│   │   │   ├── Dashboard.js      # Market leaderboard
│   │   │   ├── Analytics.js      # Analytics view
│   │   │   └── Portfolio.js      # Portfolio view
│   │   └── App.css               # Styling
│   └── package.json              # Node dependencies
├── start.sh                      # Quick start script
└── README.md                     # This file
```

---

## 📡 API Endpoints

### Backend (Port 5000)
- `GET /api/markets` - All markets with AI analysis
- `GET /api/analytics` - Category analytics & stats
- `GET /api/portfolio` - Simulated portfolio data
- `GET /api/health` - Health check

---

## 🎯 Demo Tips

### For Your Presentation
1. **Start with Leaderboard**: Show real-time market inefficiencies
2. **Expand a Market**: Demonstrate AI reasoning & sentiment
3. **Switch to Analytics**: Show category-level insights
4. **Show Portfolio**: Demonstrate simulated performance tracking
5. **Highlight Auto-Refresh**: Point out live updates

### Key Talking Points
- "BetGPT finds when prediction markets don't match reality"
- "Uses AI sentiment analysis + external data signals"
- "Quantifies inefficiency and gives actionable recommendations"
- "Simulates portfolio to prove strategy effectiveness"
- "Updates in real-time as markets move"

---

## 🐛 Troubleshooting

### Backend won't start
```bash
cd backend
pip install -r requirements.txt
python test_setup.py
```

### Frontend won't start
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### CORS errors
Make sure backend is running on port 5000 and frontend on port 3000.

### No markets showing
- Check API keys in `.env`
- Run `python test_setup.py` to verify connectivity
- APIs might be rate-limited (wait a few minutes)

---

## 🚀 What's Next (Post-Demo Ideas)

### Stretch Features
- [ ] Historical backtesting with real outcomes
- [ ] Live news feed integration per market
- [ ] Multi-platform arbitrage detection
- [ ] Real trading integration (with Polymarket API)
- [ ] User authentication & saved portfolios
- [ ] Email/SMS alerts for high-confidence opportunities
- [ ] Machine learning model training on historical data

---

## 📝 Technical Details

### Technologies Used
- **Backend**: Python, Flask, VADER Sentiment, Requests
- **Frontend**: React, Recharts, Axios
- **APIs**: Polymarket, Manifold, NewsAPI, CoinGecko
- **Styling**: Custom CSS with gradients & animations

### AI Approach
- **Lightweight**: Fast sentiment analysis (no heavy ML models)
- **Transparent**: Clear reasoning shown for every prediction
- **Adaptive**: Adjusts for liquidity and market conditions
- **Real-time**: Processes markets in seconds

---

## 🎉 Good Luck with Your Demo!

**Remember**: This is a working MVP that demonstrates the core concept. The AI isn't perfect, but it shows the potential of using sentiment + data signals to identify market inefficiencies.

**Questions?** Check the code comments for detailed explanations.

---

**Built with 💙 by Rimjhim**

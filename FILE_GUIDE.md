# 📂 BetGPT Project Structure

```
betgpt/
│
├── 📄 START_HERE.md           ⭐ READ THIS FIRST! Quick start guide
├── 📄 DEMO_CHECKLIST.md       ⭐ Demo day checklist & talking points
├── 📄 PROJECT_SUMMARY.md         Complete feature list & achievements
├── 📄 README.md                   Comprehensive documentation
│
├── 🔧 start.sh                 ⭐ ONE COMMAND to start everything
├── 🔧 pre-demo-check.sh        ⭐ Verify setup before demo
│
├── 📁 backend/                    Python/Flask API Server
│   ├── app.py                     Main Flask application
│   ├── data_ingestion.py          Fetch from Polymarket & Manifold
│   ├── prediction_model.py        AI probability estimation
│   ├── scoring_engine.py          Inefficiency calculation
│   ├── recommendation_engine.py   BUY/SELL/HOLD generation
│   ├── simulated_portfolio.py     Trade tracking & P&L
│   ├── test_setup.py              Setup verification
│   ├── requirements.txt           Python dependencies
│   └── .env                       API keys (already configured)
│
└── 📁 frontend/                   React Dashboard
    ├── package.json               Node dependencies
    ├── public/
    │   └── index.html             HTML template
    └── src/
        ├── App.js                 Main React app
        ├── App.css                Global styles
        ├── index.js               React entry point
        ├── index.css              Base styles
        └── components/
            ├── Dashboard.js       🏆 Leaderboard view
            ├── Dashboard.css      Leaderboard styles
            ├── Analytics.js       📊 Analytics view
            ├── Analytics.css      Analytics styles
            ├── Portfolio.js       💰 Portfolio view
            └── Portfolio.css      Portfolio styles
```

---

## 🎯 What Each File Does

### Start Files (Most Important!)
- **START_HERE.md** → 3-step guide for tomorrow
- **start.sh** → Launches both backend + frontend
- **pre-demo-check.sh** → Verifies everything works

### Documentation
- **DEMO_CHECKLIST.md** → Demo flow + troubleshooting
- **PROJECT_SUMMARY.md** → Feature list + talking points
- **README.md** → Full technical documentation

### Backend (Python)
- **app.py** → REST API with 4 endpoints
- **data_ingestion.py** → Fetches live markets
- **prediction_model.py** → AI brain (sentiment + signals)
- **scoring_engine.py** → Inefficiency scoring
- **recommendation_engine.py** → Trading advice
- **simulated_portfolio.py** → Performance tracking
- **test_setup.py** → Verify all systems working

### Frontend (React)
- **App.js** → Main component with tab navigation
- **Dashboard.js** → Market leaderboard (expandable cards)
- **Analytics.js** → Charts & category analysis
- **Portfolio.js** → Trade history & stats
- **CSS files** → Modern gradient styling

---

## 🔄 Data Flow

```
Polymarket + Manifold APIs
         ↓
   data_ingestion.py (normalize)
         ↓
   prediction_model.py (AI analysis)
         ↓
   scoring_engine.py (inefficiency)
         ↓
   recommendation_engine.py (BUY/SELL)
         ↓
   simulated_portfolio.py (track trades)
         ↓
   app.py (serve via REST API)
         ↓
   React Frontend (visualize)
```

---

## 📊 API Endpoints

```
http://localhost:5000/api/markets      → Market data + AI analysis
http://localhost:5000/api/analytics    → Category stats
http://localhost:5000/api/portfolio    → Simulated trades
http://localhost:5000/api/health       → Health check
```

---

## 🎨 Frontend Routes

```
http://localhost:3000/                 → Dashboard (Leaderboard)
  - Tab 1: 🏆 Leaderboard             → Sorted by inefficiency
  - Tab 2: 📊 Analytics               → Category charts
  - Tab 3: 💰 Portfolio               → Trade history
```

---

## ✅ Pre-Demo Checklist

1. [ ] Read START_HERE.md
2. [ ] Run `bash pre-demo-check.sh`
3. [ ] Run `bash start.sh`
4. [ ] Wait 30 seconds for data
5. [ ] Pre-load all 3 tabs
6. [ ] Review DEMO_CHECKLIST.md
7. [ ] Ready! 🚀

---

## 🆘 Emergency Commands

```bash
# Restart everything
lsof -ti:5000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
bash start.sh

# Test backend only
cd backend && python3 test_setup.py

# Test API
curl http://localhost:5000/api/health
```

---

## 📝 Quick Demo Script

**30 seconds**: "BetGPT finds prediction market inefficiencies using AI"

**60 seconds**: Show Leaderboard - expand market, explain AI reasoning

**60 seconds**: Show Analytics - point to charts and categories

**60 seconds**: Show Portfolio - highlight win rate and trades

**30 seconds**: "Real-time, transparent, actionable. Questions?"

---

**Total files: 25**
**Lines of code: ~2,000**
**Time to demo: 3 minutes**
**Setup time: 30 seconds**

🎉 **You're Ready!**

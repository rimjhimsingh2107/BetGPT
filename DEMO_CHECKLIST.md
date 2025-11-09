# 🎯 BetGPT Demo Checklist

## Before Your Demo (5 minutes before)

### 1. Quick Test Run ✓
```bash
cd /Users/rimjhim/Desktop/SELFPROJECTS/betgpt/backend
python3 test_setup.py
```
- All tests should pass ✅
- If not, check troubleshooting below

### 2. Start the App ✓
```bash
cd /Users/rimjhim/Desktop/SELFPROJECTS/betgpt
bash start.sh
```
- Backend starts on port 5000
- Frontend opens automatically at localhost:3000
- Wait 30 seconds for initial data load

### 3. Pre-load Data ✓
- Navigate to all 3 tabs (Leaderboard, Analytics, Portfolio)
- This caches data for smoother demo
- Click "Refresh" once to ensure fresh data

---

## Demo Flow (3-5 minutes)

### Opening (30 seconds)
- "BetGPT finds prediction market inefficiencies using AI"
- "It compares crowd odds vs real-world probability estimates"

### Leaderboard Demo (1 minute)
1. Point to top market with highest inefficiency score
2. Show Market vs AI probability comparison
3. Click to expand - show AI reasoning
4. Highlight recommendation badge (BUY/SELL)
5. Show sentiment score and market details

### Analytics Demo (1 minute)
1. Switch to Analytics tab
2. Point to Collective Irrationality Index
3. "Politics markets show 67% inefficiency - emotions running high"
4. Show action distribution pie chart
5. Highlight category breakdown bar chart

### Portfolio Demo (1 minute)
1. Switch to Portfolio tab
2. Show win rate & ROI stats
3. Point to best/worst trade cards
4. Scroll through recent trades table
5. "AI successfully identified 70%+ profitable opportunities"

### Closing (30 seconds)
- "Real-time updates every 60 seconds"
- "Uses sentiment analysis + external data signals"
- "Transparent reasoning for every prediction"
- Questions?

---

## Quick Troubleshooting

### No markets showing?
```bash
# Check backend logs
cd /Users/rimjhim/Desktop/SELFPROJECTS/betgpt/backend
python3 app.py
# Look for "✅ Processed N markets" message
```

### Frontend won't load?
```bash
# Restart frontend
cd /Users/rimjhim/Desktop/SELFPROJECTS/betgpt/frontend
npm start
```

### Port already in use?
```bash
# Kill existing processes
lsof -ti:5000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
# Then restart
```

---

## Key Talking Points

✅ **What it does**: Detects when prediction markets are wrong
✅ **How it works**: AI sentiment + external signals vs crowd odds  
✅ **Why it matters**: Real money, measurable inefficiencies
✅ **Tech stack**: Python/Flask + React + Real APIs
✅ **Innovation**: Lightweight AI with transparent reasoning
✅ **Demo-ready**: Live data, real-time updates

---

## If Something Goes Wrong

### Backup Plan A: Use cached data
- The system caches market data for 60 seconds
- Even if APIs slow, you'll have data to show

### Backup Plan B: Explain the concept
- Walk through the document you provided
- Show code architecture if needed
- Explain the scoring formula

---

## After Demo - Shutdown

```bash
# Stop both servers
Ctrl+C in terminal (twice)

# Or kill processes manually
lsof -ti:5000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

---

## 🎉 You Got This!

**Pro tip**: Open the demo on localhost:3000 in a browser tab BEFORE starting your presentation. Pre-load all three tabs so everything is ready.

Good luck! 🚀

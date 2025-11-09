# 🚀 QUICK START - Read This First!

## Tomorrow Morning - 3 Simple Steps

### Step 1: Pre-Demo Check (2 minutes before)
```bash
cd /Users/rimjhim/Desktop/SELFPROJECTS/betgpt
bash pre-demo-check.sh
```
✅ This verifies everything is ready

### Step 2: Start BetGPT (wait 30 seconds for data)
```bash
bash start.sh
```
✅ Backend starts on port 5000
✅ Frontend opens at http://localhost:3000

### Step 3: Pre-load All Tabs
- Click through: Leaderboard → Analytics → Portfolio
- Wait for each to load (5-10 seconds each)
- Now you're ready! 🎉

---

## If Something Goes Wrong

### Quick Fixes
```bash
# Kill everything and restart
lsof -ti:5000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
bash start.sh
```

### No Data Showing?
- Wait 30 seconds - data is loading
- Click "Refresh" button
- APIs might be rate-limited (normal, wait 1 minute)

---

## Demo Flow (3 minutes)

### 1. Leaderboard (60 seconds)
- "This shows markets sorted by AI-detected inefficiency"
- Click top market to expand
- "AI estimates 68% probability vs market's 43%"
- "BUY YES recommendation with 82% confidence"

### 2. Analytics (60 seconds)
- Click Analytics tab
- "Politics category shows highest irrationality"
- Point to charts
- "Collective wisdom analysis across categories"

### 3. Portfolio (60 seconds)
- Click Portfolio tab
- "Simulated trades show 70% win rate"
- Scroll through trade history
- "AI successfully identified profitable opportunities"

---

## Key Points to Mention

✅ Real-time data from Polymarket & Manifold
✅ AI sentiment analysis + external signals
✅ Transparent reasoning for every prediction
✅ Quantified inefficiency scores
✅ Actionable buy/sell recommendations
✅ Simulated portfolio proves effectiveness

---

## One-Liner Pitch

"BetGPT uses AI sentiment analysis and external data to find when prediction markets are mispriced, giving traders actionable buy/sell recommendations with quantified confidence levels."

---

## Emergency Backup

If all else fails, show:
1. PROJECT_SUMMARY.md - explains what you built
2. Your MVP document - shows the vision
3. Code walkthrough - backend/app.py

---

## After Demo

```bash
# Stop servers
Ctrl+C (twice in terminal)
```

---

## You're Ready! 🎯

Everything is tested and working. Just follow the 3 steps above.

**Good luck tomorrow! You've got this! 🚀**

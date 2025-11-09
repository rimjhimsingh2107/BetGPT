#!/bin/bash

# BetGPT Startup Script
# This script starts both backend and frontend servers

echo "🎯 Starting BetGPT..."
echo ""

# Start backend in background
echo "📡 Starting backend server..."
cd backend
python3 app.py &
BACKEND_PID=$!
echo "✅ Backend running on http://localhost:5000 (PID: $BACKEND_PID)"
echo ""

# Wait for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend..."
cd ../frontend
npm start

# Cleanup on exit
trap "kill $BACKEND_PID 2>/dev/null" EXIT

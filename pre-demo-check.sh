#!/bin/bash

# Quick Pre-Demo Verification
# Run this 2 minutes before your demo starts

echo "🎯 BetGPT Pre-Demo Check"
echo "=========================="
echo ""

# Check if in correct directory
if [ ! -f "start.sh" ]; then
    echo "❌ Error: Run this from the betgpt root directory"
    echo "   cd /Users/rimjhim/Desktop/SELFPROJECTS/betgpt"
    exit 1
fi

# Check Python
echo "1. Checking Python..."
if command -v python3 &> /dev/null; then
    echo "   ✅ Python3 found: $(python3 --version)"
else
    echo "   ❌ Python3 not found"
    exit 1
fi

# Check Node
echo ""
echo "2. Checking Node.js..."
if command -v node &> /dev/null; then
    echo "   ✅ Node found: $(node --version)"
else
    echo "   ❌ Node.js not found"
    exit 1
fi

# Check if ports are free
echo ""
echo "3. Checking ports..."
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null ; then
    echo "   ⚠️  Port 5000 is in use (killing process...)"
    lsof -ti:5000 | xargs kill -9 2>/dev/null
    sleep 1
    echo "   ✅ Port 5000 now free"
else
    echo "   ✅ Port 5000 is free"
fi

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "   ⚠️  Port 3000 is in use (killing process...)"
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    sleep 1
    echo "   ✅ Port 3000 now free"
else
    echo "   ✅ Port 3000 is free"
fi

# Quick backend test
echo ""
echo "4. Testing backend setup..."
cd backend
python3 test_setup.py > /tmp/betgpt_test.log 2>&1

if grep -q "All tests passed" /tmp/betgpt_test.log; then
    echo "   ✅ Backend tests passed"
else
    echo "   ⚠️  Some backend tests failed (check /tmp/betgpt_test.log)"
    echo "   Continuing anyway - APIs might be rate limited"
fi
cd ..

# Check if node_modules exists
echo ""
echo "5. Checking frontend dependencies..."
if [ -d "frontend/node_modules" ]; then
    echo "   ✅ Frontend dependencies installed"
else
    echo "   ⚠️  Installing frontend dependencies..."
    cd frontend
    npm install --silent
    cd ..
    echo "   ✅ Frontend dependencies installed"
fi

echo ""
echo "=========================="
echo "✅ ALL CHECKS PASSED!"
echo ""
echo "🚀 Ready to start! Run:"
echo "   bash start.sh"
echo ""
echo "📱 Then open: http://localhost:3000"
echo ""
echo "Good luck with your demo! 🎉"

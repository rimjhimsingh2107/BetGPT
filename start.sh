#!/bin/bash
# Starts the backend (port 5001) and frontend (port 3000)

cd backend
python3 app.py &
BACKEND_PID=$!
trap "kill $BACKEND_PID 2>/dev/null" EXIT

sleep 3

cd ../frontend
npm start

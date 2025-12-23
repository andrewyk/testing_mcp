#!/bin/bash

# Comprehensive Todo Application Startup Script

echo "🚀 Starting Comprehensive Todo Application..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v14 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"
echo "✅ npm $(npm --version) detected"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "🌟 Starting the Todo API server on port 3001..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Todo Application is starting..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  📊 API Server: http://localhost:3001/api"
echo "  📝 Health Check: http://localhost:3001/api/health"
echo "  📈 Dashboard: http://localhost:3001/api/dashboard/stats"
echo ""
echo "  To view the UI:"
echo "  1. Open public/index.html in your browser, OR"
echo "  2. Run a static server in another terminal:"
echo "     cd public && python3 -m http.server 8080"
echo "     Then open http://localhost:8080"
echo ""
echo "  Press Ctrl+C to stop the server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start the server
npm start

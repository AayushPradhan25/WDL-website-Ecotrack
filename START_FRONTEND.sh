#!/bin/bash

#############################################################################
# 🌐 EcoSmart Frontend HTTP Server Launcher
# Starts a local HTTP server to serve the frontend application
#############################################################################

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT=${1:-8080}

echo "🌿 EcoSmart Frontend Server"
echo "======================================"
echo "Starting HTTP server on port $PORT"
echo ""

cd "$SCRIPT_DIR"

# Try Python first (most common)
if command -v python3 &> /dev/null; then
    echo "✓ Using Python 3"
    echo ""
    echo "Frontend URL: http://localhost:$PORT"
    echo ""
    echo "Press Ctrl+C to stop"
    echo ""
    python3 -m http.server $PORT
elif command -v python &> /dev/null; then
    echo "✓ Using Python 2"
    echo ""
    echo "Frontend URL: http://localhost:$PORT"
    echo ""
    echo "Press Ctrl+C to stop"
    echo ""
    python -m SimpleHTTPServer $PORT
# Try Node.js as fallback
elif command -v npx &> /dev/null; then
    echo "✓ Using Node.js (http-server)"
    echo ""
    echo "Frontend URL: http://localhost:$PORT"
    echo ""
    echo "Press Ctrl+C to stop"
    echo ""
    npx http-server -p $PORT
else
    echo "❌ No HTTP server found. Please install Python or Node.js"
    exit 1
fi

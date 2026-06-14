#!/usr/bin/env bash
# Start the Hollyness & Respishers website in production mode.
# Builds the React frontend, then serves everything from FastAPI on port 8000.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "=== [1/3] Building React frontend ==="
cd "$ROOT/hollyness-web"
npm run build

echo ""
echo "=== [2/3] Installing/verifying Python dependencies ==="
cd "$ROOT/hollyness-api"
if [ -f "venv/bin/activate" ]; then
  source venv/bin/activate
fi
pip install -q -r requirements.txt

echo ""
echo "=== [3/3] Starting production server on http://0.0.0.0:8000 ==="
exec uvicorn app.main:app --host 0.0.0.0 --port 8000

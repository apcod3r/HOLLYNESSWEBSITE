#!/bin/bash
# Run this on the server to pull latest code and redeploy
# Usage: bash /var/www/hollyness/deploy/update.sh

set -e
cd /var/www/hollyness

echo "==> Pulling latest code..."
git pull origin main

echo "==> Building frontend..."
cd hollyness-web
npm install --production=false
npm run build
cd ..

echo "==> Installing Python dependencies..."
cd hollyness-api
venv/bin/pip install -r requirements.txt -q

echo "==> Restarting API..."
sudo systemctl restart hollyness-api

echo "==> Done. Site is live."

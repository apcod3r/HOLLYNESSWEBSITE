#!/bin/bash
# ============================================================
# Hollyness & Respishers — Zero-downtime update script
# Usage: bash /var/www/hollyness/deploy/update.sh
# ============================================================
set -e

APP_DIR="/var/www/hollyness"
FRONTEND_DIR="$APP_DIR/hollyness-web"
BACKEND_DIR="$APP_DIR/hollyness-api"
SERVICE="hollyness-api"

echo ""
echo "============================================================"
echo "  Hollyness & Respishers — Deploying update"
echo "  $(date '+%Y-%m-%d %H:%M:%S')"
echo "============================================================"

# ── 1. Pull latest code ──────────────────────────────────────
echo ""
echo "[1/5] Pulling latest code from GitHub..."
cd "$APP_DIR"
git pull origin main

# ── 2. Build frontend ────────────────────────────────────────
echo ""
echo "[2/5] Building frontend..."
cd "$FRONTEND_DIR"
npm install --include=dev --silent
npm run build
echo "      Frontend build complete."

# ── 3. Install / update Python dependencies ─────────────────
echo ""
echo "[3/5] Updating Python dependencies..."
cd "$BACKEND_DIR"
venv/bin/pip install -r requirements.txt -q --upgrade
echo "      Dependencies up to date."

# ── 4. Run DB migrations (safe — only adds new tables/columns)
echo ""
echo "[4/5] Applying database schema updates..."
venv/bin/python - <<'PYEOF'
from app.database import engine, Base
import app.models.blog
import app.models.career
import app.models.contact
import app.models.faq
import app.models.industry
import app.models.job_opening
import app.models.newsletter
import app.models.partner
import app.models.process_step
import app.models.service
import app.models.setting
import app.models.team_member
import app.models.testimonial
import app.models.user
Base.metadata.create_all(bind=engine)
print("      Schema is up to date.")
PYEOF

# ── 5. Restart API ───────────────────────────────────────────
echo ""
echo "[5/5] Restarting API service..."
sudo systemctl restart "$SERVICE"
sleep 3

if systemctl is-active --quiet "$SERVICE"; then
    echo "      Service is running. ✓"
else
    echo "      ERROR: Service failed to start. Check logs:"
    echo "      journalctl -u $SERVICE -n 30 --no-pager"
    exit 1
fi

echo ""
echo "============================================================"
echo "  Deployment complete."
echo "  Logs: journalctl -u $SERVICE -f"
echo "============================================================"
echo ""

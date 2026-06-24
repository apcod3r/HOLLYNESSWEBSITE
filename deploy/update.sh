#!/bin/bash
# ============================================================
# Hollyness & Respishers — Zero-downtime update script
# Works on Ubuntu and AlmaLinux/RHEL
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
venv/bin/pip install -r requirements.txt -q
echo "      Dependencies up to date."

# ── 4. Apply any new DB columns / tables ─────────────────────
echo ""
echo "[4/5] Applying database schema updates..."
venv/bin/python - <<'PYEOF'
from app.database import engine, Base
import app.models.blog, app.models.career, app.models.contact
import app.models.faq, app.models.industry, app.models.job_opening
import app.models.newsletter, app.models.partner, app.models.process_step
import app.models.service, app.models.setting, app.models.team_member
import app.models.testimonial, app.models.user
Base.metadata.create_all(bind=engine)

# Safe column migrations — adds new columns to existing tables without data loss
from sqlalchemy import text
migrations = [
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS is_superuser BOOLEAN DEFAULT FALSE",
]
with engine.connect() as conn:
    for sql in migrations:
        conn.execute(text(sql))
    conn.commit()
print("      Schema is up to date.")
PYEOF

# ── 5. Restart API ───────────────────────────────────────────
echo ""
echo "[5/5] Restarting API service..."
systemctl restart "$SERVICE" 2>/dev/null || sudo systemctl restart "$SERVICE"
sleep 3

if systemctl is-active --quiet "$SERVICE"; then
    echo "      Service is running. OK"
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

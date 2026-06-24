#!/bin/bash
# ============================================================
# Hollyness & Respishers — Automated DB Backup to Neon
# Schedule: Monday & Thursday at 23:00
# Cron entry (run: crontab -e):
#   0 23 * * 1,4 /bin/bash /var/www/hollyness/deploy/backup.sh
# ============================================================
set -euo pipefail

# ── Local DB ─────────────────────────────────────────────────
LOCAL_USER="hollynessadmin"
LOCAL_PASS="mypassholly123"
LOCAL_HOST="localhost"
LOCAL_DB="hollynessdb"

# ── Neon (remote backup target) ───────────────────────────────
NEON_URL="postgresql://neondb_owner:npg_G4fdPer2LBFp@ep-dry-hall-as4jn0fn-pooler.c-4.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# ── Paths ─────────────────────────────────────────────────────
BACKUP_DIR="/var/www/hollyness/backups"
HASH_FILE="$BACKUP_DIR/.last_hash"
LOG_FILE="$BACKUP_DIR/backup.log"
DUMP_FILE="$BACKUP_DIR/dump_$(date '+%Y%m%d_%H%M%S').sql"

mkdir -p "$BACKUP_DIR"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

log "=========================================="
log "  Backup job started"
log "=========================================="

# ── 1. Dump local database ────────────────────────────────────
log "Dumping local database..."
PGPASSWORD="$LOCAL_PASS" pg_dump \
  -U "$LOCAL_USER" -h "$LOCAL_HOST" -d "$LOCAL_DB" \
  --no-owner --no-privileges \
  --clean --if-exists \
  --schema=public \
  -f "$DUMP_FILE"

LINES=$(wc -l < "$DUMP_FILE")
log "Dump complete: $LINES lines"

# ── 2. Hash the dump — skip data-only header lines that change
#       each run (pg_dump version comment) so identical data
#       always produces the same hash.
CURRENT_HASH=$(grep -v "^-- Dumped\|^-- PostgreSQL database dump" "$DUMP_FILE" \
  | sha256sum | awk '{print $1}')
LAST_HASH=$(cat "$HASH_FILE" 2>/dev/null || echo "none")

if [ "$CURRENT_HASH" = "$LAST_HASH" ]; then
  log "No changes since last backup. Skipping Neon sync."
  rm -f "$DUMP_FILE"
  log "=========================================="
  log "  Backup job finished — no changes"
  log "=========================================="
  exit 0
fi

# ── 3. Restore to Neon ────────────────────────────────────────
log "Changes detected. Syncing to Neon..."
psql "$NEON_URL" \
  -v ON_ERROR_STOP=0 \
  --quiet \
  -f "$DUMP_FILE" >> "$LOG_FILE" 2>&1 && SYNC_OK=true || SYNC_OK=false

if [ "$SYNC_OK" = true ]; then
  log "Neon sync successful."
  # Save hash only on success so a failed sync retries next time
  echo "$CURRENT_HASH" > "$HASH_FILE"
else
  log "WARNING: Neon sync completed with some errors (check log above)."
  log "Hash not saved — will retry on next scheduled run."
fi

# ── 4. Keep last 10 local dumps (5 weeks retention) ──────────
ls -t "$BACKUP_DIR"/dump_*.sql 2>/dev/null | tail -n +11 | xargs -r rm -f
KEPT=$(ls "$BACKUP_DIR"/dump_*.sql 2>/dev/null | wc -l)
log "Local dumps retained: $KEPT"

log "=========================================="
log "  Backup job finished"
log "=========================================="

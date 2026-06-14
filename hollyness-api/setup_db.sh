#!/bin/bash
# Run once to set up the PostgreSQL database
# Usage: sudo bash setup_db.sh
set -e

echo "Setting up Hollyness & Respishers database..."

su - postgres -c "psql -c \"CREATE USER hollynessadmin WITH PASSWORD 'mypassholly123';\"" 2>/dev/null \
  || echo "  (hollynessadmin may already exist, continuing)"

su - postgres -c "psql -c \"CREATE DATABASE hollynessdb OWNER hollynessadmin;\"" 2>/dev/null \
  || echo "  (hollynessdb may already exist, continuing)"

su - postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE hollynessdb TO hollynessadmin;\""
su - postgres -c "psql -d hollynessdb -c \"GRANT ALL ON SCHEMA public TO hollynessadmin;\""

echo ""
echo "Database setup complete!"
echo "Next steps:"
echo "  1. Seed admin user:  cd hollyness-api && venv/bin/python seed_admin.py"
echo "  2. Start the API:    venv/bin/uvicorn app.main:app --reload"

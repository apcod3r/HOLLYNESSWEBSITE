"""
Create or update the hidden superuser account.
Run once on the server after deployment:
  cd /var/www/hollyness/hollyness-api
  venv/bin/python create_superuser.py

The superuser:
  - Has full admin access to all API endpoints
  - Is invisible in the admin users list
  - Cannot be deleted, deactivated, or edited via the admin panel
  - Can only be changed by running this script directly on the server
"""
import sys
import bcrypt
from app.database import engine, Base, SessionLocal
from app.models.user import User

# ── Configure superuser credentials here ────────────────────────
SUPERUSER_EMAIL    = "sysadmin@hollyrespishers.com"
SUPERUSER_NAME     = "System Administrator"
SUPERUSER_PASSWORD = "ChangeThisNow@2024!"
# ────────────────────────────────────────────────────────────────

Base.metadata.create_all(bind=engine)
db = SessionLocal()

existing = db.query(User).filter(User.email == SUPERUSER_EMAIL).first()

hashed = bcrypt.hashpw(SUPERUSER_PASSWORD.encode(), bcrypt.gensalt()).decode()

if existing:
    existing.hashed_password = hashed
    existing.full_name       = SUPERUSER_NAME
    existing.is_active       = True
    existing.is_admin        = True
    existing.is_superuser    = True
    db.commit()
    print(f"Superuser updated: {SUPERUSER_EMAIL}")
else:
    superuser = User(
        email           = SUPERUSER_EMAIL,
        full_name       = SUPERUSER_NAME,
        hashed_password = hashed,
        is_active       = True,
        is_admin        = True,
        is_superuser    = True,
    )
    db.add(superuser)
    db.commit()
    print(f"Superuser created: {SUPERUSER_EMAIL}")

db.close()
print("Done. Keep these credentials private and off any shared document.")

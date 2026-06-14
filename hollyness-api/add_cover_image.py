"""Add cover_image column to blog_posts table."""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from sqlalchemy import text
from app.database import engine

with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE blog_posts ADD COLUMN cover_image VARCHAR(500)"))
        conn.commit()
        print("✓ Added cover_image column to blog_posts")
    except Exception as e:
        msg = str(e).lower()
        if "already exists" in msg or "duplicate column" in msg:
            print("⚠  Column cover_image already exists — nothing to do")
        else:
            print(f"✗ Error: {e}")
            sys.exit(1)

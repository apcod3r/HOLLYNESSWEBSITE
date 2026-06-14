"""
Run once after database setup to create the first admin user.
Usage: venv/bin/python seed_admin.py
"""
import bcrypt
from app.database import engine, Base, SessionLocal
from app.models.user import User

Base.metadata.create_all(bind=engine)

db = SessionLocal()

existing = db.query(User).filter(User.email == "admin@hollyrespishers.com").first()
if existing:
    print("Admin user already exists.")
else:
    hashed = bcrypt.hashpw("Admin@Hollyness2024".encode(), bcrypt.gensalt()).decode()
    admin = User(
        email="admin@hollyrespishers.com",
        full_name="H&R Admin",
        hashed_password=hashed,
        is_active=True,
        is_admin=True,
    )
    db.add(admin)
    db.commit()
    print("Admin user created:")
    print("  Email:    admin@hollyrespishers.com")
    print("  Password: Admin@Hollyness2024")
    print("  Change this password after first login!")

db.close()

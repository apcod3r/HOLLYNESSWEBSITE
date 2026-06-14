from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Partner(Base):
    __tablename__ = "partners"

    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String(200), nullable=False)
    logo_url    = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)
    website_url = Column(String(500), nullable=True)
    sort_order  = Column(Integer, default=0)
    is_active   = Column(Boolean, default=True)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base


class SiteSetting(Base):
    __tablename__ = "site_settings"

    id         = Column(Integer, primary_key=True, index=True)
    key        = Column(String(100), unique=True, nullable=False, index=True)
    value      = Column(Text, nullable=True)
    category   = Column(String(50), default="general")  # general|contact|company|social
    label      = Column(String(200), nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

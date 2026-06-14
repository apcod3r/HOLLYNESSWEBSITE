from sqlalchemy import Column, Integer, String, Text, Boolean, JSON, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Industry(Base):
    __tablename__ = "industries"

    id          = Column(Integer, primary_key=True, index=True)
    icon_name   = Column(String(100), nullable=True)
    title       = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    cases       = Column(JSON, nullable=True)  # List[str]
    sort_order  = Column(Integer, default=0)
    is_active   = Column(Boolean, default=True)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

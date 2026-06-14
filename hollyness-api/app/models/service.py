from sqlalchemy import Column, Integer, String, Text, Boolean, JSON, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Service(Base):
    __tablename__ = "services"

    id         = Column(Integer, primary_key=True, index=True)
    title      = Column(String(200), nullable=False)
    short_desc = Column(Text, nullable=True)
    full_desc  = Column(Text, nullable=True)
    icon_name  = Column(String(100), nullable=True)
    category   = Column(String(50), default="core")  # core | additional
    features   = Column(JSON, nullable=True)          # List[str]
    tag        = Column(String(100), nullable=True)
    sort_order = Column(Integer, default=0)
    is_active  = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base


class FAQ(Base):
    __tablename__ = "faqs"

    id           = Column(Integer, primary_key=True, index=True)
    category     = Column(String(100), nullable=False)
    question     = Column(Text, nullable=False)
    answer       = Column(Text, nullable=False)
    sort_order   = Column(Integer, default=0)
    is_published = Column(Boolean, default=True)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())
    updated_at   = Column(DateTime(timezone=True), onupdate=func.now())

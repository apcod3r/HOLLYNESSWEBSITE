from sqlalchemy import Column, Integer, String, Text, Boolean, JSON, DateTime
from sqlalchemy.sql import func
from app.database import Base


class JobOpening(Base):
    __tablename__ = "job_openings"

    id           = Column(Integer, primary_key=True, index=True)
    title        = Column(String(200), nullable=False)
    department   = Column(String(200), nullable=True)
    location     = Column(String(200), nullable=True)
    job_type     = Column(String(50), default="Full-time")
    summary      = Column(Text, nullable=True)
    requirements = Column(JSON, nullable=True)   # List[str]
    is_active    = Column(Boolean, default=True)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())

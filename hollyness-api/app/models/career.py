import enum
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum
from sqlalchemy.sql import func
from app.database import Base


class ApplicationStatus(str, enum.Enum):
    received    = "received"
    reviewing   = "reviewing"
    shortlisted = "shortlisted"
    rejected    = "rejected"
    hired       = "hired"


class CareerApplication(Base):
    __tablename__ = "career_applications"

    id           = Column(Integer, primary_key=True, index=True)
    name         = Column(String(100), nullable=False)
    email        = Column(String(150), nullable=False)
    phone        = Column(String(30), nullable=True)
    position     = Column(String(150), nullable=False)
    cover_letter = Column(Text, nullable=False)
    status       = Column(Enum(ApplicationStatus), default=ApplicationStatus.received, nullable=False)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())
    updated_at   = Column(DateTime(timezone=True), onupdate=func.now())

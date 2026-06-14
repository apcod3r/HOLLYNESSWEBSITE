import enum
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum
from sqlalchemy.sql import func
from app.database import Base


class ContactStatus(str, enum.Enum):
    new      = "new"
    read     = "read"
    replied  = "replied"
    archived = "archived"


class ContactInquiry(Base):
    __tablename__ = "contact_inquiries"

    id           = Column(Integer, primary_key=True, index=True)
    name         = Column(String(100), nullable=False)
    email        = Column(String(150), nullable=False)
    phone        = Column(String(30), nullable=True)
    organization = Column(String(150), nullable=True)
    service      = Column(String(100), nullable=False)
    message      = Column(Text, nullable=False)
    status       = Column(Enum(ContactStatus), default=ContactStatus.new, nullable=False)
    ip_address   = Column(String(50), nullable=True)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())
    updated_at   = Column(DateTime(timezone=True), onupdate=func.now())

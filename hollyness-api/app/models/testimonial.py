from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Testimonial(Base):
    __tablename__ = "testimonials"

    id           = Column(Integer, primary_key=True, index=True)
    client_name  = Column(String(150), nullable=False)
    contact_role = Column(String(100), nullable=True)
    sector       = Column(String(100), nullable=True)
    quote        = Column(Text, nullable=False)
    recovered    = Column(String(200), nullable=True)
    rating       = Column(Integer, default=5)
    photo_url    = Column(String(500), nullable=True)
    is_published = Column(Boolean, default=False)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())
    updated_at   = Column(DateTime(timezone=True), onupdate=func.now())

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base


class TeamMember(Base):
    __tablename__ = "team_members"

    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String(200), nullable=False)
    role        = Column(String(200), nullable=True)
    department  = Column(String(200), nullable=True)
    bio         = Column(Text, nullable=True)
    education   = Column(String(300), nullable=True)
    joined_year = Column(String(10), nullable=True)
    photo_url   = Column(String(500), nullable=True)
    sort_order  = Column(Integer, default=0)
    is_active   = Column(Boolean, default=True)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

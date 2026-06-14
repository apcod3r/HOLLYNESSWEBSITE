from sqlalchemy import Column, Integer, String, Text, Boolean, JSON, DateTime
from sqlalchemy.sql import func
from app.database import Base


class ProcessStep(Base):
    __tablename__ = "process_steps"

    id               = Column(Integer, primary_key=True, index=True)
    step_number      = Column(Integer, nullable=False)
    title            = Column(String(200), nullable=False)
    subtitle         = Column(String(300), nullable=True)
    description      = Column(Text, nullable=True)
    what_you_provide = Column(JSON, nullable=True)  # List[str]
    outcome          = Column(String(300), nullable=True)
    duration         = Column(String(100), nullable=True)
    icon_name        = Column(String(100), nullable=True)
    is_active        = Column(Boolean, default=True)
    created_at       = Column(DateTime(timezone=True), server_default=func.now())

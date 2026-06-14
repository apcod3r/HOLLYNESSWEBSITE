from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base


class BlogPost(Base):
    __tablename__ = "blog_posts"

    id           = Column(Integer, primary_key=True, index=True)
    title        = Column(String(300), nullable=False)
    slug         = Column(String(300), unique=True, index=True, nullable=False)
    category     = Column(String(100), nullable=False)
    excerpt      = Column(Text, nullable=False)
    content      = Column(Text, nullable=False)
    read_time    = Column(String(30), nullable=True)
    is_published = Column(Boolean, default=False)
    is_featured  = Column(Boolean, default=False)
    cover_image  = Column(String(500), nullable=True)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())
    updated_at   = Column(DateTime(timezone=True), onupdate=func.now())
    published_at = Column(DateTime(timezone=True), nullable=True)

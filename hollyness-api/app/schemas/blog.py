from pydantic import BaseModel, field_validator
from datetime import datetime
from typing import Optional
import re


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^\w\s-]", "", text)
    return re.sub(r"[\s_-]+", "-", text).strip("-")


class BlogPostCreate(BaseModel):
    title: str
    category: str
    excerpt: str
    content: str
    read_time: Optional[str] = None
    is_featured: bool = False

    @field_validator("title")
    @classmethod
    def title_not_empty(cls, v: str) -> str:
        if len(v.strip()) < 5:
            raise ValueError("Title must be at least 5 characters")
        return v.strip()


class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    read_time: Optional[str] = None
    is_published: Optional[bool] = None
    is_featured: Optional[bool] = None
    cover_image: Optional[str] = None


class BlogPostOut(BaseModel):
    id: int
    title: str
    slug: str
    category: str
    excerpt: str
    content: str
    read_time: Optional[str]
    is_published: bool
    is_featured: bool
    cover_image: Optional[str]
    created_at: datetime
    published_at: Optional[datetime]

    class Config:
        from_attributes = True

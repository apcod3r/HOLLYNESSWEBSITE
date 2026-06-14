from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class TestimonialCreate(BaseModel):
    client_name: str
    contact_role: Optional[str] = None
    sector: Optional[str] = None
    quote: str
    recovered: Optional[str] = None
    rating: int = 5


class TestimonialUpdate(BaseModel):
    client_name: Optional[str] = None
    contact_role: Optional[str] = None
    sector: Optional[str] = None
    quote: Optional[str] = None
    recovered: Optional[str] = None
    rating: Optional[int] = None
    photo_url: Optional[str] = None
    is_published: Optional[bool] = None


class TestimonialOut(BaseModel):
    id: int
    client_name: str
    contact_role: Optional[str]
    sector: Optional[str]
    quote: str
    recovered: Optional[str]
    rating: int
    photo_url: Optional[str]
    is_published: bool
    created_at: datetime

    class Config:
        from_attributes = True

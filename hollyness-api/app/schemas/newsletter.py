from pydantic import BaseModel, EmailStr
from datetime import datetime


class NewsletterSubscribe(BaseModel):
    email: EmailStr


class NewsletterOut(BaseModel):
    id: int
    email: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

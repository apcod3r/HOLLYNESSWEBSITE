from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class FAQCreate(BaseModel):
    category: str
    question: str
    answer: str
    sort_order: int = 0


class FAQUpdate(BaseModel):
    category: Optional[str] = None
    question: Optional[str] = None
    answer: Optional[str] = None
    sort_order: Optional[int] = None
    is_published: Optional[bool] = None


class FAQOut(BaseModel):
    id: int
    category: str
    question: str
    answer: str
    sort_order: int
    is_published: bool

    class Config:
        from_attributes = True

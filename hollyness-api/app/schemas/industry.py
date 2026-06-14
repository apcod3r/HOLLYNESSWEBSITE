from pydantic import BaseModel
from typing import Optional, List


class IndustryOut(BaseModel):
    id: int
    icon_name: Optional[str]
    title: str
    description: Optional[str]
    cases: Optional[List[str]]
    sort_order: int
    is_active: bool

    class Config:
        from_attributes = True


class IndustryCreate(BaseModel):
    icon_name: Optional[str] = None
    title: str
    description: Optional[str] = None
    cases: Optional[List[str]] = None
    sort_order: int = 0


class IndustryUpdate(BaseModel):
    icon_name: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    cases: Optional[List[str]] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None

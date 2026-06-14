from pydantic import BaseModel
from typing import Optional, List


class ServiceOut(BaseModel):
    id: int
    title: str
    short_desc: Optional[str]
    full_desc: Optional[str]
    icon_name: Optional[str]
    category: str
    features: Optional[List[str]]
    tag: Optional[str]
    sort_order: int
    is_active: bool

    class Config:
        from_attributes = True


class ServiceCreate(BaseModel):
    title: str
    short_desc: Optional[str] = None
    full_desc: Optional[str] = None
    icon_name: Optional[str] = None
    category: str = "core"
    features: Optional[List[str]] = None
    tag: Optional[str] = None
    sort_order: int = 0


class ServiceUpdate(BaseModel):
    title: Optional[str] = None
    short_desc: Optional[str] = None
    full_desc: Optional[str] = None
    icon_name: Optional[str] = None
    category: Optional[str] = None
    features: Optional[List[str]] = None
    tag: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None

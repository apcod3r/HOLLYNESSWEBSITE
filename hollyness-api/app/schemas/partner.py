from pydantic import BaseModel
from typing import Optional


class PartnerOut(BaseModel):
    id: int
    name: str
    logo_url: Optional[str]
    description: Optional[str]
    website_url: Optional[str]
    sort_order: int
    is_active: bool

    class Config:
        from_attributes = True


class PartnerCreate(BaseModel):
    name: str
    logo_url: Optional[str] = None
    description: Optional[str] = None
    website_url: Optional[str] = None
    sort_order: int = 0


class PartnerUpdate(BaseModel):
    name: Optional[str] = None
    logo_url: Optional[str] = None
    description: Optional[str] = None
    website_url: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None

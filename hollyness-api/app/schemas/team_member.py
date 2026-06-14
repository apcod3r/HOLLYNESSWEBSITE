from pydantic import BaseModel
from typing import Optional


class TeamMemberOut(BaseModel):
    id: int
    name: str
    role: Optional[str]
    department: Optional[str]
    bio: Optional[str]
    education: Optional[str]
    joined_year: Optional[str]
    photo_url: Optional[str]
    sort_order: int
    is_active: bool

    class Config:
        from_attributes = True


class TeamMemberCreate(BaseModel):
    name: str
    role: Optional[str] = None
    department: Optional[str] = None
    bio: Optional[str] = None
    education: Optional[str] = None
    joined_year: Optional[str] = None
    photo_url: Optional[str] = None
    sort_order: int = 0


class TeamMemberUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    department: Optional[str] = None
    bio: Optional[str] = None
    education: Optional[str] = None
    joined_year: Optional[str] = None
    photo_url: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None

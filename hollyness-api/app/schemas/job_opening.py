from pydantic import BaseModel
from typing import Optional, List


class JobOpeningOut(BaseModel):
    id: int
    title: str
    department: Optional[str]
    location: Optional[str]
    job_type: str
    summary: Optional[str]
    requirements: Optional[List[str]]
    is_active: bool

    class Config:
        from_attributes = True


class JobOpeningCreate(BaseModel):
    title: str
    department: Optional[str] = None
    location: Optional[str] = None
    job_type: str = "Full-time"
    summary: Optional[str] = None
    requirements: Optional[List[str]] = None


class JobOpeningUpdate(BaseModel):
    title: Optional[str] = None
    department: Optional[str] = None
    location: Optional[str] = None
    job_type: Optional[str] = None
    summary: Optional[str] = None
    requirements: Optional[List[str]] = None
    is_active: Optional[bool] = None

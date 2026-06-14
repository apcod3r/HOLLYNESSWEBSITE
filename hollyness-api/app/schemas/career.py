from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime
from typing import Optional
from app.models.career import ApplicationStatus
import re


class CareerApplicationCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    position: str
    cover_letter: str

    @field_validator("name")
    @classmethod
    def name_min_length(cls, v: str) -> str:
        if len(v.strip()) < 2:
            raise ValueError("Name must be at least 2 characters")
        return v.strip()

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: Optional[str]) -> Optional[str]:
        if v and not re.match(r"^[+]?[\d\s\-()]{7,15}$", v.strip()):
            raise ValueError("Invalid phone number format")
        return v

    @field_validator("cover_letter")
    @classmethod
    def cover_letter_min_length(cls, v: str) -> str:
        if len(v.strip()) < 30:
            raise ValueError("Cover letter must be at least 30 characters")
        return v.strip()


class CareerApplicationOut(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str]
    position: str
    cover_letter: str
    status: ApplicationStatus
    created_at: datetime

    class Config:
        from_attributes = True


class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus

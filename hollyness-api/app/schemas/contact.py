from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime
from typing import Optional
from app.models.contact import ContactStatus
import re


class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    organization: Optional[str] = None
    service: str
    message: str

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

    @field_validator("message")
    @classmethod
    def message_min_length(cls, v: str) -> str:
        if len(v.strip()) < 20:
            raise ValueError("Message must be at least 20 characters")
        return v.strip()


class ContactOut(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str]
    organization: Optional[str]
    service: str
    message: str
    status: ContactStatus
    created_at: datetime

    class Config:
        from_attributes = True


class ContactStatusUpdate(BaseModel):
    status: ContactStatus

from pydantic import BaseModel
from typing import Optional


class SettingOut(BaseModel):
    id: int
    key: str
    value: Optional[str]
    category: str
    label: Optional[str]

    class Config:
        from_attributes = True


class SettingUpdate(BaseModel):
    value: Optional[str] = None
    label: Optional[str] = None

from pydantic import BaseModel
from typing import Optional, List


class ProcessStepOut(BaseModel):
    id: int
    step_number: int
    title: str
    subtitle: Optional[str]
    description: Optional[str]
    what_you_provide: Optional[List[str]]
    outcome: Optional[str]
    duration: Optional[str]
    icon_name: Optional[str]
    is_active: bool

    class Config:
        from_attributes = True


class ProcessStepCreate(BaseModel):
    step_number: int
    title: str
    subtitle: Optional[str] = None
    description: Optional[str] = None
    what_you_provide: Optional[List[str]] = None
    outcome: Optional[str] = None
    duration: Optional[str] = None
    icon_name: Optional[str] = None


class ProcessStepUpdate(BaseModel):
    step_number: Optional[int] = None
    title: Optional[str] = None
    subtitle: Optional[str] = None
    description: Optional[str] = None
    what_you_provide: Optional[List[str]] = None
    outcome: Optional[str] = None
    duration: Optional[str] = None
    icon_name: Optional[str] = None
    is_active: Optional[bool] = None

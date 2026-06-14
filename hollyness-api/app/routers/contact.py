from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.contact import ContactInquiry
from app.schemas.contact import ContactCreate, ContactOut
from pydantic import BaseModel

router = APIRouter(prefix="/contact", tags=["Contact"])


class SuccessResponse(BaseModel):
    message: str


@router.post("", response_model=SuccessResponse, status_code=status.HTTP_201_CREATED)
def submit_contact(payload: ContactCreate, request: Request, db: Session = Depends(get_db)):
    ip = request.client.host if request.client else None
    inquiry = ContactInquiry(**payload.model_dump(), ip_address=ip)
    db.add(inquiry)
    db.commit()
    return SuccessResponse(message="Your message has been received. We will respond within 24 hours.")

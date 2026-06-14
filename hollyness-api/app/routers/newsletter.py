from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.newsletter import NewsletterSubscriber
from app.schemas.newsletter import NewsletterSubscribe
from pydantic import BaseModel

router = APIRouter(prefix="/newsletter", tags=["Newsletter"])


class SuccessResponse(BaseModel):
    message: str


@router.post("/subscribe", response_model=SuccessResponse, status_code=status.HTTP_201_CREATED)
def subscribe(payload: NewsletterSubscribe, db: Session = Depends(get_db)):
    existing = db.query(NewsletterSubscriber).filter(NewsletterSubscriber.email == payload.email).first()
    if existing:
        if not existing.is_active:
            existing.is_active = True
            db.commit()
            return SuccessResponse(message="Welcome back! You have been re-subscribed.")
        return SuccessResponse(message="You are already subscribed.")
    subscriber = NewsletterSubscriber(email=payload.email)
    db.add(subscriber)
    db.commit()
    return SuccessResponse(message="Thank you for subscribing to our newsletter.")

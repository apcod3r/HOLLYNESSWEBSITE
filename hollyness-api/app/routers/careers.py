from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.career import CareerApplication
from app.schemas.career import CareerApplicationCreate
from pydantic import BaseModel

router = APIRouter(prefix="/careers", tags=["Careers"])


class SuccessResponse(BaseModel):
    message: str


@router.post("/apply", response_model=SuccessResponse, status_code=status.HTTP_201_CREATED)
def submit_application(payload: CareerApplicationCreate, db: Session = Depends(get_db)):
    application = CareerApplication(**payload.model_dump())
    db.add(application)
    db.commit()
    return SuccessResponse(message="Application received. Shortlisted candidates will be contacted within 7 business days.")

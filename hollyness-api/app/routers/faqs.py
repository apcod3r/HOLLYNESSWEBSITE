from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.faq import FAQ
from app.schemas.faq import FAQOut, FAQCreate, FAQUpdate
from app.auth.dependencies import require_admin
from app.models.user import User

router = APIRouter(prefix="/faqs", tags=["FAQs"])


@router.get("", response_model=List[FAQOut])
def list_faqs(db: Session = Depends(get_db)):
    return db.query(FAQ).filter(FAQ.is_published == True).order_by(FAQ.category, FAQ.sort_order).all()


@router.post("", response_model=FAQOut, status_code=status.HTTP_201_CREATED)
def create_faq(payload: FAQCreate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    faq = FAQ(**payload.model_dump())
    db.add(faq)
    db.commit()
    db.refresh(faq)
    return faq


@router.patch("/{faq_id}", response_model=FAQOut)
def update_faq(faq_id: int, payload: FAQUpdate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    faq = db.query(FAQ).filter(FAQ.id == faq_id).first()
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(faq, field, value)
    db.commit()
    db.refresh(faq)
    return faq


@router.delete("/{faq_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_faq(faq_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    faq = db.query(FAQ).filter(FAQ.id == faq_id).first()
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")
    db.delete(faq)
    db.commit()

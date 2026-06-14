from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.industry import Industry
from app.schemas.industry import IndustryOut, IndustryCreate, IndustryUpdate
from app.auth.dependencies import require_admin
from app.models.user import User

router = APIRouter(prefix="/industries", tags=["Industries"])


@router.get("", response_model=List[IndustryOut])
def list_industries(db: Session = Depends(get_db)):
    return db.query(Industry).filter(Industry.is_active == True).order_by(Industry.sort_order).all()


@router.get("/all", response_model=List[IndustryOut])
def list_all_industries(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return db.query(Industry).order_by(Industry.sort_order).all()


@router.post("", response_model=IndustryOut, status_code=status.HTTP_201_CREATED)
def create_industry(payload: IndustryCreate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    ind = Industry(**payload.model_dump())
    db.add(ind)
    db.commit()
    db.refresh(ind)
    return ind


@router.patch("/{ind_id}", response_model=IndustryOut)
def update_industry(ind_id: int, payload: IndustryUpdate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    ind = db.query(Industry).filter(Industry.id == ind_id).first()
    if not ind:
        raise HTTPException(status_code=404, detail="Industry not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(ind, field, value)
    db.commit()
    db.refresh(ind)
    return ind


@router.delete("/{ind_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_industry(ind_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    ind = db.query(Industry).filter(Industry.id == ind_id).first()
    if not ind:
        raise HTTPException(status_code=404, detail="Industry not found")
    db.delete(ind)
    db.commit()

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.service import Service
from app.schemas.service import ServiceOut, ServiceCreate, ServiceUpdate
from app.auth.dependencies import require_admin
from app.models.user import User

router = APIRouter(prefix="/services", tags=["Services"])


@router.get("", response_model=List[ServiceOut])
def list_services(db: Session = Depends(get_db)):
    return db.query(Service).filter(Service.is_active == True).order_by(Service.sort_order).all()


@router.get("/all", response_model=List[ServiceOut])
def list_all_services(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return db.query(Service).order_by(Service.sort_order).all()


@router.post("", response_model=ServiceOut, status_code=status.HTTP_201_CREATED)
def create_service(payload: ServiceCreate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    svc = Service(**payload.model_dump())
    db.add(svc)
    db.commit()
    db.refresh(svc)
    return svc


@router.patch("/{svc_id}", response_model=ServiceOut)
def update_service(svc_id: int, payload: ServiceUpdate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    svc = db.query(Service).filter(Service.id == svc_id).first()
    if not svc:
        raise HTTPException(status_code=404, detail="Service not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(svc, field, value)
    db.commit()
    db.refresh(svc)
    return svc


@router.delete("/{svc_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_service(svc_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    svc = db.query(Service).filter(Service.id == svc_id).first()
    if not svc:
        raise HTTPException(status_code=404, detail="Service not found")
    db.delete(svc)
    db.commit()

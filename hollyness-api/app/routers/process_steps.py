from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.process_step import ProcessStep
from app.schemas.process_step import ProcessStepOut, ProcessStepCreate, ProcessStepUpdate
from app.auth.dependencies import require_admin
from app.models.user import User

router = APIRouter(prefix="/process", tags=["Process"])


@router.get("", response_model=List[ProcessStepOut])
def list_steps(db: Session = Depends(get_db)):
    return db.query(ProcessStep).filter(ProcessStep.is_active == True).order_by(ProcessStep.step_number).all()


@router.get("/all", response_model=List[ProcessStepOut])
def list_all_steps(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return db.query(ProcessStep).order_by(ProcessStep.step_number).all()


@router.post("", response_model=ProcessStepOut, status_code=status.HTTP_201_CREATED)
def create_step(payload: ProcessStepCreate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    step = ProcessStep(**payload.model_dump())
    db.add(step)
    db.commit()
    db.refresh(step)
    return step


@router.patch("/{step_id}", response_model=ProcessStepOut)
def update_step(step_id: int, payload: ProcessStepUpdate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    step = db.query(ProcessStep).filter(ProcessStep.id == step_id).first()
    if not step:
        raise HTTPException(status_code=404, detail="Step not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(step, field, value)
    db.commit()
    db.refresh(step)
    return step


@router.delete("/{step_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_step(step_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    step = db.query(ProcessStep).filter(ProcessStep.id == step_id).first()
    if not step:
        raise HTTPException(status_code=404, detail="Step not found")
    db.delete(step)
    db.commit()

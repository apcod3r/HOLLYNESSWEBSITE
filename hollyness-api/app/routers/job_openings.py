from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.job_opening import JobOpening
from app.schemas.job_opening import JobOpeningOut, JobOpeningCreate, JobOpeningUpdate
from app.auth.dependencies import require_admin
from app.models.user import User

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.get("", response_model=List[JobOpeningOut])
def list_jobs(db: Session = Depends(get_db)):
    return db.query(JobOpening).filter(JobOpening.is_active == True).order_by(JobOpening.id).all()


@router.get("/all", response_model=List[JobOpeningOut])
def list_all_jobs(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return db.query(JobOpening).order_by(JobOpening.id).all()


@router.post("", response_model=JobOpeningOut, status_code=status.HTTP_201_CREATED)
def create_job(payload: JobOpeningCreate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    job = JobOpening(**payload.model_dump())
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


@router.patch("/{job_id}", response_model=JobOpeningOut)
def update_job(job_id: int, payload: JobOpeningUpdate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    job = db.query(JobOpening).filter(JobOpening.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job opening not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(job, field, value)
    db.commit()
    db.refresh(job)
    return job


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(job_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    job = db.query(JobOpening).filter(JobOpening.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job opening not found")
    db.delete(job)
    db.commit()

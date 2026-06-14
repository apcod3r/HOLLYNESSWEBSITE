import uuid
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.testimonial import Testimonial
from app.schemas.testimonial import TestimonialOut, TestimonialCreate, TestimonialUpdate
from app.auth.dependencies import require_admin
from app.models.user import User

router = APIRouter(prefix="/testimonials", tags=["Testimonials"])

UPLOAD_DIR = Path(__file__).parent.parent.parent.parent / "uploads" / "testimonials"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}


def _remove_file(url_path: str | None) -> None:
    if not url_path:
        return
    filename = url_path.split("/")[-1]
    target = UPLOAD_DIR / filename
    if target.exists():
        target.unlink()


@router.get("", response_model=List[TestimonialOut])
def list_testimonials(db: Session = Depends(get_db)):
    return db.query(Testimonial).filter(Testimonial.is_published == True).order_by(Testimonial.id.desc()).all()


@router.post("", response_model=TestimonialOut, status_code=status.HTTP_201_CREATED)
def create_testimonial(payload: TestimonialCreate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    t = Testimonial(**payload.model_dump())
    db.add(t)
    db.commit()
    db.refresh(t)
    return t


@router.patch("/{testimonial_id}", response_model=TestimonialOut)
def update_testimonial(testimonial_id: int, payload: TestimonialUpdate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    t = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(t, field, value)
    db.commit()
    db.refresh(t)
    return t


@router.post("/{testimonial_id}/photo", response_model=TestimonialOut)
async def upload_photo(
    testimonial_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    t = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Invalid file type")
    _remove_file(t.photo_url)
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else "jpg"
    filename = f"{testimonial_id}_{uuid.uuid4().hex}.{ext}"
    (UPLOAD_DIR / filename).write_bytes(await file.read())
    t.photo_url = f"/uploads/testimonials/{filename}"
    db.commit()
    db.refresh(t)
    return t


@router.delete("/{testimonial_id}/photo", response_model=TestimonialOut)
def remove_photo(testimonial_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    t = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    _remove_file(t.photo_url)
    t.photo_url = None
    db.commit()
    db.refresh(t)
    return t


@router.delete("/{testimonial_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_testimonial(testimonial_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    t = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    _remove_file(t.photo_url)
    db.delete(t)
    db.commit()

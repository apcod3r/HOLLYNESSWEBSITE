import uuid
import shutil
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.partner import Partner
from app.schemas.partner import PartnerOut, PartnerCreate, PartnerUpdate
from app.auth.dependencies import require_admin
from app.models.user import User

router = APIRouter(prefix="/partners", tags=["Partners"])

UPLOAD_DIR = Path(__file__).parent.parent.parent.parent / "uploads" / "partners"
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"}


def _remove_file(url_path: str) -> None:
    file_path = Path(__file__).parent.parent.parent.parent / url_path.lstrip("/")
    if file_path.exists():
        file_path.unlink()


@router.get("", response_model=List[PartnerOut])
def list_partners(db: Session = Depends(get_db)):
    return db.query(Partner).filter(Partner.is_active == True).order_by(Partner.sort_order).all()


@router.get("/all", response_model=List[PartnerOut])
def list_all_partners(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return db.query(Partner).order_by(Partner.sort_order).all()


@router.post("", response_model=PartnerOut, status_code=status.HTTP_201_CREATED)
def create_partner(payload: PartnerCreate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    partner = Partner(**payload.model_dump())
    db.add(partner)
    db.commit()
    db.refresh(partner)
    return partner


@router.patch("/{partner_id}", response_model=PartnerOut)
def update_partner(partner_id: int, payload: PartnerUpdate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    partner = db.query(Partner).filter(Partner.id == partner_id).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(partner, field, value)
    db.commit()
    db.refresh(partner)
    return partner


@router.delete("/{partner_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_partner(partner_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    partner = db.query(Partner).filter(Partner.id == partner_id).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    if partner.logo_url:
        _remove_file(partner.logo_url)
    db.delete(partner)
    db.commit()


@router.post("/{partner_id}/logo", response_model=PartnerOut)
async def upload_partner_logo(
    partner_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    partner = db.query(Partner).filter(Partner.id == partner_id).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, WebP, GIF or SVG allowed")

    ext = Path(file.filename or "logo.png").suffix.lower() or ".png"
    filename = f"{partner_id}_{uuid.uuid4().hex}{ext}"
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    dest = UPLOAD_DIR / filename
    with dest.open("wb") as out:
        shutil.copyfileobj(file.file, out)

    if partner.logo_url:
        _remove_file(partner.logo_url)

    partner.logo_url = f"/uploads/partners/{filename}"
    db.commit()
    db.refresh(partner)
    return partner


@router.delete("/{partner_id}/logo", response_model=PartnerOut)
def remove_partner_logo(
    partner_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    partner = db.query(Partner).filter(Partner.id == partner_id).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    if partner.logo_url:
        _remove_file(partner.logo_url)
    partner.logo_url = None
    db.commit()
    db.refresh(partner)
    return partner

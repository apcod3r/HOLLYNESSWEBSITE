import uuid
import shutil
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.team_member import TeamMember
from app.schemas.team_member import TeamMemberOut, TeamMemberCreate, TeamMemberUpdate
from app.auth.dependencies import require_admin
from app.models.user import User

router = APIRouter(prefix="/team", tags=["Team"])

UPLOAD_DIR = Path(__file__).parent.parent.parent.parent / "uploads" / "team"
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}


def _remove_file(url_path: str) -> None:
    file_path = Path(__file__).parent.parent.parent.parent / url_path.lstrip("/")
    if file_path.exists():
        file_path.unlink()


@router.get("", response_model=List[TeamMemberOut])
def list_team(db: Session = Depends(get_db)):
    return db.query(TeamMember).filter(TeamMember.is_active == True).order_by(TeamMember.sort_order).all()


@router.get("/all", response_model=List[TeamMemberOut])
def list_all_team(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return db.query(TeamMember).order_by(TeamMember.sort_order).all()


@router.post("", response_model=TeamMemberOut, status_code=status.HTTP_201_CREATED)
def create_member(payload: TeamMemberCreate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    member = TeamMember(**payload.model_dump())
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


@router.patch("/{member_id}", response_model=TeamMemberOut)
def update_member(member_id: int, payload: TeamMemberUpdate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    member = db.query(TeamMember).filter(TeamMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(member, field, value)
    db.commit()
    db.refresh(member)
    return member


@router.delete("/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_member(member_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    member = db.query(TeamMember).filter(TeamMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    if member.photo_url:
        _remove_file(member.photo_url)
    db.delete(member)
    db.commit()


@router.post("/{member_id}/image", response_model=TeamMemberOut)
async def upload_member_photo(
    member_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    member = db.query(TeamMember).filter(TeamMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, WebP or GIF allowed")

    ext = Path(file.filename or "photo.jpg").suffix.lower() or ".jpg"
    filename = f"{member_id}_{uuid.uuid4().hex}{ext}"
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    dest = UPLOAD_DIR / filename
    with dest.open("wb") as out:
        shutil.copyfileobj(file.file, out)

    if member.photo_url:
        _remove_file(member.photo_url)

    member.photo_url = f"/uploads/team/{filename}"
    db.commit()
    db.refresh(member)
    return member


@router.delete("/{member_id}/image", response_model=TeamMemberOut)
def remove_member_photo(
    member_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    member = db.query(TeamMember).filter(TeamMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    if member.photo_url:
        _remove_file(member.photo_url)
    member.photo_url = None
    db.commit()
    db.refresh(member)
    return member

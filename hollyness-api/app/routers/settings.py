import uuid
import shutil
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import Dict, List
from app.database import get_db
from app.models.setting import SiteSetting
from app.schemas.setting import SettingOut, SettingUpdate
from app.auth.dependencies import require_admin
from app.models.user import User

router = APIRouter(prefix="/settings", tags=["Settings"])

HERO_UPLOAD_DIR = Path(__file__).parent.parent.parent.parent / "uploads" / "hero"
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}


def _remove_file(url_path: str) -> None:
    file_path = Path(__file__).parent.parent.parent.parent / url_path.lstrip("/")
    if file_path.exists():
        file_path.unlink()


@router.get("", response_model=Dict[str, str])
def get_settings(db: Session = Depends(get_db)):
    rows = db.query(SiteSetting).all()
    return {r.key: (r.value or "") for r in rows}


@router.get("/all", response_model=List[SettingOut])
def get_all_settings(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return db.query(SiteSetting).order_by(SiteSetting.category, SiteSetting.key).all()


@router.patch("/{key}", response_model=SettingOut)
def update_setting(key: str, payload: SettingUpdate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    setting = db.query(SiteSetting).filter(SiteSetting.key == key).first()
    if not setting:
        raise HTTPException(status_code=404, detail="Setting not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(setting, field, value)
    db.commit()
    db.refresh(setting)
    return setting


@router.post("/hero-image", response_model=SettingOut)
async def upload_hero_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, WebP or GIF allowed")

    ext = Path(file.filename or "hero.jpg").suffix.lower() or ".jpg"
    filename = f"hero_{uuid.uuid4().hex}{ext}"
    HERO_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    dest = HERO_UPLOAD_DIR / filename
    with dest.open("wb") as out:
        shutil.copyfileobj(file.file, out)

    setting = db.query(SiteSetting).filter(SiteSetting.key == "hero_bg_image").first()
    if setting:
        if setting.value:
            _remove_file(setting.value)
        setting.value = f"/uploads/hero/{filename}"
    else:
        setting = SiteSetting(
            key="hero_bg_image",
            value=f"/uploads/hero/{filename}",
            category="general",
            label="Hero Background Image",
        )
        db.add(setting)
    db.commit()
    db.refresh(setting)
    return setting


@router.delete("/hero-image", response_model=SettingOut)
def remove_hero_image(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    setting = db.query(SiteSetting).filter(SiteSetting.key == "hero_bg_image").first()
    if not setting:
        raise HTTPException(status_code=404, detail="No hero image set")
    if setting.value:
        _remove_file(setting.value)
    setting.value = ""
    db.commit()
    db.refresh(setting)
    return setting

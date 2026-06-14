import uuid
import shutil
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.blog import BlogPost
from app.schemas.blog import BlogPostOut, BlogPostCreate, BlogPostUpdate, slugify
from app.auth.dependencies import require_admin
from app.models.user import User

UPLOAD_DIR = Path(__file__).parent.parent.parent.parent / "uploads" / "blog"
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}

router = APIRouter(prefix="/blog", tags=["Blog"])


@router.get("/posts", response_model=List[BlogPostOut])
def list_posts(
    category: Optional[str] = None,
    featured: Optional[bool] = None,
    db: Session = Depends(get_db),
):
    q = db.query(BlogPost).filter(BlogPost.is_published == True)
    if category:
        q = q.filter(BlogPost.category == category)
    if featured is not None:
        q = q.filter(BlogPost.is_featured == featured)
    return q.order_by(BlogPost.published_at.desc()).all()


@router.get("/posts/{slug}", response_model=BlogPostOut)
def get_post(slug: str, db: Session = Depends(get_db)):
    post = db.query(BlogPost).filter(BlogPost.slug == slug, BlogPost.is_published == True).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


# ── Admin endpoints ──────────────────────────────────────────────────────────
@router.post("/posts", response_model=BlogPostOut, status_code=status.HTTP_201_CREATED)
def create_post(payload: BlogPostCreate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    slug = slugify(payload.title)
    existing = db.query(BlogPost).filter(BlogPost.slug == slug).first()
    if existing:
        slug = f"{slug}-{db.query(BlogPost).count()}"
    post = BlogPost(**payload.model_dump(), slug=slug)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.patch("/posts/{post_id}", response_model=BlogPostOut)
def update_post(post_id: int, payload: BlogPostUpdate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(post, field, value)
    db.commit()
    db.refresh(post)
    return post


@router.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(post_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.cover_image:
        _remove_file(post.cover_image)
    db.delete(post)
    db.commit()


def _remove_file(url_path: str) -> None:
    file_path = Path(__file__).parent.parent.parent.parent / url_path.lstrip("/")
    if file_path.exists():
        file_path.unlink()


@router.post("/posts/{post_id}/image", response_model=BlogPostOut)
async def upload_post_image(
    post_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, WebP or GIF allowed")

    ext = Path(file.filename or "image.jpg").suffix.lower() or ".jpg"
    filename = f"{post_id}_{uuid.uuid4().hex}{ext}"
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    dest = UPLOAD_DIR / filename
    with dest.open("wb") as out:
        shutil.copyfileobj(file.file, out)

    if post.cover_image:
        _remove_file(post.cover_image)

    post.cover_image = f"/uploads/blog/{filename}"
    db.commit()
    db.refresh(post)
    return post


@router.delete("/posts/{post_id}/image", response_model=BlogPostOut)
def remove_post_image(
    post_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.cover_image:
        _remove_file(post.cover_image)
    post.cover_image = None
    db.commit()
    db.refresh(post)
    return post

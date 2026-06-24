from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import bcrypt
from app.database import get_db
from app.models.contact import ContactInquiry
from app.models.career import CareerApplication
from app.models.newsletter import NewsletterSubscriber
from app.models.blog import BlogPost
from app.models.faq import FAQ
from app.models.testimonial import Testimonial
from app.models.user import User
from app.schemas.contact import ContactOut, ContactStatusUpdate
from app.schemas.career import CareerApplicationOut, ApplicationStatusUpdate
from app.schemas.newsletter import NewsletterOut
from app.schemas.blog import BlogPostOut
from app.schemas.faq import FAQOut
from app.schemas.testimonial import TestimonialOut
from app.schemas.user import UserOut
from app.auth.dependencies import require_admin
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/admin", tags=["Admin"])


# ── Dashboard summary ────────────────────────────────────────────────────────
@router.get("/summary")
def dashboard_summary(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return {
        "contacts":              db.query(ContactInquiry).count(),
        "new_contacts":          db.query(ContactInquiry).filter(ContactInquiry.status == "new").count(),
        "applications":          db.query(CareerApplication).count(),
        "new_applications":      db.query(CareerApplication).filter(CareerApplication.status == "received").count(),
        "subscribers":           db.query(NewsletterSubscriber).filter(NewsletterSubscriber.is_active == True).count(),
        "blog_posts":            db.query(BlogPost).count(),
        "published_posts":       db.query(BlogPost).filter(BlogPost.is_published == True).count(),
        "testimonials":          db.query(Testimonial).count(),
        "published_testimonials": db.query(Testimonial).filter(Testimonial.is_published == True).count(),
        "faqs":                  db.query(FAQ).count(),
        "published_faqs":        db.query(FAQ).filter(FAQ.is_published == True).count(),
    }


# ── Contact inquiries ────────────────────────────────────────────────────────
@router.get("/contacts", response_model=List[ContactOut])
def list_contacts(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return db.query(ContactInquiry).order_by(ContactInquiry.created_at.desc()).all()


@router.patch("/contacts/{contact_id}/status", response_model=ContactOut)
def update_contact_status(
    contact_id: int, payload: ContactStatusUpdate,
    db: Session = Depends(get_db), _: User = Depends(require_admin)
):
    inquiry = db.query(ContactInquiry).filter(ContactInquiry.id == contact_id).first()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Contact inquiry not found")
    inquiry.status = payload.status
    db.commit()
    db.refresh(inquiry)
    return inquiry


@router.delete("/contacts/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact(contact_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    inquiry = db.query(ContactInquiry).filter(ContactInquiry.id == contact_id).first()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Contact inquiry not found")
    db.delete(inquiry)
    db.commit()


# ── Career applications ──────────────────────────────────────────────────────
@router.get("/careers", response_model=List[CareerApplicationOut])
def list_applications(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return db.query(CareerApplication).order_by(CareerApplication.created_at.desc()).all()


@router.patch("/careers/{app_id}/status", response_model=CareerApplicationOut)
def update_application_status(
    app_id: int, payload: ApplicationStatusUpdate,
    db: Session = Depends(get_db), _: User = Depends(require_admin)
):
    app = db.query(CareerApplication).filter(CareerApplication.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    app.status = payload.status
    db.commit()
    db.refresh(app)
    return app


@router.delete("/careers/{app_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(app_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    app = db.query(CareerApplication).filter(CareerApplication.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    db.delete(app)
    db.commit()


# ── Newsletter subscribers ───────────────────────────────────────────────────
@router.get("/newsletter", response_model=List[NewsletterOut])
def list_subscribers(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return db.query(NewsletterSubscriber).order_by(NewsletterSubscriber.created_at.desc()).all()


@router.patch("/newsletter/{sub_id}/toggle", response_model=NewsletterOut)
def toggle_subscriber(sub_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    sub = db.query(NewsletterSubscriber).filter(NewsletterSubscriber.id == sub_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subscriber not found")
    sub.is_active = not sub.is_active
    db.commit()
    db.refresh(sub)
    return sub


# ── Blog (admin: all posts including drafts) ─────────────────────────────────
@router.get("/blog", response_model=List[BlogPostOut])
def list_all_posts(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return db.query(BlogPost).order_by(BlogPost.created_at.desc()).all()


# ── FAQs (admin: all including unpublished) ──────────────────────────────────
@router.get("/faqs", response_model=List[FAQOut])
def list_all_faqs(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return db.query(FAQ).order_by(FAQ.category, FAQ.sort_order).all()


# ── Testimonials (admin: all including unpublished) ──────────────────────────
@router.get("/testimonials", response_model=List[TestimonialOut])
def list_all_testimonials(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return db.query(Testimonial).order_by(Testimonial.id.desc()).all()


# ── Admin users ──────────────────────────────────────────────────────────────
class AdminUserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    is_admin: bool = True


@router.get("/users", response_model=List[UserOut])
def list_users(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return db.query(User).filter(User.is_superuser == False).order_by(User.created_at.desc()).all()


@router.post("/users", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_admin_user(
    payload: AdminUserCreate,
    db: Session = Depends(get_db), _: User = Depends(require_admin)
):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = bcrypt.hashpw(payload.password.encode(), bcrypt.gensalt()).decode()
    user = User(
        email=payload.email, full_name=payload.full_name,
        hashed_password=hashed, is_active=True, is_admin=payload.is_admin
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.patch("/users/{user_id}/toggle", response_model=UserOut)
def toggle_user_active(
    user_id: int,
    db: Session = Depends(get_db), current: User = Depends(require_admin)
):
    if user_id == current.id:
        raise HTTPException(status_code=400, detail="Cannot deactivate your own account")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.is_superuser:
        raise HTTPException(status_code=403, detail="Superuser accounts cannot be modified")
    user.is_active = not user.is_active
    db.commit()
    db.refresh(user)
    return user


class AdminUserUpdate(BaseModel):
    full_name: str | None = None
    email: EmailStr | None = None
    password: str | None = None
    is_admin: bool | None = None


@router.patch("/users/{user_id}", response_model=UserOut)
def update_admin_user(
    user_id: int,
    payload: AdminUserUpdate,
    db: Session = Depends(get_db), current: User = Depends(require_admin)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.is_superuser:
        raise HTTPException(status_code=403, detail="Superuser accounts cannot be modified")
    if payload.email is not None and payload.email != user.email:
        if db.query(User).filter(User.email == payload.email).first():
            raise HTTPException(status_code=400, detail="Email already in use")
        user.email = payload.email
    if payload.full_name is not None:
        user.full_name = payload.full_name
    if payload.password is not None:
        if len(payload.password) < 8:
            raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
        user.hashed_password = bcrypt.hashpw(payload.password.encode(), bcrypt.gensalt()).decode()
    if payload.is_admin is not None and user_id != current.id:
        user.is_admin = payload.is_admin
    db.commit()
    db.refresh(user)
    return user


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_admin_user(
    user_id: int,
    db: Session = Depends(get_db), current: User = Depends(require_admin)
):
    if user_id == current.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.is_superuser:
        raise HTTPException(status_code=403, detail="Superuser accounts cannot be deleted")
    db.delete(user)
    db.commit()

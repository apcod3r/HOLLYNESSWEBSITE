from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path
from app.config import settings
from app.database import Base, engine
from app.routers import auth, contact, careers, newsletter, blog, testimonials, faqs, admin
from app.routers import settings as settings_router, services, team_members, industries, job_openings, process_steps, partners

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Hollyness & Respishers API",
    description="Backend API for Hollyness & Respishers Company Limited website",
    version="1.0.0",
)

_origins = {settings.FRONTEND_URL, "http://localhost:5173", "http://localhost:4173"}
# Also allow www. variant automatically
if settings.FRONTEND_URL.startswith("https://"):
    _origins.add(settings.FRONTEND_URL.replace("https://", "https://www."))

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(_origins),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,         prefix="/api")
app.include_router(contact.router,      prefix="/api")
app.include_router(careers.router,      prefix="/api")
app.include_router(newsletter.router,   prefix="/api")
app.include_router(blog.router,         prefix="/api")
app.include_router(testimonials.router, prefix="/api")
app.include_router(faqs.router,         prefix="/api")
app.include_router(admin.router,        prefix="/api")
app.include_router(settings_router.router, prefix="/api")
app.include_router(services.router,     prefix="/api")
app.include_router(team_members.router, prefix="/api")
app.include_router(industries.router,   prefix="/api")
app.include_router(job_openings.router, prefix="/api")
app.include_router(process_steps.router, prefix="/api")
app.include_router(partners.router,     prefix="/api")


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "Hollyness & Respishers API"}


# --- Upload directory ---
_UPLOADS = Path(__file__).parent.parent.parent / "uploads"
_UPLOADS.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(_UPLOADS)), name="uploads")

# --- SPA static file serving (production) ---
_DIST = Path(__file__).parent.parent.parent / "hollyness-web" / "dist"

_ASSETS = _DIST / "assets"
if _ASSETS.exists():
    app.mount("/assets", StaticFiles(directory=str(_ASSETS)), name="assets")


@app.get("/{full_path:path}", include_in_schema=False)
async def serve_spa(full_path: str):
    if _DIST.exists():
        requested = _DIST / full_path
        if requested.exists() and requested.is_file():
            return FileResponse(str(requested))
        index = _DIST / "index.html"
        if index.exists():
            return FileResponse(str(index))
    raise HTTPException(
        status_code=503,
        detail="Frontend not built. Run: cd hollyness-web && npm run build",
    )

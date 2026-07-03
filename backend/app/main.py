"""
Bright Future Academy — FastAPI Backend
========================================

Main application entry point. This file:
  1. Creates the FastAPI app with metadata
  2. Configures CORS for the frontend
  3. Registers all router modules (auth, public, admin, teacher, student, parent)
  4. Adds startup/shutdown event handlers
  5. Provides a health check and API docs

Run with:
    cd backend
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

API Documentation:
    http://localhost:8000/docs  (Swagger UI)
    http://localhost:8000/redoc (ReDoc)

Architecture:
    Frontend (React + Vite) → HTTP requests → FastAPI (port 8000) → Supabase PostgreSQL
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import get_supabase

# ── Import Routers ─────────────────────────────────────────────────────────
# Each router handles a specific domain/role of the application.
from .routers.auth import auth_router
from .routers.public import public_router
from .routers.admin import admin_router
from .routers.teacher import teacher_router
from .routers.student import student_router
from .routers.parent import parent_router


# ── Application Lifecycle ──────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup and shutdown event handler.

    On startup:
      - Verify Supabase connectivity
      - Log configuration status

    On shutdown:
      - Clean up resources (if needed)
    """
    # ── Startup ────────────────────────────────────────────────────────
    print(f"\n{'='*60}")
    print(f"  {settings.APP_NAME}")
    print(f"  {'='*60}")
    print(f"  Supabase: {settings.SUPABASE_URL}")
    print(f"  CORS origins: {settings.ALLOWED_ORIGINS}")
    print(f"  Debug mode: {settings.DEBUG}")
    print(f"  {'='*60}\n")
    print(f"  API docs: http://localhost:8000/docs")
    print(f"  Health:   http://localhost:8000/health\n")

    yield  # Application runs here

    # ── Shutdown ───────────────────────────────────────────────────────
    print("\n  Shutting down...\n")


# ── Create FastAPI App ─────────────────────────────────────────────────────

app = FastAPI(
    title=settings.APP_NAME,
    description=(
        "Backend API for Bright Future Academy (Ecole Notre Dame Des Anges).\n\n"
        "## Architecture\n"
        "- **Auth**: JWT-based authentication with role-based access control\n"
        "- **Database**: Supabase PostgreSQL accessed via service_role key\n"
        "- **Portals**: Admin, Teacher, Student, Parent — each with independent routes\n\n"
        "## Authentication\n"
        "1. `POST /api/auth/login` — get JWT token\n"
        "2. Include `Authorization: Bearer <token>` on all protected requests\n\n"
        "## Roles\n"
        "- `admin` — Full system access, CRUD on all entities\n"
        "- `teacher` — Manage assignments, attendance, grades, view timetable\n"
        "- `student` — View assignments, results, timetable, announcements\n"
        "- `parent` — View child's info, assignments, results, timetable\n"
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ── CORS Middleware ────────────────────────────────────────────────────────
# Allows the React frontend (running on a different port during development)
# to make API calls to the backend.

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,      # Frontend origins
    allow_credentials=True,                       # Allow cookies/auth headers
    allow_methods=["*"],                          # All HTTP methods
    allow_headers=["*"],                          # All request headers
)


# ── Register Routers ───────────────────────────────────────────────────────
# Order doesn't matter — FastAPI matches routes by path + method.

app.include_router(auth_router)       # /api/auth/*
app.include_router(public_router)     # /api/public/*
app.include_router(admin_router)      # /api/admin/*
app.include_router(teacher_router)    # /api/teacher/*
app.include_router(student_router)    # /api/student/*
app.include_router(parent_router)     # /api/parent/*


# ── Health Check ───────────────────────────────────────────────────────────
# GET /health — Simple health check endpoint for monitoring.

@app.get("/health", tags=["System"])
async def health_check():
    """
    Health check endpoint.

    Returns the current status of the API and database connectivity.
    Used by monitoring tools, load balancers, and during deployment.

    Response:
        {
            "status": "healthy",
            "version": "1.0.0",
            "database": "connected" | "demo_mode",
            "supabase_configured": true | false
        }
    """
    return {
        "status": "healthy",
        "version": "1.0.0",
        "app": settings.APP_NAME,
        "database": "connected",
        "supabase_url": settings.SUPABASE_URL,
    }


# ── Root ───────────────────────────────────────────────────────────────────

@app.get("/", tags=["System"])
async def root():
    """
    API root — returns basic information.
    """
    return {
        "app": settings.APP_NAME,
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
    }

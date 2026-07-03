"""
Authentication routes: login, signup, and token operations.

All auth endpoints are public (no JWT required to access them).
The backend authenticates the user against Supabase Auth and issues
its own JWT for subsequent API calls.
"""

from fastapi import APIRouter, HTTPException, Depends
from ..models.auth import (
    LoginRequest,
    SignupRequest,
    CreatePortalUserRequest,
    TokenResponse,
)
from ..dependencies import require_role
from ..services import auth_service
from ..utils.response import success_response

# ── Router ─────────────────────────────────────────────────────────────────
# Prefix: /api/auth
# All routes in this file are under /api/auth/*

auth_router = APIRouter(prefix="/api/auth", tags=["Authentication"])


# ── Login ──────────────────────────────────────────────────────────────────
# POST /api/auth/login
# Accepts email, password, and optional expected_role.
# Returns JWT access token + user profile + redirect path.

@auth_router.post("/login", response_model=dict)
async def login(request: LoginRequest):
    """
    Authenticate a user and return a JWT access token.

    The frontend stores this token and sends it in the Authorization header
    for all subsequent requests.

    If expected_role is provided, the login is rejected if the user's actual
    role doesn't match. This prevents users from accidentally signing into
    the wrong portal (e.g., a student trying /login/admin).

    Request body:
        {
            "email": "admin@bfacademy.ac.ke",
            "password": "secure_password",
            "expected_role": "admin"       // optional
        }

    Response:
        {
            "success": true,
            "data": {
                "access_token": "eyJhbG...",
                "token_type": "bearer",
                "user": { "id": "...", "email": "...", "role": "admin", ... },
                "redirect": "/admin"
            }
        }
    """
    try:
        result = await auth_service.authenticate_user(
            email=request.email,
            password=request.password,
            expected_role=request.expected_role,
        )
        return success_response(data=result, message="Login successful.")
    except ValueError as e:
        raise HTTPException(status_code=401, detail={
            "success": False,
            "error": {"code": "AUTH_FAILED", "message": str(e)}
        })


# ── Signup (Public) ────────────────────────────────────────────────────────
# POST /api/auth/signup
# Creates a new user account and profile.

@auth_router.post("/signup", response_model=dict)
async def signup(request: SignupRequest):
    """
    Register a new user account.

    This endpoint is used for public signups (if enabled) and by the admin
    to create portal accounts. The user is registered in Supabase Auth
    and a profile record is created.

    Request body:
        {
            "email": "teacher@bfacademy.ac.ke",
            "password": "secure_password",
            "full_name": "Mr. David Ochieng",
            "role": "teacher"
        }

    Response:
        {
            "success": true,
            "data": { "id": "...", "email": "...", "role": "teacher", ... },
            "message": "Account created successfully."
        }
    """
    try:
        user = await auth_service.signup_user(
            email=request.email,
            password=request.password,
            full_name=request.full_name,
            role=request.role,
        )
        return success_response(data=user, message="Account created successfully.")
    except ValueError as e:
        raise HTTPException(status_code=400, detail={
            "success": False,
            "error": {"code": "SIGNUP_FAILED", "message": str(e)}
        })


# ── Create Portal Account (Admin Only) ─────────────────────────────────────
# POST /api/auth/portal-account
# Creates a teacher, student, or parent account without hijacking admin session.

@auth_router.post("/portal-account", response_model=dict)
async def create_portal_account(
    request: CreatePortalUserRequest,
    current_user: dict = Depends(require_role("admin")),
):
    """
    Admin-only: create a portal account for a teacher, student, or parent.

    Uses a separate Supabase client that doesn't persist sessions,
    so the admin stays logged in after creating the account.

    This fixes the critical bug where creating a user via supabase.auth.signUp()
    would log the admin out and log them in as the new user.

    Requires: Bearer token with role='admin'.

    Request body:
        {
            "email": "student@bfacademy.ac.ke",
            "password": "secure_password",
            "full_name": "Alice Wanjiku",
            "role": "student"
        }
    """
    try:
        user = await auth_service.create_portal_user(
            email=request.email,
            password=request.password,
            full_name=request.full_name,
            role=request.role,
        )
        return success_response(
            data=user,
            message=f"{request.role.capitalize()} portal account created successfully."
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail={
            "success": False,
            "error": {"code": "PORTAL_ACCOUNT_FAILED", "message": str(e)}
        })


# ── Me / Refresh ───────────────────────────────────────────────────────────
# GET /api/auth/me
# Returns the current user's profile from their JWT.

@auth_router.get("/me", response_model=dict)
async def get_current_user_profile(
    current_user: dict = Depends(require_role),  # any valid role
):
    """
    Return the currently authenticated user's profile.

    Extracts user info from the JWT — no database call needed.
    Useful for the frontend to validate the token and get current user info.

    Requires: Valid Bearer token.
    """
    return success_response(data={
        "id": current_user.get("sub"),
        "email": current_user.get("email"),
        "role": current_user.get("role"),
        "full_name": current_user.get("full_name"),
    })

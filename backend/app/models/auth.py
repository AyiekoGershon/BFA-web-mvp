"""
Auth-related Pydantic models: login, signup, token response.

These define the shape of data coming in (requests) and going out (responses)
for all authentication endpoints.
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal

# Valid roles in the system
RoleType = Literal["admin", "teacher", "student", "parent"]


# ── Request Schemas ───────────────────────────────────────────────────────


class LoginRequest(BaseModel):
    """
    Login request from any portal user.

    Example:
        POST /api/auth/login
        {
            "email": "admin@bfacademy.ac.ke",
            "password": "secure_password",
            "expected_role": "admin"
        }
    """
    email: EmailStr = Field(
        ...,
        description="User's registered email address."
    )
    password: str = Field(
        ...,
        min_length=6,
        description="User's password (min 6 characters)."
    )
    expected_role: Optional[RoleType] = Field(
        default=None,
        description=(
            "Optional: the role the user expects to sign in as. "
            "If provided and the user's actual role doesn't match, login is rejected. "
            "This prevents users from accidentally signing into the wrong portal."
        )
    )


class SignupRequest(BaseModel):
    """
    Signup / registration request. Used by the admin to create portal accounts,
    or by the public signup flow (if enabled).

    Example:
        POST /api/auth/signup
        {
            "email": "teacher@bfacademy.ac.ke",
            "password": "secure_password",
            "full_name": "Mr. David Ochieng",
            "role": "teacher"
        }
    """
    email: EmailStr = Field(..., description="New user's email address.")
    password: str = Field(..., min_length=6, description="Password (min 6 characters).")
    full_name: str = Field(..., min_length=2, description="Full display name.")
    role: RoleType = Field(..., description="Portal role for the new account.")


class CreatePortalUserRequest(BaseModel):
    """
    Admin-only: create a portal account for a teacher, student, or parent.
    Uses a separate Supabase client so the admin's session is not hijacked.

    Example:
        POST /api/admin/portal-accounts
        {
            "email": "student@bfacademy.ac.ke",
            "password": "generated_password",
            "full_name": "Alice Wanjiku",
            "role": "student"
        }
    """
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=2)
    role: RoleType


# ── Response Schemas ──────────────────────────────────────────────────────


class TokenResponse(BaseModel):
    """
    Returned on successful login.

    Example:
        {
            "access_token": "eyJhbG...cw",
            "token_type": "bearer",
            "user": {
                "id": "abc-123",
                "email": "admin@bfacademy.ac.ke",
                "role": "admin",
                "full_name": "Sr. Mary John"
            },
            "redirect": "/admin"
        }
    """
    access_token: str = Field(..., description="JWT access token.")
    token_type: str = Field(default="bearer", description="Token type (always 'bearer').")
    user: "UserProfile"
    redirect: str = Field(..., description="URL path to redirect to after login.")


class UserProfile(BaseModel):
    """
    Public user profile (safe to return to frontend).
    Excludes sensitive fields like password hashes.
    """
    id: str = Field(..., description="Supabase user UUID.")
    email: str = Field(..., description="User's email address.")
    role: RoleType = Field(..., description="Assigned portal role.")
    full_name: str = Field(..., description="Display name.")
    phone: Optional[str] = Field(default=None, description="Phone number.")
    avatar_url: Optional[str] = Field(default=None, description="Avatar image URL.")
    created_at: Optional[str] = Field(default=None, description="Account creation timestamp.")


class AuthError(BaseModel):
    """Standardized auth error response."""
    code: str
    message: str

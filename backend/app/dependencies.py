"""
Auth dependencies for FastAPI.

These are used as FastAPI Depends() injections on route handlers.
They enforce authentication and role-based access control (RBAC).

Usage in routers:
    from ..dependencies import get_current_user, require_role

    @router.get("/admin/dashboard")
    async def admin_dashboard(current_user = Depends(require_role("admin"))):
        ...

Available roles: admin, teacher, student, parent
"""

from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from .utils.security import decode_access_token


# ── Bearer Token Extraction ───────────────────────────────────────────────
# FastAPI's HTTPBearer extracts the token from the Authorization header.
# Format: Authorization: Bearer <token>

security_scheme = HTTPBearer(auto_error=False)


# ── Current User Dependency ───────────────────────────────────────────────
# Use this on any endpoint that needs the authenticated user's info.
# It does NOT check roles — just that a valid JWT is present.

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
) -> dict:
    """
    Extract and validate the JWT from the Authorization header.

    Returns the decoded token payload: {sub, email, role, full_name, ...}

    Raises 401 if no token is provided or the token is invalid/expired.
    """
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "success": False,
                "error": {
                    "code": "UNAUTHORIZED",
                    "message": "Authorization header is required. Provide a Bearer token."
                }
            }
        )

    token = credentials.credentials

    try:
        payload = decode_access_token(token)
        return payload
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "success": False,
                "error": {
                    "code": "INVALID_TOKEN",
                    "message": "The provided token is invalid or expired. Please log in again."
                }
            }
        )


# ── Role-Based Access Control ─────────────────────────────────────────────
# Factory function: returns a dependency that checks for a specific role.
# This is the primary way to gate portal access.

def require_role(required_role: str):
    """
    Return a FastAPI dependency that:
      1. Validates the JWT (via get_current_user).
      2. Checks that the user's role matches required_role.

    Args:
        required_role: One of 'admin', 'teacher', 'student', 'parent'.

    Usage:
        @router.get("/admin/students")
        async def get_students(current_user = Depends(require_role("admin"))):
            ...
    """
    async def role_checker(current_user: dict = Depends(get_current_user)) -> dict:
        user_role = current_user.get("role", "")

        if user_role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "success": False,
                    "error": {
                        "code": "FORBIDDEN",
                        "message": (
                            f"This endpoint requires the '{required_role}' role. "
                            f"Your role is '{user_role}'."
                        )
                    }
                }
            )

        return current_user

    return role_checker


# ── Multi-Role Dependency ─────────────────────────────────────────────────
# Allows a single endpoint to be accessible by multiple roles.

def require_any_role(*allowed_roles: str):
    """
    Return a dependency that allows access if the user has ANY of the
    specified roles.

    Args:
        allowed_roles: One or more role strings.

    Usage:
        @router.get("/announcements")
        async def get_announcements(
            current_user = Depends(require_any_role("admin", "teacher", "student", "parent"))
        ):
            ...
    """
    async def role_checker(current_user: dict = Depends(get_current_user)) -> dict:
        user_role = current_user.get("role", "")

        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "success": False,
                    "error": {
                        "code": "FORBIDDEN",
                        "message": (
                            f"This endpoint requires one of these roles: {allowed_roles}. "
                            f"Your role is '{user_role}'."
                        )
                    }
                }
            )

        return current_user

    return role_checker

"""
Authentication service: login, signup, profile management.

Handles all auth-related business logic between the router and Supabase.
Uses Supabase Auth for credential validation, then issues our own JWT.

Flow:
  1. Router receives credentials
  2. Service validates with Supabase Auth (signInWithPassword)
  3. Service fetches/creates profile from profiles table
  4. Service creates JWT with user info + role
  5. Returns token + user data to router
"""

from typing import Optional

from ..database import get_supabase
from ..utils.security import create_access_token
from ..config import settings


async def authenticate_user(
    email: str,
    password: str,
    expected_role: Optional[str] = None,
) -> dict:
    """
    Authenticate a user with email + password via Supabase Auth.

    Args:
        email: User's registered email.
        password: User's password.
        expected_role: Optional — if provided, the user's actual role must match.
                       Prevents users from signing into the wrong portal.

    Returns:
        dict with: access_token, token_type, user, redirect

    Raises:
        ValueError: If credentials are invalid or role mismatch.
    """
    supabase = get_supabase()

    # ── Step 1: Validate credentials with Supabase Auth ──────────────────
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password,
        })
    except Exception as e:
        raise ValueError(f"Invalid email or password. ({str(e)})")

    user = auth_response.user
    if not user:
        raise ValueError("Authentication failed. No user returned.")

    # ── Step 2: Get or build profile ────────────────────────────────────
    user_role = user.user_metadata.get("role", "student") if user.user_metadata else "student"
    full_name = user.user_metadata.get("full_name", user.email) if user.user_metadata else user.email

    # Try to fetch profile from the profiles table (may have more accurate data)
    try:
        profile_result = supabase.table("profiles").select("*").eq("id", user.id).maybe_single().execute()
        if profile_result.data:
            profile = profile_result.data
            user_role = profile.get("role", user_role)
            full_name = profile.get("full_name", full_name)
    except Exception:
        # Profiles table may not exist yet — use auth metadata
        pass

    # ── Step 3: Role validation ─────────────────────────────────────────
    if expected_role and user_role != expected_role:
        # Sign out to clean up the Supabase session (we don't use it)
        try:
            supabase.auth.sign_out()
        except Exception:
            pass
        raise ValueError(
            f"This account is registered as '{user_role}', not '{expected_role}'. "
            f"Please use the {user_role} portal login."
        )

    # ── Step 4: Create JWT ──────────────────────────────────────────────
    access_token = create_access_token(
        user_id=user.id,
        email=user.email or email,
        role=user_role,
        full_name=full_name,
    )

    # Determine redirect path based on role
    redirect_map = {
        "admin": "/admin",
        "teacher": "/teacher",
        "student": "/student",
        "parent": "/parent",
    }
    redirect = redirect_map.get(user_role, "/")

    # ── Step 5: Sign out of Supabase session (we use our JWT now) ──────
    try:
        supabase.auth.sign_out()
    except Exception:
        pass

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user_role,
            "full_name": full_name,
            "phone": user.user_metadata.get("phone") if user.user_metadata else None,
            "avatar_url": user.user_metadata.get("avatar_url") if user.user_metadata else None,
            "created_at": user.created_at,
        },
        "redirect": redirect,
    }


async def signup_user(
    email: str,
    password: str,
    full_name: str,
    role: str,
) -> dict:
    """
    Register a new user via Supabase Auth and create their profile.

    Args:
        email: New user's email.
        password: Password (min 6 characters).
        full_name: Display name.
        role: One of 'teacher', 'student', 'parent'.

    Returns:
        dict with user info.

    Raises:
        ValueError: If signup fails.
    """
    supabase = get_supabase()

    # ── Step 1: Create auth user in Supabase ────────────────────────────
    try:
        auth_response = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {
                "data": {
                    "full_name": full_name,
                    "role": role,
                }
            }
        })
    except Exception as e:
        raise ValueError(f"Signup failed: {str(e)}")

    new_user = auth_response.user
    if not new_user:
        raise ValueError("Signup failed: no user returned from Supabase.")

    # ── Step 2: Create profile record ───────────────────────────────────
    try:
        supabase.table("profiles").upsert({
            "id": new_user.id,
            "email": email,
            "role": role,
            "full_name": full_name,
        }, on_conflict="id").execute()
    except Exception:
        # Profile table may not exist — user can still log in (role in metadata)
        pass

    return {
        "id": new_user.id,
        "email": email,
        "role": role,
        "full_name": full_name,
    }


async def create_portal_user(
    email: str,
    password: str,
    full_name: str,
    role: str,
) -> dict:
    """
    Admin-only: create a portal account without affecting the admin's session.

    Uses a temporary Supabase client that doesn't persist sessions,
    so the admin stays logged in after creating the new account.

    Args:
        email: New user's email.
        password: Password.
        full_name: Display name.
        role: One of 'teacher', 'student', 'parent' (never 'admin').

    Returns:
        dict with created user info.
    """
    from supabase import create_client
    from ..config import settings

    # Create a non-persisting client so admin session is NOT hijacked
    temp_client = create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_SERVICE_ROLE_KEY,
    )

    try:
        # Create the auth user
        auth_response = temp_client.auth.admin.create_user({
            "email": email,
            "password": password,
            "email_confirm": True,  # Auto-confirm — no email verification needed
            "user_metadata": {
                "full_name": full_name,
                "role": role,
            }
        })
    except Exception as e:
        raise ValueError(f"Failed to create portal account: {str(e)}")

    new_user = auth_response.user
    if not new_user:
        raise ValueError("Failed to create portal account.")

    # Create profile
    try:
        get_supabase().table("profiles").upsert({
            "id": new_user.id,
            "email": email,
            "role": role,
            "full_name": full_name,
        }, on_conflict="id").execute()
    except Exception:
        pass

    return {
        "id": new_user.id,
        "email": email,
        "role": role,
        "full_name": full_name,
    }

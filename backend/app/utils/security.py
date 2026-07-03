"""
Security utilities: JWT token creation/validation and password hashing.

Authentication flow:
  1. Frontend sends email + password to POST /api/auth/login
  2. Backend validates against Supabase Auth
  3. If valid, backend creates a JWT containing user info + role
  4. Frontend stores JWT and sends it as Bearer token on every request
  5. Backend validates JWT on protected endpoints via middleware

JWT payload structure:
  {
    "sub": "<supabase_user_id>",
    "email": "user@example.com",
    "role": "admin|teacher|student|parent",
    "full_name": "John Doe",
    "exp": <unix_timestamp>
  }
"""

from datetime import datetime, timedelta, timezone
from typing import Any, Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from ..config import settings

# ── Password Hashing ─────────────────────────────────────────────────────
# Used for any server-side password operations (admin password resets, etc.)
# Primary auth goes through Supabase Auth, but we keep this for utility.

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash a plain-text password using bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain-text password against a bcrypt hash."""
    return pwd_context.verify(plain_password, hashed_password)


# ── JWT Token ────────────────────────────────────────────────────────────

def create_access_token(
    user_id: str,
    email: str,
    role: str,
    full_name: str,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """
    Create a JWT access token for an authenticated user.

    Args:
        user_id: Supabase user UUID.
        email: User's email address.
        role: One of 'admin', 'teacher', 'student', 'parent'.
        full_name: User's display name.
        expires_delta: Optional custom expiration. Defaults to config value (8 hours).

    Returns:
        Encoded JWT string.

    Example payload:
        {
            "sub": "abc-123-def",
            "email": "admin@bfacademy.ac.ke",
            "role": "admin",
            "full_name": "Sr. Mary John",
            "exp": 1712345678
        }
    """
    if expires_delta is None:
        expires_delta = timedelta(minutes=settings.JWT_EXPIRATION_MINUTES)

    now = datetime.now(timezone.utc)
    expire = now + expires_delta

    payload = {
        "sub": user_id,          # Standard JWT claim: subject (user ID)
        "email": email,
        "role": role,
        "full_name": full_name,
        "iat": now,              # Issued at
        "exp": expire,           # Expiration
    }

    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_access_token(token: str) -> dict[str, Any]:
    """
    Decode and validate a JWT access token.

    Args:
        token: The JWT string from the Authorization header.

    Returns:
        Decoded payload as a dictionary.

    Raises:
        JWTError: If the token is invalid, expired, or malformed.
    """
    return jwt.decode(
        token,
        settings.JWT_SECRET_KEY,
        algorithms=[settings.JWT_ALGORITHM],
    )

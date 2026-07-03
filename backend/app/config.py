"""
Application configuration loaded from environment variables.

All settings are loaded from a .env file or system environment variables.
Sensitive values (keys, secrets) MUST be set in .env — never hardcoded.
"""

import os
from dotenv import load_dotenv

# Load .env file from the backend directory
load_dotenv()


class Settings:
    """Central configuration for the FastAPI application."""

    # ── Supabase ───────────────────────────────────────────────────────────
    # These connect the backend to Supabase PostgreSQL + Auth.
    # SUPABASE_URL: found in Supabase Dashboard → Settings → API → Project URL
    # SUPABASE_SERVICE_ROLE_KEY: found in Supabase Dashboard → Settings → API →
    #   service_role key (bypasses RLS — NEVER expose this to the frontend)
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

    # ── JWT ────────────────────────────────────────────────────────────────
    # The backend issues its own JWT tokens after validating credentials
    # with Supabase. This separates the frontend from Supabase completely.
    JWT_SECRET_KEY: str = os.getenv(
        "JWT_SECRET_KEY",
        "dev-secret-change-me-in-production-please-use-a-long-random-string"
    )
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_EXPIRATION_MINUTES: int = int(os.getenv("JWT_EXPIRATION_MINUTES", "480"))  # 8 hours

    # ── CORS ───────────────────────────────────────────────────────────────
    # Comma-separated list of allowed frontend origins.
    # In production, replace with your actual domain(s).
    ALLOWED_ORIGINS: list[str] = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,http://localhost:3000"
    ).split(",")

    # ── App Metadata ──────────────────────────────────────────────────────
    APP_NAME: str = os.getenv("APP_NAME", "Bright Future Academy API")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"


# Singleton instance — import this everywhere
settings = Settings()

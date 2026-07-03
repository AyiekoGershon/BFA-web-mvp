"""
Supabase client initialization.

We use the Supabase Python client with the SERVICE_ROLE key server-side.
This gives the backend full access to all tables (bypassing RLS),
while the frontend never touches Supabase directly.

Architecture:
  Frontend → FastAPI (JWT auth) → Supabase (service_role) → PostgreSQL

The service_role key MUST remain server-side only — it is NEVER
exposed to the frontend or included in any response.
"""

from supabase import create_client, Client
from .config import settings


# ── Supabase Client (Service Role) ─────────────────────────────────────────

_supabase: Client | None = None


def get_supabase() -> Client:
    """
    Return the Supabase client instance.

    Lazily initializes on first call. Uses the service_role key from
    environment config for full database access.

    Returns:
        Supabase Client.

    Raises:
        RuntimeError: If SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not configured.
    """
    global _supabase
    if _supabase is None:
        url = settings.SUPABASE_URL
        key = settings.SUPABASE_SERVICE_ROLE_KEY

        if not url or not key:
            raise RuntimeError(
                "Supabase credentials not configured. "
                "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env"
            )

        _supabase = create_client(url, key)

    return _supabase

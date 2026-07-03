"""
CRUD services for announcements.
"""

from typing import Optional
from ..database import get_supabase
import uuid


async def list_announcements(target_role: Optional[str] = None, limit: int = 50) -> list[dict]:
    """Get announcements, optionally filtered by target role."""
    supabase = get_supabase()
    query = supabase.table("announcements").select("*, profiles!announcements_created_by_fkey(full_name)").order("created_at", desc=True).limit(limit)
    if target_role:
        query = query.or_(f"target_role.eq.{target_role},target_role.eq.all")
    result = query.execute()
    announcements = []
    for row in (result.data or []):
        profiles_data = row.pop("profiles", None)
        row["creator_name"] = profiles_data["full_name"] if profiles_data else "System"
        announcements.append(row)
    return announcements


async def get_announcement(announcement_id: str) -> dict:
    """Get a single announcement by ID."""
    supabase = get_supabase()
    result = supabase.table("announcements").select("*, profiles!announcements_created_by_fkey(full_name)").eq("id", announcement_id).maybe_single().execute()
    if not result.data:
        raise ValueError(f"Announcement with ID '{announcement_id}' not found.")
    row = result.data
    profiles_data = row.pop("profiles", None)
    row["creator_name"] = profiles_data["full_name"] if profiles_data else "System"
    return row


async def create_announcement(data: dict) -> dict:
    """Create a new announcement."""
    if "id" not in data or not data["id"]:
        data["id"] = str(uuid.uuid4())
    supabase = get_supabase()
    result = supabase.table("announcements").insert(data).execute()
    return result.data[0] if result.data else {}


async def update_announcement(announcement_id: str, data: dict) -> dict:
    """Update an existing announcement."""
    supabase = get_supabase()
    result = supabase.table("announcements").update(data).eq("id", announcement_id).execute()
    if not result.data:
        raise ValueError(f"Announcement with ID '{announcement_id}' not found.")
    return result.data[0]


async def delete_announcement(announcement_id: str) -> None:
    """Delete an announcement."""
    supabase = get_supabase()
    supabase.table("announcements").delete().eq("id", announcement_id).execute()

"""
CRUD services for teacher records.
"""

from typing import Optional
from ..database import get_supabase
import uuid


async def list_teachers(status: Optional[str] = None) -> list[dict]:
    """Get all teachers, optionally filtered by status."""
    supabase = get_supabase()
    query = supabase.table("teachers").select("*").order("created_at", desc=True)
    if status:
        query = query.eq("status", status)
    result = query.execute()
    return result.data or []


async def get_teacher(teacher_id: str) -> dict:
    """Get a single teacher by ID."""
    supabase = get_supabase()
    result = supabase.table("teachers").select("*").eq("id", teacher_id).maybe_single().execute()
    if not result.data:
        raise ValueError(f"Teacher with ID '{teacher_id}' not found.")
    return result.data


async def create_teacher(data: dict) -> dict:
    """Create a new teacher record."""
    if "id" not in data or not data["id"]:
        data["id"] = str(uuid.uuid4())
    supabase = get_supabase()
    result = supabase.table("teachers").insert(data).execute()
    return result.data[0] if result.data else {}


async def update_teacher(teacher_id: str, data: dict) -> dict:
    """Update an existing teacher record."""
    supabase = get_supabase()
    result = supabase.table("teachers").update(data).eq("id", teacher_id).execute()
    if not result.data:
        raise ValueError(f"Teacher with ID '{teacher_id}' not found.")
    return result.data[0]


async def delete_teacher(teacher_id: str) -> None:
    """Delete a teacher record."""
    supabase = get_supabase()
    supabase.table("teachers").delete().eq("id", teacher_id).execute()

"""
CRUD services for class records.
"""

from typing import Optional
from ..database import get_supabase
import uuid


async def list_classes(section: Optional[str] = None) -> list[dict]:
    """Get all classes, optionally filtered by section (nursery/primary)."""
    supabase = get_supabase()
    query = supabase.table("classes").select("*, teachers(full_name)").order("grade").order("stream")
    if section:
        query = query.eq("section", section)
    result = query.execute()
    classes = []
    for row in (result.data or []):
        teachers_data = row.pop("teachers", None)
        row["teacher_name"] = teachers_data["full_name"] if teachers_data else None
        try:
            count_result = supabase.table("students").select("id", count="exact").eq("class_id", row["id"]).eq("status", "active").execute()
            row["student_count"] = count_result.count if hasattr(count_result, 'count') else 0
        except Exception:
            row["student_count"] = 0
        classes.append(row)
    return classes


async def get_class(class_id: str) -> dict:
    """Get a single class by ID."""
    supabase = get_supabase()
    result = supabase.table("classes").select("*, teachers(full_name)").eq("id", class_id).maybe_single().execute()
    if not result.data:
        raise ValueError(f"Class with ID '{class_id}' not found.")
    row = result.data
    teachers_data = row.pop("teachers", None)
    row["teacher_name"] = teachers_data["full_name"] if teachers_data else None
    return row


async def create_class(data: dict) -> dict:
    """Create a new class."""
    if "id" not in data or not data["id"]:
        data["id"] = str(uuid.uuid4())
    supabase = get_supabase()
    result = supabase.table("classes").insert(data).execute()
    return result.data[0] if result.data else {}


async def update_class(class_id: str, data: dict) -> dict:
    """Update an existing class."""
    supabase = get_supabase()
    result = supabase.table("classes").update(data).eq("id", class_id).execute()
    if not result.data:
        raise ValueError(f"Class with ID '{class_id}' not found.")
    return result.data[0]


async def delete_class(class_id: str) -> None:
    """Delete a class."""
    supabase = get_supabase()
    supabase.table("classes").delete().eq("id", class_id).execute()

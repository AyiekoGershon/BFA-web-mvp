"""
CRUD services for timetable entries.
"""

from typing import Optional
from ..database import get_supabase
import uuid


async def list_timetable(class_id: Optional[str] = None, teacher_id: Optional[str] = None, day_of_week: Optional[int] = None) -> list[dict]:
    """Get timetable entries, filtered by class, teacher, or day."""
    supabase = get_supabase()
    query = supabase.table("timetable_entries").select("*, teachers(full_name), classes(name)").order("day_of_week").order("start_time")
    if class_id:
        query = query.eq("class_id", class_id)
    if teacher_id:
        query = query.eq("teacher_id", teacher_id)
    if day_of_week:
        query = query.eq("day_of_week", day_of_week)
    result = query.execute()
    entries = []
    for row in (result.data or []):
        teachers_data = row.pop("teachers", None)
        classes_data = row.pop("classes", None)
        row["teacher_name"] = teachers_data["full_name"] if teachers_data else None
        row["class_name"] = classes_data["name"] if classes_data else None
        entries.append(row)
    return entries


async def create_timetable_entry(data: dict) -> dict:
    """Add a new timetable entry."""
    if "id" not in data or not data["id"]:
        data["id"] = str(uuid.uuid4())
    supabase = get_supabase()
    result = supabase.table("timetable_entries").insert(data).execute()
    return result.data[0] if result.data else {}


async def update_timetable_entry(entry_id: str, data: dict) -> dict:
    """Update a timetable entry."""
    supabase = get_supabase()
    result = supabase.table("timetable_entries").update(data).eq("id", entry_id).execute()
    if not result.data:
        raise ValueError(f"Timetable entry with ID '{entry_id}' not found.")
    return result.data[0]


async def delete_timetable_entry(entry_id: str) -> None:
    """Delete a timetable entry."""
    supabase = get_supabase()
    supabase.table("timetable_entries").delete().eq("id", entry_id).execute()

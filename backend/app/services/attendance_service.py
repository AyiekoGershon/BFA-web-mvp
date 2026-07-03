"""
CRUD services for attendance records.
"""

from typing import Optional
from ..database import get_supabase
import uuid


async def list_attendance(class_id: Optional[str] = None, student_id: Optional[str] = None, date: Optional[str] = None) -> list[dict]:
    """Get attendance records, optionally filtered by class, student, or date."""
    supabase = get_supabase()
    query = supabase.table("attendance").select("*, students(full_name)").order("date", desc=True)
    if class_id:
        query = query.eq("class_id", class_id)
    if student_id:
        query = query.eq("student_id", student_id)
    if date:
        query = query.eq("date", date)
    result = query.execute()
    records = []
    for row in (result.data or []):
        students_data = row.pop("students", None)
        row["student_name"] = students_data["full_name"] if students_data else None
        records.append(row)
    return records


async def mark_attendance(records: list[dict], marked_by: str) -> list[dict]:
    """Submit multiple attendance records at once (batch)."""
    supabase = get_supabase()
    enriched = []
    for record in records:
        if "id" not in record or not record["id"]:
            record["id"] = str(uuid.uuid4())
        record["marked_by"] = marked_by
        enriched.append(record)
    result = supabase.table("attendance").upsert(enriched, on_conflict="student_id,class_id,date").execute()
    return result.data or []

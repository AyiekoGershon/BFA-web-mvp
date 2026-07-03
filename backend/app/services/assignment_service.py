"""
CRUD services for assignments.
"""

from typing import Optional
from ..database import get_supabase
import uuid


async def list_assignments(class_id: Optional[str] = None, created_by: Optional[str] = None) -> list[dict]:
    """Get assignments, optionally filtered by class or creator (teacher)."""
    supabase = get_supabase()
    query = supabase.table("assignments").select("*, profiles!assignments_created_by_fkey(full_name), classes(name)").order("created_at", desc=True)
    if class_id:
        query = query.eq("class_id", class_id)
    if created_by:
        query = query.eq("created_by", created_by)
    result = query.execute()
    assignments = []
    for row in (result.data or []):
        profiles_data = row.pop("profiles", None)
        classes_data = row.pop("classes", None)
        row["creator_name"] = profiles_data["full_name"] if profiles_data else "Unknown"
        row["class_name"] = classes_data["name"] if classes_data else None
        assignments.append(row)
    return assignments


async def create_assignment(data: dict) -> dict:
    """Create a new assignment (teacher only)."""
    if "id" not in data or not data["id"]:
        data["id"] = str(uuid.uuid4())
    supabase = get_supabase()
    result = supabase.table("assignments").insert(data).execute()
    return result.data[0] if result.data else {}


async def update_assignment(assignment_id: str, data: dict) -> dict:
    """Update an existing assignment."""
    supabase = get_supabase()
    result = supabase.table("assignments").update(data).eq("id", assignment_id).execute()
    if not result.data:
        raise ValueError(f"Assignment with ID '{assignment_id}' not found.")
    return result.data[0]


async def delete_assignment(assignment_id: str) -> None:
    """Delete an assignment."""
    supabase = get_supabase()
    supabase.table("assignments").delete().eq("id", assignment_id).execute()

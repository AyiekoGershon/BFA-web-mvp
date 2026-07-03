"""
CRUD services for student records.

All services follow the same pattern:
  1. Accept validated data from the router
  2. Execute Supabase queries
  3. Return results or raise exceptions

These are called by the router layer, which handles HTTP concerns.
"""

from typing import Optional
from ..database import get_supabase
import uuid


async def list_students(class_id: Optional[str] = None, status: Optional[str] = None) -> list[dict]:
    """
    Get all students, optionally filtered by class or status.

    Args:
        class_id: Optional class UUID to filter by.
        status: Optional status filter (active, graduated, transferred, suspended).

    Returns:
        List of student records with class_name joined.
    """
    supabase = get_supabase()

    query = supabase.table("students").select(
        "*, classes(name)"
    ).order("created_at", desc=True)

    if class_id:
        query = query.eq("class_id", class_id)
    if status:
        query = query.eq("status", status)

    result = query.execute()

    # Flatten joined class name
    students = []
    for row in (result.data or []):
        classes_data = row.pop("classes", None)
        row["class_name"] = classes_data["name"] if classes_data else None
        students.append(row)

    return students


async def get_student(student_id: str) -> dict:
    """
    Get a single student by ID.

    Raises:
        ValueError: If student not found.
    """
    supabase = get_supabase()
    result = supabase.table("students").select(
        "*, classes(name)"
    ).eq("id", student_id).maybe_single().execute()

    if not result.data:
        raise ValueError(f"Student with ID '{student_id}' not found.")

    row = result.data
    classes_data = row.pop("classes", None)
    row["class_name"] = classes_data["name"] if classes_data else None

    return row


async def create_student(data: dict) -> dict:
    """
    Create a new student record.

    Args:
        data: Student data dict matching StudentCreate schema.

    Returns:
        Created student record.
    """
    if "id" not in data or not data["id"]:
        data["id"] = str(uuid.uuid4())
    supabase = get_supabase()
    result = supabase.table("students").insert(data).execute()
    return result.data[0] if result.data else {}


async def update_student(student_id: str, data: dict) -> dict:
    """
    Update an existing student record.

    Args:
        student_id: UUID of the student to update.
        data: Partial student data (only fields to update).

    Returns:
        Updated student record.
    """
    supabase = get_supabase()
    result = supabase.table("students").update(data).eq("id", student_id).execute()
    if not result.data:
        raise ValueError(f"Student with ID '{student_id}' not found.")
    return result.data[0]


async def delete_student(student_id: str) -> None:
    """Delete a student record."""
    supabase = get_supabase()
    supabase.table("students").delete().eq("id", student_id).execute()

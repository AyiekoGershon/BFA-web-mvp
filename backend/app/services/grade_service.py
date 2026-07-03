"""
CRUD services for grades/exam results.
"""

from typing import Optional
from ..database import get_supabase
import uuid


async def list_grades(student_id: Optional[str] = None, class_id: Optional[str] = None, term: Optional[str] = None, academic_year: Optional[str] = None) -> list[dict]:
    """Get grades, filtered by student, class, term, or academic year."""
    supabase = get_supabase()
    query = supabase.table("grades").select("*, students(full_name), classes(name)").order("created_at", desc=True)
    if student_id:
        query = query.eq("student_id", student_id)
    if class_id:
        query = query.eq("class_id", class_id)
    if term:
        query = query.eq("term", term)
    if academic_year:
        query = query.eq("academic_year", academic_year)
    result = query.execute()
    grades = []
    for row in (result.data or []):
        students_data = row.pop("students", None)
        classes_data = row.pop("classes", None)
        row["student_name"] = students_data["full_name"] if students_data else None
        row["class_name"] = classes_data["name"] if classes_data else None
        grades.append(row)
    return grades


async def create_grades(grades: list[dict], created_by: str) -> list[dict]:
    """Submit multiple grades at once (batch)."""
    supabase = get_supabase()
    enriched = []
    for grade in grades:
        if "id" not in grade or not grade["id"]:
            grade["id"] = str(uuid.uuid4())
        grade["created_by"] = created_by
        enriched.append(grade)
    result = supabase.table("grades").insert(enriched).execute()
    return result.data or []


async def update_grade(grade_id: str, data: dict) -> dict:
    """Update a single grade entry."""
    supabase = get_supabase()
    result = supabase.table("grades").update(data).eq("id", grade_id).execute()
    if not result.data:
        raise ValueError(f"Grade with ID '{grade_id}' not found.")
    return result.data[0]


async def delete_grade(grade_id: str) -> None:
    """Delete a grade entry."""
    supabase = get_supabase()
    supabase.table("grades").delete().eq("id", grade_id).execute()

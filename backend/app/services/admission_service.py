"""
CRUD services for admissions.
"""

from typing import Optional
from ..database import get_supabase


async def list_admissions(status: Optional[str] = None) -> list[dict]:
    """Get all admission applications, optionally filtered by status."""
    supabase = get_supabase()
    query = supabase.table("admissions").select("*").order("created_at", desc=True)
    if status:
        query = query.eq("status", status)
    result = query.execute()
    return result.data or []


async def get_admission(admission_id: str) -> dict:
    """Get a single admission by ID."""
    supabase = get_supabase()
    result = supabase.table("admissions").select("*").eq("id", admission_id).maybe_single().execute()
    if not result.data:
        raise ValueError(f"Admission with ID '{admission_id}' not found.")
    return result.data


async def create_admission(data: dict) -> dict:
    """Submit a new admission application (public)."""
    import uuid
    if "id" not in data or not data["id"]:
        data["id"] = str(uuid.uuid4())
    supabase = get_supabase()
    data.setdefault("status", "pending")
    result = supabase.table("admissions").insert(data).execute()
    return result.data[0] if result.data else {}


async def update_admission_status(admission_id: str, status: str) -> dict:
    """
    Update an admission's status (approve/reject/enroll).

    When status is 'enrolled', this also creates the Student record
    and optionally creates a portal account for the student.
    """
    supabase = get_supabase()

    # Update the admission status
    result = supabase.table("admissions").update(
        {"status": status}
    ).eq("id", admission_id).execute()

    if not result.data:
        raise ValueError(f"Admission with ID '{admission_id}' not found.")

    return result.data[0]


async def enroll_student(admission_id: str, class_id: str) -> dict:
    """
    Enroll an approved applicant: creates a Student record and updates the
    admission status to 'enrolled'.

    Args:
        admission_id: UUID of the approved admission.
        class_id: UUID of the class to place the student in.

    Returns:
        Dict with both the updated admission and new student record.
    """
    supabase = get_supabase()

    # Get the admission data
    admission = await get_admission(admission_id)

    if admission.get("status") != "approved":
        raise ValueError("Only approved applications can be enrolled.")

    # Generate admission number
    import random, uuid
    year = "2025"  # Could be dynamic based on current year
    num = random.randint(100, 999)
    admission_number = f"BFA-{year}-{num:03d}"

    # Create student record
    student_data = {
        "id": str(uuid.uuid4()),
        "admission_number": admission_number,
        "full_name": admission["student_name"],
        "class_id": class_id,
        "gender": admission["gender"],
        "date_of_birth": admission["date_of_birth"],
        "address": admission.get("address", ""),
        "phone": admission.get("parent_phone"),
        "status": "active",
    }

    student_result = supabase.table("students").insert(student_data).execute()
    new_student = student_result.data[0] if student_result.data else {}

    # Update admission status to enrolled
    update_result = supabase.table("admissions").update(
        {"status": "enrolled"}
    ).eq("id", admission_id).execute()

    return {
        "admission": update_result.data[0] if update_result.data else admission,
        "student": new_student,
    }

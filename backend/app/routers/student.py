"""
Student portal API routes.

All endpoints require student role (Bearer token with role='student').
Students can:
  - View their class assignments
  - View their exam results
  - View their class timetable
  - View announcements
"""

from fastapi import APIRouter, Depends, Query
from typing import Optional
from ..dependencies import require_role
from ..services import (
    announcement_service,
    assignment_service,
    grade_service,
    timetable_service,
)
from ..utils.response import success_response

# ── Router ─────────────────────────────────────────────────────────────────
# All routes under /api/student, require student role.

student_router = APIRouter(
    prefix="/api/student",
    tags=["Student Portal"],
    dependencies=[Depends(require_role("student"))],
)


# ═══════════════════════════════════════════════════════════════════════════
# OVERVIEW
# ═══════════════════════════════════════════════════════════════════════════

@student_router.get("/overview", response_model=dict)
async def student_overview():
    """
    Get student dashboard overview.
    Returns a summary: recent assignments, announcements, and upcoming events.
    """
    assignments = await assignment_service.list_assignments()
    announcements = await announcement_service.list_announcements(target_role="student")

    return success_response(data={
        "assignments_count": len(assignments),
        "recent_assignments": assignments[:5],
        "recent_announcements": announcements[:5],
    })


# ═══════════════════════════════════════════════════════════════════════════
# ASSIGNMENTS
# ═══════════════════════════════════════════════════════════════════════════

@student_router.get("/assignments", response_model=dict)
async def student_list_assignments(
    class_id: Optional[str] = Query(default=None, description="Filter by class UUID."),
):
    """
    View assignments. Students see assignments for their class.
    In production, class_id would be auto-derived from the student's profile.
    """
    assignments = await assignment_service.list_assignments(class_id=class_id)
    return success_response(data=assignments)


# ═══════════════════════════════════════════════════════════════════════════
# RESULTS
# ═══════════════════════════════════════════════════════════════════════════

@student_router.get("/results", response_model=dict)
async def student_view_results(
    term: Optional[str] = Query(default=None, description="Term filter."),
    academic_year: Optional[str] = Query(default=None, description="Academic year filter."),
):
    """
    View exam results. Students see only their own results.
    In production, student_id would be auto-derived from the JWT.
    """
    grades = await grade_service.list_grades(term=term, academic_year=academic_year)
    return success_response(data=grades)


# ═══════════════════════════════════════════════════════════════════════════
# TIMETABLE
# ═══════════════════════════════════════════════════════════════════════════

@student_router.get("/timetable", response_model=dict)
async def student_view_timetable(
    class_id: Optional[str] = Query(default=None),
    day_of_week: Optional[int] = Query(default=None, ge=1, le=5),
):
    """
    View the class timetable. Students see their class schedule.
    In production, class_id would be auto-derived from the student's profile.
    """
    entries = await timetable_service.list_timetable(
        class_id=class_id,
        day_of_week=day_of_week,
    )
    return success_response(data=entries)


# ═══════════════════════════════════════════════════════════════════════════
# ANNOUNCEMENTS
# ═══════════════════════════════════════════════════════════════════════════

@student_router.get("/announcements", response_model=dict)
async def student_announcements():
    """
    Get announcements for students (target_role='student' or 'all').
    """
    announcements = await announcement_service.list_announcements(target_role="student")
    return success_response(data=announcements)

"""
Parent portal API routes.

All endpoints require parent role (Bearer token with role='parent').
Parents can:
  - View their child's information
  - View their child's assignments
  - View their child's exam results
  - View their child's timetable
  - View announcements
"""

from fastapi import APIRouter, Depends, Query
from typing import Optional
from ..dependencies import require_role
from ..services import (
    student_service,
    announcement_service,
    assignment_service,
    grade_service,
    timetable_service,
)
from ..utils.response import success_response

# ── Router ─────────────────────────────────────────────────────────────────
# All routes under /api/parent, require parent role.

parent_router = APIRouter(
    prefix="/api/parent",
    tags=["Parent Portal"],
    dependencies=[Depends(require_role("parent"))],
)


# ═══════════════════════════════════════════════════════════════════════════
# OVERVIEW
# ═══════════════════════════════════════════════════════════════════════════

@parent_router.get("/overview", response_model=dict)
async def parent_overview():
    """
    Get parent dashboard overview.
    Returns a summary: child info, recent assignments, announcements.
    In production, the child would be looked up by parent_id from the JWT.
    """
    students = await student_service.list_students()
    announcements = await announcement_service.list_announcements(target_role="parent")

    return success_response(data={
        "children_count": len(students),
        "children": students,
        "recent_announcements": announcements[:5],
    })


# ═══════════════════════════════════════════════════════════════════════════
# CHILD INFORMATION
# ═══════════════════════════════════════════════════════════════════════════

@parent_router.get("/child", response_model=dict)
async def parent_view_children(
    student_id: Optional[str] = Query(default=None, description="Specific student UUID."),
):
    """
    View child/children information.
    In production, this would filter by parent_id from the JWT.
    """
    if student_id:
        try:
            student = await student_service.get_student(student_id)
            return success_response(data=student)
        except ValueError as e:
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail={
                "success": False, "error": {"code": "NOT_FOUND", "message": str(e)}
            })

    students = await student_service.list_students()
    return success_response(data=students)


# ═══════════════════════════════════════════════════════════════════════════
# ASSIGNMENTS
# ═══════════════════════════════════════════════════════════════════════════

@parent_router.get("/assignments", response_model=dict)
async def parent_view_assignments(
    class_id: Optional[str] = Query(default=None),
):
    """
    View assignments for your child's class.
    In production, class_id would be derived from the child's student record.
    """
    assignments = await assignment_service.list_assignments(class_id=class_id)
    return success_response(data=assignments)


# ═══════════════════════════════════════════════════════════════════════════
# RESULTS
# ═══════════════════════════════════════════════════════════════════════════

@parent_router.get("/results", response_model=dict)
async def parent_view_results(
    student_id: Optional[str] = Query(default=None),
    term: Optional[str] = Query(default=None),
    academic_year: Optional[str] = Query(default=None),
):
    """
    View your child's exam results.
    In production, student_id would be auto-derived from the parent-child link.
    """
    grades = await grade_service.list_grades(
        student_id=student_id,
        term=term,
        academic_year=academic_year,
    )
    return success_response(data=grades)


# ═══════════════════════════════════════════════════════════════════════════
# TIMETABLE
# ═══════════════════════════════════════════════════════════════════════════

@parent_router.get("/timetable", response_model=dict)
async def parent_view_timetable(
    class_id: Optional[str] = Query(default=None),
    day_of_week: Optional[int] = Query(default=None, ge=1, le=5),
):
    """
    View your child's class timetable.
    In production, class_id would be derived from the child's student record.
    """
    entries = await timetable_service.list_timetable(
        class_id=class_id,
        day_of_week=day_of_week,
    )
    return success_response(data=entries)


# ═══════════════════════════════════════════════════════════════════════════
# ANNOUNCEMENTS
# ═══════════════════════════════════════════════════════════════════════════

@parent_router.get("/announcements", response_model=dict)
async def parent_announcements():
    """
    Get announcements for parents (target_role='parent' or 'all').
    """
    announcements = await announcement_service.list_announcements(target_role="parent")
    return success_response(data=announcements)

"""
Teacher portal API routes.

All endpoints require teacher role (Bearer token with role='teacher').
Teachers can:
  - View students in their assigned class
  - Create and manage assignments
  - Mark attendance for their class
  - Enter exam results/grades
  - View their timetable
  - View announcements
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
from ..dependencies import require_role
from ..services import (
    student_service,
    announcement_service,
    assignment_service,
    attendance_service,
    grade_service,
    timetable_service,
    class_service,
)
from ..models.assignment import AssignmentCreate, AssignmentUpdate
from ..models.attendance import AttendanceBatchCreate
from ..models.grade import GradeBatchCreate, GradeUpdate
from ..models.timetable import TimetableEntryCreate
from ..utils.response import success_response

# ── Router ─────────────────────────────────────────────────────────────────
# All routes under /api/teacher, require teacher role.

teacher_router = APIRouter(
    prefix="/api/teacher",
    tags=["Teacher Portal"],
    dependencies=[Depends(require_role("teacher"))],
)


# ═══════════════════════════════════════════════════════════════════════════
# OVERVIEW
# ═══════════════════════════════════════════════════════════════════════════

@teacher_router.get("/overview", response_model=dict)
async def teacher_overview():
    """
    Get teacher dashboard overview.
    Returns a summary for the teacher's home screen.
    """
    # In production, this would be scoped to the specific teacher's classes.
    # For now, returns system-wide counts (can be filtered by teacher_id later).
    classes = await class_service.list_classes()
    students = await student_service.list_students()
    announcements = await announcement_service.list_announcements(target_role="teacher")

    return success_response(data={
        "classes_count": len(classes),
        "students_count": len(students),
        "recent_announcements": announcements[:5],
    })


# ═══════════════════════════════════════════════════════════════════════════
# STUDENTS (View Only)
# ═══════════════════════════════════════════════════════════════════════════

@teacher_router.get("/students", response_model=dict)
async def teacher_list_students(
    class_id: Optional[str] = Query(default=None, description="Filter by class UUID."),
):
    """
    View students. Teachers can see all students or filter by their assigned class.
    """
    students = await student_service.list_students(class_id=class_id)
    return success_response(data=students)


# ═══════════════════════════════════════════════════════════════════════════
# ASSIGNMENTS
# ═══════════════════════════════════════════════════════════════════════════

@teacher_router.get("/assignments", response_model=dict)
async def teacher_list_assignments(
    current_user: dict = Depends(require_role("teacher")),
):
    """
    List assignments created by this teacher.
    """
    assignments = await assignment_service.list_assignments(
        created_by=current_user.get("sub")
    )
    return success_response(data=assignments)


@teacher_router.post("/assignments", status_code=201, response_model=dict)
async def teacher_create_assignment(
    request: AssignmentCreate,
    current_user: dict = Depends(require_role("teacher")),
):
    """
    Create a new assignment for a class. The created_by field is set to the
    current teacher's user ID automatically.

    Request body:
        {
            "title": "Algebra Exercise 4",
            "description": "Solve questions 1-10 on page 42.",
            "class_id": "class-uuid",
            "subject": "Mathematics",
            "due_date": "2025-07-10T16:00:00Z"
        }
    """
    data = request.model_dump()
    data["created_by"] = current_user.get("sub")  # Auto-set from JWT
    assignment = await assignment_service.create_assignment(data)
    return success_response(data=assignment, message="Assignment created successfully.")


@teacher_router.put("/assignments/{assignment_id}", response_model=dict)
async def teacher_update_assignment(assignment_id: str, request: AssignmentUpdate):
    """Update an existing assignment."""
    try:
        assignment = await assignment_service.update_assignment(
            assignment_id, request.model_dump(exclude_unset=True)
        )
        return success_response(data=assignment, message="Assignment updated.")
    except ValueError as e:
        raise HTTPException(status_code=404, detail={
            "success": False, "error": {"code": "NOT_FOUND", "message": str(e)}
        })


@teacher_router.delete("/assignments/{assignment_id}", response_model=dict)
async def teacher_delete_assignment(assignment_id: str):
    """Delete an assignment."""
    await assignment_service.delete_assignment(assignment_id)
    return success_response(message="Assignment deleted.")


# ═══════════════════════════════════════════════════════════════════════════
# ATTENDANCE
# ═══════════════════════════════════════════════════════════════════════════

@teacher_router.get("/attendance", response_model=dict)
async def teacher_list_attendance(
    class_id: Optional[str] = Query(default=None),
    date: Optional[str] = Query(default=None),
):
    """
    View attendance records for a class on a specific date.
    """
    records = await attendance_service.list_attendance(class_id=class_id, date=date)
    return success_response(data=records)


@teacher_router.post("/attendance", status_code=201, response_model=dict)
async def teacher_mark_attendance(
    request: AttendanceBatchCreate,
    current_user: dict = Depends(require_role("teacher")),
):
    """
    Mark attendance for multiple students at once (batch).

    Teachers can mark their entire class in one request. Uses upsert
    so existing records for the same student+class+date are updated.

    Request body:
        {
            "records": [
                {"student_id": "s1", "class_id": "class-1", "date": "2025-07-03", "status": "present"},
                {"student_id": "s2", "class_id": "class-1", "date": "2025-07-03", "status": "absent", "remarks": "Sick"},
                ...
            ]
        }
    """
    records = await attendance_service.mark_attendance(
        [r.model_dump() for r in request.records],
        marked_by=current_user.get("sub"),
    )
    return success_response(
        data=records,
        message=f"Attendance recorded for {len(records)} students."
    )


# ═══════════════════════════════════════════════════════════════════════════
# RESULTS / GRADES
# ═══════════════════════════════════════════════════════════════════════════

@teacher_router.get("/results", response_model=dict)
async def teacher_list_grades(
    class_id: Optional[str] = Query(default=None),
    term: Optional[str] = Query(default=None),
    academic_year: Optional[str] = Query(default=None),
):
    """
    View exam results/grades. Teachers can filter by class, term, and year.
    """
    grades = await grade_service.list_grades(
        class_id=class_id,
        term=term,
        academic_year=academic_year,
    )
    return success_response(data=grades)


@teacher_router.post("/results", status_code=201, response_model=dict)
async def teacher_enter_grades(
    request: GradeBatchCreate,
    current_user: dict = Depends(require_role("teacher")),
):
    """
    Enter exam results for multiple students at once (batch).

    Request body:
        {
            "grades": [
                {"student_id": "s1", "class_id": "class-1", "subject": "Math", "score": 88, "grade": "A", "term": "Term 2", "academic_year": "2025"},
                ...
            ]
        }
    """
    grades = await grade_service.create_grades(
        [g.model_dump() for g in request.grades],
        created_by=current_user.get("sub"),
    )
    return success_response(
        data=grades,
        message=f"Results entered for {len(grades)} students."
    )


@teacher_router.put("/results/{grade_id}", response_model=dict)
async def teacher_update_grade(grade_id: str, request: GradeUpdate):
    """Update a single grade entry."""
    try:
        grade = await grade_service.update_grade(
            grade_id, request.model_dump(exclude_unset=True)
        )
        return success_response(data=grade, message="Grade updated.")
    except ValueError as e:
        raise HTTPException(status_code=404, detail={
            "success": False, "error": {"code": "NOT_FOUND", "message": str(e)}
        })


# ═══════════════════════════════════════════════════════════════════════════
# TIMETABLE
# ═══════════════════════════════════════════════════════════════════════════

@teacher_router.get("/timetable", response_model=dict)
async def teacher_view_timetable(
    current_user: dict = Depends(require_role("teacher")),
    day_of_week: Optional[int] = Query(default=None, ge=1, le=5),
):
    """
    View the teacher's teaching schedule.
    In production, this would filter by teacher_id from the database.
    """
    # For now, return all timetable entries.
    entries = await timetable_service.list_timetable(day_of_week=day_of_week)
    return success_response(data=entries)


# ═══════════════════════════════════════════════════════════════════════════
# ANNOUNCEMENTS
# ═══════════════════════════════════════════════════════════════════════════

@teacher_router.get("/announcements", response_model=dict)
async def teacher_announcements():
    """
    Get announcements for teachers (target_role='teacher' or 'all').
    """
    announcements = await announcement_service.list_announcements(target_role="teacher")
    return success_response(data=announcements)

"""
Admin portal API routes.

All endpoints require admin role (Bearer token with role='admin').
The admin has full CRUD access to all entities: students, teachers,
classes, announcements, admissions, events, timetable, gallery, etc.
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
from ..dependencies import require_role
from ..services import (
    student_service,
    teacher_service,
    class_service,
    admission_service,
    announcement_service,
    assignment_service,
    attendance_service,
    grade_service,
    timetable_service,
)
from ..models.student import StudentCreate, StudentUpdate
from ..models.teacher import TeacherCreate, TeacherUpdate
from ..models.class_ import ClassCreate, ClassUpdate
from ..models.announcement import AnnouncementCreate, AnnouncementUpdate
from ..models.admission import EnrollmentRequest
from ..models.assignment import AssignmentCreate, AssignmentUpdate
from ..models.attendance import AttendanceBatchCreate
from ..models.grade import GradeBatchCreate, GradeUpdate
from ..models.timetable import TimetableEntryCreate, TimetableEntryUpdate
from ..utils.response import success_response

# ── Router ─────────────────────────────────────────────────────────────────
# Prefix: /api/admin
# All routes require admin role.

admin_router = APIRouter(
    prefix="/api/admin",
    tags=["Admin Portal"],
    dependencies=[Depends(require_role("admin"))],
)


# ═══════════════════════════════════════════════════════════════════════════
# OVERVIEW
# ═══════════════════════════════════════════════════════════════════════════

@admin_router.get("/overview", response_model=dict)
async def admin_overview():
    """
    Get dashboard overview statistics: total students, teachers, classes,
    and pending admissions.
    """
    students = await student_service.list_students()
    teachers = await teacher_service.list_teachers()
    classes = await class_service.list_classes()
    admissions = await admission_service.list_admissions()
    pending = [a for a in admissions if a.get("status") == "pending"]

    return success_response(data={
        "total_students": len(students),
        "total_teachers": len(teachers),
        "total_classes": len(classes),
        "pending_admissions": len(pending),
    })


# ═══════════════════════════════════════════════════════════════════════════
# STUDENTS
# ═══════════════════════════════════════════════════════════════════════════

@admin_router.get("/students", response_model=dict)
async def admin_list_students(
    class_id: Optional[str] = Query(default=None, description="Filter by class UUID."),
    status: Optional[str] = Query(default=None, description="Filter by status."),
):
    """List all students with optional filters."""
    students = await student_service.list_students(class_id=class_id, status=status)
    return success_response(data=students)


@admin_router.get("/students/{student_id}", response_model=dict)
async def admin_get_student(student_id: str):
    """Get a single student by ID."""
    try:
        student = await student_service.get_student(student_id)
        return success_response(data=student)
    except ValueError as e:
        raise HTTPException(status_code=404, detail={
            "success": False, "error": {"code": "NOT_FOUND", "message": str(e)}
        })


@admin_router.post("/students", status_code=201, response_model=dict)
async def admin_create_student(request: StudentCreate):
    """Create a new student record."""
    try:
        student = await student_service.create_student(request.model_dump())
        return success_response(data=student, message="Student created successfully.")
    except Exception as e:
        raise HTTPException(status_code=400, detail={
            "success": False, "error": {"code": "CREATE_FAILED", "message": str(e)}
        })


@admin_router.put("/students/{student_id}", response_model=dict)
async def admin_update_student(student_id: str, request: StudentUpdate):
    """Update an existing student record."""
    try:
        student = await student_service.update_student(
            student_id, request.model_dump(exclude_unset=True)
        )
        return success_response(data=student, message="Student updated successfully.")
    except ValueError as e:
        raise HTTPException(status_code=404, detail={
            "success": False, "error": {"code": "NOT_FOUND", "message": str(e)}
        })


@admin_router.delete("/students/{student_id}", response_model=dict)
async def admin_delete_student(student_id: str):
    """Delete a student record."""
    await student_service.delete_student(student_id)
    return success_response(message="Student deleted successfully.")


# ═══════════════════════════════════════════════════════════════════════════
# TEACHERS
# ═══════════════════════════════════════════════════════════════════════════

@admin_router.get("/teachers", response_model=dict)
async def admin_list_teachers(
    status: Optional[str] = Query(default=None, description="Filter by status."),
):
    """List all teachers."""
    teachers = await teacher_service.list_teachers(status=status)
    return success_response(data=teachers)


@admin_router.get("/teachers/{teacher_id}", response_model=dict)
async def admin_get_teacher(teacher_id: str):
    """Get a single teacher by ID."""
    try:
        teacher = await teacher_service.get_teacher(teacher_id)
        return success_response(data=teacher)
    except ValueError as e:
        raise HTTPException(status_code=404, detail={
            "success": False, "error": {"code": "NOT_FOUND", "message": str(e)}
        })


@admin_router.post("/teachers", status_code=201, response_model=dict)
async def admin_create_teacher(request: TeacherCreate):
    """Create a new teacher record."""
    try:
        teacher = await teacher_service.create_teacher(request.model_dump())
        return success_response(data=teacher, message="Teacher created successfully.")
    except Exception as e:
        raise HTTPException(status_code=400, detail={
            "success": False, "error": {"code": "CREATE_FAILED", "message": str(e)}
        })


@admin_router.put("/teachers/{teacher_id}", response_model=dict)
async def admin_update_teacher(teacher_id: str, request: TeacherUpdate):
    """Update an existing teacher record."""
    try:
        teacher = await teacher_service.update_teacher(
            teacher_id, request.model_dump(exclude_unset=True)
        )
        return success_response(data=teacher, message="Teacher updated successfully.")
    except ValueError as e:
        raise HTTPException(status_code=404, detail={
            "success": False, "error": {"code": "NOT_FOUND", "message": str(e)}
        })


@admin_router.delete("/teachers/{teacher_id}", response_model=dict)
async def admin_delete_teacher(teacher_id: str):
    """Delete a teacher record."""
    await teacher_service.delete_teacher(teacher_id)
    return success_response(message="Teacher deleted successfully.")


# ═══════════════════════════════════════════════════════════════════════════
# CLASSES
# ═══════════════════════════════════════════════════════════════════════════

@admin_router.get("/classes", response_model=dict)
async def admin_list_classes(
    section: Optional[str] = Query(default=None, description="Filter by section (nursery/primary)."),
):
    """List all classes."""
    classes = await class_service.list_classes(section=section)
    return success_response(data=classes)


@admin_router.get("/classes/{class_id}", response_model=dict)
async def admin_get_class(class_id: str):
    """Get a single class by ID."""
    try:
        cls = await class_service.get_class(class_id)
        return success_response(data=cls)
    except ValueError as e:
        raise HTTPException(status_code=404, detail={
            "success": False, "error": {"code": "NOT_FOUND", "message": str(e)}
        })


@admin_router.post("/classes", status_code=201, response_model=dict)
async def admin_create_class(request: ClassCreate):
    """Create a new class."""
    try:
        cls = await class_service.create_class(request.model_dump())
        return success_response(data=cls, message="Class created successfully.")
    except Exception as e:
        raise HTTPException(status_code=400, detail={
            "success": False, "error": {"code": "CREATE_FAILED", "message": str(e)}
        })


@admin_router.put("/classes/{class_id}", response_model=dict)
async def admin_update_class(class_id: str, request: ClassUpdate):
    """Update an existing class."""
    try:
        cls = await class_service.update_class(
            class_id, request.model_dump(exclude_unset=True)
        )
        return success_response(data=cls, message="Class updated successfully.")
    except ValueError as e:
        raise HTTPException(status_code=404, detail={
            "success": False, "error": {"code": "NOT_FOUND", "message": str(e)}
        })


@admin_router.delete("/classes/{class_id}", response_model=dict)
async def admin_delete_class(class_id: str):
    """Delete a class."""
    await class_service.delete_class(class_id)
    return success_response(message="Class deleted successfully.")


# ═══════════════════════════════════════════════════════════════════════════
# ANNOUNCEMENTS
# ═══════════════════════════════════════════════════════════════════════════

@admin_router.get("/announcements", response_model=dict)
async def admin_list_announcements(
    target_role: Optional[str] = Query(default=None),
):
    """List all announcements."""
    announcements = await announcement_service.list_announcements(target_role=target_role)
    return success_response(data=announcements)


@admin_router.post("/announcements", status_code=201, response_model=dict)
async def admin_create_announcement(
    request: AnnouncementCreate,
    current_user: dict = Depends(require_role("admin")),  # re-declared for user context
):
    """
    Create a new announcement.
    The created_by field is auto-set to the current admin's user ID.
    """
    data = request.model_dump()
    data["created_by"] = current_user.get("sub")  # Auto-set from JWT
    announcement = await announcement_service.create_announcement(data)
    return success_response(data=announcement, message="Announcement created successfully.")


@admin_router.put("/announcements/{announcement_id}", response_model=dict)
async def admin_update_announcement(announcement_id: str, request: AnnouncementUpdate):
    """Update an announcement."""
    try:
        ann = await announcement_service.update_announcement(
            announcement_id, request.model_dump(exclude_unset=True)
        )
        return success_response(data=ann, message="Announcement updated successfully.")
    except ValueError as e:
        raise HTTPException(status_code=404, detail={
            "success": False, "error": {"code": "NOT_FOUND", "message": str(e)}
        })


@admin_router.delete("/announcements/{announcement_id}", response_model=dict)
async def admin_delete_announcement(announcement_id: str):
    """Delete an announcement."""
    await announcement_service.delete_announcement(announcement_id)
    return success_response(message="Announcement deleted successfully.")


# ═══════════════════════════════════════════════════════════════════════════
# ADMISSIONS
# ═══════════════════════════════════════════════════════════════════════════

@admin_router.get("/admissions", response_model=dict)
async def admin_list_admissions(
    status: Optional[str] = Query(default=None),
):
    """List all admission applications."""
    admissions = await admission_service.list_admissions(status=status)
    return success_response(data=admissions)


@admin_router.put("/admissions/{admission_id}/status", response_model=dict)
async def admin_update_admission_status(
    admission_id: str,
    status: str = Query(..., pattern="^(pending|approved|rejected|enrolled)$"),
):
    """
    Update an admission's status: pending, approved, rejected, or enrolled.

    When status='enrolled', use the enroll endpoint instead so the
    student record is also created.
    """
    if status == "enrolled":
        raise HTTPException(status_code=400, detail={
            "success": False,
            "error": {
                "code": "USE_ENROLL",
                "message": "Use POST /api/admin/admissions/{id}/enroll to enroll a student."
            }
        })

    try:
        admission = await admission_service.update_admission_status(admission_id, status)
        return success_response(
            data=admission,
            message=f"Admission {status} successfully."
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail={
            "success": False, "error": {"code": "NOT_FOUND", "message": str(e)}
        })


@admin_router.post("/admissions/{admission_id}/enroll", response_model=dict)
async def admin_enroll_student(
    admission_id: str,
    request: EnrollmentRequest,
):
    """
    Enroll an approved applicant — creates a Student record.

    This is the proper way to enroll: the admin selects a class for the
    student, and the system creates the student record with a generated
    admission number. The admission status changes to 'enrolled'.

    Request body:
        {
            "class_id": "class-uuid-here"
        }
    """
    try:
        result = await admission_service.enroll_student(admission_id, request.class_id)
        return success_response(
            data=result,
            message="Student enrolled successfully!"
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail={
            "success": False, "error": {"code": "ENROLL_FAILED", "message": str(e)}
        })


# ═══════════════════════════════════════════════════════════════════════════
# OVERVIEW QUERY ENDPOINTS (Shared across roles, but admin sees all)
# ═══════════════════════════════════════════════════════════════════════════

@admin_router.get("/announcements/shared", response_model=dict)
async def admin_shared_announcements():
    """Get announcements visible to the admin (target_role=admin or all)."""
    announcements = await announcement_service.list_announcements(target_role="admin")
    return success_response(data=announcements)

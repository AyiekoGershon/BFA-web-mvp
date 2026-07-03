"""
Attendance-related Pydantic models.

Teachers mark daily attendance for students in their classes.
Status options: present, absent, late, excused.
"""

from pydantic import BaseModel, Field
from typing import Optional, Literal

AttendanceStatus = Literal["present", "absent", "late", "excused"]


class AttendanceRecord(BaseModel):
    """
    A single student's attendance record for a specific date.
    Used in batch submission: teachers mark the whole class at once.
    """
    student_id: str = Field(..., description="Student UUID.")
    class_id: str = Field(..., description="Class UUID.")
    date: str = Field(..., description="Date of attendance (YYYY-MM-DD).")
    status: AttendanceStatus = Field(default="present", description="Attendance status.")
    remarks: Optional[str] = Field(default=None, description="Optional note (e.g., 'Late - school bus').")
    marked_by: Optional[str] = Field(default=None, description="Teacher user ID.")


class AttendanceBatchCreate(BaseModel):
    """
    Schema for submitting multiple attendance records at once.
    Teachers mark attendance for their entire class in one request.

    Example:
        POST /api/teacher/attendance
        {
            "records": [
                {"student_id": "s1", "class_id": "class-1", "date": "2025-07-03", "status": "present"},
                {"student_id": "s2", "class_id": "class-1", "date": "2025-07-03", "status": "absent"},
                ...
            ]
        }
    """
    records: list[AttendanceRecord] = Field(..., min_length=1, description="List of attendance records.")


class AttendanceResponse(BaseModel):
    """Schema returned to the frontend."""
    id: str
    student_id: str
    class_id: str
    date: str
    status: AttendanceStatus
    remarks: Optional[str]
    marked_by: str
    student_name: Optional[str] = Field(default=None, description="Student name (if joined).")

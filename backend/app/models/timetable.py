"""
Timetable-related Pydantic models.

Timetable entries define the weekly schedule for each class.
Each entry is a subject session with a time slot and room.

Day of week mapping:
  1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday
"""

from pydantic import BaseModel, Field
from typing import Optional


class TimetableEntryBase(BaseModel):
    """Shared fields for timetable requests/responses."""
    class_id: str = Field(..., description="Class UUID.")
    day_of_week: int = Field(..., ge=1, le=5, description="Day of week (1=Monday, 5=Friday).")
    start_time: str = Field(..., description="Start time (HH:MM, 24-hour).")
    end_time: str = Field(..., description="End time (HH:MM, 24-hour).")
    subject: str = Field(..., description="Subject name.")
    teacher_id: str = Field(..., description="Teacher UUID.")
    room: str = Field(..., description="Classroom/room identifier.")


class TimetableEntryCreate(TimetableEntryBase):
    """Schema for creating a new timetable entry."""
    id: Optional[str] = None


class TimetableEntryUpdate(BaseModel):
    """Schema for updating a timetable entry."""
    class_id: Optional[str] = None
    day_of_week: Optional[int] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    subject: Optional[str] = None
    teacher_id: Optional[str] = None
    room: Optional[str] = None


class TimetableEntryResponse(TimetableEntryBase):
    """Schema returned to the frontend."""
    id: str
    teacher_name: Optional[str] = Field(default=None, description="Teacher name (if joined).")
    class_name: Optional[str] = Field(default=None, description="Class name (if joined).")

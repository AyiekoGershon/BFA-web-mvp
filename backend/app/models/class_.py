"""
Class-related Pydantic models.

A Class represents a grade/stream group (e.g., "Grade 4A", "Nursery B").
Each class has:
- A section (nursery or primary)
- An assigned teacher (form teacher)
- A capacity limit
"""

from pydantic import BaseModel, Field
from typing import Optional, Literal


class ClassBase(BaseModel):
    """Shared fields for class requests/responses."""
    name: str = Field(..., min_length=2, description="Display name (e.g., 'Grade 4A').")
    section: Literal["nursery", "primary"] = Field(
        ...,
        description="Academic section: nursery (ages 3-5) or primary (grades 1-6)."
    )
    grade: int = Field(..., ge=0, le=6, description="Grade level (0 = nursery/pre-unit).")
    stream: Optional[str] = Field(default=None, description="Stream letter (A, B, C, etc.).")
    teacher_id: Optional[str] = Field(default=None, description="Form teacher's profile ID.")
    capacity: int = Field(default=35, ge=1, le=100, description="Maximum number of students.")


class ClassCreate(ClassBase):
    """Schema for creating a new class."""
    id: Optional[str] = None


class ClassUpdate(BaseModel):
    """Schema for updating a class. All fields optional."""
    name: Optional[str] = None
    section: Optional[Literal["nursery", "primary"]] = None
    grade: Optional[int] = None
    stream: Optional[str] = None
    teacher_id: Optional[str] = None
    capacity: Optional[int] = None


class ClassResponse(ClassBase):
    """Schema returned to the frontend."""
    id: str
    created_at: str
    # Joined fields
    teacher_name: Optional[str] = Field(default=None, description="Form teacher's name (if joined).")
    student_count: Optional[int] = Field(default=None, description="Number of enrolled students.")

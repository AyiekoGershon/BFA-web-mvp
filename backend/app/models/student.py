"""
Student-related Pydantic models.

A Student is a child enrolled at BFA. Each student has:
- A profile (for portal access if applicable)
- Class assignment
- Parent linkage (optional)
- Admission/status tracking
"""

from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import date


class StudentBase(BaseModel):
    """Shared fields for student requests/responses."""
    full_name: str = Field(..., min_length=2, description="Student's full legal name.")
    admission_number: str = Field(..., description="Unique admission number (e.g., BFA-2025-001).")
    class_id: str = Field(..., description="ID of the class the student is assigned to.")
    gender: Literal["male", "female"] = Field(..., description="Student's gender.")
    date_of_birth: str = Field(..., description="Date of birth (YYYY-MM-DD).")
    address: str = Field(..., description="Physical/home address.")
    phone: Optional[str] = Field(default=None, description="Contact phone number (parent's).")
    parent_id: Optional[str] = Field(default=None, description="Linked parent profile ID.")
    status: Literal["active", "graduated", "transferred", "suspended"] = Field(
        default="active",
        description="Current enrollment status."
    )


class StudentCreate(StudentBase):
    """Schema for creating a new student record."""
    id: Optional[str] = Field(default=None, description="Optional custom ID. Auto-generated if omitted.")


class StudentUpdate(BaseModel):
    """Schema for updating an existing student. All fields optional."""
    full_name: Optional[str] = None
    admission_number: Optional[str] = None
    class_id: Optional[str] = None
    gender: Optional[Literal["male", "female"]] = None
    date_of_birth: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    parent_id: Optional[str] = None
    status: Optional[Literal["active", "graduated", "transferred", "suspended"]] = None


class StudentResponse(StudentBase):
    """Schema returned to the frontend."""
    id: str = Field(..., description="Student record UUID.")
    created_at: str = Field(..., description="ISO timestamp of record creation.")
    # Optional joined fields (populated when requested with ?include=class)
    class_name: Optional[str] = Field(default=None, description="Name of assigned class (if joined).")
    parent_name: Optional[str] = Field(default=None, description="Parent's full name (if joined).")

"""
Teacher-related Pydantic models.

A Teacher is a staff member with:
- Employment details (employee number, qualifications)
- Subject specialization (array of subjects)
- Profile linkage for portal access
"""

from pydantic import BaseModel, Field
from typing import Optional, Literal


class TeacherBase(BaseModel):
    """Shared fields for teacher requests/responses."""
    full_name: str = Field(..., min_length=2, description="Teacher's full name.")
    employee_number: str = Field(..., description="Unique employee ID (e.g., TCH-001).")
    email: str = Field(..., description="Work email address.")
    phone: str = Field(..., description="Contact phone number.")
    subject_specialization: list[str] = Field(
        default_factory=list,
        description="List of subjects the teacher is qualified to teach."
    )
    qualifications: str = Field(..., description="Academic/professional qualifications.")
    gender: Literal["male", "female"] = Field(default="male", description="Teacher's gender.")
    date_of_birth: Optional[str] = Field(default=None, description="Date of birth (YYYY-MM-DD).")
    address: Optional[str] = Field(default=None, description="Physical address.")
    status: Literal["active", "inactive", "terminated"] = Field(
        default="active",
        description="Current employment status."
    )


class TeacherCreate(TeacherBase):
    """Schema for creating a new teacher record."""
    id: Optional[str] = None


class TeacherUpdate(BaseModel):
    """Schema for updating an existing teacher. All fields optional."""
    full_name: Optional[str] = None
    employee_number: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    subject_specialization: Optional[list[str]] = None
    qualifications: Optional[str] = None
    gender: Optional[Literal["male", "female"]] = None
    date_of_birth: Optional[str] = None
    address: Optional[str] = None
    status: Optional[Literal["active", "inactive", "terminated"]] = None


class TeacherResponse(TeacherBase):
    """Schema returned to the frontend."""
    id: str
    created_at: str

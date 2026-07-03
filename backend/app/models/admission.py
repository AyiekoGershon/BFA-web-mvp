"""
Admission-related Pydantic models.

Admissions represent applications from parents/guardians seeking to enroll
a student at BFA. The workflow is:
  1. Parent submits application (public form)
  2. Admin reviews and sets status: pending → approved/rejected
  3. If approved, admin can "Enroll" which creates a Student record
"""

from pydantic import BaseModel, Field
from typing import Optional, Literal

AdmissionStatus = Literal["pending", "approved", "rejected", "enrolled"]


class AdmissionBase(BaseModel):
    """Shared fields for admission requests/responses."""
    student_name: str = Field(..., min_length=2, description="Full name of the child.")
    date_of_birth: str = Field(..., description="Child's date of birth (YYYY-MM-DD).")
    gender: Literal["male", "female"] = Field(..., description="Child's gender.")
    previous_school: Optional[str] = Field(default=None, description="Previous school attended (if any).")
    grade_applying: str = Field(..., description="Grade level applying for (e.g., 'Grade 1', 'Nursery').")
    parent_name: str = Field(..., min_length=2, description="Parent/guardian full name.")
    parent_phone: str = Field(..., description="Parent's phone number.")
    parent_email: str = Field(..., description="Parent's email address.")
    address: str = Field(..., description="Physical/home address.")
    status: AdmissionStatus = Field(default="pending", description="Application status.")


class AdmissionCreate(AdmissionBase):
    """Schema for submitting a new admission application (public)."""
    id: Optional[str] = None


class AdmissionUpdate(BaseModel):
    """Schema for admin to update an admission (approve/reject/enroll)."""
    status: AdmissionStatus = Field(..., description="New application status.")


class EnrollmentRequest(BaseModel):
    """
    Schema for enrolling an approved applicant — creates a Student record.

    The admin selects which class to place the student in.
    """
    class_id: str = Field(..., description="ID of the class to assign the student to.")


class AdmissionResponse(AdmissionBase):
    """Schema returned to the frontend."""
    id: str
    created_at: str

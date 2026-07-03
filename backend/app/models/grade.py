"""
Grade/Results-related Pydantic models.

Teachers enter exam scores for students. Each grade record captures:
- The student, class, subject, and term
- A numeric score and letter grade
- Who entered it and when
"""

from pydantic import BaseModel, Field
from typing import Optional


class GradeBase(BaseModel):
    """Shared fields for grade requests/responses."""
    student_id: str = Field(..., description="Student UUID.")
    class_id: str = Field(..., description="Class UUID.")
    subject: str = Field(..., description="Subject name (e.g., 'Mathematics').")
    score: float = Field(..., ge=0, le=100, description="Numeric score (0-100).")
    grade: str = Field(..., description="Letter grade (A, B, C, D, F).")
    term: str = Field(..., description="Term identifier (e.g., 'Term 1', 'Term 2', 'Term 3').")
    academic_year: str = Field(..., description="Academic year (e.g., '2025').")
    created_by: Optional[str] = Field(default=None, description="Teacher user ID.")


class GradeCreate(GradeBase):
    """Schema for creating a new grade entry (teacher only)."""
    id: Optional[str] = None


class GradeBatchCreate(BaseModel):
    """
    Schema for submitting multiple grades at once (e.g., entire class results).

    Example:
        POST /api/teacher/results
        {
            "grades": [
                {"student_id": "s1", "class_id": "class-1", "subject": "Math", "score": 88, "grade": "A", "term": "Term 2", "academic_year": "2025"},
                ...
            ]
        }
    """
    grades: list[GradeCreate] = Field(..., min_length=1, description="List of grade entries.")


class GradeUpdate(BaseModel):
    """Schema for updating a grade."""
    score: Optional[float] = None
    grade: Optional[str] = None


class GradeResponse(GradeBase):
    """Schema returned to the frontend."""
    id: str
    created_by: str
    created_at: str
    student_name: Optional[str] = Field(default=None, description="Student name (if joined).")
    class_name: Optional[str] = Field(default=None, description="Class name (if joined).")

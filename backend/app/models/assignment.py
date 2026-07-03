"""
Assignment-related Pydantic models.

Assignments are homework/tasks created by teachers for specific classes.
Students and parents can view assignments for their class.
"""

from pydantic import BaseModel, Field
from typing import Optional


class AssignmentBase(BaseModel):
    """Shared fields for assignment requests/responses."""
    title: str = Field(..., min_length=2, max_length=200, description="Assignment title.")
    description: str = Field(..., min_length=5, description="Detailed instructions.")
    class_id: str = Field(..., description="Target class ID.")
    subject: str = Field(..., description="Subject (e.g., 'Mathematics', 'English').")
    due_date: str = Field(..., description="Due date (ISO 8601 timestamp).")
    file_url: Optional[str] = Field(default=None, description="Optional attachment URL.")
    created_by: Optional[str] = Field(default=None, description="Teacher user ID.")


class AssignmentCreate(AssignmentBase):
    """Schema for creating a new assignment (teacher only)."""
    id: Optional[str] = None


class AssignmentUpdate(BaseModel):
    """Schema for updating an assignment."""
    title: Optional[str] = None
    description: Optional[str] = None
    class_id: Optional[str] = None
    subject: Optional[str] = None
    due_date: Optional[str] = None
    file_url: Optional[str] = None


class AssignmentResponse(AssignmentBase):
    """Schema returned to the frontend."""
    id: str
    created_by: str
    created_at: str
    creator_name: Optional[str] = Field(default=None, description="Name of creating teacher.")
    class_name: Optional[str] = Field(default=None, description="Target class display name.")

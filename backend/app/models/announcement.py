"""
Announcement-related Pydantic models.

Announcements are broadcast messages from admin/teachers to specific roles
or all users. They appear in the portal dashboards.
"""

from pydantic import BaseModel, Field
from typing import Optional, Literal

TargetRole = Literal["admin", "teacher", "student", "parent", "all"]


class AnnouncementBase(BaseModel):
    """Shared fields for announcement requests/responses."""
    title: str = Field(..., min_length=2, max_length=200, description="Announcement heading.")
    content: str = Field(..., min_length=5, description="Full announcement body text.")
    target_role: TargetRole = Field(
        default="all",
        description="Which portal(s) should see this announcement."
    )
    created_by: Optional[str] = Field(default=None, description="User ID of the creator.")


class AnnouncementCreate(AnnouncementBase):
    """Schema for creating a new announcement."""
    id: Optional[str] = None


class AnnouncementUpdate(BaseModel):
    """Schema for updating an announcement."""
    title: Optional[str] = None
    content: Optional[str] = None
    target_role: Optional[TargetRole] = None


class AnnouncementResponse(AnnouncementBase):
    """Schema returned to the frontend."""
    id: str
    created_by: str
    created_at: str
    creator_name: Optional[str] = Field(default=None, description="Name of the user who created this.")

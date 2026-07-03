"""
Miscellaneous models: Contact, Event, Gallery, News, Testimonial, Message, Staff Request.

These handle the remaining entities needed by the frontend.
"""

from pydantic import BaseModel, Field, EmailStr
from typing import Optional, Literal


# ── Contact Form ──────────────────────────────────────────────────────────


class ContactMessageCreate(BaseModel):
    """
    Public contact form submission.

    Example:
        POST /api/public/contact
        {
            "full_name": "John Doe",
            "email": "john@example.com",
            "subject": "Admission Inquiry",
            "message": "I would like to know more about ..."
        }
    """
    full_name: str = Field(..., min_length=2, description="Sender's full name.")
    email: EmailStr = Field(..., description="Sender's email address.")
    subject: str = Field(..., min_length=2, max_length=200, description="Message subject.")
    message: str = Field(..., min_length=10, description="Message body (min 10 characters).")


class ContactMessageResponse(BaseModel):
    """Schema returned after successful contact form submission."""
    id: str
    full_name: str
    email: str
    subject: str
    message: str
    created_at: str


# ── Events ────────────────────────────────────────────────────────────────


class EventBase(BaseModel):
    """School event."""
    title: str
    description: str
    date: str = Field(..., description="Event date/time (ISO 8601).")
    location: str
    target_role: Literal["admin", "teacher", "student", "parent", "all"] = "all"
    created_by: Optional[str] = None


class EventCreate(EventBase):
    id: Optional[str] = None


class EventResponse(EventBase):
    id: str
    created_by: str
    created_at: str


# ── Gallery ───────────────────────────────────────────────────────────────


class GalleryImageBase(BaseModel):
    """Photo gallery image."""
    title: str
    url: str
    category: str = Field(..., description="Category (e.g., 'Campus', 'Events', 'Academics').")
    uploaded_by: Optional[str] = None


class GalleryImageCreate(GalleryImageBase):
    id: Optional[str] = None


class GalleryImageResponse(GalleryImageBase):
    id: str
    uploaded_by: str
    created_at: str


# ── News ──────────────────────────────────────────────────────────────────


class NewsArticleBase(BaseModel):
    """School news article."""
    title: str
    excerpt: str = Field(..., description="Short summary for listings.")
    content: str = Field(..., description="Full article body.")
    image_url: Optional[str] = None
    published: bool = False
    created_by: Optional[str] = None


class NewsArticleCreate(NewsArticleBase):
    id: Optional[str] = None


class NewsArticleResponse(NewsArticleBase):
    id: str
    created_by: str
    created_at: str


# ── Testimonials ──────────────────────────────────────────────────────────


class TestimonialBase(BaseModel):
    """Parent/student testimonial."""
    name: str
    role: str = Field(..., description="e.g., 'Parent', 'Alumna'.")
    content: str
    rating: int = Field(..., ge=1, le=5, description="Star rating (1-5).")
    status: Literal["pending", "approved", "rejected"] = "pending"


class TestimonialCreate(TestimonialBase):
    id: Optional[str] = None


class TestimonialResponse(TestimonialBase):
    id: str
    created_at: str


# ── Messages ──────────────────────────────────────────────────────────────


class MessageBase(BaseModel):
    """Internal message between users."""
    sender_id: str
    receiver_id: str
    subject: str
    content: str
    read: bool = False


class MessageCreate(MessageBase):
    id: Optional[str] = None


class MessageResponse(MessageBase):
    id: str
    created_at: str


# ── Staff Requests ────────────────────────────────────────────────────────


class StaffRequestBase(BaseModel):
    """Leave, resource, complaint, or other staff request."""
    staff_id: str
    title: str
    description: str
    type: Literal["leave", "resource", "complaint", "other"]
    status: Literal["pending", "approved", "rejected"] = "pending"


class StaffRequestCreate(StaffRequestBase):
    id: Optional[str] = None


class StaffRequestResponse(StaffRequestBase):
    id: str
    created_at: str

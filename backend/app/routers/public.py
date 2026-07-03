"""
Public API routes — no authentication required.

These endpoints serve the public-facing school website:
  - Admissions form submission
  - Contact form submission
  - Public content (announcements, events, gallery, news, testimonials)
"""

from fastapi import APIRouter, HTTPException, Query
from ..models.admission import AdmissionCreate
from ..models.announcement import AnnouncementResponse
from ..models.misc import ContactMessageCreate
from ..services import admission_service
from ..services import announcement_service
from ..utils.response import success_response

# ── Router ─────────────────────────────────────────────────────────────────
# Prefix: /api/public
# No auth required on these routes.

public_router = APIRouter(prefix="/api/public", tags=["Public"])


# ── Admissions Form ────────────────────────────────────────────────────────
# POST /api/public/admissions
# Anyone can submit an admission application.

@public_router.post("/admissions", response_model=dict)
async def submit_admission(request: AdmissionCreate):
    """
    Submit a new admission application (public form).

    This is the online application form on the public Admissions page.
    No authentication required — any visitor can submit.

    Request body:
        {
            "student_name": "James Otieno",
            "date_of_birth": "2018-04-14",
            "gender": "male",
            "grade_applying": "Grade 1",
            "parent_name": "Mr. Otieno",
            "parent_phone": "+254 712 345 678",
            "parent_email": "otieno@example.com",
            "address": "Migori Town",
            ...
        }

    Response:
        {
            "success": true,
            "data": { "id": "...", "status": "pending", ... },
            "message": "Application submitted successfully."
        }
    """
    try:
        admission = await admission_service.create_admission(request.model_dump())
        return success_response(
            data=admission,
            message="Application submitted successfully! Our admissions office will review it and contact you shortly."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail={
            "success": False,
            "error": {"code": "SUBMISSION_FAILED", "message": str(e)}
        })


# ── Contact Form ───────────────────────────────────────────────────────────
# POST /api/public/contact
# Anyone can submit a contact message.

@public_router.post("/contact", response_model=dict)
async def submit_contact_message(request: ContactMessageCreate):
    """
    Submit a contact form message (public).

    Saves the message to the contact_messages table so admins can review it
    in the admin portal.

    Request body:
        {
            "full_name": "John Doe",
            "email": "john@example.com",
            "subject": "Admission Inquiry",
            "message": "I would like to know more about..."
        }

    Response:
        {
            "success": true,
            "message": "Message sent successfully."
        }
    """
    from ..database import get_supabase
    import uuid

    try:
        supabase = get_supabase()
        data = request.model_dump()
        data["id"] = str(uuid.uuid4())
        result = supabase.table("contact_messages").insert(data).execute()
        return success_response(
            data=result.data[0] if result.data else None,
            message="Your message has been sent successfully! We'll get back to you soon."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail={
            "success": False,
            "error": {"code": "CONTACT_FAILED", "message": str(e)}
        })


# ── Public Announcements ───────────────────────────────────────────────────
# GET /api/public/announcements
# Returns announcements visible to the public (target_role='all').

@public_router.get("/announcements", response_model=dict)
async def get_public_announcements(
    limit: int = Query(default=10, ge=1, le=50, description="Max number of announcements to return.")
):
    """
    Get announcements intended for the public (target_role='all').

    The public website can display these as news/notices.
    """
    announcements = await announcement_service.list_announcements(
        target_role="all",
        limit=limit,
    )
    return success_response(data=announcements)

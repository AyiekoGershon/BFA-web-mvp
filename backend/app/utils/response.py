"""
Standardized API response helpers.

All endpoints return responses in this consistent format:

Success:
    {
        "success": true,
        "data": { ... },          # The actual response payload
        "message": "Optional success message"
    }

Error:
    {
        "success": false,
        "error": {
            "code": "NOT_FOUND",
            "message": "Human-readable error description",
            "details": {}         # Optional additional info
        }
    }
"""

from typing import Any, Optional


def success_response(
    data: Any = None,
    message: str = "Operation completed successfully.",
) -> dict[str, Any]:
    """Build a standardized success response."""
    response: dict[str, Any] = {
        "success": True,
        "message": message,
    }
    if data is not None:
        response["data"] = data
    return response


def error_response(
    code: str,
    message: str,
    details: Optional[dict[str, Any]] = None,
    status_code: int = 400,
) -> tuple[dict[str, Any], int]:
    """
    Build a standardized error response.

    Args:
        code: Machine-readable error code (e.g., 'UNAUTHORIZED', 'NOT_FOUND').
        message: Human-readable error description.
        details: Optional additional error context.
        status_code: HTTP status code to return.

    Returns:
        Tuple of (response_dict, http_status_code) for FastAPI.
    """
    error_body: dict[str, Any] = {
        "code": code,
        "message": message,
    }
    if details:
        error_body["details"] = details

    return {
        "success": False,
        "error": error_body,
    }, status_code

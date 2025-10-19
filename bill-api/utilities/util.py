from flask import session, jsonify
from functools import wraps


def login_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if not session.get("user_id"):
            return error_response(
                message="Unauthorized Access",
                status_code=401
            )
        return fn(*args, **kwargs)
    return wrapper

# Standardized response format
def success_response(data=None, message="Success", status_code=200):
    """Create a standardized success response."""
    response = {
        "success": True,
        "message": message
    }
    if data is not None:
        response["data"] = data
    return jsonify(response), status_code


def error_response(message="An error occurred", status_code=400):
    """Create a standardized error response."""
    return jsonify({
        "success": False,
        "error": message
    }), status_code


def current_user():
    uid = session.get("user_id")
    # Look up in DB in real code
    return {"id": uid} if uid else None



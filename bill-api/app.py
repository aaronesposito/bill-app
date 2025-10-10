from datetime import timedelta
from dotenv import load_dotenv
from flask import Flask, request, jsonify, session, g
from flask_cors import CORS
from db_handler import DB_init
from queries.accounts import create_user, check_duplicate_user, validate_account
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)
CORS(app)
DB_init()

load_dotenv()
app.config.update(
    SECRET_KEY= os.getenv("SECRET_KEY"),
    PERMANENT_SESSION_LIFETIME=timedelta(days=7),
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=True 
)


def current_user():
    uid = session.get("user_id")
    # Look up in DB in real code
    return {"id": uid} if uid else None

def login_required(fn):
    from functools import wraps
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if not session.get("user_id"):
            return error_response(
                message="Unauthorized Access",
                status_code=401
            )
        return fn(*args, **kwargs)
    return wrapper

@app.before_request
def load_user():
    g.user = current_user()

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


@app.post("/signup")
def register():
    try:
        data = request.get_json()
        user_exists = check_duplicate_user(data["username"])
        if user_exists:
            return error_response(
                message="User already exists"
            )
        
        hashed_password = generate_password_hash(data["password"])
        data["password"] = hashed_password
        user_id = create_user(data)

        return success_response(
            data={"id":user_id},
            message="Account creation successful",
            status_code=201
        )
    except Exception as e:
        return error_response(str(e), 400)

@app.post("/login")
def login():
    data = request.get_json()
    response = validate_account(data["username"])
    if not response["username"] or not check_password_hash(response["password_hash"], data["password"]):
        return error_response(
            message="Login Failed",
            status_code=400
        )
    session.clear()
    session.permanent = True
    session["user_id"] = response["public_id"]
    return success_response(
            message="Login successful",
            status_code=201
        )

@app.post("/logout")
def logout():
    try:
        session.clear()
        return success_response(
                message="Logout successful",
                status_code=201
            )
    except Exception as e:
        return error_response(
            message= f"Something went wrong: {e}",
            status_code= 400
        )

@app.get("/me")
def get_me():
    if not g.user:
        return error_response(
            message="No active user"
        )
    return success_response(
        message=f"User -> {g.user['id']}"
    )

@app.get("/secret")
@login_required
def secret():
    return success_response(message=f"You are logged in ID -> {g.user['id']}")

if __name__ == "__main__":
    app.run(debug=True)

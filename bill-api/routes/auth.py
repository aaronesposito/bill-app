from flask import request, session, g, Blueprint, jsonify
from flask_cors import cross_origin
from werkzeug.security import generate_password_hash, check_password_hash
from utilities.util import success_response, error_response, login_required
from queries.auth import check_duplicate_user, create_user, delete_user, validate_account, get_id, get_user


bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.post("/signup")
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

@bp.route("/login", methods=["OPTIONS", "POST"])
@cross_origin(
    origins="http://prometheus:5004",
    supports_credentials=True,
)
def login():
    data = request.get_json()
    response = validate_account(data["username"])
    if not response or not check_password_hash(response["password_hash"], data["password"]):
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

@bp.post("/logout")
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
    
@bp.delete("/<int:id>")
def delete(id):
    result = delete_user(id)
    if result:
        return success_response(
            message="account deleted",
            status_code=201
            )
    else:
        return error_response(
            message="Unable to delete account or account doesn't exist",
            status_code=404
        )

@bp.get("/me")
def get_me():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"loggedIn": False}), 200  

    internal_id = get_id(user_id)
    user = get_user(internal_id)
    if not user:
        return jsonify({"loggedIn": False}), 200

    return jsonify({
        "loggedIn": True,
        "user": user["username"]
    }), 200

@bp.get("/secret")
@login_required
def secret():
    return success_response(message=f"You are logged in ID -> {g.user['id']}")


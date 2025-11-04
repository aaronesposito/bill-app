from flask import request, Blueprint
from utilities.util import success_response, error_response, login_required
from queries.banks import create_bank, get_bank, get_banks, delete_bank, check_duplicate_bank


bp = Blueprint('bank', __name__, url_prefix='/bank')

@bp.post("/create")
@login_required
def new_bank():
    try:
        data = request.get_json()
        bank_exists = check_duplicate_bank(data["bank_name"])
        if bank_exists:
            return error_response(
                message="Bank already exists"
            )
        bank_id = create_bank(data["bank_name"])
        return success_response(
            data={"id":bank_id},
            message="Bank created successfully",
            status_code=201
        )
    except Exception as e:
        return error_response(str(e), 400)
    
@bp.get("/all")
@login_required
def get_all_banks():
    try:
        data = get_banks()
        if data:
            return success_response(
                data=data,
                status_code=201
            )
        else:
            return success_response(
                message="No banks found",
                # return a blank array if nothing is found
                data=[],
                status_code=200
            )
    except Exception as e:
        return error_response(str(e), 400)
    
@bp.get("/<int:id>")
@login_required
def get_one_bank(id):
    try:
        data = get_bank(id)
        if data:
            return success_response(
                data=data,
                status_code=201
            )
        else:
            return error_response(
                message="Bank not found",
                status_code=404
            )
    except Exception as e:
        return error_response(str(e), 400)
    
@bp.delete("/<int:id>")
@login_required
def delete_one_bank(id):
    try:
        deleted = delete_bank(id)
        if deleted:
            return success_response(
                message=f"Bank {id} deleted successfully",
                status_code=201
            )
        else:
            return error_response(
                message="Bank not found",
                status_code=404
            )
    except Exception as e:
        return error_response(str(e), 400)
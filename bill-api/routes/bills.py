from flask import request, Blueprint, g
from utilities.util import success_response, error_response, login_required
from queries.bills import create_bill, get_bill, get_bills, delete_bill, update_bill, bills_by_bank


bp = Blueprint('bill', __name__, url_prefix="/bill")

@bp.post("/create")
@login_required
def new_bill():
    try:
        data = request.get_json()
        bill_id = create_bill(data, g.user["id"])
        return success_response(
            data={"bill_id":bill_id},
            message="Bill created successfully",
            status_code=201
        )
    except Exception as e:
        return error_response(str(e), 400)

@bp.get("/all")
@login_required
def get_all_bills():
    try:
        data = get_bills(g.user['id'])
        if data:
            return success_response(
                data=data,
                status_code=201
            )
        else:
            return error_response(
                message="No bills found",
                status_code=404
            )
    except Exception as e:
        return error_response(str(e), 400)

@bp.get("/<int:id>")
@login_required
def get_one_bill(id):
    try:
        data = get_bill(id)
        if data:
            return success_response(
                data=data,
                status_code=201
            )
        else:
            return error_response(
                message="Bill not found",
                status_code=404
            )
    except Exception as e:
        return error_response(str(e), 400)

@bp.delete("/<int:id>")
@login_required
def delete_one_bill(id):
    try:
        data = delete_bill(id)
        if data:
            return success_response(
                data=data,
                status_code=201
            )
        else:
            return error_response(
                message="Bill not found",
                status_code=404
            )
    except Exception as e:
        return error_response(str(e), 400)

@bp.patch("/<int:id>")
@login_required
def update_one_bill(id):
    try:
        data = request.get_json()
        response = update_bill(data, id)
        if response:
            return success_response(
                data=response,
                message="Bill Updated",
                status_code=201
            )
        else:
            return error_response(
                message="Error updating bill",
                status_code=404
            )
    except Exception as e:
        return error_response(str(e), 400)

@bp.get("/bank/<int:id>")
@login_required
def get_bills_by_bank(id):
    try:
        response = bills_by_bank(id)
        if response:
            return success_response(
                data=response,
                message="Bills retrieved successfully",
                status_code=201
            )
    except Exception as e:
        return error_response(
            str(e),
            status_code=400
        )

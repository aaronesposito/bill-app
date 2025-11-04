from utilities.db_handler import execute_query
from queries.auth import get_id

def create_bill(data, uuid):
    data["user_account"] = get_id(uuid)
    print(data["user_account"])
    query = """
            INSERT INTO bill (
            bill_name,
            user_account,
            bank_id,
            amount
            )VALUES(
            %(bill_name)s,
            %(user_account)s,
            %(bank_id)s,
            %(amount)s
            )
            RETURNING id
            """
    result = execute_query(query, data, fetch_one=True)
    return result[0] if result else None

def get_bill(id):
    query = """
            SELECT * FROM bill
            WHERE id = %s
            """

    result = execute_query(query, [id], fetch_one=True)
    return {
        "id":result[0],
        "bill_name": result[1],
        "user_account": result[2],
        "bank_id": result[3],
        "amount": result[4],
        "paid": result[5]
        } if result else None

def get_bills(uuid):
    user_id = get_id(uuid)
    query = """
            SELECT b.id, b.bill_name, ba.bank_name, amount, paid 
            FROM bill as b
            INNER JOIN bank as ba on b.bank_id = ba.id
            WHERE user_account = %s
            """
    result = execute_query(query, [user_id], fetch_all=True)
    return [{
        "id":row[0],
        "bill_name": row[1],
        "bank_name": row[2],
        "amount": row[3],
        "paid": row[4]
    } for row in result] if result else None

def update_bill(data, id):
    fields = ""
    allowed_keys = ["bill_name","bank_id","amount","paid"]
    patch = {}
    for key in data.keys():
        if key not in allowed_keys:
            return None
        if data[key] != None:
            patch[key] = data[key]
    fields = ", ".join([f"{key} = %({key})s" for key in patch.keys()])
    query = f"""
            UPDATE bill
            SET {fields}
            WHERE id = %(bill_id)s
            RETURNING *
            """
    result = execute_query(query, {**patch, "bill_id":id}, fetch_one=True)
    return {
        "id":result[0],
        "bill_name":result[1],
        "bank_id":result[3],
        "amount":result[4],
        "paid":result[5]
    } if result else None

def delete_bill(id):
    query = """
            WITH deleted AS (DELETE FROM bill WHERE id=%s RETURNING *) SELECT count(*) FROM deleted;
            """
    result = execute_query(query, [id], fetch_one=True)
    return result[0]

def bills_by_bank(bank_id):
    query = """
            SELECT * FROM bill
            WHERE bank_id = %s
            """
    result = execute_query(query, [bank_id], fetch_all=True)
    return [{
        "id":row[0],
        "bill_name":row[1],
        "bank_id":row[3],
        "amount":row[4],
        "paid":row[5]
    } for row in result]

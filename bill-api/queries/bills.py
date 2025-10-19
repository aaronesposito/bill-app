from utilities.db_handler import execute_query

def create_bill(data):
    query = """
            INSERY INTO bill (
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
            WHERE id = %(id)s
            """
    
    result = execute_query(query, [id], fetch_one=True)
    return {
        "id":result[0], 
        "user_account": result[1],
        "bank_id": result[2],
        "amount": result[3],
        "paid": result[4]
        } if result else None

def get_bills(user_id):
    query = """
            SELECT * FROM bill
            WHERE useraccount = %(user_id)s
            """
    result = execute_query(query, [user_id], fetch_all=True)
    return {
        "id":result[0],
        "bill_name":result[1],
        "bank_id":result[3],
        "amount":result[4],
        "paid":result[5]
    } if result else None
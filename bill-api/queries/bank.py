from db_handler import execute_many, execute_query
from accounts import get_id

def create_bank(bank_name):
    query = """
            INSERT INTO bank (
            bank_name
            )VALUES(
            %(bank_name)s
            )
            RETURNING id
            """
    
    result = execute_query(query, [bank_name], fetch_one=True)
    return result[0] if result else None

def get_bank(id):
    query = """
            SELECT * FROM bank 
            WHERE id = %(id)s
            """
    
    result = execute_query(query, [id], fetch_one=True)
    return {"id":result[0], "bank_name":result[1]} if result else None

def get_banks():
    query = """
            SELECT * FROM bank
            """
    
    results = execute_query(query, fetch_all=True)
    data = [{"id":row[0], "bank_name":row[1]} for row in results]
    return data if data else None


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

def get_bills_by_bank(public_id):
    user_id = get_id(public_id)
    query = """
            SELECT b.bill_name AS "bill_name", b.amount AS "amount", b.paid AS "paid"
            FROM bill as b
            INNER JOIN bank AS ba ON b.bank_id = ba.id
            WHERE b.id = %s
            """
    results = execute_query(query, [user_id], fetch_all=True)
    data = [{
        "bill_name":row[0],
        "amount":row[1],
        "paid":row[3]
    } for row in results]
    return data if data else None
from utilities.db_handler import execute_query


def create_bank(bank_name):
    query = """
            INSERT INTO bank (
            bank_name
            )VALUES(
            %s
            )
            RETURNING id
            """
    
    result = execute_query(query, [bank_name], fetch_one=True)
    return result[0] if result else None

def get_bank(id):
    query = """
            SELECT * FROM bank 
            WHERE id = %s
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


def delete_bank(id):
    query = """
            WITH deleted AS (DELETE FROM bank WHERE id=%s RETURNING *) SELECT count(*) FROM deleted;
            """
    result = execute_query(query, [id], fetch_one=True)
    return result[0]

def check_duplicate_bank(bank_name):
    query = """
            SELECT bank_name FROM bank WHERE bank_name = %s
            """
    result = execute_query(query, [bank_name], fetch_one=True)
    return result
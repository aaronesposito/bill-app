from utilities.db_handler import execute_many, execute_query
import uuid


def check_duplicate_user(username):
    query = """
            SELECT username FROM account WHERE username = %s
            """
    result = execute_query(query, [username], fetch_one=True)
    return result


def create_user(data):
    data["public_id"] = str(uuid.uuid4())
    query = """
            INSERT INTO account (
                public_id,
                full_name,
                username,
                password
            ) VALUES (
                %(public_id)s,
                %(full_name)s,
                %(username)s,
                %(password)s
            )
            RETURNING id
            """
    result = execute_query(query, data, fetch_one=True)
    return result[0] if result else None

def get_user(id):
    query = """
            SELECT * FROM account WHERE id=%s
            """
    result = execute_query(query, [id], fetch_one=True)
    return {
        "id": result[0],
        "public_id": result[1],
        "full_name": result[2],
        "username": result[3]
        } if result else None

def delete_user(id):
    query = """
            WITH deleted AS (DELETE FROM account WHERE id=%s RETURNING *) SELECT count(*) FROM deleted;
            """
    result = execute_query(query, [id], fetch_one=True)
    return result[0]

def validate_account(username):
    query = """
            SELECT username, password, public_id
            FROM account
            WHERE username = %s
            """
    result = execute_query(query, [username], fetch_one=True)
    return {"username":result[0], "password_hash": result[1], "public_id": result[2]}

def get_id(_uuid):
    query = """
             SELECT account.id FROM account WHERE public_id = %s
            """
    result = execute_query(query, [_uuid], fetch_one=True)
    return result[0] if result else None
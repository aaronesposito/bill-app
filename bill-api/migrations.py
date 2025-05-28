


migrations = [
    """
    CREATE TABLE IF NOT EXISTS bill
    (bill_name TEXT,
    bank_name TEXT,
    amout REAL
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS bank
    (name TEXT);
    """,
    """
    CREATE TABLE IF NOT EXISTS user
    (name TEXT,
    username TEXT,
    primary_bank TEXT
    );
    """
    ]
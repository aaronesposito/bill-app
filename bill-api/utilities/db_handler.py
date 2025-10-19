from dotenv import load_dotenv
from contextlib import contextmanager
from typing import Optional, Any, List, Tuple
import os
import psycopg2


load_dotenv()

DB_DATA = {
    "dbname": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "host": os.getenv("DB_HOST"),
    "port": os.getenv("DB_PORT")
}


@contextmanager
def get_db_connection():
    conn = None
    cur = None
    try:
        conn = psycopg2.connect(**DB_DATA)
        cur = conn.cursor()
        yield conn, cur
        conn.commit()
    except psycopg2.Error as e:
        if conn:
            conn.rollback()
        raise e
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()


def execute_query(query: str, params: Optional[Any] = None, fetch_one: bool = False, fetch_all: bool = False) -> Optional[Any]:

    with get_db_connection() as (conn, cur):
        if params:
            cur.execute(query, params)
        else:
            cur.execute(query)
        
        if fetch_one:
            return cur.fetchone()
        elif fetch_all:
            return cur.fetchall()
        return None


def execute_many(query: str, params_list: List[Tuple]) -> None:

    with get_db_connection() as (conn, cur):
        cur.executemany(query, params_list)


TABLE_BUILD = [

    """
    CREATE TABLE IF NOT EXISTS bank
    (
    id SERIAL PRIMARY KEY,
    bank_name TEXT UNIQUE
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS account
    (
    id SERIAL PRIMARY KEY,
    public_id TEXT UNIQUE,
    full_name VARCHAR(50),
    username VARCHAR(50) UNIQUE,
    password TEXT
    );
    """
    """
    CREATE TABLE IF NOT EXISTS bill
    (
    id SERIAL PRIMARY KEY,
    bill_name TEXT,
    user_account INT REFERENCES account(id) ON DELETE CASCADE,
    bank_id INT REFERENCES bank(id) ON DELETE CASCADE,
    amount REAL, 
    paid BOOL DEFAULT FALSE
    );
    """,
    ]

def DB_init():
    with get_db_connection() as (conn, cur):
        for command in TABLE_BUILD:
            try:
                cur.execute(command)
                table_name = command.split("CREATE TABLE IF NOT EXISTS ")[1].split()[0]
                print(f"Created table: {table_name}")
            except psycopg2.Error as e:
                print(f"Error creating table: {e}")
                conn.rollback()
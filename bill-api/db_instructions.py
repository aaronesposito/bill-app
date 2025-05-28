import sqlite3

class Database_Handler:
    def __init__(self, database_uri):
        self.db_uri = database_uri
        self.cur = None
        self.conn = None
    def connect(self):
        try:
            self.conn = sqlite3.connect(self.db_uri)
            self.cur = self.conn.cursor()
        except: 
            print("DB CONNECTION FAILED")

    def disconnect(self):
        try:
            self.conn.commit()
            self.cur.close()
            self.conn.close()
        except:
            print("FAILED TO CLOSE CONNECTION")
    def migrate(self, migrations):
        self.connect()
        for command in migrations:
            self.cur.execute(command)
        self.disconnect()
    def test(self):
        self.connect()
        print("CONNECTED")
        self.disconnect()
    def get_one(self, table, row):
        if table not in ["bill", "bank", "user"]:
            return "invalid table"
        query = f"SELECT rowid, * FROM {table} WHERE rowid = ?"
        self.connect()
        result = self.cur.execute(query, row).fetchone()
        self.disconnect()
        return result
    def get_all(self, value):
        self.connect()
        result = self.cur.execute("""SELECT * FROM ?""", value)
        self.disconnect()
        return result.fetchall()
    def insert_bill(self, data):
        self.connect()
        self.cur.execute("""INSERT INTO bill (bill_name, bank_name, amout) VALUES (?, ?, ?)""", tuple(data.values()))
        self.disconnect()

        

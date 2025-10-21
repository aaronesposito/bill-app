from datetime import timedelta
from dotenv import load_dotenv
from flask import Flask, g
from flask_cors import CORS
from utilities.db_handler import DB_init
from routes import auth, banks, bills
from utilities.util import current_user
import os

app = Flask(__name__)
CORS(app)
DB_init()
load_dotenv()

app.config.update(
    SECRET_KEY= os.getenv("SECRET_KEY"),
    PERMANENT_SESSION_LIFETIME=timedelta(days=7),
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=True 
)

app.register_blueprint(auth.bp)
app.register_blueprint(banks.bp)
app.register_blueprint(bills.bp)

@app.before_request
def load_user():
    g.user = current_user()

if __name__ == "__main__":
    app.run(debug=True)






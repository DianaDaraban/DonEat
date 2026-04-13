from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True,
     allow_headers=["Content-Type"], methods=["GET", "POST", "OPTIONS"])

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///doneatdatabase.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
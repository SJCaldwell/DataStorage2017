import flask
from flask import render_template
import json
from flask_sqlalchemy import SQLAlchemy
from models import *
from flask_bcrypt import Bcrypt
from flask_login import LoginManager

def grab_db_uri():
	with open("../secret.config") as secrets_file:
		secrets = json.load(secrets_file)
		db_conf = secrets['database']
		return ('postgresql+psycopg2://' + db_conf['user'] + ':' + db_conf['password'] + '@' + db_conf['host'] + '/' + db_conf['dbname'])

app = flask.Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = grab_db_uri()
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # Examine results of this choice, currently just disabling the warning
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager()
login_manager.init_app(app)

@app.route("/")
def greetings():
	check = Meets.query.filter_by(id=3).first()
	print(check)
	return render_template("index.html")

@app.route("/grab_rivals", methods = ['POST'])
def grab_rivals():
	age = request.form['age']
	weight = request.form['weight']
	is_pounds = request.form['is_pounds']


	
		
if __name__ == "__main__":
	app.debug = True
	app.run()

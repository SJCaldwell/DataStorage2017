import flask
from flask import render_template, request, flash, session, url_for, redirect
import json
from flask_sqlalchemy import SQLAlchemy
from models import *
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, logout_user, current_user, login_required

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
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))

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

@app.route("/register", methods = ['GET', 'POST'])
def register():
	if request.method == 'GET':
		return render_template("register.html")
	user = User(request.form['username'], request.form['password'], request.form['age'])
	db.session.add(user)
	db.session.commit()
	flash('Registration was successful!')
	return redirect(url_for('login'))

@app.route("/login", methods = ['GET', 'POST'])
def login():
	if request.method == 'GET':
		return render_template("login.html")
	return redirect(url_for("index"))

if __name__ == "__main__":
	app.debug = True
	app.run()

import flask
from flask import render_template, request, flash, session, url_for, redirect
import json
from flask_sqlalchemy import SQLAlchemy
from models import *
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, login_user, logout_user, current_user, login_required
from helpers import pounds_to_kilos, kilos_to_pounds, meets_password_complexity_requirements

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
    return Users.query.get(int(id))

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
	username = request.form['username']
	registered_user = Users.query.filter_by(username=username).first()
	if registered_user:
		flash('Username was already taken. Please choose another!', 'error')
		return redirect(url_for('register'))
	if meets_password_complexity_requirements(request.form['password']):
		user = Users(request.form['username'], request.form['password'], request.form['age'])
		db.session.add(user)
		db.session.commit()
		flash('Registration was successful!')
		return redirect(url_for('login'))
	else:
		flash('Password is not complex enough.', 'error')
		return redirect(url_for('register'))

@app.route("/login", methods = ['GET', 'POST'])
def login():
	if request.method == 'GET':
		return render_template("login.html")
	username = request.form['username']
	password = request.form['password']
	hashed_pass = bcrypt.generate_password_hash(password).decode('utf-8')
	registered_user = Users.query.filter_by(username=username).first()
	if registered_user is None:
		print("NO USER EXISTS")
		flash('Username or password is invalid', 'error')
		return redirect(url_for('login'))
	if bcrypt.check_password_hash(registered_user.password, password): # returns True
		login_user(registered_user)
		flash('Logged in successfully')
		return redirect(request.args.get('next') or url_for('greetings'))
	flash("Username or password is invalid", 'error')
	return redirect(url_for('login'))

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('greetings'))


@app.route("/profile")
@login_required
def profile():
	return render_template("profile.html", username = current_user.username)

@app.route("/user_lifts", methods = ['GET', 'POST'])
@login_required
def user_lifts():
	if request.method == 'GET':
		return render_template("add_lift.html")
	else:
		pass

@app.route("/rival")
@login_required
def rival():
	if request.method == 'GET':
		return render_template("rival.html")
	bw = request.form['weight']
	is_lbs = request.form['is_lbs']
	deadlift = request.form['deadlift']
	squat = request.form['squat']
	bench = request.form['bench']
	age = request.form['age']
	if is_lbs:
		bw = pounds_to_kilos(bw)
		deadlift = pounds_to_kilos(deadlift)
		squat = pounds_to_kilos(squat)
		bench = pounds_to_kilos(bench)
	#processing rivals
	if is_lbs:
		#convert back to lbs
		bw = kilos_to_pounds(bw)

@app.route("/athletes")
@login_required
def athletes():
	athletes_page = Athletes.query.order_by(Athletes.id).paginate(page = 1, per_page=20)
	return render_template("athletes.html", athletes=athletes_page.items)

@app.route("/best_lifts")
@login_required
def best_lifts():
	best_lifts_page = Athlete_lifts.query.order_by(Athlete_lifts.total_kg).paginate(page = 1, per_page = 20)
	return render_template("athletes.html", best_lifts = best_lifts_page.items)

@app.route("/meets")
@login_required
def meets():
	meets_page = Meets.query.order_by(Meets.id).paginate(page = 1, per_page = 20)
	return render_template("meets.html", meets = meets_page.items)

if __name__ == "__main__":
	app.debug = True
	with open("../secret.config") as secrets_file:
		secrets = json.load(secrets_file)
		app.secret_key = secrets['app_secret']
	app.run()

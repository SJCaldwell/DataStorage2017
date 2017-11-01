import flask
from flask import render_template, request, flash, session, url_for, redirect
import json
from flask_sqlalchemy import SQLAlchemy
from models import *
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, login_user, logout_user, current_user, login_required
from helpers import pounds_to_kilos, kilos_to_pounds, meets_password_complexity_requirements
from sqlalchemy import desc
import datetime

def grab_db_uri():
	with open("../secret.config") as secrets_file:
		secrets = json.load(secrets_file)
		db_conf = secrets['database']
		return ('postgresql+psycopg2://' + db_conf['user'] + ':' + db_conf['password'] + '@' + db_conf['host'] + '/' + db_conf['dbname'])

app = flask.Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = grab_db_uri()
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
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
		return render_template('register.html', error = "Username already taken.")
	if meets_password_complexity_requirements(request.form['password']):
		user = Users(request.form['username'], request.form['password'], request.form['age'])
		db.session.add(user)
		db.session.commit()
		flash('Registration was successful!')
		return redirect(url_for('login'))
	else:
		return render_template("register.html", error = "Password is not complex enough. Must have one special character, one number, and at least 8 characters.")

@app.route("/login", methods = ['GET', 'POST'])
def login():
	if request.method == 'GET':
		return render_template("login.html")
	username = request.form['username']
	password = request.form['password']
	hashed_pass = bcrypt.generate_password_hash(password).decode('utf-8')
	registered_user = Users.query.filter_by(username=username).first()
	if registered_user is None:
		return render_template('login.html', error = "Username or password is invalid")
	if bcrypt.check_password_hash(registered_user.password, password):
		login_user(registered_user)
		return redirect(request.args.get('next') or url_for('greetings'))
	return render_template('login.html', error = 'Username or password is invalid')

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('greetings'))

@app.route("/profile", methods = ['GET', 'POST'])
@login_required
def profile():
	user_lifts = User_lifts.query.filter_by(user_id = current_user.id).order_by(User_lifts.date).all()
	if request.method == 'GET':
		return render_template("profile.html", username = current_user.username, user_lifts = user_lifts )
	else:
		if request.form['squat'] and request.form['deadlift'] and request.form['bench'] and request.form['weight']:
			squat = float(request.form['squat'])
			bench = float(request.form['bench'])
			deadlift = float(request.form['deadlift'])
			weight = float(request.form['weight'])
			if request.form['is_lbs'] == 'on':
				squat = pounds_to_kilos(squat)
				bench = pounds_to_kilos(bench)
				deadlift = pounds_to_kilos(deadlift)
				weight = pounds_to_kilos(weight)
			date = datetime.datetime.today()
			date = str(date.year) + '-' + str(date.month) + '-' + str(date.day)
			lift = User_lifts(user_id = current_user.id, date = date, bodyweight_kg = weight, bench_kg = bench, squat_kg = squat, deadlift_kg = deadlift, total_kg = bench + squat + deadlift)
			db.session.add(lift)
			db.session.commit()
			success = "lift added!"
			return render_template("profile.html", username = current_user.username, user_lifts = user_lifts ,success = success)
		else:
			error = "Please fill out all of the weights!"
			return render_template("profile.html", username = current_user.username, user_lifts = user_lifts, error = error)

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

@app.route("/lifts")
@login_required
def lifts():
	if request.args.get('gender'):
		gender = request.args.get('gender')
		print(gender)
	best_lifts_page = Athlete_lifts.query.filter('total_kg != 0').order_by(desc(Athlete_lifts.total_kg)).paginate(page = 1, per_page = 20)
	return render_template("lifts.html", best_lifts = best_lifts_page.items)

@app.route("/meets")
@login_required
def meets():
	meets = Meets.query.distinct(Meets.country).all()
	countries = [row.country for row in meets]
	meets_page = Meets.query.order_by(Meets.id).paginate(page = 1, per_page = 20)
	return render_template("meets.html", meets = meets_page.items, countries = countries)

if __name__ == "__main__":
	app.debug = True
	with open("../secret.config") as secrets_file:
		secrets = json.load(secrets_file)
		app.secret_key = secrets['app_secret']
	app.run()
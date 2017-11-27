import flask
from flask import render_template, request, flash, session, url_for, redirect, jsonify
import json
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, login_user, logout_user, current_user, login_required
from sqlalchemy import desc, func
import datetime
import os
import string
from bisect import bisect
from flask_mongoengine import MongoEngine

def grab_db_uri():
	return ('mongodb://' + os.environ['mongo_user'] + ':' + os.environ['mongo_pass'] + '@ds117316.mlab.com:17316/heroku_18ghdm6d')

app = flask.Flask(__name__)
app.config['MONGODB_SETTINGS'] = {'db' : 'heroku_18ghdm6d', 'host':grab_db_uri()}

db = MongoEngine(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

class Meets(db.Document):
	id = db.IntField()
	federation = db.StringField(required = True)
	path = db.StringField(required = True) 
	date = db.DateTimeField()
	country = db.StringField(required = True)
	state = db.StringField(required = True)
	town = db.StringField(required = True)
	name = db.StringField(required = True)
	meta = {'strict': False}

	def __repr__(self):
		return('<Meet %r>' % self.name)

class Athletes(db.Document):
	id = db.IntField()
	name = db.StringField(max_length = 50)
	gender = db.StringField(max_length = 8)
	meta = {'strict': False}

	def __repr__(self):
		return('<Athlete %r>' % self.name)

class Athlete_lifts(db.Document):
	lift_id = db.IntField()
	meet_id = db.IntField()
	athlete_id = db.IntField()
	equipment = db.StringField(max_length = 15)
	age = db.FloatField() 
	division = db.StringField(max_length = 50)
	bodyweight_kg = db.FloatField()
	weightclass_kg = db.StringField(max_length = 32)
	bench_kg = db.FloatField()
	squat_kg = db.FloatField()
	deadlift_kg = db.FloatField()
	total_kg = db.FloatField()
	description = db.FloatField()
	meta = {'strict': False}

	def __repr__(self):
		return('<Athlete lift %d>' % self.lift_id)

	def serialize(self):
		return {'lift_id' : self.lift_id,
				'total_kg' : self.total_kg }


class User_lifts(db.Document):
	id = db.IntField()
	user_id = db.StringField(max_length = 50) 
	age = db.IntField()
	date = db.DateTimeField()
	bodyweight_kg = db.FloatField()
	bench_kg = db.FloatField()
	squat_kg = db.FloatField()
	deadlift_kg = db.FloatField()
	total_kg = db.FloatField()
	equipment = db.StringField(max_length = 30)
	meta = {'strict': False}

	def __repr__(self):
		return('<User lifts %r' % self.user_id)

	def serialize(self):
		return {'date' : self.date,
				'total_kg' : self.total_kg }

class Users(db.Document):
	id = db.IntField()
	username = db.StringField(max_length = 50) 
	password = db.StringField(max_length = 256)
	age = db.IntField()
	current_rival = db.IntField()
	beaten_rivals = db.IntField()
	meta = {'strict': False}
	
	def __repr__(self):
		return ('<User %r>' % self.username)

	def is_authenticated(self):
		return True

	def is_active(self):
		return True

	def is_anonymous(self):
		return False

	def get_id(self):
		return self.username

def pounds_to_kilos(pounds):
	return pounds/2.1

def kilos_to_pounds(kilos):
	return kilos * 2.1

def meets_password_complexity_requirements(password):
	has_num = False
	for char in password:
		if char.isdigit():
			has_num = True
	has_special = False
	for char in password:
		if char in string.punctuation:
			has_special = True
	if has_num and has_special and len(password) >= 8:
		return True
	else:
		return False

def find_rank(aList, val):
	for i in range(len(aList)):
		if val > aList[i]:
			rank = i
			return (len(aList) - i)
	return i

@login_manager.user_loader
def load_user(id):
    return Users.objects.filter(**{"username" : id}).first()

@app.route("/")
def greetings():
	return render_template("index.html")

@app.route("/visualization")
def visualization():
	return render_template("bodyweight_total.html")

@app.route("/bench")
def bench_vis():
	return render_template("bodyweight_bench.html")
@app.route("/deadlift")
def deadlift_vis():
	return render_template("deadlift_total.html")

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
	registered_user = Users.objects.filter(**{"username" : username}).first()
	if registered_user:
		flash('Username was already taken. Please choose another!', 'error')
		return render_template('register.html', error = "Username already taken.")
	if meets_password_complexity_requirements(request.form['password']):
		hashed_password = bcrypt.generate_password_hash(request.form['password']).decode('utf-8')
		Users(username= username, password = hashed_password ,age = request.form['age'],current_rival = None, beaten_rivals = None).save()
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
	registered_user = Users.objects.filter(**{"username" : username}).first()
	if registered_user is None:
		return render_template('login.html', error = "Username or password is invalid")
	if bcrypt.check_password_hash(registered_user.password, password):
		print("Trying to login user")
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
	user_lifts = User_lifts.objects.filter(**{"user_id" : current_user.id}).all()
	if request.method == 'GET':
		return render_template("profile.html", username = current_user.username, user_lifts = user_lifts )
	else:
		if request.form['squat'] and request.form['deadlift'] and request.form['bench'] and request.form['weight']:
			squat = float(request.form['squat'])
			bench = float(request.form['bench'])
			deadlift = float(request.form['deadlift'])
			weight = float(request.form['weight'])
			is_lbs = request.form.get("is_lbs")
			if is_lbs in request.form:
				squat = pounds_to_kilos(squat)
				bench = pounds_to_kilos(bench)
				deadlift = pounds_to_kilos(deadlift)
				weight = pounds_to_kilos(weight)
			date = datetime.datetime.today()
			date = str(date.year) + '-' + str(date.month) + '-' + str(date.day)
			User_lifts(user_id = current_user.id, date = date, bodyweight_kg = weight, bench_kg = bench, squat_kg = squat, deadlift_kg = deadlift, total_kg = bench + squat + deadlift).save()
			success = "lift added!"
			return render_template("profile.html", username = current_user.username, user_lifts = user_lifts ,success = success)
		else:
			error = "Please fill out all of the weights!"
			return render_template("profile.html", username = current_user.username, user_lifts = user_lifts, error = error)


@app.route("/user_lifts")
@login_required
def user_lifts():
	records = User_lifts.query.filter_by(user_id = current_user.id).order_by(User_lifts.date).all()
	records = [lift.serialize() for lift in records]
	return jsonify(records)

@app.route("/strength_distribution", methods = ['GET', 'POST'])
def grab_strength_distribution():
	if request.method == 'GET':
		return redirect(url_for('login'))
	bw = request.form['weight']
	is_lbs = False
	deadlift = request.form['deadlift']
	squat = request.form['squat']
	bench = request.form['bench']
	age = request.form['age']
	gender = request.form['gender']
	if is_lbs:
		bw = pounds_to_kilos(bw)
		deadlift = pounds_to_kilos(deadlift)
		squat = pounds_to_kilos(squat)
		bench = pounds_to_kilos(bench)
	total = float(deadlift) + float(squat) + float(bench)
	athlete_lifts = Athlete_lifts.query.order_by(func.random()).limit(1000)
	lifts = [float(lift.total_kg) for lift in athlete_lifts]
	lifts.sort(reverse = True)
	user_data = {'num_sampled': 1000, 'user_rank' : find_rank(lifts, total)}
	return jsonify(user_data)

@app.route("/get_all_lifts")
def get_all_lifts():
	athletes_lifts = Athlete_lifts.query.all()
	records = [lift.serialize() for lift in athletes_lifts]
	return jsonify(records)

@app.route("/athletes")
@login_required
def athletes():
	athlete_page = Athletes.query
	athlete_name = request.args.get("athlete_name")
	gender = request.args.get("gender")
	if gender:
		if gender == "Men":
			gender = "M"
		elif gender == "Female":
			gender = "F"
		else:
			gender = ""
		athlete_page = athlete_page.filter(Athletes.gender.startswith(gender))
	if athlete_name:
		athlete_page = athlete_page.filter(Athletes.name.startswith(athlete_name))
	athlete_page = athlete_page.order_by(Athletes.id).paginate(page = 1, per_page=20)
	return render_template("athletes.html", athletes=athlete_page.items)

@app.route("/lifts")
@login_required
def lifts():
	weight = request.args.get("weight")
	age = request.args.get("age")
	if weight:
		lower_bound = float(weight) - 10
		upper_bound = float(weight) + 10
	if age:
		age = request.args.get("age")
		lower_bound = float(age) - 5
		upper_bound = float(age) + 5
	best_lifts = Athlete_lifts.objects.order_by('-total_kg').limit(20)
	return render_template("lifts.html", best_lifts = best_lifts)

@app.route("/meets")
@login_required
def meets():
	countries = Meets.objects.distinct('country')
	meet_name = request.args.get("meet_name")
	country = request.args.get("country")
	if country == "All":
		country = None
	if meet_name:
		meets_page = meets_page.filter(Meets.name.startswith(meet_name))
	if country:
		meets_page = meets_page.filter(Meets.country.startswith(country))
	meets = Meets.objects.order_by('id').limit(20)
	return render_template("meets.html", meets = meets, countries = countries)

if __name__ == "__main__":
	app.debug = True
	app.secret_key = os.environ['salty_appsecret']
	app.run(host = "0.0.0.0")

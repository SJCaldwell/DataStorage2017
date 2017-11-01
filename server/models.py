from saltysplatoon import db, bcrypt


class Meets(db.Model):
	id = db.Column(db.Integer, primary_key = True)
	federation = db.Column(db.Text)
	path = db.Column(db.Text) 
	date = db.Column(db.Date)
	country = db.Column(db.String(20))
	state = db.Column(db.String(10))
	town = db.Column(db.Text)
	name = db.Column(db.Text)

	def __repr__(self):
		return('<Meet %r>' % self.name)

class Athletes(db.Model):
	id = db.Column(db.Integer, primary_key = True)
	name = db.Column(db.String(50))
	gender = db.Column(db.String(8))

	def __repr__(self):
		return('<Athlete %r>' % self.name)

class Athlete_lifts(db.Model):
	lift_id = db.Column(db.Integer, primary_key = True)
	meet_id = db.Column(db.Integer, db.ForeignKey('meets.id'))
	athlete_id = db.Column(db.Integer, db.ForeignKey('athletes.id'))
	equipment = db.Column(db.String(15))
	age = db.Column(db.Float) 
	division = db.Column(db.String(50))
	bodyweight_kg = db.Column(db.Float)
	weightclass_kg = db.Column(db.String(32))
	bench_kg = db.Column(db.Float)
	squat_kg = db.Column(db.Float)
	deadlift_kg = db.Column(db.Float)
	total_kg = db.Column(db.Float)
	description = db.Column(db.Text)

	def __repr__(self):
		return('<Athlete lift %d>' % self.lift_id)


class User_lifts(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	age = db.Column(db.Integer)
	date = db.Column(db.Date)
	bodyweight_kg = db.Column(db.Float)
	bench_kg = db.Column(db.Float)
	squat_kg = db.Column(db.Float)
	deadlift_kg = db.Column(db.Float)
	total_kg = db.Column(db.Float)
	equipment = db.Column(db.String(30))

	def __repr__(self):
		return('<User lifts %r' % self.user_id)

	def serialize(self):
		return {'date' : self.date,
				'total_kg' : self.total_kg }

class Users(db.Model):
	id = db.Column(db.Integer, primary_key = True)
	username = db.Column(db.String(20)) 
	password = db.Column(db.String(256))
	age = db.Column(db.Integer)
	current_rival = db.Column(db.Integer, db.ForeignKey('athletes.id')) 
	beaten_rivals = db.Column(db.Integer)

	def __init__(self, username, password, age):
		self.username = username
		self.password = bcrypt.generate_password_hash(password).decode('utf-8')
		self.age = age
	
	def __repr__(self):
		return ('<User %r>' % self.username)

	def is_authenticated(self):
		return True

	def is_active(self):
		return True

	def is_anonymous(self):
		return False

	def get_id(self):
		return self.id

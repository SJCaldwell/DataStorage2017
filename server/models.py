from saltysplatoon import db


class meets(db.model):
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

class athletes(db.model):
	id = db.Column(db.Integer, primary_key = True)
	name = db.Column(db.String(50))
	gender = db.Column(db.String(8))

	def __repr__(self):
		return('<Athlete %r>' % self.name)

class athlete_lifts(db.model):
	lift_id = db.Column(db.Integer, primary_key = True)
	meet_id = db.Column(db.Integer)
	athlete_id = db.Column(db.Integer)
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


class user_lifts(db.model):
	user_id = db.Column(db.Integer)
	age = db.Column(db.Integer)
	date = db.Column(db.Date)
	bodyweight_kg = db.Column(db.Float)
	bench_kg = db.Column(db.Float)
	squat_kg = db.Column(db.Float)
	deadlift_kg = db.Column(db.Float)
	total_kg = db.Column(db.Float)
	equipment = db.Column(db.Float)

	def __repr__(self):
		return('<User lifts %r' % self.user_id)

class users(db.model):
	id = db.Column(db.Integer, primary_key = True)
	username = db.Column(db.String(20)) 
	password = db.Column(db.String(256))
	age = db.Column(db.Integer)
	current_rival = db.Column(db.Integer) 
	beaten_rivals = db.Column(db.Integer)

	def __repr__(self):
		return ('<User %r>' % self.username)
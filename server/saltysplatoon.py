import flask
from flask import render_template
import json
from flask_sqlalchemy import SQLAlchemy
from models import *

def grab_db_uri():
	with open("../secret.config") as secrets_file:
		secrets = json.load(secrets_file)
		db_conf = secrets['database']
		return ('postgresql+psycopg2://' + db_conf['user'] + ':' + db_conf['password'] + '@' + db_conf['host'] + '/' + db_conf['dbname'])

app = flask.Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = grab_db_uri()
db = SQLAlchemy(app)

@app.route("/")
def greetings():
	check = Meets.query.filter_by(id=3).first()
	print(check)
	return render_template("index.html")
		
if __name__ == "__main__":
	app.debug = True
	app.run()

import flask
from flask import render_template
import json
from flask_sqlalchemy import SQLAlchemy

app = flask.Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = grab_db_uri()
db = SQLAlchemy(db)

def grab_db_uri():
	with open("../secret.config") as secret_file:
		secrets = json.load(secrets_file)
		db = secrets['database']
		return ('postgresql+psycopg2://' + db['user'] + ':' + db['password'] + '@' + db['host'] + '/' + db['dbname'])

@app.route("/")
def greetings():
	return render_template("index.html")
		
if __name__ == "__main__":
	app.debug = True
	app.run()

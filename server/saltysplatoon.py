import flask
from flask import render_template
from sqlalchemy import create_engine
import json

app = flask.Flask(__name__)

@app.route("/")
def greetings():
	test_connection()
	return render_template("index.html")

def test_connection():
	with open("../secret.config") as secrets_file:
		secrets = json.load(secrets_file)
		db = secrets['database']
		connection_string = 'postgresql+psycopg2://' + db['user'] + ':' + db['password'] + '@' + db['host'] + '/' + db['dbname']
		engine = create_engine(connection_string)
		
if __name__ == "__main__":
	app.debug = True
	app.run()

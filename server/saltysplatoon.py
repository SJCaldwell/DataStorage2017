import flask
from flask import render_template
import sqlalchemy

app = flask.Flask(__name__)

@app.route("/")
def greeting():
	return render_template("index.html") 

if __name__ == "__main__":
	app.debug = True
	app.run()

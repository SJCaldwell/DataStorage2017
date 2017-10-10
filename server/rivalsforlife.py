import flask

app = flask.Flask(__name__)

@app.route("/")
def greeting():
	return "LET'S GET READY TO LIFT"

if __name__ == "__main__":
	app.debug = True
	app.run()

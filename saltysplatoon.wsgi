#!/usr/bin/python3
import sys
import logging
import json

logging.basicConfig(stream=sys.stderr)
sys.path.insert(0,"/var/www/SaltySplatoon/server")

from saltysplatoon import app as application
with open("../secret.config") as secrets_file:
		secrets = json.load(secrets_file)
		application.secret_key = secrets['app_secret']

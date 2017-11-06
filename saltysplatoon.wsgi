#!/usr/bin/python3
import sys
import logging
import json
import os

logging.basicConfig(stream=sys.stderr)
sys.path.insert(0,"/var/www/SaltySplatoon/server")

from saltysplatoon import app as application
application.secret_key = os.environ['salty_appsecret']

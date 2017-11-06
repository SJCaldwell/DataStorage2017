#!/usr/bin/python3
import sys
import logging
import json
import os
from server.saltysplatoon import app as application

logging.basicConfig(stream=sys.stderr)
application.secret_key = os.environ['salty_appsecret']

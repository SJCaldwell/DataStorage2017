def grab_db_uri():
	return ('postgresql+psycopg2://' + os.environ['salty_user'] + ':' + os.environ['salty_password'] + '@' + os.environ['salty_host'] + '/' + os.environ['salty_dbname'])


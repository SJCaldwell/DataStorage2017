try:
    from setuptools import setup
except ImportError:
    from distutils.core import setup

setup(
  name="SaltySplatoon",
  version="0.1.1",
  packages=['saltysplatoon',],
  license="MIT", 
  long_description=open('README.MD').read(),
  install_requires=[
	"flask==0.12.2",
	"sqlalchemy==1.1.14",
	"psycopg2==2.7.3.1",
	"flask-sqlalchemy==2.3.2",
	"flask-bcrypt==0.7.1",
  ],
)

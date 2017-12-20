FROM ubuntu:latest
MAINTAINER Shane Caldwell "shane.caldwell12@ncf.edu"

ARG buildtime_mongo_user=default_value
ENV mongo_user=$buildtime_mongo_user

ARG buildtime_mongo_pass=default_value
ENV mongo_pass=$buildtime_mongo_pass

ARG buildtime_app_secret=default_value
ENV salty_appsecret=$buildtime_app_secret

EXPOSE 8000

RUN apt-get update -y
RUN apt-get install -y python-pip python-dev build-essential python3-pip gunicorn
COPY . /saltysplatoon
WORKDIR /saltysplatoon
RUN pip3 install -r requirements.txt
ENTRYPOINT ["gunicorn"]
CMD ["salty:application"]

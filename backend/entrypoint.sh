#!/bin/sh
python manage.py migrate &&
uwsgi --ini uwsgi.ini
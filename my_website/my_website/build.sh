#!/usr/bin/env bash
# exit on error
set -o errexit

# Installeer alle benodigde pakketten (Django, Gunicorn, Whitenoise, etc.)
pip install -r requirements.txt

# Verzamel alle statische bestanden (CSS, plaatjes) in de map 'staticfiles'
python manage.py collectstatic --noinput

# Update de database (indien nodig)
python manage.py migrate
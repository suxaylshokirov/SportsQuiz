migrations:
	python3 manage.py makemigrations
	python3 manage.py migrate

run:
	python3 manage.py runserver

superuser:
	python3 manage.py createsuperuser
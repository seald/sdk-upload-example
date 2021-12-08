# Self hostable end-to-end encrypted upload solution

## Todo

- Enable storage on S3
- Derivate differently the password for Seald and Backend
- Enable multi-tab
- Postgres support

## Configuration

| Environment variable          | Default                   | Value
|-------------------------------|---------------------------|---
| DJANGO_SECRET_KEY             | `get_random_secret_key()` | Secret key use by Django
| STORAGE_METHOD                | `fs`                      | `fs`
| STORAGE_FS_BASE_DIR           | `./data/`                 | If `fs` storage method is used, location of uploaded files
| STORAGE_FS_STATIC_URL         | `/data`
| SEALD_APP_ID                  | None                      | Seald API Key / Secret / Configuration. See article
| SEALD_VALIDATION_KEY          | None                      | Seald API Key / Secret / Configuration. See article
| SEALD_VALIDATION_KEY_ID       | None                      | Seald API Key / Secret / Configuration. See article
| SEALD_JWT_SHARED_SECRET_ID    | None                      | Seald API Key / Secret / Configuration. See article
| SEALD_JWT_SHARED_SECRET       | None                      | Seald API Key / Secret / Configuration. See article

| Docker volume       | Description
|---------------------|------------
| `/app/data/`        | Location of uploaded files when using `fs` storage method
| `/app/backend/db/`  | Location of SQLite database

## Docker testing

```
git clone XXXX
cd XXXX
docker build --build-arg SEALD_APP_ID=XXX -t seald/encrypted-upload .
docker run --rm -it -p 8000:8000 seald/encrypted-upload
```

(don't forget to set `SEALD_APP_ID`)

Go to http://localhost:8080/

## Development

```
git clone XXXX
cd XXXX
```

### Backend

1. Go to backend folder: `cd backend`
2. Install requirements: `pip install -r requirements`
3. Migrate database: `python manage.py migrate`
4. Run dev server: `python manage.py runserver`

### Frontend

1. Do all backend tasks
2. Go to frontend folder: `cd frontend`
3. Install requirements: `npm install`
4. Start dev server: `npm run `

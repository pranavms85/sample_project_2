# Margin — personal book review catalogue

A private reading catalogue built with React and FastAPI. Create an account, sign in, and keep your own book reviews, ratings, authors, and genres. Each account can only access its own books.

## What you need

- Python 3.10 or later
- Node.js 20.19 or later
- PostgreSQL running locally

## 1. Create the PostgreSQL database

In pgAdmin or `psql`, create a database named `sample_project_2`. The app creates its `users` and `books` tables the first time the backend starts.

## 2. Start the backend (Windows PowerShell)

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Open `backend/.env` and set `DATABASE_URL` to match your local PostgreSQL username and password. Replace `SECRET_KEY` with a long random value. Example:

```text
DATABASE_URL=postgresql+psycopg://postgres:your_password@localhost:5432/sample_project_2
SECRET_KEY=a-long-random-secret-for-local-development
```

Then start the API:

```powershell
uvicorn app.main:app --reload
```

The API is at `http://localhost:8000`. Interactive API documentation is at `http://localhost:8000/docs`.

## 3. Start the frontend

In another PowerShell window:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`), then register an account.

## Beginner notes

- `backend/app/routes/auth.py` handles registration, sign-in, and the current-user endpoint.
- `backend/app/routes/books.py` contains the protected book catalogue endpoints.
- `backend/app/models.py` describes the PostgreSQL tables; `schemas.py` validates API input and output.
- `frontend/src/App.jsx` contains the screens and catalogue interactions; `frontend/src/api.js` is the small API helper.
- A bearer token is stored in browser local storage after sign-in and sent with book requests. Passwords are hashed before they are saved.
- The backend reads configuration from `backend/.env`. Do not commit `.env`; `.gitignore` excludes it.
- `FRONTEND_ORIGINS` is a comma-separated list. It includes both `localhost` and `127.0.0.1` for the default Vite setup.

This starter uses SQLAlchemy's `create_all` for local development. For a production deployment, add database migrations, HTTPS, a managed secret, and a more complete account recovery flow.

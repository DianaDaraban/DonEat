# DonEat

A full-stack web app that reduces food waste. Shops, restaurants and individuals post surplus food — at a reduced price or as a donation — and buyers reserve it before it expires.

**Live demo:** https://doneat.vercel.app
_The API runs on Render's free tier and sleeps when idle, so the first request can take up to a minute._

### Demo accounts

| Role | Username | Password |
| --- | --- | --- |
| Buyer | `demo_buyer` | `DonEat-demo-2026` |
| Vendor | `food_mania` (also `food_company`, `mama_food`) | `DonEat-demo-2026` |

Demo data is restored every time the server starts, so feel free to try everything.

## Features

- **Offers feed** with category filters, sorting, search and a map to search by area (Leaflet)
- **Product and store pages**, wishlist, cart (also for guests) and checkout
- **Orders** for buyers; order management and a dashboard with statistics for vendors
- **Accounts** with JWT authentication (login by email or username) and password reset by email
- **Notifications** in the app and by email: account created, order placed, order delivered, wishlist item expiring
- Listings disappear from the public feed automatically once they expire

## Tech stack

| | |
| --- | --- |
| **Backend** | Python, Django 6, Django REST Framework, SimpleJWT, WhiteNoise |
| **Frontend** | React 19, TypeScript, Vite, React Router, Axios, Leaflet, Tailwind CSS, SCSS Modules |
| **Database** | SQLite (local) / PostgreSQL (production, via `DATABASE_URL`) |
| **Hosting** | Vercel (frontend), Render (API) |

## Project structure

```
backend/
  backend/        Django settings and root URLs
  api/            products, categories, cart, checkout, orders, wishlist, vendor dashboard
  accounts/       users, profiles (buyer / vendor), stores, password reset
  notifications/  in-app notifications, HTML emails, user notification settings
  start.sh        production start: migrate, collectstatic, seed demo data, gunicorn
frontend/
  src/pages/      one folder per page (home, product, store, cart, checkout, dashboard...)
  src/context/    auth, cart, wishlist, notifications and dashboard state
```

## Run locally

Requirements: Python 3.12+, Node.js 20+.

**Backend** (http://127.0.0.1:8000)

```bash
cd backend
python -m venv venv
venv\Scripts\activate            # macOS / Linux: source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo       # demo stores, products and accounts
python manage.py runserver
```

**Frontend** (http://localhost:5173)

```bash
cd frontend
cp .env.example .env             # VITE_API_URL=http://127.0.0.1:8000
npm install
npm run dev
```

### Demo data

`python manage.py seed_demo` creates the demo stores, products and accounts listed above. It is safe to run again at any time: it adds whatever is missing and moves the demo products' expiry dates 7–90 days into the future, so the offers feed never goes empty. Products and accounts created by real users are not touched.

## Deployment

**API on Render** (Web Service, root directory `backend`)

- Build command: `pip install -r requirements.txt`
- Start command: `bash start.sh`

| Variable | Value |
| --- | --- |
| `SECRET_KEY` | a long random string |
| `DEBUG` | `False` |
| `ALLOWED_HOSTS` | the Render host, e.g. `doneat-1.onrender.com` |
| `CORS_ALLOWED_ORIGINS` | the frontend URL, e.g. `https://doneat.vercel.app` |
| `FRONTEND_URL` | the frontend URL (used in email links) |
| `DATABASE_URL` | optional PostgreSQL URL; without it the app uses SQLite, recreated and re-seeded on every start |
| `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD` | Gmail address and app password for outgoing email |
| `DEMO_PASSWORD` | optional, password for the demo accounts |

**Frontend on Vercel**: set `VITE_API_URL` to the API URL, e.g. `https://doneat-1.onrender.com`.

## Why DonEat

Food waste is a global problem, and platforms like Olio, Too Good To Go and FoodCloud show how much technology can help. DonEat brings the idea to local communities as an open-source project.

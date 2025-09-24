# DonEat
A web app that reduces food waste through local donations. Donors can post items, while people in need can easily reserve them.


DonEat is a full-stack educational project with real-world impact potential.
The goal is to connect food donors (individuals, restaurants, shops) with people or organizations in need.
Donors can post surplus food items, and recipients can browse, filter, and reserve them before they expire.
The project aims to raise awareness about food waste while providing a scalable solution for local communities.

Features (MVP)
- User registration & authentication (JWT)
- Donors can create food listings with details and expiration
- Recipients can browse available items
- Listings auto-expire after a set period
- Basic dashboard for managing donations

Other futures:
- Image uploads for listings
- Notifications (email/SMS)
- Filtering by location & category
- NGO integration
- Maps & pickup points
- Rating system for trust & quality

Tech Stack
**Backend:** Python, Flask, SQLAlchemy, JWT
**Frontend:** React, Vite, TailwindCSS
**Database:** SQLite (dev) / PostgreSQL (prod)
**Deployment:** Railway/Render (backend), Vercel/Netlify (frontend)
**Extras:** Docker (optional), Cloudinary for images

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git


### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate # or venv\Scripts\activate on Windows
pip install -r requirements.txt
flask db init
flask db migrate
flask db upgrade
python app.py
```


### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Testing
- Use Postman to test backend routes (`/register`, `/login`, `/listings`).
- Frontend will connect via Axios to the backend API.

## Roadmap (6 months)
1. **MVP Backend:** User, Listing, Auth
2. **Frontend static pages:** login/register, feed, create listing
3. **Integration:** connect React with Flask API
4. **Extra features:** images, notifications, filters, profile dashboard
5. **Deployment:** live demo on Railway + Vercel
6. **Community feedback & iteration**

## Inspiration
Food waste is a global problem, and similar platforms like Olio, TooGoodToGo, and FoodCloud show the potential of technology to create real impact. **DonEat** brings this idea into an open-source, community-driven context.
  

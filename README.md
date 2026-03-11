# OTD
A full-stack Online Traffic Division system with a Node/Express backend and a React/Vite frontend.

## What is operational now
- Frontend and backend are wired together via Vite proxy (`/api` -> `http://localhost:5000`).
- Authentication flow is integrated (`/login` + protected driver/officer routes).
- Driver pages: dashboard, my license, my fines, book appointment.
- Officer pages: dashboard, license lookup, issue fine.
- Public pages: home, appointments, fines, license lookup.

## Project structure
- `backend/`: Express API, JWT auth, role checks, Mongo models/routes/controllers
- `frontend/`: React SPA with React Query, Axios client, protected route handling

## Quick start (run full system)
### 1) Backend
```bash
cp backend/.env.example backend/.env
# edit backend/.env and set:
# - MONGODB_URI
# - JWT_SECRET

npm --prefix backend install
npm --prefix backend run dev
```
Backend runs on `http://localhost:5000`.

### 2) Frontend
Open a second terminal:
```bash
npm --prefix frontend install
npm --prefix frontend run dev
```
Frontend runs on `http://localhost:5173`.

The frontend defaults to `baseURL=/api`, so requests are proxied to backend automatically in development.

## Notes
- If `JWT_SECRET` is missing, auth endpoints intentionally fail closed.
- If `MONGODB_URI` is missing, DB-backed functionality will not work.
- For production, set `VITE_API_URL` to your backend URL.

## Core API areas
- Auth: `/auth/register`, `/auth/login`
- License: `/license/me`, `/license/lookup/:idNumber`
- Fines: `/fines/my`, `/fines/issue`, `/fines/pay/:fineId`
- Appointments: `/appointments`, `/appointments/my`

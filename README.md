# OTD
A mock system being built for Tasks that should be easily managed electronically by one of the most important departments in the country.

This repository contains a **Node/Express backend** with MongoDB and a **React/Vite frontend**. It implements user roles (driver, officer, admin), license lookups, fine management, and appointment scheduling.

## Key features
- JWT authentication with role-based authorization
- Redis-capable caching for license lookups (in-memory fallback)
- Request validation and centralized error handling
- Pagination on list endpoints
- Express middleware: rate limiting, helmet, compression, logging
- MongoDB indexes for common queries
- React frontend with code-splitting and React Query for data fetching

## Getting started

### Backend

1. Copy `.env.example` to `.env` and fill in values.
2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Run tests (requires npm available):
   ```bash
   npm test
   ```
4. Start server:
   ```bash
   npm run dev        # development with nodemon
   npm start          # production mode
   ```

### Frontend

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```
3. The app will be available at `http://localhost:5173` (or as Vite reports).


### Hosting the site from one server

To host the frontend and backend together, build the frontend and run the backend server from the repository root:

```bash
npm run build
npm start
```

When `frontend/dist` exists, the backend serves it as static files and falls back to `index.html` for non-API routes. API routes stay available under `/auth`, `/license`, `/fines`, and `/appointments`.

### Environment variables
See `backend/.env.example` for information on required configuration. The frontend uses `VITE_API_URL` to point to the backend.

### Notes
- For caching in production, set `REDIS_URL` to a Redis instance; otherwise the app will use a simple in-memory map.
- React Query is used on the frontend to cache and manage server state.

Enjoy hacking on this project!

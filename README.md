# CampusMarket

> **Project Management 3 (PRM372S)**  
> Cape Peninsula University of Technology (CPUT)  
> Faculty of Informatics & Design

CampusMarket is a mobile-first campus marketplace web app where students and staff can buy and sell products, post campus notices, and manage transactions in a trusted university-focused space.

---

## What this project is about

CampusMarket helps the CPUT community:

- Buy and sell second-hand items (textbooks, electronics, essentials, and more)
- Publish bulletin board posts with expiry dates
- Keep marketplace actions tied to authenticated users
- Support a safer, more structured campus trading flow

## Core features

- User authentication and protected routes
- Product listing and product browsing
- Bulletin board posts (`/api/bulletin_posts`)
- Transaction creation with escrow-style status flow (`/api/transactions`)
- Mobile-first frontend UI

### Marketplace imagery

Original local SVG illustrations in `frontend/src/assets/campus` show student
book exchanges, scientific calculators, lab coats, drawing tools, printing,
and residence essentials. The marketplace banner and authentication screens
use the campus trading scene. Demo listings and listing-form presets use
illustrations; live listings retain sellers' images. For real listings, use a
photo of the actual item. Failed images display a neutral "Photo unavailable"
placeholder rather than a photo of an unrelated product.

## Tech stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Data/Auth:** Supabase

## Project structure

```text
Campus-Market/
├── backend/     # Express API (TypeScript)
├── frontend/    # React app (Vite + TypeScript)
└── README.md
```

## Prerequisites

Make sure you have:

- Node.js (LTS recommended)
- npm
- A Supabase project (URL, anon key, and service role key)

## Environment variables

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend (`backend/.env`)

```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Installation

From the project root:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

## Running the project

### Run frontend + backend together

```bash
npm run dev
```

### Run separately

```bash
npm run backend
npm run frontend
```

## Available scripts

At project root:

- `npm run dev` — run frontend and backend concurrently
- `npm run backend` — run backend dev server
- `npm run frontend` — run frontend dev server

Backend (`backend/package.json`):

- `npm run dev --prefix backend` — start API in watch mode
- `npm run build --prefix backend` — compile TypeScript
- `npm run start --prefix backend` — run compiled backend

Frontend (`frontend/package.json`):

- `npm run dev --prefix frontend` — start Vite dev server
- `npm run build --prefix frontend` — build frontend
- `npm run preview --prefix frontend` — preview production build

## API overview

Base URL (local): `http://localhost:5000`

- `GET /api/products` — fetch products
- `POST /api/products` — create product (auth required)
- `GET /api/bulletin_posts` — fetch active bulletin posts
- `POST /api/bulletin_posts` — create bulletin post (auth required)
- `POST /api/transactions` — create transaction records (auth required)

## Deployment notes

- Update backend CORS `allowedOrigins` in `backend/server.ts` for your frontend domain(s)
- Ensure frontend `VITE_API_URL` points to your deployed backend
- Keep the backend `SUPABASE_SERVICE_ROLE_KEY` private (server-side only)

## License

ISC

# Represent

A social platform for sharing the work of local administration representatives and collecting resident feedback.

## Stack

- Frontend: React, CSS
- Backend: Node.js, Express.js, Mongoose
- Database: MongoDB

## Frontend

```bash
npm install
npm run dev
```

The UI currently uses in-memory mock data. Demo accounts:

- Resident: `resident@gmail.com` / `resident`
- Akim: `akim@represent.kz` / `akim`
- Admin: `admin@represent.kz` / `admin`

## Backend (Week 1)

MongoDB database: `represent`

```bash
cd server
copy .env.example .env
npm install
npm run seed
npm run dev
```

- `GET http://localhost:5000/api/health` — connection status
- `GET http://localhost:5000/api/db` — collection counts and sample documents

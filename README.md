# Cultivated Trivia Night Management App

A sleek, real-time trivia management system built for distilleries.

## Features
- **Team Registration**: Mobile-friendly signup with player management.
- **Host Dashboard**: Real-time score entry and game flow management.
- **Live Display**: High-visibility, projection-optimized scoreboard.
- **Admin Panel**: Season/Week management and QR code generation.
- **Real-time Updates**: Instant score syncing via Socket.io.

## Tech Stack
- **Frontend**: React, Vite, CSS Variables (Custom Distillery Theme)
- **Backend**: Node.js, Express (v5), Socket.io
- **Database**: PostgreSQL (via Supabase & Prisma)
- **Auth**: JWT-based secure access for Host/Admin.

## Setup Instructions

### 1. Prerequisites
- Node.js (v20+)
- npm
- Supabase Account (for Production)

### 2. Local Setup
```bash
cd server
npm install
# For local dev, you can still use SQLite by changing provider to "sqlite" in schema.prisma
# Or connect to a local Postgres instance
npm start
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

### 4. Admin Access
- **Host Dashboard**: `/host`
- **Admin Panel**: `/admin`
- **Default Password**: (Set via `ADMIN_PASSWORD` env var)

## Deployment (Render)
1. **Database**: Create a project on [Supabase](https://supabase.com).
2. **Environment Variables**:
   - `DATABASE_URL`: Transaction Pooler URI (port 6543) + `?pgbouncer=true`
   - `DIRECT_URL`: Direct/Session URI (port 5432)
   - `ADMIN_PASSWORD`: Your secret password
   - `JWT_SECRET`: Random string for security
   - `NODE_ENV`: `production`

### Iframe Embed Code
To embed the live display on your website:
```html
<iframe 
  src="https://trivia.cultivatedcocktails.com/live" 
  width="100%" 
  height="600" 
  frameborder="0"
></iframe>
```

To embed the signup form:
```html
<iframe 
  src="https://trivia.cultivatedcocktails.com/register" 
  width="100%" 
  height="800" 
  frameborder="0"
></iframe>
```

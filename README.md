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
- **Backend**: Node.js, Express, Socket.io
- **Database**: SQLite (via Prisma)
- **Auth**: JWT-based secure access for Host/Admin.

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- npm

### 2. Backend Setup
```bash
cd server
npm install
npx prisma migrate dev --name init
npm run seed  # Optional: Adds initial test data
npm start
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

### 4. Admin Access
- **Host/Admin URL**: `http://localhost:5173/host` or `http://localhost:5173/admin`
- **Default Password**: `distillery_trivia_2024` (Change in `server/.env`)

## Deployment
### Environment Variables
Create a `.env` file in the `server` directory:
```env
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="your_secure_password"
JWT_SECRET="your_jwt_secret"
PORT=3001
```

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

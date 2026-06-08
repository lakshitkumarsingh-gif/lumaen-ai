# LUMAEN Setup Guide

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- Google OAuth credentials

## Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/lakshitkumarsingh-gif/lumaen-ai.git
cd lumaen-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup

Create `.env.local` in the root:
```bash
cp .env.example .env.local
```

Fill in your Google OAuth credentials:
- Get `NEXT_PUBLIC_GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` from [Google Cloud Console](https://console.cloud.google.com)

### 4. Start Local Services

Using Docker Compose:
```bash
docker-compose up -d
```

This starts PostgreSQL and Redis.

### 5. Run Development Server

```bash
npm run dev
```

This starts both frontend and backend:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable OAuth 2.0
4. Create OAuth 2.0 credentials (Web Application)
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `http://localhost:3000/api/auth/signin`
6. Copy Client ID and Secret to `.env.local`

## Database Setup

PostgreSQL schema will be auto-initialized on first run.

## API Routes

- `POST /api/chat` - Send message to AI
- `GET /api/memories` - Get user memories
- `GET /api/user` - Get user profile

## Deployment

See `docs/DEPLOYMENT.md` for production deployment guide.

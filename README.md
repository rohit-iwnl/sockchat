# SockChat

A real-time chat application built with Spring Boot (backend) and Next.js (frontend) using WebSockets.

## Architecture

- **Backend**: Spring Boot with WebSocket support (STOMP over SockJS)
- **Frontend**: Next.js with shadcn/ui components
- **Deployment**: Backend on Docker/DigitalOcean Droplet, Frontend on Vercel

## Local Development

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

The backend will run on `http://localhost:8080`

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

The frontend will run on `http://localhost:3000`

## Deployment

### Backend (DigitalOcean Droplet)

1. Copy `.env.example` to `.env` and configure:
   ```bash
   BACKEND_PORT=8080
   CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
   ```

2. Build and run with Docker Compose:
   ```bash
   docker-compose up -d
   ```

### Frontend (Vercel)

1. Push your code to GitHub

2. Import project to Vercel

3. Add environment variable in Vercel dashboard:
   - `NEXT_PUBLIC_WS_URL`: Your backend URL (e.g., `https://your-droplet-ip:8080` or `https://api.yourdomain.com`)

4. Deploy

## Environment Variables

### Backend
- `CORS_ALLOWED_ORIGINS`: Comma-separated list of allowed origins (default: `http://localhost:3000`)
- `BACKEND_PORT`: Port for the backend service (default: `8080`)

### Frontend
- `NEXT_PUBLIC_WS_URL`: WebSocket backend URL (default: `http://localhost:8080`)

## Features

- Real-time messaging with WebSockets
- Join/Leave notifications
- Message history
- Connection status indicator
- Responsive UI with shadcn/ui components


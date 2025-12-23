# Development Setup Guide

## Quick Start with Docker (Recommended)

The easiest way to get started is using Docker Compose:

```bash
# Clone the repository
git clone https://github.com/andrewyk/testing_mcp.git
cd testing_mcp

# Start all services
docker-compose up

# The application will be available at:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:5000
# - PostgreSQL: localhost:5432
```

## Manual Setup

### Prerequisites

- Node.js 20+ and npm
- PostgreSQL 16+
- Git

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Edit `.env` with your database credentials:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://localhost:5432/todoapp
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

5. Create the database:
```bash
createdb todoapp
```

6. Start the development server:
```bash
npm run dev
```

The backend API will be available at http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory (in a new terminal):
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create environment file:
```bash
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

4. Start the development server:
```bash
npm run dev
```

The frontend application will be available at http://localhost:3000

## Database Setup

### Using PostgreSQL locally

1. Install PostgreSQL:
```bash
# macOS
brew install postgresql@16

# Ubuntu/Debian
sudo apt-get install postgresql-16

# Windows
# Download from https://www.postgresql.org/download/windows/
```

2. Start PostgreSQL:
```bash
# macOS
brew services start postgresql@16

# Ubuntu/Debian
sudo systemctl start postgresql

# Windows
# PostgreSQL should start automatically
```

3. Create database and user:
```bash
# Create database
createdb todoapp

# Or using psql
psql postgres
CREATE DATABASE todoapp;
\q
```

### Using Docker for PostgreSQL only

If you only want to use Docker for the database:

```bash
docker run --name todo-postgres \
  -e POSTGRES_DB=todoapp \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:16-alpine
```

## Development Workflow

### Running Tests

Backend tests:
```bash
cd backend
npm test
```

Frontend tests:
```bash
cd frontend
npm test
```

### Linting

Check code quality:
```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

Format code:
```bash
# Backend
cd backend
npm run format

# Frontend
cd frontend
npm run format
```

### Building for Production

Backend:
```bash
cd backend
npm run build
```

Frontend:
```bash
cd frontend
npm run build
```

## Common Issues and Solutions

### Port Already in Use

If port 3000 or 5000 is already in use:

```bash
# Find process using the port
lsof -i :3000  # or :5000

# Kill the process
kill -9 <PID>
```

Or change the port in the respective configuration files.

### Database Connection Issues

1. Verify PostgreSQL is running:
```bash
pg_isready
```

2. Check DATABASE_URL in `.env`:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/todoapp
```

3. Verify database exists:
```bash
psql -l | grep todoapp
```

### Module Not Found Errors

Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors

Ensure the CORS_ORIGIN in backend/.env matches your frontend URL:
```env
CORS_ORIGIN=http://localhost:3000
```

## Environment Variables

### Backend (.env)

Required:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens (use a strong random string in production)

Optional:
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `JWT_EXPIRE`: JWT expiration time (default: 7d)
- `CORS_ORIGIN`: Allowed CORS origin (default: http://localhost:3000)

### Frontend (.env)

Optional:
- `VITE_API_URL`: Backend API URL (default: /api, proxied by Vite)

## Docker Commands

### Start all services:
```bash
docker-compose up
```

### Start in detached mode:
```bash
docker-compose up -d
```

### View logs:
```bash
docker-compose logs -f
```

### Stop all services:
```bash
docker-compose down
```

### Rebuild containers:
```bash
docker-compose up --build
```

### Reset database:
```bash
docker-compose down -v
docker-compose up
```

## Database Migrations

The application uses Sequelize ORM with automatic synchronization in development mode.

To manually sync the database:
```bash
cd backend
npm run dev  # Models will sync automatically
```

For production, you should use proper migrations instead of auto-sync.

## API Testing

### Using curl:

Register a user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"Test User"}'
```

Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

Create a task:
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"My first task","priority":"high"}'
```

### Using Postman or Insomnia

Import the API endpoints:
- Base URL: http://localhost:5000/api
- Set Authorization header: `Bearer YOUR_TOKEN`

## Troubleshooting

### Clear browser storage

If you encounter authentication issues:
1. Open browser DevTools (F12)
2. Go to Application > Storage
3. Clear Local Storage for localhost:3000

### Reset development environment

```bash
# Stop all services
docker-compose down -v

# Remove node_modules
rm -rf backend/node_modules frontend/node_modules

# Reinstall
cd backend && npm install
cd ../frontend && npm install

# Restart
docker-compose up
```

## Next Steps

1. Create an account at http://localhost:3000/register
2. Log in and start creating tasks
3. Explore the different views (All Tasks, Today, Upcoming)
4. Try different priority levels and due dates
5. Check out the API documentation in README.md

## Getting Help

- Check the main [README.md](README.md) for more information
- Review the [API Documentation](README.md#api-documentation)
- Open an issue on GitHub for bugs or feature requests

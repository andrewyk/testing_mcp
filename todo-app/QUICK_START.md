# Quick Start Guide

## Running with Docker (Easiest)

### Prerequisites
- Docker and Docker Compose installed

### Steps

1. **Start the application**
   ```bash
   cd todo-app
   docker-compose up --build
   ```

   This will start:
   - PostgreSQL database on port 5432
   - Redis on port 6379
   - Backend API on port 3000
   - Frontend on port 3001

2. **Access the application**
   - Open your browser to http://localhost:3001
   - Create an account on the register page
   - Start creating tasks!

3. **Stop the application**
   ```bash
   docker-compose down
   ```

## Running Locally

### Prerequisites
- Node.js 20+ and npm
- PostgreSQL 16+
- Redis 7+ (optional)

### Backend Setup

1. **Create database**
   ```bash
   createdb todo_app
   ```

2. **Run migrations**
   ```bash
   cd todo-app/backend
   psql -d todo_app -f migrations/001_initial_schema.sql
   ```

3. **Install dependencies and start**
   ```bash
   npm install
   cp .env.example .env
   # Edit .env file with your settings
   npm run dev
   ```

   Backend will run on http://localhost:3000

### Frontend Setup

1. **Install dependencies and start**
   ```bash
   cd todo-app/frontend
   npm install
   npm run dev
   ```

   Frontend will run on http://localhost:3001

## Testing the Application

### Create Your First Task

1. Register a new account or login
2. Click "New Task" button
3. Fill in:
   - Title: "Complete project documentation"
   - Priority: High
   - Due Date: Tomorrow
   - Add a tag: "documentation"
4. Click "Create Task"
5. Your task appears in the list!

### Try Different Features

- **Complete a task**: Click the checkbox next to a task
- **Filter tasks**: Use the sidebar to filter by status or priority
- **Search**: Use the search bar to find tasks
- **Create projects**: Add projects to organize your tasks
- **Add tags**: Create custom tags for flexible organization

## API Testing

### Using curl

```bash
# Register a user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Create a task (replace TOKEN with JWT from login)
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"My first task","priority":"high"}'

# Get all tasks
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer TOKEN"
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials in .env
- Verify database exists: `psql -l | grep todo_app`

### Frontend Not Loading
- Check if backend is running on port 3000
- Verify VITE_API_URL in frontend .env
- Clear browser cache and reload

### Docker Issues
- Ensure ports 3000, 3001, 5432, 6379 are not in use
- Run `docker-compose down -v` to clean volumes
- Check logs: `docker-compose logs backend`

## Next Steps

- Explore the codebase in `todo-app/`
- Read full documentation in `todo-app/README.md`
- Customize the application for your needs
- Deploy to production with Docker

## Support

For issues or questions, please open an issue on GitHub.

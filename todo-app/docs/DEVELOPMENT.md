# Development Guide

## Getting Started

### Prerequisites
- Node.js 20+ and npm
- PostgreSQL 16+
- Redis 7+ (optional but recommended)
- Git
- Docker and Docker Compose (for containerized development)

### Environment Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd todo-app
```

2. **Backend Setup**
```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env

# Run database migrations
psql -d todo_app -f migrations/001_initial_schema.sql
```

3. **Frontend Setup**
```bash
cd frontend

# Install dependencies
npm install

# Create .env file (optional)
echo "VITE_API_URL=http://localhost:3000/api" > .env
```

## Development Workflow

### Running the Application

#### Option 1: Docker (Recommended)
```bash
# Start all services
docker-compose up

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop all services
docker-compose down

# Clean everything (including volumes)
docker-compose down -v
```

#### Option 2: Local Development

Terminal 1 - Database:
```bash
# Start PostgreSQL
brew services start postgresql  # macOS
sudo systemctl start postgresql # Linux

# Start Redis
redis-server
```

Terminal 2 - Backend:
```bash
cd backend
npm run dev
```

Terminal 3 - Frontend:
```bash
cd frontend
npm run dev
```

### Code Structure

#### Backend Structure
```
backend/
├── src/
│   ├── config/          # Database and Redis configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── models/          # Data models (if needed)
│   ├── routes/          # API route definitions
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   └── server.ts        # Application entry point
├── migrations/          # Database migrations
├── __tests__/          # Test files
└── package.json
```

#### Frontend Structure
```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── services/       # API service layer
│   ├── stores/         # State management
│   ├── types/          # TypeScript types
│   ├── styles/         # CSS files
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
└── package.json
```

## Development Best Practices

### Code Style

#### TypeScript
- Use strict mode
- Define interfaces for all data structures
- Avoid `any` type
- Use async/await instead of promises

#### React
- Use functional components with hooks
- Keep components small and focused
- Use TypeScript for prop types
- Follow React naming conventions

#### Backend
- Use async/await for asynchronous operations
- Validate all inputs with Joi
- Use try-catch blocks for error handling
- Log errors with context

### Git Workflow

1. **Create feature branch**
```bash
git checkout -b feature/task-attachments
```

2. **Make changes and commit**
```bash
git add .
git commit -m "Add file attachment support to tasks"
```

3. **Push and create PR**
```bash
git push origin feature/task-attachments
```

### Commit Message Format
```
<type>: <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Example:
```
feat: Add file attachment support to tasks

- Add file upload endpoint
- Update task model to support attachments
- Add UI for file upload
- Implement file validation

Closes #123
```

## Testing

### Running Tests

#### Backend Tests
```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

#### Frontend Tests
```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Writing Tests

#### Backend Test Example
```typescript
describe('Task Controller', () => {
  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Task',
          priority: 'high',
        });

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('Test Task');
    });
  });
});
```

#### Frontend Test Example
```typescript
import { render, screen } from '@testing-library/react';
import TaskList from './TaskList';

describe('TaskList', () => {
  it('renders task list', () => {
    const tasks = [
      { id: 1, title: 'Test Task', priority: 'high' },
    ];

    render(<TaskList tasks={tasks} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });
});
```

## Database Management

### Creating Migrations

1. **Create a new migration file**
```bash
cd backend/migrations
touch 002_add_attachments.sql
```

2. **Write migration SQL**
```sql
-- Add attachments table
CREATE TABLE attachments (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  task_id INTEGER REFERENCES tasks(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

3. **Run migration**
```bash
psql -d todo_app -f migrations/002_add_attachments.sql
```

### Database Backup

```bash
# Backup
pg_dump todo_app > backup.sql

# Restore
psql todo_app < backup.sql
```

### Reset Database

```bash
# Drop and recreate database
dropdb todo_app
createdb todo_app

# Run migrations
psql -d todo_app -f migrations/001_initial_schema.sql
```

## Debugging

### Backend Debugging

#### Using VS Code
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/backend/src/server.ts",
      "preLaunchTask": "tsc: build - backend/tsconfig.json",
      "outFiles": ["${workspaceFolder}/backend/dist/**/*.js"]
    }
  ]
}
```

#### Using console.log
```typescript
console.log('Debug:', { userId, taskId });
```

#### Using Node Inspector
```bash
node --inspect-brk dist/server.js
```

### Frontend Debugging

#### Using React DevTools
- Install React DevTools browser extension
- Inspect component state and props

#### Using Browser Console
```typescript
console.log('Debug:', { tasks, loading });
```

#### Using VS Code
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:3001",
      "webRoot": "${workspaceFolder}/frontend/src"
    }
  ]
}
```

## Common Issues

### Port Already in Use
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Database Connection Issues
```bash
# Check PostgreSQL status
pg_isready

# Check connection
psql -d todo_app -c "SELECT 1"
```

### Frontend Build Issues
```bash
# Clear cache
rm -rf node_modules
rm package-lock.json
npm install
```

### TypeScript Errors
```bash
# Rebuild TypeScript
npm run build
```

## Performance Optimization

### Backend
- Use database indexes
- Implement caching with Redis
- Use connection pooling
- Optimize database queries
- Use pagination for large datasets

### Frontend
- Use React.memo for expensive components
- Implement code splitting
- Optimize images
- Use lazy loading
- Minimize bundle size

## Security Checklist

- [ ] All inputs validated
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Rate limiting enabled
- [ ] HTTPS enforced
- [ ] Secrets not committed
- [ ] Dependencies up to date
- [ ] Error messages don't leak info
- [ ] Authentication required

## Code Review Checklist

- [ ] Code follows style guide
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] No console.log in production code
- [ ] Error handling implemented
- [ ] Performance considered
- [ ] Security reviewed
- [ ] Backwards compatible

## Useful Commands

### Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm test             # Run tests
npm run lint         # Lint code
npm run format       # Format code
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm test             # Run tests
npm run lint         # Lint code
```

### Docker
```bash
docker-compose up           # Start all services
docker-compose down         # Stop all services
docker-compose logs -f      # View logs
docker-compose ps           # List containers
docker-compose restart      # Restart services
```

## Getting Help

- Check documentation in `docs/` directory
- Search existing issues on GitHub
- Ask questions in team chat
- Review API documentation

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Write tests
5. Update documentation
6. Submit pull request

See CONTRIBUTING.md for detailed guidelines.

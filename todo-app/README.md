# Comprehensive Todo Application

A modern, full-featured task management application built with React, TypeScript, Node.js, Express, and PostgreSQL.

## Features

### Core Features
- ✅ **Task Management**: Create, edit, delete, and complete tasks
- 📊 **Priority Levels**: High, Medium, Low, and No Priority with color indicators
- 📅 **Due Dates**: Set and track task deadlines
- 📁 **Projects**: Organize tasks into projects and categories
- 🏷️ **Tags**: Flexible tagging system for task organization
- 🔍 **Search & Filter**: Find tasks quickly with search and multiple filters
- 👤 **User Authentication**: Secure JWT-based authentication
- 🌓 **Dark Mode**: Full dark mode support

### Task Properties
- Title and description with markdown support
- Priority levels (High, Medium, Low, None)
- Status tracking (Not Started, In Progress, Waiting, Blocked, Completed)
- Due dates and timestamps
- Estimated and actual time tracking
- Project assignment
- Tag associations
- Task completion tracking

### Organization
- Custom projects with colors and icons
- Hierarchical project structure (nested projects)
- Custom tags with color coding
- Smart filters by status, priority, project, and tags
- Search across task titles and descriptions

### User Interface
- Clean, modern design with Tailwind CSS
- Responsive layout (mobile, tablet, desktop)
- Intuitive task creation and editing
- Visual priority indicators
- Quick task completion toggle
- Sidebar navigation

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **TanStack Query** for data fetching
- **Zustand** for state management
- **Axios** for HTTP requests
- **date-fns** for date formatting
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** for database
- **Redis** for caching (optional)
- **JWT** for authentication
- **bcrypt** for password hashing
- **Joi** for validation
- **Helmet** for security headers
- **CORS** for cross-origin requests

### DevOps
- **Docker** and **Docker Compose**
- **nginx** for frontend serving
- Database migrations
- Environment-based configuration

## Getting Started

### Prerequisites
- Node.js 20+ and npm
- PostgreSQL 16+
- Redis (optional, for caching)
- Docker and Docker Compose (for containerized deployment)

### Installation

#### Option 1: Docker (Recommended)

1. Clone the repository
```bash
git clone <repository-url>
cd todo-app
```

2. Start all services with Docker Compose
```bash
docker-compose up --build
```

3. Access the application
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

#### Option 2: Local Development

1. **Set up the database**
```bash
# Create PostgreSQL database
createdb todo_app

# Run migrations
cd backend
psql -d todo_app -f migrations/001_initial_schema.sql
```

2. **Set up the backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

3. **Set up the frontend**
```bash
cd frontend
npm install
npm run dev
```

4. Access the application at http://localhost:3001

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/todo_app
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3001
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### POST /api/auth/login
Login user
```json
{
  "email": "string",
  "password": "string"
}
```

#### GET /api/auth/profile
Get current user profile (requires authentication)

### Task Endpoints

#### GET /api/tasks
Get all tasks for the authenticated user
Query parameters:
- `status`: Filter by status
- `priority`: Filter by priority
- `project_id`: Filter by project
- `search`: Search in title and description

#### GET /api/tasks/:id
Get a specific task

#### POST /api/tasks
Create a new task
```json
{
  "title": "string",
  "description": "string (optional)",
  "priority": "none|low|medium|high",
  "status": "not_started|in_progress|waiting|blocked|completed",
  "due_date": "ISO 8601 date (optional)",
  "estimated_time": "number (optional)",
  "project_id": "number (optional)",
  "tags": "number[] (optional)"
}
```

#### PUT /api/tasks/:id
Update a task

#### DELETE /api/tasks/:id
Delete a task

### Project Endpoints

#### GET /api/projects
Get all projects

#### POST /api/projects
Create a new project

#### PUT /api/projects/:id
Update a project

#### DELETE /api/projects/:id
Delete a project

### Tag Endpoints

#### GET /api/tags
Get all tags

#### POST /api/tags
Create a new tag

#### PUT /api/tags/:id
Update a tag

#### DELETE /api/tags/:id
Delete a tag

## Database Schema

### Users Table
- id, email, username, password_hash, avatar_url, created_at, updated_at

### Tasks Table
- id, title, description, priority, status, due_date, completed_at
- estimated_time, actual_time, project_id, user_id, assigned_to
- parent_task_id, is_recurring, recurrence_pattern, position
- created_at, updated_at

### Projects Table
- id, name, description, color, icon, user_id, parent_id
- archived, created_at, updated_at

### Tags Table
- id, name, color, user_id, created_at

### Additional Tables
- task_tags (junction table)
- comments
- attachments
- activity_log
- notifications
- project_shares

## Development

### Backend Development
```bash
cd backend
npm run dev        # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run lint       # Lint code
```

### Frontend Development
```bash
cd frontend
npm run dev        # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run lint       # Lint code
```

## Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

## Security Features

- Password hashing with bcrypt (10 rounds)
- JWT-based authentication
- HTTPS/TLS support
- CORS configuration
- SQL injection prevention (parameterized queries)
- XSS protection with Helmet
- Rate limiting on API endpoints
- Input validation with Joi
- CSRF protection

## Performance Optimizations

- Database indexing on frequently queried columns
- Redis caching for session management
- Lazy loading for large task lists
- Optimized SQL queries with proper joins
- Frontend code splitting with Vite
- Image optimization
- Gzip compression

## Deployment

### Production Build
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### Docker Deployment
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables for Production
Make sure to set secure values for:
- JWT_SECRET (strong random string)
- Database credentials
- CORS origins
- API URLs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or contributions, please open an issue on GitHub.

## Roadmap

### Phase 1: Foundation (✅ Completed)
- Backend API with core endpoints
- Frontend with task management
- Authentication system
- Basic Docker setup

### Phase 2: Enhanced Features (In Progress)
- Subtasks/checklist functionality
- Recurring tasks
- Time tracking
- File attachments
- Comments system

### Phase 3: Collaboration (Planned)
- Task assignment to team members
- Project sharing
- Real-time updates with WebSockets
- Activity feed
- Notifications

### Phase 4: Advanced Features (Planned)
- Board/Kanban view
- Calendar view
- Timeline/Gantt view
- Export/Import functionality
- Mobile apps
- Offline support

### Phase 5: Polish (Planned)
- Comprehensive testing
- Performance optimization
- Accessibility improvements
- Documentation completion
- Production deployment

## Acknowledgments

Built with modern web technologies and best practices for task management.

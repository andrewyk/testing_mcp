# Comprehensive Todo Application

A modern, full-stack task management application built with React, TypeScript, Node.js, Express, and PostgreSQL.

## Features

### Core Functionality
- ✅ **Task Management**: Create, read, update, and delete tasks
- ✅ **Task Properties**: Title, description, priority (high/medium/low/none), due dates, status
- ✅ **Task Completion**: Mark tasks as complete/incomplete with visual feedback
- ✅ **Priority System**: Color-coded priority levels for quick visual scanning
- ✅ **Search & Filter**: Search tasks by title and filter by various criteria
- ✅ **Smart Lists**: Today, Upcoming, and All Tasks views

### User Management
- ✅ **Authentication**: Secure JWT-based authentication
- ✅ **User Registration**: Create new accounts with email and password
- ✅ **User Login**: Sign in to existing accounts
- ✅ **Password Security**: Bcrypt hashing with salt factor 12

### User Interface
- ✅ **Modern Design**: Clean, intuitive interface with Tailwind CSS
- ✅ **Dark Mode Support**: Light and dark themes
- ✅ **Responsive Layout**: Works on desktop, tablet, and mobile
- ✅ **Real-time Feedback**: Toast notifications for user actions
- ✅ **Loading States**: Clear loading indicators

## Technology Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form handling
- **React Icons** - Icon library
- **Axios** - HTTP client
- **date-fns** - Date utilities
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type-safe JavaScript
- **PostgreSQL** - Relational database
- **Sequelize** - ORM for database operations
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **PostgreSQL** - Database persistence

## Getting Started

### Prerequisites
- Node.js 20+ and npm
- PostgreSQL 16+ (or use Docker)
- Docker and Docker Compose (optional)

### Installation

#### Option 1: Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/andrewyk/testing_mcp.git
cd testing_mcp
```

2. Start all services with Docker Compose:
```bash
docker-compose up
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/health

#### Option 2: Manual Setup

1. Clone the repository:
```bash
git clone https://github.com/andrewyk/testing_mcp.git
cd testing_mcp
```

2. Set up the backend:
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

3. Set up the frontend (in a new terminal):
```bash
cd frontend
npm install
npm run dev
```

4. Set up PostgreSQL database:
```bash
createdb todoapp
```

### Environment Variables

#### Backend (.env)
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://localhost:5432/todoapp
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## Project Structure

```
testing_mcp/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── config.ts       # Configuration
│   │   ├── server.ts       # Express server
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models
│   │   └── routes/         # API routes
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # State management
│   │   ├── types/         # TypeScript types
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml     # Docker orchestration
├── Dockerfile            # Production Dockerfile
├── Dockerfile.dev        # Development Dockerfile
└── README.md            # This file
```

## API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Task Endpoints

#### Get All Tasks
```http
GET /api/tasks
Authorization: Bearer <token>
```

Query parameters:
- `projectId` - Filter by project
- `status` - Filter by status
- `priority` - Filter by priority
- `dueDate` - Filter by due date (use 'today' for today's tasks)
- `search` - Search in title and description

#### Get Single Task
```http
GET /api/tasks/:id
Authorization: Bearer <token>
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Task title",
  "description": "Task description",
  "priority": "high",
  "dueDate": "2024-12-31",
  "status": "not_started"
}
```

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "isCompleted": true
}
```

#### Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

## Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Linting
```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

### Building for Production
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

## Deployment

### Using Docker

Build the production image:
```bash
docker build -t todo-app .
```

Run the container:
```bash
docker run -p 5000:5000 \
  -e DATABASE_URL=your-postgres-url \
  -e JWT_SECRET=your-secret \
  todo-app
```

## Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt (cost factor 12)
- ✅ HTTPS/TLS ready
- ✅ Helmet.js security headers
- ✅ CORS configuration
- ✅ Input validation
- ✅ SQL injection protection (via Sequelize ORM)

## Future Enhancements

The following features are planned for future releases:

### Phase 2: Enhanced Features
- [ ] Projects and categories
- [ ] Tags system
- [ ] Subtasks/checklists
- [ ] File attachments
- [ ] Comments on tasks

### Phase 3: Advanced Views
- [ ] Board/Kanban view
- [ ] Calendar view
- [ ] Timeline/Gantt view
- [ ] Table view

### Phase 4: Collaboration
- [ ] Task assignment to multiple users
- [ ] Team workspaces
- [ ] Real-time updates (WebSockets)
- [ ] Activity history
- [ ] @mentions in comments

### Phase 5: Advanced Features
- [ ] Time tracking
- [ ] Recurring tasks
- [ ] Reminders and notifications
- [ ] Task templates
- [ ] Import/export functionality
- [ ] Email notifications
- [ ] Mobile apps (iOS/Android)

### Phase 6: Integrations
- [ ] Calendar integrations (Google, Outlook)
- [ ] Email integration
- [ ] Cloud storage (Google Drive, Dropbox)
- [ ] Slack/Discord integration
- [ ] REST API webhooks
- [ ] Zapier integration

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository.

---

Built with ❤️ using modern web technologies


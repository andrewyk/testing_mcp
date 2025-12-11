# Todo Application - Full Stack MVP

A modern, feature-rich todo application built with React, TypeScript, Node.js, Express, and PostgreSQL.

## Features

### Authentication
- User registration with email/password
- Login with JWT authentication
- Secure password hashing with bcrypt (cost 12)
- Protected routes and API endpoints

### Task Management
- Create, read, update, and delete tasks
- Task properties: title, description, status, priority, due dates
- Task statuses: Todo, In Progress, Done, Cancelled
- Priority levels: Low, Medium, High, Urgent
- Assign tasks to projects
- Filter tasks by status, priority, and project

### Project Management
- Create and manage projects
- Color-coded projects with icons
- Track task counts per project
- Project ownership and access control

### User Interface
- Responsive design with Tailwind CSS
- Real-time task updates
- Interactive dashboard with statistics
- Modal dialogs for task creation
- Inline status updates

## Tech Stack

### Frontend
- **React 18+** with TypeScript
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

### Backend
- **Node.js 20+** with TypeScript
- **Express** - Web framework
- **PostgreSQL 15+** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Joi** - Input validation

## Prerequisites

- Node.js 20+ and npm
- PostgreSQL 15+
- Git

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/andrewyk/testing_mcp.git
cd testing_mcp
```

### 2. Database Setup

Create a PostgreSQL database:

```bash
psql -U postgres
CREATE DATABASE todo_app;
\q
```

Run the schema migration:

```bash
psql -U postgres -d todo_app -f backend/database/schema.sql
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your database credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=todo_app
# DB_USER=postgres
# DB_PASSWORD=your_password
# JWT_SECRET=your-super-secret-jwt-key-change-this

# Build the project
npm run build

# Start the server (development)
npm run dev
```

The backend server will run on `http://localhost:3000`

### 4. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# The default API URL is http://localhost:3000/api
# Edit .env if needed:
# VITE_API_URL=http://localhost:3000/api

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Click "Create a new account" to register
3. Fill in your details and create an account
4. You'll be automatically logged in and redirected to the dashboard
5. Start creating tasks and projects!

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Tasks
- `GET /api/tasks` - Get all tasks (protected)
- `GET /api/tasks/:id` - Get task by ID (protected)
- `POST /api/tasks` - Create task (protected)
- `PUT /api/tasks/:id` - Update task (protected)
- `DELETE /api/tasks/:id` - Delete task (protected)

### Projects
- `GET /api/projects` - Get all projects (protected)
- `GET /api/projects/:id` - Get project by ID (protected)
- `POST /api/projects` - Create project (protected)
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)

## Database Schema

The application uses 11 tables:

- **users** - User accounts
- **projects** - Project organization
- **tasks** - Task items
- **teams** - Team collaboration (future)
- **team_members** - Team membership (future)
- **labels** - Task labels (future)
- **task_labels** - Task-label relationships (future)
- **comments** - Task comments (future)
- **attachments** - File attachments (future)
- **activity_logs** - Audit trail (future)
- **notifications** - User notifications (future)

## Scripts

### Backend

```bash
npm run dev       # Start development server with hot reload
npm run build     # Build TypeScript to JavaScript
npm start         # Start production server
```

### Frontend

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## Security Features

- **Password Hashing**: bcrypt with cost factor 12
- **JWT Authentication**: Secure token-based auth with expiration
- **SQL Injection Prevention**: Parameterized queries
- **Input Validation**: Joi schema validation
- **CORS Configuration**: Controlled cross-origin access
- **Error Handling**: Proper error messages without leaking sensitive info

## Development Roadmap

### Phase 1 - MVP (Current)
- ✅ Authentication system
- ✅ Task CRUD operations
- ✅ Project management
- ✅ Basic dashboard UI

### Phase 2 - Enhanced Features
- [ ] Team collaboration
- [ ] Comments and mentions
- [ ] File attachments
- [ ] Labels and tags
- [ ] Advanced filtering and search

### Phase 3 - Advanced Features
- [ ] Time tracking
- [ ] Recurring tasks
- [ ] Calendar integrations
- [ ] Analytics dashboard
- [ ] Email notifications

### Phase 4 - Enterprise Features
- [ ] SSO integration
- [ ] Audit logs
- [ ] Custom workflows
- [ ] API webhooks

## License

ISC

---

📐 Testing repository for MCP
🔴


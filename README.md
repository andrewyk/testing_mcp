# testing_mcp

A comprehensive, production-ready todo application built with modern web technologies.

## 🚀 Quick Start

This repository contains a full-stack todo application with React frontend and Node.js backend.

### Documentation

For detailed documentation, please see:
- **[Complete Documentation](./docs/README.md)** - Full feature list, architecture, and setup guide
- **[API Documentation](#api-endpoints)** - API endpoints and usage
- **[Development Guide](#development)** - How to run locally

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd testing_mcp
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📝 Features

### Implemented ✅
- User authentication (register/login with JWT)
- Task management (create, edit, delete, complete)
- Project/category organization
- Priority levels (High, Medium, Low)
- Due dates and times
- Task filtering (All, Today, Upcoming, Active, Completed)
- Tag support
- Responsive design
- RESTful API
- Security features (rate limiting, password hashing, CORS, Helmet)

### Planned 🚧
- Kanban board view
- Calendar view
- Task assignment and collaboration
- Comments and notifications
- Time tracking
- Recurring tasks
- Templates
- Import/Export functionality
- Dark mode

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Data Storage**: In-memory (ready for PostgreSQL migration)
- **Authentication**: JWT tokens with bcrypt
- **Deployment**: Docker + Docker Compose
- **CI/CD**: GitHub Actions

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Tasks
- `GET /api/tasks` - Get all tasks (protected)
- `POST /api/tasks` - Create new task (protected)
- `GET /api/tasks/:id` - Get task by ID (protected)
- `PUT /api/tasks/:id` - Update task (protected)
- `DELETE /api/tasks/:id` - Delete task (protected)
- `PATCH /api/tasks/:id/toggle` - Toggle task completion (protected)

### Projects
- `GET /api/projects` - Get all projects (protected)
- `POST /api/projects` - Create new project (protected)
- `GET /api/projects/:id` - Get project by ID (protected)
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)

## 🐳 Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# The application will be available at:
# - Frontend: http://localhost
# - Backend API: http://localhost:5000
# - PostgreSQL: localhost:5432
# - Redis: localhost:6379
```

## 📦 Project Structure

```
.
├── backend/                # Node.js/Express API
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Data models
│   │   ├── routes/        # API routes
│   │   └── types/         # TypeScript types
│   └── Dockerfile
├── frontend/              # React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── context/      # React context
│   └── Dockerfile
├── docs/                 # Documentation
├── docker-compose.yml    # Docker orchestration
└── .github/workflows/    # CI/CD pipelines
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License

---

**Built with ❤️ using modern web technologies**


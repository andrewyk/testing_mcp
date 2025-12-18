# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              React Frontend (Port 3001)                │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │   Pages     │  │  Components  │  │   Stores    │  │  │
│  │  │  - Login    │  │  - TaskList  │  │  - Auth     │  │  │
│  │  │  - Register │  │  - TaskForm  │  │             │  │  │
│  │  │  - Dashboard│  │  - Sidebar   │  │             │  │  │
│  │  └─────────────┘  └──────────────┘  └─────────────┘  │  │
│  │          │                │                  │         │  │
│  │          └────────────────┴──────────────────┘         │  │
│  │                           │                             │  │
│  │                    ┌──────▼──────┐                     │  │
│  │                    │ API Service │                     │  │
│  │                    │  (Axios)    │                     │  │
│  │                    └──────┬──────┘                     │  │
│  └───────────────────────────┼──────────────────────────┘  │
└────────────────────────────────┼────────────────────────────┘
                                 │ HTTP/REST
                                 │
┌────────────────────────────────▼────────────────────────────┐
│                       API LAYER                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │        Node.js + Express Backend (Port 3000)          │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │   Routes    │  │ Controllers  │  │ Middleware  │  │  │
│  │  │  - Auth     │  │  - Auth      │  │  - Auth     │  │  │
│  │  │  - Tasks    │  │  - Tasks     │  │  - Error    │  │  │
│  │  │  - Projects │  │  - Projects  │  │  - Validate │  │  │
│  │  │  - Tags     │  │  - Tags      │  │             │  │  │
│  │  └─────────────┘  └──────────────┘  └─────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
┌───────────────────▼──────────┐  ┌──────────▼──────────────┐
│     DATA LAYER                │  │   CACHE LAYER           │
│  ┌─────────────────────────┐  │  │  ┌──────────────────┐  │
│  │  PostgreSQL (Port 5432) │  │  │  │ Redis (Port 6379)│  │
│  │  ┌───────────────────┐  │  │  │  │  - Sessions      │  │
│  │  │ Tables:           │  │  │  │  │  - Cache         │  │
│  │  │  - users          │  │  │  │  └──────────────────┘  │
│  │  │  - tasks          │  │  │  └─────────────────────────┘
│  │  │  - projects       │  │
│  │  │  - tags           │  │
│  │  │  - task_tags      │  │
│  │  │  - comments       │  │
│  │  │  - attachments    │  │
│  │  │  - activity_log   │  │
│  │  │  - notifications  │  │
│  │  │  - project_shares │  │
│  │  └───────────────────┘  │
│  └─────────────────────────┘
└─────────────────────────────┘
```

## Technology Stack

### Frontend Technologies
- **React 18**: UI framework with hooks
- **TypeScript**: Type safety and better DX
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **TanStack Query**: Server state management
- **Zustand**: Client state management
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **date-fns**: Date formatting
- **Lucide React**: Icon library

### Backend Technologies
- **Node.js 20**: JavaScript runtime
- **Express**: Web framework
- **TypeScript**: Type safety
- **PostgreSQL 16**: Relational database
- **Redis 7**: In-memory cache
- **JWT**: Authentication tokens
- **bcrypt**: Password hashing
- **Joi**: Input validation
- **Helmet**: Security headers
- **CORS**: Cross-origin requests

### DevOps & Tools
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **nginx**: Web server for frontend
- **Jest**: Testing framework
- **ESLint**: Code linting
- **Prettier**: Code formatting

## Data Flow

### Authentication Flow
```
User → Login Page → API /auth/login → Validate Credentials
  ↓                                            ↓
JWT Token ← Response ← Generate Token ← Check DB
  ↓
Store in localStorage + Zustand Store
  ↓
Include in all subsequent API requests
```

### Task Creation Flow
```
User → Dashboard → New Task Button → Task Form
  ↓
Fill Task Details (title, priority, due date, tags, etc.)
  ↓
Submit → API POST /tasks → Validate Input (Joi)
  ↓
Save to Database (PostgreSQL)
  ↓
Log Activity (activity_log table)
  ↓
Return Created Task → Update UI (TanStack Query cache)
  ↓
Render in Task List
```

### Task Update Flow
```
User → Click Task → Modify → Save
  ↓
API PUT /tasks/:id → Validate → Update DB
  ↓
Log Changes (activity_log) → Return Updated Task
  ↓
Invalidate Cache → Re-fetch → Update UI
```

## Security Layers

### 1. Transport Security
- HTTPS/TLS for all communications
- CORS configured for allowed origins

### 2. Authentication Security
- JWT with secure secret key
- Password hashing with bcrypt (10 rounds)
- Token expiration (7 days default)
- Token verification on protected routes

### 3. Input Validation
- Joi schema validation on all inputs
- SQL injection prevention (parameterized queries)
- XSS protection with Helmet
- CSRF protection

### 4. Rate Limiting
- 100 requests per 15 minutes per IP
- Prevents brute force attacks

### 5. Database Security
- Prepared statements (SQL injection prevention)
- Foreign key constraints
- Proper indexing for performance
- User data isolation

## API Architecture

### RESTful Design
```
GET    /api/tasks         - List all tasks
POST   /api/tasks         - Create new task
GET    /api/tasks/:id     - Get specific task
PUT    /api/tasks/:id     - Update task
DELETE /api/tasks/:id     - Delete task
```

### Response Format
```json
{
  "success": true/false,
  "data": {...},
  "error": "error message if any"
}
```

### Error Handling
- Centralized error handler middleware
- Consistent error response format
- HTTP status codes following standards
- Detailed error messages for debugging

## Database Schema

### Relationships
```
users (1) ──< (many) tasks
users (1) ──< (many) projects
users (1) ──< (many) tags
projects (1) ──< (many) tasks
tasks (many) ><(many) tags (via task_tags)
tasks (1) ──< (many) comments
tasks (1) ──< (many) attachments
projects (1) ──< (many) project_shares
```

### Indexes
- Primary keys on all tables
- Foreign key indexes for joins
- Composite indexes for common queries
- Text search indexes for search functionality

## Deployment Architecture

### Development
```
Developer Machine
  ├── Frontend Dev Server (Vite) - Port 3001
  ├── Backend Dev Server (Nodemon) - Port 3000
  ├── PostgreSQL - Port 5432
  └── Redis - Port 6379
```

### Production (Docker)
```
Docker Host
  ├── nginx Container (Frontend) - Port 80/443
  ├── Node.js Container (Backend) - Port 3000
  ├── PostgreSQL Container - Port 5432
  └── Redis Container - Port 6379

All containers connected via Docker network
Volumes for persistent data
Health checks for auto-restart
```

## Scalability Considerations

### Current Implementation
- Vertical scaling ready (increase container resources)
- Database connection pooling (20 connections)
- Efficient queries with proper indexes
- Redis caching for sessions

### Future Scaling Options
- Horizontal scaling with load balancer
- Database read replicas
- CDN for static assets
- Microservices architecture
- Message queue for async tasks
- WebSocket server for real-time features

## Monitoring & Observability

### Health Checks
- `/health` endpoint for service health
- Database connection checks
- Redis connection checks

### Logging
- Console logging for development
- Structured logging for production
- Error tracking and alerting

### Metrics (Future)
- Request latency tracking
- Error rate monitoring
- Database query performance
- User activity analytics

## Future Enhancements

### Phase 2 Features
- Subtasks and checklists
- Recurring tasks
- File attachments
- Email notifications
- Mobile apps (React Native)

### Phase 3 Features
- Real-time collaboration (WebSockets)
- Activity feed
- Advanced analytics
- Export to PDF/Excel
- Integration with calendar apps

### Phase 4 Features
- AI-powered task suggestions
- Voice input
- Offline-first architecture
- Progressive Web App (PWA)
- Third-party integrations (Slack, Jira, etc.)

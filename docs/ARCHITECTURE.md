# Architecture Documentation

## System Overview

TodoApp is a full-stack web application built with a clear separation between frontend and backend layers. The architecture follows modern best practices including RESTful API design, component-based UI, and secure authentication.

## Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: SQLite (better-sqlite3)
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Helmet, bcryptjs, CORS, Rate Limiting
- **Validation**: express-validator

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **State Management**: Zustand
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: React Icons
- **Date Handling**: date-fns

## Architecture Patterns

### Backend Architecture

#### Layered Architecture

```
┌─────────────────────────────────────┐
│         API Routes Layer            │
│   (Authentication, Authorization)   │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│      Controllers Layer              │
│   (Business Logic, Validation)      │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│      Database Layer                 │
│   (SQL Queries, Data Access)        │
└─────────────────────────────────────┘
```

#### Key Design Decisions

1. **RESTful API Design**: Clear resource-based endpoints following REST conventions
2. **JWT Authentication**: Stateless authentication for scalability
3. **SQL Parameterization**: Prevents SQL injection attacks
4. **Middleware Chain**: Request processing through middleware for concerns like auth, validation, rate limiting
5. **Error Handling**: Centralized error handling middleware

### Frontend Architecture

#### Component Hierarchy

```
App (Router)
├── Public Routes
│   ├── Login
│   └── Register
└── Private Routes
    └── Dashboard
        ├── Sidebar (Filters, Projects, Tags)
        ├── StatsBar (Statistics)
        ├── TodoList
        │   └── TodoItem (Individual tasks)
        └── TodoForm (Modal)
```

#### State Management Strategy

- **Zustand Stores**: Lightweight, scalable state management
  - `authStore`: User authentication state
  - `todoStore`: Todo data, projects, tags, filters
- **Local State**: Component-level state with `useState` for UI interactions
- **No Redux**: Zustand provides sufficient functionality with less boilerplate

#### Key Design Decisions

1. **Component Composition**: Small, reusable components with single responsibilities
2. **Custom Hooks**: Encapsulate reusable logic (though not heavily used in this implementation)
3. **Atomic Design Principles**: Base components (Button, Input) → Organisms (TodoItem) → Pages
4. **Client-Side Routing**: Fast navigation without full page reloads

## Database Schema

### Entity Relationship Diagram

```
┌──────────┐       ┌──────────┐       ┌──────────┐
│  Users   │       │ Projects │       │   Tags   │
├──────────┤       ├──────────┤       ├──────────┤
│ id (PK)  │───┐   │ id (PK)  │       │ id (PK)  │
│ email    │   │   │ user_id  │       │ user_id  │
│ password │   │   │ name     │       │ name     │
│ name     │   │   │ color    │       │ color    │
└──────────┘   │   └──────────┘       └──────────┘
               │         │                   │
               │         │                   │
               ▼         ▼                   ▼
         ┌─────────────────────────────────────┐
         │           Todos                     │
         ├─────────────────────────────────────┤
         │ id (PK)                             │
         │ user_id (FK) ────────────────────┐  │
         │ project_id (FK) ─────────────┐   │  │
         │ title                        │   │  │
         │ description                  │   │  │
         │ completed                    │   │  │
         │ priority                     │   │  │
         │ due_date                     │   │  │
         └──────────────┬───────────────┘   │  │
                        │                   │  │
                        │                   │  │
         ┌──────────────▼───────────────┐   │  │
         │        Subtasks              │   │  │
         ├──────────────────────────────┤   │  │
         │ id (PK)                      │   │  │
         │ todo_id (FK)                 │   │  │
         │ title                        │   │  │
         │ completed                    │   │  │
         └──────────────────────────────┘   │  │
                                            │  │
         ┌──────────────────────────────┐   │  │
         │       TodoTags (Junction)    │   │  │
         ├──────────────────────────────┤   │  │
         │ todo_id (FK) ────────────────┘  │  │
         │ tag_id (FK) ────────────────────┘  │
         └──────────────────────────────────┘
```

### Schema Design Principles

1. **Normalization**: Third normal form to minimize redundancy
2. **Foreign Keys**: Enforce referential integrity
3. **Soft Deletes**: Preserve data with `deleted` flag
4. **Timestamps**: Track creation and modification times
5. **Indexes**: Optimize common query patterns (not explicit in current schema but recommended for production)

## Security Architecture

### Authentication Flow

```
┌─────────┐                    ┌─────────┐                    ┌──────────┐
│ Client  │                    │  API    │                    │ Database │
└────┬────┘                    └────┬────┘                    └────┬─────┘
     │                              │                              │
     │  POST /api/auth/login        │                              │
     ├─────────────────────────────►│                              │
     │  { email, password }         │                              │
     │                              │  Query user by email         │
     │                              ├─────────────────────────────►│
     │                              │                              │
     │                              │  User data                   │
     │                              │◄─────────────────────────────┤
     │                              │                              │
     │                              │  Verify password             │
     │                              │  (bcrypt.compare)            │
     │                              │                              │
     │                              │  Generate JWT                │
     │                              │  (jwt.sign)                  │
     │                              │                              │
     │  JWT Token + User Data       │                              │
     │◄─────────────────────────────┤                              │
     │                              │                              │
     │  Subsequent API Requests     │                              │
     │  Authorization: Bearer <JWT> │                              │
     ├─────────────────────────────►│                              │
     │                              │  Verify JWT                  │
     │                              │  (jwt.verify)                │
     │                              │                              │
     │                              │  Extract user_id             │
     │                              │                              │
     │                              │  Query with user_id          │
     │                              ├─────────────────────────────►│
     │                              │                              │
     │  Response Data               │                              │
     │◄─────────────────────────────┤                              │
     │                              │                              │
```

### Security Layers

1. **Transport Security**: HTTPS in production
2. **Authentication**: JWT tokens with expiration
3. **Authorization**: User-based access control (users can only access their own data)
4. **Input Validation**: express-validator for all inputs
5. **SQL Injection Prevention**: Parameterized queries
6. **XSS Protection**: Content sanitization
7. **CSRF Protection**: Token-based (recommended for production)
8. **Rate Limiting**: Prevent brute force and DDoS
9. **Security Headers**: Helmet middleware

## API Design

### RESTful Principles

- **Resource-based URLs**: `/api/todos`, `/api/projects`
- **HTTP Methods**: GET (read), POST (create), PUT (update), DELETE (delete)
- **Status Codes**: Appropriate HTTP status codes
- **Consistent Response Format**: JSON with clear structure

### Request/Response Flow

```
Client Request
     │
     ▼
CORS Middleware
     │
     ▼
Rate Limiter
     │
     ▼
Body Parser
     │
     ▼
Auth Middleware (if protected route)
     │
     ▼
Input Validation
     │
     ▼
Controller Logic
     │
     ▼
Database Query
     │
     ▼
Response Formatting
     │
     ▼
Error Handler (if error occurs)
     │
     ▼
Client Response
```

## Deployment Architecture

### Development Environment

```
┌──────────────────────────────────────────────┐
│           Developer Machine                  │
│                                              │
│  ┌────────────┐         ┌─────────────────┐ │
│  │  Frontend  │         │     Backend     │ │
│  │  Vite Dev  │────────►│   Express API   │ │
│  │ Port 5173  │  Proxy  │    Port 3000    │ │
│  └────────────┘         └────────┬────────┘ │
│                                  │          │
│                         ┌────────▼────────┐ │
│                         │  SQLite DB      │ │
│                         │  (local file)   │ │
│                         └─────────────────┘ │
└──────────────────────────────────────────────┘
```

### Production Environment (Recommended)

```
┌────────────────────────────────────────────┐
│               Load Balancer                │
│           (HTTPS Termination)              │
└────────────────┬───────────────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
    ▼                         ▼
┌─────────┐              ┌─────────┐
│ Server 1│              │ Server 2│
├─────────┤              ├─────────┤
│ Node.js │              │ Node.js │
│ Express │              │ Express │
│  + UI   │              │  + UI   │
└────┬────┘              └────┬────┘
     │                        │
     └────────┬───────────────┘
              │
    ┌─────────▼──────────┐
    │   Database         │
    │  (PostgreSQL or    │
    │   MySQL for prod)  │
    └────────────────────┘
```

## Performance Considerations

### Frontend Optimization

1. **Code Splitting**: Routes loaded on demand
2. **Lazy Loading**: Components loaded when needed
3. **Memoization**: React.memo for expensive components
4. **Virtual Scrolling**: For large todo lists (not implemented but recommended)
5. **Debouncing**: Search inputs
6. **Caching**: API responses with stale-while-revalidate

### Backend Optimization

1. **Database Indexing**: Index frequently queried fields
2. **Connection Pooling**: Reuse database connections
3. **Caching Layer**: Redis for frequently accessed data (recommended for scale)
4. **Pagination**: Limit response sizes
5. **Query Optimization**: Avoid N+1 queries

## Scalability Considerations

### Horizontal Scaling

- **Stateless Backend**: JWT tokens enable multiple server instances
- **Load Balancing**: Distribute traffic across servers
- **Database Replication**: Read replicas for scaling reads

### Vertical Scaling

- Increase server resources (CPU, RAM)
- Optimize database queries
- Use faster database engines

## Monitoring and Observability

### Recommended Tools

1. **Application Monitoring**: PM2, New Relic, DataDog
2. **Error Tracking**: Sentry
3. **Logging**: Winston, Morgan
4. **Metrics**: Prometheus + Grafana
5. **Uptime Monitoring**: Pingdom, UptimeRobot

## Testing Strategy

### Backend Testing

- **Unit Tests**: Test individual functions
- **Integration Tests**: Test API endpoints
- **Database Tests**: Test queries and transactions

### Frontend Testing

- **Unit Tests**: Test components in isolation
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test user flows with Playwright/Cypress

## Future Enhancements

### Technical Improvements

1. **Database Migration**: Move to PostgreSQL for production
2. **Real-time Updates**: WebSocket support
3. **Caching Layer**: Redis for performance
4. **Search Engine**: Elasticsearch for advanced search
5. **File Storage**: S3 for attachments
6. **Background Jobs**: Queue system for async tasks

### Feature Additions

1. **Collaboration**: Share todos with other users
2. **Notifications**: Push notifications
3. **Calendar Integration**: Sync with Google Calendar
4. **Mobile Apps**: Native iOS/Android apps
5. **AI Features**: Smart task suggestions
6. **Analytics**: Advanced insights and reports

## Conclusion

This architecture provides a solid foundation for a modern web application with room for growth and enhancement. The separation of concerns, security best practices, and scalable design patterns make it suitable for both small-scale and enterprise applications.

# API Documentation

This document provides detailed information about the Todo App REST API.

## Base URL

```
http://localhost:5000/api
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All responses follow this structure:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { }
}
```

Error responses:

```json
{
  "success": false,
  "status": "fail",
  "message": "Error description"
}
```

## Endpoints

### Authentication

#### Register User

```http
POST /api/auth/register
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe"
}
```

Response (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt-token"
  }
}
```

#### Login

```http
POST /api/auth/login
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

Response (200): Same as register

#### Get Profile

```http
GET /api/auth/profile
```

Headers:
```
Authorization: Bearer <token>
```

Response (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Tasks

#### Get All Tasks

```http
GET /api/tasks
```

Query parameters:
- `projectId` - Filter by project
- `priority` - Filter by priority (high, medium, low, none)
- `status` - Filter by status
- `completed` - Filter by completion status (true/false)
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - Sort order (asc/desc, default: desc)

Headers:
```
Authorization: Bearer <token>
```

Response (200):
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "uuid",
        "title": "Complete project",
        "description": "Finish the todo app",
        "priority": "high",
        "status": "in_progress",
        "dueDate": "2024-12-31",
        "dueTime": "17:00",
        "projectId": "project-uuid",
        "assigneeId": null,
        "createdById": "user-uuid",
        "estimatedTime": 5,
        "actualTime": null,
        "tags": ["work", "urgent"],
        "completed": false,
        "completedAt": null,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "count": 1
  }
}
```

#### Create Task

```http
POST /api/tasks
```

Headers:
```
Authorization: Bearer <token>
```

Request body:
```json
{
  "title": "Complete project",
  "description": "Finish the todo app",
  "priority": "high",
  "status": "not_started",
  "dueDate": "2024-12-31",
  "dueTime": "17:00",
  "projectId": "project-uuid",
  "estimatedTime": 5,
  "tags": ["work", "urgent"]
}
```

Response (201): Returns created task

#### Get Task by ID

```http
GET /api/tasks/:id
```

Headers:
```
Authorization: Bearer <token>
```

Response (200): Returns single task

#### Update Task

```http
PUT /api/tasks/:id
```

Headers:
```
Authorization: Bearer <token>
```

Request body: Same as create, all fields optional

Response (200): Returns updated task

#### Delete Task

```http
DELETE /api/tasks/:id
```

Headers:
```
Authorization: Bearer <token>
```

Response (200):
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

#### Toggle Task Completion

```http
PATCH /api/tasks/:id/toggle
```

Headers:
```
Authorization: Bearer <token>
```

Response (200): Returns updated task with toggled completion status

### Projects

#### Get All Projects

```http
GET /api/projects
```

Query parameters:
- `archived` - Filter archived projects (true/false)

Headers:
```
Authorization: Bearer <token>
```

Response (200):
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "uuid",
        "name": "Work Projects",
        "description": "All work-related tasks",
        "color": "#667eea",
        "icon": "💼",
        "ownerId": "user-uuid",
        "archived": false,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "count": 1
  }
}
```

#### Create Project

```http
POST /api/projects
```

Headers:
```
Authorization: Bearer <token>
```

Request body:
```json
{
  "name": "Work Projects",
  "description": "All work-related tasks",
  "color": "#667eea",
  "icon": "💼"
}
```

Response (201): Returns created project

#### Get Project by ID

```http
GET /api/projects/:id
```

Headers:
```
Authorization: Bearer <token>
```

Response (200):
```json
{
  "success": true,
  "data": {
    "project": { },
    "tasks": [ ],
    "taskCount": 0
  }
}
```

#### Update Project

```http
PUT /api/projects/:id
```

Headers:
```
Authorization: Bearer <token>
```

Request body: Same as create, all fields optional

Response (200): Returns updated project

#### Delete Project

```http
DELETE /api/projects/:id
```

Headers:
```
Authorization: Bearer <token>
```

Note: Cannot delete a project that contains tasks.

Response (200):
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

## Error Codes

- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (no permission)
- `404` - Not Found
- `409` - Conflict (e.g., user already exists)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## Rate Limiting

The API implements rate limiting:
- General endpoints: 100 requests per minute
- Authentication endpoints: 5 requests per 15 minutes

When rate limit is exceeded, you'll receive a 429 status code:

```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

## Security

- All passwords are hashed using bcrypt (cost factor: 12)
- JWT tokens expire after 7 days (configurable)
- HTTPS recommended for production
- CORS configured for allowed origins
- Helmet.js provides security headers
- Input validation on all endpoints

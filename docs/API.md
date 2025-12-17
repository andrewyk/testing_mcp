# API Documentation

## Base URL

```
http://localhost:3000/api
```

All API requests require authentication except for registration and login endpoints.

## Authentication

Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### POST /auth/register

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST /auth/login

Authenticate and receive a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### GET /auth/profile

Get the current user's profile.

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### Todos

#### GET /todos

Get all todos with optional filtering and sorting.

**Query Parameters:**
- `status`: Filter by status (all, active, completed)
- `priority`: Filter by priority (low, medium, high)
- `project_id`: Filter by project ID
- `search`: Search in title and description
- `sort`: Sort field (created_at, updated_at, due_date, priority, title)
- `order`: Sort order (asc, desc)

**Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "project_id": 1,
    "title": "Complete project",
    "description": "Finish the todo app",
    "completed": false,
    "priority": "high",
    "due_date": "2024-01-15T00:00:00.000Z",
    "completed_at": null,
    "deleted": false,
    "position": 0,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "tags": [
      {
        "id": 1,
        "name": "urgent",
        "color": "#EF4444"
      }
    ],
    "subtasks": [
      {
        "id": 1,
        "todo_id": 1,
        "title": "Setup project",
        "completed": 1,
        "position": 0,
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
]
```

#### GET /todos/:id

Get a specific todo by ID.

**Response (200):**
```json
{
  "id": 1,
  "title": "Complete project",
  "description": "Finish the todo app",
  "completed": false,
  "priority": "high",
  "due_date": "2024-01-15T00:00:00.000Z",
  "tags": [...],
  "subtasks": [...]
}
```

#### POST /todos

Create a new todo.

**Request Body:**
```json
{
  "title": "New task",
  "description": "Task description",
  "priority": "medium",
  "due_date": "2024-01-15",
  "project_id": 1,
  "tags": [1, 2],
  "subtasks": [
    {
      "title": "Subtask 1"
    }
  ]
}
```

**Response (201):**
```json
{
  "id": 2,
  "title": "New task",
  ...
}
```

#### PUT /todos/:id

Update an existing todo.

**Request Body:**
```json
{
  "title": "Updated title",
  "completed": true,
  "priority": "low"
}
```

**Response (200):**
```json
{
  "id": 1,
  "title": "Updated title",
  ...
}
```

#### DELETE /todos/:id

Delete a todo (soft delete by default).

**Query Parameters:**
- `permanent`: Set to "true" for permanent deletion

**Response (200):**
```json
{
  "message": "Todo moved to trash"
}
```

#### GET /todos/stats

Get statistics about user's todos.

**Response (200):**
```json
{
  "total": 25,
  "active": 15,
  "completed": 10,
  "overdue": 3,
  "today": 5,
  "thisWeek": 8
}
```

### Projects

#### GET /projects

Get all projects.

**Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "name": "Work",
    "description": "Work-related tasks",
    "color": "#3B82F6",
    "archived": false,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "todoCount": 5
  }
]
```

#### GET /projects/:id

Get a specific project.

**Response (200):**
```json
{
  "id": 1,
  "name": "Work",
  "description": "Work-related tasks",
  "color": "#3B82F6",
  "todoCount": 5
}
```

#### POST /projects

Create a new project.

**Request Body:**
```json
{
  "name": "Personal",
  "description": "Personal tasks",
  "color": "#10B981"
}
```

**Response (201):**
```json
{
  "id": 2,
  "name": "Personal",
  "description": "Personal tasks",
  "color": "#10B981",
  "todoCount": 0
}
```

#### PUT /projects/:id

Update a project.

**Request Body:**
```json
{
  "name": "Updated name",
  "archived": true
}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Updated name",
  ...
}
```

#### DELETE /projects/:id

Delete a project (todos in the project will have their project_id set to null).

**Response (200):**
```json
{
  "message": "Project deleted"
}
```

### Tags

#### GET /tags

Get all tags.

**Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "name": "urgent",
    "color": "#EF4444",
    "created_at": "2024-01-01T00:00:00.000Z",
    "usageCount": 5
  }
]
```

#### POST /tags

Create a new tag.

**Request Body:**
```json
{
  "name": "important",
  "color": "#F59E0B"
}
```

**Response (201):**
```json
{
  "id": 2,
  "name": "important",
  "color": "#F59E0B",
  "usageCount": 0
}
```

#### PUT /tags/:id

Update a tag.

**Request Body:**
```json
{
  "name": "very-important",
  "color": "#DC2626"
}
```

**Response (200):**
```json
{
  "id": 2,
  "name": "very-important",
  "color": "#DC2626",
  "usageCount": 3
}
```

#### DELETE /tags/:id

Delete a tag.

**Response (200):**
```json
{
  "message": "Tag deleted"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Validation error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Server error"
}
```

## Rate Limiting

API requests are rate-limited to 100 requests per 15 minutes per IP address. When the limit is exceeded, the API will return a 429 status code.

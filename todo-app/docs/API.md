# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

All endpoints except `/auth/register` and `/auth/login` require authentication.

Include the JWT token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "username": "string (3-100 characters, required)",
  "email": "string (valid email, required)",
  "password": "string (min 8 characters, required)"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "john_doe",
    "created_at": "2025-12-11T18:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- `400 Bad Request`: Invalid input data
- `409 Conflict`: Email already registered

---

### Login
**POST** `/auth/login`

Authenticate and receive JWT token.

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "john_doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- `401 Unauthorized`: Invalid credentials

---

### Get Profile
**GET** `/auth/profile`

Get current user profile. Requires authentication.

**Response:** `200 OK`
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "john_doe",
  "avatar_url": null,
  "created_at": "2025-12-11T18:00:00Z"
}
```

---

## Task Endpoints

### List Tasks
**GET** `/tasks`

Get all tasks for the authenticated user.

**Query Parameters:**
- `status`: Filter by status (`not_started`, `in_progress`, `waiting`, `blocked`, `completed`)
- `priority`: Filter by priority (`none`, `low`, `medium`, `high`)
- `project_id`: Filter by project ID
- `due_date`: Filter by due date (YYYY-MM-DD)
- `search`: Search in title and description

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive README and API docs",
    "priority": "high",
    "status": "in_progress",
    "due_date": "2025-12-15T00:00:00Z",
    "completed_at": null,
    "estimated_time": 4,
    "actual_time": null,
    "project_id": 1,
    "project_name": "Documentation",
    "user_id": 1,
    "assigned_to": null,
    "parent_task_id": null,
    "is_recurring": false,
    "position": 0,
    "tags": [
      {
        "id": 1,
        "name": "documentation",
        "color": "#3B82F6"
      }
    ],
    "created_at": "2025-12-11T18:00:00Z",
    "updated_at": "2025-12-11T18:00:00Z"
  }
]
```

---

### Get Task
**GET** `/tasks/:id`

Get a specific task by ID.

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive README and API docs",
  "priority": "high",
  "status": "in_progress",
  "due_date": "2025-12-15T00:00:00Z",
  "tags": [...],
  ...
}
```

**Errors:**
- `404 Not Found`: Task not found

---

### Create Task
**POST** `/tasks`

Create a new task.

**Request Body:**
```json
{
  "title": "string (max 255 characters, required)",
  "description": "string (max 10000 characters, optional)",
  "priority": "none|low|medium|high (default: none)",
  "status": "not_started|in_progress|waiting|blocked|completed (default: not_started)",
  "due_date": "ISO 8601 date string (optional)",
  "estimated_time": "number (hours, optional)",
  "project_id": "number (optional)",
  "assigned_to": "number (user ID, optional)",
  "parent_task_id": "number (optional)",
  "tags": "array of tag IDs (optional)"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "title": "Complete project documentation",
  ...
}
```

---

### Update Task
**PUT** `/tasks/:id`

Update an existing task.

**Request Body:** (All fields optional)
```json
{
  "title": "string",
  "description": "string",
  "priority": "none|low|medium|high",
  "status": "not_started|in_progress|waiting|blocked|completed",
  "due_date": "ISO 8601 date string",
  "estimated_time": "number",
  "actual_time": "number",
  "project_id": "number",
  "assigned_to": "number",
  "completed_at": "ISO 8601 date string",
  "tags": "array of tag IDs"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Updated title",
  ...
}
```

---

### Delete Task
**DELETE** `/tasks/:id`

Delete a task.

**Response:** `200 OK`
```json
{
  "message": "Task deleted successfully"
}
```

---

## Project Endpoints

### List Projects
**GET** `/projects`

Get all projects for the authenticated user.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Documentation",
    "description": "All documentation tasks",
    "color": "#3B82F6",
    "icon": "book",
    "user_id": 1,
    "parent_id": null,
    "archived": false,
    "task_count": 5,
    "created_at": "2025-12-11T18:00:00Z",
    "updated_at": "2025-12-11T18:00:00Z"
  }
]
```

---

### Create Project
**POST** `/projects`

Create a new project.

**Request Body:**
```json
{
  "name": "string (max 255 characters, required)",
  "description": "string (optional)",
  "color": "string (#RRGGBB hex color, default: #3B82F6)",
  "icon": "string (max 50 characters, optional)",
  "parent_id": "number (optional)"
}
```

**Response:** `201 Created`

---

### Update Project
**PUT** `/projects/:id`

Update a project.

**Request Body:** (All fields optional)
```json
{
  "name": "string",
  "description": "string",
  "color": "string",
  "icon": "string",
  "archived": "boolean"
}
```

**Response:** `200 OK`

---

### Delete Project
**DELETE** `/projects/:id`

Delete a project.

**Response:** `200 OK`
```json
{
  "message": "Project deleted successfully"
}
```

---

## Tag Endpoints

### List Tags
**GET** `/tags`

Get all tags for the authenticated user.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "documentation",
    "color": "#3B82F6",
    "user_id": 1,
    "usage_count": 5,
    "created_at": "2025-12-11T18:00:00Z"
  }
]
```

---

### Create Tag
**POST** `/tags`

Create a new tag.

**Request Body:**
```json
{
  "name": "string (max 100 characters, required)",
  "color": "string (#RRGGBB hex color, default: #6B7280)"
}
```

**Response:** `201 Created`

**Errors:**
- `409 Conflict`: Tag already exists

---

### Update Tag
**PUT** `/tags/:id`

Update a tag.

**Request Body:** (All fields optional)
```json
{
  "name": "string",
  "color": "string"
}
```

**Response:** `200 OK`

---

### Delete Tag
**DELETE** `/tags/:id`

Delete a tag.

**Response:** `200 OK`
```json
{
  "message": "Tag deleted successfully"
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Validation Error",
  "details": "title is required"
}
```

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 403 Forbidden
```json
{
  "error": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 409 Conflict
```json
{
  "error": "Resource already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

API endpoints are rate-limited to 100 requests per 15 minutes per IP address.

When rate limit is exceeded:
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- All IDs are integers
- Pagination is not currently implemented but will be added in future versions
- File attachments feature is planned but not yet implemented

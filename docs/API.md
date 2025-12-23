# API Documentation

## Overview

The Comprehensive Todo Application provides a RESTful API for managing tasks. This document outlines all available endpoints and their usage.

## Base URL

```
http://localhost:3000/api
```

## Endpoints

### Health Check

#### GET /health

Returns the health status of the API server.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-11T19:00:00.000Z"
}
```

---

### Tasks

#### GET /api/tasks

Retrieves all tasks with optional filtering and sorting.

**Query Parameters:**
- `status` (optional): Filter by status (`not_started`, `in_progress`, `waiting`, `blocked`, `completed`)
- `priority` (optional): Filter by priority (`high`, `medium`, `low`, `none`)
- `sort` (optional): Sort by field (`dueDate`, `priority`, `createdAt`)

**Example Request:**
```
GET /api/tasks?status=in_progress&sort=priority
```

**Response:**
```json
[
  {
    "id": "1",
    "title": "Complete project documentation",
    "description": "Write comprehensive API docs",
    "priority": "high",
    "dueDate": "2025-12-15",
    "status": "in_progress",
    "completed": false,
    "createdAt": "2025-12-11T19:00:00.000Z",
    "updatedAt": "2025-12-11T19:00:00.000Z"
  }
]
```

---

#### GET /api/tasks/:id

Retrieves a specific task by ID.

**Parameters:**
- `id` (string): Task ID

**Response:**
```json
{
  "id": "1",
  "title": "Complete project documentation",
  "description": "Write comprehensive API docs",
  "priority": "high",
  "dueDate": "2025-12-15",
  "status": "in_progress",
  "completed": false,
  "createdAt": "2025-12-11T19:00:00.000Z",
  "updatedAt": "2025-12-11T19:00:00.000Z"
}
```

**Error Response (404):**
```json
{
  "error": "Task not found"
}
```

---

#### POST /api/tasks

Creates a new task.

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API docs",
  "priority": "high",
  "dueDate": "2025-12-15",
  "status": "not_started"
}
```

**Field Requirements:**
- `title` (string, required): Task title (max 255 characters)
- `description` (string, optional): Detailed description (max 10,000 characters)
- `priority` (string, optional): One of `high`, `medium`, `low`, `none` (default: `none`)
- `dueDate` (string, optional): ISO 8601 date string
- `status` (string, optional): One of `not_started`, `in_progress`, `waiting`, `blocked`, `completed` (default: `not_started`)

**Response (201 Created):**
```json
{
  "id": "1",
  "title": "Complete project documentation",
  "description": "Write comprehensive API docs",
  "priority": "high",
  "dueDate": "2025-12-15",
  "status": "not_started",
  "completed": false,
  "createdAt": "2025-12-11T19:00:00.000Z",
  "updatedAt": "2025-12-11T19:00:00.000Z"
}
```

**Error Response (400):**
```json
{
  "error": "Title is required"
}
```

---

#### PUT /api/tasks/:id

Updates an existing task.

**Parameters:**
- `id` (string): Task ID

**Request Body:**
All fields are optional. Only include fields you want to update.

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "priority": "medium",
  "dueDate": "2025-12-20",
  "status": "in_progress",
  "completed": false
}
```

**Response:**
```json
{
  "id": "1",
  "title": "Updated title",
  "description": "Updated description",
  "priority": "medium",
  "dueDate": "2025-12-20",
  "status": "in_progress",
  "completed": false,
  "createdAt": "2025-12-11T19:00:00.000Z",
  "updatedAt": "2025-12-11T19:30:00.000Z"
}
```

**Error Response (404):**
```json
{
  "error": "Task not found"
}
```

---

#### DELETE /api/tasks/:id

Deletes a task.

**Parameters:**
- `id` (string): Task ID

**Response (204 No Content):**
Empty response body

**Error Response (404):**
```json
{
  "error": "Task not found"
}
```

---

## Data Models

### Task Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes (auto-generated) | Unique task identifier |
| title | string | Yes | Task title (max 255 chars) |
| description | string | No | Detailed description (max 10,000 chars) |
| priority | string | No | Priority level: `high`, `medium`, `low`, `none` |
| dueDate | string | No | ISO 8601 date string |
| status | string | No | Task status: `not_started`, `in_progress`, `waiting`, `blocked`, `completed` |
| completed | boolean | Yes (auto-generated) | Whether task is completed |
| createdAt | string | Yes (auto-generated) | ISO 8601 timestamp |
| updatedAt | string | Yes (auto-generated) | ISO 8601 timestamp |

## Error Handling

The API uses standard HTTP status codes:

- `200 OK`: Successful GET/PUT request
- `201 Created`: Successful POST request
- `204 No Content`: Successful DELETE request
- `400 Bad Request`: Invalid request data
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

All error responses include an `error` field with a descriptive message.

## CORS

CORS is enabled for all origins in development. For production, configure allowed origins in the server configuration.

## Rate Limiting

Currently not implemented. For production deployment, implement rate limiting to prevent abuse.

## Authentication

Currently not implemented. Phase 1 focuses on core functionality. Future phases will include:
- JWT-based authentication
- User accounts
- Task ownership
- Permission levels

## Future Enhancements

Planned features for upcoming phases:
- Projects and categories
- Tags and labels
- Subtasks
- File attachments
- Comments
- Activity history
- Recurring tasks
- Time tracking
- Real-time updates via WebSockets

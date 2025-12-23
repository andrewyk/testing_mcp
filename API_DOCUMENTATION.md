# API Documentation - Comprehensive Todo Application

## Base URL
```
http://localhost:3001/api
```

## Overview
This document describes the RESTful API endpoints for the Comprehensive Todo Application. All endpoints accept and return JSON data.

## Response Format
All responses are in JSON format. Successful responses return the requested data or a success message. Error responses include an error message.

## Endpoints

### System

#### Health Check
**GET** `/health`

Check if the API server is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-11T19:00:00.000Z"
}
```

---

### Tasks

#### List Tasks
**GET** `/tasks`

Get all tasks with optional filtering.

**Query Parameters:**
- `projectId` (string) - Filter by project ID
- `status` (string) - Filter by status: `not_started`, `in_progress`, `waiting`, `blocked`, `completed`
- `priority` (string) - Filter by priority: `high`, `medium`, `low`, `none`
- `assignee` (string) - Filter by assignee ID
- `tag` (string) - Filter by tag
- `search` (string) - Search in title and description

**Example:**
```bash
GET /tasks?status=in_progress&priority=high
```

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Task title",
    "description": "Task description",
    "priority": "high",
    "status": "in_progress",
    "projectId": "proj-1",
    "tags": ["tag1", "tag2"],
    "assignee": "user-1",
    "dueDate": "2025-12-15T17:00:00Z",
    "estimatedTime": null,
    "actualTime": null,
    "subtasks": [],
    "recurrence": null,
    "dependencies": [],
    "labels": [],
    "attachments": [],
    "createdAt": "2025-12-11T19:00:00.000Z",
    "updatedAt": "2025-12-11T19:00:00.000Z",
    "completedAt": null
  }
]
```

#### Get Single Task
**GET** `/tasks/:id`

Get a specific task by ID.

**Response:**
```json
{
  "id": "uuid",
  "title": "Task title",
  ...
}
```

**Error Response (404):**
```json
{
  "error": "Task not found"
}
```

#### Create Task
**POST** `/tasks`

Create a new task.

**Request Body:**
```json
{
  "title": "Task title",              // Required, max 255 chars
  "description": "Description",       // Optional, max 10,000 chars
  "priority": "high",                 // Optional: high, medium, low, none (default: none)
  "status": "not_started",           // Optional: not_started, in_progress, waiting, blocked, completed
  "projectId": "proj-1",             // Optional
  "tags": ["tag1", "tag2"],          // Optional
  "assignee": "user-1",              // Optional
  "dueDate": "2025-12-15T17:00:00Z", // Optional, ISO 8601 format
  "estimatedTime": 120,              // Optional, in minutes
  "subtasks": [],                    // Optional
  "recurrence": null,                // Optional
  "dependencies": [],                // Optional
  "labels": []                       // Optional
}
```

**Response (201 Created):**
```json
{
  "id": "generated-uuid",
  "title": "Task title",
  ...
}
```

**Error Response (400):**
```json
{
  "error": "Task title is required"
}
```

#### Update Task
**PUT** `/tasks/:id`

Update an existing task. Only include fields you want to update.

**Request Body:**
```json
{
  "status": "completed",
  "priority": "medium"
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Task title",
  "status": "completed",
  "completedAt": "2025-12-11T19:00:00.000Z",
  "updatedAt": "2025-12-11T19:00:00.000Z",
  ...
}
```

**Notes:**
- When status changes to `completed`, `completedAt` is automatically set
- When status changes from `completed` to something else, `completedAt` is cleared
- `updatedAt` is automatically updated

#### Delete Task
**DELETE** `/tasks/:id`

Move a task to trash (soft delete). Task will be permanently deleted after 30 days.

**Response:**
```json
{
  "message": "Task moved to trash",
  "task": {
    "id": "uuid",
    "title": "Task title",
    "deletedAt": "2025-12-11T19:00:00.000Z",
    "permanentDeleteAt": "2026-01-10T19:00:00.000Z",
    ...
  }
}
```

---

### Trash

#### List Trash
**GET** `/trash`

Get all deleted tasks in trash.

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Deleted task",
    "deletedAt": "2025-12-11T19:00:00.000Z",
    "permanentDeleteAt": "2026-01-10T19:00:00.000Z",
    ...
  }
]
```

#### Restore from Trash
**POST** `/trash/:id/restore`

Restore a task from trash.

**Response:**
```json
{
  "message": "Task restored",
  "task": {
    "id": "uuid",
    "title": "Restored task",
    ...
  }
}
```

#### Permanent Delete
**DELETE** `/trash/:id`

Permanently delete a task from trash. This cannot be undone.

**Response:**
```json
{
  "message": "Task permanently deleted"
}
```

---

### Projects

#### List Projects
**GET** `/projects`

Get all projects.

**Response:**
```json
[
  {
    "id": "proj-1",
    "name": "Personal",
    "description": "Personal tasks and goals",
    "color": "#3B82F6",
    "icon": "👤",
    "parentId": null,
    "settings": {},
    "archived": false,
    "createdAt": "2025-12-11T19:00:00.000Z",
    "updatedAt": "2025-12-11T19:00:00.000Z"
  }
]
```

#### Get Single Project
**GET** `/projects/:id`

Get a specific project by ID.

**Response:**
```json
{
  "id": "proj-1",
  "name": "Personal",
  ...
}
```

#### Create Project
**POST** `/projects`

Create a new project.

**Request Body:**
```json
{
  "name": "Project Name",              // Required
  "description": "Description",        // Optional
  "color": "#6366F1",                 // Optional, hex color (default: #6366F1)
  "icon": "📁",                       // Optional, emoji (default: 📁)
  "parentId": "parent-project-id",    // Optional, for nested projects
  "settings": {}                      // Optional, custom settings
}
```

**Response (201 Created):**
```json
{
  "id": "generated-uuid",
  "name": "Project Name",
  ...
}
```

#### Update Project
**PUT** `/projects/:id`

Update an existing project.

**Request Body:**
```json
{
  "name": "Updated Name",
  "archived": true
}
```

**Response:**
```json
{
  "id": "proj-1",
  "name": "Updated Name",
  "archived": true,
  "updatedAt": "2025-12-11T19:00:00.000Z",
  ...
}
```

#### Delete Project
**DELETE** `/projects/:id`

Delete a project. Cannot delete if project has tasks.

**Response:**
```json
{
  "message": "Project deleted"
}
```

**Error Response (400):**
```json
{
  "error": "Cannot delete project with tasks. Please delete or move tasks first.",
  "taskCount": 5
}
```

#### Get Project Statistics
**GET** `/projects/:id/stats`

Get statistics for a specific project.

**Response:**
```json
{
  "totalTasks": 10,
  "completedTasks": 5,
  "inProgressTasks": 3,
  "notStartedTasks": 2,
  "blockedTasks": 0,
  "highPriorityTasks": 2,
  "overdueTasks": 1
}
```

---

### Dashboard

#### Get Dashboard Statistics
**GET** `/dashboard/stats`

Get overall application statistics.

**Response:**
```json
{
  "totalTasks": 25,
  "completedTasks": 10,
  "inProgressTasks": 8,
  "totalProjects": 5,
  "activeProjects": 4,
  "tasksDueToday": 3,
  "overdueTasks": 2,
  "highPriorityTasks": 5
}
```

---

### Users

#### List Users
**GET** `/users`

Get all users.

**Response:**
```json
[
  {
    "id": "user-1",
    "name": "Demo User",
    "email": "demo@example.com"
  }
]
```

---

## Error Codes

- **200 OK** - Request succeeded
- **201 Created** - Resource created successfully
- **400 Bad Request** - Invalid request data
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

## Data Validation

### Task Validation
- `title`: Required, max 255 characters
- `description`: Optional, max 10,000 characters
- `priority`: Must be one of: `high`, `medium`, `low`, `none`
- `status`: Must be one of: `not_started`, `in_progress`, `waiting`, `blocked`, `completed`

### Project Validation
- `name`: Required, cannot be empty

## Examples

### Create a task with curl
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My new task",
    "priority": "high",
    "status": "in_progress",
    "tags": ["urgent", "review"]
  }'
```

### Update task status
```bash
curl -X PUT http://localhost:3001/api/tasks/task-id \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

### Filter tasks
```bash
# High priority tasks
curl http://localhost:3001/api/tasks?priority=high

# Tasks in a specific project
curl http://localhost:3001/api/tasks?projectId=proj-1

# Search tasks
curl http://localhost:3001/api/tasks?search=documentation
```

### Create a project
```bash
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Project",
    "description": "Project description",
    "color": "#FF6B6B",
    "icon": "🚀"
  }'
```

## CORS

The API has CORS enabled and accepts requests from any origin. For production use, configure CORS to allow only specific domains.

## Rate Limiting

Currently, there is no rate limiting. For production deployment, implement rate limiting to prevent abuse.

## Authentication

The current implementation does not include authentication. For production use, implement authentication and authorization to secure the API.

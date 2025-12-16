# API Documentation

## Overview

The Todo Application API is a RESTful service that provides endpoints for managing users, tasks, projects, and teams.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication using JWT (JSON Web Tokens). Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "johndoe"
    },
    "token": "jwt-token-here"
  }
}
```

#### Get Profile
```http
GET /api/auth/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe"
  }
}
```

### Tasks

#### Get All Tasks
```http
GET /api/tasks
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Complete project",
      "description": "Finish the todo app",
      "status": "TODO",
      "priority": "HIGH",
      "dueDate": "2024-12-31T23:59:59Z",
      "creatorId": "uuid",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Create Task
```http
POST /api/tasks
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "New task",
  "description": "Task description",
  "projectId": "uuid",
  "status": "TODO",
  "priority": "MEDIUM",
  "dueDate": "2024-12-31T23:59:59Z"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "New task",
    "description": "Task description",
    "status": "TODO",
    "priority": "MEDIUM",
    "creatorId": "uuid",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### Update Task
```http
PUT /api/tasks/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated task",
  "status": "IN_PROGRESS"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Updated task",
    "status": "IN_PROGRESS",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### Delete Task
```http
DELETE /api/tasks/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

### Projects

#### Get All Projects
```http
GET /api/projects
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Personal Tasks",
      "description": "My personal todo list",
      "color": "#3B82F6",
      "status": "ACTIVE",
      "ownerId": "uuid",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Create Project
```http
POST /api/projects
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Work Project",
  "description": "Work-related tasks",
  "color": "#10B981",
  "status": "ACTIVE"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Work Project",
    "description": "Work-related tasks",
    "color": "#10B981",
    "status": "ACTIVE",
    "ownerId": "uuid",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Status Codes

- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing or invalid authentication
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Rate Limiting

API requests are rate-limited to prevent abuse:
- 100 requests per 15 minutes per IP address
- Authenticated users: 1000 requests per 15 minutes

## Versioning

The API is currently at version 1.0. Future versions will be indicated in the URL:
```
/api/v2/tasks
```

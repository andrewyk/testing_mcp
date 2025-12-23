# Quick Start Guide

## Get Started in 5 Minutes

This guide will help you set up and run the Comprehensive Todo Application locally.

### Prerequisites

- **Node.js** version 16 or higher
- **npm** (comes with Node.js)

Check your versions:
```bash
node --version
npm --version
```

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/andrewyk/testing_mcp.git
cd testing_mcp
```

#### 2. Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web framework for the API
- `cors` - Cross-Origin Resource Sharing middleware
- `dotenv` - Environment variable management

#### 3. Start the Server

```bash
npm start
```

You should see:
```
Todo API server running on http://localhost:3000
Health check: http://localhost:3000/health
API endpoints: http://localhost:3000/api/tasks
```

#### 4. Open the Application

Open your web browser and navigate to:
```
http://localhost:3000
```

You should see the Todo application interface!

### Using the Application

#### Adding a Task

1. Fill in the "Title" field (required)
2. Optionally add:
   - Description
   - Priority (High, Medium, Low, None)
   - Due Date
   - Status
3. Click "Add Task"

#### Managing Tasks

- **Complete a task**: Click the checkbox next to the task title
- **Filter tasks**: Use the filter buttons (All Tasks, Not Started, In Progress, etc.)
- **Delete a task**: Click the "Delete" button on any task

#### API Usage

You can also interact with the API directly:

**Get all tasks:**
```bash
curl http://localhost:3000/api/tasks
```

**Create a task:**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My first task",
    "priority": "high",
    "status": "not_started"
  }'
```

**Update a task:**
```bash
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

**Delete a task:**
```bash
curl -X DELETE http://localhost:3000/api/tasks/1
```

### Development Mode

For development with auto-restart on file changes:

```bash
npm run dev
```

Note: This requires `nodemon` which is included in devDependencies.

### Running Tests

Basic API tests:
```bash
node tests/api.test.js
```

Note: Make sure the server is running before executing tests.

### Troubleshooting

#### Port Already in Use

If port 3000 is already in use, you can change it:

1. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and change the port:
   ```
   PORT=3001
   NODE_ENV=development
   ```

3. Restart the server

#### CORS Errors

If you encounter CORS errors when accessing the API from a different origin:

- The server is configured to allow all origins in development
- For production, update the CORS configuration in `server/index.js`

#### Dependencies Not Installing

Try cleaning the npm cache:
```bash
npm cache clean --force
npm install
```

### Next Steps

- Read the [API Documentation](docs/API.md) for detailed endpoint information
- Check the [README](README.md) for the complete roadmap
- Explore the code in `server/index.js` to understand the implementation

### Getting Help

If you encounter issues:
1. Check that Node.js and npm are properly installed
2. Ensure port 3000 is available
3. Verify all dependencies installed correctly
4. Check the console for error messages

### What's Next?

This is Phase 1 of the comprehensive todo application. Future phases will add:
- Database persistence (PostgreSQL)
- User authentication
- Projects and tags
- Kanban board and calendar views
- Collaboration features
- Time tracking
- And much more!

Enjoy using the Todo Application! 🎉

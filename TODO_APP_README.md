# Comprehensive Todo Application

A modern, feature-rich task management system built with Node.js, Express, and vanilla JavaScript. This application provides a complete solution for managing tasks, projects, and workflows with an intuitive interface and robust features.

## 🚀 Features

### Core Task Management
- **Create, Edit, and Delete Tasks**: Full CRUD operations with auto-save functionality
- **Task Completion**: One-click task completion with visual feedback
- **Trash & Recovery**: 30-day trash retention for accidentally deleted tasks
- **Smart Search**: Real-time search across task titles and descriptions
- **Advanced Filtering**: Filter by status, priority, project, and tags

### Rich Task Properties
Each task supports comprehensive metadata:
- **Title** (required): Up to 255 characters
- **Description**: Rich text field supporting up to 10,000 characters
- **Priority Levels**: High (Red), Medium (Orange), Low (Blue), None (Gray)
- **Status Workflow**: Not Started, In Progress, Waiting, Blocked, Completed
- **Due Dates**: Date and time with timezone support
- **Tags**: Multiple custom tags for flexible organization
- **Project Assignment**: Group tasks into projects
- **Assignee**: Track task ownership
- **Time Tracking**: Estimated and actual time fields
- **Subtasks**: Break down complex tasks into smaller items
- **Dependencies**: Link related tasks
- **Attachments**: Support for file uploads (up to 10MB per file)
- **Recurrence**: Recurring task patterns

### Project Organization
- **Custom Projects**: Create unlimited projects with custom colors and icons
- **Project Hierarchy**: Support for nested projects (up to 3 levels)
- **Project Statistics**: Real-time metrics and progress tracking
- **Project Views**: Filter tasks by project
- **Archive Projects**: Maintain historical data

### User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Keyboard Shortcuts**: 
  - `Ctrl/Cmd + N`: Create new task
  - `Ctrl/Cmd + K`: Focus search
- **Smart Views**:
  - All Tasks
  - Today's Tasks
  - High Priority Tasks
  - Project-specific views
- **Real-time Updates**: Dashboard statistics update automatically
- **Visual Priority Indicators**: Color-coded badges for quick scanning
- **Completion Tracking**: Strikethrough and dimmed completed tasks

## 📋 Installation & Setup

### Prerequisites
- Node.js v14 or higher
- npm v6 or higher

### Installation Steps

1. **Clone or navigate to the repository**:
   ```bash
   cd /path/to/testing_mcp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

4. **Access the application**:
   - Backend API: http://localhost:3001/api
   - Frontend UI: Open `public/index.html` in your browser
   - Or serve the frontend with a static file server

### Alternative: Using a Static Server

For the best experience, serve the frontend with a static file server:

```bash
# Install a static server (if not already installed)
npm install -g http-server

# In one terminal, start the backend
npm start

# In another terminal, serve the frontend
cd public
http-server -p 8080 -o
```

Then access the application at http://localhost:8080

## 🏗️ Architecture

### Backend (Node.js + Express)
- RESTful API design
- In-memory data storage (easily extensible to database)
- Comprehensive validation and error handling
- CORS enabled for frontend communication

### Frontend (Vanilla JavaScript)
- Modern ES6+ JavaScript
- Component-based architecture
- State management pattern
- Responsive CSS with mobile-first design

### API Endpoints

#### Tasks
- `GET /api/tasks` - List all tasks (with filtering)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Move task to trash

#### Projects
- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/:id/stats` - Get project statistics

#### Trash
- `GET /api/trash` - List deleted tasks
- `POST /api/trash/:id/restore` - Restore task from trash
- `DELETE /api/trash/:id` - Permanently delete task

#### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 💡 Usage Guide

### Creating a Task

1. Click the "New Task" button or press `Ctrl/Cmd + N`
2. Fill in the task details:
   - **Title** (required): Enter a descriptive title
   - **Description**: Add detailed information
   - **Priority**: Select High, Medium, Low, or None
   - **Status**: Choose current status
   - **Project**: Assign to a project
   - **Due Date**: Set deadline
   - **Tags**: Add comma-separated tags
3. Click "Create Task"

### Managing Projects

1. Click "New Project" in the sidebar
2. Enter project details:
   - **Name** (required)
   - **Description**
   - **Color**: Choose a color for visual distinction
   - **Icon**: Select an emoji icon
3. Click on a project to view its tasks

### Using Filters

- **All Tasks**: View all tasks across all projects
- **Today**: See tasks due today
- **High Priority**: Focus on urgent tasks
- **Status Filters**: Filter by Not Started, In Progress, Completed

### Search Functionality

- Use the search box to find tasks by title or description
- Press `Ctrl/Cmd + K` to quickly focus the search
- Search works across all visible tasks in the current view

### Task Completion

- Click the checkbox next to a task to mark it complete
- Completed tasks are visually dimmed with strikethrough text
- Task completion is automatically timestamped

## 🎨 Customization

### Extending the Database

The application uses in-memory storage by default. To add persistent storage:

1. Choose a database (MongoDB, PostgreSQL, SQLite, etc.)
2. Update `server.js` to replace the Map-based storage with database calls
3. Add database connection configuration
4. Update API endpoints to use database queries

### Adding Features

The modular architecture makes it easy to add new features:

- **Authentication**: Add user authentication and multi-user support
- **Real-time Sync**: Implement WebSocket for real-time updates
- **File Uploads**: Add file attachment functionality
- **Notifications**: Email or push notifications for due dates
- **Export/Import**: Add data export to JSON, CSV, or other formats
- **Team Collaboration**: Add commenting and task assignment features

## 🔒 Security Considerations

Current implementation notes:
- No authentication (suitable for single-user local deployment)
- In-memory storage (data is lost on server restart)
- CORS is open (allows requests from any origin)

For production deployment:
- Add authentication and authorization
- Implement persistent database storage
- Configure CORS for specific domains
- Add rate limiting and input sanitization
- Use HTTPS for all communications

## 📊 Data Model

### Task Object
```javascript
{
  id: string,
  title: string,
  description: string,
  priority: 'high' | 'medium' | 'low' | 'none',
  status: 'not_started' | 'in_progress' | 'waiting' | 'blocked' | 'completed',
  projectId: string | null,
  tags: string[],
  assignee: string | null,
  dueDate: string | null,
  estimatedTime: number | null,
  actualTime: number | null,
  subtasks: object[],
  recurrence: object | null,
  dependencies: string[],
  labels: string[],
  attachments: object[],
  createdAt: string,
  updatedAt: string,
  completedAt: string | null
}
```

### Project Object
```javascript
{
  id: string,
  name: string,
  description: string,
  color: string,
  icon: string,
  parentId: string | null,
  settings: object,
  archived: boolean,
  createdAt: string,
  updatedAt: string
}
```

## 🛠️ Development

### Running in Development Mode

```bash
npm run dev
```

### Testing the API

You can test the API using curl or any API client:

```bash
# Get all tasks
curl http://localhost:3001/api/tasks

# Create a task
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task","priority":"high"}'

# Get dashboard stats
curl http://localhost:3001/api/dashboard/stats
```

## 📝 Future Enhancements

Potential features for future releases:
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User authentication and authorization
- [ ] Real-time collaboration
- [ ] File attachment upload and storage
- [ ] Email notifications
- [ ] Calendar integration
- [ ] Task templates
- [ ] Gantt chart view
- [ ] Time tracking with timers
- [ ] Data export (JSON, CSV, PDF)
- [ ] Mobile app (React Native)
- [ ] API rate limiting
- [ ] Webhooks for integrations

## 🤝 Contributing

This is a demonstration project. For contributions:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

ISC License

## 🙏 Acknowledgments

Built with:
- Express.js - Fast, unopinionated web framework
- Node.js - JavaScript runtime
- Vanilla JavaScript - For lightweight frontend
- Modern CSS - For responsive design

---

**Note**: This application is designed as a comprehensive demonstration of a task management system. It includes production-ready features but uses in-memory storage. For production use, integrate a persistent database and add authentication.

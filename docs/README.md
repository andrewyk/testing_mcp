# Comprehensive Todo Application

A modern, full-stack todo application with advanced task management features, built with React and Node.js.

## 🌟 Features

### Core Functionality
- ✅ **Task Management**: Create, edit, delete, and complete tasks
- 🎯 **Priorities**: High, Medium, Low, and No Priority levels
- 📅 **Due Dates**: Set deadlines for tasks
- 🏷️ **Tags**: Organize tasks with custom tags
- 📁 **Categories/Projects**: Group related tasks
- 📝 **Descriptions**: Rich text descriptions for tasks
- ⏱️ **Time Tracking**: Estimate time for tasks
- 🔄 **Status Tracking**: Not Started, In Progress, Waiting, Blocked, Completed

### User Features
- 🔐 **Authentication**: Secure user registration and login with JWT
- 👤 **User Profiles**: Personalized user accounts
- 🔒 **Authorization**: Protected routes and API endpoints

### Organization
- 📊 **Smart Lists**: Today, Upcoming, High Priority, Completed views
- 🔍 **Search**: Find tasks quickly by title or description
- 🗂️ **Filtering**: Filter by status, priority, and due date
- 📈 **Dashboard**: Overview of all tasks and projects

### UI/UX
- 🎨 **Modern Design**: Clean, intuitive interface
- 📱 **Responsive**: Works on desktop, tablet, and mobile
- 🎭 **Visual Indicators**: Color-coded priorities and status badges
- ⚡ **Fast**: Optimized performance

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Styling**: Custom CSS with utility classes

### Backend
- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **CORS**: Cross-origin resource sharing enabled

### Data Storage
- **Current**: In-memory storage (development)
- **Production Ready**: Designed for PostgreSQL/MongoDB integration

## 📋 Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- Docker (optional, for containerized deployment)

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/andrewyk/testing_mcp.git
   cd testing_mcp
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Configuration

1. **Backend Environment**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env and set your JWT_SECRET
   ```

2. **Frontend Environment**
   ```bash
   cd frontend
   cp .env.example .env
   # Edit .env if backend runs on different port
   ```

### Running Locally

1. **Start the Backend**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on http://localhost:5000

2. **Start the Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on http://localhost:5173

3. **Access the Application**
   - Open http://localhost:5173 in your browser
   - Register a new account
   - Start creating tasks!

## 🐳 Docker Deployment

Run the entire application with Docker Compose:

```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:5000

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Task Endpoints

All task endpoints require authentication. Include JWT token in header:
```
Authorization: Bearer <your-jwt-token>
```

#### Get All Tasks
```http
GET /api/tasks
GET /api/tasks?status=completed
GET /api/tasks?priority=high
GET /api/tasks?search=meeting
```

#### Create Task
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Complete project report",
  "description": "Write comprehensive report on Q4 results",
  "priority": "high",
  "dueDate": "2025-12-31",
  "category": "Work",
  "tags": ["reports", "important"],
  "status": "in_progress",
  "estimatedTime": 4
}
```

#### Update Task
```http
PUT /api/tasks/:id
Content-Type: application/json

{
  "title": "Updated task title",
  "status": "completed"
}
```

#### Delete Task
```http
DELETE /api/tasks/:id
```

#### Toggle Task Complete
```http
PATCH /api/tasks/:id/toggle
```

### Project Endpoints

#### Get All Projects
```http
GET /api/projects
```

#### Create Project
```http
POST /api/projects
Content-Type: application/json

{
  "name": "Work Projects",
  "description": "All work-related tasks",
  "color": "#3B82F6",
  "icon": "💼"
}
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Linting
```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

## 📁 Project Structure

```
testing_mcp/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # Data models
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Express middleware
│   │   └── index.js          # Entry point
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── contexts/         # React contexts
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # Entry point
│   ├── package.json
│   └── Dockerfile
├── docs/                     # Documentation
├── docker-compose.yml
└── README.md
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **CORS Protection**: Configured for specific origins
- **Input Validation**: Server-side validation of all inputs
- **XSS Protection**: React's built-in XSS protection
- **Authorization**: Route-level and API-level protection

## 🎯 Roadmap

### Phase 1: Core Foundation ✅
- [x] Backend API with Express
- [x] User authentication system
- [x] Basic task CRUD operations
- [x] React frontend with routing
- [x] Task list view

### Phase 2: Enhanced Features (In Progress)
- [x] Priority levels and due dates
- [x] Projects/categories system
- [x] Tags functionality
- [x] Smart lists and filtering
- [ ] Subtasks/checklists
- [ ] Markdown support in descriptions

### Phase 3: Views and Collaboration
- [ ] Kanban board view
- [ ] Calendar view
- [ ] Task assignment
- [ ] Commenting system
- [ ] Activity history
- [ ] Notifications

### Phase 4: Advanced Features
- [ ] Time tracking with timer
- [ ] Recurring tasks
- [ ] Reminders
- [ ] Templates
- [ ] File attachments
- [ ] Import/export

### Phase 5: Polish and Production
- [ ] Dark mode
- [ ] Keyboard shortcuts
- [ ] Comprehensive tests (80%+ coverage)
- [ ] Performance optimization
- [ ] Accessibility improvements (WCAG 2.1 AA)
- [ ] Database integration (PostgreSQL)
- [ ] CI/CD pipeline

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- Development Team

## 🙏 Acknowledgments

- React Team for the amazing framework
- Express.js community
- All open source contributors

## 📞 Support

For support, please open an issue in the GitHub repository.

---

Built with ❤️ using React and Node.js

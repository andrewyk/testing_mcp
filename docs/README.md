# Comprehensive Todo Application

A modern, feature-rich task management application built with React, TypeScript, Node.js, and Express.

## 🚀 Features

### Core Functionality
- ✅ **Task Management**: Create, edit, delete, and complete tasks
- 📊 **Priority Levels**: Organize tasks by High, Medium, Low, or No Priority
- 📅 **Due Dates**: Set deadlines with date and time support
- 📁 **Projects/Categories**: Group related tasks together
- 🏷️ **Tags**: Flexible categorization with custom tags
- 👤 **User Authentication**: Secure JWT-based auth system
- 📱 **Responsive Design**: Works seamlessly on all devices

### Task Properties
- Title and description (with markdown support)
- Priority levels with color coding
- Due dates and times
- Project assignment
- Task assignment
- Status tracking (Not Started, In Progress, Waiting, Blocked, Completed)
- Estimated and actual time tracking
- Tags for flexible organization

### Advanced Features (Planned)
- 📊 Multiple view types (List, Board, Calendar, Timeline)
- 💬 Comments and collaboration
- 🔔 Notifications and reminders
- ⏱️ Time tracking
- 🔁 Recurring tasks
- 📝 Task templates
- 📈 Analytics and reports

## 🏗️ Architecture

### Backend
- **Framework**: Node.js with Express
- **Language**: TypeScript
- **Authentication**: JWT tokens with bcrypt password hashing
- **Security**: Helmet, CORS, rate limiting
- **Data Store**: In-memory store (ready for database integration)

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router
- **HTTP Client**: Axios
- **Styling**: CSS with modern design principles

## 📁 Project Structure

```
.
├── backend/                 # Backend API server
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Data models
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utility functions
│   │   └── index.ts        # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom React hooks
│   │   ├── types/         # TypeScript types
│   │   ├── utils/         # Utility functions
│   │   └── App.tsx        # Main app component
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                  # Documentation
├── docker-compose.yml     # Docker orchestration (planned)
└── README.md             # This file
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd testing_mcp
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create environment file
   cp .env.example .env
   # Edit .env with your configuration
   
   # Build
   npm run build
   
   # Start development server
   npm run dev
   ```
   
   Backend will run on `http://localhost:5000`

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Start development server
   npm run dev
   ```
   
   Frontend will run on `http://localhost:5173`

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Tasks
- `GET /api/tasks` - Get all tasks (protected)
- `POST /api/tasks` - Create new task (protected)
- `GET /api/tasks/:id` - Get task by ID (protected)
- `PUT /api/tasks/:id` - Update task (protected)
- `DELETE /api/tasks/:id` - Delete task (protected)
- `PATCH /api/tasks/:id/toggle` - Toggle task completion (protected)

### Projects
- `GET /api/projects` - Get all projects (protected)
- `POST /api/projects` - Create new project (protected)
- `GET /api/projects/:id` - Get project by ID (protected)
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)

## 🔒 Security Features

- **Password Hashing**: bcrypt with cost factor 12
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Protection against brute force attacks
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing configuration
- **Input Validation**: Server-side validation on all endpoints

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📦 Deployment

### Development
The application is configured for local development with hot-reload enabled.

### Production (Planned)
- Docker containerization
- CI/CD pipeline with GitHub Actions
- Database migration system
- Environment-based configuration
- Monitoring and logging

## 🛣️ Roadmap

### Phase 1: Core Foundation ✅
- [x] Backend API setup
- [x] User authentication
- [x] Task CRUD operations
- [x] Project management
- [x] Frontend scaffold

### Phase 2: Enhanced Features (In Progress)
- [ ] Complete frontend UI
- [ ] Task filtering and sorting
- [ ] Tag management
- [ ] Smart lists (Today, Upcoming, etc.)
- [ ] Rich text editor for descriptions

### Phase 3: Views and Collaboration
- [ ] Kanban board view
- [ ] Calendar view
- [ ] Task assignment
- [ ] Comments system
- [ ] Notifications

### Phase 4: Advanced Features
- [ ] Time tracking
- [ ] Recurring tasks
- [ ] Templates
- [ ] File attachments
- [ ] Import/Export

### Phase 5: Polish and Launch
- [ ] Theme system
- [ ] Performance optimization
- [ ] Comprehensive testing
- [ ] Documentation
- [ ] Production deployment

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

For support, please open an issue in the GitHub repository.

---

**Built with ❤️ using modern web technologies**

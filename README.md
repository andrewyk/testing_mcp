# Todo Application

A modern, feature-rich todo application built with React, TypeScript, Node.js, and PostgreSQL.

## 🚀 Features

### Phase 1 - MVP (Current)
- ✅ User authentication (register/login with JWT)
- ✅ Basic task management (CRUD operations)
- ✅ Project management
- ✅ Responsive UI with Tailwind CSS
- ✅ RESTful API with Express.js
- ✅ Type-safe development with TypeScript
- ✅ State management with Redux Toolkit

### Planned Features
- Team collaboration
- Task comments and attachments
- Labels and tags
- Calendar and timeline views
- Advanced search and filtering
- Real-time updates with WebSockets
- Notifications
- Analytics and reporting
- Mobile app (PWA)
- Offline support

## 🏗️ Architecture

### Frontend
- **Framework**: React 18+ with TypeScript
- **State Management**: Redux Toolkit with RTK Query
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Form Handling**: React Hook Form with Zod validation
- **Animations**: Framer Motion
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL 15+
- **Caching**: Redis
- **Authentication**: JWT with bcrypt
- **Validation**: Zod

## 📋 Prerequisites

- Node.js 20+ and npm
- PostgreSQL 15+
- Redis (optional, for caching)
- Docker & Docker Compose (optional, for containerized setup)

## 🛠️ Installation

### Local Development (without Docker)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd testing_mcp
   ```

2. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb todoapp
   
   # Run the schema
   psql todoapp < database/schema.sql
   ```

3. **Set up the backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your database credentials
   npm run dev
   ```

4. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env if needed
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

### Docker Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## 📁 Project Structure

```
.
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store and slices
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions
│   │   ├── hooks/          # Custom React hooks
│   │   └── services/       # API service layer
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                 # Node.js backend application
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Data models
│   │   ├── utils/          # Utility functions
│   │   └── config/         # Configuration files
│   ├── package.json
│   └── tsconfig.json
│
├── database/                # Database schema and migrations
│   └── schema.sql
│
└── docker-compose.yml       # Docker orchestration
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Tasks
- `GET /api/tasks` - Get all tasks (protected)
- `GET /api/tasks/:id` - Get task by ID (protected)
- `POST /api/tasks` - Create new task (protected)
- `PUT /api/tasks/:id` - Update task (protected)
- `DELETE /api/tasks/:id` - Delete task (protected)

### Projects
- `GET /api/projects` - Get all projects (protected)
- `GET /api/projects/:id` - Get project by ID (protected)
- `POST /api/projects` - Create new project (protected)
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
npm test
```

## 🚀 Deployment

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
# Output in dist/ directory
```

**Backend:**
```bash
cd backend
npm run build
# Output in dist/ directory
npm start
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Input validation with Zod
- SQL injection prevention
- XSS protection with Helmet
- CORS configuration
- Environment variable management

## 📝 Development Roadmap

### Phase 1 - MVP ✅
- [x] Basic authentication
- [x] Task CRUD operations
- [x] Project management
- [x] Basic UI

### Phase 2 - Enhanced Features
- [ ] Team collaboration
- [ ] Comments and attachments
- [ ] Labels and filtering
- [ ] Calendar view
- [ ] Search functionality

### Phase 3 - Advanced Features
- [ ] Real-time updates
- [ ] Notifications system
- [ ] Analytics dashboard
- [ ] Time tracking
- [ ] Recurring tasks

### Phase 4 - Enterprise Features
- [ ] Advanced permissions
- [ ] Custom workflows
- [ ] API webhooks
- [ ] Import/export
- [ ] White-labeling

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React and the React team
- Express.js community
- PostgreSQL contributors
- All open-source libraries used in this project

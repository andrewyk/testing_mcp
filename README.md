# TodoApp - Modern Full-Stack Task Management Application

A comprehensive, feature-rich todo application built with modern web technologies. This application demonstrates best practices in full-stack development, including clean architecture, responsive design, accessibility, and secure authentication.

## 🚀 Features

### Core Functionality
- ✅ **Task Management**: Create, read, update, and delete todos with rich metadata
- 📁 **Project Organization**: Group tasks into projects with color coding
- 🏷️ **Tagging System**: Flexible categorization with custom tags
- 🔍 **Search & Filter**: Advanced filtering by status, priority, project, and search
- 📊 **Statistics Dashboard**: Real-time insights into your productivity
- 🌓 **Dark Mode**: Comfortable viewing in any lighting condition
- 📱 **Responsive Design**: Seamless experience across all devices

### Task Features
- Priority levels (Low, Medium, High)
- Due dates with overdue tracking
- Subtasks/checklist items
- Rich descriptions
- Project assignment
- Multiple tags per task
- Soft delete with trash functionality

### User Experience
- Intuitive drag-and-drop interface
- Keyboard shortcuts for power users
- Real-time updates
- Smooth animations and transitions
- Accessible design (WCAG 2.1 AA compliant)

## 🏗️ Architecture

### Backend (Node.js + Express)
- **RESTful API** with clean endpoint design
- **SQLite Database** with normalized schema
- **JWT Authentication** for secure sessions
- **Input Validation** using express-validator
- **Security Headers** with Helmet
- **Rate Limiting** to prevent abuse
- **CORS** configuration for cross-origin requests

### Frontend (React + Vite)
- **Modern React** with hooks and functional components
- **Zustand** for lightweight state management
- **React Router** for client-side routing
- **Tailwind CSS** for utility-first styling
- **Axios** for API communication
- **date-fns** for date manipulation
- **React Icons** for consistent iconography

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Git

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/andrewyk/testing_mcp.git
cd testing_mcp
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm start
```

The backend will run on `http://localhost:3000`

3. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=3000
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend Configuration

The frontend is pre-configured to proxy API requests to `http://localhost:3000`. You can modify this in `frontend/vite.config.js`.

## 📚 API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Todo Endpoints

#### Get All Todos
```http
GET /api/todos?status=active&priority=high&sort=due_date&order=asc
Authorization: Bearer <token>
```

#### Create Todo
```http
POST /api/todos
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the todo app",
  "priority": "high",
  "due_date": "2024-01-15",
  "project_id": 1,
  "tags": [1, 2]
}
```

#### Update Todo
```http
PUT /api/todos/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "completed": true
}
```

#### Delete Todo
```http
DELETE /api/todos/:id?permanent=false
Authorization: Bearer <token>
```

#### Get Statistics
```http
GET /api/todos/stats
Authorization: Bearer <token>
```

### Project Endpoints

#### Get All Projects
```http
GET /api/projects
Authorization: Bearer <token>
```

#### Create Project
```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Work",
  "description": "Work-related tasks",
  "color": "#3B82F6"
}
```

### Tag Endpoints

#### Get All Tags
```http
GET /api/tags
Authorization: Bearer <token>
```

#### Create Tag
```http
POST /api/tags
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "urgent",
  "color": "#EF4444"
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

## 🚀 Deployment

### Docker Deployment

A Dockerfile is provided for containerized deployment:

```bash
docker build -t todoapp .
docker run -p 3000:3000 -p 5173:5173 todoapp
```

### Manual Deployment

1. **Build Frontend**
```bash
cd frontend
npm run build
```

2. **Configure Backend for Production**
- Update `.env` with production values
- Set `NODE_ENV=production`
- Use a production-grade database
- Configure HTTPS

3. **Start Backend**
```bash
cd backend
npm start
```

## 🔐 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: All inputs validated and sanitized
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Content sanitization
- **CORS Configuration**: Restricted origins
- **Rate Limiting**: Prevents brute force attacks
- **Security Headers**: Helmet.js middleware

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- Screen reader optimized
- High contrast mode support
- Color contrast compliance (WCAG AA)

## 🎨 Customization

### Theming

Customize the color scheme in `frontend/tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      }
    }
  }
}
```

### Dark Mode

Dark mode is automatically detected from system preferences and can be toggled manually. The preference is saved in localStorage.

## 📝 Development

### Project Structure

```
testing_mcp/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── store/          # State management
│   │   ├── App.jsx         # Root component
│   │   └── main.jsx        # Entry point
│   └── package.json
└── docs/                   # Documentation
```

### Code Style

- ESLint for linting
- Prettier for formatting (recommended)
- Follow existing code patterns
- Write meaningful commit messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- The open-source community for inspiration and tools

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Built with ❤️ using modern web technologies

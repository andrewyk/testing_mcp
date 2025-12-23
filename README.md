# Modern Full-Stack Todo Application

A comprehensive, production-ready todo application demonstrating modern web development best practices with clean architecture and user-centric design.

![Todo App](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🚀 Features

### Core Functionality
- ✅ **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- ✅ **Todo Management**: Full CRUD operations for tasks
- ✅ **Advanced Filtering**: Filter by status, priority, category, tags, and search
- ✅ **Bulk Operations**: Select and operate on multiple todos simultaneously
- ✅ **Categories & Tags**: Organize todos with custom categories and tags
- ✅ **Priority Levels**: Set priorities (Low, Medium, High, Urgent)
- ✅ **Due Dates**: Schedule tasks with due date tracking
- ✅ **Subtasks**: Break down complex tasks into smaller subtasks
- ✅ **Pagination**: Efficient handling of large todo lists
- ✅ **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### Security Features
- 🔒 Password hashing with bcrypt
- 🔒 JWT token authentication
- 🔒 Rate limiting on all API endpoints
- 🔒 Strict rate limiting on authentication endpoints (prevents brute force)
- 🔒 CORS protection
- 🔒 Helmet.js security headers
- 🔒 Input validation on both client and server
- 🔒 SQL injection prevention with Prisma ORM

### Technical Excellence
- ⚡ Fast and efficient API with Express.js
- ⚡ PostgreSQL database with Prisma ORM
- ⚡ Next.js 14+ with App Router
- ⚡ TypeScript throughout for type safety
- ⚡ TailwindCSS for modern, responsive UI
- ⚡ RESTful API design
- ⚡ Comprehensive error handling

## 📋 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT, bcryptjs
- **Security**: Helmet, express-rate-limit, CORS
- **Validation**: express-validator

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **HTTP Client**: Axios
- **State Management**: React Context API

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/todoapp"
   PORT=3001
   NODE_ENV=development
   JWT_SECRET=your-super-secret-key-change-in-production
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=http://localhost:3000
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

   The backend API will be available at `http://localhost:3001`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

## 📚 Database Schema

The application uses a normalized PostgreSQL schema with proper relationships and indexes:

- **Users**: Authentication and user data
- **Todos**: Main todo items with status, priority, due dates
- **Categories**: User-defined categories for organization
- **Tags**: Flexible tagging system
- **TodoTags**: Many-to-many relationship between todos and tags
- **Subtasks**: Break down todos into smaller tasks

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile (protected)

### Todos
- `GET /api/todos` - Get all todos (with filtering, search, pagination)
- `POST /api/todos` - Create new todo
- `GET /api/todos/:id` - Get single todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
- `POST /api/todos/bulk-delete` - Delete multiple todos
- `POST /api/todos/bulk-update` - Update multiple todos

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Tags
- `GET /api/tags` - Get all tags
- `POST /api/tags` - Create tag
- `PUT /api/tags/:id` - Update tag
- `DELETE /api/tags/:id` - Delete tag

## 🚦 Available Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (DB GUI)

### Frontend
- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🔐 Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **JWT Secret**: Use a strong, random JWT secret in production
3. **HTTPS**: Always use HTTPS in production
4. **Rate Limiting**: Configured to prevent abuse
5. **Password Requirements**: Minimum 8 characters enforced
6. **CORS**: Configured for specified frontend URL

## 🎯 Success Metrics

- ✅ Application loads in under 3 seconds
- ✅ All CRUD operations complete in under 500ms
- ✅ Mobile responsive on all screen sizes
- ✅ Secure authentication with industry-standard practices
- ✅ Handles 1000+ todos per user efficiently

## 📝 Project Structure

```
.
├── backend/              # Backend API
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Express middleware
│   │   ├── routes/      # API routes
│   │   └── utils/       # Helper functions
│   └── prisma/          # Database schema
│
└── frontend/            # Frontend application
    ├── app/            # Next.js pages
    ├── components/     # React components
    └── lib/           # Utilities and API clients
```

## 🚀 Deployment

### Backend
Recommended: Railway, Heroku, AWS, DigitalOcean

### Frontend
Recommended: Vercel (optimized for Next.js), Netlify

### Database
Recommended: Railway Postgres, Heroku Postgres, Supabase, Neon

## 📄 License

MIT License - free to use for learning or personal projects.

---

**Built with ❤️ using TypeScript, Next.js, Express, and PostgreSQL**

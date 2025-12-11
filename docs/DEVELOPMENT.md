# Development Guide

This guide will help you set up the development environment and understand the codebase.

## Prerequisites

- Node.js 18 or higher
- npm 8 or higher
- Git
- A code editor (VS Code recommended)

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd testing_mcp
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file from example:
```bash
cp .env.example .env
```

Edit `.env` with your settings:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key-change-this
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

The default configuration should work:
```env
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

The backend will run on http://localhost:5000 with hot-reload enabled.

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The frontend will run on http://localhost:5173 with hot-reload enabled.

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
# Serve the dist folder with a web server
```

## Development Workflow

### Adding a New Feature

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following the code structure

3. Test your changes locally

4. Commit with a descriptive message:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. Push and create a pull request

### Code Structure

#### Backend (`/backend/src/`)

```
src/
├── controllers/     # Request handlers
│   ├── auth.controller.ts
│   ├── task.controller.ts
│   └── project.controller.ts
├── middleware/      # Express middleware
│   ├── auth.ts
│   ├── errorHandler.ts
│   └── rateLimiter.ts
├── models/          # Data models
│   └── dataStore.ts
├── routes/          # API routes
│   ├── auth.routes.ts
│   ├── task.routes.ts
│   └── project.routes.ts
├── types/           # TypeScript types
│   └── index.ts
└── index.ts         # Application entry point
```

#### Frontend (`/frontend/src/`)

```
src/
├── components/      # Reusable React components
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── TaskList.tsx
│   └── TaskForm.tsx
├── pages/           # Page components
│   ├── Login.tsx
│   ├── Register.tsx
│   └── Dashboard.tsx
├── context/         # React Context providers
│   └── AuthContext.tsx
├── services/        # API service layer
│   └── api.ts
├── types/           # TypeScript types
│   └── index.ts
├── App.tsx          # Main application component
└── main.tsx         # Application entry point
```

### Adding a New API Endpoint

1. **Define the route** in `backend/src/routes/`:
   ```typescript
   router.get('/new-endpoint', authenticate, controller.handler);
   ```

2. **Create the controller** in `backend/src/controllers/`:
   ```typescript
   export const handler = async (req: AuthRequest, res: Response, next: NextFunction) => {
     try {
       // Your logic here
       res.status(200).json({ success: true, data: {} });
     } catch (error) {
       next(error);
     }
   };
   ```

3. **Add the API call** in `frontend/src/services/api.ts`:
   ```typescript
   async newEndpoint(): Promise<AxiosResponse> {
     return this.api.get('/new-endpoint');
   }
   ```

4. **Use in components**:
   ```typescript
   import api from '../services/api';
   
   const data = await api.newEndpoint();
   ```

### Adding a New React Component

1. Create component file in `frontend/src/components/`:
   ```typescript
   import React from 'react';
   import './MyComponent.css';
   
   interface MyComponentProps {
     // Props here
   }
   
   const MyComponent: React.FC<MyComponentProps> = ({ }) => {
     return (
       <div className="my-component">
         {/* Component JSX */}
       </div>
     );
   };
   
   export default MyComponent;
   ```

2. Create corresponding CSS file

3. Import and use in parent components

## Testing

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

### Manual Testing

1. Start both backend and frontend
2. Open http://localhost:5173
3. Register a new user
4. Create tasks and projects
5. Test all features

## Building for Production

### Using Docker

```bash
# Build images
docker-compose build

# Run containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

### Manual Build

**Backend:**
```bash
cd backend
npm run clean
npm run build
# Deploy dist/ folder
```

**Frontend:**
```bash
cd frontend
npm run build
# Deploy dist/ folder to static hosting
```

## Troubleshooting

### Backend won't start

- Check if port 5000 is already in use
- Verify `.env` file exists and has correct values
- Check Node.js version (must be 18+)

### Frontend can't connect to backend

- Ensure backend is running on http://localhost:5000
- Check CORS configuration in backend
- Verify `VITE_API_URL` in frontend `.env`

### TypeScript errors

- Run `npm install` to ensure all dependencies are installed
- Check `tsconfig.json` configuration
- Restart VS Code TypeScript server

## Code Style

### Backend

- Use TypeScript strict mode
- Follow RESTful conventions
- Use async/await for async operations
- Implement proper error handling
- Add input validation

### Frontend

- Use functional components with hooks
- Keep components small and focused
- Use TypeScript for type safety
- Follow React best practices
- Implement proper loading and error states

## Git Workflow

- `main` - Production branch
- `develop` - Development branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches

### Commit Message Format

```
type: description

[optional body]
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style changes
- `refactor` - Code refactoring
- `test` - Tests
- `chore` - Maintenance

## Resources

- [React Documentation](https://react.dev)
- [Express Documentation](https://expressjs.com)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Vite Documentation](https://vitejs.dev)

## Getting Help

- Check existing issues on GitHub
- Read the documentation
- Ask in discussions
- Create a new issue if needed

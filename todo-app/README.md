# Todo App

A modern, feature-rich todo application built with React, Vite, and Tailwind CSS. Manage your tasks efficiently with a clean, intuitive interface.

![Todo App](https://img.shields.io/badge/React-19.2.0-blue) ![Vite](https://img.shields.io/badge/Vite-7.2.4-purple) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1-cyan)

## Features

### Core Functionality
- ✅ **Add, Edit, Delete Tasks** - Full CRUD operations for task management
- ✅ **Mark Complete/Incomplete** - Toggle task completion status
- ✅ **Persistent Storage** - All tasks saved to browser localStorage
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile (320px - 1920px)

### Task Organization
- 📁 **Categories** - Organize tasks into customizable categories (Work, Personal, Shopping, etc.)
- 🎯 **Priority Levels** - Assign priority (High, Medium, Low) with color coding
- 📅 **Due Dates** - Set optional due dates with overdue indicators
- 🔍 **Search** - Search tasks by title or description
- 🎛️ **Filters** - Filter by status (All, Active, Completed), priority, and category
- 📊 **Sort** - Sort tasks by creation date, due date, or priority

### User Experience
- 🎨 **Dark/Light Mode** - Toggle between themes with smooth transitions
- 🖱️ **Drag & Drop** - Reorder tasks by dragging
- ⌨️ **Keyboard Shortcuts** - Quick actions via keyboard
- ♿ **Accessibility** - ARIA labels and keyboard navigation support
- 📤 **Export/Import** - Backup and restore tasks via JSON files

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/andrewyk/testing_mcp.git
cd testing_mcp/todo-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage

### Adding a Task
1. Enter a task title in the main input field
2. Optionally add a description, priority, category, and due date
3. Click "Add Task" or press Enter

### Managing Tasks
- **Complete**: Click the checkbox next to a task
- **Edit**: Click the edit icon (visible on hover)
- **Delete**: Click the trash icon (visible on hover)
- **Reorder**: Drag tasks by the grip handle (visible on hover)

### Filtering and Searching
- Use the search bar to find tasks by title or description
- Filter by status, priority, or category using the dropdown menus
- Sort tasks by creation date, due date, or priority

### Categories
- Create custom categories with colors
- Edit or delete existing categories
- Assign tasks to categories for better organization

### Data Management
- **Export**: Click the download icon in the header to export all tasks as JSON
- **Import**: Click the upload icon to import tasks from a JSON file

### Keyboard Shortcuts
- `Ctrl/Cmd + K` - Toggle dark/light mode
- `Ctrl/Cmd + C` - Toggle category manager visibility

## Project Structure

```
todo-app/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── Header.jsx
│   │   ├── TaskForm.jsx
│   │   ├── TaskItem.jsx
│   │   ├── TaskList.jsx
│   │   ├── FilterBar.jsx
│   │   └── CategoryManager.jsx
│   ├── contexts/        # React Context providers
│   │   ├── TaskContext.jsx
│   │   ├── CategoryContext.jsx
│   │   └── ThemeContext.jsx
│   ├── utils/           # Utility functions
│   │   ├── storage.js
│   │   └── taskHelpers.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Technologies Used

- **React 19.2.0** - UI library
- **Vite 7.2.4** - Build tool and dev server
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **@hello-pangea/dnd** - Drag and drop functionality
- **date-fns** - Date formatting and manipulation
- **lucide-react** - Icon library

## Data Model

### Task Object
```javascript
{
  id: string,              // Unique identifier
  title: string,           // Task title (required)
  description: string,     // Task description (optional)
  completed: boolean,      // Completion status
  priority: string,        // "high" | "medium" | "low"
  category: string,        // Category ID (optional)
  dueDate: string,         // ISO date string (optional)
  createdAt: string,       // ISO date string
  updatedAt: string        // ISO date string
}
```

### Category Object
```javascript
{
  id: string,              // Unique identifier
  name: string,            // Category name
  color: string,           // Hex color code
  createdAt: string        // ISO date string
}
```

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Initial load time: < 2 seconds
- Smooth animations at 60fps
- Optimized for devices from 320px to 1920px wide

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Design inspiration from modern todo applications
- Built with modern React best practices

## Support

For issues or questions, please open an issue on the GitHub repository.

# testing_mcp
Testing repository for MCP

📐
🔴

## Todo App

A simple, vanilla JavaScript Todo application with localStorage persistence.

### Features

- ✅ Add new todo items
- ✅ Mark todos as completed (toggle)
- ✅ Delete individual todos
- ✅ Filter view (All / Active / Completed)
- ✅ Persistent storage using localStorage
- ✅ Clean, responsive UI

### How to Run

1. Navigate to the `todo-app` directory
2. Open `index.html` in your web browser

**Option 1: Direct file opening**
```bash
# On Linux/Mac
open todo-app/index.html

# On Windows
start todo-app/index.html
```

**Option 2: Using a local server (recommended)**
```bash
# Using Python 3
cd todo-app
python3 -m http.server 8000

# Using Node.js (if you have npx)
cd todo-app
npx http-server -p 8000

# Then open http://localhost:8000 in your browser
```

### Usage

- **Add a todo**: Type in the input field and click "Add" or press Enter
- **Complete a todo**: Click the checkbox next to the todo item
- **Delete a todo**: Click the "Delete" button on the todo item
- **Filter todos**: Use the All/Active/Completed buttons to filter the view
- **Clear completed**: Click "Clear Completed" to remove all completed todos

Your todos are automatically saved to localStorage and will persist across browser sessions.

## Story

Once upon a time, a developer named Alex sat down at their desk with a cup of coffee and a dream. They wanted to build something simple yet useful — a place to keep track of all the little tasks that cluttered their mind.

"I'll call it the Todo App," Alex said, fingers already dancing across the keyboard.

Line by line, the app came to life. A clean input field, a growing list of tasks, checkboxes that toggled with satisfying clicks. Alex added filters so they could see *all* tasks, just the *active* ones, or only the *completed* victories.

One rainy afternoon, Alex closed the browser tab by mistake and held their breath. But when they reopened it, every task was still there — saved quietly in localStorage, waiting patiently like old friends.

From that day on, Alex never forgot a task again. And the Todo App, small but mighty, lived on in browsers everywhere.

*The end.* 🚀

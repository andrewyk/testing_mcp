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

It was a Monday morning when Alex, a mid-level developer, sat down with a fresh cup of coffee and an overwhelming sprint backlog. The standup was in 20 minutes, and there were a dozen tasks to track across two projects.

Rather than drowning in sticky notes and scattered browser tabs, Alex opened the **Todo App** and started typing:

> *"Fix auth bug"* — added. *"Write unit tests for payment service"* — added. *"Review PR from Sarah"* — added.

One by one, the tasks filled the list. By the time the standup ended, Alex had already checked off two items just from things resolved during the meeting. The satisfying click of the checkbox and the clean strikethrough felt strangely motivating.

By Wednesday, the sprint was moving at a comfortable pace. Alex filtered the view to **Active** to focus only on what remained, ignoring the growing pile of completed tasks. Later, switching to **Completed** gave a clear picture of how much had actually been accomplished — a quiet confidence booster heading into the week's retrospective.

On Friday afternoon, Alex closed the laptop, went home for the weekend — and came back Monday to find every todo still exactly where it was left, thanks to **localStorage persistence**. No login, no account, no syncing required. Just a simple, reliable list waiting to help tackle another week.

*Sometimes the simplest tools make the biggest difference.*

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

---

## 📖 The Todo That Changed Everything

In the quiet city of Localhost, a developer named Alex stared at a blank screen. Deadlines loomed, tasks piled up, and sticky notes covered every inch of the monitor. Something had to change.

That evening, Alex opened `index.html`, typed the first task — *"Fix the login bug"* — and pressed Enter. The item appeared instantly, neat and clear. A small checkbox sat beside it, patient and ready.

Over the next few hours, Alex worked through the list one task at a time, clicking each checkbox with quiet satisfaction. Completed items faded into the *Completed* filter, out of sight but not forgotten.

Then came the true test: a browser refresh. Alex held their breath — but every todo was still there, faithfully restored from localStorage. The app had remembered everything.

By the end of the day, Alex clicked *Clear Completed*, and the finished tasks vanished cleanly. The list was lean, the mind was clear, and for the first time in weeks, tomorrow felt manageable.

It wasn't magic. It was just a todo app — but sometimes, that's exactly enough.

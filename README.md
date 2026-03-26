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

## 📖 Story: The Freelancer Who Found Focus

It was 9 p.m. on a Tuesday when Leila, a freelance web developer, sat down with three deadlines converging on Friday. Her inbox was a battlefield of client requests, bug reports, and half-finished feature branches. She opened her browser, navigated to the Todo app, and started typing.

*"Fix nav-bar bug — client A"*, *"Write API docs — client B"*, *"Deploy staging — client C"*.

Six tasks later, the list stared back at her. It felt overwhelming — until she clicked **Active** in the filter bar. Suddenly, only the unfinished work remained on screen. The noise disappeared.

She worked through the night, checking off tasks one by one. Around midnight, her laptop froze. Heart in her throat, she force-quit the browser and reopened the tab. The list was exactly as she'd left it — every task intact, every checkmark in place, all of it quietly preserved in localStorage while she panicked.

By Thursday morning, only two items remained. She switched back to **All**, added a final task — *"Send invoices"* — and smiled. She clicked **Clear Completed**, and the finished work vanished, leaving only what mattered.

Friday afternoon, all three clients received their deliveries on time. Leila closed her laptop, made coffee, and added one last todo: *"Take the weekend off"*.

She checked it off immediately.

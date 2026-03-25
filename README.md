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

## 📖 Story: The Teacher Who Tamed the Chaos

Sam had been teaching fifth grade for eleven years, and every September felt the same: twenty-six students, four field trips to schedule, a hundred permission slips to chase down, and a stack of lesson plans that somehow needed to exist by Friday.

This September was different, though. A colleague had mentioned the Todo app during a staff meeting, almost as a throwaway comment. "It's just a webpage," she said. "Nothing fancy. But it keeps me sane."

Sam was skeptical. A list in a browser tab? She had notebooks for that. Color-coded, tabbed, spiral-bound notebooks.

Still, she opened `index.html` one quiet Tuesday evening at her kitchen table, coffee going cold beside her.

She typed the first task: *Grade volcano reports – due Thursday.* Pressed Enter. There it was, sitting neatly at the top of the list. She typed a second, a third — permission slips, the science-supply order, a call to Marcus's parents, a reminder to laminate the new word-wall cards. Seven tasks in two minutes. No flipping to a new page, no hunting for the right pen.

She closed the laptop and went to bed.

Wednesday morning, coffee still hot, she opened the tab again. All seven tasks were waiting — exactly as she'd left them, pulled silently from localStorage without so much as a loading spinner. She checked off *Grade volcano reports* after lunch and watched it slide into the Completed filter with quiet satisfaction.

By Friday afternoon the list was empty. Not because the work had disappeared, but because it was done. Sam leaned back in her chair, looked at the tidy little app, and typed one final task for next week: *Tell the staff-meeting crowd they were right.*

She checked it off immediately.

---

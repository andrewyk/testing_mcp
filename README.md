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

## 📖 Story: The Sprint That Almost Broke Marcus

Marcus was a junior developer at a small startup, and Monday morning had already gone sideways before his first coffee cooled down.

His team lead had just dropped five new tickets into his lap — a login bug, two UI fixes, a database migration script, and a README update — all due before the end-of-sprint demo on Friday at 2 p.m. Five tasks. Four days. One very anxious developer.

He opened the Todo app, typed in each task, and pressed **Enter** after every one. Seeing them listed out on the screen made his chest loosen just a little. The mountain looked smaller when you could count the rocks.

By Tuesday evening he had squashed the login bug and pushed both UI fixes. He clicked the checkboxes next to all three items and watched them slide into the **Completed** section. A small win, but a win.

Then disaster struck. His laptop battery died mid-session on Wednesday morning — no charger in sight, borrowed a colleague's machine, opened the browser, and navigated back to the app. Every single task was still there, exactly as he had left it. localStorage had quietly saved everything in the background without him even thinking about it. He exhaled, clicked **Active**, and focused on the two tasks that still needed him.

The database migration script took most of Wednesday and all of Thursday morning. By Thursday afternoon it was done and tested. One checkbox. One item left.

Friday, 7 a.m. He opened the app, clicked the **Active** filter so only the README update stared back at him, and got to work. At 1:52 p.m. — eight minutes before the demo — he clicked that final checkbox, hit **Clear Completed**, and watched the list go blank.

The demo went flawlessly. His team lead gave him a nod across the table.

Marcus closed his laptop and made a mental note: next sprint, open the Todo app first.

**Lesson:** A simple list, persistent storage, and a good filter are sometimes all the project management you need.

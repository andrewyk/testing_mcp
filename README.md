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

## 📖 A Story: The Weekend That Almost Got Away

Jordan had exactly 48 hours to move into a new apartment and still meet a Monday morning work deadline.

Friday night, laptop open on a cardboard box, Jordan opened the Todo app and started typing. *"Pack kitchen,"* *"Call moving truck,"* *"Finish client report,"* *"Buy bubble wrap."* Eight tasks in two minutes.

Saturday morning arrived in a blur of tape guns and confusion. Jordan grabbed a coffee, opened a new browser tab, and — the todos were still there. Every single one, exactly as left the night before. localStorage to the rescue.

By noon, *"Pack kitchen"* and *"Buy bubble wrap"* were checked off. Jordan switched to the **Active** filter to hide the noise and focus on what remained: the moving truck, the report, two more boxes.

Sunday evening, with the last box unpacked and the client report submitted, Jordan clicked **Clear Completed** and watched the list shrink to nothing.

The apartment was a mess. The deadline was met. The list was empty.

*Not bad for 48 hours.*

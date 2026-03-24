# testing_mcp
Testing repository for MCP

## 🎭 A Poem for Coders

```
In the realm of ones and zeros bright,
Where algorithms dance through the night,
Code flows like rivers, clean and true,
Creating worlds both old and new.

Functions call and variables store,
While loops repeat forevermore,
Git commits tell our coding tale,
Through every bug and every fail.

In this repository we test and learn,
Where curiosity makes fires burn,
MCP connections bridge the gap,
Between our dreams and this code map.

So here's to testing, here's to code,
To every merge and episode,
May your builds always pass with green,
And bugs be quickly found and cleaned.
```

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

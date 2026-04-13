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

## Story: The Midnight Release

It was 11:45 PM when Jordan finally opened the Todo app.

The product launch was in fifteen minutes and the checklist in his head had grown too long to trust to memory alone. He typed quickly, fingers moving from habit:

- *Push final build to staging*
- *Send launch email to beta users*
- *Update changelog on the website*
- *Post announcement on social media*
- *Notify the on-call engineer*

One by one the items appeared in the list. He clicked "Active" to keep his focus tight — completed tasks would only distract him now.

He ran the staging deploy script, watched the terminal scroll green, and came back to the app. He checked off *Push final build to staging*. The checkbox snapped closed with a satisfying click and the item faded from the Active view, leaving four sharp tasks staring back at him.

Three minutes later the beta email was out. Another checkbox. Another item gone.

At 11:58 Jordan's laptop fan whirred, the browser froze, and his stomach dropped — *the tab.* He had to force-quit Chrome and relaunch it. His hands were shaking slightly as he navigated back to the app.

The list was exactly as he'd left it: two items completed, three still open. localStorage had saved everything.

He exhaled.

*Update changelog.* Done. *Post announcement.* Done. *Notify the on-call engineer.* A quick Slack ping — done.

At midnight exactly he clicked "Completed" to review what he'd shipped through. Five tasks, all ticked. He hit "Clear Completed" and the list went blank — a clean slate for whatever came next.

Jordan closed the laptop and smiled. The launch was live.


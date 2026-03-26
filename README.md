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

## 📖 Story: The Launch That Almost Slipped Away

It was 11 p.m. on a Thursday when Priya finally admitted she was overwhelmed.

Her team's product launch was 36 hours away, and her mind was a blur of unfinished tasks — write the release notes, coordinate the social-media post, verify the staging environment, brief the support team, and a dozen other things she kept forgetting the moment a new Slack message arrived.

A colleague had mentioned a simple Todo app earlier that week. Priya opened `index.html`, typed her first task — *"Write release notes"* — and pressed Enter. Something about seeing it captured in a neat little row made her breathe a little easier.

One by one she typed the rest. Within five minutes she had a clean list of fourteen items staring back at her.

She clicked the **Active** filter to hide everything else and focused. Task by task, checkbox by checkbox, the list shrank. Around midnight she accidentally closed the browser tab. Her stomach dropped — but when she reopened it the list was exactly as she'd left it, every item intact, thanks to localStorage.

By 2 a.m. she had knocked out eight tasks. She clicked **Clear Completed**, and the finished items disappeared, leaving only the six that still needed her attention. The shorter list felt like a reward.

Friday flew by. When the last task — *"Send launch announcement"* — got its checkbox ticked at 3:47 p.m., Priya leaned back in her chair and smiled. The launch shipped on time.

Sometimes the simplest tools make all the difference.

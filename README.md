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

## 📖 A Story: The Night Before the Deadline

Maya was a graphic design student with a bad habit of leaving everything to the last minute. With just eighteen hours before her portfolio presentation, she opened her laptop, pulled up the Todo App, and typed her first task: *"Find all project files."*

The list grew fast. Resize images. Export to PDF. Write the artist statement. Email the professor with questions. By the time she'd finished listing everything, the sheer volume was almost enough to send her back to bed.

But then she clicked the first checkbox.

Something about watching that task slide into the *Completed* column lit a small fire in her chest. She moved to the next one. Then the next. Around 2 a.m. she accidentally closed the browser tab — her heart sank — but when she reopened it, every single task was still there, faithfully waiting in localStorage. The app hadn't lost a thing.

By 7 a.m., the *Active* column held only one item: *"Sleep for one hour."*

She clicked "Clear Completed," watched the finished tasks vanish in a clean sweep, and smiled at the empty list. The presentation went beautifully. Maya still leaves things to the last minute — but now at least she has a system.

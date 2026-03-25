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

## 📖 A Story: The Todo That Changed Everything

Once upon a time, in a bustling digital city called Localhost, there lived a diligent little application named Todo. Every day, Todo woke up early and opened its input field, eager to help the citizens of Localhost keep their lives in order.

One morning, a harried developer named Alex rushed to Todo with a long list of tasks: *"Fix the login bug," "Write unit tests," "Deploy to production,"* and, most importantly, *"Get coffee."* Todo listened carefully, storing each task safely in the localStorage vault so nothing would ever be forgotten.

As the day wore on, Alex checked off task after task. With each completed item, a satisfying green checkmark appeared, and Todo glowed with pride. When Alex finally clicked *"Get coffee"* as done, a wave of calm washed over them both.

But the day was not without challenges. A mysterious visitor called **The Browser Refresh** appeared and threatened to wipe away all of Alex's hard work. Todo stood firm, reaching into the localStorage vault and restoring every single task — not one was lost.

By evening, Alex had cleared the entire list and clicked *"Clear Completed."* The screen was empty, peaceful, and ready for tomorrow's adventures.

*"Thank you, Todo,"* Alex whispered.

And Todo, ever faithful, simply cleared its input field and replied in its quiet way: **"What's next?"**

*The End.*

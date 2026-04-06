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

## 📖 A Story: The Launch That Almost Wasn't

It was 11:47 PM on a Thursday when Priya realized she had a problem.

In six hours, her startup's beta would go live. The investors had already tweeted about it. The press release was scheduled. And yet — sitting in the dim glow of her monitor — she had seventeen loose threads, and not a single one of them felt finished.

She opened the Todo app.

*"Write launch announcement,"* she typed. Enter.  
*"Test payment flow on mobile,"* she typed. Enter.  
*"Reply to journalist from TechPulse,"* she typed. Enter.

One by one, the tasks appeared in the list like little soldiers lining up for battle. By the time she was done adding them all, there were fourteen items staring back at her.

She took a breath. Clicked **Active**. The list narrowed. Only the things that mattered, right now, tonight.

She started at the top.

By 1:30 AM, five checkmarks glowed green. She stood to stretch, accidentally knocked her coffee mug, and — in a panic — closed the wrong browser tab. Her heart lurched. She reopened it.

Everything was still there. Every task. Every checkmark. *localStorage*, she thought, almost laughing. *Thank you.*

She switched the filter to **Completed** to count her victories. Five done. Nine to go.

By 4:15 AM, the list had one item left: *"Get some sleep."*

She clicked **Clear Completed**, watched the finished tasks vanish, and stared at that final line for a long moment. Then she checked it off too.

At 6:00 AM, the beta launched without a hitch. The first 300 users signed up before breakfast.

Priya made herself a cup of coffee, opened a new tab, and typed the first task of the day.

*"Do it all again tomorrow."*

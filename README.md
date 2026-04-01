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

## 📖 Story: The Bug That Became a Feature

It was 11:47 p.m. on a Thursday when Dani, a junior developer three months into her first job, stared at a blank screen and felt the familiar knot of dread tighten in her stomach.

Her team's sprint review was at 9 a.m. Friday. She had five tasks left — bug fixes, a refactor, and one feature she'd been quietly avoiding all week. She'd written them on a sticky note, but the sticky note was gone, probably buried under the avalanche of coffee cups and printouts on her desk.

She opened the Todo app on a whim. *Might as well*, she thought.

One by one, she typed them in:

- Fix null pointer in auth middleware
- Refactor `userService.js`
- Write unit tests for the cart module
- Update API docs for `/orders` endpoint
- Add loading spinner to checkout page

Five tasks. Nine hours. She stared at the list and took a slow breath.

She started with the null pointer — the one she'd been dreading most. At 12:30 a.m., she cracked it: a single missing check, two characters added. She clicked the checkbox. The item crossed itself out, satisfying as a door clicking shut.

At 2:15 a.m., her laptop battery died.

She grabbed her charger with a groan, plugged in, reopened the browser — and there was her list, exactly as she'd left it. The app had saved everything to localStorage. Two tasks checked off. Three to go.

She switched to the **Active** filter so the completed tasks disappeared from view. No distractions. Just the work in front of her.

By 6:00 a.m., the sun had started to grey the sky outside her window. All five checkboxes were filled. She clicked **Clear Completed**, and the list went clean and empty — like the end of something, or the beginning.

She made coffee. She showered. She showed up to the sprint review with five minutes to spare.

When her manager asked how she'd managed to close every ticket, Dani just smiled.

"Good tools," she said. "And good coffee."

---

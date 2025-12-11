# Quick Start Guide - Comprehensive Todo Application

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Server
```bash
npm start
```

### Step 3: Open the Application
Open `public/index.html` in your web browser.

**Alternative:** Use a static file server for better experience:
```bash
# In a new terminal (keep server running)
cd public
python3 -m http.server 8080
# Then open http://localhost:8080 in your browser
```

---

## 🎯 Quick Demo

Run our demo script to see the application in action:
```bash
# In a new terminal (keep server running)
./demo.sh
```

---

## ⌨️ Keyboard Shortcuts

- **Ctrl/Cmd + N** - Create new task
- **Ctrl/Cmd + K** - Focus search box

---

## 📋 Common Tasks

### Create Your First Task
1. Click the "**+ New Task**" button
2. Fill in:
   - **Title** (required)
   - **Description** (optional)
   - **Priority** (High/Medium/Low)
   - **Project** (optional)
3. Click "**Create Task**"

### Organize with Projects
1. Click "**+ New Project**" in the sidebar
2. Enter project name and choose a color/icon
3. Assign tasks to your project

### Mark Tasks Complete
- Simply check the ✓ checkbox next to any task
- Completed tasks are dimmed and crossed out

### Filter Your View
- **All Tasks** - See everything
- **Today** - Tasks due today
- **High Priority** - Urgent tasks only
- **By Status** - Not Started, In Progress, Completed
- **By Project** - Click any project in sidebar

### Search Tasks
- Use the search box at the top
- Press **Ctrl/Cmd + K** to quickly focus search
- Searches both titles and descriptions

---

## 🔧 API Testing

Test the API directly with curl:

```bash
# Get all tasks
curl http://localhost:3001/api/tasks

# Create a task
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task","priority":"high"}'

# Get dashboard stats
curl http://localhost:3001/api/dashboard/stats
```

---

## 📊 Features Overview

✅ **Task Management**
- Create, edit, delete tasks
- Mark complete/incomplete
- Trash with 30-day recovery

✅ **Rich Properties**
- Priority levels (High, Medium, Low)
- Status tracking (Not Started, In Progress, etc.)
- Tags and labels
- Due dates
- Assignees

✅ **Organization**
- Custom projects with colors and icons
- Smart filtering and search
- Project statistics

✅ **User Experience**
- Responsive design (works on mobile)
- Keyboard shortcuts
- Real-time updates
- Visual priority indicators

---

## 📖 More Information

- **Full README**: See `TODO_APP_README.md`
- **API Documentation**: See `API_DOCUMENTATION.md`
- **Server**: Running on http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

---

## 🐛 Troubleshooting

**Server won't start?**
- Make sure port 3001 is available
- Check Node.js is installed: `node --version`
- Try reinstalling dependencies: `npm install`

**Frontend not loading?**
- Make sure the server is running
- Check browser console for errors
- Try serving with a static server (see Step 3 above)

**Can't see tasks?**
- Check server is running: curl http://localhost:3001/api/health
- Open browser DevTools and check Network tab
- Ensure the frontend is connecting to http://localhost:3001

---

## 🎨 Customization Tips

**Change Default Port:**
```bash
PORT=8080 npm start
```

**Add Your Own Data:**
Edit `server.js` and modify the `initializeData()` function.

**Customize Colors:**
Edit the CSS in `public/index.html` to match your preferred color scheme.

---

## 🚦 Next Steps

1. ✅ Start the server and explore the UI
2. ✅ Create some tasks and projects
3. ✅ Try the different filters and search
4. ✅ Test the API with the demo script
5. ✅ Check out the keyboard shortcuts

**Want more?** See the full README for advanced features and deployment options!

---

**Happy Task Managing! 🎉**

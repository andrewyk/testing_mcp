# 📝 Todo App

A modern, feature-rich todo application built with vanilla HTML, CSS, and JavaScript. Keep track of your tasks with an elegant and intuitive interface.

![Todo App](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

- **Add Todos**: Create new tasks with a simple input field
- **Mark Complete**: Check off completed tasks with a single click
- **Delete Todos**: Remove tasks you no longer need
- **Filter Views**: Toggle between All, Active, and Completed todos
- **Persistent Storage**: Your todos are saved automatically using localStorage
- **Active Counter**: See how many tasks you have left to complete
- **Clear Completed**: Bulk remove all completed tasks
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, gradient-based design with smooth animations
- **Keyboard Shortcuts**: Press Enter to quickly add todos

## 🚀 Getting Started

### Installation

1. Clone or download this repository
2. No build process or dependencies required!

### Usage

Simply open `index.html` in your web browser:

```bash
# Option 1: Double-click the index.html file
# Option 2: Use a local server (recommended)
python -m http.server 8000
# Then visit http://localhost:8000
```

## 📖 How to Use

### Adding a Todo
1. Type your task in the input field
2. Press **Enter** or click the **Add** button
3. Your todo appears in the list below

### Completing a Todo
- Click the checkbox next to any todo to mark it as complete
- Completed todos will show with a strikethrough
- Click again to mark as incomplete

### Deleting a Todo
- Hover over a todo to reveal the delete button (🗑️)
- Click the delete button to remove the todo

### Filtering Todos
- Click **All** to see all todos
- Click **Active** to see only incomplete todos
- Click **Completed** to see only completed todos

### Clearing Completed Todos
- Click the **Clear completed** button to remove all completed todos at once

### Data Persistence
- All todos are automatically saved to your browser's localStorage
- Your todos will persist even after closing the browser
- Clear your browser data to reset the app

## 🎨 Design Features

- **Modern Gradient Background**: Eye-catching purple gradient
- **Smooth Animations**: Todos slide in when added
- **Hover Effects**: Interactive feedback on all clickable elements
- **Responsive Layout**: Adapts to any screen size
- **Custom Scrollbar**: Styled scrollbar for the todo list
- **Color-Coded States**: Visual distinction between active and completed

## 🛠️ Technical Details

### File Structure
```
todo-app/
├── index.html      # Main HTML structure
├── styles.css      # All styling and animations
├── app.js          # JavaScript functionality
└── README.md       # This file
```

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with flexbox, gradients, and animations
- **JavaScript ES6+**: Clean, modern JavaScript
- **LocalStorage API**: Client-side data persistence

## 🔧 Customization

### Changing Colors
Edit the gradient colors in `styles.css`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Modifying Storage
The app uses localStorage with the key `'todos'`. You can change this in `app.js`:
```javascript
localStorage.setItem('todos', JSON.stringify(todos));
```

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

For questions or feedback, please open an issue in the repository.

---

Made with ❤️ using vanilla JavaScript

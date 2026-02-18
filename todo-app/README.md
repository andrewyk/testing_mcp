# 📝 Todo App

A modern, responsive Todo application built with vanilla JavaScript, HTML, and CSS. This app allows you to manage your tasks efficiently with a clean and intuitive interface.

## ✨ Features

### Core Functionality
- ✅ **Add Todos**: Create new todo items with a simple input field
- ✏️ **Edit Todos**: Modify existing todo items inline
- 🗑️ **Delete Todos**: Remove todos you no longer need
- ✓ **Toggle Completion**: Mark todos as completed or active
- 💾 **Data Persistence**: All todos are automatically saved to localStorage
- 🔍 **Filter by Status**: View All, Active, or Completed todos
- 🧹 **Clear Completed**: Remove all completed todos at once
- 📊 **Item Counter**: See how many active items remain

### User Experience
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI**: Clean, intuitive interface with smooth animations
- ♿ **Accessibility**: ARIA labels for screen readers
- 🔒 **XSS Protection**: HTML content is escaped to prevent security vulnerabilities

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools or dependencies required!

### Installation

1. Clone the repository or download the files
2. Navigate to the `todo-app` directory
3. Open `index.html` in your web browser

That's it! No installation or build process required.

### Running the Application

Simply open `index.html` in any modern web browser:

```bash
# On macOS
open todo-app/index.html

# On Linux
xdg-open todo-app/index.html

# On Windows
start todo-app/index.html
```

Or you can double-click the `index.html` file to open it in your default browser.

## 📖 Usage

### Adding a Todo
1. Type your task in the input field at the top
2. Click the "Add" button or press Enter
3. Your todo appears in the list below

### Editing a Todo
1. Click the "Edit" button on any todo item
2. The text becomes editable
3. Make your changes
4. Click "Save" or press Enter to confirm
5. Click "Cancel" to discard changes

### Completing a Todo
- Click the checkbox next to any todo to mark it as complete
- Completed todos appear with strikethrough text
- Click again to mark as active

### Filtering Todos
Use the filter buttons to view:
- **All**: Show all todos
- **Active**: Show only incomplete todos
- **Completed**: Show only completed todos

### Deleting Todos
- Click the "Delete" button on any todo to remove it
- Use "Clear completed" to remove all completed todos at once

## 🧪 Testing

The application includes comprehensive unit tests covering all core functionality.

### Running Tests

1. Open `test.html` in your web browser
2. The tests will run automatically
3. View the results displayed on the page

### Test Coverage

The test suite includes tests for:
- ✓ Initialization
- ✓ Adding todos
- ✓ Deleting todos
- ✓ Toggling completion status
- ✓ Editing todos
- ✓ Filtering (all, active, completed)
- ✓ Clearing completed todos
- ✓ localStorage persistence
- ✓ HTML escaping (XSS protection)
- ✓ Input validation

## 📁 Project Structure

```
todo-app/
├── index.html      # Main HTML file
├── styles.css      # CSS styles
├── app.js          # JavaScript application logic
├── test.html       # Test runner HTML
├── tests.js        # Unit tests
└── README.md       # This file
```

## 🛠️ Technical Details

### Architecture
- **Pattern**: Object-oriented JavaScript with a TodoApp class
- **Storage**: localStorage for data persistence
- **Rendering**: Dynamic DOM manipulation
- **Styling**: CSS3 with flexbox and gradients

### Browser Compatibility
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

### Data Structure

Each todo item is stored as an object:
```javascript
{
    id: 1234567890,           // Unix timestamp
    text: "Buy groceries",    // Todo description
    completed: false,         // Completion status
    createdAt: "2026-02-18T..." // ISO timestamp
}
```

## 🔒 Security

- All user input is escaped to prevent XSS attacks
- No external dependencies that could introduce vulnerabilities
- Data is stored locally in the browser (no server transmission)

## 📱 Responsive Design

The app is fully responsive with breakpoints for mobile devices:
- Desktop: Full-width layout with side-by-side buttons
- Mobile: Stacked layout with full-width buttons
- Optimized touch targets for mobile interaction

## 🎨 Customization

You can easily customize the appearance by modifying `styles.css`:
- Change the color scheme in the gradient backgrounds
- Adjust spacing and sizing
- Modify font families and sizes

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Inspired by the classic TodoMVC project
- Built with modern web standards
- Designed for simplicity and usability

---

Made with ❤️ using vanilla JavaScript

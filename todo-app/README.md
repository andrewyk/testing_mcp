# Todo App

A simple, well-structured todo application built with vanilla JavaScript. This project serves as a reference implementation for coding standards, architecture patterns, and best practices.

## Features

- ✅ Add new todo items
- ✅ Mark todos as complete/incomplete
- ✅ Delete individual todos
- ✅ Filter todos (All, Active, Completed)
- ✅ Clear all completed todos
- ✅ Persistent storage (localStorage)
- ✅ Responsive design
- ✅ Keyboard shortcuts
- ✅ Accessible UI

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies required - it's vanilla JavaScript!

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start adding todos!

### Local Development

For development with live reload, you can use any local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (if you have npx)
npx serve .

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000`

## Project Structure

```
todo-app/
├── index.html              # Main HTML file
├── app.js                  # Application logic
├── styles.css              # Styling
├── README.md              # This file
├── CODING_STANDARDS.md    # Coding guidelines
├── ARCHITECTURE.md        # Architecture documentation
├── NAMING_CONVENTIONS.md  # Naming rules
└── BEST_PRACTICES.md      # Development best practices
```

## Key Learning Points

This todo app demonstrates several important concepts:

### Code Organization
- Clear separation of concerns
- Logical function grouping
- Consistent naming conventions
- Proper error handling

### JavaScript Best Practices
- Modern ES6+ features
- Event delegation
- DOM manipulation patterns
- State management
- Local storage integration

### CSS Best Practices
- Mobile-first responsive design
- Flexbox layout
- CSS custom properties (variables)
- Accessible color contrasts
- Smooth transitions

## Architecture Highlights

### State Management
```javascript
// Centralized state
let todos = [];
let currentFilter = 'all';

// Immutable state updates
function addTodo(text) {
    const newTodo = createTodoObject(text);
    todos = [...todos, newTodo];
    saveTodos();
    renderTodos();
}
```

### Event Handling
```javascript
// Descriptive event handlers
function handleAddButtonClick(event) {
    // Clear business logic
}

function handleTodoInputKeyPress(event) {
    if (event.key === 'Enter') {
        handleAddButtonClick(event);
    }
}
```

### Error Handling
```javascript
function loadTodos() {
    try {
        const stored = localStorage.getItem('todos');
        if (stored) {
            todos = JSON.parse(stored);
        }
    } catch (error) {
        console.error('Error loading todos:', error);
        todos = []; // Fallback to empty array
    }
}
```

## Code Quality Features

### Variable Naming
- **Descriptive**: `todoInput` instead of `input`
- **Meaningful**: `isCompleted` instead of `flag`
- **Consistent**: `camelCase` for variables, `kebab-case` for CSS

### Function Design
- **Single Responsibility**: Each function has one clear purpose
- **Descriptive Names**: `renderTodos()` clearly indicates what it does
- **Pure Functions**: No side effects where possible
- **Error Boundaries**: Proper error handling and validation

### Documentation
- **JSDoc Comments**: Comprehensive function documentation
- **Inline Comments**: Explaining complex logic only
- **Architecture Docs**: High-level design explanations

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing

This project serves as a reference implementation. When making changes:

1. Follow the coding standards in `CODING_STANDARDS.md`
2. Maintain the architecture patterns described in `ARCHITECTURE.md`
3. Update documentation for any new features
4. Test across different browsers
5. Ensure accessibility standards are maintained

## Learning Resources

### For Understanding This Codebase
- [CODING_STANDARDS.md](./CODING_STANDARDS.md) - Detailed coding guidelines
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture and design patterns
- [NAMING_CONVENTIONS.md](./NAMING_CONVENTIONS.md) - Naming rules and examples
- [BEST_PRACTICES.md](./BEST_PRACTICES.md) - Development best practices

### External Learning
- [MDN Web Docs](https://developer.mozilla.org/) - JavaScript and Web APIs
- [JavaScript.info](https://javascript.info/) - Modern JavaScript tutorial
- [Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882) - Robert C. Martin

## Memory Points for AI Agents

This project contains several important patterns and practices that should be remembered:

### Code Structure Memory Points
1. **Meaningful Variable Names**: Use descriptive names like `todoInput` instead of `inp`
2. **Function Organization**: Group related functions, separate concerns clearly
3. **Error Handling**: Always handle potential errors, especially with external dependencies
4. **State Management**: Use immutable updates, centralized state
5. **Documentation**: JSDoc for functions, inline comments for complex logic only

### Architecture Memory Points
1. **Separation of Concerns**: UI, business logic, and data storage are separated
2. **Event-Driven**: Use event handlers with descriptive names
3. **Modularity**: Code is organized into logical modules
4. **Consistency**: Naming conventions are consistent throughout
5. **Accessibility**: UI is keyboard navigable and screen reader friendly

### Best Practices Memory Points
1. **DRY Principle**: Don't repeat code, create reusable functions
2. **Single Responsibility**: Each function does one thing well
3. **Validation**: Validate input before processing
4. **Graceful Degradation**: Handle errors without breaking the app
5. **Performance**: Cache DOM elements, use efficient selectors

## License

This project is open source and available under the [MIT License](LICENSE).

---

*This todo app serves as a reference implementation for clean, maintainable JavaScript code. Use it as a learning tool and reference for building well-structured web applications.*
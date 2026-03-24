// Todo App - Vanilla JavaScript

const STORAGE_KEY = 'todos';
const THEME_KEY = 'todo-theme';
const PRIORITY_LEVELS = ['high', 'medium', 'low'];

// State management
let todos = [];
let currentFilter = 'all';

// DOM elements
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const prioritySelect = document.getElementById('priority-select');
const todoList = document.getElementById('todo-list');
const todoCount = document.getElementById('todo-count');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed');
const themeToggle = document.getElementById('theme-toggle');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    loadTheme();
    renderTodos();
    updateCount();
});

// Event listeners
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        currentFilter = e.target.dataset.filter;
        updateFilterButtons();
        renderTodos();
    });
});

clearCompletedBtn.addEventListener('click', clearCompleted);
themeToggle.addEventListener('click', toggleTheme);

/**
 * Add a new todo item
 */
function addTodo() {
    const text = todoInput.value.trim();

    if (text === '') {
        return;
    }

    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        priority: prioritySelect.value,
        createdAt: new Date().toISOString(),
        completedAt: null
    };

    todos.push(todo);
    todoInput.value = '';

    saveTodos();
    renderTodos();
    updateCount();
}

/**
 * Toggle todo completion status
 */
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        todo.completedAt = todo.completed ? new Date().toISOString() : null;
        saveTodos();
        renderTodos();
        updateCount();
    }
}

/**
 * Delete a todo item
 */
function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    renderTodos();
    updateCount();
}

/**
 * Clear all completed todos
 */
function clearCompleted() {
    todos = todos.filter(t => !t.completed);
    saveTodos();
    renderTodos();
    updateCount();
}

/**
 * Render todos based on current filter
 */
function renderTodos() {
    todoList.innerHTML = '';

    const filteredTodos = getFilteredTodos();

    filteredTodos.forEach(todo => {
        const li = createTodoElement(todo);
        todoList.appendChild(li);
    });
}

/**
 * Create a todo DOM element
 */
function createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.dataset.priority = todo.priority;

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => toggleTodo(todo.id));

    // Content wrapper
    const content = document.createElement('div');
    content.className = 'todo-content';

    // Text
    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;

    // Meta (priority + date)
    const meta = document.createElement('div');
    meta.className = 'todo-meta';

    const badge = document.createElement('span');
    badge.className = `priority-badge ${todo.priority}`;
    badge.textContent = todo.priority;

    const dateSpan = document.createElement('span');
    dateSpan.className = 'todo-date';
    if (todo.completed && todo.completedAt) {
        dateSpan.textContent = `Completed ${formatDate(todo.completedAt)}`;
    } else {
        dateSpan.textContent = `Added ${formatDate(todo.createdAt)}`;
    }

    meta.appendChild(badge);
    meta.appendChild(dateSpan);
    content.appendChild(text);
    content.appendChild(meta);

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

    li.appendChild(checkbox);
    li.appendChild(content);
    li.appendChild(deleteBtn);

    return li;
}

/**
 * Format an ISO date string to a human-readable relative date
 */
function formatDate(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
}

/**
 * Get filtered todos based on current filter
 */
function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter(t => !t.completed);
        case 'completed':
            return todos.filter(t => t.completed);
        case 'high':
        case 'medium':
        case 'low':
            return todos.filter(t => t.priority === currentFilter);
        default:
            return todos;
    }
}

/**
 * Update filter button states
 */
function updateFilterButtons() {
    filterBtns.forEach(btn => {
        if (btn.dataset.filter === currentFilter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

/**
 * Update the count of active todos
 */
function updateCount() {
    const activeCount = todos.filter(t => !t.completed).length;
    todoCount.textContent = `${activeCount} ${activeCount === 1 ? 'item' : 'items'} left`;
}

/**
 * Save todos to localStorage
 */
function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

/**
 * Load todos from localStorage with backward-compat defaults
 */
function loadTodos() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            todos = parsed.map(todo => ({
                id: todo.id,
                text: todo.text,
                completed: todo.completed ?? false,
                priority: PRIORITY_LEVELS.includes(todo.priority) ? todo.priority : 'medium',
                createdAt: todo.createdAt ?? new Date().toISOString(),
                completedAt: todo.completedAt ?? (todo.completed ? new Date().toISOString() : null)
            }));
        } catch (e) {
            console.error('Error loading todos:', e);
            todos = [];
        }
    }
}

/**
 * Toggle between light and dark theme
 */
function toggleTheme() {
    const body = document.body;
    const isDark = body.dataset.theme === 'dark';
    body.dataset.theme = isDark ? 'light' : 'dark';
    themeToggle.textContent = isDark ? '🌙' : '☀️';
    localStorage.setItem(THEME_KEY, body.dataset.theme);
}

/**
 * Load saved theme from localStorage
 */
function loadTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
    document.body.dataset.theme = savedTheme;
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

// Enhanced Todo App - Advanced Features

// State management
let todos = [];
let currentFilter = 'all';
let currentSort = 'newest';
let searchTerm = '';

// DOM elements
const todoInput = document.getElementById('todo-input');
const searchInput = document.getElementById('search-input');
const searchClear = document.getElementById('search-clear');
const prioritySelect = document.getElementById('priority-select');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const todoCount = document.getElementById('todo-count');
const filterBtns = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sort-select');
const clearCompletedBtn = document.getElementById('clear-completed');
const themeToggle = document.getElementById('theme-toggle');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const progressPercentage = document.getElementById('progress-percentage');
const totalTasksEl = document.getElementById('total-tasks');
const completedTasksEl = document.getElementById('completed-tasks');
const productivityScore = document.getElementById('productivity-score');
const selectAllBtn = document.getElementById('select-all');
const exportBtn = document.getElementById('export-data');
const shortcutsHelp = document.getElementById('shortcuts-help');
const settingsBtn = document.getElementById('settings-btn');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    loadTheme();
    renderTodos();
    updateAllStats();
    initializeEventListeners();
    initializeKeyboardShortcuts();
    showWelcomeMessage();
});

// Enhanced Event Listeners
function initializeEventListeners() {
    // Input events
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });
    
    // Search functionality
    searchInput.addEventListener('input', handleSearch);
    searchClear.addEventListener('click', clearSearch);
    
    // Filter and sort
    filterBtns.forEach(btn => {
        btn.addEventListener('click', handleFilter);
    });
    
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderTodos();
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Footer actions
    clearCompletedBtn.addEventListener('click', clearCompleted);
    selectAllBtn.addEventListener('click', selectAllTodos);
    exportBtn.addEventListener('click', exportData);
    
    // Settings
    settingsBtn.addEventListener('click', toggleShortcutsHelp);
}

// Keyboard shortcuts
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'Enter':
                    e.preventDefault();
                    addTodo();
                    break;
                case '/':
                    e.preventDefault();
                    searchInput.focus();
                    break;
                case 'd':
                    e.preventDefault();
                    toggleTheme();
                    break;
                case 'a':
                    e.preventDefault();
                    selectAllTodos();
                    break;
            }
        }
        
        if (e.key === 'Escape') {
            clearSearch();
            searchInput.blur();
        }
    });
}

/**
 * Add a new todo item with enhanced features
 */
function addTodo() {
    const text = todoInput.value.trim();
    const priority = prioritySelect.value;
    
    if (text === '') {
        shakeInput();
        showToast('Please enter a task!', 'error');
        return;
    }

    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        priority: priority,
        createdAt: new Date().toISOString(),
        completedAt: null
    };

    todos.push(todo);
    todoInput.value = '';
    
    // Button feedback animation
    addBtn.style.transform = 'scale(0.95)';
    setTimeout(() => addBtn.style.transform = '', 150);
    
    saveTodos();
    renderTodos();
    updateAllStats();
    showToast('Task added successfully! 🎉', 'success');
}

/**
 * Toggle todo completion with celebration
 */
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        todo.completedAt = todo.completed ? new Date().toISOString() : null;
        
        if (todo.completed) {
            createConfetti();
            showToast('Great job! Task completed! ✨', 'success');
        }
        
        saveTodos();
        renderTodos();
        updateAllStats();
    }
}

/**
 * Delete a todo item with animation
 */
function deleteTodoWithAnimation(id, element) {
    element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    element.style.opacity = '0';
    element.style.transform = 'translateX(100px)';
    
    setTimeout(() => {
        deleteTodo(id);
        showToast('Task deleted', 'info');
    }, 300);
}

/**
 * Delete a todo item
 */
function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    renderTodos();
    updateAllStats();
}

/**
 * Clear all completed todos
 */
function clearCompleted() {
    const completedCount = todos.filter(t => t.completed).length;
    if (completedCount === 0) {
        showToast('No completed tasks to clear', 'info');
        return;
    }
    
    todos = todos.filter(t => !t.completed);
    saveTodos();
    renderTodos();
    updateAllStats();
    showToast(`Cleared ${completedCount} completed tasks`, 'success');
}

/**
 * Handle search functionality
 */
function handleSearch(e) {
    searchTerm = e.target.value.toLowerCase();
    renderTodos();
}

/**
 * Clear search
 */
function clearSearch() {
    searchInput.value = '';
    searchTerm = '';
    renderTodos();
}

/**
 * Handle filter changes
 */
function handleFilter(e) {
    currentFilter = e.target.dataset.filter;
    updateFilterButtons();
    renderTodos();
}

/**
 * Select all todos
 */
function selectAllTodos() {
    const allCompleted = todos.every(t => t.completed);
    todos.forEach(t => {
        t.completed = !allCompleted;
        t.completedAt = t.completed ? new Date().toISOString() : null;
    });
    
    if (!allCompleted) {
        createConfetti();
        showToast('All tasks completed! Amazing! 🎊', 'success');
    }
    
    saveTodos();
    renderTodos();
    updateAllStats();
}

/**
 * Export data as JSON
 */
function exportData() {
    const dataStr = JSON.stringify(todos, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `todos_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showToast('Data exported successfully! 📤', 'success');
}

/**
 * Toggle theme
 */
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update theme toggle icon
    const themeIcon = themeToggle.querySelector('.theme-icon');
    themeIcon.textContent = newTheme === 'light' ? '🌙' : '☀️';
    
    showToast(`Switched to ${newTheme} mode`, 'info');
}

/**
 * Load theme from localStorage
 */
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    
    const themeIcon = themeToggle.querySelector('.theme-icon');
    themeIcon.textContent = savedTheme === 'light' ? '🌙' : '☀️';
}

/**
 * Toggle shortcuts help
 */
function toggleShortcutsHelp() {
    shortcutsHelp.classList.toggle('show');
    setTimeout(() => {
        if (shortcutsHelp.classList.contains('show')) {
            shortcutsHelp.classList.remove('show');
        }
    }, 5000);
}

/**
 * Render todos with enhanced filtering and sorting
 */
function renderTodos() {
    todoList.innerHTML = '';
    
    let filteredTodos = getFilteredTodos();
    filteredTodos = getSortedTodos(filteredTodos);
    filteredTodos = getSearchedTodos(filteredTodos);
    
    filteredTodos.forEach(todo => {
        const li = createTodoElement(todo);
        todoList.appendChild(li);
    });
    
    updateCount();
}

/**
 * Create enhanced todo DOM element
 */
function createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = `todo-item priority-${todo.priority} ${todo.completed ? 'completed' : ''}`;
    li.style.opacity = '0';
    li.style.transform = 'translateY(30px)';
    
    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => toggleTodo(todo.id));
    
    // Priority badge
    const priorityBadge = document.createElement('span');
    priorityBadge.className = `priority-badge priority-${todo.priority}`;
    priorityBadge.textContent = todo.priority;
    
    // Text
    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;
    
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '🗑️ Delete';
    deleteBtn.addEventListener('click', () => deleteTodoWithAnimation(todo.id, li));
    
    li.appendChild(checkbox);
    li.appendChild(priorityBadge);
    li.appendChild(text);
    li.appendChild(deleteBtn);
    
    // Animate in
    requestAnimationFrame(() => {
        li.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        li.style.opacity = '1';
        li.style.transform = 'translateY(0)';
    });
    
    return li;
}

/**
 * Get filtered todos
 */
function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter(t => !t.completed);
        case 'completed':
            return todos.filter(t => t.completed);
        case 'high':
            return todos.filter(t => t.priority === 'high');
        default:
            return todos;
    }
}

/**
 * Get sorted todos
 */
function getSortedTodos(filteredTodos) {
    const sorted = [...filteredTodos];
    
    switch (currentSort) {
        case 'oldest':
            return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        case 'priority':
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return sorted.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        case 'alphabetical':
            return sorted.sort((a, b) => a.text.localeCompare(b.text));
        default: // newest
            return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
}

/**
 * Get searched todos
 */
function getSearchedTodos(filteredTodos) {
    if (!searchTerm) return filteredTodos;
    return filteredTodos.filter(todo => 
        todo.text.toLowerCase().includes(searchTerm)
    );
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
 * Update all statistics and counters
 */
function updateAllStats() {
    updateCount();
    updateProgress();
    updateStatCards();
}

/**
 * Update the count of active todos
 */
function updateCount() {
    const activeCount = todos.filter(t => !t.completed).length;
    todoCount.textContent = `${activeCount} ${activeCount === 1 ? 'item' : 'items'} left`;
}

/**
 * Update progress bar
 */
function updateProgress() {
    const totalTodos = todos.length;
    const completedTodos = todos.filter(t => t.completed).length;
    const progressPercent = totalTodos === 0 ? 0 : (completedTodos / totalTodos) * 100;
    
    progressFill.style.width = `${progressPercent}%`;
    progressText.textContent = `${completedTodos} of ${totalTodos} completed`;
    progressPercentage.textContent = `${Math.round(progressPercent)}%`;
}

/**
 * Update statistics cards
 */
function updateStatCards() {
    const totalTodos = todos.length;
    const completedTodos = todos.filter(t => t.completed).length;
    const productivity = totalTodos === 0 ? 0 : Math.round((completedTodos / totalTodos) * 100);
    
    totalTasksEl.textContent = totalTodos;
    completedTasksEl.textContent = completedTodos;
    productivityScore.textContent = `${productivity}%`;
}

/**
 * Create confetti animation
 */
function createConfetti() {
    const container = document.getElementById('confetti-container');
    const colors = ['#667eea', '#764ba2', '#f093fb', '#48bb78', '#ed8936', '#fc8181'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        
        container.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    
    // Remove toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

/**
 * Shake input animation
 */
function shakeInput() {
    todoInput.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        todoInput.style.animation = '';
    }, 500);
}

/**
 * Show welcome message
 */
function showWelcomeMessage() {
    if (todos.length === 0) {
        setTimeout(() => {
            showToast('Welcome to your Advanced Todo App! 🚀', 'success');
        }, 1000);
    }
}

/**
 * Save todos to localStorage
 */
function saveTodos() {
    try {
        localStorage.setItem('todos', JSON.stringify(todos));
    } catch (e) {
        console.error('Error saving todos:', e);
        showToast('Error saving data', 'error');
    }
}

/**
 * Load todos from localStorage
 */
function loadTodos() {
    try {
        const stored = localStorage.getItem('todos');
        if (stored) {
            todos = JSON.parse(stored);
            // Ensure backward compatibility
            todos.forEach(todo => {
                if (!todo.priority) todo.priority = 'medium';
                if (!todo.createdAt) todo.createdAt = new Date().toISOString();
                if (!todo.hasOwnProperty('completed')) todo.completed = false;
            });
        }
    } catch (e) {
        console.error('Error loading todos:', e);
        todos = [];
        showToast('Error loading saved data', 'error');
    }
}

// Performance optimization - debounce search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to search
const debouncedSearch = debounce(handleSearch, 300);
searchInput.addEventListener('input', debouncedSearch);
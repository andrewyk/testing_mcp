// Todo App - Main JavaScript File

// State management
let todos = [];
let currentFilter = 'all';

// DOM Elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const filterBtns = document.querySelectorAll('.filter-btn');
const activeCount = document.getElementById('activeCount');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadTodosFromStorage();
    renderTodos();
    updateActiveCount();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Add todo on button click
    addBtn.addEventListener('click', addTodo);
    
    // Add todo on Enter key press
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.dataset.filter;
            
            // Update active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            renderTodos();
        });
    });
    
    // Clear completed todos
    clearCompletedBtn.addEventListener('click', clearCompleted);
}

// Add new todo
function addTodo() {
    const text = todoInput.value.trim();
    
    if (text === '') {
        return;
    }
    
    const todo = {
        id: Date.now() + Math.random(), // Prevent collisions with random component
        text: text,
        completed: false
    };
    
    todos.push(todo);
    todoInput.value = '';
    
    saveTodosToStorage();
    renderTodos();
    updateActiveCount();
}

// Toggle todo completion status
function toggleTodo(id) {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    
    saveTodosToStorage();
    renderTodos();
    updateActiveCount();
}

// Delete todo
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    
    saveTodosToStorage();
    renderTodos();
    updateActiveCount();
}

// Clear completed todos
function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    
    saveTodosToStorage();
    renderTodos();
    updateActiveCount();
}

// Render todos based on current filter
function renderTodos() {
    // Filter todos based on current filter
    let filteredTodos = todos;
    
    if (currentFilter === 'active') {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }
    
    // Clear the list
    todoList.innerHTML = '';
    
    // Render filtered todos
    filteredTodos.forEach(todo => {
        const li = createTodoElement(todo);
        todoList.appendChild(li);
    });
}

// Create todo element
function createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.dataset.id = todo.id;
    
    // Create checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => toggleTodo(todo.id));
    
    // Create todo text
    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = todo.text;
    
    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
    
    // Append elements
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    
    return li;
}

// Update active todo count
function updateActiveCount() {
    const activeCount = todos.filter(todo => !todo.completed).length;
    const countElement = document.getElementById('activeCount');
    countElement.textContent = `${activeCount} ${activeCount === 1 ? 'item' : 'items'} left`;
}

// Save todos to localStorage
function saveTodosToStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Load todos from localStorage
function loadTodosFromStorage() {
    const stored = localStorage.getItem('todos');
    if (stored) {
        try {
            todos = JSON.parse(stored);
        } catch (e) {
            console.error('Error parsing todos from storage:', e);
            todos = [];
        }
    }
}

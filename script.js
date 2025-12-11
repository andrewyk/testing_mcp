// Todo App JavaScript

// DOM Elements
const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Add task on button click
addButton.addEventListener('click', addTask);

// Add task on Enter key press
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Function to add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    // Create task object
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    
    // Add to DOM
    createTaskElement(task);
    
    // Save to localStorage
    saveTask(task);
    
    // Clear input
    taskInput.value = '';
    taskInput.focus();
}

// Function to create a task element in the DOM
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'task-item';
    if (task.completed) {
        li.classList.add('completed');
    }
    li.dataset.id = task.id;
    
    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(task.id));
    
    // Task text
    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;
    
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-button';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    
    // Append elements
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

// Function to toggle task completion
function toggleTask(taskId) {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasks(tasks);
        
        // Update UI
        const taskElement = document.querySelector(`[data-id="${taskId}"]`);
        if (tasks[taskIndex].completed) {
            taskElement.classList.add('completed');
        } else {
            taskElement.classList.remove('completed');
        }
    }
}

// Function to delete a task
function deleteTask(taskId) {
    const tasks = getTasks();
    const filteredTasks = tasks.filter(t => t.id !== taskId);
    saveTasks(filteredTasks);
    
    // Remove from DOM
    const taskElement = document.querySelector(`[data-id="${taskId}"]`);
    if (taskElement) {
        taskElement.remove();
    }
}

// Function to save a single task to localStorage
function saveTask(task) {
    const tasks = getTasks();
    tasks.push(task);
    saveTasks(tasks);
}

// Function to save all tasks to localStorage
function saveTasks(tasks) {
    localStorage.setItem('todos', JSON.stringify(tasks));
}

// Function to get tasks from localStorage
function getTasks() {
    const tasks = localStorage.getItem('todos');
    return tasks ? JSON.parse(tasks) : [];
}

// Function to load tasks from localStorage
function loadTasks() {
    const tasks = getTasks();
    tasks.forEach(task => createTaskElement(task));
}

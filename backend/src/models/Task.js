// In-memory data storage (will be replaced with database in production)
const tasks = [];
let taskIdCounter = 1;

class Task {
  constructor({
    title,
    description = '',
    priority = 'medium',
    dueDate = null,
    category = null,
    tags = [],
    status = 'not_started',
    assignee = null,
    estimatedTime = null,
    actualTime = null,
    subtasks = [],
    recurrence = null,
    userId
  }) {
    this.id = taskIdCounter++;
    this.title = title;
    this.description = description;
    this.priority = priority; // 'high', 'medium', 'low', 'none'
    this.dueDate = dueDate;
    this.category = category;
    this.tags = tags;
    this.status = status; // 'not_started', 'in_progress', 'waiting', 'blocked', 'completed'
    this.assignee = assignee;
    this.estimatedTime = estimatedTime;
    this.actualTime = actualTime;
    this.subtasks = subtasks;
    this.recurrence = recurrence;
    this.completed = false;
    this.userId = userId;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.attachments = [];
    this.comments = [];
  }

  static create(taskData) {
    const task = new Task(taskData);
    tasks.push(task);
    return task;
  }

  static findAll(userId) {
    return tasks.filter(task => task.userId === userId);
  }

  static findById(id, userId) {
    return tasks.find(task => task.id === parseInt(id) && task.userId === userId);
  }

  static update(id, userId, updates) {
    const taskIndex = tasks.findIndex(task => task.id === parseInt(id) && task.userId === userId);
    if (taskIndex === -1) return null;
    
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updates,
      id: tasks[taskIndex].id,
      createdAt: tasks[taskIndex].createdAt,
      updatedAt: new Date()
    };
    return tasks[taskIndex];
  }

  static delete(id, userId) {
    const taskIndex = tasks.findIndex(task => task.id === parseInt(id) && task.userId === userId);
    if (taskIndex === -1) return false;
    
    tasks.splice(taskIndex, 1);
    return true;
  }

  static filterByStatus(userId, status) {
    return tasks.filter(task => task.userId === userId && task.status === status);
  }

  static filterByPriority(userId, priority) {
    return tasks.filter(task => task.userId === userId && task.priority === priority);
  }

  static filterByDueDate(userId, startDate, endDate) {
    return tasks.filter(task => {
      if (!task.dueDate || task.userId !== userId) return false;
      const due = new Date(task.dueDate);
      return due >= startDate && due <= endDate;
    });
  }

  static search(userId, query) {
    const searchTerm = query.toLowerCase();
    return tasks.filter(task => 
      task.userId === userId && (
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm)
      )
    );
  }
}

export default Task;

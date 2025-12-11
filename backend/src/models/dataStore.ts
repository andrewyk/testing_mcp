import { User, Task, Project, Tag } from '../types';

// In-memory data store (for MVP - replace with database in production)
class DataStore {
  private users: Map<string, User> = new Map();
  private tasks: Map<string, Task> = new Map();
  private projects: Map<string, Project> = new Map();
  private tags: Map<string, Tag> = new Map();

  // User methods
  createUser(user: User): User {
    this.users.set(user.id, user);
    return user;
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  // Task methods
  createTask(task: Task): Task {
    this.tasks.set(task.id, task);
    return task;
  }

  getTaskById(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  updateTask(id: string, updates: Partial<Task>): Task | undefined {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...updates, updatedAt: new Date() };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  deleteTask(id: string): boolean {
    return this.tasks.delete(id);
  }

  getTasksByUser(userId: string): Task[] {
    return Array.from(this.tasks.values()).filter(
      t => t.createdById === userId || t.assigneeId === userId
    );
  }

  getTasksByProject(projectId: string): Task[] {
    return Array.from(this.tasks.values()).filter(
      t => t.projectId === projectId
    );
  }

  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  // Project methods
  createProject(project: Project): Project {
    this.projects.set(project.id, project);
    return project;
  }

  getProjectById(id: string): Project | undefined {
    return this.projects.get(id);
  }

  updateProject(id: string, updates: Partial<Project>): Project | undefined {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject = { ...project, ...updates, updatedAt: new Date() };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  deleteProject(id: string): boolean {
    return this.projects.delete(id);
  }

  getProjectsByOwner(ownerId: string): Project[] {
    return Array.from(this.projects.values()).filter(
      p => p.ownerId === ownerId
    );
  }

  getAllProjects(): Project[] {
    return Array.from(this.projects.values());
  }

  // Tag methods
  createTag(tag: Tag): Tag {
    this.tags.set(tag.id, tag);
    return tag;
  }

  getTagById(id: string): Tag | undefined {
    return this.tags.get(id);
  }

  getTagsByUser(userId: string): Tag[] {
    return Array.from(this.tags.values()).filter(
      t => t.userId === userId
    );
  }

  deleteTag(id: string): boolean {
    return this.tags.delete(id);
  }
}

// Singleton instance
export const dataStore = new DataStore();

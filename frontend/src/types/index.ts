export interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
  avatar?: string;
  timezone?: string;
}

export type Priority = 'high' | 'medium' | 'low' | 'none';
export type Status = 'not_started' | 'in_progress' | 'waiting' | 'blocked' | 'completed';

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  isArchived: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string;
  status: Status;
  isCompleted: boolean;
  completedAt?: string;
  estimatedTime?: number;
  actualTime?: number;
  recurrence?: string;
  project?: Project;
  assignee?: User;
  tags?: Tag[];
  subtasks?: Array<{ id: string; title: string; isCompleted: boolean }>;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
  status?: Status;
  projectId?: string;
  assigneeId?: string;
  tags?: string[];
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
  status?: Status;
  isCompleted?: boolean;
  projectId?: string;
  assigneeId?: string;
  tags?: string[];
}

export type Priority = 'none' | 'low' | 'medium' | 'high';
export type TaskStatus = 'not_started' | 'in_progress' | 'waiting' | 'blocked' | 'completed';

export interface User {
  id: number;
  email: string;
  username: string;
  avatar_url?: string;
  created_at: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  user_id: number;
  parent_id?: number;
  archived: boolean;
  task_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
  user_id: number;
  usage_count?: number;
  created_at: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  due_date?: string;
  completed_at?: string;
  estimated_time?: number;
  actual_time?: number;
  project_id?: number;
  project_name?: string;
  user_id: number;
  assigned_to?: number;
  assigned_to_username?: string;
  parent_task_id?: number;
  is_recurring: boolean;
  recurrence_pattern?: any;
  position: number;
  tags?: Tag[];
  created_at: string;
  updated_at: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: Priority;
  status?: TaskStatus;
  due_date?: string;
  estimated_time?: number;
  project_id?: number;
  assigned_to?: number;
  parent_task_id?: number;
  tags?: number[];
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  actual_time?: number;
  completed_at?: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  parent_id?: number;
}

export interface CreateTagInput {
  name: string;
  color?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  username: string;
}

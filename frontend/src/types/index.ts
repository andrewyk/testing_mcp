export interface User {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  avatarUrl?: string
  timezone: string
  locale: string
  emailVerified: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  title: string
  description?: string
  projectId?: string
  parentTaskId?: string
  assigneeId?: string
  creatorId: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string
  startDate?: string
  completedAt?: string
  estimatedTime?: number
  actualTime?: number
  position: number
  isRecurring: boolean
  recurrenceRule?: RecurrenceRule
  reminderSettings?: ReminderSettings
  customFields?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface RecurrenceRule {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
  interval: number
  endDate?: string
  count?: number
}

export interface ReminderSettings {
  enabled: boolean
  reminders: Array<{
    time: number // minutes before due date
    channel: 'EMAIL' | 'PUSH' | 'IN_APP'
  }>
}

export interface Project {
  id: string
  name: string
  description?: string
  color: string
  icon?: string
  ownerId: string
  teamId?: string
  status: ProjectStatus
  startDate?: string
  endDate?: string
  isArchived: boolean
  settings: Record<string, any>
  createdAt: string
  updatedAt: string
}

export enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export interface Team {
  id: string
  name: string
  description?: string
  avatarUrl?: string
  ownerId: string
  planType: string
  maxMembers: number
  settings: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface TeamMember {
  id: string
  teamId: string
  userId: string
  role: TeamRole
  permissions: Record<string, boolean>
  joinedAt: string
}

export enum TeamRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  GUEST = 'GUEST',
}

export interface Label {
  id: string
  name: string
  color: string
  projectId?: string
  createdBy: string
  createdAt: string
}

export interface Comment {
  id: string
  taskId: string
  userId: string
  content: string
  parentCommentId?: string
  createdAt: string
  updatedAt: string
}

export interface Attachment {
  id: string
  taskId: string
  uploadedBy: string
  filename: string
  originalFilename: string
  fileSize: number
  mimeType: string
  storagePath: string
  thumbnailPath?: string
  createdAt: string
}

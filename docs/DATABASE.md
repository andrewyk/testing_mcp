# Database Schema Documentation

## Overview

The Todo Application uses PostgreSQL 15+ for data persistence. The database schema is designed for scalability, performance, and data integrity.

## Entity Relationship Diagram

```
Users ──< Team_Members >── Teams
  │                           │
  │                           │
  └──< Projects ──────────────┘
       │
       │
       └──< Tasks ──< Task_Labels >── Labels
            │
            ├──< Comments
            ├──< Attachments
            └──< Activity_Logs

Notifications >── Users
```

## Tables

### users
Stores user account information.

**Columns:**
- `id` (UUID, PK) - Unique user identifier
- `email` (VARCHAR, UNIQUE) - User email address
- `username` (VARCHAR, UNIQUE) - Unique username
- `password_hash` (VARCHAR) - Hashed password
- `first_name` (VARCHAR) - User's first name
- `last_name` (VARCHAR) - User's last name
- `avatar_url` (TEXT) - URL to user's avatar image
- `timezone` (VARCHAR) - User's timezone (default: 'UTC')
- `locale` (VARCHAR) - User's locale (default: 'en-US')
- `email_verified` (BOOLEAN) - Email verification status
- `is_active` (BOOLEAN) - Account active status
- `created_at` (TIMESTAMP) - Account creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

**Indexes:**
- `idx_users_email` - On email field
- `idx_users_username` - On username field
- `idx_users_active` - On is_active field

### teams
Stores team information for collaboration.

**Columns:**
- `id` (UUID, PK) - Unique team identifier
- `name` (VARCHAR) - Team name
- `description` (TEXT) - Team description
- `avatar_url` (TEXT) - Team avatar URL
- `owner_id` (UUID, FK) - References users(id)
- `plan_type` (VARCHAR) - Subscription plan type
- `max_members` (INTEGER) - Maximum team members allowed
- `settings` (JSONB) - Team settings
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

**Indexes:**
- `idx_teams_owner` - On owner_id field

### team_members
Junction table for users and teams.

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `team_id` (UUID, FK) - References teams(id)
- `user_id` (UUID, FK) - References users(id)
- `role` (VARCHAR) - Member role (OWNER, ADMIN, MEMBER, GUEST)
- `permissions` (JSONB) - Custom permissions
- `joined_at` (TIMESTAMP) - Join timestamp

**Constraints:**
- UNIQUE(team_id, user_id)

**Indexes:**
- `idx_team_members_team` - On team_id field
- `idx_team_members_user` - On user_id field

### projects
Stores project information.

**Columns:**
- `id` (UUID, PK) - Unique project identifier
- `name` (VARCHAR) - Project name
- `description` (TEXT) - Project description
- `color` (VARCHAR) - Project color code
- `icon` (VARCHAR) - Project icon name
- `owner_id` (UUID, FK) - References users(id)
- `team_id` (UUID, FK) - References teams(id)
- `status` (VARCHAR) - Project status (ACTIVE, ON_HOLD, COMPLETED, ARCHIVED)
- `start_date` (DATE) - Project start date
- `end_date` (DATE) - Project end date
- `is_archived` (BOOLEAN) - Archive status
- `settings` (JSONB) - Project settings
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

**Indexes:**
- `idx_projects_owner` - On owner_id field
- `idx_projects_team` - On team_id field
- `idx_projects_status` - On status field
- `idx_projects_archived` - On is_archived field

### tasks
Stores task information.

**Columns:**
- `id` (UUID, PK) - Unique task identifier
- `title` (VARCHAR) - Task title
- `description` (TEXT) - Task description
- `project_id` (UUID, FK) - References projects(id)
- `parent_task_id` (UUID, FK) - References tasks(id) for subtasks
- `assignee_id` (UUID, FK) - References users(id)
- `creator_id` (UUID, FK) - References users(id)
- `status` (VARCHAR) - Task status (TODO, IN_PROGRESS, IN_REVIEW, COMPLETED, CANCELLED)
- `priority` (VARCHAR) - Task priority (LOW, MEDIUM, HIGH, URGENT)
- `due_date` (TIMESTAMP) - Task due date
- `start_date` (TIMESTAMP) - Task start date
- `completed_at` (TIMESTAMP) - Completion timestamp
- `estimated_time` (INTEGER) - Estimated time in minutes
- `actual_time` (INTEGER) - Actual time spent in minutes
- `position` (INTEGER) - Display order position
- `is_recurring` (BOOLEAN) - Recurring task flag
- `recurrence_rule` (JSONB) - Recurrence configuration
- `reminder_settings` (JSONB) - Reminder configuration
- `custom_fields` (JSONB) - Custom field values
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

**Indexes:**
- `idx_tasks_project` - On project_id field
- `idx_tasks_assignee` - On assignee_id field
- `idx_tasks_creator` - On creator_id field
- `idx_tasks_status` - On status field
- `idx_tasks_priority` - On priority field
- `idx_tasks_due_date` - On due_date field
- `idx_tasks_parent` - On parent_task_id field

### labels
Stores label/tag information.

**Columns:**
- `id` (UUID, PK) - Unique label identifier
- `name` (VARCHAR) - Label name
- `color` (VARCHAR) - Label color code
- `project_id` (UUID, FK) - References projects(id)
- `created_by` (UUID, FK) - References users(id)
- `created_at` (TIMESTAMP) - Creation timestamp

**Indexes:**
- `idx_labels_project` - On project_id field
- `idx_labels_creator` - On created_by field

### task_labels
Junction table for tasks and labels.

**Columns:**
- `task_id` (UUID, PK, FK) - References tasks(id)
- `label_id` (UUID, PK, FK) - References labels(id)

**Indexes:**
- `idx_task_labels_task` - On task_id field
- `idx_task_labels_label` - On label_id field

### comments
Stores task comments.

**Columns:**
- `id` (UUID, PK) - Unique comment identifier
- `task_id` (UUID, FK) - References tasks(id)
- `user_id` (UUID, FK) - References users(id)
- `content` (TEXT) - Comment content
- `parent_comment_id` (UUID, FK) - References comments(id) for threaded replies
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

**Indexes:**
- `idx_comments_task` - On task_id field
- `idx_comments_user` - On user_id field
- `idx_comments_parent` - On parent_comment_id field
- `idx_comments_created` - On created_at field (DESC)

### attachments
Stores file attachments for tasks.

**Columns:**
- `id` (UUID, PK) - Unique attachment identifier
- `task_id` (UUID, FK) - References tasks(id)
- `uploaded_by` (UUID, FK) - References users(id)
- `filename` (VARCHAR) - Stored filename
- `original_filename` (VARCHAR) - Original filename
- `file_size` (BIGINT) - File size in bytes
- `mime_type` (VARCHAR) - File MIME type
- `storage_path` (TEXT) - Storage location path
- `thumbnail_path` (TEXT) - Thumbnail path (for images)
- `created_at` (TIMESTAMP) - Upload timestamp

**Indexes:**
- `idx_attachments_task` - On task_id field
- `idx_attachments_uploader` - On uploaded_by field

### activity_logs
Stores audit trail of user actions.

**Columns:**
- `id` (UUID, PK) - Unique log identifier
- `user_id` (UUID, FK) - References users(id)
- `task_id` (UUID, FK) - References tasks(id)
- `project_id` (UUID, FK) - References projects(id)
- `action` (VARCHAR) - Action performed
- `entity_type` (VARCHAR) - Type of entity affected
- `entity_id` (UUID) - ID of affected entity
- `changes` (JSONB) - Record of changes made
- `metadata` (JSONB) - Additional metadata
- `created_at` (TIMESTAMP) - Action timestamp

**Indexes:**
- `idx_activity_user` - On user_id field
- `idx_activity_task` - On task_id field
- `idx_activity_project` - On project_id field
- `idx_activity_created` - On created_at field (DESC)

### notifications
Stores user notifications.

**Columns:**
- `id` (UUID, PK) - Unique notification identifier
- `user_id` (UUID, FK) - References users(id)
- `type` (VARCHAR) - Notification type
- `title` (VARCHAR) - Notification title
- `message` (TEXT) - Notification message
- `link` (TEXT) - Link to related resource
- `is_read` (BOOLEAN) - Read status
- `read_at` (TIMESTAMP) - Read timestamp
- `metadata` (JSONB) - Additional data
- `created_at` (TIMESTAMP) - Creation timestamp

**Indexes:**
- `idx_notifications_user` - On user_id field
- `idx_notifications_read` - On is_read field
- `idx_notifications_created` - On created_at field (DESC)

## Triggers

### update_updated_at_column
Automatically updates the `updated_at` column on record updates for:
- users
- teams
- projects
- tasks
- comments

## Performance Considerations

1. **Indexes**: All foreign keys and frequently queried columns have indexes
2. **JSONB**: Used for flexible schema fields (settings, custom_fields, metadata)
3. **Timestamps**: Indexed in descending order for efficient recent record queries
4. **UUIDs**: Used for primary keys to support distributed systems
5. **Cascade Deletes**: Configured to maintain referential integrity

## Backup and Maintenance

```bash
# Backup database
pg_dump todoapp > backup.sql

# Restore database
psql todoapp < backup.sql

# Vacuum and analyze
psql todoapp -c "VACUUM ANALYZE;"
```

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './database';

type Priority = 'high' | 'medium' | 'low' | 'none';
type Status = 'not_started' | 'in_progress' | 'waiting' | 'blocked' | 'completed';

interface TaskAttributes {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: Date;
  status: Status;
  isCompleted: boolean;
  completedAt?: Date;
  estimatedTime?: number;
  actualTime?: number;
  recurrence?: string;
  userId: string;
  projectId?: string;
  assigneeId?: string;
  parentTaskId?: string;
  position: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type TaskOptionalFields = 
  | 'id' 
  | 'description' 
  | 'dueDate' 
  | 'completedAt' 
  | 'estimatedTime' 
  | 'actualTime' 
  | 'recurrence' 
  | 'projectId' 
  | 'assigneeId' 
  | 'parentTaskId' 
  | 'createdAt' 
  | 'updatedAt';

interface TaskCreationAttributes extends Optional<TaskAttributes, TaskOptionalFields> {}

class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
  public id!: string;
  public title!: string;
  public description?: string;
  public priority!: Priority;
  public dueDate?: Date;
  public status!: Status;
  public isCompleted!: boolean;
  public completedAt?: Date;
  public estimatedTime?: number;
  public actualTime?: number;
  public recurrence?: string;
  public userId!: string;
  public projectId?: string;
  public assigneeId?: string;
  public parentTaskId?: string;
  public position!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Task.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    priority: {
      type: DataTypes.ENUM('high', 'medium', 'low', 'none'),
      defaultValue: 'none',
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('not_started', 'in_progress', 'waiting', 'blocked', 'completed'),
      defaultValue: 'not_started',
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    estimatedTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    actualTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    recurrence: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'projects',
        key: 'id',
      },
    },
    assigneeId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    parentTaskId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'tasks',
        key: 'id',
      },
    },
    position: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'tasks',
    hooks: {
      beforeUpdate: (task: Task) => {
        if (task.isCompleted && !task.completedAt) {
          task.completedAt = new Date();
        } else if (!task.isCompleted && task.completedAt) {
          task.completedAt = undefined;
        }
      },
    },
  }
);

export default Task;

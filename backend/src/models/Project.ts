import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './database';

interface ProjectAttributes {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  userId: string;
  parentId?: string;
  isArchived: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProjectCreationAttributes extends Optional<ProjectAttributes, 'id' | 'description' | 'icon' | 'parentId' | 'isArchived' | 'createdAt' | 'updatedAt'> {}

class Project extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
  public id!: string;
  public name!: string;
  public description?: string;
  public color!: string;
  public icon?: string;
  public userId!: string;
  public parentId?: string;
  public isArchived!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Project.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING,
      defaultValue: '#3b82f6',
    },
    icon: {
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
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'projects',
        key: 'id',
      },
    },
    isArchived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'projects',
  }
);

export default Project;

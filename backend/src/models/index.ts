import User from './User';
import Task from './Task';
import Project from './Project';
import Tag from './Tag';
import sequelize from './database';

// User associations
User.hasMany(Task, { foreignKey: 'userId', as: 'tasks' });
User.hasMany(Project, { foreignKey: 'userId', as: 'projects' });
User.hasMany(Tag, { foreignKey: 'userId', as: 'tags' });

// Task associations
Task.belongsTo(User, { foreignKey: 'userId', as: 'owner' });
Task.belongsTo(User, { foreignKey: 'assigneeId', as: 'assignee' });
Task.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
Task.belongsTo(Task, { foreignKey: 'parentTaskId', as: 'parentTask' });
Task.hasMany(Task, { foreignKey: 'parentTaskId', as: 'subtasks' });
Task.belongsToMany(Tag, { through: 'TaskTags', as: 'tags' });

// Project associations
Project.belongsTo(User, { foreignKey: 'userId', as: 'owner' });
Project.belongsTo(Project, { foreignKey: 'parentId', as: 'parent' });
Project.hasMany(Project, { foreignKey: 'parentId', as: 'subprojects' });
Project.hasMany(Task, { foreignKey: 'projectId', as: 'tasks' });

// Tag associations
Tag.belongsTo(User, { foreignKey: 'userId', as: 'owner' });
Tag.belongsToMany(Task, { through: 'TaskTags', as: 'tasks' });

export const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync models in development
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database models synchronized.');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

export { User, Task, Project, Tag, sequelize };

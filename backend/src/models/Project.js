// In-memory project storage (will be replaced with database in production)
const projects = [];
let projectIdCounter = 1;

class Project {
  constructor({
    name,
    description = '',
    color = '#3B82F6',
    icon = '📁',
    userId,
    parentId = null
  }) {
    this.id = projectIdCounter++;
    this.name = name;
    this.description = description;
    this.color = color;
    this.icon = icon;
    this.userId = userId;
    this.parentId = parentId;
    this.archived = false;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static create(projectData) {
    const project = new Project(projectData);
    projects.push(project);
    return project;
  }

  static findAll(userId) {
    return projects.filter(project => project.userId === userId && !project.archived);
  }

  static findById(id, userId) {
    return projects.find(project => project.id === parseInt(id) && project.userId === userId);
  }

  static update(id, userId, updates) {
    const projectIndex = projects.findIndex(
      project => project.id === parseInt(id) && project.userId === userId
    );
    if (projectIndex === -1) return null;

    projects[projectIndex] = {
      ...projects[projectIndex],
      ...updates,
      id: projects[projectIndex].id,
      createdAt: projects[projectIndex].createdAt,
      updatedAt: new Date()
    };
    return projects[projectIndex];
  }

  static delete(id, userId) {
    const projectIndex = projects.findIndex(
      project => project.id === parseInt(id) && project.userId === userId
    );
    if (projectIndex === -1) return false;

    projects.splice(projectIndex, 1);
    return true;
  }

  static archive(id, userId) {
    const project = this.findById(id, userId);
    if (!project) return null;
    
    return this.update(id, userId, { archived: true });
  }
}

export default Project;

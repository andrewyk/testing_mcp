import bcrypt from 'bcryptjs';

// In-memory user storage (will be replaced with database in production)
const users = [];
let userIdCounter = 1;

class User {
  constructor({ email, password, name, avatar = null }) {
    this.id = userIdCounter++;
    this.email = email;
    this.password = password; // Should be hashed
    this.name = name;
    this.avatar = avatar;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static async create({ email, password, name, avatar = null }) {
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      name,
      avatar
    });

    users.push(user);
    return user;
  }

  static findById(id) {
    return users.find(user => user.id === parseInt(id));
  }

  static findByEmail(email) {
    return users.find(user => user.email === email);
  }

  static findAll() {
    return users;
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Return user without password
  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

export default User;

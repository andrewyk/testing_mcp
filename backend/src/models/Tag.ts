import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './database';

interface TagAttributes {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TagCreationAttributes extends Optional<TagAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Tag extends Model<TagAttributes, TagCreationAttributes> implements TagAttributes {
  public id!: string;
  public name!: string;
  public color!: string;
  public userId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Tag.init(
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
    color: {
      type: DataTypes.STRING,
      defaultValue: '#6b7280',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'tags',
  }
);

export default Tag;

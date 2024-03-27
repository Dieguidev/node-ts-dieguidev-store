import { DataTypes, Model, Sequelize } from "sequelize";



export const USER_TABLE = 'users';

export const userSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING,
  },
};


 export class User extends Model {
  static associate() {
    // associate
  }

  static config(sequelize: Sequelize) {
    return {
      sequelize,
      tableName: USER_TABLE,
      modelName: 'User',
    }
  }
}




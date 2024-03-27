import { Sequelize } from "sequelize";
import { PostgresDataBase } from "../sequelize-database";
import { User, userSchema } from "./user.model";



export class SetupModels {
  public static init(sequelize: Sequelize) {
    User.init(userSchema,User.config(sequelize))
  }
}

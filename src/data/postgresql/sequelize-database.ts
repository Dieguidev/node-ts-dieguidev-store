import { Sequelize } from "sequelize";
import { envs } from "../../config";
import { SetupModels } from "./models/setupModels";



const user = encodeURIComponent(envs.POSTGRES_USER);
const password = encodeURIComponent(envs.POSTGRES_PASSWORD);
const uri = `postgres://${user}:${password}@${envs.POSTGRES_HOST}:${envs.POSTGRES_PORT}/${envs.POSTGRES_DB_NAME}`;




export class PostgresDataBase {
  static connect() {


    try {
      const sequelize = new Sequelize(uri, {
        dialect: 'postgres',
        logging: false
      });

      SetupModels.init(sequelize);


      console.log('Connected to postgres');
      return sequelize;
    } catch (error) {
      console.log('Postgres connection error');
      throw error;

    }
  }
}

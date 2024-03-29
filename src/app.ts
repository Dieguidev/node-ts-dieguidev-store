

import { envs } from './config';

import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';


(async()=> {
  main();
})();


async function main() {

  // await MongoDatabase.connect({
  //   dbName: envs.MONGO_DB_NAME,
  //   mongoUrl: envs.MONGO_URL,
  // });
  // PostgresDataBase.connect();

  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,

  });

  server.start();
}

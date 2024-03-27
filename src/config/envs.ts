import 'dotenv/config';
import { get } from 'env-var';


export const envs = {

  PORT: get('PORT').required().asPortNumber(),

  POSTGRES_USER: get('POSTGRES_USER').required().asString(),
  POSTGRES_PASSWORD: get('POSTGRES_PASSWORD').required().asString(),
  POSTGRES_HOST: get('POSTGRES_HOST').required().asString(),
  POSTGRES_PORT: get('POSTGRES_PORT').required().asPortNumber(),
  POSTGRES_DB_NAME: get('POSTGRES_DB_NAME').required().asString(),

  JWT_SECRET: get('JWT_SECRET').required().asString(),

  SEND_EMAIL: get('SEND_EMAIL').default('false').asBool(),
  MAILER_EMAIL: get('MAILER_EMAIL').required().asEmailString(),
  MAILER_SECRET_KEY: get('MAILER_SECRET_KEY').required().asString(),
  MAILER_SERVICE: get('MAILER_SERVICE').required().asString(),

  WEBSERVICE_URL: get('WEBSERVICE_URL').required().asString(),
}




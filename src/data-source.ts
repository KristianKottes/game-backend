import 'reflect-metadata';
import { config as configDotenv } from 'dotenv';
import { DataSource } from 'typeorm';

import envConfig from './config/env.config';

configDotenv();
const { database, nodeEnv } = envConfig();

// This data source is used by TypeORM cli
// eg. to run and generate migrations
export const AppDataSource = new DataSource({
  ...database,
  type: 'postgres',
  synchronize: false,
  logging: true,
  entities: [__dirname + '/**/*.entity.{js,ts}'],
  migrations: [__dirname + '/migrations/*.{ts}'],
  subscribers: [],
  ...(nodeEnv === 'production'
    ? {
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {}),
});
